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

const state = {
  dish: null,
  recipe: null,
  currentLang: getInitialLanguage()
};

const i18n = {
  zh: {
    htmlLang: "zh-CN",
    pageTitle: "Lera · 菜品详情",
    brandEyebrow: "Lera 方法论",
    brandTitle: "已注册菜品",
    topEyebrow: "菜品详情",
    topTitle: "注册内容",
    printDocumentTitle: "菜品详情",
    printDishNameLabel: "菜品名称",
    printDishCodeLabel: "菜品编码",
    backButton: "返回上一页",
    homeLink: "返回主页",
    backCatalog: "总表",
    printDish: "打印",
    printFailed: "打印未能启动，请重试。",
    editDish: "编辑",
    deleteDish: "删除",
    deleteConfirm: "确定删除这道已注册菜品吗？对应菜谱也会一起删除。",
    deleteFailed: "删除失败。",
    snapshotTitle: "基础信息",
    photoTitle: "出品参考图",
    modulesEyebrow: "制作组成",
    modulesTitle: "原料与步骤",
    planTitle: "生产计划",
    planBefore: "服务之前",
    planDay: "服务当天",
    notesTitle: "注意事项",
    allergensTitle: "过敏原",
    methodologyRecordsTitle: "方法论使用记录",
    noMethodologyRecords: "暂无记录",
    noData: "未找到",
    noRecipe: "暂无菜谱",
    noNotes: "暂无备注",
    noAllergens: "未标记",
    fieldDishCode: "菜品编码",
    fieldDishName: "菜品名称",
    fieldFoundation: "创意基础 F",
    fieldProduct: "原料类别 P",
    fieldSeasonMonth: "季节 / 月份",
    fieldMethodology: "方法论编码",
    fieldUpdated: "最近更新时间",
    ingredientBlock: "原料",
    stepBlock: "步骤",
    emptyModule: "暂无内容",
    viewReport: "报告"
  },
  es: {
    htmlLang: "es",
    pageTitle: "Lera · Detalle del plato",
    brandEyebrow: "Metodología Lera",
    brandTitle: "Detalle del plato registrado",
    topEyebrow: "Detalle del plato",
    topTitle: "Contenido registrado",
    printDocumentTitle: "Detalle del plato",
    printDishNameLabel: "Nombre del plato",
    printDishCodeLabel: "Código del plato",
    backButton: "Volver",
    homeLink: "Inicio",
    backCatalog: "Catálogo",
    printDish: "Imprimir",
    printFailed: "No se pudo iniciar la impresión. Inténtalo de nuevo.",
    editDish: "Editar",
    deleteDish: "Eliminar",
    deleteConfirm: "¿Quieres eliminar este plato registrado? La receta vinculada también se borrará.",
    deleteFailed: "No se pudo eliminar.",
    snapshotTitle: "Información básica",
    photoTitle: "Imagen de referencia del plato",
    modulesEyebrow: "Componentes",
    modulesTitle: "Ingredientes y elaboración",
    planTitle: "Plan de producción",
    planBefore: "Antes del servicio",
    planDay: "Día del servicio",
    notesTitle: "Observaciones",
    allergensTitle: "Alérgenos",
    methodologyRecordsTitle: "Registros metodológicos",
    noMethodologyRecords: "Sin registros",
    noData: "No encontrado",
    noRecipe: "Sin receta",
    noNotes: "Sin notas",
    noAllergens: "Sin marcar",
    fieldDishCode: "Código del plato",
    fieldDishName: "Nombre del plato",
    fieldFoundation: "Fundamento creativo F",
    fieldProduct: "Materia prima P",
    fieldSeasonMonth: "Temporada / Mes",
    fieldMethodology: "Código metodológico",
    fieldUpdated: "Última actualización",
    ingredientBlock: "Ingredientes",
    stepBlock: "Pasos",
    emptyModule: "Sin contenido",
    viewReport: "Informe"
  }
};

const params = new URLSearchParams(window.location.search);
const dishCode = params.get("dishCode") || "";

bindEvents();
init();

