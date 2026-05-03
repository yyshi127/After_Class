import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const demoScript = readFileSync('docs/operations/mvp-acceptance-demo-script.md', 'utf8');

describe('MVP acceptance demo script', () => {
  it('covers the full operating loop from setup to traceability', () => {
    for (const requiredCopy of [
      '校区建档',
      '学生/家长/班级/老师配置',
      '到托安全通知',
      '作业批改与家长反馈',
      '错题本与练习单',
      '服务有效期/核算',
      'AI 与审计日志追溯',
    ]) {
      expect(demoScript).toContain(requiredCopy);
    }
  });

  it('covers admin, teacher, parent and student demo routes', () => {
    for (const route of [
      '/admin',
      '/admin/ai-logs',
      '/teacher',
      '/teacher/photo-check-in',
      '/teacher/homework-correction',
      '/parent',
      '/parent/homework-feedback',
      '/parent/profile',
      '/student',
      '/student/mistake-book',
    ]) {
      expect(demoScript).toContain(route);
    }
  });

  it('states privacy, AI confirmation and operations acceptance boundaries', () => {
    expect(demoScript).toContain('AI 只生成草稿和建议，老师保留确认权');
    expect(demoScript).toContain('确认前不会通知老师');
    expect(demoScript).toContain('不得展示余额、欠费、应收、已收、课消、教师费用、毛利');
    expect(demoScript).toContain('学生端只展示当前学生自己的任务和错题');
    expect(demoScript).toContain('docs/operations/logging-strategy.md');
    expect(demoScript).toContain('docs/operations/backup-and-restore.md');
  });
});
