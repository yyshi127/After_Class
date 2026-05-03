import { formatStudentTaskStatus, type StudentTodayTaskSummary } from '@/domain/student/today-tasks';

export function StudentTodayTasksPage({ summary }: { summary: StudentTodayTaskSummary }) {
  return (
    <main aria-label="学生今日任务页" className="min-h-screen overflow-x-hidden bg-background px-4 py-6 text-foreground sm:px-6 sm:py-10">
      <section className="mx-auto grid max-w-5xl gap-5 sm:gap-6">
        <div className="rounded-neu bg-surface p-5 shadow-neu sm:p-6">
          <p className="text-sm font-semibold text-muted">Student Today</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">学生端今日任务</h1>
          <p className="mt-3 text-sm leading-6 text-muted">只展示当前学生自己的今日任务、待订正错题和 AI 学习入口。</p>
        </div>

        <section aria-label="今日完成进度" className="rounded-3xl bg-mint/40 p-5 shadow-neu-sm">
          <p className="text-sm font-semibold text-muted">{summary.studentName}</p>
          <h2 className="mt-2 text-2xl font-bold">{summary.progressLabel}</h2>
          <p className="mt-2 text-sm text-muted">{summary.encouragement}</p>
        </section>

        <section aria-label="今日待办任务" className="rounded-3xl bg-surface p-5 shadow-neu-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">今日待办</h2>
            <span className="rounded-full bg-lavender/50 px-3 py-1 text-sm font-semibold">{summary.tasks.length} 项</span>
          </div>
          <div className="mt-4 grid gap-3">
            {summary.tasks.length === 0 ? (
              <p className="rounded-2xl bg-surfaceAlt p-4 text-sm text-muted">今日暂无任务。</p>
            ) : (
              summary.tasks.map((task) => (
                <article key={task.id} className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
                  <p className="text-sm font-semibold text-muted">{task.subject}</p>
                  <h3 className="mt-1 text-lg font-bold">{task.title}</h3>
                  <p className="mt-2 text-sm text-muted">状态：{formatStudentTaskStatus(task.status)}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section aria-label="待订正错题" className="rounded-3xl bg-surface p-5 shadow-neu-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">待订正错题</h2>
            <a className="inline-flex min-h-11 items-center rounded-full bg-surfaceAlt px-4 py-2 text-sm font-semibold" href="/student/mistake-book">
              查看错题本
            </a>
          </div>
          <div className="mt-4 grid gap-3">
            {summary.pendingCorrections.length === 0 ? (
              <p className="rounded-2xl bg-surfaceAlt p-4 text-sm text-muted">暂无待订正错题。</p>
            ) : (
              summary.pendingCorrections.map((mistake) => (
                <article key={mistake.id} className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
                  <p className="text-sm font-semibold text-muted">{mistake.subject}</p>
                  <h3 className="mt-1 text-lg font-bold">{mistake.knowledgePoint}</h3>
                  <p className="mt-2 text-sm text-muted">订正状态：待订正</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section aria-label="AI 学习入口" className="rounded-3xl bg-peach/40 p-5 shadow-neu-sm">
          <h2 className="text-xl font-bold">{summary.aiLearningEntryLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">可以拍照提问、查看错题讲解和生成同类题练习；学习建议仅作辅助。</p>
          <button className="mt-4 min-h-11 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft" type="button">
            拍照提问
          </button>
        </section>
      </section>
    </main>
  );
}
