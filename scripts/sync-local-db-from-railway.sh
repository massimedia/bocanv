#!/usr/bin/env bash
# Replace local Docker Medusa DB with a dump from Railway production Postgres.
#
# Prerequisites:
#   - Docker: postgres on 127.0.0.1:5433 (see repo docker-compose.yml)
#   - Railway: TCP proxy enabled on PostgreSQL; copy DATABASE_PUBLIC_URL
#   - pg_dump and psql installed (PostgreSQL client tools)
#
# Setup (once):
#   cp backend/.env.railway.example backend/.env.railway
#   Edit backend/.env.railway — set export DATABASE_PUBLIC_URL='...'
#
# Run (from repo root):
#   ./scripts/sync-local-db-from-railway.sh
#
# After:
#   - Restart Medusa backend (npm run dev in backend/)
#   - In storefront/.env.local set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY from
#     http://localhost:9000/app → Settings → Publishable API Keys
#
# Note: Railway may run Postgres 17/18; local docker-compose often uses 16.
# This script strips dump directives that older Postgres/psql reject (e.g.
# SET transaction_timeout, \\restrict). If restore still errors, bump
# postgres image in docker-compose.yml to match production.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RAILWAY_ENV="$ROOT/backend/.env.railway"
LOCAL_URL="${LOCAL_DATABASE_URL:-postgres://postgres:postgres@127.0.0.1:5433/medusa}"
DUMP_DIR="$ROOT/.dumps"
STAMP="$(date +%Y%m%d-%H%M%S)"
RAW_DUMP="$DUMP_DIR/medusa-railway-${STAMP}.raw.sql"
SANITIZED_DUMP="$DUMP_DIR/medusa-railway-${STAMP}.sql"

if [ -f "$RAILWAY_ENV" ]; then
  # shellcheck source=/dev/null
  source "$RAILWAY_ENV"
fi

if [ -z "${DATABASE_PUBLIC_URL:-}" ]; then
  echo "Missing DATABASE_PUBLIC_URL."
  echo "Create $RAILWAY_ENV (see backend/.env.railway.example) with:"
  echo "  export DATABASE_PUBLIC_URL='postgresql://...'"
  exit 1
fi

mkdir -p "$DUMP_DIR"

echo "==> Dumping production (Railway)…"
pg_dump "$DATABASE_PUBLIC_URL" --no-owner --no-acl --file="$RAW_DUMP"

echo "==> Sanitizing dump for local Postgres (strip newer-version-only lines)…"
sed \
  -e '/^SET transaction_timeout/d' \
  -e '/^\\restrict/d' \
  -e '/^\\unrestrict/d' \
  "$RAW_DUMP" > "$SANITIZED_DUMP"

echo "==> Wiping local database (Docker medusa)…"
psql "$LOCAL_URL" -v ON_ERROR_STOP=1 -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "==> Restoring into local…"
psql "$LOCAL_URL" -v ON_ERROR_STOP=1 -f "$SANITIZED_DUMP"

echo ""
echo "Done."
echo "  Raw dump:       $RAW_DUMP"
echo "  Restored from:  $SANITIZED_DUMP"
echo ""
echo "Next:"
echo "  1. cd backend && npm run dev"
echo "  2. Update storefront/.env.local publishable key from local admin"
echo "  3. Keep .dumps/ and backend/.env.railway out of git (already ignored)"
