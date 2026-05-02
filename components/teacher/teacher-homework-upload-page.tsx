import type { PermissionActor } from '@/domain/auth/permissions';
import { getTeacherHomeworkUploadOptions, type TeacherHomeworkUploadStudent } from '@/domain/teacher/homework-upload';

export function TeacherHomeworkUploadPage({
  actor,
  students,
}: {
  actor: PermissionActor;
  students: readonly TeacherHomeworkUploadStudent[];
}) {
  const options = getTeacherHomeworkUploadOptions({ actor, students });

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[2rem] bg-surface p-6 shadow-neu-sm">
          <p className="text-sm font-semibold text-muted">Homework Review</p>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">上传作业</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">按班级选择负责学生并上传作业原图，系统只生成私有文件记录和未发布批改草稿。</p>
        </div>

        <div className="rounded-[2rem] bg-surface p-6 shadow-neu-sm">
          <form className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold" htmlFor="homework-class">
              选择班级
              <select id="homework-class" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                {options.classes.map((custodyClass) => (
                  <option key={custodyClass.id}>{custodyClass.name}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-semibold" htmlFor="homework-student">
              选择学生
              <select id="homework-student" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                {options.students.map((student) => (
                  <option key={student.id}>{student.studentName}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-semibold" htmlFor="homework-subject">
              作业学科
              <input id="homework-subject" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset" defaultValue="数学" />
            </label>

            <label className="space-y-2 text-sm font-semibold" htmlFor="homework-image">
              作业图片
              <input id="homework-image" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 py-2 text-sm shadow-neu-inset" accept="image/*" type="file" />
            </label>
          </form>

          <div className="mt-5 rounded-2xl bg-surfaceAlt px-4 py-3 text-sm font-semibold text-muted">
            <p>可上传学生：{options.students.map((student) => student.studentName).join('、') || '暂无'}</p>
            <p className="mt-2">图片将存入私有文件服务，家长需授权后访问。</p>
          </div>
          <p className="mt-3 rounded-2xl bg-peach/40 px-4 py-3 text-sm font-semibold">老师不能给非负责学生上传作业</p>
        </div>
      </section>
    </main>
  );
}
