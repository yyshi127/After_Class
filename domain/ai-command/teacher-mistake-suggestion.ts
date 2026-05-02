import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import {
  suggestHomeworkMistakeAreas,
  type AiMistakeSuggestionProvider,
  type AiMistakeSuggestionResult,
} from '@/domain/homework/ai-mistake-suggestion';
import type { HomeworkPublishStatus, HomeworkReviewStatus } from '@/domain/homework/homework-review';

export type TeacherMistakeSuggestionStudent = {
  id: string;
  campusId: string;
  classId?: string | null;
};

export type TeacherMistakeSuggestionHomeworkReview = {
  id: string;
  campusId: string;
  classId?: string | null;
  studentId: string;
  originalImageFileId: string;
  subject: string;
  status: HomeworkReviewStatus;
  publishStatus: HomeworkPublishStatus;
  publishedAt: Date | null;
};

export type TeacherMistakeSuggestionForAiInput = {
  teacher: PermissionActor;
  student: TeacherMistakeSuggestionStudent;
  homeworkReview: TeacherMistakeSuggestionHomeworkReview;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  provider: AiMistakeSuggestionProvider;
};

export type TeacherMistakeSuggestionForAiResult = {
  intent: 'suggestMistakeAreas';
  risk: 'MEDIUM';
  confirmationRequired: true;
  mistakeBookBlockedUntilTeacherConfirmation: true;
  suggestion: AiMistakeSuggestionResult;
  teacherConfirmedAreas: [];
};

export async function createTeacherMistakeSuggestionForAi(
  input: TeacherMistakeSuggestionForAiInput,
): Promise<TeacherMistakeSuggestionForAiResult> {
  assertTeacherCanSuggestMistakes(input.teacher, input.student, input.homeworkReview);

  const suggestion = await suggestHomeworkMistakeAreas({
    reviewId: input.homeworkReview.id,
    originalImageFileId: input.homeworkReview.originalImageFileId,
    subject: input.homeworkReview.subject,
    imageNaturalWidth: input.imageNaturalWidth,
    imageNaturalHeight: input.imageNaturalHeight,
    provider: input.provider,
  });

  return {
    intent: 'suggestMistakeAreas',
    risk: 'MEDIUM',
    confirmationRequired: true,
    mistakeBookBlockedUntilTeacherConfirmation: true,
    suggestion,
    teacherConfirmedAreas: [],
  };
}

function assertTeacherCanSuggestMistakes(
  teacher: PermissionActor,
  student: TeacherMistakeSuggestionStudent,
  homeworkReview: TeacherMistakeSuggestionHomeworkReview,
) {
  const reviewMatchesStudent =
    homeworkReview.studentId === student.id &&
    homeworkReview.campusId === student.campusId &&
    (homeworkReview.classId ?? null) === (student.classId ?? null);

  if (!reviewMatchesStudent || !canAccessStudent(teacher, student)) {
    throw new Error('无权为该学生生成 AI 圈错建议');
  }
}
