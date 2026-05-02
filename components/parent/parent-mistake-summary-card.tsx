import type { ParentVisibleMistakeSummary } from '@/domain/parent/mistake-summary';

export function ParentMistakeSummaryCard({ summaries }: { summaries: readonly ParentVisibleMistakeSummary[] }) {
  if (summaries.length === 0) {
    return (
      <section className="rounded-neu bg-surface p-6 shadow-neu-sm">
        <p className="text-sm font-semibold text-muted">Mistake Book</p>
        <h2 className="mt-2 text-xl font-bold">孩子错题摘要</h2>
        <p className="mt-3 text-sm text-muted">老师发布并确认错题后，家长可查看孩子错题摘要和订正状态。</p>
      </section>
    );
  }

  return (
    <section className="rounded-neu bg-surface p-6 shadow-neu-sm" aria-labelledby="parent-mistake-summary-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Mistake Book</p>
          <h2 id="parent-mistake-summary-heading" className="mt-2 text-xl font-bold">
            孩子错题摘要
          </h2>
          <p className="mt-2 text-sm text-muted">仅展示孩子可读的错题摘要和订正状态，内部 AI 评估细节不展示。</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {summaries.map((summary) => (
          <article key={summary.id} className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold">{summary.studentName}</h3>
              <span className="rounded-full bg-mint/50 px-3 py-1 text-xs font-semibold">{summary.correctionStatusLabel}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{summary.subject}</p>
            <p className="mt-2 text-sm font-semibold">{summary.knowledgePoint}</p>
            <p className="mt-2 text-sm text-muted">错因：{summary.mistakeReason}</p>
            <p className="mt-2 text-xs text-muted">收录时间：{new Date(summary.createdAt).toLocaleString('zh-CN', { hour12: false })}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
