const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

function jsonResponse(body, status = 200) {
  return {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body
  };
}

function parseJsonBody(body) {
  if (!body) return {};
  if (typeof body === "string") return JSON.parse(body || "{}");
  if (Buffer.isBuffer(body)) return JSON.parse(body.toString("utf8"));
  return body;
}

function parseJsonText(value, fallback = {}) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getQueryParam(searchParams, ...keys) {
  for (const key of keys) {
    const value = (searchParams.get(key) || "").trim();
    if (value) return value;
  }
  return "";
}

function runInTransaction(db, callback) {
  db.exec("BEGIN");
  try {
    const result = callback();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {}
    throw error;
  }
}

function rowObject(row) {
  return row ? { ...row } : null;
}

function rowsArray(rows) {
  return rows.map((row) => ({ ...row }));
}

function compareMethodologyVersion(a, b) {
  return String(a || "").localeCompare(String(b || ""), undefined, { numeric: true, sensitivity: "base" });
}

const RESERVED_CODEBOOK_ROWS = [
  {
    category: "foundation",
    code: "FPR",
    parent_code: "FP",
    label_zh: "零散食谱记录",
    label_es: "Registro de receta suelta",
    status: "active",
    notes: "ZH: 保留给未进入正式菜品系统的小食谱或测试记录。 ES: Reservado para recetas pequeñas o registros de prueba que todavía no entran en el sistema formal de platos."
  },
  {
    category: "product",
    code: "PZ",
    parent_code: "",
    label_zh: "零散记录",
    label_es: "Registro suelto",
    status: "active",
    notes: "ZH: 保留给尚未归入正式原料分类的零散食谱。 ES: Reservado para recetas sueltas que todavía no se han clasificado dentro de la categoría formal de producto."
  },
  {
    category: "product",
    code: "PZ1",
    parent_code: "PZ",
    label_zh: "未归类零散记录",
    label_es: "Registro suelto sin clasificar",
    status: "active",
    notes: "ZH: 保留给零散食谱使用。 ES: Reservado para el uso de recetas sueltas."
  }
];

