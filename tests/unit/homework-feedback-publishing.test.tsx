import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ParentHomeworkFeedbackCard } from '@/components/parent/parent-homework-feedback-card';
import {
  getGuardianVisibleHomeworkFeedback,
  publishHomeworkFeedback,
} from '@/domain/feedback/homework-feedback-publishing';
import { createEditableFeedbackDraft } from '@/domain/feedback/feedback';

const guardian = {
  id: 'demo-guardian-li',
  role: 'GUARDIAN' as const,
  guardianStudentIds: ['demo-student-profile-wang'],
};

const draftReview = {
  id: 'homework-review-draft',
  campusId: 'demo-campus-east',
  classId: 'demo-class-east-grade3-a',
  studentId: 'demo-student-profile-wang',
  subject: '数学',
  originalImageFileId: 'file-homework-original-wang',
  correctedImageFileId: 'file-homework-corrected-wang',
  publishStatus: 'DRAFT' as const,
  publishedAt: null,
};

const feedbackDraft = createEditableFeedbackDraft({
  campusId: 'demo-campus-east',
  classId: 'demo-class-east-grade3-a',
  studentId: 'demo-student-profile-wang',
  teacherUserId: 'demo-teacher-zhao',
  homeworkReviewId: 'homework-review-draft',
  behaviorPerformance: '今天专注度较好，能主动提问。',
  homeworkCompletion: '数学作业已完成，订正 1 处。',
  knowledgeMastery: '两位数乘法仍需巩固。',
  draftSource: 'AI',
});

describe('homework feedback publishing', () => {
  it('keeps draft homework feedback invisible to guardians before publishing', () => {
    expect(
      getGuardianVisibleHomeworkFeedback({
        guardian,
        review: draftReview,
        feedback: feedbackDraft,
      }),
    ).toBeNull();
  });

  it('publishes original image, corrected image and three-part feedback to bound guardian only', () => {
    const published = publishHomeworkFeedback({
      review: draftReview,
      feedback: feedbackDraft,
      publishedAt: new Date('2026-05-02T12:00:00.000Z'),
    });

    expect(published.review).toMatchObject({
      publishStatus: 'PUBLISHED',
      publishedAt: new Date('2026-05-02T12:00:00.000Z'),
    });
    expect(published.feedback).toMatchObject({
      publishStatus: 'PUBLISHED',
      publishedAt: new Date('2026-05-02T12:00:00.000Z'),
    });

    expect(
      getGuardianVisibleHomeworkFeedback({
        guardian,
        review: published.review,
        feedback: published.feedback,
      }),
    ).toEqual({
      reviewId: 'homework-review-draft',
      studentId: 'demo-student-profile-wang',
      subject: '数学',
      originalImageFileId: 'file-homework-original-wang',
      correctedImageFileId: 'file-homework-corrected-wang',
      behaviorPerformance: '今天专注度较好，能主动提问。',
      homeworkCompletion: '数学作业已完成，订正 1 处。',
      knowledgeMastery: '两位数乘法仍需巩固。',
      publishedAt: '2026-05-02T12:00:00.000Z',
    });

    expect(
      getGuardianVisibleHomeworkFeedback({
        guardian: { id: 'other-guardian', role: 'GUARDIAN', guardianStudentIds: ['other-student'] },
        review: published.review,
        feedback: published.feedback,
      }),
    ).toBeNull();
  });

  it('requires corrected image and homework completion before publishing', () => {
    expect(() =>
      publishHomeworkFeedback({
        review: { ...draftReview, correctedImageFileId: null },
        feedback: feedbackDraft,
        publishedAt: new Date('2026-05-02T12:00:00.000Z'),
      }),
    ).toThrow('发布作业反馈前必须有老师确认后的批改图');

    expect(() =>
      publishHomeworkFeedback({
        review: draftReview,
        feedback: { ...feedbackDraft, homeworkCompletion: '   ' },
        publishedAt: new Date('2026-05-02T12:00:00.000Z'),
      }),
    ).toThrow('作业完成点评不能为空');
  });

  it('renders parent-visible homework feedback without internal AI confidence or teacher notes', () => {
    render(
      <ParentHomeworkFeedbackCard
        feedback={{
          reviewId: 'homework-review-draft',
          studentId: 'demo-student-profile-wang',
          subject: '数学',
          originalImageFileId: 'file-homework-original-wang',
          correctedImageFileId: 'file-homework-corrected-wang',
          behaviorPerformance: '今天专注度较好，能主动提问。',
          homeworkCompletion: '数学作业已完成，订正 1 处。',
          knowledgeMastery: '两位数乘法仍需巩固。',
          publishedAt: '2026-05-02T12:00:00.000Z',
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: '今日作业反馈' })).toBeInTheDocument();
    expect(screen.getByText('作业原图：file-homework-original-wang')).toBeInTheDocument();
    expect(screen.getByText('批改图：file-homework-corrected-wang')).toBeInTheDocument();
    expect(screen.getByText('行为表现')).toBeInTheDocument();
    expect(screen.getByText('作业完成')).toBeInTheDocument();
    expect(screen.getByText('知识掌握')).toBeInTheDocument();
    expect(screen.queryByText(/置信度|AI 内部|老师内部备注/)).not.toBeInTheDocument();
  });
});
