const path = require("node:path");
const fs = require("node:fs");
const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const { createDesktopApi } = require("./api");

let mainWindow = null;
let desktopApi = null;
const isSmokeMode = process.argv.includes("--smoke");
const windowWebPreferences = {
  preload: path.join(__dirname, "preload.js"),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: false
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1180,
    minHeight: 780,
    backgroundColor: "#f6efe4",
    title: "Lera",
    webPreferences: windowWebPreferences
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const target = new URL(url);
      if (target.protocol === "file:") {
        return {
          action: "allow",
          overrideBrowserWindowOptions: {
            width: 1320,
            height: 900,
            minWidth: 1100,
            minHeight: 760,
            backgroundColor: "#f6efe4",
            title: "Lera",
            parent: mainWindow,
            webPreferences: windowWebPreferences
          }
        };
      }
    } catch {}
    return { action: "deny" };
  });

  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));
}

async function runSmokeInPackagedApp() {
  const win = new BrowserWindow({
    show: false,
    width: 1280,
    height: 900,
    webPreferences: windowWebPreferences
  });

  await win.loadFile(path.join(__dirname, "..", "index.html"));

  const result = await win.webContents.executeJavaScript(`
    (async () => {
      const smokeCode = "2099-FA1-PA1-P-1-001";
      const dishPayload = {
        draft_key: "smoke-packaged-1",
        dish_code: smokeCode,
        year_code: 2099,
        foundation_code: "FA1",
        product_code: "PA1",
        season_code: "P",
        month_no: 1,
        seq_no: 1,
        dish_name: "Smoke Dish",
        recipe_text: "",
        methodology_main_code: "2099-001",
        methodology_version_code: "",
        notes: "packaged smoke",
        methodology_records: [
          {
            methodology_main_code: "2099-001",
            methodology_version_code: "",
            methodology_event_code: "",
            methodology_record_type: "project"
          }
        ]
      };

      const backupBefore = await fetch("/api/backup").then((res) => res.json());
      const health = await fetch("/api/health").then((res) => res.json());
      const saveResult = await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dishPayload)
      }).then((res) => res.json());
      const dishesAfterSave = await fetch("/api/dishes").then((res) => res.json());
      const deleteResult = await fetch("/api/dishes?dish_code=" + encodeURIComponent(smokeCode), {
        method: "DELETE"
      }).then((res) => res.json());
      const dishesAfterDelete = await fetch("/api/dishes").then((res) => res.json());
      const importResult = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupBefore)
      }).then((res) => res.json());

      return {
        title: document.title,
        desktopBridge: !!window.leraDesktop?.isDesktop,
        health,
        saveResult,
        dishesAfterSave: dishesAfterSave.length,
        deleteResult,
        dishesAfterDelete: dishesAfterDelete.length,
        importResult
      };
    })();
  `);

  console.log(JSON.stringify(result, null, 2));
  win.destroy();
}

function setupIpc() {
  ipcMain.handle("lera:request", async (_event, request) => {
    return desktopApi.handleRequest(request);
  });

  ipcMain.handle("lera:backup-download", async (_event, options = {}) => {
    try {
      const payload = desktopApi.getBackupPayload();
      const suggestedName = typeof options?.suggestedName === "string" && options.suggestedName.trim()
        ? options.suggestedName.trim()
        : "copia-de-seguridad-lera.json";
      const target = await dialog.showSaveDialog(mainWindow, {
        title: "Guardar copia de seguridad",
        defaultPath: path.join(app.getPath("documents"), suggestedName),
        filters: [{ name: "JSON", extensions: ["json"] }]
      });
      if (target.canceled || !target.filePath) {
        return { status: "cancelled" };
      }
      fs.writeFileSync(target.filePath, JSON.stringify(payload, null, 2), "utf8");
      return { status: "downloaded" };
    } catch (error) {
      console.error(error);
      return { status: "failed", message: String(error) };
    }
  });

  ipcMain.handle("lera:backup-import", async () => {
    try {
      const target = await dialog.showOpenDialog(mainWindow, {
        title: "Abrir copia de seguridad",
        properties: ["openFile"],
        filters: [{ name: "JSON", extensions: ["json"] }]
      });
      if (target.canceled || !target.filePaths?.length) {
        return { status: "cancelled" };
      }
      const raw = fs.readFileSync(target.filePaths[0], "utf8");
      const payload = JSON.parse(raw);
      desktopApi.importBackupPayload(payload);
      return { status: "imported" };
    } catch (error) {
      console.error(error);
      return { status: "failed", message: String(error) };
    }
  });

  ipcMain.handle("lera:print-current-window", async (event) => {
    try {
      const targetWindow = BrowserWindow.fromWebContents(event.sender);
      if (!targetWindow) {
        return { status: "failed", message: "window-not-found" };
      }
      if (!targetWindow.isVisible()) targetWindow.show();
      targetWindow.focus();

      return await new Promise((resolve) => {
        setTimeout(() => {
          targetWindow.webContents.print(
            {
              silent: false,
              printBackground: true
            },
            (success, failureReason) => {
              resolve(success ? { status: "printed" } : { status: "failed", message: failureReason || "print-failed" });
            }
          );
        }, 80);
      });
    } catch (error) {
      console.error(error);
      return { status: "failed", message: String(error) };
    }
  });

  ipcMain.handle("lera:save-current-window-pdf", async (event, options = {}) => {
    try {
      const targetWindow = BrowserWindow.fromWebContents(event.sender);
      if (!targetWindow) {
        return { status: "failed", message: "window-not-found" };
      }

      const suggestedName =
        typeof options?.suggestedName === "string" && options.suggestedName.trim()
          ? options.suggestedName.trim()
          : "lera-methodology-report.pdf";

      const target = await dialog.showSaveDialog(targetWindow, {
        title: "Guardar PDF",
        defaultPath: path.join(app.getPath("documents"), suggestedName),
        filters: [{ name: "PDF", extensions: ["pdf"] }]
      });

      if (target.canceled || !target.filePath) {
        return { status: "cancelled" };
      }

      const pdfBuffer = await targetWindow.webContents.printToPDF({
        printBackground: true,
        preferCSSPageSize: true,
        landscape: false,
        pageSize: "A4",
        margins: {
          marginType: "custom",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      });

      fs.writeFileSync(target.filePath, pdfBuffer);
      return { status: "saved", filePath: target.filePath };
    } catch (error) {
      console.error(error);
      return { status: "failed", message: String(error) };
    }
  });

  ipcMain.handle("lera:close-current-window", async (event) => {
    try {
      const targetWindow = BrowserWindow.fromWebContents(event.sender);
      if (!targetWindow) {
        return { status: "failed", message: "window-not-found" };
      }
      if (BrowserWindow.getAllWindows().length <= 1) {
        return { status: "ignored" };
      }
      setTimeout(() => {
        if (!targetWindow.isDestroyed()) targetWindow.close();
      }, 0);
      return { status: "closed" };
    } catch (error) {
      console.error(error);
      return { status: "failed", message: String(error) };
    }
  });
}

app.whenReady().then(() => {
  const dbPath = path.join(app.getPath("userData"), "restaurant.db");
  const bundledDbPath = path.join(__dirname, "..", "restaurant-database", "restaurant.db");
  desktopApi = createDesktopApi({ dbPath, bundledDbPath });
  setupIpc();
  if (isSmokeMode) {
    runSmokeInPackagedApp()
      .then(() => app.quit())
      .catch((error) => {
        console.error(error);
        app.exit(1);
      });
    return;
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
