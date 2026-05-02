import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { createFeedbackDraft, validateFeedbackForPublish } from '@/domain/feedback/feedback';

describe('feedback model and validation', () => {
  it('defines Feedback model with behavior, homework completion, knowledge mastery and publish status', () => {
    const schema = readFileSync('prisma/schema.prisma', 'utf8');

    expect(schema).toContain('enum FeedbackPublishStatus');
    expect(schema).toContain('model Feedback');
    expect(schema).toMatch(/behaviorPerformance\s+String\?/);
    expect(schema).toMatch(/homeworkCompletion\s+String/);
    expect(schema).toMatch(/knowledgeMastery\s+String\?/);
    expect(schema).toMatch(/publishStatus\s+FeedbackPublishStatus/);
  });

  it('creates an unpublished three-part feedback draft', () => {
    const draft = createFeedbackDraft({
      campusId: 'demo-campus-east',
      classId: 'demo-class-east-grade3-a',
      studentId: 'demo-student-profile-wang',
      teacherUserId: 'demo-teacher-zhao',
      homeworkReviewId: 'homework-review-wang-1',
      behaviorPerformance: '专注度较好，能主动提问。',
      homeworkCompletion: '数学作业已完成，订正 2 处。',
      knowledgeMastery: '两位数乘法仍需巩固。',
    });

    expect(draft).toMatchObject({
      behaviorPerformance: '专注度较好，能主动提问。',
      homeworkCompletion: '数学作业已完成，订正 2 处。',
      knowledgeMastery: '两位数乘法仍需巩固。',
      publishStatus: 'DRAFT',
      publishedAt: null,
    });
  });

  it('requires homework completion before publishing', () => {
    expect(() =>
      validateFeedbackForPublish({
        behaviorPerformance: '今日表现稳定',
        homeworkCompletion: '   ',
        knowledgeMastery: '计算正确率提升',
      }),
    ).toThrow('作业完成点评不能为空');

    expect(
      validateFeedbackForPublish({
        behaviorPerformance: '',
        homeworkCompletion: '语文阅读已完成',
        knowledgeMastery: '',
      }),
    ).toEqual({ ok: true });
  });
});
