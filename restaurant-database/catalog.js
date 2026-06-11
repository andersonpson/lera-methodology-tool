const LANGUAGE_STORAGE_KEY = "lera-ui-language";
const LEGACY_LANGUAGE_STORAGE_KEY = "restaurant-database-language";

function getInitialLanguage() {
  return "es";
}

function persistLanguage() {}

const state = {
  dishes: [],
  subproducts: [],
  codebook: [],
  currentView: "dishes",
  apiAvailable: true,
  currentLang: getInitialLanguage()
};

const LOOSE_RECIPE_FOUNDATION_CODE = "FPR";

const i18n = {
  zh: {
    htmlLang: "zh-CN",
    pageTitle: "Lera · 数据库总列表",
    brandEyebrow: "Lera 方法论",
    brandTitle: "数据库总列表",
    topEyebrow: "数据库总列表",
    topTitle: "成品菜目录",
    backButton: "返回上一页",
    homeLink: "返回主页",
    entryLink: "新增菜品",
    methodologyLink: "方法论使用列表",
    codebookLink: "新增编码",
    snapshotTitle: "数据库快照",
    totalCountLabel: "当前菜品数",
    filteredCountLabel: "当前检索结果",
    catalogEyebrow: "访问与检索",
    sectionTitleDishes: "菜品目录",
    sectionTitleSubproducts: "副产品目录",
    viewDishes: "主菜数据库",
    viewSubproducts: "副产品数据库",
    searchLabel: "搜索名称 / 编码",
    searchPlaceholder: "",
    foundationFilterLabel: "F 检索",
    productFilterLabel: "P 检索",
    seasonFilterLabel: "季节",
    monthFilterLabel: "月份",
    allOption: "全部",
    emptyOption: "留空",
    emptyCatalog: "暂无菜品",
    emptySubproducts: "暂无副产品",
    confirmDelete: "确定删除这道已注册菜品吗？对应菜谱也会一起删除。",
    dishView: "查看",
    dishEdit: "编辑",
    dishDelete: "删除",
    dishClassification: "分类信息",
    dishMethodology: "方法论编码",
    dishRecipe: "菜谱",
    looseRecipeTag: "零散菜谱",
    subproductOpenRecipe: "菜谱",
    subproductViewDish: "主菜",
    serviceUnavailable: "未连接",
    noText: "-"
  },
  es: {
    htmlLang: "es",
    pageTitle: "Lera · Base de platos y recetas",
    brandEyebrow: "Metodología Lera",
    brandTitle: "Base de platos y recetas",
    topEyebrow: "Base de platos y recetas",
    topTitle: "Catálogo de platos",
    backButton: "Volver",
    homeLink: "Inicio",
    entryLink: "Añadir plato",
    methodologyLink: "Listado metodológico",
    codebookLink: "Añadir código",
    snapshotTitle: "Resumen de la base de datos",
    totalCountLabel: "Número de platos",
    filteredCountLabel: "Resultados filtrados",
    catalogEyebrow: "Acceso y búsqueda",
    sectionTitleDishes: "Catálogo de platos",
    sectionTitleSubproducts: "Catálogo de subproductos",
    viewDishes: "Base de platos",
    viewSubproducts: "Base de subproductos",
    searchLabel: "Buscar nombre / código",
    searchPlaceholder: "",
    foundationFilterLabel: "Filtro F",
    productFilterLabel: "Filtro P",
    seasonFilterLabel: "Temporada",
    monthFilterLabel: "Mes",
    allOption: "Todo",
    emptyOption: "Dejar vacío",
    emptyCatalog: "Sin platos",
    emptySubproducts: "Sin subproductos",
    confirmDelete: "¿Quieres eliminar este plato registrado? La receta vinculada también se borrará.",
    dishView: "Ver",
    dishEdit: "Editar",
    dishDelete: "Eliminar",
    dishClassification: "Clasificación",
    dishMethodology: "Código metodológico",
    dishRecipe: "Receta",
    looseRecipeTag: "Receta suelta",
    subproductOpenRecipe: "Receta",
    subproductViewDish: "Plato",
    serviceUnavailable: "Sin conexión",
    noText: "-"
  }
};