async function init() {
  if (!dishCode) {
    document.getElementById("basic-info-grid").innerHTML = `<div class="support-copy">${t("noData")}</div>`;
    renderLanguage();
    return;
  }

  const dish = await fetchDish(dishCode);
  if (!dish || !dish.dish_code) {
    renderLanguage();
    document.getElementById("basic-info-grid").innerHTML = `<div class="support-copy">${t("noData")}</div>`;
    return;
  }

  state.dish = dish;
  state.recipe = dish.draft_key ? await fetchRecipe(dish.draft_key) : null;
  renderLanguage();
  render();
}

function bindEvents() {
  ["language-toggle", "topbar-language-toggle"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.addEventListener("click", toggleLanguage);
  });
  document.getElementById("back-button").addEventListener("click", () => window.history.back());
  document.getElementById("print-dish-button").addEventListener("click", async () => {
    document.title = getDishDetailWindowTitle();
    if (window.leraDesktop?.printCurrentWindow) {
      const result = await window.leraDesktop.printCurrentWindow();
      if (result?.status === "printed") return;
    }
    try {
      window.print();
    } catch (error) {
      console.error(error);
      window.alert(t("printFailed"));
    }
  });
  document.getElementById("delete-dish-button").addEventListener("click", deleteDish);
}

function toggleLanguage() {
  state.currentLang = state.currentLang === "zh" ? "es" : "zh";
  persistLanguage(state.currentLang);
  renderLanguage();
  render();
}

async function fetchDish(code) {
  const response = await fetch(`/api/dishes?dish_code=${encodeURIComponent(code)}`);
  if (!response.ok) return null;
  return await response.json();
}

async function fetchRecipe(draftKey) {
  const response = await fetch(`/api/recipe?draft_key=${encodeURIComponent(draftKey)}`);
  if (!response.ok) return null;
  const payload = await response.json();
  return payload && Object.keys(payload).length ? payload : null;
}

function renderLanguage() {
  const copy = i18n[state.currentLang];
  document.documentElement.lang = copy.htmlLang;
  document.title = getDishDetailWindowTitle();
  setText("brand-eyebrow", copy.brandEyebrow);
  setText("brand-title", copy.brandTitle);
  setText("top-eyebrow", copy.topEyebrow);
  setText("top-title", copy.topTitle);
  setText("print-brand", copy.brandEyebrow);
  setText("print-document-title", copy.printDocumentTitle);
  setText("print-dish-name-label", copy.printDishNameLabel);
  setText("print-dish-code-label", copy.printDishCodeLabel);
  setText("back-button", copy.backButton);
  setText("home-link", copy.homeLink);
  setText("back-catalog-link", copy.backCatalog);
  setText("print-dish-button", copy.printDish);
  setText("edit-dish-link", copy.editDish);
  setText("delete-dish-button", copy.deleteDish);
  setText("snapshot-title", copy.snapshotTitle);
  setText("photo-title", copy.photoTitle);
  setText("modules-eyebrow", copy.modulesEyebrow);
  setText("modules-title", copy.modulesTitle);
  setText("plan-title", copy.planTitle);
  setText("plan-before-label", copy.planBefore);
  setText("plan-day-label", copy.planDay);
  setText("notes-title", copy.notesTitle);
  setText("allergens-title", copy.allergensTitle);
  setText("methodology-records-title", copy.methodologyRecordsTitle);
  setText("topbar-language-toggle", "中 / Es");
}

function render() {
  if (!state.dish) return;

  document.title = getDishDetailWindowTitle();
  document.getElementById("edit-dish-link").href = buildEntryUrl(state.dish);
  document.getElementById("print-dish-name-value").textContent = state.dish.dish_name || "-";
  document.getElementById("print-dish-code-value").textContent = state.dish.dish_code || "-";
  renderBasicInfo();
  renderPhoto();
  renderModules();
  renderSideInfo();
}

function getDishDetailWindowTitle() {
  const dishName = state.dish?.dish_name?.trim();
  return dishName ? `${dishName} · ${i18n[state.currentLang].topTitle}` : i18n[state.currentLang].pageTitle;
}

