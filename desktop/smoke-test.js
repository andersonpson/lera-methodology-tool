const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const { app, BrowserWindow, ipcMain } = require("electron");
const { createDesktopApi } = require("./api");

const smokeRoot = path.join(os.tmpdir(), "lera-electron-smoke");
const dbPath = path.join(smokeRoot, "restaurant.db");
const bundledDbPath = path.join(__dirname, "..", "restaurant-database", "restaurant.db");
const windowWebPreferences = {
  preload: path.join(__dirname, "preload.js"),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: false
};

fs.rmSync(smokeRoot, { recursive: true, force: true });
fs.mkdirSync(smokeRoot, { recursive: true });
app.setPath("userData", smokeRoot);

const desktopApi = createDesktopApi({ dbPath, bundledDbPath });

ipcMain.handle("lera:request", async (_event, request) => desktopApi.handleRequest(request));
ipcMain.handle("lera:backup-download", async () => ({ status: "skipped" }));
ipcMain.handle("lera:backup-import", async () => ({ status: "skipped" }));
ipcMain.handle("lera:print-current-window", async () => ({ status: "skipped" }));
ipcMain.handle("lera:close-current-window", async (event) => {
  const targetWindow = BrowserWindow.fromWebContents(event.sender);
  if (!targetWindow) return { status: "failed" };
  setTimeout(() => {
    if (!targetWindow.isDestroyed()) targetWindow.close();
  }, 0);
  return { status: "closed" };
});

async function runSmoke() {
  const win = new BrowserWindow({
    show: false,
    width: 1280,
    height: 900,
    webPreferences: windowWebPreferences
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const target = new URL(url);
      if (target.protocol === "file:") {
        return {
          action: "allow",
          overrideBrowserWindowOptions: {
            show: false,
            width: 1100,
            height: 820,
            parent: win,
            webPreferences: windowWebPreferences
          }
        };
      }
    } catch {}
    return { action: "deny" };
  });

  await win.loadFile(path.join(__dirname, "..", "index.html"));

  const result = await win.webContents.executeJavaScript(`
    (async () => {
      const smokeCode = "2099-FA1-PA1-P-1-001";
      const dishPayload = {
        draft_key: "smoke-desktop-1",
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
        notes: "desktop smoke",
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
      const dishesBefore = await fetch("/api/dishes").then((res) => res.json());
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
        codebookCount: backupBefore.codebook?.length || 0,
        dishesBefore: dishesBefore.length,
        saveResult,
        dishesAfterSave: dishesAfterSave.length,
        deleteResult,
        dishesAfterDelete: dishesAfterDelete.length,
        importResult
      };
    })();
  `);

  await win.loadFile(path.join(__dirname, "..", "restaurant-database", "index.html"));

  const popupSeed = await win.webContents.executeJavaScript(`
    (async () => {
      document.getElementById("dish-name").value = "Popup Dish";
      document.getElementById("year-code").value = "2098";
      document.getElementById("seq-no").value = "7";
      document.getElementById("season-code").value = "V";
      document.getElementById("month-no").value = "8";
      const foundationSelect = document.querySelector("#foundation-builder select");
      const productSelect = document.querySelector("#product-builder select");
      if (foundationSelect) foundationSelect.value = "FA1";
      if (productSelect) productSelect.value = "PA1";
      document.getElementById("open-recipe-button").click();
      return { draftKey: state.draftKey };
    })();
  `);

  if (!popupSeed?.draftKey) {
    throw new Error("popup-seed-failed");
  }

  await win.webContents.executeJavaScript(`
    (async () => {
      const moduleName = document.querySelector("[data-module-name]");
      moduleName.value = "Salsa de prueba";
      moduleName.dispatchEvent(new Event("input", { bubbles: true }));
      const productInput = document.querySelector('[data-key="product"]');
      productInput.value = "Aceite";
      productInput.dispatchEvent(new Event("input", { bubbles: true }));
      document.getElementById("plan-before").value = "Preparación previa";
      document.getElementById("notes").value = "Nota de humo";
      const payloadJson = {
        modules: state.modules,
        planBefore: document.getElementById("plan-before").value,
        planDay: document.getElementById("plan-day").value,
        notes: document.getElementById("notes").value,
        allergens: state.allergens,
        photoData: state.photoData
      };
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft_key: state.draftKey,
          dish_code: document.getElementById("dish-code").value,
          dish_name: document.getElementById("dish-title").value,
          summary_text: buildSummary(),
          payload_json: payloadJson
        })
      });
      if (!response.ok) throw new Error("recipe-save-failed");
      setTimeout(() => {
        window.location.href = buildEntryUrl();
      }, 0);
      return true;
    })();
  `);

  await new Promise((resolve) => setTimeout(resolve, 1200));
  const popupRecipe = desktopApi.handleRequest({
    url: `/api/recipe?draft_key=${encodeURIComponent(popupSeed.draftKey)}`,
    method: "GET"
  });

  console.log(JSON.stringify(result, null, 2));
  console.log(
    JSON.stringify(
      {
        popupSaved: popupRecipe?.body?.payload_json?.notes === "Nota de humo",
        popupClosed: win.webContents.getURL().includes("/restaurant-database/index.html"),
        popupRecipeSummary: popupRecipe?.body?.summary_text || ""
      },
      null,
      2
    )
  );
  await win.destroy();
  app.quit();
}

app.whenReady().then(runSmoke).catch((error) => {
  console.error(error);
  app.exit(1);
});
