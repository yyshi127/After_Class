import type { AiMistakeSuggestionArea } from '@/domain/homework/ai-mistake-suggestion';
import type { HomeworkCorrectionBox } from '@/domain/homework/correction-canvas';
import type { HomeworkReviewStatus } from '@/domain/homework/homework-review';

export type TeacherMistakeAreaDecision =
  | {
      areaId: string;
      action: 'CONFIRM';
    }
  | {
      areaId: string;
      action: 'MODIFY';
      originalBox?: HomeworkCorrectionBox;
      mistakeReason?: string;
      subject?: string;
    }
  | {
      areaId: string;
      action: 'IGNORE';
      ignoreReason: string;
    };

export type TeacherConfirmedMistakeArea = {
  id: string;
  sourceAiAreaId: string;
  originalBox: HomeworkCorrectionBox;
  subject: string;
  mistakeReason: string;
  confidence: number;
  confirmationStatus: 'CONFIRMED' | 'MODIFIED';
  confirmedByTeacherUserId: string;
  confirmedAt: string;
};

export type IgnoredMistakeArea = {
  sourceAiAreaId: string;
  confirmationStatus: 'IGNORED';
  ignoreReason: string;
  confirmedByTeacherUserId: string;
  confirmedAt: string;
};

export type TeacherMistakeAreaDecisionResult = {
  reviewId: string;
  status: Extract<HomeworkReviewStatus, 'TEACHER_REVIEWED'>;
  teacherConfirmedAreas: TeacherConfirmedMistakeArea[];
  ignoredAreas: IgnoredMistakeArea[];
  unconfirmedAreaIds: string[];
};

export function applyTeacherMistakeAreaDecisions(input: {
  reviewId: string;
  aiSuggestedAreas: AiMistakeSuggestionArea[];
  decisions: TeacherMistakeAreaDecision[];
  confirmedByTeacherUserId: string;
  confirmedAt: Date;
}): TeacherMistakeAreaDecisionResult {
  const confirmedAt = input.confirmedAt.toISOString();
  const decisionByAreaId = new Map(input.decisions.map((decision) => [decision.areaId, decision]));
  const teacherConfirmedAreas: TeacherConfirmedMistakeArea[] = [];
  const ignoredAreas: IgnoredMistakeArea[] = [];
  const unconfirmedAreaIds: string[] = [];

  for (const aiArea of input.aiSuggestedAreas) {
    const decision = decisionByAreaId.get(aiArea.id);

    if (!decision) {
      unconfirmedAreaIds.push(aiArea.id);
      continue;
    }

    if (decision.action === 'IGNORE') {
      ignoredAreas.push({
        sourceAiAreaId: aiArea.id,
        confirmationStatus: 'IGNORED',
        ignoreReason: decision.ignoreReason,
        confirmedByTeacherUserId: input.confirmedByTeacherUserId,
        confirmedAt,
      });
      continue;
    }

    teacherConfirmedAreas.push({
      id: aiArea.id,
      sourceAiAreaId: aiArea.id,
      originalBox: decision.action === 'MODIFY' && decision.originalBox ? decision.originalBox : aiArea.originalBox,
      subject: decision.action === 'MODIFY' && decision.subject ? decision.subject : aiArea.subject,
      mistakeReason:
        decision.action === 'MODIFY' && decision.mistakeReason ? decision.mistakeReason : aiArea.mistakeReason,
      confidence: aiArea.confidence,
      confirmationStatus: decision.action === 'MODIFY' ? 'MODIFIED' : 'CONFIRMED',
      confirmedByTeacherUserId: input.confirmedByTeacherUserId,
      confirmedAt,
    });
  }

  return {
    reviewId: input.reviewId,
    status: 'TEACHER_REVIEWED',
    teacherConfirmedAreas,
    ignoredAreas,
    unconfirmedAreaIds,
  };
}

export function getPublishableMistakeAreas(
  result: TeacherMistakeAreaDecisionResult,
): TeacherConfirmedMistakeArea[] {
  return result.teacherConfirmedAreas;
}
