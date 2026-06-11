(function setupDesktopClient() {
  const desktop = window.leraDesktop;
  const API_ORIGIN_STORAGE_KEY = "lera-api-origin";
  const FILE_FALLBACK_API_ORIGINS = ["http://127.0.0.1:8080", "http://43.134.115.245:8080"];
  const originalFetch = window.fetch.bind(window);

  function normalizeHeaders(headers) {
    if (!headers) return {};
    if (headers instanceof Headers) return Object.fromEntries(headers.entries());
    if (Array.isArray(headers)) return Object.fromEntries(headers);
    return { ...headers };
  }

  function normalizeOrigin(origin) {
    return typeof origin === "string" ? origin.trim().replace(/\/+$/, "") : "";
  }

  function getStoredApiOrigin() {
    try {
      return normalizeOrigin(window.localStorage.getItem(API_ORIGIN_STORAGE_KEY));
    } catch {
      return "";
    }
  }

  function persistApiOrigin(origin) {
    const normalized = normalizeOrigin(origin);
    if (!normalized) return;
    try {
      window.localStorage.setItem(API_ORIGIN_STORAGE_KEY, normalized);
    } catch {}
  }

  function getApiOriginCandidates() {
    const candidates = [];

    function pushCandidate(origin) {
      const normalized = normalizeOrigin(origin);
      if (!normalized || candidates.includes(normalized)) return;
      candidates.push(normalized);
    }

    pushCandidate(getStoredApiOrigin());

    if (/^https?:$/.test(window.location.protocol)) {
      pushCandidate(window.location.origin);
      pushCandidate(`${window.location.protocol}//${window.location.hostname}:8080`);
    }

    FILE_FALLBACK_API_ORIGINS.forEach(pushCandidate);
    return candidates;
  }

  function toAbsoluteApiUrl(url, origin) {
    if (typeof url !== "string" || !url.startsWith("/api/")) return url;
    const normalizedOrigin = normalizeOrigin(origin);
    return normalizedOrigin ? `${normalizedOrigin}${url}` : url;
  }

  function getServerNextPath() {
    if (window.location.protocol === "file:") {
      return "/";
    }
    const pathname = window.location.pathname || "/";
    const search = window.location.search || "";
    return `${pathname}${search}`;
  }

  async function handleUnauthorizedResponse(response, origin) {
    if (!response || response.status !== 401) {
      return response;
    }

    const loginBase = normalizeOrigin(origin) || normalizeOrigin(window.location.origin);
    if (!loginBase) {
      return response;
    }

    let loginUrl = new URL("/login", loginBase);

    try {
      const payload = await response.clone().json();
      if (payload?.login_url) {
        loginUrl = new URL(payload.login_url, loginBase);
      }
    } catch {}

    if (!loginUrl.searchParams.has("next")) {
      loginUrl.searchParams.set("next", getServerNextPath());
    }

    const onLoginPage = window.location.pathname === "/login";
    if (!onLoginPage) {
      window.location.assign(loginUrl.toString());
    }

    return response;
  }

  window.fetch = async function desktopFetch(input, init = {}) {
    const url = typeof input === "string" ? input : input?.url;

    if (typeof url === "string" && url.startsWith("/api/")) {
      const method = init.method || (typeof input !== "string" ? input?.method : "GET") || "GET";
      const upperMethod = String(method).toUpperCase();
      const headers = normalizeHeaders(init.headers || (typeof input !== "string" ? input?.headers : undefined));
      const body = init.body ?? null;

      if (desktop?.request) {
        const response = await desktop.request({ url, method, headers, body });
        const contentType =
          response?.headers?.["Content-Type"] ||
          response?.headers?.["content-type"] ||
          "application/json; charset=utf-8";
        const payload =
          typeof response?.body === "string" ? response.body : JSON.stringify(response?.body ?? {});
        return new Response(payload, {
          status: response?.status || 200,
          headers: { "Content-Type": contentType }
        });
      }

      let lastError = null;
      let lastResponse = null;

      for (const origin of getApiOriginCandidates()) {
        try {
          const response = await originalFetch(toAbsoluteApiUrl(url, origin), {
            ...init,
            method,
            headers,
            body,
            credentials: "include"
          });

          if (response.ok) {
            persistApiOrigin(origin);
            return response;
          }

          if (response.status === 401) {
            persistApiOrigin(origin);
            return handleUnauthorizedResponse(response, origin);
          }

          lastResponse = response;

          if (upperMethod !== "GET" && upperMethod !== "HEAD") {
            continue;
          }

          lastError = new Error(`API request failed at ${origin}${url} with status ${response.status}`);
        } catch (error) {
          lastError = error;
        }
      }

      if (lastResponse) {
        return lastResponse;
      }

      if (lastError) {
        throw lastError;
      }
    }

    return originalFetch(input, init);
  };
})();
