import { TeacherPracticeSheetDraftPage } from '@/components/teacher/teacher-practice-sheet-draft-page';
import { createPracticeSheetDraftFromSelections } from '@/domain/mistake-book/practice-sheet-draft';
import type { SimilarQuestionDraft } from '@/domain/mistake-book/similar-question-draft';

const generatedQuestions: SimilarQuestionDraft[] = [
  {
    id: 'similar-mistake-wang-1-1',
    sourceMistakeBookItemId: 'mistake-wang-1',
    studentId: 'student-wang',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    prompt: '同类题1：围绕“23 × 14 竖式计算”练习两位数乘法，重点避免进位步骤遗漏。',
    status: 'DRAFT',
    requiresTeacherConfirmation: true,
    generatedAt: '2026-05-02T14:00:00.000Z',
  },
  {
    id: 'similar-mistake-wang-1-2',
    sourceMistakeBookItemId: 'mistake-wang-1',
    studentId: 'student-wang',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    prompt: '同类题2：围绕“34 × 12 竖式计算”练习两位数乘法，重点避免进位步骤遗漏。',
    status: 'DRAFT',
    requiresTeacherConfirmation: true,
    generatedAt: '2026-05-02T14:00:00.000Z',
  },
  {
    id: 'similar-mistake-wang-1-3',
    sourceMistakeBookItemId: 'mistake-wang-1',
    studentId: 'student-wang',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    prompt: '同类题3：围绕“46 × 13 竖式计算”练习两位数乘法，重点避免进位步骤遗漏。',
    status: 'DRAFT',
    requiresTeacherConfirmation: true,
    generatedAt: '2026-05-02T14:00:00.000Z',
  },
];

const commonInput = {
  studentId: 'student-wang',
  studentName: '王小明',
  classId: 'class-evening-a',
  className: '晚辅 A 班',
  subject: '数学',
  sourceMistakeBookItemIds: ['mistake-wang-1'],
  questions: generatedQuestions,
  createdAt: new Date('2026-05-02T15:00:00.000Z'),
};

const draft = createPracticeSheetDraftFromSelections({
  ...commonInput,
  id: 'practice-draft-wang-20260502',
  selections: [
    {
      questionId: 'similar-mistake-wang-1-1',
      selected: true,
      editedPrompt: '同类题1：请用竖式计算 23 × 14，并写出进位过程。',
    },
    {
      questionId: 'similar-mistake-wang-1-2',
      selected: false,
    },
  ],
});

const emptyDraft = createPracticeSheetDraftFromSelections({
  ...commonInput,
  id: 'practice-draft-empty',
  selections: generatedQuestions.map((question) => ({ questionId: question.id, selected: false })),
});

export default function TeacherPracticeSheetPage() {
  return <TeacherPracticeSheetDraftPage draft={draft} emptyDraft={emptyDraft} />;
}
