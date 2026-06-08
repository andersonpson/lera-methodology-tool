#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export LERA_ROOT="${LERA_ROOT:-$ROOT_DIR}"
export LERA_DB_PATH="${LERA_DB_PATH:-$ROOT_DIR/restaurant-database/restaurant.db}"
export LERA_HOST="${LERA_HOST:-0.0.0.0}"
export LERA_PORT="${LERA_PORT:-8000}"

exec python3 "$ROOT_DIR/restaurant-database/server.py"
