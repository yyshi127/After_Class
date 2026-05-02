import { canAccessCampus, type PermissionActor } from '@/domain/auth/permissions';

export type AssignableClass = {
  id: string;
  name: string;
  campusId: string;
  campusName: string;
  capacity: number;
};

export type AssignableTeacher = {
  id: string;
  name: string;
  campusIds: readonly string[];
};

export type AssignableStudent = {
  id: string;
  name: string;
  campusId: string;
  classId?: string | null;
};

export type AssignableClassItem = AssignableClass & {
  assignedStudentCount: number;
  capacityHint: string;
};

export function canAssignWithinCampusScope(
  actor: PermissionActor,
  custodyClass: { campusId: string },
  teacher: { campusIds: readonly string[] },
  students: readonly { campusId: string }[],
): boolean {
  return (
    canAccessCampus(actor, custodyClass.campusId) &&
    teacher.campusIds.includes(custodyClass.campusId) &&
    students.every((student) => student.campusId === custodyClass.campusId)
  );
}

export function getAssignableClasses(
  actor: PermissionActor,
  classes: readonly AssignableClass[],
  students: readonly AssignableStudent[],
): AssignableClassItem[] {
  return classes
    .filter((custodyClass) => canAccessCampus(actor, custodyClass.campusId))
    .map((custodyClass) => {
      const assignedStudentCount = students.filter((student) => student.classId === custodyClass.id).length;
      const capacityStatus = assignedStudentCount >= custodyClass.capacity ? '已满员' : '可继续分配';

      return {
        ...custodyClass,
        assignedStudentCount,
        capacityHint: `已分配 ${assignedStudentCount}/${custodyClass.capacity}，${capacityStatus}`,
      };
    });
}

export function getAssignableTeachersForClass(
  custodyClass: { campusId: string },
  teachers: readonly AssignableTeacher[],
): AssignableTeacher[] {
  return teachers.filter((teacher) => teacher.campusIds.includes(custodyClass.campusId));
}

export function getAssignableStudentsForClass(
  custodyClass: { campusId: string },
  students: readonly AssignableStudent[],
): AssignableStudent[] {
  return students.filter((student) => student.campusId === custodyClass.campusId);
}
