const HOME_LANGUAGE_KEY = "lera-ui-language";
const LEGACY_HOME_LANGUAGE_KEY = "restaurant-database-language";
const desktopBridge = window.leraDesktop || null;

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem(HOME_LANGUAGE_KEY) || localStorage.getItem(LEGACY_HOME_LANGUAGE_KEY);
    return stored === "zh" ? "zh" : "es";
  } catch {
    return "es";
  }
}

function persistLanguage(lang) {
  try {
    localStorage.setItem(HOME_LANGUAGE_KEY, lang);
    localStorage.setItem(LEGACY_HOME_LANGUAGE_KEY, lang);
  } catch {}
}

const state = {
  currentLang: getInitialLanguage()
};

const backupInputEl = document.getElementById("backup-file-input");
const backupStatusEl = document.getElementById("backup-status");

const i18n = {
  zh: {
    htmlLang: "zh-CN",
    title: "Lera · 工具主页",
    eyebrow: "Lera 方法论",
    homeTitle: "工具总入口",
    homeCopy: "",
    homeStageEyebrow: "",
    homeStageTitle: "",
    methodologyEyebrow: "",
    methodologyTitle: "菜品流程",
    methodologyCopy: "",
    entryEyebrow: "",
    entryTitle: "菜品录入",
    entryCopy: "",
    looseRecipeOpen: "零散菜谱记录",
    bridgeEyebrow: "",
    bridgeTitle: "原材料研究",
    bridgeCopy: "",
    directoryEyebrow: "",
    directoryTitle: "",
    catalogEyebrow: "",
    catalogTitle: "菜品与菜谱",
    catalogCopy: "",
    methodologyListEyebrow: "",
    methodologyListTitle: "方法论记录",
    methodologyListCopy: "",
    codebookEyebrow: "",
    codebookTitle: "代码管理",
    codebookCopy: "",
    open: "打开",
    downloadBackup: "下载",
    importBackup: "读取",
    backupIdle: "",
    backupDownloading: "正在准备备份…",
    backupDownloaded: "已下载",
    backupImporting: "正在读取备份…",
    backupSuccess: "已读取",
    backupFailed: "失败",
    backupCancelled: "已取消"
  },
  es: {
    htmlLang: "es",
    title: "Lera · Portal de herramientas",
    eyebrow: "Metodología Lera",
    homeTitle: "Portal de trabajo",
    homeCopy: "",
    homeStageEyebrow: "",
    homeStageTitle: "",
    methodologyEyebrow: "",
    methodologyTitle: "Flujo del plato",
    methodologyCopy: "",
    entryEyebrow: "",
    entryTitle: "Registro de platos",
    entryCopy: "",
    looseRecipeOpen: "Nueva receta suelta",
    bridgeEyebrow: "",
    bridgeTitle: "Investigación de materia prima",
    bridgeCopy: "",
    directoryEyebrow: "",
    directoryTitle: "",
    catalogEyebrow: "",
    catalogTitle: "Platos y recetas",
    catalogCopy: "",
    methodologyListEyebrow: "",
    methodologyListTitle: "Registro metodológico",
    methodologyListCopy: "",
    codebookEyebrow: "",
    codebookTitle: "Códigos",
    codebookCopy: "",
    open: "Abrir",
    downloadBackup: "Descargar",
    importBackup: "Abrir",
    backupIdle: "",
    backupDownloading: "Preparando la copia de seguridad…",
    backupDownloaded: "Descargada",
    backupImporting: "Abriendo la copia de seguridad…",
    backupSuccess: "Importada",
    backupFailed: "Error",
    backupCancelled: "Cancelada"
  }
};

document.getElementById("home-language-toggle").addEventListener("click", toggleLanguage);
document.getElementById("download-backup-button").addEventListener("click", downloadBackup);
document.getElementById("import-backup-button").addEventListener("click", openBackup);
backupInputEl?.addEventListener("change", importBackup);

