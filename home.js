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

const elements = {
  backupFileInput: document.getElementById("backup-file-input"),
  backupStatus: document.getElementById("backup-status"),
  backupMetrics: document.querySelector(".home-backup-metrics"),
  backupRestoreField: document.querySelector(".home-backup-restore-field"),
  backupListBlock: document.querySelector(".home-backup-list-block"),
  backupList: document.getElementById("backup-list"),
  backupSummaryValue: document.getElementById("backup-summary-value"),
  createBackupButton: document.getElementById("create-backup-button"),
  downloadSelectedBackupButton: document.getElementById("download-selected-backup-button"),
  downloadJsonBackupButton: document.getElementById("download-json-backup-button"),
  restoreSelect: document.getElementById("backup-restore-select"),
  restoreButton: document.getElementById("restore-backup-button"),
  cancelRestoreButton: document.getElementById("cancel-restore-button"),
  importJsonBackupButton: document.getElementById("import-json-backup-button"),
  importDbBackupButton: document.getElementById("import-db-backup-button"),
  backupRestoreNote: document.getElementById("backup-restore-note")
};

const state = {
  currentLang: getInitialLanguage(),
  backup: {
    supported: null,
    loading: false,
    busy: "",
    snapshots: [],
    latestAuto: null,
    latestManual: null,
    retention: 0,
    autoIntervalSeconds: 0,
    selectedSnapshotId: "",
    restoreArmed: false
  }
};

