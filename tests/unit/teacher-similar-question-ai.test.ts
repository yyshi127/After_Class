import { describe, expect, it } from 'vitest';

import { createTeacherSimilarQuestionDraftsForAi } from '@/domain/ai-command/teacher-similar-question-draft';
import { createPracticeSheetDraftFromSelections } from '@/domain/mistake-book/practice-sheet-draft';

describe('teacher AI similar question command', () => {
  const teacher = {
    id: 'teacher-chen',
    role: 'TEACHER' as const,
    teacherAssignments: [{ campusId: 'campus-east', classId: 'class-evening-a' }],
  };

  const student = {
    id: 'student-wang',
    name: '王小明',
    campusId: 'campus-east',
    classId: 'class-evening-a',
  };

  const mistakeItem = {
    id: 'mistake-wang-math-001',
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-wang',
    subject: '数学',
    knowledgePoint: '两位数加减法',
    mistakeReason: '进位计算不稳定',
    questionText: '36 + 27 = ?',
  };

  it('generates three editable similar-question drafts and blocks worksheet insertion before teacher selection', () => {
    const result = createTeacherSimilarQuestionDraftsForAi({
      teacher,
      student,
      mistakeItem,
      generatedAt: new Date('2026-05-03T01:00:00.000Z'),
    });

    expect(result).toMatchObject({
      intent: 'generateSimilarQuestions',
      risk: 'MEDIUM',
      confirmationRequired: true,
      worksheetBlockedUntilTeacherSelection: true,
      draftGeneration: {
        requiresTeacherConfirmation: true,
        canAddToWorksheet: false,
        teacherNotice: 'AI 同类题仅为草稿，需老师确认后才能加入练习单',
      },
    });
    expect(result.draftGeneration.questions).toHaveLength(3);
    expect(result.draftGeneration.questions[0]).toMatchObject({
      sourceMistakeBookItemId: 'mistake-wang-math-001',
      studentId: 'student-wang',
      subject: '数学',
      knowledgePoint: '两位数加减法',
      status: 'DRAFT',
      requiresTeacherConfirmation: true,
      generatedAt: '2026-05-03T01:00:00.000Z',
    });
  });

  it('allows selected AI drafts to enter a practice sheet only after teacher selection', () => {
    const result = createTeacherSimilarQuestionDraftsForAi({
      teacher,
      student,
      mistakeItem,
      generatedAt: new Date('2026-05-03T01:00:00.000Z'),
    });

    const emptySelectionSheet = createPracticeSheetDraftFromSelections({
      id: 'sheet-empty',
      studentId: student.id,
      studentName: student.name,
      classId: student.classId,
      className: '晚辅 A 班',
      subject: mistakeItem.subject,
      sourceMistakeBookItemIds: [mistakeItem.id],
      questions: result.draftGeneration.questions,
      selections: result.draftGeneration.questions.map((question) => ({
        questionId: question.id,
        selected: false,
      })),
      createdAt: new Date('2026-05-03T01:05:00.000Z'),
    });

    expect(emptySelectionSheet.canGenerateWord).toBe(false);
    expect(emptySelectionSheet.questions).toEqual([]);

    const selectedSheet = createPracticeSheetDraftFromSelections({
      id: 'sheet-selected',
      studentId: student.id,
      studentName: student.name,
      classId: student.classId,
      className: '晚辅 A 班',
      subject: mistakeItem.subject,
      sourceMistakeBookItemIds: [mistakeItem.id],
      questions: result.draftGeneration.questions,
      selections: [
        {
          questionId: result.draftGeneration.questions[0].id,
          selected: true,
          editedPrompt: '老师确认后题干：48 + 36 = ?',
        },
      ],
      createdAt: new Date('2026-05-03T01:10:00.000Z'),
    });

    expect(selectedSheet.canGenerateWord).toBe(true);
    expect(selectedSheet.questions).toEqual([
      expect.objectContaining({
        sourceQuestionId: result.draftGeneration.questions[0].id,
        sourceMistakeBookItemId: mistakeItem.id,
        prompt: '老师确认后题干：48 + 36 = ?',
        teacherConfirmed: true,
      }),
    ]);
  });

  it('rejects similar-question generation for students outside the teacher assignment scope', () => {
    expect(() =>
      createTeacherSimilarQuestionDraftsForAi({
        teacher,
        student: {
          id: 'student-li',
          name: '李小雨',
          campusId: 'campus-west',
          classId: 'class-evening-b',
        },
        mistakeItem: {
          ...mistakeItem,
          campusId: 'campus-west',
          classId: 'class-evening-b',
          studentId: 'student-li',
        },
        generatedAt: new Date('2026-05-03T01:00:00.000Z'),
      }),
    ).toThrow('无权为该学生生成同类题草稿');
  });
});
