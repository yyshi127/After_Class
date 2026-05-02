import type { HomeworkCorrectionBox } from '@/domain/homework/correction-canvas';
import type {
  IgnoredMistakeArea,
  TeacherConfirmedMistakeArea,
} from '@/domain/homework/mistake-area-confirmation';

export const MISTAKE_CORRECTION_STATUSES = ['PENDING_CORRECTION', 'CORRECTED', 'MASTERED'] as const;

export type MistakeCorrectionStatus = (typeof MISTAKE_CORRECTION_STATUSES)[number];

export type MistakeBookConfirmedArea = TeacherConfirmedMistakeArea & {
  knowledgePoint: string;
  questionText?: string | null;
};

export type MistakeBookAreaInput = MistakeBookConfirmedArea | IgnoredMistakeArea;

export type MistakeBookItemDraft = {
  id: string;
  campusId: string;
  classId: string | null;
  studentId: string;
  homeworkReviewId: string;
  sourceAreaId: string;
  subject: string;
  knowledgePoint: string;
  mistakeReason: string;
  imageRegion: HomeworkCorrectionBox;
  questionText: string | null;
  correctionStatus: MistakeCorrectionStatus;
  aiConfidence: number | null;
  createdAt: string;
};

export function createMistakeBookItemsFromConfirmedAreas(input: {
  campusId: string;
  classId?: string | null;
  studentId: string;
  homeworkReviewId: string;
  areas: readonly MistakeBookAreaInput[];
  createdAt: Date;
}): MistakeBookItemDraft[] {
  const createdAt = input.createdAt.toISOString();

  return input.areas
    .filter(isConfirmedMistakeArea)
    .map((area) => ({
      id: `mistake-${input.homeworkReviewId}-${area.id}`,
      campusId: input.campusId,
      classId: input.classId ?? null,
      studentId: input.studentId,
      homeworkReviewId: input.homeworkReviewId,
      sourceAreaId: area.id,
      subject: area.subject,
      knowledgePoint: area.knowledgePoint,
      mistakeReason: area.mistakeReason,
      imageRegion: area.originalBox,
      questionText: area.questionText ?? null,
      correctionStatus: 'PENDING_CORRECTION',
      aiConfidence: area.confidence,
      createdAt,
    }));
}

function isConfirmedMistakeArea(area: MistakeBookAreaInput): area is MistakeBookConfirmedArea {
  return area.confirmationStatus === 'CONFIRMED' || area.confirmationStatus === 'MODIFIED';
}
