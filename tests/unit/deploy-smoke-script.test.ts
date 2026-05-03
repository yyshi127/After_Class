import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const script = readFileSync('scripts/deploy-smoke.sh', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };
const docs = readFileSync('docs/operations/docker-compose-smoke-test.md', 'utf8');
const riskChecklist = readFileSync('docs/operations/commercial-launch-risk-checklist.md', 'utf8');

describe('deployment smoke verification workflow', () => {
  it('exposes a deploy smoke script that refuses non-Docker or placeholder-secret environments', () => {
    expect(existsSync('scripts/deploy-smoke.sh')).toBe(true);
    expect(packageJson.scripts['deploy:smoke']).toBe('bash scripts/deploy-smoke.sh');
    expect(script).toContain('docker compose config');
    expect(script).toContain('docker compose build');
    expect(script).toContain('docker compose up -d postgres web');
    expect(script).toContain('curl --fail --silent --show-error');
    expect(script).toContain('智能晚辅托管系统');
    expect(script).toContain('require_non_placeholder AUTH_SECRET');
    expect(script).toContain('require_non_placeholder POSTGRES_PASSWORD');
    expect(script).toContain('$1 is required for deployment smoke verification');
    expect(script).toContain('SMOKE_CLEANUP');
  });

  it('documents real-host Docker Compose verification without claiming local Docker completion', () => {
    expect(docs).toContain('真实部署机');
    expect(docs).toContain('npm run deploy:smoke');
    expect(docs).toContain('docker compose config');
    expect(docs).toContain('docker compose build');
    expect(docs).toContain('docker compose up -d postgres web');
    expect(docs).toContain('Deployment smoke verification passed');
    expect(docs).toContain('不能勾选 Docker 启动验收');
    expect(riskChecklist).toContain('Docker/Compose 在目标服务器未实测');
  });
});
