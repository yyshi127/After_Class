import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import { canPublishFeedbackDraft, type FeedbackDraft } from '@/domain/feedback/feedback';
import type { HomeworkPublishStatus } from '@/domain/homework/homework-review';

export type PublishableHomeworkReview = {
  id: string;
  campusId: string;
  classId?: string | null;
  studentId: string;
  subject: string;
  originalImageFileId: string;
  correctedImageFileId: string | null;
  publishStatus: HomeworkPublishStatus;
  publishedAt: Date | null;
};

export type PublishedHomeworkReview = PublishableHomeworkReview & {
  correctedImageFileId: string;
  publishStatus: 'PUBLISHED';
  publishedAt: Date;
};

export type PublishedFeedbackDraft = FeedbackDraft & {
  publishStatus: 'PUBLISHED';
  publishedAt: Date;
};

export type ParentVisibleHomeworkFeedback = {
  reviewId: string;
  studentId: string;
  subject: string;
  originalImageFileId: string;
  correctedImageFileId: string;
  behaviorPerformance: string | null;
  homeworkCompletion: string;
  knowledgeMastery: string | null;
  publishedAt: string;
};

export function publishHomeworkFeedback(input: {
  review: PublishableHomeworkReview;
  feedback: FeedbackDraft;
  publishedAt: Date;
}): { review: PublishedHomeworkReview; feedback: PublishedFeedbackDraft } {
  if (!input.review.correctedImageFileId) {
    throw new Error('发布作业反馈前必须有老师确认后的批改图');
  }

  const publishable = canPublishFeedbackDraft(input.feedback);
  if (!publishable.ok) {
    throw new Error(publishable.errors[0]);
  }

  return {
    review: {
      ...input.review,
      correctedImageFileId: input.review.correctedImageFileId,
      publishStatus: 'PUBLISHED',
      publishedAt: input.publishedAt,
    },
    feedback: {
      ...input.feedback,
      publishStatus: 'PUBLISHED',
      publishedAt: input.publishedAt,
    },
  };
}

export function getGuardianVisibleHomeworkFeedback(input: {
  guardian: PermissionActor;
  review: PublishableHomeworkReview;
  feedback: FeedbackDraft;
}): ParentVisibleHomeworkFeedback | null {
  if (input.review.publishStatus !== 'PUBLISHED' || input.feedback.publishStatus !== 'PUBLISHED') {
    return null;
  }

  if (!input.review.correctedImageFileId || !input.review.publishedAt) {
    return null;
  }

  if (
    !canAccessStudent(input.guardian, {
      id: input.review.studentId,
      campusId: input.review.campusId,
      classId: input.review.classId,
    })
  ) {
    return null;
  }

  return {
    reviewId: input.review.id,
    studentId: input.review.studentId,
    subject: input.review.subject,
    originalImageFileId: input.review.originalImageFileId,
    correctedImageFileId: input.review.correctedImageFileId,
    behaviorPerformance: input.feedback.behaviorPerformance,
    homeworkCompletion: input.feedback.homeworkCompletion,
    knowledgeMastery: input.feedback.knowledgeMastery,
    publishedAt: input.review.publishedAt.toISOString(),
  };
}
