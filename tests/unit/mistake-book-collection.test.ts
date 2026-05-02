import { describe, expect, it } from 'vitest';

import {
  collectMistakeBookItemsAfterFeedbackPublish,
  type MistakeBookItemDraft,
} from '@/domain/mistake-book/mistake-book-item';

const publishedReview = {
  id: 'homework-review-wang-demo',
  campusId: 'demo-campus-east',
  classId: 'demo-class-east-g3',
  studentId: 'demo-student-profile-wang',
  publishStatus: 'PUBLISHED' as const,
  publishedAt: new Date('2026-05-02T12:00:00.000Z'),
};

const confirmedArea = {
  id: 'area-confirmed',
  sourceAiAreaId: 'ai-area-confirmed',
  subject: '数学',
  knowledgePoint: '两位数乘法',
  mistakeReason: '进位步骤遗漏',
  originalBox: { x: 120, y: 320, width: 360, height: 480 },
  confidence: 0.86,
  confirmationStatus: 'CONFIRMED' as const,
  confirmedByTeacherUserId: 'demo-teacher-li',
  confirmedAt: '2026-05-02T11:00:00.000Z',
};

const modifiedArea = {
  id: 'area-modified',
  sourceAiAreaId: 'ai-area-modified',
  subject: '数学',
  knowledgePoint: '竖式计算',
  mistakeReason: '老师修正后的错因',
  originalBox: { x: 10, y: 20, width: 30, height: 40 },
  confidence: 0.62,
  confirmationStatus: 'MODIFIED' as const,
  confirmedByTeacherUserId: 'demo-teacher-li',
  confirmedAt: '2026-05-02T11:05:00.000Z',
};

const ignoredArea = {
  sourceAiAreaId: 'ai-area-ignored',
  confirmationStatus: 'IGNORED' as const,
  ignoreReason: '误识别',
  confirmedByTeacherUserId: 'demo-teacher-li',
  confirmedAt: '2026-05-02T11:10:00.000Z',
};

function existingItemFor(sourceAreaId: string): Pick<MistakeBookItemDraft, 'homeworkReviewId' | 'sourceAreaId'> {
  return {
    homeworkReviewId: publishedReview.id,
    sourceAreaId,
  };
}

describe('collect mistake book items after homework feedback publish', () => {
  it('collects only teacher-confirmed or modified areas after feedback is published', () => {
    const result = collectMistakeBookItemsAfterFeedbackPublish({
      review: publishedReview,
      confirmedAreas: [confirmedArea, modifiedArea, ignoredArea],
      existingItems: [],
      collectedAt: new Date('2026-05-02T12:30:00.000Z'),
    });

    expect(result.createdItems).toHaveLength(2);
    expect(result.createdItems).toEqual([
      expect.objectContaining({
        homeworkReviewId: publishedReview.id,
        sourceAreaId: 'area-confirmed',
        knowledgePoint: '两位数乘法',
        mistakeReason: '进位步骤遗漏',
        correctionStatus: 'PENDING_CORRECTION',
      }),
      expect.objectContaining({
        homeworkReviewId: publishedReview.id,
        sourceAreaId: 'area-modified',
        knowledgePoint: '竖式计算',
        mistakeReason: '老师修正后的错因',
        correctionStatus: 'PENDING_CORRECTION',
      }),
    ]);
    expect(result.skippedDuplicateKeys).toEqual([]);
  });

  it('does not create duplicate mistake items when the same homework feedback is published again', () => {
    const firstPublish = collectMistakeBookItemsAfterFeedbackPublish({
      review: publishedReview,
      confirmedAreas: [confirmedArea, modifiedArea, ignoredArea],
      existingItems: [],
      collectedAt: new Date('2026-05-02T12:30:00.000Z'),
    });

    const secondPublish = collectMistakeBookItemsAfterFeedbackPublish({
      review: publishedReview,
      confirmedAreas: [confirmedArea, modifiedArea, ignoredArea],
      existingItems: firstPublish.createdItems.map((item) => existingItemFor(item.sourceAreaId)),
      collectedAt: new Date('2026-05-02T12:45:00.000Z'),
    });

    expect(secondPublish.createdItems).toEqual([]);
    expect(secondPublish.skippedDuplicateKeys).toEqual([
      'homework-review-wang-demo:area-confirmed',
      'homework-review-wang-demo:area-modified',
    ]);
  });
});
