const LANGUAGE_STORAGE_KEY = "lera-ui-language";
const LEGACY_LANGUAGE_STORAGE_KEY = "restaurant-database-language";

function getInitialLanguage() {
  return "es";
}

function persistLanguage() {}

const state = {
  dishes: [],
  codebook: [],
  methodologyProjects: [],
  recipe: null,
  methodologyRecords: [],
  draftKey: "",
  entryMode: "manual",
  editMode: false,
  originalDishCode: "",
  prefill: {},
  apiAvailable: true,
  currentLang: getInitialLanguage()
};

const LOOSE_RECIPE_FOUNDATION_CODE = "FPR";
const LOOSE_RECIPE_PRODUCT_CODE = "PZ1";

const i18n = {
  zh: {
    htmlLang: "zh-CN",
    brandEyebrow: "Lera 方法论",
    brandTitle: "餐厅成品菜录入",
    brandTitleLooseRecipe: "零散菜谱记录",
    topEyebrow: "项目总览",
    topTitle: "成品菜录入",
    topTitleLooseRecipe: "零散菜谱记录",
    backButton: "返回上一页",
    homeLink: "返回主页",
    catalogLink: "总列表",
    codebookLink: "新增编码",
    looseRecipeLink: "零散菜谱记录",
    snapshotTitle: "数据库快照",
    totalCountLabel: "当前菜品数",
    storageLabel: "数据存储",
    previewTitle: "当前编码预览",
    previewCopy: "",
    formEyebrow: "录入",
    formTitle: "新增菜品",
    formTitleEdit: "编辑菜品",
    formTitleLooseRecipe: "新增零散菜谱记录",
    identityEyebrow: "基础识别",
    codingEyebrow: "编码生成",
    methodologyEyebrow: "方法论关联",
    contentEyebrow: "内容录入",
    contentTitle: "食谱与备注",
    contentTitleLooseRecipe: "菜谱内容与备注",
    yearLabel: "年份 A",
    foundationLabel: "创意基础 F",
    productLabel: "原料类别 P",
    seasonLabel: "季节 E",
    monthLabel: "月份 M",
    seqLabel: "顺序号 NNN",
    methodologyMainLabel: "方法论主编码",
    methodologyVersionLabel: "正式方法论版本",
    methodologyRecordsLabel: "方法论使用记录",
    methodologyMainTitle: "方法论记录",
    methodologyRecordsNote: "",
    methodologyRecordMain: "主编码",
    methodologyRecordVersion: "正式版本",
    methodologyRecordEvent: "过程记录编码",
    methodologyRecordActions: "操作",
    methodologyRecordDelete: "删除条目",
    methodologyRecordAdd: "新增方法论记录",
    methodologyRecordEmpty: "暂无",
    dishNameLabel: "菜品名称",
    recipeEntryLabel: "食谱录入",
    notesLabel: "备注",
    foundationNote: "",
    foundationPreviewEmpty: "未选择",
    foundationEmptyOption: "留空",
    productNote: "",
    productPreviewEmpty: "未选择",
    productEmptyOption: "留空",
    methodologyMainPlaceholder: "例如 2026-001",
    methodologyVersionPlaceholder: "如存在正式版本，会自动显示",
    methodologyRecordVersionPlaceholder: "仅在正式改版时填写",
    methodologyRecordEventPlaceholder: "Herr-... / Cam-...",
    dishNamePlaceholder: "例如 Perdiz con salsa amarga",
    looseRecipeNameLabel: "食谱标题",
    looseRecipeNamePlaceholder: "例如 临时酱汁 / 小测试 / 配菜草稿",
    notesPlaceholder: "其他说明",
    recipeStatusEmpty: "",
    recipeSummaryEmpty: "",
    recipeOpenButton: "录入食谱",
    recipeEditButton: "编辑菜谱",
    recipeDeleteButton: "删除菜谱",
    recipeSavedPrefix: "已保存：",
    recipeNeedsDishSave: "菜谱已存",
    recipeSavedDefault: "已保存",
    deleteRecipeConfirm: "确定删除这份已保存的菜谱吗？",
    deleteRecipeSuccess: "菜谱已删除。",
    deleteRecipeFailed: "删除菜谱失败。",
    saveDish: "保存菜品",
    saveDishEdit: "保存并覆盖",
    saveLooseRecipe: "保存零散菜谱记录",
    backButton: "返回",
    resetForm: "清空表单",
    saveSuccess: "菜品已保存，并写入数据库总列表。",
    saveSuccessEdit: "菜品已更新，并覆盖原记录。",
    saveSuccessLooseRecipe: "零散菜谱记录已保存，并写入数据库总列表。",
    saveFailed: "保存失败。",
    fillRequired: "信息不完整",
    resetSuccess: "表单已清空，已保存食谱会继续保留。",
    looseRecipeFoundationNote: "",
    looseRecipeProductNote: "",
    looseRecipeMethodologyNote: "",
    serviceUnavailable: "未连接"
  },
  es: {
    htmlLang: "es",
    brandEyebrow: "Metodología Lera",
    brandTitle: "Registro de platos finales",
    brandTitleLooseRecipe: "Registro de receta suelta",
    topEyebrow: "Resumen del proyecto",
    topTitle: "Registro del plato",
    topTitleLooseRecipe: "Registro de receta suelta",
    backButton: "Volver",
    homeLink: "Inicio",
    catalogLink: "Ver la base de datos",
    codebookLink: "Añadir código",
    looseRecipeLink: "Receta suelta",
    snapshotTitle: "Resumen de la base de datos",
    totalCountLabel: "Número de platos",
    storageLabel: "Almacenamiento",
    previewTitle: "Vista previa del código",
    previewCopy: "",
    formEyebrow: "Registro",
    formTitle: "Nuevo plato",
    formTitleEdit: "Editar plato",
    formTitleLooseRecipe: "Nuevo registro de receta suelta",
    identityEyebrow: "Identificación base",
    codingEyebrow: "Generación del código",
    methodologyEyebrow: "Vinculación metodológica",
    contentEyebrow: "Registro de contenido",
    contentTitle: "Receta y notas",
    contentTitleLooseRecipe: "Contenido de la receta y notas",
    yearLabel: "Año A",
    foundationLabel: "Fundamento creativo F",
    productLabel: "Materia prima P",
    seasonLabel: "Temporada E",
    monthLabel: "Mes M",
    seqLabel: "Secuencia NNN",
    methodologyMainLabel: "Código maestro metodológico",
    methodologyVersionLabel: "Versión formal metodológica",
    methodologyRecordsLabel: "Registros metodológicos",
    methodologyMainTitle: "Registro metodológico",
    methodologyRecordsNote: "Guarda una referencia por cada registro metodológico utilizado realmente en este plato.",
    methodologyRecordMain: "Código maestro",
    methodologyRecordVersion: "Versión formal",
    methodologyRecordEvent: "Código de trazabilidad",
    methodologyRecordActions: "Acción",
    methodologyRecordDelete: "Eliminar registro",
    methodologyRecordAdd: "Añadir registro metodológico",
    methodologyRecordEmpty: "Todavía no se ha añadido ningún registro metodológico.",
    dishNameLabel: "Nombre del plato",
    recipeEntryLabel: "Registro de receta",
    notesLabel: "Notas",
    foundationNote: "Selecciona uno o varios fundamentos creativos según el caso; si no corresponde, deja el campo vacío.",
    foundationPreviewEmpty: "Sin selección",
    foundationEmptyOption: "Dejar vacío",
    productNote: "Puedes elegir una o dos categorías de materia prima; si no hay una segunda, deja el campo vacío.",
    productPreviewEmpty: "Sin selección",
    productEmptyOption: "Dejar vacío",
    methodologyMainPlaceholder: "Por ejemplo 2026-001",
    methodologyVersionPlaceholder: "Se muestra solo si existe una versión formal",
    methodologyRecordVersionPlaceholder: "Rellenar solo si hay una versión formal",
    methodologyRecordEventPlaceholder: "Herr-... / Cam-...",
    dishNamePlaceholder: "Por ejemplo Perdiz con salsa amarga",
    looseRecipeNameLabel: "Título de la receta",
    looseRecipeNamePlaceholder: "Por ejemplo salsa temporal / prueba pequeña / borrador de guarnición",
    notesPlaceholder: "Otras notas",
    recipeStatusEmpty: "",
    recipeSummaryEmpty: "",
    recipeOpenButton: "Abrir registro de receta",
    recipeEditButton: "Editar receta",
    recipeDeleteButton: "Eliminar receta",
    recipeSavedPrefix: "Guardada: ",
    recipeNeedsDishSave: "Receta guardada",
    recipeSavedDefault: "Guardada",
    deleteRecipeConfirm: "¿Quieres eliminar esta receta guardada?",
    deleteRecipeSuccess: "La receta se ha eliminado.",
    deleteRecipeFailed: "No se pudo eliminar la receta.",
    saveDish: "Guardar plato",
    saveDishEdit: "Guardar y sobrescribir",
    saveLooseRecipe: "Guardar receta suelta",
    backButton: "Volver",
    resetForm: "Limpiar formulario",
    saveSuccess: "El plato se ha guardado y añadido a la base de datos.",
    saveSuccessEdit: "El plato se ha actualizado y reemplaza el registro anterior.",
    saveSuccessLooseRecipe: "La receta suelta se ha guardado y añadido a la base de datos.",
    saveFailed: "No se pudo guardar.",
    fillRequired: "Faltan campos",
    resetSuccess: "El formulario se ha limpiado. La receta guardada se mantiene.",
    looseRecipeFoundationNote: "",
    looseRecipeProductNote: "",
    looseRecipeMethodologyNote: "",
    serviceUnavailable: "Sin conexión"
  }
};

