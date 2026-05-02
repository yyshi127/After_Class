export type SimilarQuestionSourceMistake = {
  id: string;
  studentId: string;
  subject: string;
  knowledgePoint: string;
  mistakeReason: string;
  questionText: string | null;
};

export type SimilarQuestionDraftStatus = 'DRAFT' | 'TEACHER_CONFIRMED';

export type SimilarQuestionDraft = {
  id: string;
  sourceMistakeBookItemId: string;
  studentId: string;
  subject: string;
  knowledgePoint: string;
  prompt: string;
  status: SimilarQuestionDraftStatus;
  requiresTeacherConfirmation: boolean;
  generatedAt: string;
};

export type SimilarQuestionDraftGenerationResult = {
  questions: SimilarQuestionDraft[];
  requiresTeacherConfirmation: boolean;
  canAddToWorksheet: boolean;
  teacherNotice: string;
};

const DRAFT_COUNT = 3;
const TEACHER_NOTICE = 'AI 同类题仅为草稿，需老师确认后才能加入练习单';

export function generateSimilarQuestionDrafts({
  mistakeItem,
  generatedAt,
}: {
  mistakeItem: SimilarQuestionSourceMistake;
  generatedAt: Date;
}): SimilarQuestionDraftGenerationResult {
  const generatedAtIso = generatedAt.toISOString();
  const sourceText = mistakeItem.questionText ?? `${mistakeItem.knowledgePoint}错题`;

  const questions = Array.from({ length: DRAFT_COUNT }, (_, index) => ({
    id: `similar-${mistakeItem.id}-${index + 1}`,
    sourceMistakeBookItemId: mistakeItem.id,
    studentId: mistakeItem.studentId,
    subject: mistakeItem.subject,
    knowledgePoint: mistakeItem.knowledgePoint,
    prompt: `同类题${index + 1}：围绕“${sourceText}”练习${mistakeItem.knowledgePoint}，重点避免${mistakeItem.mistakeReason}。`,
    status: 'DRAFT' as const,
    requiresTeacherConfirmation: true,
    generatedAt: generatedAtIso,
  }));

  return {
    questions,
    requiresTeacherConfirmation: true,
    canAddToWorksheet: false,
    teacherNotice: TEACHER_NOTICE,
  };
}
