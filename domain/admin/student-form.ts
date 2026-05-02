import { assertCampusCanCreateRecords, campusSupportsServiceType } from '@/domain/campus/campus';
import { isServiceType, type ServiceType, type StudentStatus } from '@/domain/shared/enums';

export type StudentFormCampus = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  supportedServiceTypes: readonly ServiceType[];
};

export type StudentFormClass = {
  id: string;
  campusId: string;
  name: string;
};

export type StudentFormInput = {
  name: string;
  identityNumber: string;
  school: string;
  grade: string;
  campusId: string;
  classId: string;
  serviceType: string;
  status: StudentStatus;
  safetyNote: string;
};

export type StudentFormData = Omit<StudentFormInput, 'serviceType'> & {
  serviceType: ServiceType;
};

export type StudentFormErrors = Partial<Record<keyof StudentFormInput, string>>;

export type StudentFormValidationResult =
  | { success: true; data: StudentFormData; errors: StudentFormErrors }
  | { success: false; data: null; errors: StudentFormErrors };

export function validateStudentFormInput(
  input: StudentFormInput,
  campuses: readonly StudentFormCampus[],
  classes: readonly StudentFormClass[],
): StudentFormValidationResult {
  const errors: StudentFormErrors = {};
  const name = input.name.trim();
  const identityNumber = input.identityNumber.trim();
  const school = input.school.trim();
  const grade = input.grade.trim();
  const safetyNote = input.safetyNote.trim();
  const campus = campuses.find((item) => item.id === input.campusId);
  const custodyClass = classes.find((item) => item.id === input.classId);

  if (name.length === 0) errors.name = '学生姓名必填';
  if (school.length === 0) errors.school = '就读学校必填';
  if (grade.length === 0) errors.grade = '年级必填';
  if (input.campusId.length === 0) errors.campusId = '校区必选';
  if (input.classId.length === 0) errors.classId = '班级必选';
  if (input.serviceType.length === 0) {
    errors.serviceType = '托管类型必选';
  } else if (!isServiceType(input.serviceType)) {
    errors.serviceType = '托管类型必须是四种固定托管类型之一';
  }

  if (campus) {
    try {
      assertCampusCanCreateRecords(campus);
    } catch (error) {
      errors.campusId = error instanceof Error ? error.message : '停用校区不能新建学生或班级';
    }
  } else if (input.campusId.length > 0) {
    errors.campusId = '校区不存在';
  }

  if (custodyClass && custodyClass.campusId !== input.campusId) {
    errors.classId = '班级必须属于所选校区';
  } else if (!custodyClass && input.classId.length > 0) {
    errors.classId = '班级不存在';
  }

  if (campus && isServiceType(input.serviceType) && !campusSupportsServiceType(campus, input.serviceType)) {
    errors.serviceType = '所选校区不支持该托管类型';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, data: null, errors };
  }

  return {
    success: true,
    data: {
      name,
      identityNumber,
      school,
      grade,
      campusId: input.campusId,
      classId: input.classId,
      serviceType: input.serviceType as ServiceType,
      status: input.status,
      safetyNote,
    },
    errors: {},
  };
}
