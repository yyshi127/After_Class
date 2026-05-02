import { isServiceType, type ServiceType } from '@/domain/shared/enums';

export function assertValidStudentServiceType(serviceType: string): ServiceType {
  if (!isServiceType(serviceType)) {
    throw new Error('学生必须选择四种固定托管类型之一');
  }

  return serviceType;
}
