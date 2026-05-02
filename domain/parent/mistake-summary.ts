import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import type { MistakeCorrectionStatus } from '@/domain/mistake-book/mistake-book-item';

export type ParentMistakeSummarySource = {
  id: string;
  campusId: string;
  classId: string | null;
  studentId: string;
  studentName: string;
  subject: string;
  knowledgePoint: string;
  mistakeReason: string;
  correctionStatus: MistakeCorrectionStatus;
  aiConfidence: number;
  createdAt: string;
};

export type ParentVisibleMistakeSummary = {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  knowledgePoint: string;
  mistakeReason: string;
  correctionStatusLabel: string;
  createdAt: string;
};

const STATUS_LABELS: Record<MistakeCorrectionStatus, string> = {
  PENDING_CORRECTION: '待订正',
  CORRECTED: '已订正',
  MASTERED: '已掌握',
};

export function getParentVisibleMistakeSummaries({
  guardian,
  mistakeItems,
}: {
  guardian: PermissionActor;
  mistakeItems: readonly ParentMistakeSummarySource[];
}): ParentVisibleMistakeSummary[] {
  return mistakeItems
    .filter((item) =>
      canAccessStudent(guardian, {
        id: item.studentId,
        campusId: item.campusId,
        classId: item.classId,
      }),
    )
    .map((item) => ({
      id: item.id,
      studentId: item.studentId,
      studentName: item.studentName,
      subject: item.subject,
      knowledgePoint: item.knowledgePoint,
      mistakeReason: item.mistakeReason,
      correctionStatusLabel: STATUS_LABELS[item.correctionStatus],
      createdAt: item.createdAt,
    }));
}