const BACKUP_SLOT_ORDER = ["auto-1", "auto-2", "manual-1", "manual-2"];

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
    backupCardEyebrow: "",
    backupCardTitle: "数据安全",
    backupCardCopy: "",
    backupLegacyCopy: "",
    backupSummaryLabel: "状态",
    backupSummaryReady: "已自动保存",
    backupSummaryEmpty: "暂无保存记录",
    backupSummaryLegacy: "可手动保存",
    backupManage: "管理保存记录",
    backupLatestAutoLabel: "最近自动",
    backupLatestManualLabel: "最近手动",
    backupCountLabel: "记录数",
    backupCreate: "立即备份",
    backupDownloadSelected: "下载这份记录",
    backupDownloadJson: "下载 JSON",
    backupRestoreLabel: "选择一份记录",
    backupPrepareRestore: "恢复这份记录",
    backupConfirmRestore: "确认恢复",
    backupCancelRestore: "取消",
    backupImportJson: "读取旧 JSON",
    backupImportDb: "读取 DB",
    backupImportDbBusy: "正在读取 DB…",
    backupImportedDb: "DB 已读取",
    backupImportDbFailed: "DB 读取失败",
    backupListEyebrow: "",
    backupListTitle: "保存记录",
    backupSlotAuto1: "自动保存 1",
    backupSlotAuto2: "自动保存 2",
    backupSlotManual1: "手动保存 1",
    backupSlotManual2: "手动保存 2",
    backupDefaultNote: "",
    backupEmptyNote: "",
    backupLegacyNote: "",
    backupRestoreWarning: "恢复后，当前内容会回到这份记录。",
    backupNoData: "尚无",
    backupNoList: "还没有保存记录",
    backupSourceAuto: "自动",
    backupSourceManual: "手动",
    backupSourceBeforeRestore: "恢复前",
    backupSourceBeforeJsonImport: "导入前",
    backupSourceFallback: "记录",
    backupLoading: "正在读取快照…",
    backupLoadFailed: "快照读取失败",
    backupCreateBusy: "正在创建快照…",
    backupCreated: "已创建新快照",
    backupCreateFailed: "创建快照失败",
    backupDownloadBusy: "正在准备下载…",
    backupDownloaded: "已开始下载",
    backupImportBusy: "正在读取 JSON…",
    backupImported: "JSON 已读取",
    backupImportFailed: "JSON 读取失败",
    backupRestorePrepared: "已进入恢复确认",
    backupRestoreBusy: "正在恢复快照…",
    backupRestored: "已恢复，恢复前快照已另存",
    backupRestoreFailed: "恢复失败",
    backupCancelled: "已取消",
    backupDesktopLegacyStatus: "当前环境暂不支持服务器快照"
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
    backupCardEyebrow: "",
    backupCardTitle: "Seguridad de datos",
    backupCardCopy: "",
    backupLegacyCopy: "",
    backupSummaryLabel: "Estado",
    backupSummaryReady: "Guardado automático activo",
    backupSummaryEmpty: "Todavía no hay registros",
    backupSummaryLegacy: "Se puede guardar manualmente",
    backupManage: "Gestionar guardados",
    backupLatestAutoLabel: "Último automático",
    backupLatestManualLabel: "Último manual",
    backupCountLabel: "Registros",
    backupCreate: "Crear copia ahora",
    backupDownloadSelected: "Descargar este registro",
    backupDownloadJson: "Descargar JSON",
    backupRestoreLabel: "Elegir un registro",
    backupPrepareRestore: "Restaurar este registro",
    backupConfirmRestore: "Confirmar restauración",
    backupCancelRestore: "Cancelar",
    backupImportJson: "Abrir JSON antiguo",
    backupImportDb: "Abrir DB",
    backupImportDbBusy: "Abriendo DB…",
    backupImportedDb: "DB importada",
    backupImportDbFailed: "No se pudo importar la DB",
    backupListEyebrow: "",
    backupListTitle: "Registros guardados",
    backupSlotAuto1: "Guardado automático 1",
    backupSlotAuto2: "Guardado automático 2",
    backupSlotManual1: "Guardado manual 1",
    backupSlotManual2: "Guardado manual 2",
    backupDefaultNote: "",
    backupEmptyNote: "",
    backupLegacyNote: "",
    backupRestoreWarning: "Al restaurar, el contenido actual volverá a este registro.",
    backupNoData: "Sin copia",
    backupNoList: "Todavía no hay registros",
    backupSourceAuto: "Automática",
    backupSourceManual: "Manual",
    backupSourceBeforeRestore: "Antes de restaurar",
    backupSourceBeforeJsonImport: "Antes de importar",
    backupSourceFallback: "Registro",
    backupLoading: "Cargando instantáneas…",
    backupLoadFailed: "No se pudieron cargar las instantáneas",
    backupCreateBusy: "Creando instantánea…",
    backupCreated: "Nueva instantánea guardada",
    backupCreateFailed: "No se pudo crear la instantánea",
    backupDownloadBusy: "Preparando descarga…",
    backupDownloaded: "La descarga ha comenzado",
    backupImportBusy: "Abriendo JSON…",
    backupImported: "JSON importado",
    backupImportFailed: "No se pudo importar el JSON",
    backupRestorePrepared: "La restauración está lista para confirmar",
    backupRestoreBusy: "Restaurando instantánea…",
    backupRestored: "Restauración completada; se guardó una copia previa",
    backupRestoreFailed: "No se pudo restaurar la instantánea",
    backupCancelled: "Cancelada",
    backupDesktopLegacyStatus: "Este entorno todavía no admite instantáneas del servidor"
  }
};

document.getElementById("home-language-toggle")?.addEventListener("click", toggleLanguage);
elements.createBackupButton?.addEventListener("click", createBackupSnapshot);
elements.downloadSelectedBackupButton?.addEventListener("click", downloadSelectedSnapshot);
elements.downloadJsonBackupButton?.addEventListener("click", downloadJsonBackup);
elements.restoreSelect?.addEventListener("change", handleSnapshotSelection);
elements.restoreButton?.addEventListener("click", handleRestoreAction);
elements.cancelRestoreButton?.addEventListener("click", cancelRestore);
elements.importJsonBackupButton?.addEventListener("click", openJsonBackup);
elements.importDbBackupButton?.addEventListener("click", openDbBackup);
elements.backupFileInput?.addEventListener("change", importJsonBackup);
elements.backupList?.addEventListener("click", handleSnapshotListClick);

render();
void loadBackupSnapshots();

function toggleLanguage() {
  state.currentLang = state.currentLang === "zh" ? "es" : "zh";
  persistLanguage(state.currentLang);
  render();
}

function render() {
  const copy = getCopy();
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
  setText("home-language-toggle", "中 / Es");

  renderBackupPanel();
}

