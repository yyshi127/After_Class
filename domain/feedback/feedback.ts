export type FeedbackPublishStatus = 'DRAFT' | 'PUBLISHED';

export type FeedbackDraftInput = {
  campusId: string;
  classId?: string | null;
  studentId: string;
  teacherUserId: string;
  homeworkReviewId?: string | null;
  behaviorPerformance?: string | null;
  homeworkCompletion: string;
  knowledgeMastery?: string | null;
};

export type FeedbackDraft = FeedbackDraftInput & {
  classId: string | null;
  homeworkReviewId: string | null;
  behaviorPerformance: string | null;
  knowledgeMastery: string | null;
  publishStatus: FeedbackPublishStatus;
  publishedAt: Date | null;
};

export function validateFeedbackForPublish(input: {
  behaviorPerformance?: string | null;
  homeworkCompletion: string;
  knowledgeMastery?: string | null;
}): { ok: true } {
  if (input.homeworkCompletion.trim().length === 0) {
    throw new Error('作业完成点评不能为空');
  }

  return { ok: true };
}

export function createFeedbackDraft(input: FeedbackDraftInput): FeedbackDraft {
  validateFeedbackForPublish(input);

  return {
    ...input,
    classId: input.classId ?? null,
    homeworkReviewId: input.homeworkReviewId ?? null,
    behaviorPerformance: input.behaviorPerformance ?? null,
    knowledgeMastery: input.knowledgeMastery ?? null,
    publishStatus: 'DRAFT',
    publishedAt: null,
  };
}
