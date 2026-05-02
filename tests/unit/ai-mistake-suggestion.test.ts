import { describe, expect, it } from 'vitest';

import {
  createMockMistakeSuggestionProvider,
  suggestHomeworkMistakeAreas,
} from '@/domain/homework/ai-mistake-suggestion';

describe('AI mistake suggestion service stub', () => {
  it('returns suggested areas with subject, mistake reason and confidence from a mock provider', async () => {
    const provider = createMockMistakeSuggestionProvider({
      areas: [
        {
          id: 'ai-area-1',
          originalBox: { x: 120, y: 320, width: 360, height: 480 },
          subject: '数学',
          mistakeReason: '竖式进位漏写',
          confidence: 0.86,
        },
      ],
    });

    const result = await suggestHomeworkMistakeAreas({
      provider,
      reviewId: 'homework-review-wang-1',
      originalImageFileId: 'file-homework-original-wang',
      subject: '数学',
      imageNaturalWidth: 1200,
      imageNaturalHeight: 1600,
    });

    expect(result).toMatchObject({
      reviewId: 'homework-review-wang-1',
      status: 'AI_SUGGESTED',
      providerName: 'mock-mistake-suggestion',
      requiresTeacherConfirmation: true,
    });
    expect(result.areas).toEqual([
      expect.objectContaining({
        id: 'ai-area-1',
        subject: '数学',
        mistakeReason: '竖式进位漏写',
        confidence: 0.86,
        confirmationHint: 'AI 建议区域，发布前必须老师确认',
      }),
    ]);
  });

  it('marks low-confidence suggestions for manual teacher confirmation', async () => {
    const provider = createMockMistakeSuggestionProvider({
      areas: [
        {
          id: 'ai-low-confidence',
          originalBox: { x: 80, y: 180, width: 200, height: 160 },
          subject: '数学',
          mistakeReason: '疑似审题偏差',
          confidence: 0.42,
        },
      ],
    });

    const result = await suggestHomeworkMistakeAreas({
      provider,
      reviewId: 'homework-review-wang-2',
      originalImageFileId: 'file-homework-original-wang-2',
      subject: '数学',
      imageNaturalWidth: 1200,
      imageNaturalHeight: 1600,
      lowConfidenceThreshold: 0.7,
    });

    expect(result.areas[0]).toMatchObject({
      confidence: 0.42,
      confidenceLevel: 'LOW',
      requiresManualConfirmation: true,
      confirmationHint: '低置信度，请老师手动确认或调整',
    });
  });

  it('rejects invalid confidence scores from providers', async () => {
    const provider = createMockMistakeSuggestionProvider({
      areas: [
        {
          id: 'ai-invalid-confidence',
          originalBox: { x: 0, y: 0, width: 100, height: 100 },
          subject: '数学',
          mistakeReason: '异常置信度',
          confidence: 1.2,
        },
      ],
    });

    await expect(
      suggestHomeworkMistakeAreas({
        provider,
        reviewId: 'homework-review-invalid',
        originalImageFileId: 'file-homework-invalid',
        subject: '数学',
        imageNaturalWidth: 1200,
        imageNaturalHeight: 1600,
      }),
    ).rejects.toThrow('AI 圈错置信度必须在 0 到 1 之间');
  });
});
