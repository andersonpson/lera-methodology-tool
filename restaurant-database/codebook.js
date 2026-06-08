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

const i18n = {
  zh: {
    htmlLang: "zh-CN",
    pageTitle: "Lera · 编码字典管理",
    brandTitle: "编码字典管理",
    brandCopy: "",
    topEyebrow: "编码字典",
    topTitle: "F / P 编码维护",
    backButton: "返回上一页",
    homeLink: "返回主页",
    backEntry: "返回录入页面",
    backCatalog: "总列表",
    summaryTitle: "编码快照",
    foundationCountLabel: "F 编码数量",
    productCountLabel: "P 编码数量",
    formEyebrow: "新增编码",
    formTitle: "新增字典项",
    categoryLabel: "编码类别",
    codeLabel: "编码",
    parentLabel: "父级编码",
    statusLabel: "状态",
    labelCurrentLabel: "说明",
    notesLabel: "备注",
    saveButton: "保存编码",
    resetButton: "清空表单",
    tableEyebrow: "编码总表",
    tableTitle: "字典列表",
    searchLabel: "搜索",
    filterCategoryLabel: "类别",
    filterStatusLabel: "状态",
    thCategory: "类别",
    thCode: "编码",
    thParent: "父级",
    thLabel: "说明",
    thStatus: "状态",
    thNotes: "备注",
    thActions: "操作",
    empty: "暂无编码",
    saveSuccess: "编码已保存。",
    updateSuccess: "编码已更新。",
    deleteSuccess: "编码已删除。",
    saveFailed: "保存失败",
    placeholderCode: "例如 FT3 / PA1 / FPx",
    placeholderParent: "例如 FT / PA / PB",
    placeholderCurrent: "",
    placeholderNotes: "补充说明",
    searchPlaceholder: "",
    active: "启用",
    inactive: "停用",
    foundation: "F",
    product: "P",
    all: "全部",
    fillRequired: "信息不完整",
    serviceUnavailable: "未连接"
  },
  es: {
    htmlLang: "es",
    pageTitle: "Lera · Gestión de códigos",
    brandTitle: "Gestión del diccionario de códigos",
    brandCopy: "",
    topEyebrow: "Diccionario de códigos",
    topTitle: "Mantenimiento de códigos F / P",
    backButton: "Volver",
    homeLink: "Inicio",
    backEntry: "Volver al registro",
    backCatalog: "Catálogo",
    summaryTitle: "Resumen de códigos",
    foundationCountLabel: "Cantidad de códigos F",
    productCountLabel: "Cantidad de códigos P",
    formEyebrow: "Alta de código",
    formTitle: "Nuevo código",
    categoryLabel: "Categoría",
    codeLabel: "Código",
    parentLabel: "Código padre",
    statusLabel: "Estado",
    labelCurrentLabel: "Descripción",
    notesLabel: "Notas",
    saveButton: "Guardar código",
    updateButton: "Guardar cambios",
    resetButton: "Limpiar formulario",
    tableEyebrow: "Tabla de códigos",
    editButton: "Editar",
    deleteButton: "Eliminar",
    tableTitle: "Lista de códigos",
    searchLabel: "Búsqueda",
    filterCategoryLabel: "Categoría",
    filterStatusLabel: "Estado",
    thCategory: "Categoría",
    thCode: "Código",
    thParent: "Código padre",
    thLabel: "Descripción",
    thStatus: "Estado",
    thNotes: "Notas",
    thActions: "Acciones",
    empty: "Sin códigos",
    saveSuccess: "Código guardado.",
    updateSuccess: "Código actualizado.",
    deleteSuccess: "Código eliminado.",
    saveFailed: "Error al guardar",
    placeholderCode: "Por ejemplo FT3 / PA1 / FPx",
    placeholderParent: "Por ejemplo FT / PA / PB",
    placeholderCurrent: "",
    placeholderNotes: "Anotaciones",
    searchPlaceholder: "",
    active: "Activo",
    inactive: "Inactivo",
    foundation: "F",
    product: "P",
    all: "Todos",
    fillRequired: "Faltan campos",
    serviceUnavailable: "Sin conexión"
  }
};

