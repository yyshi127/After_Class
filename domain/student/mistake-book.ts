import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import type { MistakeCorrectionStatus } from '@/domain/mistake-book/mistake-book-item';

export type StudentMistakeBookRecord = {
  id: string;
  campusId: string;
  classId: string;
  studentId: string;
  studentUserId: string;
  subject: string;
  knowledgePoint: string;
  mistakeReason: string;
  questionText: string | null;
  correctionStatus: MistakeCorrectionStatus;
  createdAt: string;
};

export type StudentMistakeBookItem = StudentMistakeBookRecord & {
  correctionStatusLabel: string;
  aiExplanationEntryLabel: string;
  createdDate: string;
};

export function getStudentMistakeBookItems({
  actor,
  items,
}: {
  actor: PermissionActor;
  items: readonly StudentMistakeBookRecord[];
}): StudentMistakeBookItem[] {
  return items
    .filter((item) =>
      canAccessStudent(actor, {
        id: item.studentId,
        campusId: item.campusId,
        classId: item.classId,
        userId: item.studentUserId,
      }),
    )
    .map((item) => ({
      ...item,
      correctionStatusLabel: formatCorrectionStatus(item.correctionStatus),
      aiExplanationEntryLabel: 'AI 讲解入口',
      createdDate: item.createdAt.slice(0, 10),
    }));
}

function formatCorrectionStatus(status: MistakeCorrectionStatus): string {
  if (status === 'CORRECTED') {
    return '已订正';
  }

  if (status === 'MASTERED') {
    return '已掌握';
  }

  return '待订正';
}
