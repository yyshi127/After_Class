import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts: Record<string, string>;
};
const backupScript = readFileSync('scripts/backup.sh', 'utf8');
const backupDoc = readFileSync('docs/operations/backup-and-restore.md', 'utf8');
const gitignore = readFileSync('.gitignore', 'utf8');

describe('backup operations setup', () => {
  it('provides an executable backup command for database and private files', () => {
    expect(packageJson.scripts.backup).toBe('bash scripts/backup.sh');
    expect(existsSync('scripts/backup.sh')).toBe(true);
    expect(backupScript).toContain('DATABASE_URL is required');
    expect(backupScript).toContain('PG_DUMP_ARGS=(--format=custom --no-owner --no-privileges');
    expect(backupScript).toContain('tar -czf "${STORAGE_ARCHIVE_FILE}"');
    expect(backupScript).toContain('backup-manifest.txt');
  });

  it('documents restore commands and keeps generated backups out of git', () => {
    expect(backupDoc).toContain('pg_restore --clean --if-exists --no-owner --no-privileges');
    expect(backupDoc).toContain('tar -xzf storage.tar.gz');
    expect(backupDoc).toContain('不得提交真实备份、学生照片、作业图片或任何生产数据');
    expect(gitignore).toMatch(/^\/backups$/m);
    expect(gitignore).toMatch(/^\/storage$/m);
  });
});
