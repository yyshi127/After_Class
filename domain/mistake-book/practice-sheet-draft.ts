import type { SimilarQuestionDraft } from '@/domain/mistake-book/similar-question-draft';

export type SimilarQuestionSelectionInput = SimilarQuestionDraft;

export type PracticeQuestionSelection = {
  questionId: string;
  selected: boolean;
  editedPrompt?: string;
};

export type PracticeSheetDraftQuestion = {
  id: string;
  sourceQuestionId: string;
  sourceMistakeBookItemId: string;
  knowledgePoint: string;
  prompt: string;
  teacherConfirmed: boolean;
};

export type PracticeSheetDraft = {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  subject: string;
  sourceMistakeBookItemIds: string[];
  questions: PracticeSheetDraftQuestion[];
  canGenerateWord: boolean;
  blockedReason: string | null;
  createdAt: string;
};

export function createPracticeSheetDraftFromSelections(input: {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  subject: string;
  sourceMistakeBookItemIds: string[];
  questions: readonly SimilarQuestionSelectionInput[];
  selections: readonly PracticeQuestionSelection[];
  createdAt: Date;
}): PracticeSheetDraft {
  const selectedQuestions = input.selections
    .filter((selection) => selection.selected)
    .map((selection) => {
      const question = input.questions.find((candidate) => candidate.id === selection.questionId);

      if (!question) {
        return null;
      }

      return {
        id: `practice-${question.id}`,
        sourceQuestionId: question.id,
        sourceMistakeBookItemId: question.sourceMistakeBookItemId,
        knowledgePoint: question.knowledgePoint,
        prompt: selection.editedPrompt?.trim() || question.prompt,
        teacherConfirmed: true,
      };
    })
    .filter((question): question is PracticeSheetDraftQuestion => question !== null);

  const canGenerateWord = selectedQuestions.length > 0;

  return {
    id: input.id,
    studentId: input.studentId,
    studentName: input.studentName,
    classId: input.classId,
    className: input.className,
    subject: input.subject,
    sourceMistakeBookItemIds: input.sourceMistakeBookItemIds,
    questions: selectedQuestions,
    canGenerateWord,
    blockedReason: canGenerateWord ? null : '未勾选同类题，不能生成 Word 练习单',
    createdAt: input.createdAt.toISOString(),
  };
}
