import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const requiredRoutes = [
  'app/admin/page.tsx',
  'app/teacher/page.tsx',
  'app/parent/page.tsx',
  'app/student/page.tsx',
  'app/status/page.tsx',
] as const;

const requiredOperationalDocs = [
  'docs/operations/backup-and-restore.md',
  'docs/operations/logging-strategy.md',
] as const;

describe('MVP final regression integration smoke', () => {
  it('keeps the four role entry routes and global status route available', () => {
    for (const routeFile of requiredRoutes) {
      expect(existsSync(routeFile), `${routeFile} should exist`).toBe(true);
    }
  });

  it('keeps deployment operations docs and scripts available', () => {
    for (const docPath of requiredOperationalDocs) {
      expect(readFileSync(docPath, 'utf8').length, `${docPath} should not be empty`).toBeGreaterThan(200);
    }

    expect(existsSync('Dockerfile')).toBe(true);
    expect(existsSync('docker-compose.yml')).toBe(true);
    expect(existsSync('scripts/db-migrate.sh')).toBe(true);
    expect(existsSync('scripts/backup.sh')).toBe(true);
    expect(existsSync('prisma/migrations/20260503090000_init/migration.sql')).toBe(true);
  });
});
