const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("leraDesktop", {
  isDesktop: true,
  request: (request) => ipcRenderer.invoke("lera:request", request),
  downloadBackup: (options) => ipcRenderer.invoke("lera:backup-download", options || {}),
  importBackup: () => ipcRenderer.invoke("lera:backup-import"),
  importBackupDb: () => ipcRenderer.invoke("lera:backup-import-db"),
  saveCurrentWindowPdf: (options) => ipcRenderer.invoke("lera:save-current-window-pdf", options || {}),
  printCurrentWindow: () => ipcRenderer.invoke("lera:print-current-window"),
  closeCurrentWindow: () => ipcRenderer.invoke("lera:close-current-window")
});
