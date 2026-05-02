import { describe, expect, it } from 'vitest';

import {
  createPracticeSheetDraftFromSelections,
  type SimilarQuestionSelectionInput,
} from '@/domain/mistake-book/practice-sheet-draft';

const generatedQuestions: SimilarQuestionSelectionInput[] = [
  {
    id: 'similar-mistake-wang-1-1',
    sourceMistakeBookItemId: 'mistake-wang-1',
    studentId: 'student-wang',
    subject: '数学',
    knowledgePoint: '两位数乘法',
    prompt: '同类题1：23 × 14 竖式计算。',
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
    prompt: '同类题2：34 × 12 竖式计算。',
    status: 'DRAFT',
    requiresTeacherConfirmation: true,
    generatedAt: '2026-05-02T14:00:00.000Z',
  },
];

describe('practice sheet draft from teacher-selected similar questions', () => {
  it('saves only selected questions with teacher edited prompts as a draft', () => {
    const result = createPracticeSheetDraftFromSelections({
      id: 'practice-draft-wang-20260502',
      studentId: 'student-wang',
      studentName: '王小明',
      classId: 'class-evening-a',
      className: '晚辅 A 班',
      subject: '数学',
      sourceMistakeBookItemIds: ['mistake-wang-1'],
      questions: generatedQuestions,
      selections: [
        {
          questionId: 'similar-mistake-wang-1-1',
          selected: true,
          editedPrompt: '同类题1：请用竖式计算 23 × 14，并写出进位过程。',
        },
        {
          questionId: 'similar-mistake-wang-1-2',
          selected: false,
          editedPrompt: '不应进入练习单',
        },
      ],
      createdAt: new Date('2026-05-02T15:00:00.000Z'),
    });

    expect(result.canGenerateWord).toBe(true);
    expect(result.questions).toHaveLength(1);
    expect(result.questions[0]).toEqual(
      expect.objectContaining({
        sourceQuestionId: 'similar-mistake-wang-1-1',
        prompt: '同类题1：请用竖式计算 23 × 14，并写出进位过程。',
        teacherConfirmed: true,
      }),
    );
    expect(result.questions.map((question) => question.sourceQuestionId)).not.toContain('similar-mistake-wang-1-2');
  });

  it('blocks Word generation when no similar question is selected', () => {
    const result = createPracticeSheetDraftFromSelections({
      id: 'practice-draft-empty',
      studentId: 'student-wang',
      studentName: '王小明',
      classId: 'class-evening-a',
      className: '晚辅 A 班',
      subject: '数学',
      sourceMistakeBookItemIds: ['mistake-wang-1'],
      questions: generatedQuestions,
      selections: generatedQuestions.map((question) => ({ questionId: question.id, selected: false })),
      createdAt: new Date('2026-05-02T15:00:00.000Z'),
    });

    expect(result.canGenerateWord).toBe(false);
    expect(result.blockedReason).toBe('未勾选同类题，不能生成 Word 练习单');
    expect(result.questions).toHaveLength(0);
  });
});
