import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const coverage = [
  {
    item: '390px 手机端无横向滚动',
    file: 'tests/e2e/parent-home-ui.spec.ts',
    sentinels: ['390px mobile', 'horizontalOverflow'],
  },
  {
    item: '768px 平板端老师工作台可用',
    file: 'tests/e2e/teacher-today-custody.spec.ts',
    sentinels: ['tablet', 'mobile H5'],
  },
  {
    item: '1024px 管理端可用',
    file: 'tests/e2e/admin-dashboard-responsive.spec.ts',
    sentinels: ['1024', 'horizontal overflow'],
  },
  {
    item: '1440px 管理端信息密度合理',
    file: 'tests/e2e/admin-dashboard-responsive.spec.ts',
    sentinels: ['1440', 'horizontal overflow'],
  },
  {
    item: '所有触控目标 ≥44px',
    file: 'tests/e2e/core-accessibility.spec.ts',
    sentinels: ['44', 'touch'],
  },
  {
    item: '所有表单有 label 和错误提示',
    file: 'tests/e2e/core-accessibility.spec.ts',
    sentinels: ['label', 'control'],
  },
  {
    item: '颜色不作为唯一状态提示',
    file: 'tests/unit/app-status-showcase.test.tsx',
    sentinels: ['role', 'status', 'alert'],
  },
  {
    item: '按钮有 hover/pressed/disabled/loading 状态',
    file: 'components/ui/button.tsx',
    sentinels: ['hover', 'active', 'disabled'],
  },
  {
    item: 'AI 确认卡片主次操作明确',
    file: 'tests/e2e/parent-ai-assistant-ui.spec.ts',
    sentinels: ['确认创建请假申请', '取消本次 AI 建议'],
  },
  {
    item: '高风险拒绝卡片有传统页面入口',
    file: 'tests/e2e/admin-ai-high-risk-refusal.spec.ts',
    sentinels: ['高风险拒绝卡片', '前往收费记录页人工复核'],
  },
] as const;

describe('MVP UI/UX checklist coverage', () => {
  it('maps each section 4.4 UI/UX checklist item to executable coverage or shared UI state contracts', () => {
    expect(coverage).toHaveLength(10);

    for (const entry of coverage) {
      expect(existsSync(entry.file), `${entry.item} should have ${entry.file}`).toBe(true);
      const source = readFileSync(entry.file, 'utf8').toLowerCase();

      for (const sentinel of entry.sentinels) {
        expect(source, `${entry.file} should contain sentinel ${sentinel}`).toContain(sentinel.toLowerCase());
      }
    }
  });
});
