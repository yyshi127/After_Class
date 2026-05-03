import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const coverage = [
  {
    item: '管理员创建校区、班级、学生、绑定家长',
    file: 'tests/e2e/admin-foundation-workflow.spec.ts',
    sentinels: ['校区', '班级', '学生', '家长'],
  },
  {
    item: '老师签到后创建学生考勤记录',
    file: 'tests/unit/attendance-record.test.ts',
    sentinels: ['teacher', 'attendance', 'student'],
  },
  {
    item: '拍照签到生成通知，家长可见',
    file: 'tests/e2e/photo-check-in-notification-flow.spec.ts',
    sentinels: ['photo', 'parent'],
  },
  {
    item: '匹配失败不通知，确认后补发',
    file: 'tests/unit/photo-match-confirmation.test.ts',
    sentinels: ['confirmation', 'notice'],
  },
  {
    item: '作业上传后生成批改草稿',
    file: 'tests/e2e/homework-feedback-publish-flow.spec.ts',
    sentinels: ['homework', 'AI'],
  },
  {
    item: '老师确认 AI 圈错后发布反馈',
    file: 'tests/e2e/homework-feedback-publish-flow.spec.ts',
    sentinels: ['确认', '发布'],
  },
  {
    item: '发布反馈后家长可见，未发布不可见',
    file: 'tests/e2e/parent-homework-feedback-publishing.spec.ts',
    sentinels: ['published', 'parent'],
  },
  {
    item: '发布后错题自动收录',
    file: 'tests/unit/mistake-book-collection.test.ts',
    sentinels: ['published', 'mistake'],
  },
  {
    item: 'AI 生成同类题后老师确认生成 Word',
    file: 'tests/e2e/mistake-to-practice-sheet-flow.spec.ts',
    sentinels: ['Word', 'AI'],
  },
  {
    item: '收费记录影响家长服务有效期',
    file: 'tests/unit/billing-record.test.ts',
    sentinels: ['service validity', 'guardians'],
  },
  {
    item: '班级核算按校区权限隔离',
    file: 'tests/e2e/admin-class-settlements.spec.ts',
    sentinels: ['campus', 'settlements'],
  },
  {
    item: 'AI 操作日志完整记录',
    file: 'tests/unit/ai-action-log.test.ts',
    sentinels: ['AI action log', 'failure'],
  },
] as const;

describe('MVP integration checklist coverage', () => {
  it('maps each section 4.2 integration checklist item to an executable test file', () => {
    expect(coverage).toHaveLength(12);

    for (const entry of coverage) {
      expect(existsSync(entry.file), `${entry.item} should have ${entry.file}`).toBe(true);
      const source = readFileSync(entry.file, 'utf8').toLowerCase();

      for (const sentinel of entry.sentinels) {
        expect(source, `${entry.file} should contain sentinel ${sentinel}`).toContain(sentinel.toLowerCase());
      }
    }
  });
});
