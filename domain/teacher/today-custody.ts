import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import type { AttendanceStatus, ServiceType } from '@/domain/shared/enums';

export type TeacherTodayCustodyRecord = {
  id: string;
  studentName: string;
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
  serviceType: ServiceType;
  attendanceStatus: AttendanceStatus;
  serviceExpiresAt: string;
};

export type TeacherTodayCustodyFilters = {
  campusId?: string;
  classId?: string;
  serviceType?: ServiceType;
};

export type TeacherTodayCustodyItem = TeacherTodayCustodyRecord & {
  statusLabel: AttendanceStatus;
  serviceExpiryLabel: string;
  isExpiringSoon: boolean;
};

export function getTeacherTodayCustodyItems({
  actor,
  records,
  filters = {},
  today,
}: {
  actor: PermissionActor;
  records: readonly TeacherTodayCustodyRecord[];
  filters?: TeacherTodayCustodyFilters;
  today: string;
}): TeacherTodayCustodyItem[] {
  return records
    .filter((record) => canAccessStudent(actor, { id: record.id, campusId: record.campusId, classId: record.classId }))
    .filter((record) => filters.campusId == null || record.campusId === filters.campusId)
    .filter((record) => filters.classId == null || record.classId === filters.classId)
    .filter((record) => filters.serviceType == null || record.serviceType === filters.serviceType)
    .map((record) => {
      const daysUntilExpiry = getDaysUntil(record.serviceExpiresAt, today);

      return {
        ...record,
        statusLabel: record.attendanceStatus,
        serviceExpiryLabel: formatServiceExpiryLabel(daysUntilExpiry),
        isExpiringSoon: daysUntilExpiry >= 0 && daysUntilExpiry <= 7,
      };
    });
}

export function getTeacherTodayFilterOptions(items: readonly TeacherTodayCustodyItem[]) {
  return {
    campuses: uniqueBy(items, (item) => item.campusId).map((item) => ({ id: item.campusId, name: item.campusName })),
    classes: uniqueBy(items, (item) => item.classId).map((item) => ({ id: item.classId, name: item.className })),
    serviceTypes: Array.from(new Set(items.map((item) => item.serviceType))),
  };
}

function formatServiceExpiryLabel(daysUntilExpiry: number): string {
  if (daysUntilExpiry < 0) {
    return '服务已到期';
  }

  if (daysUntilExpiry === 0) {
    return '服务今日到期';
  }

  if (daysUntilExpiry <= 7) {
    return `服务 ${daysUntilExpiry} 天后到期`;
  }

  return '服务有效';
}

function getDaysUntil(date: string, today: string): number {
  const targetMs = Date.parse(`${date}T00:00:00.000Z`);
  const todayMs = Date.parse(`${today}T00:00:00.000Z`);

  return Math.round((targetMs - todayMs) / 86_400_000);
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