let currentLang = getInitialLanguage();
let codebook = [];
let editingKey = "";
let serviceAvailable = true;

bindEvents();
init();

async function init() {
  codebook = await fetchCodebook();
  serviceAvailable = codebook !== null;
  if (!serviceAvailable) codebook = [];
  renderLanguage();
  render();
}

async function fetchCodebook() {
  try {
    const response = await fetch("/api/codebook");
    if (!response.ok) return null;
    const rows = await response.json();
    return rows.map((row) => ({
      category: row.category,
      code: row.code,
      parentCode: row.parent_code || "",
      labelZh: row.label_zh,
      labelEs: row.label_es,
      status: row.status,
      notes: row.notes || ""
    }));
  } catch {
    return null;
  }
}

function bindEvents() {
  ["language-toggle", "topbar-language-toggle"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.addEventListener("click", toggleLanguage);
  });
  document.getElementById("back-button").addEventListener("click", () => window.history.back());

  document.getElementById("save-code-button").addEventListener("click", saveCode);
  document.getElementById("reset-code-button").addEventListener("click", resetForm);

  ["search-input", "filter-category", "filter-status"].forEach((id) => {
    document.getElementById(id).addEventListener("input", render);
    document.getElementById(id).addEventListener("change", render);
  });
}

function toggleLanguage() {
  currentLang = currentLang === "zh" ? "es" : "zh";
  persistLanguage(currentLang);
  renderLanguage();
  render();
}

function renderLanguage() {
  const t = i18n[currentLang];
  document.documentElement.lang = t.htmlLang;
  document.title = t.pageTitle;
  document.getElementById("brand-title").textContent = t.brandTitle;
  document.getElementById("top-eyebrow").textContent = t.topEyebrow;
  document.getElementById("top-title").textContent = t.topTitle;
  document.getElementById("back-button").textContent = t.backButton;
  document.getElementById("home-link").textContent = t.homeLink;
  document.getElementById("back-entry-link").textContent = t.backEntry;
  document.getElementById("back-catalog-link").textContent = t.backCatalog;
  document.getElementById("summary-title").textContent = t.summaryTitle;
  document.getElementById("foundation-count-label").textContent = t.foundationCountLabel;
  document.getElementById("product-count-label").textContent = t.productCountLabel;
  document.getElementById("form-eyebrow").textContent = t.formEyebrow;
  document.getElementById("form-title").textContent = t.formTitle;
  document.getElementById("category-label").textContent = t.categoryLabel;
  document.getElementById("code-label").textContent = t.codeLabel;
  document.getElementById("parent-label").textContent = t.parentLabel;
  document.getElementById("status-label").textContent = t.statusLabel;
  document.getElementById("label-current-label").textContent = t.labelCurrentLabel;
  document.getElementById("notes-label").textContent = t.notesLabel;
  document.getElementById("save-code-button").textContent = t.saveButton;
  document.getElementById("reset-code-button").textContent = t.resetButton;
  document.getElementById("table-eyebrow").textContent = t.tableEyebrow;
  document.getElementById("table-title").textContent = t.tableTitle;
  document.getElementById("search-label").textContent = t.searchLabel;
  document.getElementById("filter-category-label").textContent = t.filterCategoryLabel;
  document.getElementById("filter-status-label").textContent = t.filterStatusLabel;
  document.getElementById("th-category").textContent = t.thCategory;
  document.getElementById("th-code").textContent = t.thCode;
  document.getElementById("th-parent").textContent = t.thParent;
  document.getElementById("th-label").textContent = t.thLabel;
  document.getElementById("th-status").textContent = t.thStatus;
  document.getElementById("th-notes").textContent = t.thNotes;
  document.getElementById("th-actions").textContent = t.thActions;
  const languageToggle = document.getElementById("language-toggle");
  const topbarLanguageToggle = document.getElementById("topbar-language-toggle");
  if (languageToggle) languageToggle.textContent = "中 / Es";
  if (topbarLanguageToggle) topbarLanguageToggle.textContent = "中 / Es";

  document.getElementById("code-value").placeholder = t.placeholderCode;
  document.getElementById("parent-code").placeholder = t.placeholderParent;
  document.getElementById("label-current").placeholder = t.placeholderCurrent;
  document.getElementById("code-notes").placeholder = t.placeholderNotes;
  document.getElementById("search-input").placeholder = t.searchPlaceholder;
  document.getElementById("save-code-button").textContent = editingKey ? (t.updateButton || t.saveButton) : t.saveButton;

  setSelectOptions("code-category", [
    { value: "foundation", label: t.foundation },
    { value: "product", label: t.product }
  ]);
  setSelectOptions("filter-category", [
    { value: "", label: t.all },
    { value: "foundation", label: t.foundation },
    { value: "product", label: t.product }
  ]);
  setSelectOptions("code-status", [
    { value: "active", label: t.active },
    { value: "inactive", label: t.inactive }
  ]);
  setSelectOptions("filter-status", [
    { value: "", label: t.all },
    { value: "active", label: t.active },
    { value: "inactive", label: t.inactive }
  ]);
}

