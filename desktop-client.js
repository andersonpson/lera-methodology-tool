(function setupDesktopClient() {
  const desktop = window.leraDesktop;
  if (!desktop?.request) return;

  const originalFetch = window.fetch.bind(window);

  function normalizeHeaders(headers) {
    if (!headers) return {};
    if (headers instanceof Headers) return Object.fromEntries(headers.entries());
    if (Array.isArray(headers)) return Object.fromEntries(headers);
    return { ...headers };
  }

  window.fetch = async function desktopFetch(input, init = {}) {
    const url = typeof input === "string" ? input : input?.url;
    if (typeof url === "string" && url.startsWith("/api/")) {
      const method = init.method || (typeof input !== "string" ? input?.method : "GET") || "GET";
      const headers = normalizeHeaders(init.headers || (typeof input !== "string" ? input?.headers : undefined));
      const body = init.body ?? null;
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
    return originalFetch(input, init);
  };
})();