const monthSelect = document.getElementById("month-no");
const formFeedback = document.getElementById("form-feedback");
const foundationBuilder = document.getElementById("foundation-builder");
const productBuilder = document.getElementById("product-builder");
const foundationHelper = document.getElementById("foundation-helper");
const productHelper = document.getElementById("product-helper");
const methodologyRecordsList = document.getElementById("methodology-records-list");
const recipeStatus = document.getElementById("recipe-status");
const recipeSummary = document.getElementById("recipe-summary");
const RECIPE_SYNC_KEY = "lera-recipe-sync";

populateMonthOptions();
bindEvents();
init();

async function init() {
  applyEntryContext();
  const [dishes, codebook, methodologyProjects] = await Promise.all([
    fetchDishes(),
    fetchCodebook(),
    fetchMethodologyProjects()
  ]);
  state.apiAvailable = dishes !== null && codebook !== null && methodologyProjects !== null;
  state.dishes = dishes || [];
  state.codebook = codebook || [];
  state.methodologyProjects = methodologyProjects || [];
  await hydrateMethodologyRecords();
  renderLanguage();
  populateCodebookFields();
  await loadRecipe();
  render();
}

function applyEntryContext() {
  const params = new URLSearchParams(window.location.search);
  state.entryMode = params.get("entryMode") || "manual";
  state.editMode = params.get("editMode") === "1";
  state.originalDishCode = params.get("originalDishCode") || "";
  state.draftKey = params.get("draftKey") || createDraftKey();
  state.prefill = {
    foundationCode: params.get("foundationCode") || "",
    productCode: params.get("productCode") || "",
    seasonCode: params.get("seasonCode") || "",
    monthNo: params.get("monthNo") || ""
  };

  setInputValue("dish-name", params.get("dishName") || "");
  setInputValue("methodology-main-code", params.get("methodologyMainCode") || "");
  setInputValue("methodology-version-code", params.get("methodologyVersionCode") || "");
  setInputValue("notes", params.get("notes") || "");

  if (params.get("yearCode")) setInputValue("year-code", params.get("yearCode"));
  if (params.get("seasonCode")) setSelectValue("season-code", params.get("seasonCode"));
  if (params.get("monthNo")) setSelectValue("month-no", params.get("monthNo"));
  if (params.get("seqNo")) setInputValue("seq-no", params.get("seqNo"));

  if (state.entryMode === "loose_recipe") {
    state.prefill.foundationCode = LOOSE_RECIPE_FOUNDATION_CODE;
    state.prefill.productCode = LOOSE_RECIPE_PRODUCT_CODE;
  }
}

