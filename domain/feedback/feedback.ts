export type FeedbackPublishStatus = 'DRAFT' | 'PUBLISHED';

export type FeedbackDraftSource = 'TEACHER' | 'AI';

export type FeedbackDraftInput = {
  campusId: string;
  classId?: string | null;
  studentId: string;
  teacherUserId: string;
  homeworkReviewId?: string | null;
  behaviorPerformance?: string | null;
  homeworkCompletion: string;
  knowledgeMastery?: string | null;
  draftSource?: FeedbackDraftSource;
};

export type FeedbackDraft = FeedbackDraftInput & {
  classId: string | null;
  homeworkReviewId: string | null;
  behaviorPerformance: string | null;
  knowledgeMastery: string | null;
  draftSource: FeedbackDraftSource;
  publishStatus: FeedbackPublishStatus;
  publishedAt: Date | null;
};

export function canPublishFeedbackDraft(input: {
  homeworkCompletion: string;
}): { ok: true; errors: [] } | { ok: false; errors: string[] } {
  if (input.homeworkCompletion.trim().length === 0) {
    return { ok: false, errors: ['作业完成点评不能为空'] };
  }

  return { ok: true, errors: [] };
}

export function validateFeedbackForPublish(input: {
  behaviorPerformance?: string | null;
  homeworkCompletion: string;
  knowledgeMastery?: string | null;
}): { ok: true } {
  const result = canPublishFeedbackDraft(input);

  if (!result.ok) {
    throw new Error(result.errors[0]);
  }

  return { ok: true };
}

export function createEditableFeedbackDraft(input: FeedbackDraftInput): FeedbackDraft {
  return {
    ...input,
    classId: input.classId ?? null,
    homeworkReviewId: input.homeworkReviewId ?? null,
    behaviorPerformance: input.behaviorPerformance ?? null,
    knowledgeMastery: input.knowledgeMastery ?? null,
    draftSource: input.draftSource ?? 'TEACHER',
    publishStatus: 'DRAFT',
    publishedAt: null,
  };
}

export function createFeedbackDraft(input: FeedbackDraftInput): FeedbackDraft {
  validateFeedbackForPublish(input);

  return createEditableFeedbackDraft(input);
}