function renderBasicInfo() {
  const copy = i18n[state.currentLang];
  const dish = state.dish;
  const grid = document.getElementById("basic-info-grid");
  const methodologyLink = dish.methodology_main_code
    ? `<a class="methodology-inline-link" href="${buildMethodologyReportUrl({
        methodology_main_code: dish.methodology_main_code,
        methodology_version_code: dish.methodology_version_code
      })}"><strong>${escapeHtml(dish.methodology_main_code)}</strong><span class="support-copy">${escapeHtml(
        dish.methodology_version_code && dish.methodology_version_code !== dish.methodology_main_code ? dish.methodology_version_code : "-"
      )}</span></a>`
    : `<input value="${escapeHtmlAttr(`${dish.methodology_main_code || "-"} / ${dish.methodology_version_code || "-"}`)}" readonly />`;
  grid.innerHTML = `
    <label><span>${copy.fieldDishCode}</span><input value="${escapeHtmlAttr(dish.dish_code)}" readonly /></label>
    <label><span>${copy.fieldDishName}</span><input value="${escapeHtmlAttr(dish.dish_name)}" readonly /></label>
    <label><span>${copy.fieldFoundation}</span><input value="${escapeHtmlAttr(dish.foundation_code)}" readonly /></label>
    <label><span>${copy.fieldProduct}</span><input value="${escapeHtmlAttr(dish.product_code)}" readonly /></label>
    <label><span>${copy.fieldSeasonMonth}</span><input value="${escapeHtmlAttr(`${dish.season_code} / ${dish.month_no}`)}" readonly /></label>
    <label><span>${copy.fieldMethodology}</span>${methodologyLink}</label>
    <label class="span-all"><span>${copy.fieldUpdated}</span><input value="${escapeHtmlAttr(dish.updated_at || "-")}" readonly /></label>
  `;
}

function renderPhoto() {
  const image = document.getElementById("detail-photo-image");
  const photoData = state.recipe?.payload_json?.photoData || "";
  if (!photoData) {
    image.hidden = true;
    image.removeAttribute("src");
    return;
  }

  image.src = photoData;
  image.hidden = false;
}

