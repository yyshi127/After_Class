#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-afterclass-smoke}"
WEB_PORT="${WEB_PORT:-3000}"
SMOKE_TIMEOUT_SECONDS="${SMOKE_TIMEOUT_SECONDS:-90}"
SMOKE_CLEANUP="${SMOKE_CLEANUP:-false}"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "$1 is required for deployment smoke verification. Run this script on a host with Docker Compose installed." >&2
    exit 1
  fi
}

require_non_placeholder() {
  local name="$1"
  local value="${!name:-}"

  if [[ -z "$value" || "$value" == "change-me-in-production" || "$value" == *"replace-with"* || "$value" == "afterclass_dev_password" ]]; then
    echo "$name must be set to a non-placeholder value before running deployment smoke verification." >&2
    exit 1
  fi
}

require_command docker
if ! docker compose version >/dev/null 2>&1; then
  echo "docker compose is required for deployment smoke verification." >&2
  exit 1
fi

require_non_placeholder AUTH_SECRET
require_non_placeholder POSTGRES_PASSWORD

export COMPOSE_PROJECT_NAME WEB_PORT

echo "Validating Docker Compose configuration..."
docker compose config >/dev/null

echo "Building production image..."
docker compose build

echo "Starting AfterClass stack..."
docker compose up -d postgres web

if [[ "$SMOKE_CLEANUP" == "true" ]]; then
  trap 'docker compose down --remove-orphans' EXIT
fi

echo "Waiting for web service on http://127.0.0.1:${WEB_PORT}/ ..."
end_time=$((SECONDS + SMOKE_TIMEOUT_SECONDS))
until curl --fail --silent --show-error "http://127.0.0.1:${WEB_PORT}/" >/tmp/afterclass-smoke-home.html; do
  if (( SECONDS >= end_time )); then
    echo "Web service did not become ready within ${SMOKE_TIMEOUT_SECONDS}s." >&2
    docker compose ps >&2 || true
    docker compose logs --tail=120 web >&2 || true
    exit 1
  fi
  sleep 2
done

if ! grep -q "智能晚辅托管系统" /tmp/afterclass-smoke-home.html; then
  echo "Web service responded but did not render the AfterClass smoke page." >&2
  exit 1
fi

rm -f /tmp/afterclass-smoke-home.html

echo "Deployment smoke verification passed."
docker compose ps