render();

function toggleLanguage() {
  state.currentLang = state.currentLang === "zh" ? "es" : "zh";
  persistLanguage(state.currentLang);
  render();
}

function render() {
  const copy = i18n[state.currentLang];
  document.documentElement.lang = copy.htmlLang;
  document.title = copy.title;
  setText("home-eyebrow", copy.eyebrow);
  setText("home-title", copy.homeTitle);
  setText("home-copy", copy.homeCopy);
  setText("home-stage-eyebrow", copy.homeStageEyebrow);
  setText("home-stage-title", copy.homeStageTitle);
  setText("methodology-card-eyebrow", copy.methodologyEyebrow);
  setText("methodology-card-title", copy.methodologyTitle);
  setText("methodology-card-copy", copy.methodologyCopy);
  setText("entry-card-eyebrow", copy.entryEyebrow);
  setText("entry-card-title", copy.entryTitle);
  setText("entry-card-copy", copy.entryCopy);
  setText("bridge-card-eyebrow", copy.bridgeEyebrow);
  setText("bridge-card-title", copy.bridgeTitle);
  setText("bridge-card-copy", copy.bridgeCopy);
  setText("directory-eyebrow", copy.directoryEyebrow);
  setText("directory-title", copy.directoryTitle);
  setText("catalog-card-eyebrow", copy.catalogEyebrow);
  setText("catalog-card-title", copy.catalogTitle);
  setText("catalog-card-copy", copy.catalogCopy);
  setText("methodology-list-eyebrow", copy.methodologyListEyebrow);
  setText("methodology-list-title", copy.methodologyListTitle);
  setText("methodology-list-copy", copy.methodologyListCopy);
  setText("codebook-card-eyebrow", copy.codebookEyebrow);
  setText("codebook-card-title", copy.codebookTitle);
  setText("codebook-card-copy", copy.codebookCopy);
  setText("methodology-card-link", copy.open);
  setText("entry-card-link", copy.open);
  setText("loose-recipe-card-link", copy.looseRecipeOpen);
  setText("bridge-card-link", copy.open);
  setText("catalog-card-link", copy.open);
  setText("methodology-list-link", copy.open);
  setText("codebook-card-link", copy.open);
  setText("download-backup-button", copy.downloadBackup);
  setText("import-backup-button", copy.importBackup);
  setText("home-language-toggle", "中 / Es");
  setStatus("backup-status", copy.backupIdle);
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function setStatus(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

async function downloadBackup() {
  if (desktopBridge?.downloadBackup) {
    setStatus("backup-status", i18n[state.currentLang].backupDownloading);
    const result = await desktopBridge.downloadBackup({ suggestedName: "copia-de-seguridad-lera.json" });
    handleDesktopBackupStatus(result?.status);
    return;
  }
  window.location.href = "/api/backup";
}

async function openBackup() {
  if (desktopBridge?.importBackup) {
    setStatus("backup-status", i18n[state.currentLang].backupImporting);
    const result = await desktopBridge.importBackup();
    handleDesktopBackupStatus(result?.status);
    return;
  }
  backupInputEl.click();
}

async function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    setStatus("backup-status", i18n[state.currentLang].backupImporting);
    const text = await file.text();
    const payload = JSON.parse(text);
    const response = await fetch("/api/backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error("Import failed");
    setStatus("backup-status", i18n[state.currentLang].backupSuccess);
  } catch (error) {
    console.error(error);
    setStatus("backup-status", i18n[state.currentLang].backupFailed);
  } finally {
    event.target.value = "";
  }
}

function handleDesktopBackupStatus(status) {
  const copy = i18n[state.currentLang];
  if (!status) return;

  const mapping = {
    downloaded: copy.backupDownloaded,
    imported: copy.backupSuccess,
    cancelled: copy.backupCancelled,
    failed: copy.backupFailed
  };

  setStatus("backup-status", mapping[status] || copy.backupIdle);
}
