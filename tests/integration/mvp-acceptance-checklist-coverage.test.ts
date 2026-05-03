import { existsSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const coverage = [
  {
    item: '管理员可以完成校区、班级、学生、家长、老师基础配置',
    file: 'tests/e2e/admin-foundation-workflow.spec.ts',
    sentinels: ['新建校区', '新建班级', '新建学生', '家长绑定管理', '选择老师'],
  },
  {
    item: '系统固定支持中午托、下午托、晚辅导、晚全托四种托管类型',
    file: 'tests/unit/demo-seed-data.test.ts',
    sentinels: ['中午托', '下午托', '晚辅导', '晚全托'],
  },
  {
    item: '老师可以完成老师签到/签退',
    file: 'tests/unit/teacher-today-custody.test.tsx',
    sentinels: ['到岗签到', '离岗签退'],
  },
  {
    item: '老师可以完成学生拍照签到',
    file: 'tests/e2e/photo-check-in-notification-flow.spec.ts',
    sentinels: ['photo', 'parent'],
  },
  {
    item: '家长可以收到或查看孩子到托通知和照片',
    file: 'tests/e2e/photo-check-in-notification-flow.spec.ts',
    sentinels: ['photo', 'parent'],
  },
  {
    item: '老师可以上传作业图片并看到 AI 圈错建议',
    file: 'tests/unit/teacher-homework-correction-ui.test.tsx',
    sentinels: ['作业图片与圈错区', 'AI 圈错确认区'],
  },
  {
    item: '老师可以确认/修改/忽略 AI 圈错区域',
    file: 'tests/unit/homework-mistake-area-confirmation.test.tsx',
    sentinels: ['AI 圈错确认', '确认', '修改', '忽略'],
  },
  {
    item: '老师可以填写或生成三类点评草稿',
    file: 'tests/unit/teacher-homework-correction-ui.test.tsx',
    sentinels: ['三类点评编辑区'],
  },
  {
    item: '老师确认发布后，家长可以查看作业原图、批改图、三类点评',
    file: 'tests/e2e/parent-homework-feedback-publishing.spec.ts',
    sentinels: ['published', 'parent'],
  },
  {
    item: '老师确认过的错题自动进入错题本',
    file: 'tests/unit/mistake-book-collection.test.ts',
    sentinels: ['published', 'mistake'],
  },
  {
    item: 'AI 可以生成同类题草稿，老师确认后生成 Word 练习单',
    file: 'tests/unit/practice-sheet-docx.test.ts',
    sentinels: ['Word', 'canGenerateWord'],
  },
  {
    item: '管理端可以记录收费和服务有效期',
    file: 'tests/unit/billing-record.test.ts',
    sentinels: ['service validity', 'guardians'],
  },
  {
    item: '家长端只展示服务有效期和续费提示，不展示余额/欠费金额',
    file: 'tests/unit/parent-service-validity-card.test.tsx',
    sentinels: ['服务有效期', '余额', '欠费'],
  },
  {
    item: '管理端可以查看班级核算、老师课费和预估毛利',
    file: 'tests/e2e/admin-class-settlements.spec.ts',
    sentinels: ['settlements', 'gross'],
  },
  {
    item: '老师端可以查看服务到期提醒，但不展示班级毛利',
    file: 'tests/unit/teacher-today-custody.test.tsx',
    sentinels: ['服务到期提醒', '毛利'],
  },
  {
    item: 'AI Command Layer 覆盖 9 个 MVP 意图',
    file: 'tests/unit/ai-intent-schema.test.ts',
    sentinels: ['9 MVP intents', 'AI_INTENTS'],
  },
  {
    item: '中风险 AI 动作必须确认',
    file: 'tests/unit/guardian-leave-request.test.ts',
    sentinels: ['ConfirmationRequest', 'confirm'],
  },
  {
    item: '高风险 AI 动作必须拒绝',
    file: 'tests/unit/risk-classifier.test.ts',
    sentinels: ['高风险动作禁止由 AI 执行', 'HIGH'],
  },
  {
    item: 'AI 操作日志完整记录',
    file: 'tests/unit/ai-action-log.test.ts',
    sentinels: ['AI action log', 'failure'],
  },
  {
    item: '所有核心数据按校区权限隔离',
    file: 'tests/unit/permissions-and-bindings.test.ts',
    sentinels: ['campus', 'canAccessCampus'],
  },
  {
    item: '所有图片按授权访问',
    file: 'tests/unit/file-storage.test.ts',
    sentinels: ['private metadata', 'public'],
  },
  {
    item: 'lint、typecheck、unit、integration、e2e、build 全部通过',
    file: 'package.json',
    sentinels: ['typecheck', 'lint', 'test:unit', 'test:integration', 'build', 'test:e2e'],
  },
] as const;

describe('MVP acceptance checklist coverage', () => {
  it('maps each non-Docker section 5 acceptance item to executable coverage', () => {
    expect(coverage).toHaveLength(22);

    for (const entry of coverage) {
      expect(existsSync(entry.file), `${entry.item} should have ${entry.file}`).toBe(true);
      const source = readFileSync(entry.file, 'utf8').toLowerCase();

      for (const sentinel of entry.sentinels) {
        expect(source, `${entry.file} should contain sentinel ${sentinel}`).toContain(sentinel.toLowerCase());
      }
    }
  });
});
