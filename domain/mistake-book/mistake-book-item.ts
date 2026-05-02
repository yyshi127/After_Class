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

export type PublishedHomeworkReviewForMistakeCollection = {
  id: string;
  campusId: string;
  classId?: string | null;
  studentId: string;
  publishStatus: 'DRAFT' | 'PUBLISHED';
  publishedAt: Date | null;
};

export type ExistingMistakeBookItemSource = Pick<MistakeBookItemDraft, 'homeworkReviewId' | 'sourceAreaId'>;

export type MistakeBookCollectionResult = {
  createdItems: MistakeBookItemDraft[];
  skippedDuplicateKeys: string[];
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

export function collectMistakeBookItemsAfterFeedbackPublish(input: {
  review: PublishedHomeworkReviewForMistakeCollection;
  confirmedAreas: readonly MistakeBookAreaInput[];
  existingItems: readonly ExistingMistakeBookItemSource[];
  collectedAt: Date;
}): MistakeBookCollectionResult {
  if (input.review.publishStatus !== 'PUBLISHED' || !input.review.publishedAt) {
    return { createdItems: [], skippedDuplicateKeys: [] };
  }

  const existingKeys = new Set(input.existingItems.map((item) => toMistakeSourceKey(item.homeworkReviewId, item.sourceAreaId)));
  const skippedDuplicateKeys: string[] = [];

  const createdItems = createMistakeBookItemsFromConfirmedAreas({
    campusId: input.review.campusId,
    classId: input.review.classId,
    studentId: input.review.studentId,
    homeworkReviewId: input.review.id,
    areas: input.confirmedAreas,
    createdAt: input.collectedAt,
  }).filter((item) => {
    const key = toMistakeSourceKey(item.homeworkReviewId, item.sourceAreaId);
    if (existingKeys.has(key)) {
      skippedDuplicateKeys.push(key);
      return false;
    }

    existingKeys.add(key);
    return true;
  });

  return { createdItems, skippedDuplicateKeys };
}

function toMistakeSourceKey(homeworkReviewId: string, sourceAreaId: string): string {
  return `${homeworkReviewId}:${sourceAreaId}`;
}

function isConfirmedMistakeArea(area: MistakeBookAreaInput): area is MistakeBookConfirmedArea {
  return area.confirmationStatus === 'CONFIRMED' || area.confirmationStatus === 'MODIFIED';
}