function setSelectOptions(id, options) {
  const select = document.getElementById(id);
  const currentValue = select.value;
  select.innerHTML = "";
  options.forEach((option) => {
    const optionEl = document.createElement("option");
    optionEl.value = option.value;
    optionEl.textContent = option.label;
    select.appendChild(optionEl);
  });
  if ([...select.options].some((option) => option.value === currentValue)) {
    select.value = currentValue;
  }
}

async function saveCode() {
  const category = document.getElementById("code-category").value;
  const code = normalizeCode(document.getElementById("code-value").value);
  const parentCode = normalizeCode(document.getElementById("parent-code").value);
  const labelCurrent = document.getElementById("label-current").value.trim();
  const status = document.getElementById("code-status").value;
  const notes = document.getElementById("code-notes").value.trim();
  const existingItem = codebook.find((entry) => entry.category === category && entry.code === code);
  const fallbackLabel = labelCurrent || existingItem?.labelZh || existingItem?.labelEs || "";
  const resolvedLabelZh =
    currentLang === "zh"
      ? labelCurrent
      : (existingItem?.labelZh || fallbackLabel);
  const resolvedLabelEs =
    currentLang === "es"
      ? labelCurrent
      : (existingItem?.labelEs || fallbackLabel);

  if (!code || !labelCurrent) {
    document.getElementById("form-feedback").textContent = i18n[currentLang].fillRequired;
    return;
  }

  const response = await fetch("/api/codebook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      category,
      code,
      parent_code: parentCode,
      label_zh: resolvedLabelZh,
      label_es: resolvedLabelEs,
      status,
      notes
    })
  });

  if (!response.ok) {
    document.getElementById("form-feedback").textContent = i18n[currentLang].saveFailed;
    return;
  }

  codebook = await fetchCodebook();
  document.getElementById("form-feedback").textContent = editingKey ? i18n[currentLang].updateSuccess : i18n[currentLang].saveSuccess;
  editingKey = "";
  document.getElementById("save-code-button").textContent = i18n[currentLang].saveButton;
  render();
  resetForm();
}

function resetForm() {
  editingKey = "";
  document.getElementById("code-category").value = "foundation";
  document.getElementById("parent-code").value = "";
  document.getElementById("code-value").value = "";
  document.getElementById("code-status").value = "active";
  document.getElementById("label-current").value = "";
  document.getElementById("code-notes").value = "";
  document.getElementById("form-feedback").textContent = "";
  document.getElementById("save-code-button").textContent = i18n[currentLang].saveButton;
}

function normalizeCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9-]/g, "");
}

