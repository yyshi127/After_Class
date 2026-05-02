import { describe, expect, it } from 'vitest';

import { createTeacherMistakeSuggestionForAi } from '@/domain/ai-command/teacher-mistake-suggestion';
import { createMockMistakeSuggestionProvider } from '@/domain/homework/ai-mistake-suggestion';
import { collectMistakeBookItemsAfterFeedbackPublish } from '@/domain/mistake-book/mistake-book-item';

describe('teacher AI mistake suggestion command', () => {
  const teacher = {
    id: 'teacher-chen',
    role: 'TEACHER' as const,
    teacherAssignments: [{ campusId: 'campus-east', classId: 'class-evening-a' }],
  };

  const homeworkReview = {
    id: 'homework-review-wang-math-001',
    campusId: 'campus-east',
    classId: 'class-evening-a',
    studentId: 'student-wang',
    originalImageFileId: 'file-homework-original-001',
    subject: '数学',
    status: 'UPLOADED' as const,
    publishStatus: 'DRAFT' as const,
    publishedAt: null,
  };

  it('analyzes homework image and returns suggested areas with confidence as teacher-confirmed draft only', async () => {
    const result = await createTeacherMistakeSuggestionForAi({
      teacher,
      student: {
        id: 'student-wang',
        campusId: 'campus-east',
        classId: 'class-evening-a',
      },
      homeworkReview,
      imageNaturalWidth: 1200,
      imageNaturalHeight: 1600,
      provider: createMockMistakeSuggestionProvider({
        areas: [
          {
            id: 'ai-area-1',
            originalBox: { x: 120, y: 240, width: 300, height: 180 },
            subject: '数学',
            mistakeReason: '应用题数量关系理解错误',
            confidence: 0.82,
          },
        ],
      }),
    });

    expect(result).toMatchObject({
      intent: 'suggestMistakeAreas',
      risk: 'MEDIUM',
      confirmationRequired: true,
      mistakeBookBlockedUntilTeacherConfirmation: true,
      suggestion: {
        reviewId: 'homework-review-wang-math-001',
        status: 'AI_SUGGESTED',
        requiresTeacherConfirmation: true,
        areas: [
          {
            id: 'ai-area-1',
            subject: '数学',
            mistakeReason: '应用题数量关系理解错误',
            confidence: 0.82,
            confidenceLevel: 'MEDIUM',
            requiresManualConfirmation: true,
            confirmationHint: 'AI 建议区域，发布前必须老师确认',
          },
        ],
      },
    });

    expect(result.teacherConfirmedAreas).toEqual([]);
  });

  it('does not allow AI suggested areas to enter mistake book before teacher confirmation', async () => {
    const result = await createTeacherMistakeSuggestionForAi({
      teacher,
      student: {
        id: 'student-wang',
        campusId: 'campus-east',
        classId: 'class-evening-a',
      },
      homeworkReview,
      imageNaturalWidth: 1200,
      imageNaturalHeight: 1600,
      provider: createMockMistakeSuggestionProvider({
        areas: [
          {
            id: 'ai-area-1',
            originalBox: { x: 120, y: 240, width: 300, height: 180 },
            subject: '数学',
            mistakeReason: '应用题数量关系理解错误',
            confidence: 0.91,
          },
        ],
      }),
    });

    const collection = collectMistakeBookItemsAfterFeedbackPublish({
      review: {
        id: homeworkReview.id,
        campusId: homeworkReview.campusId,
        classId: homeworkReview.classId,
        studentId: homeworkReview.studentId,
        publishStatus: 'PUBLISHED',
        publishedAt: new Date('2026-05-02T10:00:00.000Z'),
      },
      confirmedAreas: result.teacherConfirmedAreas,
      existingItems: [],
      collectedAt: new Date('2026-05-02T10:05:00.000Z'),
    });

    expect(collection.createdItems).toEqual([]);
  });

  it('rejects mistake suggestions for students outside the teacher assignment scope', async () => {
    await expect(
      createTeacherMistakeSuggestionForAi({
        teacher,
        student: {
          id: 'student-li',
          campusId: 'campus-west',
          classId: 'class-evening-b',
        },
        homeworkReview: {
          ...homeworkReview,
          campusId: 'campus-west',
          classId: 'class-evening-b',
          studentId: 'student-li',
        },
        imageNaturalWidth: 1200,
        imageNaturalHeight: 1600,
        provider: createMockMistakeSuggestionProvider({ areas: [] }),
      }),
    ).rejects.toThrow('无权为该学生生成 AI 圈错建议');
  });
});
