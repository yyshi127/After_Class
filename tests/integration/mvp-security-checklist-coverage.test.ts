import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const coverage = [
  {
    item: '家长不能通过 URL 猜测访问其他学生',
    file: 'tests/unit/parent-homework-feedback-detail.test.tsx',
    sentinels: ['other', 'not.toBeInTheDocument'],
  },
  {
    item: '老师不能访问未授权校区图片',
    file: 'tests/unit/photo-check-in-upload.test.ts',
    sentinels: ['outside their assignment', 'rejects'],
  },
  {
    item: '校区管理员不能跨校区查询核算',
    file: 'tests/unit/admin-class-settlement-ai-query.test.ts',
    sentinels: ['campus-admin', 'campus-west'],
  },
  {
    item: '学生不能访问其他学生错题',
    file: 'tests/unit/student-mistake-book.test.tsx',
    sentinels: ['other student', 'not.toBeInTheDocument'],
  },
  {
    item: '图片 API 必须校验授权',
    file: 'tests/unit/file-storage.test.ts',
    sentinels: ['private metadata', 'public'],
  },
  {
    item: '身份证完整查看必须有审计日志',
    file: 'tests/unit/audit-log.test.ts',
    sentinels: ['identity', 'audit'],
  },
  {
    item: 'AI 不能执行删除学生',
    file: 'tests/unit/risk-classifier.test.ts',
    sentinels: ['删除学生', 'HIGH'],
  },
  {
    item: 'AI 不能修改收费金额、余额、课费',
    file: 'tests/unit/admin-ai-high-risk-refusal.test.tsx',
    sentinels: ['收费', '余额', '课费'],
  },
  {
    item: 'AI 不能批量发送高风险通知',
    file: 'tests/unit/risk-classifier.test.ts',
    sentinels: ['批量通知', 'HIGH'],
  },
  {
    item: '家长端 API 响应不包含经营字段',
    file: 'tests/unit/guardian-service-validity-query.test.ts',
    sentinels: ['amountDue', 'balanceAmount', '欠费'],
  },
] as const;

describe('MVP security checklist coverage', () => {
  it('maps each section 4.5 security checklist item to executable privacy or AI-safety coverage', () => {
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
