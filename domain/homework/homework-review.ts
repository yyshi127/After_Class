import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';

export type HomeworkReviewStatus = 'UPLOADED' | 'AI_SUGGESTED' | 'TEACHER_REVIEWED';
export type HomeworkPublishStatus = 'DRAFT' | 'PUBLISHED';

export type HomeworkReviewDraftInput = {
  campusId: string;
  classId?: string | null;
  studentId: string;
  teacherUserId: string;
  originalImageFileId: string;
  subject: string;
};

export type HomeworkReviewDraft = HomeworkReviewDraftInput & {
  classId: string | null;
  correctedImageFileId: string | null;
  status: HomeworkReviewStatus;
  aiSuggestedAreas: unknown[] | null;
  teacherConfirmedAreas: unknown[] | null;
  publishStatus: HomeworkPublishStatus;
  publishedAt: Date | null;
};

export type HomeworkReviewVisibilityRecord = {
  id: string;
  campusId: string;
  classId?: string | null;
  studentId: string;
  publishStatus: HomeworkPublishStatus;
};

export function createHomeworkReviewDraft(input: HomeworkReviewDraftInput): HomeworkReviewDraft {
  return {
    ...input,
    classId: input.classId ?? null,
    correctedImageFileId: null,
    status: 'UPLOADED',
    aiSuggestedAreas: null,
    teacherConfirmedAreas: null,
    publishStatus: 'DRAFT',
    publishedAt: null,
  };
}

export function canGuardianViewHomeworkReview(input: {
  guardian: PermissionActor;
  review: HomeworkReviewVisibilityRecord;
}): boolean {
  if (input.review.publishStatus !== 'PUBLISHED') {
    return false;
  }

  return canAccessStudent(input.guardian, {
    id: input.review.studentId,
    campusId: input.review.campusId,
    classId: input.review.classId,
  });
}
