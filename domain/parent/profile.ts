import { canAccessStudent, type PermissionActor } from '@/domain/auth/permissions';
import type { ParentVisibleServiceValidity } from '@/domain/billing/service-validity';
import type { ServiceType } from '@/domain/shared/enums';
import { maskIdentityNumber } from '@/domain/students/identity';

export type ParentProfileStudentSource = {
  id: string;
  name: string;
  identityNumber: string | null;
  school: string;
  grade: string;
  campusId: string;
  classId: string | null;
  serviceType: ServiceType;
  safetyNote?: string | null;
};

export type ParentProfileGuardianBinding = {
  guardianUserId: string;
  studentId: string;
  relationship: string;
  phone: string;
  notifyEnabled: boolean;
};

export type ParentLeaveRecord = {
  id: string;
  studentId: string;
  leaveDate: string;
  serviceType: ServiceType;
  reason: string;
  status: '待确认' | '已确认' | '已取消';
};

export type ParentProfileStudent = {
  id: string;
  name: string;
  identityNumberMasked: string;
  school: string;
  grade: string;
  serviceType: ServiceType;
  relationship: string;
  guardianPhone: string;
  notifyEnabled: boolean;
  safetyNote: string;
  serviceValidityLabel: string;
  leaveRecords: ParentLeaveRecord[];
};

export function getParentProfileStudents({
  guardian,
  students,
  guardianBindings,
  serviceValidities,
  leaveRecords,
}: {
  guardian: PermissionActor;
  students: readonly ParentProfileStudentSource[];
  guardianBindings: readonly ParentProfileGuardianBinding[];
  serviceValidities: readonly ParentVisibleServiceValidity[];
  leaveRecords: readonly ParentLeaveRecord[];
}): ParentProfileStudent[] {
  return students
    .filter((student) => canAccessStudent(guardian, student))
    .map((student) => {
      const binding = guardianBindings.find(
        (item) => item.guardianUserId === guardian.id && item.studentId === student.id,
      );
      const validity = serviceValidities.find((item) => item.studentId === student.id);

      return {
        id: student.id,
        name: student.name,
        identityNumberMasked: maskIdentityNumber(student.identityNumber) ?? '未登记',
        school: student.school,
        grade: student.grade,
        serviceType: student.serviceType,
        relationship: binding?.relationship ?? '未登记',
        guardianPhone: binding?.phone ?? '未登记',
        notifyEnabled: binding?.notifyEnabled ?? false,
        safetyNote: student.safetyNote ?? '暂无特殊安全备注',
        serviceValidityLabel: validity ? `有效至 ${validity.validUntil.toISOString().slice(0, 10)}` : '暂无服务有效期记录',
        leaveRecords: leaveRecords.filter((record) => record.studentId === student.id),
      };
    });
}
