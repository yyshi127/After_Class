import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import type { ParentVisibleHomeworkFeedback } from '@/domain/feedback/homework-feedback-publishing';
import type { ServiceType } from '@/domain/shared/enums';

export type ParentHomeworkFeedbackDetailStudent = {
  id: string;
  name: string;
  campusId: string;
  classId?: string | null;
};

export type ParentHomeworkAttendanceRecord = {
  id: string;
  studentId: string;
  status: string;
  checkedAt: Date;
  serviceType: ServiceType;
  photoFileId: string | null;
};

export type ParentHomeworkMistakeSummaryInput = {
  id: string;
  reviewId: string;
  subject: string;
  knowledgePoint: string;
  mistakeReason: string;
  correctionStatus: string;
  source: 'TEACHER_CONFIRMED' | 'AI_DRAFT';
  internalAiConfidence?: number;
  teacherInternalNote?: string;
};

export type ParentHomeworkFeedbackDetail = {
  reviewId: string;
  studentId: string;
  studentName: string;
  subject: string;
  originalImageFileId: string;
  correctedImageFileId: string;
  publishedAt: string;
  feedback: {
    behaviorPerformance: string | null;
    homeworkCompletion: string;
    knowledgeMastery: string | null;
  };
  attendanceTimeline: {
    id: string;
    status: string;
    checkedAt: string;
    serviceType: ServiceType;
    photoFileId: string | null;
  }[];
  mistakeSummaries: {
    id: string;
    subject: string;
    knowledgePoint: string;
    mistakeReason: string;
    correctionStatus: string;
  }[];
};

export function createParentHomeworkFeedbackDetail(input: {
  guardian: PermissionActor;
  student: ParentHomeworkFeedbackDetailStudent;
  feedback: ParentVisibleHomeworkFeedback | null;
  attendanceRecords: readonly ParentHomeworkAttendanceRecord[];
  mistakeSummaries: readonly ParentHomeworkMistakeSummaryInput[];
}): ParentHomeworkFeedbackDetail | null {
  if (!input.feedback) {
    return null;
  }

  if (!canAccessStudent(input.guardian, input.student)) {
    return null;
  }

  if (input.feedback.studentId !== input.student.id) {
    return null;
  }

  return {
    reviewId: input.feedback.reviewId,
    studentId: input.student.id,
    studentName: input.student.name,
    subject: input.feedback.subject,
    originalImageFileId: input.feedback.originalImageFileId,
    correctedImageFileId: input.feedback.correctedImageFileId,
    publishedAt: input.feedback.publishedAt,
    feedback: {
      behaviorPerformance: input.feedback.behaviorPerformance,
      homeworkCompletion: input.feedback.homeworkCompletion,
      knowledgeMastery: input.feedback.knowledgeMastery,
    },
    attendanceTimeline: input.attendanceRecords
      .filter((record) => record.studentId === input.student.id)
      .sort((a, b) => a.checkedAt.getTime() - b.checkedAt.getTime())
      .map((record) => ({
        id: record.id,
        status: record.status,
        checkedAt: record.checkedAt.toISOString(),
        serviceType: record.serviceType,
        photoFileId: record.photoFileId,
      })),
    mistakeSummaries: input.mistakeSummaries
      .filter((summary) => summary.reviewId === input.feedback?.reviewId && summary.source === 'TEACHER_CONFIRMED')
      .map((summary) => ({
        id: summary.id,
        subject: summary.subject,
        knowledgePoint: summary.knowledgePoint,
        mistakeReason: summary.mistakeReason,
        correctionStatus: summary.correctionStatus,
      })),
  };
}
