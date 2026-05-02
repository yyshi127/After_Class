import type { PracticeSheetDraft } from '@/domain/mistake-book/practice-sheet-draft';

export function TeacherPracticeSheetDraftPage({
  draft,
  emptyDraft,
}: {
  draft: PracticeSheetDraft;
  emptyDraft?: PracticeSheetDraft;
}) {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-8 text-[var(--foreground)]">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
          <p className="text-sm font-semibold text-[var(--primary)]">M5-06 · 错题本练习单</p>
          <h1 className="mt-2 text-3xl font-bold">老师勾选同类题</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            AI 生成同类题后，老师必须人工勾选、编辑题干并保存草稿；未勾选题目时不能进入 Word 练习单生成。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard label="学生" value={draft.studentName} />
          <InfoCard label="班级" value={draft.className} />
          <InfoCard label="学科" value={draft.subject} />
        </section>

        <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">同类题选择与编辑</h2>
              <p className="mt-1 text-sm text-muted">已保存 {draft.questions.length} 道老师确认题。</p>
            </div>
            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-medium text-[var(--primary)]">练习单草稿已保存</span>
          </div>

          <div className="mt-5 space-y-4">
            {draft.questions.map((question, index) => (
              <article key={question.id} className="rounded-2xl border border-[var(--border)] bg-white/70 p-4">
                <label className="flex items-center gap-3 text-sm font-medium">
                  <input aria-label={`勾选同类题：同类题${index + 1}`} checked readOnly type="checkbox" />
                  <span>同类题{index + 1}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">老师已确认</span>
                </label>
                <p className="mt-3 text-sm text-muted">知识点：{question.knowledgePoint}</p>
                <textarea
                  aria-label={`编辑同类题：同类题${index + 1}`}
                  className="mt-3 min-h-24 w-full rounded-2xl border border-[var(--border)] bg-white p-3 text-sm"
                  defaultValue={question.prompt}
                />
              </article>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!draft.canGenerateWord}
              type="button"
            >
              生成 Word 练习单
            </button>
            <p className="text-sm text-muted">Word 文件生成在 M5-07 接入，本页只保存老师确认后的练习单草稿。</p>
          </div>
          {draft.blockedReason ? <p className="mt-3 text-sm font-medium text-amber-700">{draft.blockedReason}</p> : null}
        </section>

        {emptyDraft ? (
          <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h2 className="text-lg font-semibold">未勾选保护</h2>
            <p className="mt-2 text-sm">{emptyDraft.blockedReason}</p>
            <button className="mt-4 rounded-full bg-slate-300 px-4 py-2 text-sm font-semibold text-white" disabled type="button">
              未勾选不能生成 Word
            </button>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
