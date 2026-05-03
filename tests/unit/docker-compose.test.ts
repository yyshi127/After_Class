import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const compose = readFileSync('docker-compose.yml', 'utf8');

describe('docker compose production topology', () => {
  it('defines web and postgres services with durable volumes', () => {
    expect(compose).toContain('postgres:');
    expect(compose).toContain('image: postgres:17-alpine');
    expect(compose).toContain('web:');
    expect(compose).toContain('dockerfile: Dockerfile');
    expect(compose).toContain('postgres-data:/var/lib/postgresql/data');
    expect(compose).toContain('app-storage:/app/storage');
    expect(compose).toContain('postgres-data:');
    expect(compose).toContain('app-storage:');
  });

  it('keeps web behind postgres health check and exposes configurable ports', () => {
    expect(compose).toContain('condition: service_healthy');
    expect(compose).toContain('pg_isready');
    expect(compose).toContain('${WEB_PORT:-3000}:3000');
    expect(compose).toContain('${POSTGRES_PORT:-5432}:5432');
    expect(compose).toContain('DATABASE_URL: ${DATABASE_URL:-postgresql://afterclass:afterclass_dev_password@postgres:5432/afterclass?schema=public}');
    expect(compose).toContain('AUTH_SECRET: ${AUTH_SECRET:-change-me-in-production}');
  });
});
