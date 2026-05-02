import { describe, expect, it } from 'vitest';

import { queryGuardianHomeworkForAi } from '@/domain/ai-command/guardian-homework-query';
import type { FeedbackDraft } from '@/domain/feedback/feedback';
import type { PublishableHomeworkReview } from '@/domain/feedback/homework-feedback-publishing';

const reviews: PublishableHomeworkReview[] = [
  {
    id: 'review-wang-published',
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-wang',
    subject: '数学',
    originalImageFileId: 'file-original-wang',
    correctedImageFileId: 'file-corrected-wang',
    publishStatus: 'PUBLISHED',
    publishedAt: new Date('2026-05-02T12:00:00.000Z'),
  },
  {
    id: 'review-wang-draft',
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-wang',
    subject: '语文',
    originalImageFileId: 'file-original-wang-draft',
    correctedImageFileId: 'file-corrected-wang-draft',
    publishStatus: 'DRAFT',
    publishedAt: null,
  },
  {
    id: 'review-li-published',
    campusId: 'campus-west',
    classId: 'class-evening-b',
    studentId: 'student-li',
    subject: '英语',
    originalImageFileId: 'file-original-li',
    correctedImageFileId: 'file-corrected-li',
    publishStatus: 'PUBLISHED',
    publishedAt: new Date('2026-05-02T12:10:00.000Z'),
  },
];

const feedbacks: FeedbackDraft[] = [
  {
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-wang',
    teacherUserId: 'teacher-chen',
    homeworkReviewId: 'review-wang-published',
    behaviorPerformance: '今天专注度较好，能主动提问。',
    homeworkCompletion: '数学作业已完成，订正 1 处。',
    knowledgeMastery: '两位数乘法仍需巩固。',
    draftSource: 'TEACHER',
    publishStatus: 'PUBLISHED',
    publishedAt: new Date('2026-05-02T12:00:00.000Z'),
  },
  {
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-wang',
    teacherUserId: 'teacher-chen',
    homeworkReviewId: 'review-wang-draft',
    behaviorPerformance: '老师内部草稿，不应给家长看。',
    homeworkCompletion: '语文作业待确认。',
    knowledgeMastery: '未发布知识点。',
    draftSource: 'AI',
    publishStatus: 'DRAFT',
    publishedAt: null,
  },
  {
    campusId: 'campus-west',
    classId: 'class-evening-b',
    studentId: 'student-li',
    teacherUserId: 'teacher-zhao',
    homeworkReviewId: 'review-li-published',
    behaviorPerformance: '其他孩子表现。',
    homeworkCompletion: '英语已完成。',
    knowledgeMastery: '其他孩子知识点。',
    draftSource: 'TEACHER',
    publishStatus: 'PUBLISHED',
    publishedAt: new Date('2026-05-02T12:10:00.000Z'),
  },
];

describe('guardian AI homework query', () => {
  it('returns only published homework feedback summaries for bound children', () => {
    const response = queryGuardianHomeworkForAi({
      actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
      entities: { studentId: 'student-wang', subject: '数学', date: '2026-05-02' },
      reviews,
      feedbacks,
    });

    expect(response).toEqual({
      intent: 'queryHomework',
      risk: 'LOW',
      confirmationRequired: false,
      records: [
        {
          reviewId: 'review-wang-published',
          studentId: 'student-wang',
          subject: '数学',
          publishStatus: 'PUBLISHED',
          publishedAt: '2026-05-02T12:00:00.000Z',
          homeworkCompletion: '数学作业已完成，订正 1 处。',
          behaviorPerformance: '今天专注度较好，能主动提问。',
          knowledgeMastery: '两位数乘法仍需巩固。',
          summary: '数学作业已发布：数学作业已完成，订正 1 处。',
        },
      ],
    });

    expect(JSON.stringify(response)).not.toMatch(/老师内部草稿|语文作业待确认|未发布知识点|其他孩子/);
  });

  it('returns no records when a guardian asks for another child homework', () => {
    const response = queryGuardianHomeworkForAi({
      actor: { id: 'guardian-wang', role: 'GUARDIAN', guardianStudentIds: ['student-wang'] },
      entities: { studentId: 'student-li', date: '2026-05-02' },
      reviews,
      feedbacks,
    });

    expect(response.records).toEqual([]);
  });
});