function populateMonthOptions() {
  for (let month = 1; month <= 12; month += 1) {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = String(month);
    monthSelect.appendChild(option);
  }
  monthSelect.value = "1";
}

function bindEvents() {
  ["year-code", "season-code", "month-no", "seq-no"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderCodePreview);
    document.getElementById(id).addEventListener("change", renderCodePreview);
  });
  foundationBuilder.addEventListener("change", renderCodePreview);
  productBuilder.addEventListener("change", renderCodePreview);
  document.getElementById("dish-name").addEventListener("input", updateWindowTitle);

  document.getElementById("methodology-main-code").addEventListener("input", syncMethodologyVersionCode);
  document.getElementById("back-button").addEventListener("click", () => window.history.back());
  document.getElementById("add-methodology-record-button").addEventListener("click", addMethodologyRecord);
  document.getElementById("save-dish-button").addEventListener("click", saveDish);
  document.getElementById("reset-form-button").addEventListener("click", resetForm);
  document.getElementById("open-recipe-button").addEventListener("click", openRecipeEntry);
  document.getElementById("delete-recipe-button").addEventListener("click", deleteRecipe);
  window.addEventListener("message", handleRecipeWindowMessage);
  window.addEventListener("storage", handleRecipeStorageMessage);
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

async function fetchDishDetail(code) {
  const response = await fetch(`/api/dishes?dish_code=${encodeURIComponent(code)}`);
  if (!response.ok) return null;
  const payload = await response.json();
  return payload && Object.keys(payload).length ? payload : null;
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

async function fetchMethodologyProjects() {
  try {
    const response = await fetch("/api/methodology");
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchRecipe() {
  const response = await fetch(`/api/recipe?draft_key=${encodeURIComponent(state.draftKey)}`);
  if (!response.ok) return null;
  const payload = await response.json();
  return payload && Object.keys(payload).length ? payload : null;
}

async function loadRecipe() {
  state.recipe = await fetchRecipe();
}

async function hydrateMethodologyRecords() {
  if (state.editMode && state.originalDishCode) {
    const dish = await fetchDishDetail(state.originalDishCode);
    if (dish?.dish_code) {
      state.draftKey = dish.draft_key || state.draftKey;
      setInputValue("dish-name", dish.dish_name || "");
      setInputValue("methodology-main-code", dish.methodology_main_code || "");
      setInputValue("methodology-version-code", dish.methodology_version_code || "");
      setInputValue("notes", dish.notes || "");
      setInputValue("year-code", dish.year_code || "");
      setInputValue("seq-no", dish.seq_no || "");
      setSelectValue("season-code", dish.season_code || "");
      setSelectValue("month-no", String(dish.month_no || ""));
      state.prefill.foundationCode = dish.foundation_code || state.prefill.foundationCode;
      state.prefill.productCode = dish.product_code || state.prefill.productCode;
      state.methodologyRecords = normalizeMethodologyRecords(dish.methodology_records || []);
      return;
    }
  }

  state.methodologyRecords = normalizeMethodologyRecords([
    {
      methodology_main_code: document.getElementById("methodology-main-code").value.trim(),
      methodology_version_code: document.getElementById("methodology-version-code").value.trim()
    }
  ]);
}

function populateCodebookFields() {
  renderFoundationBuilder();
  renderProductBuilder();
}

function renderFoundationBuilder() {
  const foundationRows = state.codebook
    .filter((item) => item.category === "foundation" && item.status === "active")
    .sort(compareCodebookRows);
  const parentRows = foundationRows.filter((item) => !item.parent_code);
  const previousValue = getFoundationCode();
  const prefillValue = previousValue || state.prefill.foundationCode;
  const selectedByParent = getFoundationSelectionsByParent(prefillValue, foundationRows);

  foundationBuilder.innerHTML = "";

  parentRows.forEach((parent, index) => {
    const card = document.createElement("div");
    card.className = "foundation-card";

    const label = document.createElement("div");
    label.className = "foundation-card-label";
    label.textContent = `${parent.code} · ${state.currentLang === "zh" ? parent.label_zh : parent.label_es}`;
    card.appendChild(label);

    const select = document.createElement("select");
    select.className = "foundation-segment";
    select.dataset.parentCode = parent.code;

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = `${parent.code} · ${t("foundationEmptyOption")}`;
    select.appendChild(emptyOption);

    foundationRows
      .filter((item) => item.parent_code === parent.code)
      .forEach((item) => {
        const option = document.createElement("option");
        option.value = item.code;
        option.textContent = `${item.code} · ${state.currentLang === "zh" ? item.label_zh : item.label_es}`;
        select.appendChild(option);
      });

    if (selectedByParent[parent.code] && [...select.options].some((option) => option.value === selectedByParent[parent.code])) {
      select.value = selectedByParent[parent.code];
    }

    if (state.entryMode === "loose_recipe" && parent.code === "FP") {
      select.value = LOOSE_RECIPE_FOUNDATION_CODE;
      select.disabled = true;
    }

    card.appendChild(select);
    foundationBuilder.appendChild(card);
  });
}

function renderProductBuilder() {
  const productRows = state.codebook
    .filter((item) => item.category === "product" && item.status === "active" && item.parent_code)
    .sort(compareCodebookRows);
  const previousValue = getProductCode();
  const prefillParts = (previousValue || normalizeCodePart(state.prefill.productCode))
    .split("-")
    .filter(Boolean)
    .slice(0, 2);

  productBuilder.innerHTML = "";

  for (let index = 0; index < 2; index += 1) {
    const card = document.createElement("div");
    card.className = "foundation-card";

    const label = document.createElement("div");
    label.className = "foundation-card-label";
    label.textContent = `${index === 0 ? "P1" : "P2"}`;
    card.appendChild(label);

    const select = document.createElement("select");
    select.className = "foundation-segment";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = t("productEmptyOption");
    select.appendChild(emptyOption);

    productRows.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.code;
      option.textContent = `${item.code} · ${state.currentLang === "zh" ? item.label_zh : item.label_es}`;
      select.appendChild(option);
    });

    if (prefillParts[index] && [...select.options].some((option) => option.value === prefillParts[index])) {
      select.value = prefillParts[index];
    }

    if (state.entryMode === "loose_recipe") {
      if (index === 0) {
        select.value = LOOSE_RECIPE_PRODUCT_CODE;
      } else {
        select.value = "";
      }
      select.disabled = true;
    }

    card.appendChild(select);
    productBuilder.appendChild(card);
  }
}

function getFoundationSelectionsByParent(value, foundationRows) {
  const selections = {};
  const parts = normalizeCodePart(value)
    .split("-")
    .filter(Boolean);

  parts.forEach((part) => {
    const matched = foundationRows.find((item) => item.code === part && item.parent_code);
    if (matched) selections[matched.parent_code] = matched.code;
  });

  return selections;
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

function padSequence(value) {
  return String(Math.max(1, Number(value) || 1)).padStart(3, "0");
}

function getMatchedMethodologyVersion(mainCode) {
  const normalizedMainCode = String(mainCode || "").trim().toUpperCase();
  if (!normalizedMainCode) return "";

  const matchedProject = state.methodologyProjects.find((project) => {
    const projectCode = String(project.project_code || "").trim().toUpperCase();
    return projectCode === normalizedMainCode;
  });

  if (!matchedProject) return "";

  const formalVersion = String(matchedProject.latest_formal_version_code || "").trim();
  return formalVersion && formalVersion !== normalizedMainCode ? formalVersion : "";
}

function syncMethodologyVersionCode() {
  const mainCode = document.getElementById("methodology-main-code").value.trim();
  const currentField = document.getElementById("methodology-version-code");
  if (!currentField.value.trim() || state.entryMode === "methodology") {
    currentField.value = getMatchedMethodologyVersion(mainCode);
  }
  if (state.entryMode === "methodology" && state.methodologyRecords.length <= 1) {
    state.methodologyRecords = normalizeMethodologyRecords([
      {
        methodology_main_code: mainCode,
        methodology_version_code: currentField.value.trim()
      }
    ]);
    renderMethodologyRecords();
  }
}

function getCodebookMatch(category, code) {
  return state.codebook.find((item) => item.category === category && item.code === code && item.status === "active") || null;
}

function renderFoundationHelper() {
  const normalizedValue = getFoundationCode();
  if (!normalizedValue) {
    foundationHelper.textContent = t("foundationPreviewEmpty");
    return;
  }

  foundationHelper.textContent = normalizedValue;
}

function renderProductHelper() {
  const codes = getProductCode()
    .split("-")
    .filter(Boolean);
  if (!codes.length) {
    productHelper.textContent = t("productPreviewEmpty");
    return;
  }

  const labels = codes
    .map((code) => getCodebookMatch("product", code))
    .filter(Boolean)
    .map((item) => `${item.code} · ${state.currentLang === "zh" ? item.label_zh : item.label_es}`);
  productHelper.textContent = labels.join("  | ");
}

function normalizeMethodologyRecords(records) {
  const seen = new Set();
  return (records || [])
    .map((item) => ({
      methodology_main_code: String(item.methodology_main_code || item.main_code || "").trim(),
      methodology_version_code: String(item.methodology_version_code || item.version_code || "").trim(),
      methodology_event_code: String(item.methodology_event_code || item.event_code || "").trim(),
      methodology_record_type: String(item.methodology_record_type || item.record_type || "").trim()
    }))
    .map((item) => ({
      ...item,
      methodology_record_type: item.methodology_record_type || inferMethodologyRecordType(item)
    }))
    .filter((item) => item.methodology_main_code || item.methodology_version_code || item.methodology_event_code)
    .filter((item) => {
      const key = `${item.methodology_main_code}__${item.methodology_version_code}__${item.methodology_event_code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function inferMethodologyRecordType(item) {
  if (item?.methodology_event_code) return "event";
  if (item?.methodology_version_code) return "formal_version";
  return "project";
}

function collectMethodologyRecords() {
  const primaryMainCode = document.getElementById("methodology-main-code").value.trim();
  const primaryVersionCode = document.getElementById("methodology-version-code").value.trim();

  const rows = [...methodologyRecordsList.querySelectorAll(".methodology-record-row")]
    .map((row) => ({
      methodology_main_code: row.querySelector('[data-role="methodology-main"]').value.trim(),
      methodology_version_code: row.querySelector('[data-role="methodology-version"]').value.trim(),
      methodology_event_code: row.querySelector('[data-role="methodology-event"]').value.trim()
    }));

  const merged = [
    primaryMainCode || primaryVersionCode
      ? {
          methodology_main_code: primaryMainCode,
          methodology_version_code: primaryVersionCode,
          methodology_event_code: ""
        }
      : null,
    ...rows
  ].filter(Boolean);

  return normalizeMethodologyRecords(merged);
}

function addMethodologyRecord(prefill = {}) {
  state.methodologyRecords.push({
    methodology_main_code: String(prefill.methodology_main_code || "").trim(),
    methodology_version_code: String(prefill.methodology_version_code || "").trim(),
    methodology_event_code: String(prefill.methodology_event_code || "").trim(),
    methodology_record_type: String(prefill.methodology_record_type || "").trim() || inferMethodologyRecordType(prefill)
  });
  renderMethodologyRecords();
}

function removeMethodologyRecord(index) {
  state.methodologyRecords.splice(index, 1);
  renderMethodologyRecords();
}

function handleMethodologyRecordInput() {
  state.methodologyRecords = [...methodologyRecordsList.querySelectorAll(".methodology-record-row")].map((row) => ({
    methodology_main_code: row.querySelector('[data-role="methodology-main"]').value.trim(),
    methodology_version_code: row.querySelector('[data-role="methodology-version"]').value.trim(),
    methodology_event_code: row.querySelector('[data-role="methodology-event"]').value.trim(),
    methodology_record_type: inferMethodologyRecordType({
      methodology_version_code: row.querySelector('[data-role="methodology-version"]').value.trim(),
      methodology_event_code: row.querySelector('[data-role="methodology-event"]').value.trim()
    })
  }));
}

function syncMethodologyRecordVersion(index) {
  const row = methodologyRecordsList.querySelector(`[data-index="${index}"]`);
  if (!row) return;
  const mainInput = row.querySelector('[data-role="methodology-main"]');
  const versionInput = row.querySelector('[data-role="methodology-version"]');
  if (!versionInput.value.trim()) {
    versionInput.value = getMatchedMethodologyVersion(mainInput.value.trim());
  }
  handleMethodologyRecordInput();
}

function renderMethodologyRecords() {
  methodologyRecordsList.innerHTML = "";
  const records = state.methodologyRecords.length ? state.methodologyRecords : [];

  if (!records.length) {
    methodologyRecordsList.innerHTML = `<div class="support-copy">${t("methodologyRecordEmpty")}</div>`;
    return;
  }

  records.forEach((record, index) => {
    const row = document.createElement("div");
    row.className = "methodology-record-row";
    row.dataset.index = String(index);
    row.innerHTML = `
      <label>
        <span>${t("methodologyRecordMain")}</span>
        <input data-role="methodology-main" type="text" value="${escapeHtmlAttr(record.methodology_main_code || "")}" placeholder="${escapeHtmlAttr(t("methodologyMainPlaceholder"))}" />
      </label>
      <label>
        <span>${t("methodologyRecordVersion")}</span>
        <input data-role="methodology-version" type="text" value="${escapeHtmlAttr(record.methodology_version_code || "")}" placeholder="${escapeHtmlAttr(t("methodologyRecordVersionPlaceholder"))}" />
      </label>
      <label>
        <span>${t("methodologyRecordEvent")}</span>
        <input data-role="methodology-event" type="text" value="${escapeHtmlAttr(record.methodology_event_code || "")}" placeholder="${escapeHtmlAttr(t("methodologyRecordEventPlaceholder"))}" />
      </label>
      <div class="methodology-record-actions">
        <span>${t("methodologyRecordActions")}</span>
        <button class="secondary-button" type="button" data-role="methodology-delete">${t("methodologyRecordDelete")}</button>
      </div>
    `;
    methodologyRecordsList.appendChild(row);
  });

  methodologyRecordsList.querySelectorAll('[data-role="methodology-main"]').forEach((input, index) => {
    input.addEventListener("input", () => {
      handleMethodologyRecordInput();
      syncMethodologyRecordVersion(index);
    });
  });
  methodologyRecordsList.querySelectorAll('[data-role="methodology-version"]').forEach((input) => {
    input.addEventListener("input", handleMethodologyRecordInput);
  });
  methodologyRecordsList.querySelectorAll('[data-role="methodology-event"]').forEach((input) => {
    input.addEventListener("input", handleMethodologyRecordInput);
  });
  methodologyRecordsList.querySelectorAll('[data-role="methodology-delete"]').forEach((button, index) => {
    button.addEventListener("click", () => removeMethodologyRecord(index));
  });
}

function buildDishCode() {
  const year = String(document.getElementById("year-code").value || "").trim();
  const foundation = getFoundationCode();
  const product = getProductCode();
  const season = normalizeCodePart(document.getElementById("season-code").value);
  const month = String(document.getElementById("month-no").value || "").trim();
  const seq = padSequence(document.getElementById("seq-no").value);

  return [year || "AAAA", foundation || "F", product || "P", season || "E", month || "M", seq].join("-");
}

function renderCodePreview() {
  const preview = document.getElementById("dish-code-preview");
  if (preview) preview.textContent = buildDishCode();
  renderFoundationHelper();
  renderProductHelper();
}

function renderRecipeStatus() {
  const openButton = document.getElementById("open-recipe-button");
  const deleteButton = document.getElementById("delete-recipe-button");
  if (!state.recipe) {
    recipeStatus.textContent = t("recipeStatusEmpty");
    recipeSummary.textContent = t("recipeSummaryEmpty");
    openButton.textContent = t("recipeOpenButton");
    deleteButton.disabled = true;
    return;
  }

  recipeStatus.textContent = `${t("recipeSavedPrefix")}${state.recipe.updated_at || "-"}`;
  recipeSummary.textContent = buildRecipeSummary();
  openButton.textContent = t("recipeEditButton");
  deleteButton.disabled = false;
}

function buildRecipeSummary() {
  const modules = Array.isArray(state.recipe?.payload_json?.modules) ? state.recipe.payload_json.modules : [];
  if (!modules.length) {
    return state.recipe?.summary_text || t("recipeSavedDefault");
  }
  const stepCount = modules.reduce((total, module) => total + (Array.isArray(module.steps) ? module.steps.length : 0), 0);
  return state.currentLang === "zh"
    ? `${modules.length} 个制作组成 / ${stepCount} 个步骤`
    : `${modules.length} subproductos / ${stepCount} pasos`;
}

async function saveDish() {
  const wasEditMode = state.editMode;
  const dishName = document.getElementById("dish-name").value.trim();
  const yearCode = Number(document.getElementById("year-code").value);
  const foundationCode = getFoundationCode();
  const productCode = getProductCode();
  const seasonCode = normalizeCodePart(document.getElementById("season-code").value);
  const monthNo = Number(document.getElementById("month-no").value);
  const seqNo = Number(document.getElementById("seq-no").value);
  const dishCode = buildDishCode();
  const methodologyMainCode = document.getElementById("methodology-main-code").value.trim();
  const methodologyVersionCode = document.getElementById("methodology-version-code").value.trim() || getMatchedMethodologyVersion(methodologyMainCode);
  const methodologyRecords = collectMethodologyRecords();

  if (!dishName || !yearCode || !foundationCode || !productCode || !seasonCode || !monthNo || !seqNo) {
    formFeedback.textContent = t("fillRequired");
    return;
  }

  const payload = {
    dish_code: dishCode,
    original_dish_code: state.editMode ? state.originalDishCode || dishCode : "",
    draft_key: state.draftKey,
    year_code: yearCode,
    foundation_code: foundationCode,
    product_code: productCode,
    season_code: seasonCode,
    month_no: monthNo,
    seq_no: seqNo,
    dish_name: dishName,
    recipe_text: state.recipe?.summary_text || "",
    methodology_main_code: methodologyMainCode,
    methodology_version_code: methodologyVersionCode,
    methodology_records: methodologyRecords,
    notes: document.getElementById("notes").value.trim()
  };

  const response = await fetch("/api/dishes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    formFeedback.textContent = t("saveFailed");
    return;
  }

  state.dishes = await fetchDishes();
  state.methodologyRecords = methodologyRecords;
  state.originalDishCode = dishCode;
  state.editMode = true;
  formFeedback.textContent = state.entryMode === "loose_recipe"
    ? t("saveSuccessLooseRecipe")
    : t(wasEditMode ? "saveSuccessEdit" : "saveSuccess");
  render();
}

function resetForm() {
  document.querySelectorAll("#dish-form-grid input, #dish-form-grid textarea").forEach((field) => {
    if (field.id === "year-code") {
      field.value = "2026";
      return;
    }
    if (field.id === "seq-no") {
      field.value = "1";
      return;
    }
    if (field.id === "methodology-version-code") {
      field.value = "";
      return;
    }
    field.value = "";
  });
  foundationBuilder.querySelectorAll("select").forEach((select) => {
    select.value = "";
  });
  productBuilder.querySelectorAll("select").forEach((select) => {
    select.value = "";
  });
  state.methodologyRecords = [];
  document.getElementById("season-code").value = "P";
  document.getElementById("month-no").value = "1";
  formFeedback.textContent = t("resetSuccess");
  renderCodePreview();
  renderRecipeStatus();
  renderMethodologyRecords();
}

function openRecipeEntry() {
  const params = new URLSearchParams({
    draftKey: state.draftKey,
    title: document.getElementById("dish-name").value.trim(),
    code: buildDishCode(),
    methodologyMainCode: document.getElementById("methodology-main-code").value.trim(),
    methodologyVersionCode: document.getElementById("methodology-version-code").value.trim(),
    foundationCode: getFoundationCode(),
    productCode: getProductCode(),
    yearCode: String(document.getElementById("year-code").value || ""),
    seasonCode: String(document.getElementById("season-code").value || ""),
    monthNo: String(document.getElementById("month-no").value || ""),
    seqNo: String(document.getElementById("seq-no").value || ""),
    notes: document.getElementById("notes").value.trim()
  });

  params.set("returnTo", "entry");
  params.set("entryMode", state.entryMode || "manual");
  if (state.editMode) params.set("editMode", "1");
  if (state.originalDishCode) params.set("originalDishCode", state.originalDishCode);

  const targetUrl = `./menu-entry-template.html?${params.toString()}`;
  window.location.href = targetUrl;
}

async function deleteRecipe() {
  if (!state.recipe) return;
  if (!window.confirm(t("deleteRecipeConfirm"))) return;

  const response = await fetch(`/api/recipe?draft_key=${encodeURIComponent(state.draftKey)}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    formFeedback.textContent = t("deleteRecipeFailed");
    return;
  }

  state.recipe = null;
  state.dishes = await fetchDishes();
  formFeedback.textContent = t("deleteRecipeSuccess");
  render();
}

function render() {
  renderLanguage();
  if (!state.apiAvailable) {
    formFeedback.textContent = t("serviceUnavailable");
  }
  renderCodePreview();
  syncMethodologyVersionCode();
  renderRecipeStatus();
  renderMethodologyRecords();
  const totalCount = document.getElementById("total-count");
  if (totalCount) totalCount.textContent = String(state.dishes.length);
}

function renderLanguage() {
  const copy = i18n[state.currentLang];
  const isLooseRecipe = state.entryMode === "loose_recipe";
  document.documentElement.lang = copy.htmlLang;
  updateWindowTitle();
  setText("brand-eyebrow", copy.brandEyebrow);
  setText("brand-title", isLooseRecipe ? copy.brandTitleLooseRecipe : copy.brandTitle);
  setText("top-eyebrow", copy.topEyebrow);
  setText("top-title", isLooseRecipe ? copy.topTitleLooseRecipe : copy.topTitle);
  setText("back-button", copy.backButton);
  setText("home-link", copy.homeLink);
  setText("catalog-link", copy.catalogLink);
  setText("codebook-link", copy.codebookLink);
  setText("loose-recipe-link", copy.looseRecipeLink);
  setText("snapshot-title", copy.snapshotTitle);
  setText("total-count-label", copy.totalCountLabel);
  setText("storage-label", copy.storageLabel);
  setText("preview-title", copy.previewTitle);
  setText("preview-copy", copy.previewCopy);
  setText("form-eyebrow", copy.formEyebrow);
  setText("form-title", isLooseRecipe ? copy.formTitleLooseRecipe : (state.editMode ? copy.formTitleEdit : copy.formTitle));
  setText("identity-eyebrow", copy.identityEyebrow);
  setText("foundation-eyebrow", copy.codingEyebrow);
  setText("product-eyebrow", copy.codingEyebrow);
  setText("methodology-eyebrow", copy.methodologyEyebrow);
  setText("content-eyebrow", copy.contentEyebrow);
  setText("content-title", isLooseRecipe ? copy.contentTitleLooseRecipe : copy.contentTitle);
  setText("year-label", copy.yearLabel);
  setText("foundation-label", copy.foundationLabel);
  setText("product-label", copy.productLabel);
  setText("season-label", copy.seasonLabel);
  setText("month-label", copy.monthLabel);
  setText("seq-label", copy.seqLabel);
  setText("methodology-main-label", copy.methodologyMainLabel);
  setText("methodology-version-label", copy.methodologyVersionLabel);
  setText("methodology-main-title", copy.methodologyMainTitle);
  setText("methodology-records-label", copy.methodologyRecordsLabel);
  setText("methodology-records-note", isLooseRecipe ? copy.looseRecipeMethodologyNote : copy.methodologyRecordsNote);
  setText("add-methodology-record-button", copy.methodologyRecordAdd);
  setText("dish-name-label", isLooseRecipe ? copy.looseRecipeNameLabel : copy.dishNameLabel);
  setText("dish-name-inline-label", isLooseRecipe ? copy.looseRecipeNameLabel : copy.dishNameLabel);
  setText("recipe-entry-label", copy.recipeEntryLabel);
  setText("recipe-entry-inline-label", copy.recipeEntryLabel);
  setText("notes-label", copy.notesLabel);
  setText("foundation-note", isLooseRecipe ? copy.looseRecipeFoundationNote : copy.foundationNote);
  setText("product-note", isLooseRecipe ? copy.looseRecipeProductNote : copy.productNote);
  setText("delete-recipe-button", copy.recipeDeleteButton);
  setText("back-detail-link", copy.backButton);
  setText("save-dish-button", isLooseRecipe ? copy.saveLooseRecipe : (state.editMode ? copy.saveDishEdit : copy.saveDish));
  setText("reset-form-button", copy.resetForm);
  const backLink = document.getElementById("back-detail-link");
  backLink.hidden = !state.editMode;
  backLink.href = state.originalDishCode
    ? `./dish-detail.html?dishCode=${encodeURIComponent(state.originalDishCode)}`
    : "./catalog.html";
  foundationHelper.textContent = copy.foundationPreviewEmpty;
  productHelper.textContent = copy.productPreviewEmpty;
  document.getElementById("methodology-main-code").placeholder = copy.methodologyMainPlaceholder;
  document.getElementById("methodology-version-code").placeholder = copy.methodologyVersionPlaceholder;
  document.getElementById("dish-name").placeholder = isLooseRecipe ? copy.looseRecipeNamePlaceholder : copy.dishNamePlaceholder;
  document.getElementById("notes").placeholder = copy.notesPlaceholder;
  document.body.style.visibility = "visible";
}

function updateWindowTitle() {
  const isLooseRecipe = state.entryMode === "loose_recipe";
  const dishName = document.getElementById("dish-name")?.value.trim();
  const suffix = isLooseRecipe
    ? (state.currentLang === "zh" ? "零散菜谱记录" : "Registro de receta suelta")
    : (state.currentLang === "zh" ? "成品菜录入" : "Registro del plato");
  const baseTitle = isLooseRecipe
    ? (state.currentLang === "zh" ? "Lera · 零散菜谱记录" : "Lera · Registro de receta suelta")
    : (state.currentLang === "zh" ? "Lera · 成品菜录入" : "Lera · Registro del plato");
  document.title = dishName ? `${dishName} · ${suffix}` : baseTitle;
}

async function refreshRecipeState() {
  await loadRecipe();
  renderRecipeStatus();
}

function handleRecipeWindowMessage(event) {
  const data = event?.data;
  if (!data || data.type !== "lera-recipe-saved" || data.draftKey !== state.draftKey) return;
  formFeedback.textContent = t("recipeNeedsDishSave");
  refreshRecipeState().catch(console.error);
}

function handleRecipeStorageMessage(event) {
  if (event.key !== RECIPE_SYNC_KEY || !event.newValue) return;
  try {
    const payload = JSON.parse(event.newValue);
    if (payload?.type === "lera-recipe-saved" && payload?.draftKey === state.draftKey) {
      formFeedback.textContent = t("recipeNeedsDishSave");
      refreshRecipeState().catch(console.error);
    }
  } catch (error) {
    console.error(error);
  }
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function t(key) {
  return i18n[state.currentLang][key];
}

function getFoundationCode() {
  const values = [...foundationBuilder.querySelectorAll("select")]
    .map((select) => normalizeCodePart(select.value))
    .filter(Boolean);
  return values.join("-");
}

function getProductCode() {
  const values = [...productBuilder.querySelectorAll("select")]
    .map((select) => normalizeCodePart(select.value))
    .filter(Boolean);
  return [...new Set(values)].join("-");
}

function createDraftKey() {
  if (window.crypto?.randomUUID) {
    return `draft-${window.crypto.randomUUID()}`;
  }
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function setInputValue(id, value) {
  if (!value) return;
  const input = document.getElementById(id);
  if (input && !input.value.trim()) {
    input.value = value;
  }
}

function setSelectValue(id, value) {
  if (!value) return;
  const select = document.getElementById(id);
  if (select && [...select.options].some((option) => option.value === value)) {
    select.value = value;
  }
}

function escapeHtmlAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
