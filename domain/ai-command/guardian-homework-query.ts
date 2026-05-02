import type { FeedbackDraft } from '@/domain/feedback/feedback';
import {
  getGuardianVisibleHomeworkFeedback,
  type PublishableHomeworkReview,
} from '@/domain/feedback/homework-feedback-publishing';
import type { PermissionActor } from '@/domain/auth/permissions';

export type GuardianHomeworkQueryEntities = {
  studentId?: string;
  subject?: string;
  date?: string;
};

export type GuardianAiHomeworkRecord = {
  reviewId: string;
  studentId: string;
  subject: string;
  publishStatus: 'PUBLISHED';
  publishedAt: string;
  homeworkCompletion: string;
  behaviorPerformance: string | null;
  knowledgeMastery: string | null;
  summary: string;
};

export type GuardianAiHomeworkResponse = {
  intent: 'queryHomework';
  risk: 'LOW';
  confirmationRequired: false;
  records: GuardianAiHomeworkRecord[];
};

type QueryGuardianHomeworkForAiInput = {
  actor: PermissionActor;
  entities: GuardianHomeworkQueryEntities;
  reviews: readonly PublishableHomeworkReview[];
  feedbacks: readonly FeedbackDraft[];
};

function toDateKey(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function queryGuardianHomeworkForAi(input: QueryGuardianHomeworkForAiInput): GuardianAiHomeworkResponse {
  const feedbackByReviewId = new Map(
    input.feedbacks
      .filter((feedback) => feedback.homeworkReviewId)
      .map((feedback) => [feedback.homeworkReviewId as string, feedback]),
  );

  const records = input.reviews.flatMap((review) => {
    const feedback = feedbackByReviewId.get(review.id);

    if (!feedback) {
      return [];
    }

    if (input.entities.studentId && input.entities.studentId !== review.studentId) {
      return [];
    }

    if (input.entities.subject && input.entities.subject !== review.subject) {
      return [];
    }

    const visible = getGuardianVisibleHomeworkFeedback({
      guardian: input.actor,
      review,
      feedback,
    });

    if (!visible) {
      return [];
    }

    if (input.entities.date && toDateKey(visible.publishedAt) !== input.entities.date) {
      return [];
    }

    return [
      {
        reviewId: visible.reviewId,
        studentId: visible.studentId,
        subject: visible.subject,
        publishStatus: 'PUBLISHED' as const,
        publishedAt: visible.publishedAt,
        homeworkCompletion: visible.homeworkCompletion,
        behaviorPerformance: visible.behaviorPerformance,
        knowledgeMastery: visible.knowledgeMastery,
        summary: `${visible.subject}作业已发布：${visible.homeworkCompletion}`,
      },
    ];
  });

  return {
    intent: 'queryHomework',
    risk: 'LOW',
    confirmationRequired: false,
    records,
  };
}
