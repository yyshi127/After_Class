#!/usr/bin/env bash
set -euo pipefail

if [[ -f ".env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env"
  set +a
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required. Copy .env.example to .env or export DATABASE_URL before running backups." >&2
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-./backups}"
STORAGE_PATH="${STORAGE_PATH:-./storage}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_NAME="afterclass-${TIMESTAMP}"
OUTPUT_DIR="${BACKUP_DIR}/${BACKUP_NAME}"
DB_DUMP_FILE="${OUTPUT_DIR}/postgres.dump"
STORAGE_ARCHIVE_FILE="${OUTPUT_DIR}/storage.tar.gz"
MANIFEST_FILE="${OUTPUT_DIR}/backup-manifest.txt"

mkdir -p "${OUTPUT_DIR}"

PG_DUMP_URL="$DATABASE_URL"
PG_DUMP_SCHEMA=""
if [[ "$DATABASE_URL" == *\?* ]]; then
  DATABASE_URL_BASE="${DATABASE_URL%%\?*}"
  DATABASE_URL_QUERY="${DATABASE_URL#*\?}"
  KEPT_QUERY_PARAMS=()
  IFS='&' read -r -a QUERY_PARAMS <<< "$DATABASE_URL_QUERY"
  for QUERY_PARAM in "${QUERY_PARAMS[@]}"; do
    case "$QUERY_PARAM" in
      schema=*) PG_DUMP_SCHEMA="${QUERY_PARAM#schema=}" ;;
      *)
        if [[ -n "$QUERY_PARAM" ]]; then
          KEPT_QUERY_PARAMS+=("$QUERY_PARAM")
        fi
        ;;
    esac
  done
  if (( ${#KEPT_QUERY_PARAMS[@]} > 0 )); then
    PG_DUMP_URL="$DATABASE_URL_BASE?$(IFS='&'; echo "${KEPT_QUERY_PARAMS[*]}")"
  else
    PG_DUMP_URL="$DATABASE_URL_BASE"
  fi
fi

PG_DUMP_ARGS=(--format=custom --no-owner --no-privileges --file="$DB_DUMP_FILE")
if [[ -n "$PG_DUMP_SCHEMA" ]]; then
  PG_DUMP_ARGS+=(--schema="$PG_DUMP_SCHEMA")
fi
pg_dump "${PG_DUMP_ARGS[@]}" "$PG_DUMP_URL"

if [[ -d "$STORAGE_PATH" ]]; then
  tar -czf "${STORAGE_ARCHIVE_FILE}" -C "${STORAGE_PATH}" .
else
  EMPTY_STORAGE_DIR="$(mktemp -d)"
  printf 'STORAGE_PATH did not exist at backup time: %s\n' "${STORAGE_PATH}" > "${EMPTY_STORAGE_DIR}/README.txt"
  tar -czf "${STORAGE_ARCHIVE_FILE}" -C "${EMPTY_STORAGE_DIR}" .
  rm -rf "${EMPTY_STORAGE_DIR}"
fi

{
  printf 'AfterClass backup manifest\n'
  printf 'created_at_utc=%s\n' "${TIMESTAMP}"
  printf 'database_dump=%s\n' "${DB_DUMP_FILE}"
  printf 'storage_archive=%s\n' "${STORAGE_ARCHIVE_FILE}"
  printf 'storage_path=%s\n' "${STORAGE_PATH}"
  printf 'restore_database=pg_restore --clean --if-exists --no-owner --dbname "$DATABASE_URL" "%s"\n' "${DB_DUMP_FILE}"
  printf 'restore_storage=tar -xzf "%s" -C "$STORAGE_PATH"\n' "${STORAGE_ARCHIVE_FILE}"
} > "${MANIFEST_FILE}"

printf 'Backup created: %s\n' "${OUTPUT_DIR}"
printf 'Database dump: %s\n' "${DB_DUMP_FILE}"
printf 'Storage archive: %s\n' "${STORAGE_ARCHIVE_FILE}"
printf 'Manifest: %s\n' "${MANIFEST_FILE}"
