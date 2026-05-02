import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import type { MistakeCorrectionStatus } from '@/domain/mistake-book/mistake-book-item';

export type TeacherMistakeBookRecord = {
  id: string;
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  subject: string;
  knowledgePoint: string;
  mistakeReason: string;
  questionText: string | null;
  correctionStatus: MistakeCorrectionStatus;
  createdAt: string;
};

export type TeacherMistakeBookFilters = {
  studentId?: string;
  subject?: string;
  knowledgePoint?: string;
  createdDate?: string;
};

export type TeacherMistakeBookItem = TeacherMistakeBookRecord & {
  correctionStatusLabel: string;
  createdDate: string;
};

export function getTeacherMistakeBookItems({
  actor,
  items,
  filters = {},
}: {
  actor: PermissionActor;
  items: readonly TeacherMistakeBookRecord[];
  filters?: TeacherMistakeBookFilters;
}): TeacherMistakeBookItem[] {
  return items
    .filter((item) =>
      canAccessStudent(actor, {
        id: item.studentId,
        campusId: item.campusId,
        classId: item.classId,
      }),
    )
    .filter((item) => filters.studentId == null || item.studentId === filters.studentId)
    .filter((item) => filters.subject == null || item.subject === filters.subject)
    .filter((item) => filters.knowledgePoint == null || item.knowledgePoint === filters.knowledgePoint)
    .filter((item) => filters.createdDate == null || item.createdAt.startsWith(filters.createdDate))
    .map((item) => ({
      ...item,
      correctionStatusLabel: formatCorrectionStatus(item.correctionStatus),
      createdDate: item.createdAt.slice(0, 10),
    }));
}

export function getTeacherMistakeBookFilterOptions(items: readonly TeacherMistakeBookItem[]) {
  return {
    students: uniqueBy(items, (item) => item.studentId).map((item) => ({ id: item.studentId, name: item.studentName })),
    subjects: Array.from(new Set(items.map((item) => item.subject))),
    knowledgePoints: Array.from(new Set(items.map((item) => item.knowledgePoint))),
    createdDates: Array.from(new Set(items.map((item) => item.createdDate))),
  };
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

function uniqueBy<T>(items: readonly T[], getKey: (item: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const key = getKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }

  return result;
}
