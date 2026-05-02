import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';
import type { HomeworkPublishStatus, HomeworkReviewStatus } from '@/domain/homework/homework-review';
import type { ServiceType } from '@/domain/shared/enums';

export type AdminHomeworkFeedbackProgressRow = {
  id: string;
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
  serviceType: ServiceType;
  status: HomeworkReviewStatus;
  publishStatus: HomeworkPublishStatus;
};

export type AdminHomeworkFeedbackProgressItem = {
  campusId: string;
  campusName: string;
  classId: string;
  className: string;
  serviceType: ServiceType;
  pendingCorrectionCount: number;
  pendingPublishCount: number;
  publishedCount: number;
  totalCount: number;
  publishedRateLabel: string;
};

function canAccessHomeworkFeedbackProgress(actor: PermissionActor): boolean {
  return actor.role === 'SUPER_ADMIN' || actor.role === 'ADMIN' || actor.role === 'CAMPUS_ADMIN';
}

function getGroupKey(row: AdminHomeworkFeedbackProgressRow): string {
  return [row.campusId, row.classId, row.serviceType].join('::');
}

export function getAdminHomeworkFeedbackProgress(
  actor: PermissionActor,
  rows: readonly AdminHomeworkFeedbackProgressRow[],
): AdminHomeworkFeedbackProgressItem[] {
  if (!canAccessHomeworkFeedbackProgress(actor)) {
    return [];
  }

  const grouped = new Map<string, AdminHomeworkFeedbackProgressItem>();

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
        pendingCorrectionCount: 0,
        pendingPublishCount: 0,
        publishedCount: 0,
        totalCount: 0,
        publishedRateLabel: '0.00%',
      };

      existing.totalCount += 1;

      if (row.publishStatus === 'PUBLISHED') {
        existing.publishedCount += 1;
      } else if (row.status === 'UPLOADED' || row.status === 'AI_SUGGESTED') {
        existing.pendingCorrectionCount += 1;
      } else if (row.status === 'TEACHER_REVIEWED') {
        existing.pendingPublishCount += 1;
      }

      existing.publishedRateLabel = `${((existing.publishedCount / existing.totalCount) * 100).toFixed(2)}%`;
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
