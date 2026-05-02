import type { PermissionActor } from '@/domain/auth/permissions';
import {
  getTeacherMistakeBookFilterOptions,
  getTeacherMistakeBookItems,
  type TeacherMistakeBookRecord,
} from '@/domain/teacher/mistake-book';

export function TeacherMistakeBookPage({
  actor,
  items,
}: {
  actor: PermissionActor;
  items: readonly TeacherMistakeBookRecord[];
}) {
  const visibleItems = getTeacherMistakeBookItems({ actor, items });
  const filterOptions = getTeacherMistakeBookFilterOptions(visibleItems);

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-surface p-6 shadow-neu-sm">
          <p className="text-sm font-semibold text-muted">Mistake Book</p>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">老师端错题本</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">按负责学生、学科、知识点和日期查看已发布作业自动收录的错题，后续可生成同类题练习单。</p>
          <p className="mt-5 inline-flex rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">可见错题 {visibleItems.length} 条</p>
        </div>

        <div className="space-y-5 rounded-[2rem] bg-surface p-6 shadow-neu-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-muted">Teacher Scope</p>
              <h2 className="font-heading text-3xl font-bold">错题筛选</h2>
            </div>
            <p className="rounded-full bg-surfaceAlt px-4 py-2 text-sm font-semibold text-muted">仅显示负责学生错题</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 text-sm font-semibold" htmlFor="teacher-mistake-student-filter">
              学生筛选
              <select id="teacher-mistake-student-filter" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                <option>全部学生</option>
                {filterOptions.students.map((student) => (
                  <option key={student.id}>{student.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold" htmlFor="teacher-mistake-subject-filter">
              学科筛选
              <select id="teacher-mistake-subject-filter" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                <option>全部学科</option>
                {filterOptions.subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold" htmlFor="teacher-mistake-knowledge-filter">
              知识点筛选
              <select id="teacher-mistake-knowledge-filter" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                <option>全部知识点</option>
                {filterOptions.knowledgePoints.map((knowledgePoint) => (
                  <option key={knowledgePoint}>{knowledgePoint}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold" htmlFor="teacher-mistake-date-filter">
              日期筛选
              <select id="teacher-mistake-date-filter" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                <option>全部日期</option>
                {filterOptions.createdDates.map((createdDate) => (
                  <option key={createdDate}>{createdDate}</option>
                ))}
              </select>
            </label>
          </div>

          {visibleItems.length === 0 ? (
            <p className="rounded-3xl bg-surfaceAlt p-6 text-sm text-muted">暂无负责学生错题</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleItems.map((item) => (
                <article key={item.id} className="rounded-3xl bg-background p-5 shadow-neu-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{item.studentName}</h3>
                      <p className="mt-1 text-sm text-muted">{item.campusName} · {item.className} · {item.subject}</p>
                    </div>
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">{item.correctionStatusLabel}</span>
                  </div>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div className="rounded-2xl bg-surfaceAlt px-4 py-3">
                      <dt className="font-semibold text-muted">知识点</dt>
                      <dd className="mt-1 font-semibold">{item.knowledgePoint}</dd>
                    </div>
                    <div className="rounded-2xl bg-surfaceAlt px-4 py-3">
                      <dt className="font-semibold text-muted">错因</dt>
                      <dd className="mt-1">{item.mistakeReason}</dd>
                    </div>
                    <div className="rounded-2xl bg-surfaceAlt px-4 py-3">
                      <dt className="font-semibold text-muted">题目快照</dt>
                      <dd className="mt-1">{item.questionText ?? '暂无题干快照'}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs font-semibold text-muted">收录日期：{item.createdDate}</p>
                  <a className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-neu-sm" href="/teacher/practice-sheet">
                    生成同类题练习单
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
