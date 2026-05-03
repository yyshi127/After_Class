#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required. Copy .env.example to .env or export DATABASE_URL before running migrations." >&2
  exit 1
fi

npm run prisma:generate
npx prisma migrate deploy