const filterMonthSelect = document.getElementById("filter-month");
const filterSeasonSelect = document.getElementById("filter-season");
const catalogBody = document.getElementById("catalog-body");
const catalogEmpty = document.getElementById("catalog-empty");
const foundationBuilder = document.getElementById("filter-foundation-builder");
const productBuilder = document.getElementById("filter-product-builder");

populateMonthOptions();
applyCatalogContext();
bindEvents();
init();

function applyCatalogContext() {
  const params = new URLSearchParams(window.location.search);
  state.currentView = params.get("view") === "subproducts" ? "subproducts" : "dishes";
}

async function init() {
  const [dishes, subproducts, codebook] = await Promise.all([fetchDishes(), fetchSubproducts(), fetchCodebook()]);
  state.apiAvailable = dishes !== null && subproducts !== null && codebook !== null;
  state.dishes = dishes || [];
  state.subproducts = subproducts || [];
  state.codebook = codebook || [];
  renderLanguage();
  renderFilterBuilders();
  render();
}

function bindEvents() {
  ["search-input", "filter-season", "filter-month"].forEach((id) => {
    document.getElementById(id).addEventListener("input", render);
    document.getElementById(id).addEventListener("change", render);
  });
  foundationBuilder.addEventListener("change", render);
  productBuilder.addEventListener("change", render);
  document.getElementById("view-dishes-button").addEventListener("click", () => switchView("dishes"));
  document.getElementById("view-subproducts-button").addEventListener("click", () => switchView("subproducts"));
  document.getElementById("back-button").addEventListener("click", () => window.history.back());
}

function t(key) {
  return i18n[state.currentLang][key];
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
  setText("entry-link", t("entryLink"));
  setText("methodology-link", t("methodologyLink"));
  setText("codebook-link", t("codebookLink"));
  setText("snapshot-title", t("snapshotTitle"));
  setText("total-count-label", t("totalCountLabel"));
  setText("filtered-count-label", t("filteredCountLabel"));
  setText("catalog-eyebrow", t("catalogEyebrow"));
  setText("view-dishes-button", t("viewDishes"));
  setText("view-subproducts-button", t("viewSubproducts"));
  setText("search-label", t("searchLabel"));
  setText("foundation-filter-label", t("foundationFilterLabel"));
  setText("product-filter-label", t("productFilterLabel"));
  setText("season-filter-label", t("seasonFilterLabel"));
  setText("month-filter-label", t("monthFilterLabel"));
  document.getElementById("search-input").placeholder = t("searchPlaceholder");
  renderSeasonOptions();
  document.getElementById("catalog-section-title").textContent =
    state.currentView === "dishes" ? t("sectionTitleDishes") : t("sectionTitleSubproducts");
  document.body.style.visibility = "visible";
}

