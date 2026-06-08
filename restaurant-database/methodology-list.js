const LANGUAGE_STORAGE_KEY = "lera-ui-language";
const LEGACY_LANGUAGE_STORAGE_KEY = "restaurant-database-language";

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
    return stored === "zh" ? "zh" : "es";
  } catch {
    return "es";
  }
}

function persistLanguage(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_LANGUAGE_STORAGE_KEY, lang);
  } catch {}
}

const methodologyState = {
  items: [],
  apiAvailable: true,
  currentLang: getInitialLanguage()
};

const i18n = {
  zh: {
    htmlLang: "zh-CN",
    pageTitle: "Lera · 方法论使用列表",
    brandEyebrow: "Lera 方法论",
    brandTitle: "方法论使用列表",
    topEyebrow: "数据库总列表",
    topTitle: "方法论记录",
    backButton: "返回上一页",
    homeLink: "返回主页",
    backCatalog: "总表",
    snapshotTitle: "方法论快照",
    totalCountLabel: "当前记录数",
    latestUpdatedLabel: "最近编辑",
    sectionEyebrow: "访问与检索",
    sectionTitle: "方法论目录",
    searchLabel: "搜索名称 / 编码",
    searchPlaceholder: "",
    empty: "暂无记录",
    serviceUnavailable: "未连接",
    editRecord: "编辑",
    viewReport: "报告",
    viewDish: "菜品",
    deleteRecord: "删除",
    confirmDelete: "确定删除这条方法论记录吗？对应项目下的全部方法论版本都会一起删除。",
    deleteSuccess: "方法论记录已删除。",
    deleteFailed: "删除方法论记录失败。",
    currentStage: "当前阶段",
    currentStatus: "当前状态",
    linkedDishCode: "关联菜品编码",
    updatedAt: "最近编辑",
    noText: "-"
  },
  es: {
    htmlLang: "es",
    pageTitle: "Lera · Registros metodológicos",
    brandEyebrow: "Metodología Lera",
    brandTitle: "Listado metodológico",
    topEyebrow: "Base de datos general",
    topTitle: "Registros metodológicos",
    backButton: "Volver",
    homeLink: "Inicio",
    backCatalog: "Catálogo",
    snapshotTitle: "Resumen metodológico",
    totalCountLabel: "Número de registros",
    latestUpdatedLabel: "Última edición",
    sectionEyebrow: "Acceso y búsqueda",
    sectionTitle: "Catálogo metodológico",
    searchLabel: "Buscar nombre / código",
    searchPlaceholder: "Buscar por nombre del plato, código de proyecto o código de versión",
    empty: "Sin registros",
    serviceUnavailable: "Sin conexión",
    editRecord: "Editar",
    viewReport: "Informe",
    viewDish: "Plato",
    deleteRecord: "Eliminar",
    confirmDelete: "¿Quieres eliminar este registro metodológico? Se borrarán también todas las versiones metodológicas de este proyecto.",
    deleteSuccess: "El registro metodológico se ha eliminado.",
    deleteFailed: "No se pudo eliminar el registro metodológico.",
    currentStage: "Etapa actual",
    currentStatus: "Estado actual",
    linkedDishCode: "Código del plato vinculado",
    updatedAt: "Última edición",
    noText: "-"
  }
};

const methodologyListEl = document.getElementById("methodology-list");
const methodologyEmptyEl = document.getElementById("methodology-empty");

document.getElementById("methodology-search-input").addEventListener("input", renderMethodologyList);
document.getElementById("back-button").addEventListener("click", () => window.history.back());
document.getElementById("topbar-language-toggle").addEventListener("click", toggleLanguage);

initMethodologyList();

async function initMethodologyList() {
  const items = await fetchMethodologyList();
  methodologyState.apiAvailable = items !== null;
  methodologyState.items = items || [];
  renderLanguage();
  renderMethodologyList();
}

function t(key) {
  return i18n[methodologyState.currentLang][key];
}

function toggleLanguage() {
  methodologyState.currentLang = methodologyState.currentLang === "zh" ? "es" : "zh";
  persistLanguage(methodologyState.currentLang);
  renderLanguage();
  renderMethodologyList();
}

function renderLanguage() {
  document.documentElement.lang = t("htmlLang");
  document.title = t("pageTitle");
  setText("brand-eyebrow", t("brandEyebrow"));
  setText("brand-title", t("brandTitle"));
  setText("top-eyebrow", t("topEyebrow"));
  setText("top-title", t("topTitle"));
  setText("back-button", t("backButton"));
  setText("home-link", t("homeLink"));
  setText("back-catalog-link", t("backCatalog"));
  setText("snapshot-title", t("snapshotTitle"));
  setText("total-count-label", t("totalCountLabel"));
  setText("latest-updated-label", t("latestUpdatedLabel"));
  setText("section-eyebrow", t("sectionEyebrow"));
  setText("section-title", t("sectionTitle"));
  setText("search-label", t("searchLabel"));
  setText("topbar-language-toggle", "中 / Es");
  document.getElementById("methodology-search-input").placeholder = t("searchPlaceholder");
  methodologyEmptyEl.textContent = t("empty");
}

