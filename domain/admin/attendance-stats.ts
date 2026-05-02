import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';
import type { AttendanceStatus, ServiceType } from '@/domain/shared/enums';

export type AdminAttendanceStatsRow = {
  studentId: string;
  studentName: string;
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
  serviceType: ServiceType;
  status: AttendanceStatus;
};

export type AdminAttendanceStatsItem = {
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
  serviceType: ServiceType;
  expectedCount: number;
  arrivedCount: number;
  leaveCount: number;
  absentCount: number;
  attendanceRateLabel: string;
};

function canAccessAdminAttendanceStats(actor: PermissionActor): boolean {
  return actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN' || actor.role === 'CAMPUS_ADMIN';
}

function getGroupKey(row: AdminAttendanceStatsRow): string {
  return [row.campusId, row.classId, row.serviceType].join('::');
}

export function getAdminAttendanceStats(
  actor: PermissionActor,
  rows: readonly AdminAttendanceStatsRow[],
): AdminAttendanceStatsItem[] {
  if (!canAccessAdminAttendanceStats(actor)) {
    return [];
  }

  const grouped = new Map<string, AdminAttendanceStatsItem>();

  rows
    .filter((row) => canAccessCampus(actor, row.campusId))
    .forEach((row) => {
      const key = getGroupKey(row);
      const existing = grouped.get(key) ?? {
        campusId: row.campusId,
        campusName: row.campusName,
        classId: row.classId,
        className: row.className,
        serviceType: row.serviceType,
        expectedCount: 0,
        arrivedCount: 0,
        leaveCount: 0,
        absentCount: 0,
        attendanceRateLabel: '0.00%',
      };

      existing.expectedCount += 1;

      if (row.status === '已到' || row.status === '迟到' || row.status === '已离托') {
        existing.arrivedCount += 1;
      }

      if (row.status === '请假') {
        existing.leaveCount += 1;
      }

      if (row.status === '缺勤') {
        existing.absentCount += 1;
      }

      existing.attendanceRateLabel = `${((existing.arrivedCount / existing.expectedCount) * 100).toFixed(2)}%`;
      grouped.set(key, existing);
    });

  return [...grouped.values()].sort((left, right) => {
    const campusCompare = left.campusName.localeCompare(right.campusName, 'zh-Hans-CN');
    if (campusCompare !== 0) return campusCompare;

    const classCompare = left.className.localeCompare(right.className, 'zh-Hans-CN');
    if (classCompare !== 0) return classCompare;

    return left.serviceType.localeCompare(right.serviceType, 'zh-Hans-CN');
  });
}
