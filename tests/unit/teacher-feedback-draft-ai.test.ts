import { describe, expect, it } from 'vitest';

import { createTeacherFeedbackDraftForAi } from '@/domain/ai-command/teacher-feedback-draft';

describe('teacher AI feedback draft', () => {
  const teacher = {
    id: 'teacher-chen',
    role: 'TEACHER' as const,
    teacherAssignments: [{ campusId: 'campus-east', classId: 'class-evening-a' }],
  };

  it('generates a three-part editable AI draft from short teacher notes without publishing', () => {
    const result = createTeacherFeedbackDraftForAi({
      teacher,
      student: {
        id: 'student-wang',
        name: '王小明',
        campusId: 'campus-east',
        classId: 'class-evening-a',
      },
      homeworkReviewId: 'homework-review-wang-math-001',
      shortNote: '今天专注度不错，数学已完成，应用题读题还要加强',
    });

    expect(result).toMatchObject({
      risk: 'MEDIUM',
      confirmationRequired: true,
      publishBlocked: true,
      draft: {
        campusId: 'campus-east',
        classId: 'class-evening-a',
        studentId: 'student-wang',
        teacherUserId: 'teacher-chen',
        homeworkReviewId: 'homework-review-wang-math-001',
        draftSource: 'AI',
        publishStatus: 'DRAFT',
        publishedAt: null,
        behaviorPerformance: 'AI 草稿：今天专注度不错。',
        homeworkCompletion: 'AI 草稿：数学已完成。',
        knowledgeMastery: 'AI 草稿：应用题读题还要加强。',
      },
    });
  });

  it('keeps sparse AI output editable and still does not auto publish', () => {
    const result = createTeacherFeedbackDraftForAi({
      teacher,
      student: {
        id: 'student-wang',
        name: '王小明',
        campusId: 'campus-east',
        classId: 'class-evening-a',
      },
      homeworkReviewId: null,
      shortNote: '语文阅读完成',
    });

    expect(result.draft).toMatchObject({
      homeworkReviewId: null,
      homeworkCompletion: 'AI 草稿：语文阅读完成。',
      behaviorPerformance: null,
      knowledgeMastery: null,
      publishStatus: 'DRAFT',
      publishedAt: null,
    });
    expect(result.publishBlocked).toBe(true);
  });

  it('rejects feedback drafts for students outside the teacher assignment scope', () => {
    expect(() =>
      createTeacherFeedbackDraftForAi({
        teacher,
        student: {
          id: 'student-li',
          name: '李小雨',
          campusId: 'campus-west',
          classId: 'class-evening-b',
        },
        homeworkReviewId: 'homework-review-li-001',
        shortNote: '作业已完成',
      }),
    ).toThrow('无权为该学生生成反馈草稿');
  });
});
