export type ClassFormCampus = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
};

export type ClassFormInput = {
  campusId: string;
  grade: string;
  name: string;
  capacity: number;
};

export type ClassFormValidationResult =
  | { success: true; data: ClassFormInput }
  | { success: false; errors: Partial<Record<keyof ClassFormInput, string>> };

export function validateClassFormInput(input: ClassFormInput, campuses: readonly ClassFormCampus[]): ClassFormValidationResult {
  const errors: Partial<Record<keyof ClassFormInput, string>> = {};
  const campus = campuses.find((item) => item.id === input.campusId);

  if (!input.campusId || !campus) {
    errors.campusId = '班级必须属于一个校区';
  } else if (campus.status !== 'ACTIVE') {
    errors.campusId = '停用校区不能新建班级';
  }

  if (!input.grade.trim()) {
    errors.grade = '年级必填';
  }

  if (!input.name.trim()) {
    errors.name = '班级名称必填';
  }

  if (!Number.isInteger(input.capacity) || input.capacity <= 0) {
    errors.capacity = '容量必须大于 0';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: input };
}
