export type GuardianBindingStudent = {
  id: string;
  name: string;
  campusId: string;
};

export type GuardianBindingInput = {
  guardianName: string;
  phone: string;
  relationship: string;
  studentId: string;
  notifyEnabled: boolean;
};

export type GuardianBindingData = GuardianBindingInput;
export type GuardianBindingErrors = Partial<Record<keyof GuardianBindingInput, string>>;

export type GuardianBindingValidationResult =
  | { success: true; data: GuardianBindingData; errors: GuardianBindingErrors }
  | { success: false; data: null; errors: GuardianBindingErrors };

export function validateGuardianBindingInput(
  input: GuardianBindingInput,
  students: readonly GuardianBindingStudent[],
): GuardianBindingValidationResult {
  const errors: GuardianBindingErrors = {};
  const guardianName = input.guardianName.trim();
  const phone = input.phone.trim();
  const relationship = input.relationship.trim();

  if (guardianName.length === 0) errors.guardianName = '家长姓名必填';
  if (phone.length === 0) errors.phone = '手机号必填';
  if (relationship.length === 0) errors.relationship = '与学生关系必填';
  if (input.studentId.length === 0) {
    errors.studentId = '绑定学生必选';
  } else if (!students.some((student) => student.id === input.studentId)) {
    errors.studentId = '绑定学生不存在或无权绑定';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, data: null, errors };
  }

  return {
    success: true,
    data: {
      guardianName,
      phone,
      relationship,
      studentId: input.studentId,
      notifyEnabled: input.notifyEnabled,
    },
    errors: {},
  };
}

export function canGuardianAccessBoundStudent(
  guardian: { guardianStudentIds: readonly string[] },
  studentId: string,
): boolean {
  return guardian.guardianStudentIds.includes(studentId);
}
