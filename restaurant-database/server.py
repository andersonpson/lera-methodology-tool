from __future__ import annotations

import hashlib
import hmac
import json
import os
import sqlite3
import subprocess
import threading
import time
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


DEFAULT_ROOT = Path(__file__).resolve().parent.parent
ROOT = Path(os.environ.get("LERA_ROOT", str(DEFAULT_ROOT))).expanduser().resolve()
DB_PATH = Path(
    os.environ.get("LERA_DB_PATH", str(ROOT / "restaurant-database" / "restaurant.db"))
).expanduser().resolve()
INSTANCE_ID = os.environ.get("LERA_INSTANCE_ID", "")
DEPLOY_WEBHOOK_SECRET = os.environ.get("LERA_DEPLOY_WEBHOOK_SECRET", "")
DEPLOY_REPO = os.environ.get("LERA_DEPLOY_REPO", "")
DEPLOY_BRANCH = os.environ.get("LERA_DEPLOY_BRANCH", "main")
DEPLOY_RESTART = os.environ.get("LERA_DEPLOY_RESTART", "1").strip().lower() not in {"0", "false", "no", "off"}
BACKUP_DIR = Path(
    os.environ.get("LERA_BACKUP_DIR", str(ROOT / "backups"))
).expanduser().resolve()
BACKUP_RETENTION = max(5, int(os.environ.get("LERA_BACKUP_RETENTION", "30")))
AUTO_BACKUP_INTERVAL_SECONDS = max(
    3600, int(os.environ.get("LERA_AUTO_BACKUP_INTERVAL_SECONDS", "43200"))
)
BACKUP_LOCK = threading.RLock()


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def ensure_backup_dir() -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)


def normalize_backup_source(value: str) -> str:
    cleaned = "".join(char if char.isalnum() else "-" for char in str(value or "").strip().lower())
    normalized = "-".join(part for part in cleaned.split("-") if part)
    return normalized or "manual"


def build_backup_filename(source: str) -> str:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
    return f"lera-backup-{timestamp}__{normalize_backup_source(source)}.db"


def detect_backup_source(path: Path) -> str:
    suffix = path.stem.split("__", 1)
    if len(suffix) == 2 and suffix[1].strip():
        return suffix[1].strip()
    return "manual"


def snapshot_metadata(path: Path) -> dict:
    stat = path.stat()
    created_at = datetime.fromtimestamp(stat.st_mtime, timezone.utc)
    return {
        "id": path.name,
        "filename": path.name,
        "source": detect_backup_source(path),
        "created_at": created_at.isoformat().replace("+00:00", "Z"),
        "created_at_epoch": int(stat.st_mtime),
        "size_bytes": stat.st_size,
    }


def list_backup_snapshots() -> list[dict]:
    ensure_backup_dir()
    snapshots = []
    for path in sorted(BACKUP_DIR.glob("lera-backup-*.db"), key=lambda item: item.stat().st_mtime, reverse=True):
        snapshots.append(snapshot_metadata(path))
    return snapshots


def get_backup_snapshot_summary() -> dict:
    snapshots = list_backup_snapshots()
    latest_auto = next((item for item in snapshots if item["source"] == "auto"), None)
    latest_manual = next((item for item in snapshots if item["source"] == "manual"), None)
    return {
        "snapshots": snapshots,
        "latest_auto": latest_auto,
        "latest_manual": latest_manual,
        "retention": BACKUP_RETENTION,
        "auto_interval_seconds": AUTO_BACKUP_INTERVAL_SECONDS,
    }


def prune_backup_snapshots() -> None:
    snapshots = list_backup_snapshots()
    for item in snapshots[BACKUP_RETENTION:]:
        try:
            resolve_backup_snapshot_path(item["id"]).unlink(missing_ok=True)
        except FileNotFoundError:
            continue


def resolve_backup_snapshot_path(snapshot_id: str) -> Path:
    ensure_backup_dir()
    candidate = (BACKUP_DIR / Path(snapshot_id).name).resolve()
    if candidate.parent != BACKUP_DIR or not candidate.exists() or candidate.suffix.lower() != ".db":
        raise FileNotFoundError(snapshot_id)
    return candidate


def create_backup_snapshot(source: str = "manual") -> dict:
    ensure_backup_dir()
    target_path = BACKUP_DIR / build_backup_filename(source)
    source_conn = None
    target_conn = None
    with BACKUP_LOCK:
        try:
            source_conn = connect_db()
            target_conn = sqlite3.connect(target_path)
            source_conn.backup(target_conn)
        finally:
            if target_conn is not None:
                target_conn.close()
            if source_conn is not None:
                source_conn.close()
    prune_backup_snapshots()
    return snapshot_metadata(target_path)


def restore_backup_snapshot(snapshot_id: str) -> dict:
    snapshot_path = resolve_backup_snapshot_path(snapshot_id)
    safety_snapshot = create_backup_snapshot("before-restore")
    source_conn = None
    target_conn = None
    with BACKUP_LOCK:
        try:
            source_conn = sqlite3.connect(snapshot_path)
            target_conn = sqlite3.connect(DB_PATH)
            source_conn.backup(target_conn)
        finally:
            if target_conn is not None:
                target_conn.close()
            if source_conn is not None:
                source_conn.close()
    return {
        "restored": snapshot_metadata(snapshot_path),
        "safety_snapshot": safety_snapshot,
    }


def maybe_create_automatic_snapshot() -> dict | None:
    snapshots = list_backup_snapshots()
    latest_auto = next((item for item in snapshots if item["source"] == "auto"), None)
    now_epoch = int(time.time())
    if latest_auto and now_epoch - int(latest_auto["created_at_epoch"]) < AUTO_BACKUP_INTERVAL_SECONDS:
        return None
    return create_backup_snapshot("auto")


def start_auto_backup_worker() -> None:
    def worker():
        while True:
            try:
                maybe_create_automatic_snapshot()
            except Exception as exc:
                print(f"[lera] automatic backup failed: {exc}")
            time.sleep(min(3600, AUTO_BACKUP_INTERVAL_SECONDS))

    maybe_create_automatic_snapshot()
    threading.Thread(target=worker, daemon=True).start()