function getFilteredCodebook() {
  const search = document.getElementById("search-input").value.trim().toLowerCase();
  const category = document.getElementById("filter-category").value;
  const status = document.getElementById("filter-status").value;

  return [...codebook]
    .sort((a, b) => a.category.localeCompare(b.category) || a.code.localeCompare(b.code, undefined, { numeric: true }))
    .filter((item) => {
      const matchesSearch =
        !search ||
        item.code.toLowerCase().includes(search) ||
        (currentLang === "zh" ? item.labelZh : item.labelEs).toLowerCase().includes(search);
      const matchesCategory = !category || item.category === category;
      const matchesStatus = !status || item.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
}

function getLocalizedNotes(notes) {
  const raw = String(notes || "").trim();
  if (!raw) return "";
  const match = raw.match(/^ZH:\s*([\s\S]*?)\s+ES:\s*([\s\S]*)$/);
  if (!match) return raw;
  return currentLang === "zh" ? match[1].trim() : match[2].trim();
}

function render() {
  const rows = getFilteredCodebook();
  const tbody = document.getElementById("codebook-body");
  tbody.innerHTML = "";

  if (!serviceAvailable) {
    document.getElementById("codebook-empty").textContent = i18n[currentLang].serviceUnavailable;
    document.getElementById("codebook-empty").style.display = "block";
    document.getElementById("foundation-count").textContent = "-";
    document.getElementById("product-count").textContent = "-";
    return;
  }

  rows.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(item.category === "foundation" ? i18n[currentLang].foundation : i18n[currentLang].product)}</td>
      <td>${escapeHtml(item.parentCode || "-")}</td>
      <td><span class="code-pill">${escapeHtml(item.code)}</span></td>
      <td>${escapeHtml((currentLang === "zh" ? item.labelZh : item.labelEs) || "-")}</td>
      <td><span class="status-pill">${escapeHtml(item.status === "active" ? i18n[currentLang].active : i18n[currentLang].inactive)}</span></td>
      <td>${escapeHtml(getLocalizedNotes(item.notes) || "-")}</td>
      <td>
        <div class="table-actions">
          <button class="secondary-button mini-button" type="button" data-edit-category="${escapeHtml(item.category)}" data-edit-code="${escapeHtml(item.code)}">${currentLang === "zh" ? "编辑" : "Editar"}</button>
          <button class="secondary-button mini-button" type="button" data-delete-category="${escapeHtml(item.category)}" data-delete-code="${escapeHtml(item.code)}">${currentLang === "zh" ? "删除" : "Eliminar"}</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll("[data-edit-code]").forEach((button) => {
    button.addEventListener("click", () => startEdit(button.dataset.editCategory, button.dataset.editCode));
  });
  tbody.querySelectorAll("[data-delete-code]").forEach((button) => {
    button.addEventListener("click", () => deleteCode(button.dataset.deleteCategory, button.dataset.deleteCode));
  });

  document.getElementById("codebook-empty").textContent = i18n[currentLang].empty;
  document.getElementById("codebook-empty").style.display = rows.length ? "none" : "block";
  document.getElementById("foundation-count").textContent = String(codebook.filter((item) => item.category === "foundation").length);
  document.getElementById("product-count").textContent = String(codebook.filter((item) => item.category === "product").length);
}

function startEdit(category, code) {
  const item = codebook.find((entry) => entry.category === category && entry.code === code);
  if (!item) return;

  editingKey = `${category}:${code}`;
  document.getElementById("code-category").value = item.category;
  document.getElementById("parent-code").value = item.parentCode || "";
  document.getElementById("code-value").value = item.code;
  document.getElementById("code-status").value = item.status;
  document.getElementById("label-current").value = currentLang === "zh" ? item.labelZh : item.labelEs;
  document.getElementById("code-notes").value = getLocalizedNotes(item.notes) || "";
  document.getElementById("save-code-button").textContent = i18n[currentLang].updateButton || i18n[currentLang].saveButton;
  document.getElementById("form-feedback").textContent = "";
}

async function deleteCode(category, code) {
  const confirmed = window.confirm(currentLang === "zh" ? `确定删除编码 ${code} 吗？` : `¿Eliminar el código ${code}?`);
  if (!confirmed) return;

  const response = await fetch(`/api/codebook?category=${encodeURIComponent(category)}&code=${encodeURIComponent(code)}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    document.getElementById("form-feedback").textContent = currentLang === "zh" ? "删除失败。" : "No se pudo eliminar.";
    return;
  }

  codebook = await fetchCodebook();
  if (editingKey === `${category}:${code}`) {
    resetForm();
  }
  document.getElementById("form-feedback").textContent = i18n[currentLang].deleteSuccess;
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