async function fetchDishes() {
  try {
    const response = await fetch("/api/dishes");
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchSubproducts() {
  try {
    const response = await fetch("/api/subproducts");
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchCodebook() {
  try {
    const response = await fetch("/api/codebook");
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function populateMonthOptions() {
  for (let month = 1; month <= 12; month += 1) {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = String(month);
    filterMonthSelect.appendChild(option);
  }
}

function renderSeasonOptions() {
  const currentValue = filterSeasonSelect.value;
  filterSeasonSelect.innerHTML = `
    <option value="">${t("allOption")}</option>
    <option value="P">Primavera</option>
    <option value="V">Verano</option>
    <option value="O">Otoño</option>
    <option value="I">Invierno</option>
  `;
  filterSeasonSelect.value = currentValue;

  const currentMonth = filterMonthSelect.value;
  if (filterMonthSelect.options.length) {
    filterMonthSelect.options[0].textContent = t("allOption");
  }
  filterMonthSelect.value = currentMonth;
}

function switchView(view) {
  state.currentView = view;
  document.getElementById("catalog-section-title").textContent =
    view === "dishes" ? t("sectionTitleDishes") : t("sectionTitleSubproducts");
  render();
}

function renderFilterBuilders() {
  renderFoundationFilterBuilder();
  renderProductFilterBuilder();
}

function renderFoundationFilterBuilder() {
  const foundationRows = state.codebook
    .filter((item) => item.category === "foundation" && item.status === "active")
    .sort(compareCodebookRows);
  const parentRows = foundationRows.filter((item) => !item.parent_code);
  const previousValues = getSelectedFoundationFilters();
  foundationBuilder.innerHTML = "";

  parentRows.forEach((parent, index) => {
    const card = document.createElement("div");
    card.className = "foundation-card";
    card.innerHTML = `<div class="foundation-card-label">${escapeHtml(parent.code)}</div>`;

    const select = document.createElement("select");
    select.className = "foundation-segment";
    select.dataset.filterType = "foundation";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = t("emptyOption");
    select.appendChild(emptyOption);

    foundationRows
      .filter((item) => item.parent_code === parent.code)
      .forEach((item) => {
        const option = document.createElement("option");
        option.value = item.code;
        option.textContent = `${item.code} · ${state.currentLang === "zh" ? item.label_zh : item.label_es}`;
        select.appendChild(option);
      });

    if (previousValues[index]) select.value = previousValues[index];
    card.appendChild(select);
    foundationBuilder.appendChild(card);
  });
}

function renderProductFilterBuilder() {
  const productRows = state.codebook
    .filter((item) => item.category === "product" && item.status === "active" && item.parent_code)
    .sort(compareCodebookRows);
  const previousValues = getSelectedProductFilters();
  productBuilder.innerHTML = "";

  for (let index = 0; index < 2; index += 1) {
    const card = document.createElement("div");
    card.className = "foundation-card";
    card.innerHTML = `<div class="foundation-card-label">P${index + 1}</div>`;

    const select = document.createElement("select");
    select.className = "foundation-segment";
    select.dataset.filterType = "product";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = t("emptyOption");
    select.appendChild(emptyOption);

    productRows.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.code;
      option.textContent = `${item.code} · ${state.currentLang === "zh" ? item.label_zh : item.label_es}`;
      select.appendChild(option);
    });

    if (previousValues[index]) select.value = previousValues[index];
    card.appendChild(select);
    productBuilder.appendChild(card);
  }
}

function compareCodebookRows(a, b) {
  return a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: "base" });
}

function normalizeCodePart(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9-]/g, "");
}

function getSelectedFoundationFilters() {
  return [...foundationBuilder.querySelectorAll("select")]
    .map((select) => normalizeCodePart(select.value))
    .filter(Boolean);
}

function getSelectedProductFilters() {
  return [...productBuilder.querySelectorAll("select")]
    .map((select) => normalizeCodePart(select.value))
    .filter(Boolean);
}

function matchesCodeFilters(record) {
  const selectedFoundation = getSelectedFoundationFilters();
  const selectedProduct = getSelectedProductFilters();
  const foundationCode = normalizeCodePart(record.foundation_code || "");
  const productCode = normalizeCodePart(record.product_code || "");

  const matchesFoundation = selectedFoundation.every((code) => foundationCode.includes(code));
  const matchesProduct = selectedProduct.every((code) => productCode.includes(code));
  return matchesFoundation && matchesProduct;
}

function getFilteredItems() {
  const search = document.getElementById("search-input").value.trim().toLowerCase();
  const season = document.getElementById("filter-season").value;
  const month = document.getElementById("filter-month").value;
  const source = state.currentView === "dishes" ? state.dishes : state.subproducts;

  return [...source]
    .filter((item) => {
      const searchFields =
        state.currentView === "dishes"
          ? [item.dish_code, item.dish_name, item.notes]
          : [item.module_name, item.dish_name, item.dish_code];
      const matchesSearch = !search || searchFields.some((value) => String(value || "").toLowerCase().includes(search));
      const matchesSeason = !season || item.season_code === season;
      const matchesMonth = !month || String(item.month_no) === month;
      return matchesSearch && matchesSeason && matchesMonth && matchesCodeFilters(item);
    })
    .sort(compareItems);
}