function ensureColumn(db, tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name);
  if (!columns.includes(columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

function copyBundledDbIfNeeded(dbPath, bundledDbPath) {
  if (fs.existsSync(dbPath)) return false;
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  if (bundledDbPath && fs.existsSync(bundledDbPath)) {
    fs.copyFileSync(bundledDbPath, dbPath);
    return true;
  }
  return false;
}

function initializeDatabase(db, { firstRun, bundledDbPath }) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dish_code TEXT NOT NULL UNIQUE,
      draft_key TEXT,
      year_code INTEGER NOT NULL,
      foundation_code TEXT NOT NULL,
      product_code TEXT NOT NULL,
      season_code TEXT NOT NULL,
      month_no INTEGER NOT NULL,
      seq_no INTEGER NOT NULL,
      dish_name TEXT NOT NULL,
      recipe_text TEXT,
      methodology_main_code TEXT,
      methodology_version_code TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS recipe_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      draft_key TEXT NOT NULL UNIQUE,
      dish_code TEXT,
      dish_name TEXT,
      summary_text TEXT,
      payload_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS codebook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      code TEXT NOT NULL,
      parent_code TEXT,
      label_zh TEXT NOT NULL,
      label_es TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(category, code)
    );

    CREATE TABLE IF NOT EXISTS methodology_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      draft_key TEXT NOT NULL,
      dish_code TEXT,
      methodology_main_code TEXT,
      methodology_version_code TEXT,
      methodology_event_code TEXT,
      methodology_record_type TEXT DEFAULT 'project',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS methodology_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_code TEXT NOT NULL,
      version_code TEXT NOT NULL,
      dish_name TEXT,
      linked_dish_code TEXT,
      project_origin TEXT,
      current_stage TEXT,
      current_status TEXT,
      foundation_code TEXT,
      product_code TEXT,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(project_code, version_code)
    );
  `);

  ensureColumn(db, "dishes", "draft_key", "TEXT");
  ensureColumn(db, "methodology_records", "methodology_event_code", "TEXT");
  ensureColumn(db, "methodology_records", "methodology_record_type", "TEXT DEFAULT 'project'");

  const codebookCount = db.prepare("SELECT COUNT(*) AS count FROM codebook").get().count;
  if (!codebookCount && bundledDbPath && fs.existsSync(bundledDbPath)) {
    const seedDb = new DatabaseSync(bundledDbPath, { readOnly: true });
    const codebookRows = seedDb
      .prepare(
        `
          SELECT category, code, parent_code, label_zh, label_es, status, notes, created_at, updated_at
          FROM codebook
          ORDER BY category, code
        `
      )
      .all();
    const insert = db.prepare(`
      INSERT INTO codebook (category, code, parent_code, label_zh, label_es, status, notes, created_at, updated_at)
      VALUES (:category, :code, :parent_code, :label_zh, :label_es, :status, :notes, :created_at, :updated_at)
    `);
    const insertMany = db.transaction((rows) => {
      for (const row of rows) insert.run(row);
    });
    insertMany(codebookRows);
    seedDb.close();
  }

  const upsertReservedCode = db.prepare(`
    INSERT INTO codebook (category, code, parent_code, label_zh, label_es, status, notes)
    VALUES (:category, :code, :parent_code, :label_zh, :label_es, :status, :notes)
    ON CONFLICT(category, code) DO UPDATE SET
      parent_code = excluded.parent_code,
      label_zh = excluded.label_zh,
      label_es = excluded.label_es,
      status = excluded.status,
      notes = excluded.notes,
      updated_at = CURRENT_TIMESTAMP
  `);
  for (const row of RESERVED_CODEBOOK_ROWS) {
    upsertReservedCode.run(row);
  }

  if (firstRun) {
    db.exec(`
      DELETE FROM methodology_records;
      DELETE FROM recipe_entries;
      DELETE FROM dishes;
      DELETE FROM methodology_projects;
    `);
  }
}

function createDesktopApi({ dbPath, bundledDbPath }) {
  const firstRun = copyBundledDbIfNeeded(dbPath, bundledDbPath);
  const db = new DatabaseSync(dbPath);
  initializeDatabase(db, { firstRun, bundledDbPath });

  function getMethodologyRecords(draftKeys) {
    const keys = draftKeys.filter(Boolean);
    if (!keys.length) return {};
    const placeholders = keys.map(() => "?").join(",");
    const rows = db
      .prepare(
        `
          SELECT draft_key, methodology_main_code, methodology_version_code, sort_order,
                 methodology_event_code, methodology_record_type
          FROM methodology_records
          WHERE draft_key IN (${placeholders})
          ORDER BY sort_order, id
        `
      )
      .all(...keys);
    const grouped = {};
    for (const key of keys) grouped[key] = [];
    for (const row of rows) {
      const item = rowObject(row);
      grouped[item.draft_key].push({
        methodology_main_code: item.methodology_main_code || "",
        methodology_version_code: item.methodology_version_code || "",
        methodology_event_code: item.methodology_event_code || "",
        methodology_record_type: item.methodology_record_type || "project",
        sort_order: item.sort_order || 0
      });
    }
    return grouped;
  }

  function summarizeMethodologyRows(rows) {
    const grouped = new Map();
    for (const row of rows) {
      const item = rowObject(row);
      if (!grouped.has(item.project_code)) grouped.set(item.project_code, []);
      grouped.get(item.project_code).push(item);
    }

    const summary = [];
    for (const projectRows of grouped.values()) {
      projectRows.sort((a, b) => {
        const updated = String(b.updated_at || "").localeCompare(String(a.updated_at || ""));
        if (updated) return updated;
        return compareMethodologyVersion(b.version_code, a.version_code);
      });
      const latest = { ...projectRows[0] };
      const versionCodes = [...projectRows]
        .sort((a, b) => compareMethodologyVersion(a.version_code, b.version_code))
        .map((item) => item.version_code);
      latest.version_codes = versionCodes;
      const formalVersions = versionCodes.filter((code) => code && code !== latest.project_code);
      latest.latest_formal_version_code = formalVersions.length ? formalVersions[formalVersions.length - 1] : "";
      summary.push(latest);
    }

    summary.sort((a, b) => {
      const updated = String(b.updated_at || "").localeCompare(String(a.updated_at || ""));
      if (updated) return updated;
      return String(b.project_code || "").localeCompare(String(a.project_code || ""));
    });
    return summary;
  }

  function replaceMethodologyRecords(draftKey, dishCode, records) {
    if (!draftKey) return;
    db.prepare("DELETE FROM methodology_records WHERE draft_key = ?").run(draftKey);
    const insert = db.prepare(`
      INSERT INTO methodology_records (
        draft_key, dish_code, methodology_main_code, methodology_version_code,
        methodology_event_code, methodology_record_type, sort_order
      ) VALUES (
        :draft_key, :dish_code, :methodology_main_code, :methodology_version_code,
        :methodology_event_code, :methodology_record_type, :sort_order
      )
    `);
    for (const [index, item] of (records || []).entries()) {
      const mainCode = String(item.methodology_main_code || "").trim();
      const versionCode = String(item.methodology_version_code || "").trim();
      const eventCode = String(item.methodology_event_code || "").trim();
      const recordType = String(item.methodology_record_type || "").trim() || (eventCode ? "event" : "project");
      if (!mainCode && !versionCode && !eventCode) continue;
      insert.run({
        draft_key: draftKey,
        dish_code: dishCode,
        methodology_main_code: mainCode,
        methodology_version_code: versionCode,
        methodology_event_code: eventCode,
        methodology_record_type: recordType,
        sort_order: index
      });
    }
  }

  function linkDishToMethodology(dishCode, records) {
    const updateByVersion = db.prepare(`
      UPDATE methodology_projects
      SET linked_dish_code = ?, updated_at = CURRENT_TIMESTAMP
      WHERE project_code = ? AND version_code = ?
    `);
    const updateByProject = db.prepare(`
      UPDATE methodology_projects
      SET linked_dish_code = ?, updated_at = CURRENT_TIMESTAMP
      WHERE project_code = ?
    `);
    for (const item of records || []) {
      const mainCode = String(item.methodology_main_code || "").trim();
      const versionCode = String(item.methodology_version_code || "").trim();
      if (!mainCode) continue;
      if (versionCode) {
        updateByVersion.run(dishCode, mainCode, versionCode);
      } else {
        updateByProject.run(dishCode, mainCode);
      }
    }
  }

  function getDishes(dishCode = "") {
    if (dishCode) {
      const row = db
        .prepare(
          `
            SELECT dish_code, draft_key, year_code, foundation_code, product_code, season_code,
                   month_no, seq_no, dish_name, recipe_text, methodology_main_code,
                   methodology_version_code, notes, created_at, updated_at
            FROM dishes
            WHERE dish_code = ?
          `
        )
        .get(dishCode);
      if (!row) return {};
      const payload = rowObject(row);
      payload.methodology_records = getMethodologyRecords([payload.draft_key])[payload.draft_key] || [];
      return payload;
    }

    const rows = rowsArray(
      db.prepare(
        `
          SELECT dish_code, draft_key, year_code, foundation_code, product_code, season_code,
                 month_no, seq_no, dish_name, recipe_text, methodology_main_code,
                 methodology_version_code, notes, created_at, updated_at
          FROM dishes
          ORDER BY year_code, foundation_code, product_code, season_code, month_no, seq_no
        `
      ).all()
    );
    const recordMap = getMethodologyRecords(rows.map((row) => row.draft_key));
    for (const row of rows) {
      row.methodology_records = recordMap[row.draft_key] || [];
    }
    return rows;
  }

  function getMethodology(projectCode = "", versionCode = "") {
    if (projectCode && versionCode) {
      const row = db
        .prepare(
          `
            SELECT project_code, version_code, dish_name, linked_dish_code, project_origin,
                   current_stage, current_status, foundation_code, product_code, payload_json,
                   created_at, updated_at
            FROM methodology_projects
            WHERE project_code = ? AND version_code = ?
          `
        )
        .get(projectCode, versionCode);
      if (!row) return {};
      const payload = rowObject(row);
      payload.payload_json = parseJsonText(payload.payload_json);
      return payload;
    }

    if (projectCode) {
      const rows = rowsArray(
        db.prepare(
          `
            SELECT project_code, version_code, dish_name, linked_dish_code, project_origin,
                   current_stage, current_status, foundation_code, product_code, payload_json,
                   created_at, updated_at
            FROM methodology_projects
            WHERE project_code = ?
            ORDER BY updated_at DESC, version_code DESC
          `
        ).all(projectCode)
      );
      const summary = summarizeMethodologyRows(rows);
      if (!summary.length) return {};
      const latest = summary[0];
      const detail = db
        .prepare(
          `
            SELECT project_code, version_code, dish_name, linked_dish_code, project_origin,
                   current_stage, current_status, foundation_code, product_code, payload_json,
                   created_at, updated_at
            FROM methodology_projects
            WHERE project_code = ? AND version_code = ?
          `
        )
        .get(latest.project_code, latest.version_code);
      const payload = rowObject(detail);
      payload.payload_json = parseJsonText(payload.payload_json);
      payload.version_codes = latest.version_codes;
      payload.latest_formal_version_code = latest.latest_formal_version_code;
      return payload;
    }

    const rows = rowsArray(
      db.prepare(
        `
          SELECT project_code, version_code, dish_name, linked_dish_code, project_origin,
                 current_stage, current_status, foundation_code, product_code,
                 created_at, updated_at
          FROM methodology_projects
          ORDER BY updated_at DESC, project_code DESC, version_code DESC
        `
      ).all()
    );
    return summarizeMethodologyRows(rows);
  }

  function getSubproducts() {
    const rows = rowsArray(
      db.prepare(
        `
          SELECT r.draft_key, r.dish_code, r.dish_name, r.payload_json,
                 d.foundation_code, d.product_code, d.season_code, d.month_no,
                 d.methodology_main_code, d.methodology_version_code
          FROM recipe_entries r
          LEFT JOIN dishes d ON d.draft_key = r.draft_key
          ORDER BY r.updated_at DESC
        `
      ).all()
    );
    const subproducts = [];
    for (const row of rows) {
      const payload = parseJsonText(row.payload_json, {});
      const modules = payload.modules || [];
      modules.forEach((module, index) => {
        const moduleName = String(module.name || "").trim();
        if (!moduleName) return;
        subproducts.push({
          draft_key: row.draft_key,
          dish_code: row.dish_code || "",
          dish_name: row.dish_name || "",
          foundation_code: row.foundation_code || "",
          product_code: row.product_code || "",
          season_code: row.season_code || "",
          month_no: row.month_no || "",
          methodology_main_code: row.methodology_main_code || "",
          methodology_version_code: row.methodology_version_code || "",
          module_name: moduleName,
          module_index: index + 1
        });
      });
    }
    return subproducts;
  }

  function getRecipe(draftKey) {
    const row = db
      .prepare(
        `
          SELECT draft_key, dish_code, dish_name, summary_text, payload_json, updated_at
          FROM recipe_entries
          WHERE draft_key = ?
        `
      )
      .get(draftKey);
    if (!row) return {};
    const payload = rowObject(row);
    payload.payload_json = parseJsonText(payload.payload_json);
    return payload;
  }

  function saveDish(payload) {
    const required = [
      "dish_code",
      "year_code",
      "foundation_code",
      "product_code",
      "season_code",
      "month_no",
      "seq_no",
      "dish_name"
    ];
    const missing = required.filter((field) => !payload[field]);
    if (missing.length) return jsonResponse({ error: `Missing fields: ${missing.join(", ")}` }, 400);

    const data = { ...payload };
    const dishParams = {
      dish_code: data.dish_code,
      draft_key: data.draft_key || "",
      year_code: data.year_code,
      foundation_code: data.foundation_code,
      product_code: data.product_code,
      season_code: data.season_code,
      month_no: data.month_no,
      seq_no: data.seq_no,
      dish_name: data.dish_name,
      recipe_text: data.recipe_text || "",
      methodology_main_code: data.methodology_main_code || "",
      methodology_version_code: data.methodology_version_code || "",
      notes: data.notes || ""
    };
    const recipeLinkParams = {
      draft_key: dishParams.draft_key,
      dish_code: dishParams.dish_code,
      dish_name: dishParams.dish_name
    };
    const originalDishCode = String(data.original_dish_code || "").trim();
    const methodologyRecords = data.methodology_records || [];

    try {
      runInTransaction(db, () => {
        if (originalDishCode && originalDishCode !== data.dish_code) {
        const update = db.prepare(`
          UPDATE dishes
          SET dish_code = :dish_code,
              draft_key = :draft_key,
              year_code = :year_code,
              foundation_code = :foundation_code,
              product_code = :product_code,
              season_code = :season_code,
              month_no = :month_no,
              seq_no = :seq_no,
              dish_name = :dish_name,
              recipe_text = :recipe_text,
              methodology_main_code = :methodology_main_code,
              methodology_version_code = :methodology_version_code,
              notes = :notes,
              updated_at = CURRENT_TIMESTAMP
          WHERE dish_code = :original_dish_code
        `);
        const result = update.run({ ...dishParams, original_dish_code: originalDishCode });
        if (result.changes) {
          db.prepare(
            `
              UPDATE recipe_entries
              SET dish_code = :dish_code,
                  dish_name = :dish_name,
                  updated_at = CURRENT_TIMESTAMP
              WHERE draft_key = :draft_key
            `
          ).run(recipeLinkParams);
          replaceMethodologyRecords(data.draft_key, data.dish_code, methodologyRecords);
          linkDishToMethodology(data.dish_code, methodologyRecords);
          return;
        }
      }

      db.prepare(
        `
          INSERT INTO dishes (
            dish_code, draft_key, year_code, foundation_code, product_code, season_code, month_no,
            seq_no, dish_name, recipe_text, methodology_main_code, methodology_version_code, notes
          ) VALUES (
            :dish_code, :draft_key, :year_code, :foundation_code, :product_code, :season_code, :month_no,
            :seq_no, :dish_name, :recipe_text, :methodology_main_code, :methodology_version_code, :notes
          )
          ON CONFLICT(dish_code) DO UPDATE SET
            draft_key = excluded.draft_key,
            year_code = excluded.year_code,
            foundation_code = excluded.foundation_code,
            product_code = excluded.product_code,
            season_code = excluded.season_code,
            month_no = excluded.month_no,
            seq_no = excluded.seq_no,
            dish_name = excluded.dish_name,
            recipe_text = excluded.recipe_text,
            methodology_main_code = excluded.methodology_main_code,
            methodology_version_code = excluded.methodology_version_code,
            notes = excluded.notes,
            updated_at = CURRENT_TIMESTAMP
        `
      ).run(dishParams);
      replaceMethodologyRecords(data.draft_key, data.dish_code, methodologyRecords);
      linkDishToMethodology(data.dish_code, methodologyRecords);
      db.prepare(
        `
          UPDATE recipe_entries
          SET dish_code = :dish_code,
              dish_name = :dish_name,
              updated_at = CURRENT_TIMESTAMP
          WHERE draft_key = :draft_key
        `
      ).run(recipeLinkParams);
      });
      return jsonResponse({ ok: true });
    } catch (error) {
      return jsonResponse({ error: String(error) }, 409);
    }
  }

  function saveMethodology(payload) {
    const projectCode = String(payload.project_code || "").trim();
    const versionCode = String(payload.version_code || "").trim() || projectCode;
    if (!projectCode || !versionCode) {
      return jsonResponse({ error: "Missing project_code or version_code" }, 400);
    }

    db.prepare(
      `
        INSERT INTO methodology_projects (
          project_code, version_code, dish_name, linked_dish_code, project_origin,
          current_stage, current_status, foundation_code, product_code, payload_json
        ) VALUES (
          :project_code, :version_code, :dish_name, :linked_dish_code, :project_origin,
          :current_stage, :current_status, :foundation_code, :product_code, :payload_json
        )
        ON CONFLICT(project_code, version_code) DO UPDATE SET
          dish_name = excluded.dish_name,
          linked_dish_code = CASE
            WHEN excluded.linked_dish_code IS NOT NULL AND excluded.linked_dish_code != '' THEN excluded.linked_dish_code
            ELSE methodology_projects.linked_dish_code
          END,
          project_origin = excluded.project_origin,
          current_stage = excluded.current_stage,
          current_status = excluded.current_status,
          foundation_code = excluded.foundation_code,
          product_code = excluded.product_code,
          payload_json = excluded.payload_json,
          updated_at = CURRENT_TIMESTAMP
      `
    ).run({
      project_code: projectCode,
      version_code: versionCode,
      dish_name: payload.dish_name || "",
      linked_dish_code: payload.linked_dish_code || "",
      project_origin: payload.project_origin || "",
      current_stage: payload.current_stage || "",
      current_status: payload.current_status || "",
      foundation_code: payload.foundation_code || "",
      product_code: payload.product_code || "",
      payload_json: JSON.stringify(payload.payload_json || {}, null, 0)
    });

    return jsonResponse({ ok: true });
  }

  function saveRecipe(payload) {
    const draftKey = String(payload.draft_key || "").trim();
    if (!draftKey) return jsonResponse({ error: "Missing draft_key" }, 400);
    db.prepare(
      `
        INSERT INTO recipe_entries (draft_key, dish_code, dish_name, summary_text, payload_json)
        VALUES (:draft_key, :dish_code, :dish_name, :summary_text, :payload_json)
        ON CONFLICT(draft_key) DO UPDATE SET
          dish_code = excluded.dish_code,
          dish_name = excluded.dish_name,
          summary_text = excluded.summary_text,
          payload_json = excluded.payload_json,
          updated_at = CURRENT_TIMESTAMP
      `
    ).run({
      draft_key: draftKey,
      dish_code: payload.dish_code || "",
      dish_name: payload.dish_name || "",
      summary_text: payload.summary_text || "",
      payload_json: JSON.stringify(payload.payload_json || {}, null, 0)
    });
    return jsonResponse({ ok: true });
  }

  function buildStandaloneDishCode(draftKey) {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1);
    const seqSeed = String(draftKey || "").replace(/[^a-zA-Z0-9]/g, "").slice(-3).padStart(3, "0");
    return `${year}-FPR-PZ1-R-${month}-${seqSeed}`;
  }

  function getCodebook() {
    return rowsArray(
      db.prepare(
        `
          SELECT category, code, parent_code, label_zh, label_es, status, notes, created_at, updated_at
          FROM codebook
          ORDER BY category, code
        `
      ).all()
    );
  }

  function saveCodebook(payload) {
    const required = ["category", "code", "label_zh", "label_es", "status"];
    const missing = required.filter((field) => !payload[field]);
    if (missing.length) {
      return jsonResponse({ error: `Missing fields: ${missing.join(", ")}` }, 400);
    }
    db.prepare(
      `
        INSERT INTO codebook (category, code, parent_code, label_zh, label_es, status, notes)
        VALUES (:category, :code, :parent_code, :label_zh, :label_es, :status, :notes)
        ON CONFLICT(category, code) DO UPDATE SET
          parent_code = excluded.parent_code,
          label_zh = excluded.label_zh,
          label_es = excluded.label_es,
          status = excluded.status,
          notes = excluded.notes,
          updated_at = CURRENT_TIMESTAMP
      `
    ).run(payload);
    return jsonResponse({ ok: true });
  }

  function deleteDish(dishCode) {
    if (!dishCode) return jsonResponse({ error: "Missing dish_code" }, 400);
    const row = db.prepare("SELECT draft_key FROM dishes WHERE dish_code = ?").get(dishCode);
    if (row) {
      const draftKey = row.draft_key || "";
      db.prepare("DELETE FROM dishes WHERE dish_code = ?").run(dishCode);
      if (draftKey) {
        db.prepare("DELETE FROM recipe_entries WHERE draft_key = ?").run(draftKey);
        db.prepare("DELETE FROM methodology_records WHERE draft_key = ?").run(draftKey);
      }
    }
    return jsonResponse({ ok: true });
  }

  function deleteRecipe(draftKey) {
    if (!draftKey) return jsonResponse({ error: "Missing draft_key" }, 400);
    db.prepare("DELETE FROM recipe_entries WHERE draft_key = ?").run(draftKey);
    db.prepare("UPDATE dishes SET recipe_text = '', updated_at = CURRENT_TIMESTAMP WHERE draft_key = ?").run(draftKey);
    return jsonResponse({ ok: true });
  }

  function deleteCodebook(category, code) {
    if (!category || !code) return jsonResponse({ error: "Missing category or code" }, 400);
    db.prepare("DELETE FROM codebook WHERE category = ? AND code = ?").run(category, code);
    return jsonResponse({ ok: true });
  }

  function deleteMethodology(projectCode) {
    if (!projectCode) return jsonResponse({ error: "Missing project_code" }, 400);
    db.prepare("DELETE FROM methodology_projects WHERE project_code = ?").run(projectCode);
    db.prepare("DELETE FROM methodology_records WHERE methodology_main_code = ?").run(projectCode);
    db.prepare(
      `
        UPDATE dishes
        SET methodology_main_code = '',
            methodology_version_code = '',
            updated_at = CURRENT_TIMESTAMP
        WHERE methodology_main_code = ?
      `
    ).run(projectCode);
    return jsonResponse({ ok: true });
  }

  function getBackupPayload() {
    return {
      version: 1,
      exported_at: new Date().toISOString(),
      codebook: rowsArray(
        db.prepare("SELECT category, code, parent_code, label_zh, label_es, status, notes, created_at, updated_at FROM codebook ORDER BY category, code").all()
      ),
      dishes: rowsArray(db.prepare("SELECT * FROM dishes ORDER BY id").all()),
      recipes: rowsArray(db.prepare("SELECT * FROM recipe_entries ORDER BY id").all()),
      methodology_records: rowsArray(db.prepare("SELECT * FROM methodology_records ORDER BY id").all()),
      methodology_projects: rowsArray(db.prepare("SELECT * FROM methodology_projects ORDER BY id").all())
    };
  }

  function importBackupPayload(payload) {
    const required = ["codebook", "dishes", "recipes", "methodology_records", "methodology_projects"];
    const missing = required.filter((key) => !(key in payload));
    if (missing.length) throw new Error(`Missing backup sections: ${missing.join(", ")}`);

    runInTransaction(db, () => {
      db.exec(`
        DELETE FROM methodology_records;
        DELETE FROM recipe_entries;
        DELETE FROM dishes;
        DELETE FROM methodology_projects;
        DELETE FROM codebook;
      `);

      const codebookInsert = db.prepare(`
        INSERT INTO codebook (category, code, parent_code, label_zh, label_es, status, notes, created_at, updated_at)
        VALUES (:category, :code, :parent_code, :label_zh, :label_es, :status, :notes, :created_at, :updated_at)
      `);
      for (const row of payload.codebook || []) codebookInsert.run(row);

      const dishesInsert = db.prepare(`
        INSERT INTO dishes (
          id, dish_code, draft_key, year_code, foundation_code, product_code, season_code, month_no,
          seq_no, dish_name, recipe_text, methodology_main_code, methodology_version_code, notes,
          created_at, updated_at
        ) VALUES (
          :id, :dish_code, :draft_key, :year_code, :foundation_code, :product_code, :season_code, :month_no,
          :seq_no, :dish_name, :recipe_text, :methodology_main_code, :methodology_version_code, :notes,
          :created_at, :updated_at
        )
      `);
      for (const row of payload.dishes || []) dishesInsert.run(row);

      const recipesInsert = db.prepare(`
        INSERT INTO recipe_entries (id, draft_key, dish_code, dish_name, summary_text, payload_json, updated_at)
        VALUES (:id, :draft_key, :dish_code, :dish_name, :summary_text, :payload_json, :updated_at)
      `);
      for (const row of payload.recipes || []) recipesInsert.run(row);

      const methodologyRecordsInsert = db.prepare(`
        INSERT INTO methodology_records (
          id, draft_key, dish_code, methodology_main_code, methodology_version_code,
          methodology_event_code, methodology_record_type, sort_order, created_at, updated_at
        ) VALUES (
          :id, :draft_key, :dish_code, :methodology_main_code, :methodology_version_code,
          :methodology_event_code, :methodology_record_type, :sort_order, :created_at, :updated_at
        )
      `);
      for (const row of payload.methodology_records || []) methodologyRecordsInsert.run(row);

      const methodologyProjectsInsert = db.prepare(`
        INSERT INTO methodology_projects (
          id, project_code, version_code, dish_name, linked_dish_code, project_origin,
          current_stage, current_status, foundation_code, product_code, payload_json,
          created_at, updated_at
        ) VALUES (
          :id, :project_code, :version_code, :dish_name, :linked_dish_code, :project_origin,
          :current_stage, :current_status, :foundation_code, :product_code, :payload_json,
          :created_at, :updated_at
        )
      `);
      for (const row of payload.methodology_projects || []) methodologyProjectsInsert.run(row);
    });
    return { ok: true };
  }

  function handleRequest({ url, method = "GET", body = null }) {
    const parsed = new URL(url, "http://lera.local");
    const pathname = parsed.pathname;
    const query = parsed.searchParams;
    const upperMethod = String(method || "GET").toUpperCase();

    try {
      if (upperMethod === "GET" && pathname === "/api/health") {
        return jsonResponse({ ok: true, app: "lera", files_ok: true });
      }
      if (upperMethod === "GET" && pathname === "/api/dishes") {
        return jsonResponse(getDishes(query.get("dish_code") || ""));
      }
      if (upperMethod === "GET" && pathname === "/api/methodology") {
        return jsonResponse(getMethodology(query.get("project_code") || "", query.get("version_code") || ""));
      }
      if (upperMethod === "GET" && pathname === "/api/subproducts") {
        return jsonResponse(getSubproducts());
      }
      if (upperMethod === "GET" && pathname === "/api/recipe") {
        const draftKey = getQueryParam(query, "draft_key", "draftKey");
        if (!draftKey) return jsonResponse({ error: "Missing draft_key" }, 400);
        return jsonResponse(getRecipe(draftKey));
      }
      if (upperMethod === "GET" && pathname === "/api/codebook") {
        return jsonResponse(getCodebook());
      }
      if (upperMethod === "GET" && pathname === "/api/backup") {
        return jsonResponse(getBackupPayload());
      }
      if (upperMethod === "POST" && pathname === "/api/dishes") {
        return saveDish(parseJsonBody(body));
      }
      if (upperMethod === "POST" && pathname === "/api/methodology") {
        return saveMethodology(parseJsonBody(body));
      }
      if (upperMethod === "POST" && pathname === "/api/recipe") {
        return saveRecipe(parseJsonBody(body));
      }
      if (upperMethod === "POST" && pathname === "/api/codebook") {
        return saveCodebook(parseJsonBody(body));
      }
      if (upperMethod === "POST" && pathname === "/api/backup") {
        importBackupPayload(parseJsonBody(body));
        return jsonResponse({ ok: true });
      }
      if (upperMethod === "DELETE" && pathname === "/api/dishes") {
        const dishCode = getQueryParam(query, "dish_code", "dishCode");
        if (!dishCode) return jsonResponse({ error: "Missing dish_code" }, 400);
        return deleteDish(dishCode);
      }
      if (upperMethod === "DELETE" && pathname === "/api/recipe") {
        return deleteRecipe(getQueryParam(query, "draft_key", "draftKey"));
      }
      if (upperMethod === "DELETE" && pathname === "/api/codebook") {
        return deleteCodebook(getQueryParam(query, "category"), getQueryParam(query, "code"));
      }
      if (upperMethod === "DELETE" && pathname === "/api/methodology") {
        return deleteMethodology(getQueryParam(query, "project_code", "projectCode"));
      }
      return jsonResponse({ error: "Not found" }, 404);
    } catch (error) {
      console.error(error);
      return jsonResponse({ error: String(error) }, 500);
    }
  }

  return {
    handleRequest,
    getBackupPayload,
    importBackupPayload
  };
}

module.exports = {
  createDesktopApi
};
