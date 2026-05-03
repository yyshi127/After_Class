import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const envExample = readFileSync('.env.example', 'utf8');

describe('environment example', () => {
  it('documents required runtime variables for app, database, AI and storage', () => {
    for (const key of [
      'DATABASE_URL',
      'NEXTAUTH_URL',
      'AUTH_SECRET',
      'NEXTAUTH_SECRET',
      'AI_PROVIDER',
      'AI_API_KEY',
      'STORAGE_PATH',
      'STORAGE_PROVIDER',
      'WEB_PORT',
      'POSTGRES_DB',
      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'POSTGRES_PORT',
      'LOG_LEVEL',
      'AUDIT_LOG_ENABLED',
      'AI_AUDIT_LOG_ENABLED',
    ]) {
      expect(envExample).toMatch(new RegExp(`^${key}=`, 'm'));
    }
  });

  it('uses placeholders instead of committed production secrets', () => {
    expect(envExample).toContain('replace-with-db-password');
    expect(envExample).toContain('replace-with-32-byte-random-secret');
    expect(envExample).toContain('replace-with-provider-api-key-or-leave-unset');
    expect(envExample).not.toMatch(/sk-[A-Za-z0-9_-]{20,}/);
    expect(envExample).not.toMatch(/AKIA[0-9A-Z]{16}/);
    expect(envExample).not.toContain('afterclass_dev_password');
    expect(envExample).not.toContain('change-me-in-production');
  });
});
