import type { PermissionActor } from '@/domain/auth/permissions';
import { getStudentMistakeBookItems, type StudentMistakeBookRecord } from '@/domain/student/mistake-book';

export function StudentMistakeBookPage({
  actor,
  items,
}: {
  actor: PermissionActor;
  items: readonly StudentMistakeBookRecord[];
}) {
  const visibleItems = getStudentMistakeBookItems({ actor, items });

  return (
    <main aria-label="学生错题本页" className="min-h-screen overflow-x-hidden bg-background px-4 py-6 text-foreground sm:px-6 md:px-10">
      <section className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
        <div className="rounded-[2rem] bg-surface p-5 shadow-neu-sm sm:p-6">
          <p className="text-sm font-semibold text-muted">Student Mistake Book</p>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">学生端错题本</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">查看自己的错题、订正状态和 AI 讲解入口，其他同学的错题不会显示。</p>
          <p className="mt-5 inline-flex rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">我的错题 {visibleItems.length} 条</p>
        </div>

        {visibleItems.length === 0 ? (
          <p className="rounded-3xl bg-surface p-6 text-sm text-muted shadow-neu-sm">暂无待查看错题</p>
        ) : (
          <div className="space-y-4">
            {visibleItems.map((item) => (
              <article key={item.id} className="rounded-[2rem] bg-surface p-5 shadow-neu-sm sm:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted">{item.subject} · {item.createdDate}</p>
                    <h2 className="mt-1 text-2xl font-bold">{item.knowledgePoint}</h2>
                  </div>
                  <span className="w-fit rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">{item.correctionStatusLabel}</span>
                </div>
                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="rounded-2xl bg-surfaceAlt px-4 py-3">
                    <dt className="font-semibold text-muted">错因</dt>
                    <dd className="mt-1">{item.mistakeReason}</dd>
                  </div>
                  <div className="rounded-2xl bg-surfaceAlt px-4 py-3">
                    <dt className="font-semibold text-muted">题目</dt>
                    <dd className="mt-1">{item.questionText ?? '暂无题干快照'}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" type="button">
                    {item.aiExplanationEntryLabel}
                  </button>
                  <button className="min-h-11 rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" type="button">
                    {item.similarPracticeEntryLabel}
                  </button>
                  <button className="min-h-11 rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" type="button">
                    {item.photoQuestionEntryLabel}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
