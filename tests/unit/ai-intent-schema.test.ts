import { describe, expect, it } from 'vitest';

import { AI_INTENTS } from '@/domain/shared/enums';
import {
  AI_INTENT_ENTITY_SCHEMAS,
  aiIntentRecognitionSchema,
  parseAiIntentRecognition,
} from '@/domain/ai-command/ai-intent-schema';

describe('AI intent recognition schema', () => {
  it('accepts exactly the 9 MVP intents and exposes entity schemas for each intent', () => {
    expect(Object.keys(AI_INTENT_ENTITY_SCHEMAS).sort()).toEqual([...AI_INTENTS].sort());

    for (const intent of AI_INTENTS) {
      expect(() =>
        aiIntentRecognitionSchema.parse({
          intent,
          confidence: 0.88,
          entities: {},
        }),
      ).not.toThrow();
    }
  });

  it('normalizes unknown or low-confidence intent to manual fallback without executing business writes', () => {
    expect(
      parseAiIntentRecognition({
        intent: 'deleteStudent',
        confidence: 0.95,
        entities: { studentId: 'student-1' },
      }),
    ).toEqual({
      intent: null,
      confidence: 0,
      entities: {},
      fallbackToManual: true,
      fallbackReason: '未知意图，请转人工或使用传统页面处理',
    });

    expect(
      parseAiIntentRecognition({
        intent: 'queryAttendance',
        confidence: 0.39,
        entities: { studentId: 'student-1' },
      }),
    ).toMatchObject({
      intent: null,
      fallbackToManual: true,
      fallbackReason: '意图置信度过低，请转人工或使用传统页面处理',
    });
  });

  it('validates intent-specific entity shapes and keeps parsed output auditable', () => {
    const parsed = parseAiIntentRecognition({
      intent: 'createLeaveRequest',
      confidence: 0.91,
      entities: {
        studentId: 'student-1',
        leaveDate: '2026-05-03',
        reason: '身体不舒服',
      },
    });

    expect(parsed).toEqual({
      intent: 'createLeaveRequest',
      confidence: 0.91,
      entities: {
        studentId: 'student-1',
        leaveDate: '2026-05-03',
        reason: '身体不舒服',
      },
      fallbackToManual: false,
      fallbackReason: null,
    });

    expect(
      parseAiIntentRecognition({
        intent: 'createLeaveRequest',
        confidence: 0.91,
        entities: { studentId: 'student-1' },
      }),
    ).toMatchObject({
      intent: null,
      fallbackToManual: true,
      fallbackReason: '意图实体不完整，请转人工或使用传统页面处理',
    });
  });
});
