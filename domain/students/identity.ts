import type { ServiceType, StudentStatus } from '@/domain/shared/enums';

export type StudentListSource = {
  id: string;
  name: string;
  identityNumber: string | null;
  campusId: string;
  classId: string | null;
  serviceType: ServiceType;
  status: StudentStatus;
};

export type StudentParentProfileSource = {
  id: string;
  name: string;
  identityNumber: string | null;
  serviceType: ServiceType;
};

export function maskIdentityNumber(identityNumber: string | null): string | null {
  if (identityNumber == null) {
    return null;
  }

  const prefix = identityNumber.slice(0, 4);
  const suffix = identityNumber.slice(-4);

  if (identityNumber.length <= 8) {
    return `${prefix}****${suffix}`;
  }

  return `${prefix}********${suffix}`;
}

export function toStudentListItem(student: StudentListSource): StudentListSource {
  return {
    ...student,
    identityNumber: maskIdentityNumber(student.identityNumber),
  };
}

export function toStudentParentProfile(student: StudentParentProfileSource): StudentParentProfileSource {
  return {
    ...student,
    identityNumber: maskIdentityNumber(student.identityNumber),
  };
}