function renderModules() {
  const container = document.getElementById("modules-list");
  container.innerHTML = "";

  const modules = Array.isArray(state.recipe?.payload_json?.modules) ? state.recipe.payload_json.modules : [];
  if (!modules.length) {
    container.innerHTML = `<div class="dashboard-card"><div class="support-copy">${t("noRecipe")}</div></div>`;
    return;
  }

  modules.forEach((module, index) => {
    const ingredients = Array.isArray(module.ingredients) && module.ingredients.length
      ? module.ingredients.map((item) => `<li>${escapeHtml(`${item.product || "-"} / ${item.quantity || "-"} / ${item.unit || "-"}`)}</li>`).join("")
      : `<li>${t("emptyModule")}</li>`;
    const steps = Array.isArray(module.steps) && module.steps.length
      ? module.steps
          .map((item, stepIndex) => {
            const text = typeof item === "string" ? item : item?.text || "";
            return `<li>${stepIndex + 1}. ${escapeHtml(text || "-")}</li>`;
          })
          .join("")
      : `<li>${t("emptyModule")}</li>`;

    const card = document.createElement("article");
    card.className = "dashboard-card recipe-module-card";
    card.innerHTML = `
      <div class="recipe-module-head">
        <h3>${escapeHtml(module.name || `${t("modulesEyebrow")} ${index + 1}`)}</h3>
      </div>
      <div class="recipe-module-section">
        <div>
          <p class="eyebrow">${t("ingredientBlock")}</p>
          <ul class="recipe-module-list">${ingredients}</ul>
        </div>
        <div>
          <p class="eyebrow">${t("stepBlock")}</p>
          <ul class="recipe-module-list">${steps}</ul>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderSideInfo() {
  const payload = state.recipe?.payload_json || {};
  document.getElementById("plan-before-value").textContent = payload.planBefore || "-";
  document.getElementById("plan-day-value").textContent = payload.planDay || "-";
  document.getElementById("notes-value").textContent = payload.notes || state.dish.notes || t("noNotes");

  const markedAllergens = Object.entries(payload.allergens || {})
    .filter(([, checked]) => checked)
    .map(([key]) => formatAllergen(key));
  document.getElementById("allergens-value").textContent = markedAllergens.join(" / ") || t("noAllergens");
  const methodologyRecords = Array.isArray(state.dish.methodology_records) ? state.dish.methodology_records : [];
  document.getElementById("methodology-records-value").innerHTML = methodologyRecords.length
    ? methodologyRecords
        .map((item) => `
          <div class="methodology-record-link-row">
            <span>${escapeHtml(formatMethodologyRecord(item))}</span>
            <a class="secondary-button nav-link mini-button" href="${buildMethodologyReportUrl(item)}">${escapeHtml(t("viewReport"))}</a>
          </div>
        `)
        .join("")
    : t("noMethodologyRecords");
  document.getElementById("plan-before-value").className = "detail-copy";
  document.getElementById("plan-day-value").className = "detail-copy";
  document.getElementById("notes-value").className = "detail-copy detail-notes";
  document.getElementById("allergens-value").className = "detail-copy";
  document.getElementById("methodology-records-value").className = "detail-copy";
}

function formatAllergen(key) {
  const labels = {
    gluten: { zh: "含麸质谷物", es: "Cereales con gluten" },
    crustaceans: { zh: "甲壳类", es: "Crustáceos" },
    eggs: { zh: "蛋", es: "Huevos" },
    fish: { zh: "鱼", es: "Pescado" },
    peanuts: { zh: "花生", es: "Cacahuetes" },
    soy: { zh: "大豆", es: "Soja" },
    milk: { zh: "乳", es: "Leche" },
    nuts: { zh: "坚果", es: "Frutos de cáscara" },
    celery: { zh: "芹菜", es: "Apio" },
    mustard: { zh: "芥末", es: "Mostaza" },
    sesame: { zh: "芝麻", es: "Sésamo" },
    sulfites: { zh: "亚硫酸盐", es: "Sulfitos" },
    lupin: { zh: "羽扇豆", es: "Altramuces" },
    molluscs: { zh: "软体动物", es: "Moluscos" }
  };
  return labels[key] ? labels[key][state.currentLang] : key;
}

async function deleteDish() {
  if (!state.dish) return;
  if (!window.confirm(t("deleteConfirm"))) return;

  const response = await fetch(`/api/dishes?dish_code=${encodeURIComponent(state.dish.dish_code)}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    window.alert(t("deleteFailed"));
    return;
  }

  window.location.href = "./catalog.html";
}

function buildEntryUrl(dish) {
  const params = new URLSearchParams({
    entryMode: "manual",
    editMode: "1",
    originalDishCode: dish.dish_code || "",
    draftKey: dish.draft_key || "",
    dishName: dish.dish_name || "",
    methodologyMainCode: dish.methodology_main_code || "",
    methodologyVersionCode: dish.methodology_version_code && dish.methodology_version_code !== dish.methodology_main_code ? dish.methodology_version_code : "",
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

function formatMethodologyRecord(item) {
  const parts = [item.methodology_main_code || "-"];
  if (item.methodology_version_code && item.methodology_version_code !== item.methodology_main_code) {
    parts.push(item.methodology_version_code);
  }
  if (item.methodology_event_code) {
    parts.push(item.methodology_event_code);
  }
  return parts.join(" / ");
}

function buildMethodologyReportUrl(item) {
  const params = new URLSearchParams({
    projectCode: item.methodology_main_code || ""
  });
  if (item.methodology_version_code && item.methodology_version_code !== item.methodology_main_code) {
    params.set("versionCode", item.methodology_version_code);
  }
  if (item.methodology_event_code) {
    params.set("eventCode", item.methodology_event_code);
    params.set("section", item.methodology_event_code.startsWith("Cam-") ? "changes" : "tools");
  } else {
    params.set("section", "content");
  }
  return `./methodology-report.html?${params.toString()}`;
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function t(key) {
  return i18n[state.currentLang][key];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value);
}