function renderBackupPanel() {
  const copy = getCopy();
  const { backup } = state;
  const supportsSnapshots = backup.supported !== false;
  const selectedSnapshot = getSelectedSnapshot();
  const isBusy = Boolean(backup.busy) || backup.loading;

  setText("backup-card-eyebrow", copy.backupCardEyebrow);
  setText("backup-card-title", copy.backupCardTitle);
  setText("backup-card-copy", supportsSnapshots ? copy.backupCardCopy : copy.backupLegacyCopy);
  setText("backup-summary-label", copy.backupSummaryLabel);
  setText("backup-summary-value", getBackupSummaryText());
  setText("backup-details-summary", copy.backupManage);
  setText("backup-latest-auto-label", copy.backupLatestAutoLabel);
  setText("backup-latest-manual-label", copy.backupLatestManualLabel);
  setText("backup-count-label", copy.backupCountLabel);
  setText("create-backup-button", copy.backupCreate);
  setText("download-selected-backup-button", copy.backupDownloadSelected);
  setText("download-json-backup-button", copy.backupDownloadJson);
  setText("backup-restore-label", copy.backupRestoreLabel);
  setText("restore-backup-button", backup.restoreArmed ? copy.backupConfirmRestore : copy.backupPrepareRestore);
  setText("cancel-restore-button", copy.backupCancelRestore);
  setText("import-json-backup-button", copy.backupImportJson);
  setText("import-db-backup-button", copy.backupImportDb);
  setText("backup-list-eyebrow", copy.backupListEyebrow);
  setText("backup-list-title", copy.backupListTitle);

  setText("backup-latest-auto-value", formatSnapshotLabel(backup.latestAuto));
  setText("backup-latest-manual-value", formatSnapshotLabel(backup.latestManual));
  setText("backup-count-value", supportsSnapshots ? String(backup.snapshots.length) : "—");

  if (elements.restoreSelect) {
    syncRestoreSelect();
  }

  setHidden(elements.backupMetrics, !supportsSnapshots);
  setHidden(elements.createBackupButton, !supportsSnapshots);
  setHidden(elements.downloadSelectedBackupButton, !supportsSnapshots);
  setHidden(elements.backupRestoreField, !supportsSnapshots);
  setHidden(elements.backupListBlock, !supportsSnapshots);
  setHidden(elements.cancelRestoreButton, !backup.restoreArmed || !supportsSnapshots);

  toggleDisabled(elements.createBackupButton, !supportsSnapshots || isBusy);
  toggleDisabled(elements.downloadSelectedBackupButton, !supportsSnapshots || !selectedSnapshot || isBusy);
  toggleDisabled(elements.downloadJsonBackupButton, isBusy);
  toggleDisabled(elements.restoreSelect, !supportsSnapshots || backup.snapshots.length === 0 || isBusy);
  toggleDisabled(elements.restoreButton, !supportsSnapshots || !selectedSnapshot || isBusy);
  toggleDisabled(elements.cancelRestoreButton, isBusy);
  toggleDisabled(elements.importJsonBackupButton, isBusy);

  elements.restoreButton?.classList.toggle("warning-button", backup.restoreArmed);
  elements.restoreButton?.classList.toggle("secondary-button", !backup.restoreArmed);

  if (!elements.backupStatus?.textContent && backup.loading) {
    setStatus(copy.backupLoading);
  }

  const noteText = backup.restoreArmed ? copy.backupRestoreWarning : "";
  setText("backup-restore-note", noteText);

  renderBackupList();
}

function renderBackupList() {
  if (!elements.backupList) return;

  const copy = getCopy();
  const { backup } = state;

  if (backup.supported === false) {
    elements.backupList.innerHTML = "";
    return;
  }

  const selectedId = backup.selectedSnapshotId;
  const slots = getRenderableBackupSlots();
  elements.backupList.innerHTML = slots
    .map((snapshot) => {
      const isEmpty = !snapshot?.id;
      const activeClass = snapshot?.id && snapshot.id === selectedId ? " is-selected" : "";
      return `
        <button
          type="button"
          class="home-backup-item${activeClass}"
          ${snapshot?.id ? `data-snapshot-id="${escapeHtml(snapshot.id)}"` : ""}
          ${isEmpty ? "disabled" : ""}
        >
          <div class="home-backup-item-top">
            <span class="home-backup-source">${escapeHtml(formatSnapshotSlot(snapshot))}</span>
            <span class="home-backup-size">${escapeHtml(isEmpty ? copy.backupNoData : formatBytes(snapshot.size_bytes))}</span>
          </div>
          <div class="home-backup-item-body">
            <strong>${escapeHtml(isEmpty ? copy.backupNoData : formatSnapshotDate(snapshot.created_at))}</strong>
          </div>
        </button>
      `;
    })
    .join("");
}