def get_query_param(query: str, *keys: str) -> str:
    params = parse_qs(query)
    for key in keys:
        value = params.get(key, [""])[0].strip()
        if value:
            return value
    return ""


DEFAULT_CODEBOOK = [
    {"category": "foundation", "code": "FA", "parent_code": "", "label_zh": "学习", "label_es": "Aprendizaje", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FA1", "parent_code": "FA", "label_zh": "过去的错误", "label_es": "Error previo", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FA2", "parent_code": "FA", "label_zh": "他者文化影响", "label_es": "Influencia de otra cultura", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FA3", "parent_code": "FA", "label_zh": "新的风味与口感组合", "label_es": "Nuevas combinaciones de sabores y texturas", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FA4", "parent_code": "FA", "label_zh": "新的食材组合", "label_es": "Nuevas combinaciones de ingredientes", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FA5", "parent_code": "FA", "label_zh": "与他人的互动", "label_es": "Interacción con otras personas", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FAx", "parent_code": "FA", "label_zh": "新的学习方向", "label_es": "Nuevo aprendizaje identificado", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FE", "parent_code": "", "label_zh": "情绪", "label_es": "Emoción", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FE1", "parent_code": "FE", "label_zh": "有趣", "label_es": "Divertido", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FEx", "parent_code": "FE", "label_zh": "新的情绪方向", "label_es": "Nuevo enfoque emocional", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FM", "parent_code": "", "label_zh": "记忆", "label_es": "Memoria", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FM1", "parent_code": "FM", "label_zh": "家庭 / 童年记忆", "label_es": "Memoria de casa / infancia", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FM2", "parent_code": "FM", "label_zh": "味觉记忆", "label_es": "Recuerdos gustativos", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FMx", "parent_code": "FM", "label_zh": "新的记忆方向", "label_es": "Nueva referencia de memoria", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FP", "parent_code": "", "label_zh": "产品", "label_es": "Producto", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FP1", "parent_code": "FP", "label_zh": "寻找每个部位的最佳质地", "label_es": "Búsqueda de la mejor textura para cada pieza", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FP2", "parent_code": "FP", "label_zh": "整体利用", "label_es": "Aprovechamiento total", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FP3", "parent_code": "FP", "label_zh": "更换主角产品", "label_es": "Cambio de protagonista del plato", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FP4", "parent_code": "FP", "label_zh": "寻找感官属性组合", "label_es": "Búsqueda de la combinación de atributos sensoriales", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FPR", "parent_code": "FP", "label_zh": "零散食谱记录", "label_es": "Registro de receta suelta", "status": "active", "notes": "ZH: 保留给未进入正式菜品系统的小食谱或测试记录。 ES: Reservado para recetas pequeñas o registros de prueba que todavía no entran en el sistema formal de platos."},
    {"category": "foundation", "code": "FPx", "parent_code": "FP", "label_zh": "新的产品导向", "label_es": "Nuevo enfoque centrado en el producto", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FT", "parent_code": "", "label_zh": "传统", "label_es": "Tradición", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FT1", "parent_code": "FT", "label_zh": "不改动的传统", "label_es": "Tradición sin tocar", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FT2", "parent_code": "FT", "label_zh": "祖传技法", "label_es": "Técnicas ancestrales", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FT3", "parent_code": "FT", "label_zh": "新的传统呈现方式", "label_es": "Nuevas formas de presentar la tradición", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FT4", "parent_code": "FT", "label_zh": "替换传统配方元素", "label_es": "Cambio de elementos de una receta tradicional", "status": "active", "notes": ""},
    {"category": "foundation", "code": "FTx", "parent_code": "FT", "label_zh": "新的传统再诠释", "label_es": "Nueva reinterpretación de la tradición", "status": "active", "notes": ""},
    {"category": "product", "code": "PA", "parent_code": "", "label_zh": "小型野味", "label_es": "Caza menor", "status": "active", "notes": ""},
    {"category": "product", "code": "PA1", "parent_code": "PA", "label_zh": "鹧鸪", "label_es": "Perdiz", "status": "active", "notes": ""},
    {"category": "product", "code": "PA2", "parent_code": "PA", "label_zh": "雉鸡", "label_es": "Faisán", "status": "active", "notes": ""},
    {"category": "product", "code": "PA3", "parent_code": "PA", "label_zh": "鹌鹑", "label_es": "Codorniz", "status": "active", "notes": ""},
    {"category": "product", "code": "PA4", "parent_code": "PA", "label_zh": "斑鸠", "label_es": "Tórtola", "status": "active", "notes": ""},
    {"category": "product", "code": "PA5", "parent_code": "PA", "label_zh": "斑尾林鸽", "label_es": "Paloma torcaz", "status": "active", "notes": ""},
    {"category": "product", "code": "PA6", "parent_code": "PA", "label_zh": "野鸽", "label_es": "Paloma zurita", "status": "active", "notes": ""},
    {"category": "product", "code": "PA7", "parent_code": "PA", "label_zh": "原鸽", "label_es": "Paloma bravía", "status": "active", "notes": ""},
    {"category": "product", "code": "PA8", "parent_code": "PA", "label_zh": "乳鸽", "label_es": "Pichón", "status": "active", "notes": ""},
    {"category": "product", "code": "PA9", "parent_code": "PA", "label_zh": "丘鹬", "label_es": "Becada", "status": "active", "notes": ""},
    {"category": "product", "code": "PA10", "parent_code": "PA", "label_zh": "鸭", "label_es": "Pato", "status": "active", "notes": ""},
    {"category": "product", "code": "PA11", "parent_code": "PA", "label_zh": "小凫", "label_es": "Cerceta", "status": "active", "notes": ""},
    {"category": "product", "code": "PAx", "parent_code": "PA", "label_zh": "新增小型野味类别", "label_es": "Nueva categoría de caza menor", "status": "active", "notes": ""},
    {"category": "product", "code": "PB", "parent_code": "", "label_zh": "大型野味", "label_es": "Caza mayor", "status": "active", "notes": ""},
    {"category": "product", "code": "PB1", "parent_code": "PB", "label_zh": "野猪", "label_es": "Jabalí", "status": "active", "notes": ""},
    {"category": "product", "code": "PB2", "parent_code": "PB", "label_zh": "鹿", "label_es": "Ciervo", "status": "active", "notes": ""},
    {"category": "product", "code": "PB3", "parent_code": "PB", "label_zh": "狍", "label_es": "Corzo", "status": "active", "notes": ""},
    {"category": "product", "code": "PB4", "parent_code": "PB", "label_zh": "盘羊", "label_es": "Muflón", "status": "active", "notes": ""},
    {"category": "product", "code": "PBx", "parent_code": "PB", "label_zh": "新增大型野味类别", "label_es": "Nueva categoría de caza mayor", "status": "active", "notes": ""},
    {"category": "product", "code": "PC", "parent_code": "", "label_zh": "农场类", "label_es": "Producto de granja", "status": "active", "notes": ""},
    {"category": "product", "code": "PC1", "parent_code": "PC", "label_zh": "散养鸡", "label_es": "Pollo de corral", "status": "active", "notes": ""},
    {"category": "product", "code": "PC2", "parent_code": "PC", "label_zh": "阉鸡", "label_es": "Capón", "status": "active", "notes": ""},
    {"category": "product", "code": "PC3", "parent_code": "PC", "label_zh": "猪", "label_es": "Cerdo", "status": "active", "notes": ""},
    {"category": "product", "code": "PC4", "parent_code": "PC", "label_zh": "牛", "label_es": "Vaca", "status": "active", "notes": ""},
    {"category": "product", "code": "PC5", "parent_code": "PC", "label_zh": "羔羊", "label_es": "Cordero", "status": "active", "notes": ""},
    {"category": "product", "code": "PCx", "parent_code": "PC", "label_zh": "新增农场类别", "label_es": "Nueva categoría de granja", "status": "active", "notes": ""},
    {"category": "product", "code": "PH", "parent_code": "", "label_zh": "园圃", "label_es": "Huerto", "status": "active", "notes": ""},
    {"category": "product", "code": "PH1", "parent_code": "PH", "label_zh": "豆类", "label_es": "Legumbres", "status": "active", "notes": ""},
    {"category": "product", "code": "PHx", "parent_code": "PH", "label_zh": "新增园圃类别", "label_es": "Nueva categoría de huerto", "status": "active", "notes": ""},
    {"category": "product", "code": "PZ1", "parent_code": "PZ", "label_zh": "未归类零散记录", "label_es": "Registro suelto sin clasificar", "status": "active", "notes": "ZH: 保留给零散食谱使用。 ES: Reservado para el uso de recetas sueltas."},
    {"category": "product", "code": "PZ", "parent_code": "", "label_zh": "零散记录", "label_es": "Registro suelto", "status": "active", "notes": "ZH: 保留给尚未归入正式原料分类的零散食谱。 ES: Reservado para recetas sueltas que todavía no se han clasificado dentro de la categoría formal de producto."},
]


def connect_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def ensure_column(conn: sqlite3.Connection, table_name: str, column_name: str, definition: str) -> None:
    columns = {row["name"] for row in conn.execute(f"PRAGMA table_info({table_name})").fetchall()}
    if column_name not in columns:
        conn.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}")


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with connect_db() as conn:
        conn.executescript(
            """
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
            """
        )
        ensure_column(conn, "dishes", "draft_key", "TEXT")
        ensure_column(conn, "methodology_records", "methodology_event_code", "TEXT")
        ensure_column(conn, "methodology_records", "methodology_record_type", "TEXT DEFAULT 'project'")

        conn.executemany(
            """
            INSERT INTO codebook (category, code, parent_code, label_zh, label_es, status, notes)
            VALUES (:category, :code, :parent_code, :label_zh, :label_es, :status, :notes)
            ON CONFLICT(category, code) DO UPDATE SET
              parent_code = excluded.parent_code,
              label_zh = excluded.label_zh,
              label_es = excluded.label_es,
              status = excluded.status,
              notes = excluded.notes,
              updated_at = CURRENT_TIMESTAMP
            """,
            DEFAULT_CODEBOOK,
        )
        conn.commit()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            required_files = [
                ROOT / "index.html",
                ROOT / "methodology.html",
                ROOT / "restaurant-database" / "index.html",
                ROOT / "restaurant-database" / "catalog.html",
                ROOT / "restaurant-database" / "codebook.html",
                ROOT / "restaurant-database" / "methodology-list.html",
            ]
            files_ok = all(path.exists() for path in required_files)
            backup_summary = get_backup_snapshot_summary()
            return self._send_json(
                {
                    "ok": True,
                    "app": "lera",
                    "files_ok": files_ok,
                    "instance_id": INSTANCE_ID,
                    "backup_summary": {
                        "count": len(backup_summary["snapshots"]),
                        "latest_auto": backup_summary["latest_auto"],
                        "latest_manual": backup_summary["latest_manual"],
                    },
                }
            )
        if parsed.path == "/api/dishes":
            return self._handle_get_dishes(parsed.query)
        if parsed.path == "/api/subproducts":
            return self._handle_get_subproducts()
        if parsed.path == "/api/recipe":
            return self._handle_get_recipe(parsed.query)
        if parsed.path == "/api/codebook":
            return self._handle_get_codebook()
        if parsed.path == "/api/methodology":
            return self._handle_get_methodology(parsed.query)
        if parsed.path == "/api/backup":
            return self._handle_get_backup()
        if parsed.path == "/api/backup-snapshots":
            return self._handle_get_backup_snapshots()
        if parsed.path == "/api/backup-file":
            return self._handle_get_backup_file(parsed.query)
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/deploy-webhook":
            return self._handle_deploy_webhook()
        if parsed.path == "/api/dishes":
            return self._handle_post_dish()
        if parsed.path == "/api/recipe":
            return self._handle_post_recipe()
        if parsed.path == "/api/codebook":
            return self._handle_post_codebook()
        if parsed.path == "/api/methodology":
            return self._handle_post_methodology()
        if parsed.path == "/api/backup":
            return self._handle_post_backup()
        if parsed.path == "/api/backup-snapshots":
            return self._handle_post_backup_snapshot()
        if parsed.path == "/api/backup-restore":
            return self._handle_post_backup_restore()
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/dishes":
            return self._handle_delete_dishes(parsed.query)
        if parsed.path == "/api/recipe":
            return self._handle_delete_recipe(parsed.query)
        if parsed.path == "/api/codebook":
            return self._handle_delete_codebook(parsed.query)
        if parsed.path == "/api/methodology":
            return self._handle_delete_methodology(parsed.query)
        self.send_error(HTTPStatus.NOT_FOUND)

    def end_headers(self):
        self._send_cors_headers()
        super().end_headers()

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _read_body(self):
        length = int(self.headers.get("Content-Length", "0"))
        return self.rfile.read(length) if length else b""

    def _read_json(self):
        raw = self._read_body() or b"{}"
        return json.loads(raw.decode("utf-8"))

    def _verify_github_signature(self, raw_body):
        signature = self.headers.get("X-Hub-Signature-256", "")
        if not DEPLOY_WEBHOOK_SECRET or not signature.startswith("sha256="):
            return False
        expected = "sha256=" + hmac.new(
            DEPLOY_WEBHOOK_SECRET.encode("utf-8"),
            raw_body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(signature, expected)

    def _schedule_process_restart(self):
        def delayed_exit():
            time.sleep(1.0)
            os._exit(0)

        threading.Thread(target=delayed_exit, daemon=True).start()

    def _handle_deploy_webhook(self):
        if not DEPLOY_WEBHOOK_SECRET:
            return self._send_json(
                {"ok": False, "error": "deploy-webhook-not-configured"},
                status=HTTPStatus.SERVICE_UNAVAILABLE,
            )

        raw = self._read_body()
        if not self._verify_github_signature(raw):
            return self._send_json(
                {"ok": False, "error": "invalid-signature"},
                status=HTTPStatus.FORBIDDEN,
            )

        try:
            payload = json.loads((raw or b"{}").decode("utf-8"))
        except json.JSONDecodeError:
            return self._send_json(
                {"ok": False, "error": "invalid-json"},
                status=HTTPStatus.BAD_REQUEST,
            )

        event = (self.headers.get("X-GitHub-Event") or "").strip()
        delivery = (self.headers.get("X-GitHub-Delivery") or "").strip()

        if event == "ping":
            zen = str(payload.get("zen", "")).strip()
            return self._send_json({"ok": True, "event": "ping", "delivery": delivery, "zen": zen})

        if event != "push":
            return self._send_json({"ok": True, "ignored": True, "reason": f"unsupported-event:{event or 'unknown'}"})

        full_name = str(payload.get("repository", {}).get("full_name", "")).strip()
        expected_repo = DEPLOY_REPO.strip()
        if expected_repo and full_name != expected_repo:
            return self._send_json(
                {
                    "ok": True,
                    "ignored": True,
                    "reason": "repository-mismatch",
                    "expected_repo": expected_repo,
                    "received_repo": full_name,
                }
            )

        ref = str(payload.get("ref", "")).strip()
        expected_ref = f"refs/heads/{DEPLOY_BRANCH}"
        if ref != expected_ref:
            return self._send_json(
                {
                    "ok": True,
                    "ignored": True,
                    "reason": "branch-mismatch",
                    "expected_ref": expected_ref,
                    "received_ref": ref,
                }
            )

        result = subprocess.run(
            ["git", "-C", str(ROOT), "pull", "--ff-only", "origin", DEPLOY_BRANCH],
            capture_output=True,
            text=True,
            timeout=60,
        )
        output = "\n".join(part for part in [result.stdout.strip(), result.stderr.strip()] if part).strip()
        if result.returncode != 0:
            return self._send_json(
                {
                    "ok": False,
                    "error": "git-pull-failed",
                    "delivery": delivery,
                    "output": output,
                },
                status=HTTPStatus.INTERNAL_SERVER_ERROR,
            )

        restart_scheduled = DEPLOY_RESTART and "Already up to date." not in output
        if restart_scheduled:
            self._schedule_process_restart()

        self._send_json(
            {
                "ok": True,
                "event": event,
                "delivery": delivery,
                "repository": full_name,
                "ref": ref,
                "restart_scheduled": restart_scheduled,
                "output": output or "git-pull-ok",
            }
        )

    def _send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_download(self, payload, filename):
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file_download(self, path: Path, filename: str, content_type="application/octet-stream"):
        body = path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _handle_get_dishes(self, query):
        dish_code = get_query_param(query, "dish_code", "dishCode")

        with connect_db() as conn:
            if dish_code:
                row = conn.execute(
                    """
                    SELECT dish_code, draft_key, year_code, foundation_code, product_code, season_code,
                           month_no, seq_no, dish_name, recipe_text, methodology_main_code,
                           methodology_version_code, notes, created_at, updated_at
                    FROM dishes
                    WHERE dish_code = ?
                    """,
                    (dish_code,),
                ).fetchone()
                if not row:
                    return self._send_json({})
                payload = dict(row)
                payload["methodology_records"] = self._get_methodology_records(conn, [payload.get("draft_key", "")]).get(payload.get("draft_key", ""), [])
                return self._send_json(payload)

            rows = conn.execute(
                """
                SELECT dish_code, draft_key, year_code, foundation_code, product_code, season_code,
                       month_no, seq_no, dish_name, recipe_text, methodology_main_code,
                       methodology_version_code, notes, created_at, updated_at
                FROM dishes
                ORDER BY year_code, foundation_code, product_code, season_code, month_no, seq_no
                """
            ).fetchall()
            payload = [dict(row) for row in rows]
            record_map = self._get_methodology_records(conn, [row.get("draft_key", "") for row in payload])
        for row in payload:
            row["methodology_records"] = record_map.get(row.get("draft_key", ""), [])
        self._send_json(payload)

    def _get_methodology_records(self, conn, draft_keys):
        keys = [key for key in draft_keys if key]
        if not keys:
            return {}

        placeholders = ",".join("?" for _ in keys)
        rows = conn.execute(
            f"""
            SELECT draft_key, methodology_main_code, methodology_version_code, sort_order
                   , methodology_event_code, methodology_record_type
            FROM methodology_records
            WHERE draft_key IN ({placeholders})
            ORDER BY sort_order, id
            """,
            keys,
        ).fetchall()

        grouped = {key: [] for key in keys}
        for row in rows:
            grouped.setdefault(row["draft_key"], []).append(
                {
                    "methodology_main_code": row["methodology_main_code"] or "",
                    "methodology_version_code": row["methodology_version_code"] or "",
                    "methodology_event_code": row["methodology_event_code"] or "",
                    "methodology_record_type": row["methodology_record_type"] or "project",
                    "sort_order": row["sort_order"] or 0,
                }
            )
        return grouped

    def _handle_get_methodology(self, query):
        project_code = get_query_param(query, "project_code", "projectCode")
        version_code = get_query_param(query, "version_code", "versionCode")

        with connect_db() as conn:
            if project_code and version_code:
                row = conn.execute(
                    """
                    SELECT project_code, version_code, dish_name, linked_dish_code, project_origin,
                           current_stage, current_status, foundation_code, product_code, payload_json,
                           created_at, updated_at
                    FROM methodology_projects
                    WHERE project_code = ? AND version_code = ?
                    """,
                    (project_code, version_code),
                ).fetchone()
                if not row:
                    return self._send_json({})
                payload = dict(row)
                try:
                    payload["payload_json"] = json.loads(payload["payload_json"])
                except json.JSONDecodeError:
                    payload["payload_json"] = {}
                return self._send_json(payload)

            if project_code:
                rows = conn.execute(
                    """
                    SELECT project_code, version_code, dish_name, linked_dish_code, project_origin,
                           current_stage, current_status, foundation_code, product_code, payload_json,
                           created_at, updated_at
                    FROM methodology_projects
                    WHERE project_code = ?
                    ORDER BY updated_at DESC, version_code DESC
                    """,
                    (project_code,),
                ).fetchall()
                summary = self._summarize_methodology_rows(rows)
                if not summary:
                    return self._send_json({})
                latest = summary[0]
                detail_row = conn.execute(
                    """
                    SELECT project_code, version_code, dish_name, linked_dish_code, project_origin,
                           current_stage, current_status, foundation_code, product_code, payload_json,
                           created_at, updated_at
                    FROM methodology_projects
                    WHERE project_code = ? AND version_code = ?
                    """,
                    (latest["project_code"], latest["version_code"]),
                ).fetchone()
                payload = dict(detail_row)
                try:
                    payload["payload_json"] = json.loads(payload["payload_json"])
                except json.JSONDecodeError:
                    payload["payload_json"] = {}
                payload["version_codes"] = latest["version_codes"]
                payload["latest_formal_version_code"] = latest["latest_formal_version_code"]
                return self._send_json(payload)

            rows = conn.execute(
                """
                SELECT project_code, version_code, dish_name, linked_dish_code, project_origin,
                       current_stage, current_status, foundation_code, product_code,
                       created_at, updated_at
                FROM methodology_projects
                ORDER BY updated_at DESC, project_code DESC, version_code DESC
                """
            ).fetchall()
        self._send_json(self._summarize_methodology_rows(rows))

    def _summarize_methodology_rows(self, rows):
        grouped = {}
        for row in rows:
            item = dict(row)
            grouped.setdefault(item["project_code"], []).append(item)

        summary = []
        for project_rows in grouped.values():
            project_rows.sort(key=lambda item: (item.get("updated_at", ""), item.get("version_code", "")), reverse=True)
            latest = dict(project_rows[0])
            version_codes = [item["version_code"] for item in sorted(project_rows, key=lambda item: item.get("version_code", ""))]
            latest["version_codes"] = version_codes
            formal_versions = [code for code in version_codes if code and code != latest["project_code"]]
            latest["latest_formal_version_code"] = formal_versions[-1] if formal_versions else ""
            summary.append(latest)

        summary.sort(key=lambda item: (item.get("updated_at", ""), item.get("project_code", "")), reverse=True)
        return summary

    def _handle_get_subproducts(self):
        with connect_db() as conn:
            rows = conn.execute(
                """
                SELECT r.draft_key, r.dish_code, r.dish_name, r.payload_json,
                       d.foundation_code, d.product_code, d.season_code, d.month_no,
                       d.methodology_main_code, d.methodology_version_code
                FROM recipe_entries r
                LEFT JOIN dishes d ON d.draft_key = r.draft_key
                ORDER BY r.updated_at DESC
                """
            ).fetchall()

        subproducts = []
        for row in rows:
            try:
                payload = json.loads(row["payload_json"])
            except json.JSONDecodeError:
                payload = {}
            modules = payload.get("modules") or []
            for index, module in enumerate(modules):
                module_name = str(module.get("name", "")).strip()
                if not module_name:
                    continue
                subproducts.append({
                    "draft_key": row["draft_key"],
                    "dish_code": row["dish_code"] or "",
                    "dish_name": row["dish_name"] or "",
                    "foundation_code": row["foundation_code"] or "",
                    "product_code": row["product_code"] or "",
                    "season_code": row["season_code"] or "",
                    "month_no": row["month_no"] or "",
                    "methodology_main_code": row["methodology_main_code"] or "",
                    "methodology_version_code": row["methodology_version_code"] or "",
                    "module_name": module_name,
                    "module_index": index + 1,
                })

        self._send_json(subproducts)

    def _handle_post_dish(self):
        payload = self._read_json()
        required = ["dish_code", "year_code", "foundation_code", "product_code", "season_code", "month_no", "seq_no", "dish_name"]
        missing = [field for field in required if not payload.get(field)]
        if missing:
            return self._send_json({"error": f"Missing fields: {', '.join(missing)}"}, status=HTTPStatus.BAD_REQUEST)

        original_dish_code = str(payload.get("original_dish_code", "")).strip()
        methodology_records = payload.get("methodology_records", [])

        try:
            with connect_db() as conn:
                if original_dish_code and original_dish_code != payload["dish_code"]:
                    cursor = conn.execute(
                        """
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
                        """,
                        {**payload, "original_dish_code": original_dish_code},
                    )
                    if cursor.rowcount:
                        conn.execute(
                            """
                            UPDATE recipe_entries
                            SET dish_code = :dish_code,
                                dish_name = :dish_name,
                                updated_at = CURRENT_TIMESTAMP
                            WHERE draft_key = :draft_key
                            """,
                            payload,
                        )
                        self._replace_methodology_records(conn, payload["draft_key"], payload["dish_code"], methodology_records)
                        self._link_dish_to_methodology(conn, payload["dish_code"], methodology_records)
                        conn.commit()
                        return self._send_json({"ok": True})

                conn.execute(
                    """
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
                    """,
                    payload,
                )
                self._replace_methodology_records(conn, payload["draft_key"], payload["dish_code"], methodology_records)
                self._link_dish_to_methodology(conn, payload["dish_code"], methodology_records)
                conn.execute(
                    """
                    UPDATE recipe_entries
                    SET dish_code = :dish_code,
                        dish_name = :dish_name,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE draft_key = :draft_key
                    """,
                    payload,
                )
                conn.commit()
        except sqlite3.IntegrityError as exc:
            return self._send_json({"error": str(exc)}, status=HTTPStatus.CONFLICT)
        self._send_json({"ok": True})

    def _replace_methodology_records(self, conn, draft_key, dish_code, records):
        if not draft_key:
            return
        conn.execute("DELETE FROM methodology_records WHERE draft_key = ?", (draft_key,))
        normalized = []
        for index, item in enumerate(records or []):
            main_code = str(item.get("methodology_main_code", "")).strip()
            version_code = str(item.get("methodology_version_code", "")).strip()
            event_code = str(item.get("methodology_event_code", "")).strip()
            record_type = str(item.get("methodology_record_type", "")).strip() or ("event" if event_code else "project")
            if not main_code and not version_code and not event_code:
                continue
            normalized.append(
                {
                    "draft_key": draft_key,
                    "dish_code": dish_code,
                    "methodology_main_code": main_code,
                    "methodology_version_code": version_code,
                    "methodology_event_code": event_code,
                    "methodology_record_type": record_type,
                    "sort_order": index,
                }
            )
        if normalized:
            conn.executemany(
                """
                INSERT INTO methodology_records (
                  draft_key, dish_code, methodology_main_code, methodology_version_code,
                  methodology_event_code, methodology_record_type, sort_order
                ) VALUES (
                  :draft_key, :dish_code, :methodology_main_code, :methodology_version_code,
                  :methodology_event_code, :methodology_record_type, :sort_order
                )
                """,
                normalized,
            )

    def _link_dish_to_methodology(self, conn, dish_code, records):
        for item in records or []:
            main_code = str(item.get("methodology_main_code", "")).strip()
            version_code = str(item.get("methodology_version_code", "")).strip()
            if not main_code:
                continue
            if version_code:
                conn.execute(
                    """
                    UPDATE methodology_projects
                    SET linked_dish_code = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE project_code = ? AND version_code = ?
                    """,
                    (dish_code, main_code, version_code),
                )
                continue
            conn.execute(
                """
                UPDATE methodology_projects
                SET linked_dish_code = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE project_code = ?
                """,
                (dish_code, main_code),
            )

    def _handle_get_recipe(self, query):
        draft_key = get_query_param(query, "draft_key", "draftKey")
        if not draft_key:
            return self._send_json({"error": "Missing draft_key"}, status=HTTPStatus.BAD_REQUEST)

        with connect_db() as conn:
            row = conn.execute(
                """
                SELECT draft_key, dish_code, dish_name, summary_text, payload_json, updated_at
                FROM recipe_entries
                WHERE draft_key = ?
                """,
                (draft_key,),
            ).fetchone()
        if not row:
            return self._send_json({})
        payload = dict(row)
        try:
            payload["payload_json"] = json.loads(payload["payload_json"])
        except json.JSONDecodeError:
            payload["payload_json"] = {}
        self._send_json(payload)

    def _handle_post_methodology(self):
        payload = self._read_json()
        project_code = str(payload.get("project_code", "")).strip()
        version_code = str(payload.get("version_code", "")).strip() or project_code
        original_project_code = str(payload.get("original_project_code", "")).strip()
        original_version_code = str(payload.get("original_version_code", "")).strip()
        raw_payload = payload.get("payload_json", {})

        if not project_code or not version_code:
            return self._send_json({"error": "Missing project_code or version_code"}, status=HTTPStatus.BAD_REQUEST)

        with connect_db() as conn:
            params = {
                "project_code": project_code,
                "version_code": version_code,
                "dish_name": payload.get("dish_name", ""),
                "linked_dish_code": payload.get("linked_dish_code", ""),
                "project_origin": payload.get("project_origin", ""),
                "current_stage": payload.get("current_stage", ""),
                "current_status": payload.get("current_status", ""),
                "foundation_code": payload.get("foundation_code", ""),
                "product_code": payload.get("product_code", ""),
                "payload_json": json.dumps(raw_payload, ensure_ascii=False),
            }

            updated = 0
            if original_project_code and original_version_code:
                cursor = conn.execute(
                    """
                    UPDATE methodology_projects
                    SET project_code = :project_code,
                        version_code = :version_code,
                        dish_name = :dish_name,
                        linked_dish_code = CASE
                          WHEN :linked_dish_code IS NOT NULL AND :linked_dish_code != '' THEN :linked_dish_code
                          ELSE linked_dish_code
                        END,
                        project_origin = :project_origin,
                        current_stage = :current_stage,
                        current_status = :current_status,
                        foundation_code = :foundation_code,
                        product_code = :product_code,
                        payload_json = :payload_json,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE project_code = :original_project_code
                      AND version_code = :original_version_code
                    """,
                    {
                        **params,
                        "original_project_code": original_project_code,
                        "original_version_code": original_version_code,
                    },
                )
                updated = cursor.rowcount or 0

            if not updated:
                conn.execute(
                    """
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
                    """,
                    params,
                )
            conn.commit()
        self._send_json({"ok": True})

    def _handle_post_recipe(self):
        payload = self._read_json()
        draft_key = str(payload.get("draft_key", "")).strip()
        raw_recipe_payload = payload.get("payload_json", {})

        if not draft_key:
            return self._send_json({"error": "Missing draft_key"}, status=HTTPStatus.BAD_REQUEST)

        with connect_db() as conn:
            conn.execute(
                """
                INSERT INTO recipe_entries (draft_key, dish_code, dish_name, summary_text, payload_json)
                VALUES (:draft_key, :dish_code, :dish_name, :summary_text, :payload_json)
                ON CONFLICT(draft_key) DO UPDATE SET
                  dish_code = excluded.dish_code,
                  dish_name = excluded.dish_name,
                  summary_text = excluded.summary_text,
                  payload_json = excluded.payload_json,
                  updated_at = CURRENT_TIMESTAMP
                """,
                {
                    "draft_key": draft_key,
                    "dish_code": payload.get("dish_code", ""),
                    "dish_name": payload.get("dish_name", ""),
                    "summary_text": payload.get("summary_text", ""),
                    "payload_json": json.dumps(raw_recipe_payload, ensure_ascii=False),
                },
            )
            conn.commit()
        self._send_json({"ok": True})

    def _handle_delete_dishes(self, query=""):
        return self._handle_delete_dish(query)

    def _handle_delete_recipe(self, query):
        draft_key = get_query_param(query, "draft_key", "draftKey")
        if not draft_key:
            return self._send_json({"error": "Missing draft_key"}, status=HTTPStatus.BAD_REQUEST)

        with connect_db() as conn:
            conn.execute("DELETE FROM recipe_entries WHERE draft_key = ?", (draft_key,))
            conn.execute("UPDATE dishes SET recipe_text = '', updated_at = CURRENT_TIMESTAMP WHERE draft_key = ?", (draft_key,))
            conn.commit()
        self._send_json({"ok": True})

    def _handle_delete_dish(self, query):
        dish_code = get_query_param(query, "dish_code", "dishCode")
        if not dish_code:
            return self._send_json({"error": "Missing dish_code"}, status=HTTPStatus.BAD_REQUEST)

        with connect_db() as conn:
            row = conn.execute("SELECT draft_key FROM dishes WHERE dish_code = ?", (dish_code,)).fetchone()
            if row:
                draft_key = row["draft_key"] or ""
                conn.execute("DELETE FROM dishes WHERE dish_code = ?", (dish_code,))
                if draft_key:
                    conn.execute("DELETE FROM recipe_entries WHERE draft_key = ?", (draft_key,))
                    conn.execute("DELETE FROM methodology_records WHERE draft_key = ?", (draft_key,))
                conn.commit()
        self._send_json({"ok": True})

    def _handle_get_codebook(self):
        with connect_db() as conn:
            rows = conn.execute(
                """
                SELECT category, code, parent_code, label_zh, label_es, status, notes, created_at, updated_at
                FROM codebook
                ORDER BY category, code
                """
            ).fetchall()
        self._send_json([dict(row) for row in rows])

    def _handle_post_codebook(self):
        payload = self._read_json()
        required = ["category", "code", "label_zh", "label_es", "status"]
        missing = [field for field in required if not payload.get(field)]
        if missing:
            return self._send_json({"error": f"Missing fields: {', '.join(missing)}"}, status=HTTPStatus.BAD_REQUEST)

        with connect_db() as conn:
            conn.execute(
                """
                INSERT INTO codebook (category, code, parent_code, label_zh, label_es, status, notes)
                VALUES (:category, :code, :parent_code, :label_zh, :label_es, :status, :notes)
                ON CONFLICT(category, code) DO UPDATE SET
                  parent_code = excluded.parent_code,
                  label_zh = excluded.label_zh,
                  label_es = excluded.label_es,
                  status = excluded.status,
                  notes = excluded.notes,
                  updated_at = CURRENT_TIMESTAMP
                """,
                payload,
            )
            conn.commit()
        self._send_json({"ok": True})

    def _handle_delete_codebook(self, query):
        params = parse_qs(query)
        category = params.get("category", [""])[0].strip()
        code = params.get("code", [""])[0].strip()
        if not category or not code:
            return self._send_json({"error": "Missing category or code"}, status=HTTPStatus.BAD_REQUEST)

        with connect_db() as conn:
            conn.execute(
                "DELETE FROM codebook WHERE category = ? AND code = ?",
                (category, code),
            )
            conn.commit()
        self._send_json({"ok": True})

    def _handle_delete_methodology(self, query):
        project_code = get_query_param(query, "project_code", "projectCode")
        if not project_code:
            return self._send_json({"error": "Missing project_code"}, status=HTTPStatus.BAD_REQUEST)

        with connect_db() as conn:
            conn.execute("DELETE FROM methodology_projects WHERE project_code = ?", (project_code,))
            conn.execute("DELETE FROM methodology_records WHERE methodology_main_code = ?", (project_code,))
            conn.execute(
                """
                UPDATE dishes
                SET methodology_main_code = '',
                    methodology_version_code = '',
                    updated_at = CURRENT_TIMESTAMP
                WHERE methodology_main_code = ?
                """,
                (project_code,),
            )
            conn.commit()
        self._send_json({"ok": True})

    def _handle_get_backup(self):
        with connect_db() as conn:
            payload = {
                "version": 1,
                "exported_at": utc_now_iso(),
                "codebook": [dict(row) for row in conn.execute("SELECT category, code, parent_code, label_zh, label_es, status, notes, created_at, updated_at FROM codebook ORDER BY category, code")],
                "dishes": [dict(row) for row in conn.execute("SELECT * FROM dishes ORDER BY id")],
                "recipes": [dict(row) for row in conn.execute("SELECT * FROM recipe_entries ORDER BY id")],
                "methodology_records": [dict(row) for row in conn.execute("SELECT * FROM methodology_records ORDER BY id")],
                "methodology_projects": [dict(row) for row in conn.execute("SELECT * FROM methodology_projects ORDER BY id")],
            }
        self._send_download(payload, "copia-de-seguridad-lera.json")

    def _handle_post_backup(self):
        payload = self._read_json()
        required = ["codebook", "dishes", "recipes", "methodology_records", "methodology_projects"]
        missing = [key for key in required if key not in payload]
        if missing:
            return self._send_json({"error": f"Missing backup sections: {', '.join(missing)}"}, status=HTTPStatus.BAD_REQUEST)

        safety_snapshot = create_backup_snapshot("before-json-import")
        with connect_db() as conn:
            conn.execute("DELETE FROM methodology_records")
            conn.execute("DELETE FROM recipe_entries")
            conn.execute("DELETE FROM dishes")
            conn.execute("DELETE FROM methodology_projects")
            conn.execute("DELETE FROM codebook")

            conn.executemany(
                """
                INSERT INTO codebook (category, code, parent_code, label_zh, label_es, status, notes, created_at, updated_at)
                VALUES (:category, :code, :parent_code, :label_zh, :label_es, :status, :notes, :created_at, :updated_at)
                """,
                payload.get("codebook", []),
            )
            conn.executemany(
                """
                INSERT INTO dishes (
                  id, dish_code, draft_key, year_code, foundation_code, product_code, season_code, month_no,
                  seq_no, dish_name, recipe_text, methodology_main_code, methodology_version_code, notes,
                  created_at, updated_at
                ) VALUES (
                  :id, :dish_code, :draft_key, :year_code, :foundation_code, :product_code, :season_code, :month_no,
                  :seq_no, :dish_name, :recipe_text, :methodology_main_code, :methodology_version_code, :notes,
                  :created_at, :updated_at
                )
                """,
                payload.get("dishes", []),
            )
            conn.executemany(
                """
                INSERT INTO recipe_entries (id, draft_key, dish_code, dish_name, summary_text, payload_json, updated_at)
                VALUES (:id, :draft_key, :dish_code, :dish_name, :summary_text, :payload_json, :updated_at)
                """,
                payload.get("recipes", []),
            )
            conn.executemany(
                """
                INSERT INTO methodology_records (
                  id, draft_key, dish_code, methodology_main_code, methodology_version_code,
                  methodology_event_code, methodology_record_type, sort_order, created_at, updated_at
                ) VALUES (
                  :id, :draft_key, :dish_code, :methodology_main_code, :methodology_version_code,
                  :methodology_event_code, :methodology_record_type, :sort_order, :created_at, :updated_at
                )
                """,
                payload.get("methodology_records", []),
            )
            conn.executemany(
                """
                INSERT INTO methodology_projects (
                  id, project_code, version_code, dish_name, linked_dish_code, project_origin,
                  current_stage, current_status, foundation_code, product_code, payload_json,
                  created_at, updated_at
                ) VALUES (
                  :id, :project_code, :version_code, :dish_name, :linked_dish_code, :project_origin,
                  :current_stage, :current_status, :foundation_code, :product_code, :payload_json,
                  :created_at, :updated_at
                )
                """,
                payload.get("methodology_projects", []),
            )
            conn.commit()
        self._send_json({"ok": True, "safety_snapshot": safety_snapshot})

    def _handle_get_backup_snapshots(self):
        self._send_json({"ok": True, **get_backup_snapshot_summary()})

    def _handle_post_backup_snapshot(self):
        payload = self._read_json()
        snapshot = create_backup_snapshot(payload.get("source", "manual"))
        self._send_json({"ok": True, "snapshot": snapshot, **get_backup_snapshot_summary()})

    def _handle_get_backup_file(self, query):
        snapshot_id = get_query_param(query, "snapshot_id", "snapshotId", "id")
        if not snapshot_id:
            return self._send_json({"error": "Missing snapshot_id"}, status=HTTPStatus.BAD_REQUEST)
        try:
            snapshot_path = resolve_backup_snapshot_path(snapshot_id)
        except FileNotFoundError:
            return self._send_json({"error": "Snapshot not found"}, status=HTTPStatus.NOT_FOUND)
        self._send_file_download(snapshot_path, snapshot_path.name, "application/x-sqlite3")

    def _handle_post_backup_restore(self):
        payload = self._read_json()
        snapshot_id = str(payload.get("snapshot_id") or payload.get("snapshotId") or "").strip()
        if not snapshot_id:
            return self._send_json({"error": "Missing snapshot_id"}, status=HTTPStatus.BAD_REQUEST)
        try:
            result = restore_backup_snapshot(snapshot_id)
            init_db()
        except FileNotFoundError:
            return self._send_json({"error": "Snapshot not found"}, status=HTTPStatus.NOT_FOUND)
        self._send_json({"ok": True, **result, **get_backup_snapshot_summary()})


def main():
    init_db()
    start_auto_backup_worker()
    host = os.environ.get("LERA_HOST", "0.0.0.0")
    port = int(os.environ.get("LERA_PORT", "8000"))
    server = ThreadingHTTPServer((host, port), Handler)
    display_host = "127.0.0.1" if host == "0.0.0.0" else host
    print(f"Serving on http://{display_host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
