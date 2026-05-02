import { describe, expect, it } from 'vitest';

import { generateSimilarQuestionDrafts } from '@/domain/mistake-book/similar-question-draft';

const mistakeItem = {
  id: 'mistake-wang-1',
  studentId: 'student-wang',
  subject: '数学',
  knowledgePoint: '两位数乘法',
  mistakeReason: '进位步骤遗漏',
  questionText: '23 × 14 竖式计算',
};

describe('similar question draft generation', () => {
  it('generates exactly 3 similar question drafts from a mistake item', () => {
    const result = generateSimilarQuestionDrafts({
      mistakeItem,
      generatedAt: new Date('2026-05-02T14:00:00.000Z'),
    });

    expect(result.questions).toHaveLength(3);
    expect(result.questions[0]).toEqual(
      expect.objectContaining({
        id: 'similar-mistake-wang-1-1',
        sourceMistakeBookItemId: 'mistake-wang-1',
        subject: '数学',
        knowledgePoint: '两位数乘法',
        status: 'DRAFT',
        requiresTeacherConfirmation: true,
      }),
    );
  });

  it('keeps generated questions as teacher-confirmed drafts and not publishable before confirmation', () => {
    const result = generateSimilarQuestionDrafts({
      mistakeItem,
      generatedAt: new Date('2026-05-02T14:00:00.000Z'),
    });

    expect(result.requiresTeacherConfirmation).toBe(true);
    expect(result.canAddToWorksheet).toBe(false);
    expect(result.teacherNotice).toBe('AI 同类题仅为草稿，需老师确认后才能加入练习单');
    expect(result.questions.every((question) => question.status === 'DRAFT')).toBe(true);
  });
});
