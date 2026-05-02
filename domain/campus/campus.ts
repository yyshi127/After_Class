import type { ServiceType } from '@/domain/shared/enums';

export type CampusStatus = 'ACTIVE' | 'INACTIVE';

export type CampusRecord = {
  id: string;
  status: CampusStatus;
};

export type CampusServiceScope = {
  supportedServiceTypes: readonly ServiceType[];
};

export function assertCampusCanCreateRecords(campus: CampusRecord): void {
  if (campus.status !== 'ACTIVE') {
    throw new Error('停用校区不能新建学生或班级');
  }
}

export function campusSupportsServiceType(campus: CampusServiceScope, serviceType: ServiceType): boolean {
  return campus.supportedServiceTypes.includes(serviceType);
}
