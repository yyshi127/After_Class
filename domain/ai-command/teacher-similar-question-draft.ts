import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import {
  generateSimilarQuestionDrafts,
  type SimilarQuestionDraftGenerationResult,
  type SimilarQuestionSourceMistake,
} from '@/domain/mistake-book/similar-question-draft';

export type TeacherSimilarQuestionStudent = {
  id: string;
  name: string;
  campusId: string;
  classId?: string | null;
};

export type TeacherSimilarQuestionMistakeItem = SimilarQuestionSourceMistake & {
  campusId: string;
  classId?: string | null;
};

export type TeacherSimilarQuestionDraftsForAiInput = {
  teacher: PermissionActor;
  student: TeacherSimilarQuestionStudent;
  mistakeItem: TeacherSimilarQuestionMistakeItem;
  generatedAt: Date;
};

export type TeacherSimilarQuestionDraftsForAiResult = {
  intent: 'generateSimilarQuestions';
  risk: 'MEDIUM';
  confirmationRequired: true;
  worksheetBlockedUntilTeacherSelection: true;
  draftGeneration: SimilarQuestionDraftGenerationResult;
};

export function createTeacherSimilarQuestionDraftsForAi(
  input: TeacherSimilarQuestionDraftsForAiInput,
): TeacherSimilarQuestionDraftsForAiResult {
  assertTeacherCanGenerateSimilarQuestions(input.teacher, input.student, input.mistakeItem);

  return {
    intent: 'generateSimilarQuestions',
    risk: 'MEDIUM',
    confirmationRequired: true,
    worksheetBlockedUntilTeacherSelection: true,
    draftGeneration: generateSimilarQuestionDrafts({
      mistakeItem: input.mistakeItem,
      generatedAt: input.generatedAt,
    }),
  };
}

function assertTeacherCanGenerateSimilarQuestions(
  teacher: PermissionActor,
  student: TeacherSimilarQuestionStudent,
  mistakeItem: TeacherSimilarQuestionMistakeItem,
) {
  const mistakeMatchesStudent =
    mistakeItem.studentId === student.id &&
    mistakeItem.campusId === student.campusId &&
    (mistakeItem.classId ?? null) === (student.classId ?? null);

  if (!mistakeMatchesStudent || !canAccessStudent(teacher, student)) {
    throw new Error('无权为该学生生成同类题草稿');
  }
}
