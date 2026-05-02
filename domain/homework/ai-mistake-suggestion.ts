import type { HomeworkCorrectionBox } from '@/domain/homework/correction-canvas';
import type { HomeworkReviewStatus } from '@/domain/homework/homework-review';

export type AiMistakeConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AiMistakeSuggestionProviderArea = {
  id: string;
  originalBox: HomeworkCorrectionBox;
  subject: string;
  mistakeReason: string;
  confidence: number;
};

export type AiMistakeSuggestionArea = AiMistakeSuggestionProviderArea & {
  confidenceLevel: AiMistakeConfidenceLevel;
  requiresManualConfirmation: boolean;
  confirmationHint: string;
};

export type AiMistakeSuggestionProvider = {
  name: string;
  suggestAreas(input: AiMistakeSuggestionProviderInput): Promise<AiMistakeSuggestionProviderArea[]>;
};

export type AiMistakeSuggestionProviderInput = {
  reviewId: string;
  originalImageFileId: string;
  subject: string;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
};

export type SuggestHomeworkMistakeAreasInput = AiMistakeSuggestionProviderInput & {
  provider: AiMistakeSuggestionProvider;
  lowConfidenceThreshold?: number;
};

export type AiMistakeSuggestionResult = {
  reviewId: string;
  status: Extract<HomeworkReviewStatus, 'AI_SUGGESTED'>;
  providerName: string;
  requiresTeacherConfirmation: true;
  areas: AiMistakeSuggestionArea[];
};

export function createMockMistakeSuggestionProvider({
  areas,
}: {
  areas: AiMistakeSuggestionProviderArea[];
}): AiMistakeSuggestionProvider {
  return {
    name: 'mock-mistake-suggestion',
    async suggestAreas() {
      return areas;
    },
  };
}

export async function suggestHomeworkMistakeAreas(
  input: SuggestHomeworkMistakeAreasInput,
): Promise<AiMistakeSuggestionResult> {
  const threshold = input.lowConfidenceThreshold ?? 0.7;
  const areas = await input.provider.suggestAreas({
    reviewId: input.reviewId,
    originalImageFileId: input.originalImageFileId,
    subject: input.subject,
    imageNaturalWidth: input.imageNaturalWidth,
    imageNaturalHeight: input.imageNaturalHeight,
  });

  return {
    reviewId: input.reviewId,
    status: 'AI_SUGGESTED',
    providerName: input.provider.name,
    requiresTeacherConfirmation: true,
    areas: areas.map((area) => normalizeSuggestionArea(area, threshold)),
  };
}

function normalizeSuggestionArea(
  area: AiMistakeSuggestionProviderArea,
  lowConfidenceThreshold: number,
): AiMistakeSuggestionArea {
  assertValidConfidence(area.confidence);

  const confidenceLevel = getConfidenceLevel(area.confidence, lowConfidenceThreshold);
  const requiresManualConfirmation = true;

  return {
    ...area,
    confidenceLevel,
    requiresManualConfirmation,
    confirmationHint:
      confidenceLevel === 'LOW'
        ? '低置信度，请老师手动确认或调整'
        : 'AI 建议区域，发布前必须老师确认',
  };
}

function assertValidConfidence(confidence: number) {
  if (confidence < 0 || confidence > 1) {
    throw new Error('AI 圈错置信度必须在 0 到 1 之间');
  }
}

function getConfidenceLevel(confidence: number, lowConfidenceThreshold: number): AiMistakeConfidenceLevel {
  if (confidence < lowConfidenceThreshold) {
    return 'LOW';
  }

  if (confidence < 0.9) {
    return 'MEDIUM';
  }

  return 'HIGH';
}
