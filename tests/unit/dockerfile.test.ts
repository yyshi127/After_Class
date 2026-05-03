import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

describe('production Docker image configuration', () => {
  it('uses a multi-stage Next.js standalone production image', () => {
    const dockerfile = read('Dockerfile');

    expect(dockerfile).toContain('FROM node:24-alpine AS base');
    expect(dockerfile).toContain('FROM base AS deps');
    expect(dockerfile).toContain('FROM base AS builder');
    expect(dockerfile).toContain('FROM node:24-alpine AS runner');
    expect(dockerfile).toContain('RUN npm ci');
    expect(dockerfile).toContain('RUN npm run prisma:generate && npm run build');
    expect(dockerfile).toContain('/app/.next/standalone');
    expect(dockerfile).toContain('USER nextjs');
    expect(dockerfile).toContain('EXPOSE 3000');
    expect(dockerfile).toContain('CMD ["node", "server.js"]');
  });

  it('enables Next.js standalone output and excludes local-only files from Docker context', () => {
    const nextConfig = read('next.config.ts');
    const dockerignore = read('.dockerignore');

    expect(nextConfig).toContain("output: 'standalone'");
    expect(dockerignore).toContain('node_modules');
    expect(dockerignore).toContain('.next');
    expect(dockerignore).toContain('test-results');
    expect(dockerignore).toContain('playwright-report');
    expect(dockerignore).toContain('.env');
    expect(dockerignore).toContain('!.env.example');
  });
});
