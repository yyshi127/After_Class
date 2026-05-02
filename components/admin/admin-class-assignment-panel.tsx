import {
  getAssignableClasses,
  getAssignableStudentsForClass,
  getAssignableTeachersForClass,
  type AssignableClass,
  type AssignableStudent,
  type AssignableTeacher,
} from '@/domain/admin/class-assignment';
import type { PermissionActor } from '@/domain/auth/permissions';

type AdminClassAssignmentPanelProps = {
  actor: PermissionActor;
  classes: readonly AssignableClass[];
  teachers: readonly AssignableTeacher[];
  students: readonly AssignableStudent[];
};

export function AdminClassAssignmentPanel({ actor, classes, teachers, students }: AdminClassAssignmentPanelProps) {
  const assignableClasses = getAssignableClasses(actor, classes, students);
  const selectedClass = assignableClasses[0] ?? null;
  const assignableTeachers = selectedClass ? getAssignableTeachersForClass(selectedClass, teachers) : [];
  const assignableStudents = selectedClass ? getAssignableStudentsForClass(selectedClass, students) : [];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Assignments</p>
        <h2 className="font-heading text-3xl font-bold">班级分配老师和学生</h2>
        <p className="mt-2 text-sm text-muted">仅允许在授权校区范围内分配老师和学生。</p>
      </div>

      <div className="grid gap-5 rounded-3xl bg-surface p-6 shadow-neu-sm lg:grid-cols-3">
        <label className="space-y-2 text-sm font-semibold">
          <span>选择班级</span>
          <select aria-label="选择班级" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 py-2">
            {assignableClasses.map((custodyClass) => (
              <option key={custodyClass.id} value={custodyClass.id}>
                {custodyClass.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold">
          <span>选择老师</span>
          <select aria-label="选择老师" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 py-2">
            {assignableTeachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold">
          <span>选择学生</span>
          <select aria-label="选择学生" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 py-2">
            {assignableStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedClass ? (
        <p className="rounded-3xl bg-primary/10 p-5 text-sm font-semibold text-primary shadow-neu-sm">{selectedClass.capacityHint}</p>
      ) : (
        <p className="rounded-3xl bg-surface p-5 text-sm text-muted shadow-neu-sm">暂无可分配班级</p>
      )}
    </section>
  );
}
