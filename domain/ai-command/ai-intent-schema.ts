import { z } from 'zod';

import { AI_INTENTS, type AiIntent } from '@/domain/shared/enums';

const optionalString = z.string().min(1).optional();

export const AI_INTENT_ENTITY_SCHEMAS = {
  queryAttendance: z.object({
    studentId: optionalString,
    date: optionalString,
  }),
  queryHomework: z.object({
    studentId: optionalString,
    date: optionalString,
    subject: optionalString,
  }),
  createLeaveRequest: z.object({
    studentId: z.string().min(1),
    leaveDate: z.string().min(1),
    reason: z.string().min(1),
  }),
  queryBilling: z.object({
    studentId: optionalString,
  }),
  sendTeacherMessage: z.object({
    studentId: z.string().min(1),
    message: z.string().min(1),
  }),
  recordHomeworkFeedback: z.object({
    studentId: z.string().min(1),
    homeworkReviewId: optionalString,
    behaviorPerformance: optionalString,
    homeworkCompletion: z.string().min(1),
    knowledgeMastery: optionalString,
  }),
  suggestMistakeAreas: z.object({
    homeworkReviewId: z.string().min(1),
    imageFileId: z.string().min(1),
    subject: optionalString,
  }),
  generateSimilarQuestions: z.object({
    mistakeBookItemId: z.string().min(1),
    count: z.number().int().min(1).max(10).optional(),
  }),
  queryClassSettlement: z.object({
    campusId: optionalString,
    classId: optionalString,
    settlementDate: optionalString,
    serviceType: optionalString,
  }),
} satisfies Record<AiIntent, z.ZodType>;

export const aiIntentRecognitionSchema = z.object({
  intent: z.enum(AI_INTENTS),
  confidence: z.number().min(0).max(1),
  entities: z.record(z.string(), z.unknown()).default({}),
});

export type AiIntentRecognition = z.infer<typeof aiIntentRecognitionSchema>;

export type ParsedAiIntentRecognition = {
  intent: AiIntent | null;
  confidence: number;
  entities: Record<string, unknown>;
  fallbackToManual: boolean;
  fallbackReason: string | null;
};

const MIN_CONFIDENCE_TO_ROUTE = 0.4;

function manualFallback(fallbackReason: string): ParsedAiIntentRecognition {
  return {
    intent: null,
    confidence: 0,
    entities: {},
    fallbackToManual: true,
    fallbackReason,
  };
}

export function parseAiIntentRecognition(input: unknown): ParsedAiIntentRecognition {
  const parsed = aiIntentRecognitionSchema.safeParse(input);

  if (!parsed.success) {
    return manualFallback('未知意图，请转人工或使用传统页面处理');
  }

  if (parsed.data.confidence < MIN_CONFIDENCE_TO_ROUTE) {
    return manualFallback('意图置信度过低，请转人工或使用传统页面处理');
  }

  const entitySchema = AI_INTENT_ENTITY_SCHEMAS[parsed.data.intent];
  const entities = entitySchema.safeParse(parsed.data.entities);

  if (!entities.success) {
    return manualFallback('意图实体不完整，请转人工或使用传统页面处理');
  }

  return {
    intent: parsed.data.intent,
    confidence: parsed.data.confidence,
    entities: entities.data as Record<string, unknown>,
    fallbackToManual: false,
    fallbackReason: null,
  };
}
