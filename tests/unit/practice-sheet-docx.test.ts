import { describe, expect, it } from 'vitest';

import { generatePracticeSheetDocx } from '@/domain/mistake-book/practice-sheet-docx';

const practiceDraft = {
  id: 'practice-draft-wang-20260502',
  studentId: 'student-wang',
  studentName: '王小明',
  classId: 'class-evening-a',
  className: '晚辅 A 班',
  subject: '数学',
  sourceMistakeBookItemIds: ['mistake-wang-1'],
  createdAt: '2026-05-02T15:00:00.000Z',
  questions: [
    {
      id: 'practice-similar-mistake-wang-1-1',
      sourceQuestionId: 'similar-mistake-wang-1-1',
      sourceMistakeBookItemId: 'mistake-wang-1',
      knowledgePoint: '两位数乘法',
      prompt: '同类题1：请用竖式计算 23 × 14，并写出进位过程。',
      teacherConfirmed: true,
    },
  ],
  canGenerateWord: true,
  blockedReason: null,
};

describe('practice sheet docx generation', () => {
  it('generates a traceable .docx file for the practice sheet draft', async () => {
    const result = await generatePracticeSheetDocx({
      campusId: 'campus-east',
      generatedByUserId: 'teacher-chen',
      generatedAt: new Date('2026-05-02T16:00:00.000Z'),
      draft: practiceDraft,
      mistakeSummaries: [
        {
          mistakeBookItemId: 'mistake-wang-1',
          knowledgePoint: '两位数乘法',
          mistakeReason: '进位步骤遗漏',
          questionText: '23 × 14 竖式计算',
        },
      ],
      remark: '请先独立完成，再对照订正。',
    });

    expect(result.file.originalName).toBe('王小明-数学-错题练习单-2026-05-02.docx');
    expect(result.file.mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(result.file.purpose).toBe('PRACTICE_DOCX');
    expect(result.file.studentId).toBe('student-wang');
    expect(result.file.storageKey).toContain('practice-docx/campus-east/');
    expect(result.trace).toEqual(
      expect.objectContaining({
        practiceSheetDraftId: 'practice-draft-wang-20260502',
        studentId: 'student-wang',
        classId: 'class-evening-a',
        subject: '数学',
        generatedByUserId: 'teacher-chen',
        generatedAt: '2026-05-02T16:00:00.000Z',
      }),
    );
    expect(result.trace.sourceMistakeBookItemIds).toEqual(['mistake-wang-1']);
    expect(result.trace.practiceQuestionIds).toEqual(['practice-similar-mistake-wang-1-1']);
    expect(result.docxBuffer.subarray(0, 2).toString()).toBe('PK');
    expect(result.docxBuffer.byteLength).toBeGreaterThan(1000);
  });

  it('refuses to generate a Word file when the draft has no selected questions', async () => {
    await expect(
      generatePracticeSheetDocx({
        campusId: 'campus-east',
        generatedByUserId: 'teacher-chen',
        generatedAt: new Date('2026-05-02T16:00:00.000Z'),
        draft: { ...practiceDraft, questions: [], canGenerateWord: false, blockedReason: '未勾选同类题，不能生成 Word 练习单' },
        mistakeSummaries: [],
      }),
    ).rejects.toThrow('未勾选同类题，不能生成 Word 练习单');
  });
});