function compareItems(a, b) {
  return (
    Number(a.year_code || 0) - Number(b.year_code || 0) ||
    String(a.foundation_code || "").localeCompare(String(b.foundation_code || "")) ||
    String(a.product_code || "").localeCompare(String(b.product_code || "")) ||
    String(a.season_code || "").localeCompare(String(b.season_code || "")) ||
    Number(a.month_no || 0) - Number(b.month_no || 0) ||
    Number(a.seq_no || 0) - Number(b.seq_no || 0)
  );
}

function render() {
  if (!state.apiAvailable) {
    catalogBody.innerHTML = "";
    catalogEmpty.style.display = "block";
    catalogEmpty.textContent = t("serviceUnavailable");
    document.getElementById("total-count").textContent = "-";
    document.getElementById("filtered-count").textContent = "-";
    return;
  }

  const items = getFilteredItems();
  catalogBody.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "catalog-card";
    card.innerHTML = state.currentView === "dishes" ? renderDishCard(item) : renderSubproductCard(item);
    catalogBody.appendChild(card);
  });

  catalogBody.querySelectorAll("[data-delete-code]").forEach((button) => {
    button.addEventListener("click", () => deleteDish(button.dataset.deleteCode));
  });

  document.getElementById("view-dishes-button").classList.toggle("is-active", state.currentView === "dishes");
  document.getElementById("view-subproducts-button").classList.toggle("is-active", state.currentView === "subproducts");
  catalogEmpty.style.display = items.length ? "none" : "block";
  catalogEmpty.textContent = state.currentView === "dishes" ? t("emptyCatalog") : t("emptySubproducts");
  document.getElementById("total-count").textContent = String(state.currentView === "dishes" ? state.dishes.length : state.subproducts.length);
  document.getElementById("filtered-count").textContent = String(items.length);
}

function renderDishCard(dish) {
  const isLooseRecipe = String(dish.foundation_code || "").includes(LOOSE_RECIPE_FOUNDATION_CODE);
  return `
    <div class="catalog-card-head">
      <div class="catalog-card-title">
        <span class="code-pill">${escapeHtml(dish.dish_code)}</span>
        ${isLooseRecipe ? `<span class="code-pill">${escapeHtml(t("looseRecipeTag"))}</span>` : ""}
        <strong>${escapeHtml(dish.dish_name)}</strong>
        <div class="support-copy">${escapeHtml(dish.notes || t("noText"))}</div>
      </div>
      <div class="table-actions">
        <a class="secondary-button nav-link mini-button" href="${buildDetailUrl(dish)}">${t("dishView")}</a>
        <a class="secondary-button nav-link mini-button" href="${buildEntryUrl(dish)}">${t("dishEdit")}</a>
        <button class="secondary-button mini-button" type="button" data-delete-code="${escapeHtml(dish.dish_code)}">${t("dishDelete")}</button>
      </div>
    </div>
    <div class="catalog-card-meta">
      <div class="catalog-meta-block">
        <p class="eyebrow">${t("dishClassification")}</p>
        <div class="pill-row">
          <span class="code-pill">F ${escapeHtml(dish.foundation_code)}</span>
          <span class="code-pill">P ${escapeHtml(dish.product_code)}</span>
          <span class="code-pill">E ${escapeHtml(dish.season_code)}</span>
          <span class="code-pill">M ${escapeHtml(String(dish.month_no))}</span>
        </div>
      </div>
      <div class="catalog-meta-block">
        <p class="eyebrow">${t("dishMethodology")}</p>
        <div class="catalog-methodology">
          ${renderMethodologyLink(dish.methodology_main_code, dish.methodology_version_code)}
        </div>
      </div>
      <div class="catalog-meta-block">
        <p class="eyebrow">${t("dishRecipe")}</p>
        <div class="catalog-recipe-summary">${formatMultiline(dish.recipe_text)}</div>
      </div>
    </div>
  `;
}