async function fetchMethodologyList() {
  try {
    const response = await fetch("/api/methodology");
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return null;
  }
}

function renderMethodologyList() {
  if (!methodologyState.apiAvailable) {
    methodologyListEl.innerHTML = "";
    methodologyEmptyEl.style.display = "block";
    methodologyEmptyEl.textContent = t("serviceUnavailable");
    document.getElementById("methodology-total-count").textContent = "0";
    return;
  }

  const search = document.getElementById("methodology-search-input").value.trim().toLowerCase();
  const items = methodologyState.items.filter((item) => {
    const fields = [item.dish_name, item.project_code, item.version_code, item.latest_formal_version_code, item.linked_dish_code, ...(item.version_codes || [])];
    return !search || fields.some((value) => String(value || "").toLowerCase().includes(search));
  });

  methodologyListEl.innerHTML = "";
  items.forEach((item) => {
    const secondaryCode = item.latest_formal_version_code || (item.version_code !== item.project_code ? item.version_code : "");
    const card = document.createElement("article");
    card.className = "catalog-card";
    card.innerHTML = `
      <div class="catalog-card-head">
        <div class="catalog-card-title">
          <span class="code-pill">${escapeHtml(item.project_code || t("noText"))}</span>
          <strong>${escapeHtml(item.dish_name || t("noText"))}</strong>
          <div class="support-copy">${escapeHtml(secondaryCode || t("noText"))}</div>
        </div>
        <div class="table-actions">
          <a class="secondary-button nav-link mini-button" href="${buildEditUrl(item)}">${t("editRecord")}</a>
          <a class="secondary-button nav-link mini-button" href="${buildReportUrl(item)}">${t("viewReport")}</a>
          ${item.linked_dish_code ? `<a class="secondary-button nav-link mini-button" href="./dish-detail.html?dishCode=${encodeURIComponent(item.linked_dish_code)}">${t("viewDish")}</a>` : ""}
          <button class="secondary-button mini-button" type="button" data-role="delete-methodology">${t("deleteRecord")}</button>
        </div>
      </div>
      <div class="catalog-card-meta">
        <div class="catalog-meta-block">
          <p class="eyebrow">${t("currentStage")}</p>
          <div class="catalog-recipe-summary">${escapeHtml(item.current_stage || t("noText"))}</div>
        </div>
        <div class="catalog-meta-block">
          <p class="eyebrow">${t("currentStatus")}</p>
          <div class="catalog-recipe-summary">${escapeHtml(item.current_status || t("noText"))}</div>
        </div>
        <div class="catalog-meta-block">
          <p class="eyebrow">${t("linkedDishCode")}</p>
          <div class="catalog-recipe-summary">${escapeHtml(item.linked_dish_code || t("noText"))}</div>
        </div>
        <div class="catalog-meta-block">
          <p class="eyebrow">${t("updatedAt")}</p>
          <div class="catalog-recipe-summary">${escapeHtml(formatDate(item.updated_at || item.created_at || ""))}</div>
        </div>
      </div>
    `;
    card.querySelector('[data-role="delete-methodology"]').addEventListener("click", async () => {
      if (!window.confirm(t("confirmDelete"))) return;
      await deleteMethodologyProject(item.project_code);
    });
    methodologyListEl.appendChild(card);
  });

  methodologyEmptyEl.style.display = items.length ? "none" : "block";
  document.getElementById("methodology-total-count").textContent = String(methodologyState.items.length);
  document.getElementById("methodology-latest-updated").textContent = items.length
    ? formatDate(items[0].updated_at || items[0].created_at || "")
    : t("noText");
}

function formatDate(value) {
  if (!value) return t("noText");
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(methodologyState.currentLang === "zh" ? "zh-CN" : "es-ES");
}

function buildReportUrl(item) {
  const params = new URLSearchParams({
    projectCode: item.project_code || ""
  });
  const versionCode = item.latest_formal_version_code || (item.version_code !== item.project_code ? item.version_code : "");
  if (versionCode) {
    params.set("versionCode", versionCode);
  }
  params.set("section", "content");
  return `./methodology-report.html?${params.toString()}`;
}

function buildEditUrl(item) {
  const params = new URLSearchParams({
    projectCode: item.project_code || ""
  });
  const versionCode = item.latest_formal_version_code || item.version_code || item.project_code || "";
  if (versionCode) {
    params.set("versionCode", versionCode);
  }
  return `../methodology.html?${params.toString()}`;
}

async function deleteMethodologyProject(projectCode) {
  try {
    const response = await fetch(`/api/methodology?project_code=${encodeURIComponent(projectCode)}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Delete failed");
    methodologyState.items = methodologyState.items.filter((item) => item.project_code !== projectCode);
    renderMethodologyList();
    window.alert(t("deleteSuccess"));
  } catch (error) {
    console.error(error);
    window.alert(t("deleteFailed"));
  }
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
