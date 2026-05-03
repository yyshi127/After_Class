import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const riskChecklist = readFileSync('docs/operations/commercial-launch-risk-checklist.md', 'utf8');

describe('commercial launch risk checklist', () => {
  it('covers required commercial launch risk categories', () => {
    for (const requiredRisk of [
      '数据备份',
      '未成年人隐私泄露',
      '图片/作业资料授权',
      'AI 自动化误判',
      '收费、欠费、课消、老师费用、毛利误展示给家长',
      '收费调整、退费、欠费清零缺少人工复核',
    ]) {
      expect(riskChecklist).toContain(requiredRisk);
    }
  });

  it('states a handling status for each risk instead of leaving open-ended items', () => {
    expect(riskChecklist).toContain('已处理');
    expect(riskChecklist).toContain('人工复核');
    expect(riskChecklist).toContain('暂缓');
    expect(riskChecklist).toContain('上线前验收');
    expect(riskChecklist).toContain('Go / No-Go 结论');
  });

  it('keeps MVP safety boundaries explicit', () => {
    expect(riskChecklist).toContain('AI 仅输出草稿/建议');
    expect(riskChecklist).toContain('AI 不执行欠费清零');
    expect(riskChecklist).toContain('家长端只展示服务有效期/续费指导');
    expect(riskChecklist).toContain('未授权学生不得使用照片/作业图片 AI 功能');
    expect(riskChecklist).toContain('npm run deploy:smoke');
    expect(riskChecklist).toContain('恢复演练');
  });
});