async function loadBackupSnapshots() {
  const copy = getCopy();
  state.backup.loading = true;
  renderBackupPanel();

  try {
    const payload = await requestJson("/api/backup-snapshots");
    state.backup.supported = true;
    applyBackupSummary(payload);
    setStatus("");
  } catch (error) {
    console.error(error);
    if (error?.status === 404 || error?.status === 405) {
      state.backup.supported = false;
      state.backup.snapshots = [];
      state.backup.latestAuto = null;
      state.backup.latestManual = null;
      state.backup.selectedSnapshotId = "";
      state.backup.restoreArmed = false;
      setStatus(copy.backupDesktopLegacyStatus);
    } else {
      state.backup.supported = state.backup.supported === null ? true : state.backup.supported;
      setStatus(copy.backupLoadFailed);
    }
  } finally {
    state.backup.loading = false;
    renderBackupPanel();
  }
}

async function createBackupSnapshot() {
  const copy = getCopy();
  if (state.backup.supported === false || state.backup.busy) return;

  state.backup.busy = "create";
  state.backup.restoreArmed = false;
  setStatus(copy.backupCreateBusy);
  renderBackupPanel();

  try {
    const payload = await requestJson("/api/backup-snapshots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "manual" })
    });
    state.backup.supported = true;
    applyBackupSummary(payload);
    state.backup.selectedSnapshotId = payload?.snapshot?.id || state.backup.selectedSnapshotId;
    setStatus(copy.backupCreated);
  } catch (error) {
    console.error(error);
    setStatus(copy.backupCreateFailed);
  } finally {
    state.backup.busy = "";
    renderBackupPanel();
  }
}

function downloadSelectedSnapshot() {
  const copy = getCopy();
  const snapshot = getSelectedSnapshot();
  if (!snapshot || state.backup.supported === false || state.backup.busy) return;

  setStatus(copy.backupDownloadBusy);
  triggerBrowserDownload(`/api/backup-file?snapshot_id=${encodeURIComponent(snapshot.id)}`);
  setStatus(copy.backupDownloaded);
}

async function downloadJsonBackup() {
  const copy = getCopy();
  if (state.backup.busy === "import-json") return;

  if (desktopBridge?.downloadBackup) {
    setStatus(copy.backupDownloadBusy);
    const result = await desktopBridge.downloadBackup({ suggestedName: "copia-de-seguridad-lera.json" });
    handleDesktopLegacyStatus(result?.status);
    return;
  }

  setStatus(copy.backupDownloadBusy);
  triggerBrowserDownload("/api/backup");
  setStatus(copy.backupDownloaded);
}

async function openJsonBackup() {
  const copy = getCopy();
  if (state.backup.busy) return;

  if (desktopBridge?.importBackup && state.backup.supported === false) {
    setStatus(copy.backupImportBusy);
    const result = await desktopBridge.importBackup();
    handleDesktopLegacyStatus(result?.status);
    return;
  }

  elements.backupFileInput?.click();
}

async function openDbBackup() {
  const copy = getCopy();
  if (state.backup.busy) return;

  if (desktopBridge?.importBackupDb && state.backup.supported === false) {
    setStatus(copy.backupImportDbBusy);
    const result = await desktopBridge.importBackupDb();
    handleDesktopLegacyStatus(result?.status);
    return;
  }

  elements.backupFileInput?.click();
}

