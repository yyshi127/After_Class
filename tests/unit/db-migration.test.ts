import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts: Record<string, string>;
};
const migrationSql = readFileSync('prisma/migrations/20260503090000_init/migration.sql', 'utf8');
const migrateScript = readFileSync('scripts/db-migrate.sh', 'utf8');

describe('database migration setup', () => {
  it('provides deploy-safe migration scripts for production and local operations', () => {
    expect(packageJson.scripts['prisma:migrate:deploy']).toBe('prisma migrate deploy');
    expect(packageJson.scripts['prisma:migrate:status']).toBe('prisma migrate status');
    expect(packageJson.scripts['db:migrate']).toBe('bash scripts/db-migrate.sh');
    expect(migrateScript).toContain('DATABASE_URL is required');
    expect(migrateScript).toContain('npm run prisma:generate');
    expect(migrateScript).toContain('npx prisma migrate deploy');
  });

  it('contains an initial SQL migration for an empty PostgreSQL database', () => {
    expect(existsSync('prisma/migrations/20260503090000_init/migration.sql')).toBe(true);
    expect(migrationSql).toContain('CREATE TYPE "Role"');
    expect(migrationSql).toContain('CREATE TABLE "User"');
    expect(migrationSql).toContain('CREATE TABLE "Campus"');
    expect(migrationSql).toContain('CREATE TABLE "AttendanceRecord"');
    expect(migrationSql).toContain('CREATE TABLE "AiActionLog"');
  });
});