function renderSubproductCard(item) {
  return `
    <div class="catalog-card-head">
      <div class="catalog-card-title subproduct-card-title">
        <strong class="subproduct-name">${escapeHtml(item.module_name || t("noText"))}</strong>
        <div class="support-copy subproduct-parent-name">${escapeHtml(item.dish_name || t("noText"))}</div>
        <div class="support-copy subproduct-parent-code">${escapeHtml(item.dish_code || t("noText"))}</div>
      </div>
      <div class="table-actions">
        <a class="secondary-button nav-link mini-button" href="${buildRecipeUrl(item)}">${t("subproductOpenRecipe")}</a>
        <a class="secondary-button nav-link mini-button" href="${buildDetailUrl(item)}">${t("subproductViewDish")}</a>
      </div>
    </div>
  `;
}

function renderMethodologyLink(mainCode, versionCode) {
  if (!mainCode) {
    return `<strong>${escapeHtml(t("noText"))}</strong>`;
  }
  const secondaryCode = versionCode && versionCode !== mainCode ? versionCode : "";
  return `
    <a class="methodology-inline-link" href="${buildMethodologyReportUrl({ methodology_main_code: mainCode, methodology_version_code: secondaryCode })}">
      <strong>${escapeHtml(mainCode)}</strong>
      <span class="support-copy">${escapeHtml(secondaryCode || t("noText"))}</span>
    </a>
  `;
}

function formatMultiline(text) {
  if (!text) return `<span class="support-copy">${t("noText")}</span>`;
  return escapeHtml(text).replaceAll("\n", "<br>");
}

function buildDetailUrl(item) {
  const params = new URLSearchParams({
    dishCode: item.dish_code || ""
  });
  return `./dish-detail.html?${params.toString()}`;
}

function buildEntryUrl(dish) {
  const params = new URLSearchParams({
    entryMode: "manual",
    editMode: "1",
    originalDishCode: dish.dish_code || "",
    draftKey: dish.draft_key || "",
    dishName: dish.dish_name || "",
    methodologyMainCode: dish.methodology_main_code || "",
    methodologyVersionCode: dish.methodology_version_code || "",
    foundationCode: dish.foundation_code || "",
    productCode: dish.product_code || "",
    yearCode: String(dish.year_code || ""),
    seasonCode: dish.season_code || "",
    monthNo: String(dish.month_no || ""),
    seqNo: String(dish.seq_no || ""),
    notes: dish.notes || ""
  });
  return `./index.html?${params.toString()}`;
}

function buildRecipeUrl(item) {
  const params = new URLSearchParams({
    draftKey: item.draft_key || "",
    title: item.dish_name || "",
    code: item.dish_code || "",
    methodologyMainCode: item.methodology_main_code || "",
    methodologyVersionCode: item.methodology_version_code && item.methodology_version_code !== item.methodology_main_code ? item.methodology_version_code : "",
    foundationCode: item.foundation_code || "",
    productCode: item.product_code || "",
    seasonCode: item.season_code || "",
    monthNo: String(item.month_no || ""),
    returnTo: "catalog",
    catalogView: "subproducts"
  });
  return `./menu-entry-template.html?${params.toString()}`;
}

function buildMethodologyReportUrl(item) {
  const params = new URLSearchParams({
    projectCode: item.methodology_main_code || item.project_code || ""
  });
  const versionCode = item.methodology_version_code || item.version_code || "";
  const eventCode = item.methodology_event_code || item.event_code || "";
  if (versionCode && versionCode !== params.get("projectCode")) {
    params.set("versionCode", versionCode);
  }
  if (eventCode) {
    params.set("eventCode", eventCode);
    params.set("section", eventCode.startsWith("Cam-") ? "changes" : "tools");
  } else {
    params.set("section", "content");
  }
  return `./methodology-report.html?${params.toString()}`;
}

async function deleteDish(dishCode) {
  if (!window.confirm(t("confirmDelete"))) return;

  const response = await fetch(`/api/dishes?dish_code=${encodeURIComponent(dishCode)}`, {
    method: "DELETE"
  });

  if (!response.ok) return;
  state.dishes = await fetchDishes();
  state.subproducts = await fetchSubproducts();
  render();
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