async function importJsonBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const copy = getCopy();
  state.backup.busy = "import-json";
  state.backup.restoreArmed = false;
  setStatus(isDbBackupFile(file) ? copy.backupImportDbBusy : copy.backupImportBusy);
  renderBackupPanel();

  try {
    if (isDbBackupFile(file)) {
      const arrayBuffer = await file.arrayBuffer();
      const payload = await requestJson("/api/backup-restore-db", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream", "X-Backup-Filename": file.name },
        body: arrayBuffer
      });
      applyBackupSummary(payload);
      setStatus(copy.backupImportedDb);
    } else {
      const text = await file.text();
      const payload = JSON.parse(text);
      await requestJson("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setStatus(copy.backupImported);
    }
    if (state.backup.supported !== false) {
      await loadBackupSnapshots();
    }
  } catch (error) {
    console.error(error);
    setStatus(isDbBackupFile(file) ? copy.backupImportDbFailed : copy.backupImportFailed);
  } finally {
    state.backup.busy = "";
    if (event.target) event.target.value = "";
    renderBackupPanel();
  }
}

function isDbBackupFile(file) {
  const name = String(file?.name || "").toLowerCase();
  return name.endsWith(".db") || file?.type === "application/x-sqlite3";
}

function handleSnapshotSelection(event) {
  state.backup.selectedSnapshotId = event.target.value || "";
  state.backup.restoreArmed = false;
  renderBackupPanel();
}

function handleSnapshotListClick(event) {
  const button = event.target.closest("[data-snapshot-id]");
  if (!button) return;
  state.backup.selectedSnapshotId = button.dataset.snapshotId || "";
  state.backup.restoreArmed = false;
  renderBackupPanel();
}

async function handleRestoreAction() {
  const copy = getCopy();
  const snapshot = getSelectedSnapshot();
  if (!snapshot || state.backup.supported === false || state.backup.busy) return;

  if (!state.backup.restoreArmed) {
    state.backup.restoreArmed = true;
    setStatus(copy.backupRestorePrepared);
    renderBackupPanel();
    return;
  }

  state.backup.busy = "restore";
  setStatus(copy.backupRestoreBusy);
  renderBackupPanel();

  try {
    const payload = await requestJson("/api/backup-restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ snapshot_id: snapshot.id })
    });
    state.backup.supported = true;
    state.backup.restoreArmed = false;
    applyBackupSummary(payload);
    setStatus(copy.backupRestored);
  } catch (error) {
    console.error(error);
    setStatus(copy.backupRestoreFailed);
  } finally {
    state.backup.busy = "";
    renderBackupPanel();
  }
}

function cancelRestore() {
  state.backup.restoreArmed = false;
  setStatus(getCopy().backupCancelled);
  renderBackupPanel();
}

function applyBackupSummary(payload) {
  const snapshots = normalizeSnapshotOrder(Array.isArray(payload?.snapshots) ? payload.snapshots : []);
  const selectedStillExists = snapshots.some((item) => item.id === state.backup.selectedSnapshotId);

  state.backup.snapshots = snapshots;
  state.backup.latestAuto = payload?.latest_auto || null;
  state.backup.latestManual = payload?.latest_manual || null;
  state.backup.retention = Number(payload?.retention || 0);
  state.backup.autoIntervalSeconds = Number(payload?.auto_interval_seconds || 0);

  if (selectedStillExists) {
    return;
  }

  state.backup.selectedSnapshotId = snapshots[0]?.id || "";
}

function syncRestoreSelect() {
  if (!elements.restoreSelect) return;

  const copy = getCopy();
  const { restoreSelect } = elements;
  const previousValue = state.backup.selectedSnapshotId;
  restoreSelect.innerHTML = "";

  const filledSnapshots = state.backup.snapshots.filter((snapshot) => snapshot?.id);
  if (!filledSnapshots.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = copy.backupNoList;
    restoreSelect.append(option);
    restoreSelect.value = "";
    return;
  }

  for (const snapshot of filledSnapshots) {
    const option = document.createElement("option");
    option.value = snapshot.id;
    option.textContent = `${formatSnapshotSlot(snapshot)} · ${formatSnapshotDate(snapshot.created_at)}`;
    restoreSelect.append(option);
  }

  restoreSelect.value = filledSnapshots.some((item) => item.id === previousValue)
    ? previousValue
    : filledSnapshots[0].id;
  state.backup.selectedSnapshotId = restoreSelect.value;
}

function getSelectedSnapshot() {
  return state.backup.snapshots.find((item) => item.id === state.backup.selectedSnapshotId) || null;
}

function getBackupSummaryText() {
  const copy = getCopy();
  if (state.backup.supported === false) return copy.backupSummaryLegacy;
  if (state.backup.latestAuto || state.backup.latestManual) return copy.backupSummaryReady;
  return copy.backupSummaryEmpty;
}

function getCopy() {
  return i18n[state.currentLang];
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function setStatus(text) {
  if (elements.backupStatus) {
    elements.backupStatus.textContent = text || "";
  }
}

function setHidden(element, hidden) {
  if (!element) return;
  element.hidden = Boolean(hidden);
}

function toggleDisabled(element, disabled) {
  if (!element) return;
  element.disabled = Boolean(disabled);
}

function formatSnapshotLabel(snapshot) {
  if (!snapshot) return getCopy().backupNoData;
  return formatSnapshotDate(snapshot.created_at);
}

function formatSnapshotDate(value) {
  if (!value) return getCopy().backupNoData;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return getCopy().backupNoData;
  return new Intl.DateTimeFormat(state.currentLang === "zh" ? "zh-CN" : "es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatSnapshotSource(source) {
  const copy = getCopy();
  const normalized = String(source || "").trim().toLowerCase();

  if (normalized === "auto") return copy.backupSourceAuto;
  if (normalized === "manual") return copy.backupSourceManual;
  if (normalized === "before-restore") return copy.backupSourceBeforeRestore;
  if (normalized === "before-json-import") return copy.backupSourceBeforeJsonImport;
  return copy.backupSourceFallback;
}

function formatSnapshotSlot(snapshot) {
  const copy = getCopy();
  const slotName = String(snapshot?.slot_name || "").trim().toLowerCase();
  const kind = String(snapshot?.slot_kind || snapshot?.source || "").trim().toLowerCase();
  const index = Number(snapshot?.slot_index || 0);
  if (slotName === "auto-1") return copy.backupSlotAuto1;
  if (slotName === "auto-2") return copy.backupSlotAuto2;
  if (slotName === "manual-1") return copy.backupSlotManual1;
  if (slotName === "manual-2") return copy.backupSlotManual2;
  if (kind === "auto" && index === 1) return copy.backupSlotAuto1;
  if (kind === "auto" && index === 2) return copy.backupSlotAuto2;
  if (kind === "manual" && index === 1) return copy.backupSlotManual1;
  if (kind === "manual" && index === 2) return copy.backupSlotManual2;
  return formatSnapshotSource(kind);
}

function normalizeSnapshotOrder(snapshots) {
  return [...snapshots].sort((left, right) => {
    const leftIndex = BACKUP_SLOT_ORDER.indexOf(String(left?.slot_name || "").toLowerCase());
    const rightIndex = BACKUP_SLOT_ORDER.indexOf(String(right?.slot_name || "").toLowerCase());
    return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
  });
}

function getRenderableBackupSlots() {
  const bySlot = new Map(
    state.backup.snapshots.map((snapshot) => [String(snapshot?.slot_name || "").toLowerCase(), snapshot])
  );
  return BACKUP_SLOT_ORDER.map((slotName) => bySlot.get(slotName) || { slot_name: slotName });
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  let amount = bytes;
  while (amount >= 1024 && index < units.length - 1) {
    amount /= 1024;
    index += 1;
  }

  const locale = state.currentLang === "zh" ? "zh-CN" : "es-ES";
  const digits = amount >= 100 || index === 0 ? 0 : 1;
  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(amount)} ${units[index]}`;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  let payload = null;

  try {
    payload = contentType.includes("application/json") ? await response.json() : await response.text();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && (payload.error || payload.message)) ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  if (payload && typeof payload === "object") {
    return payload;
  }

  return {};
}

function triggerBrowserDownload(url) {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
}

function handleDesktopLegacyStatus(status) {
  const copy = getCopy();
  const mapping = {
    downloaded: copy.backupDownloaded,
    imported: copy.backupImported,
    cancelled: copy.backupCancelled,
    failed: copy.backupImportFailed
  };
  setStatus(mapping[status] || copy.backupCancelled);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
