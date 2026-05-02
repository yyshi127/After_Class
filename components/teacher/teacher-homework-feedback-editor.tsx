import type { FeedbackDraft } from '@/domain/feedback/feedback';
import { canPublishFeedbackDraft } from '@/domain/feedback/feedback';

export function TeacherHomeworkFeedbackEditor({ draft }: { draft: FeedbackDraft }) {
  const publishState = canPublishFeedbackDraft(draft);

  return (
    <section className="rounded-[2rem] bg-surface p-5 shadow-neu-sm" aria-labelledby="homework-feedback-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Daily Feedback Draft</p>
          <h2 id="homework-feedback-heading" className="text-xl font-bold">
            三类今日点评
          </h2>
          <p className="mt-2 text-sm text-muted">作业批改记录：{draft.homeworkReviewId}</p>
        </div>
        <span className="rounded-full bg-lavender/50 px-4 py-2 text-sm font-semibold">
          AI 草稿可编辑，发布前必须老师确认
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="block rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
          <span className="text-sm font-bold">行为表现</span>
          <textarea
            className="mt-3 min-h-32 w-full rounded-2xl border border-transparent bg-background p-3 text-sm outline-none focus:border-lavender"
            defaultValue={draft.behaviorPerformance ?? ''}
            name="behaviorPerformance"
          />
        </label>

        <label className="block rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
          <span className="text-sm font-bold">作业完成</span>
          <textarea
            className="mt-3 min-h-32 w-full rounded-2xl border border-transparent bg-background p-3 text-sm outline-none focus:border-lavender"
            defaultValue={draft.homeworkCompletion}
            name="homeworkCompletion"
          />
        </label>

        <label className="block rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
          <span className="text-sm font-bold">知识掌握</span>
          <textarea
            className="mt-3 min-h-32 w-full rounded-2xl border border-transparent bg-background p-3 text-sm outline-none focus:border-lavender"
            defaultValue={draft.knowledgeMastery ?? ''}
            name="knowledgeMastery"
          />
        </label>
      </div>

      {!publishState.ok ? (
        <p className="mt-4 rounded-2xl bg-peach/50 px-4 py-3 text-sm font-semibold">{publishState.errors[0]}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          className="min-h-11 rounded-full bg-mint px-5 py-2 text-sm font-bold shadow-neu-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!publishState.ok}
          type="button"
        >
          发布给家长
        </button>
        <p className="text-sm text-muted">老师确认发布后，家长端仅能查看已发布版本。</p>
        <a className="rounded-full bg-lavender px-5 py-2 text-sm font-bold shadow-neu-sm" href="/parent/homework-feedback">
          查看家长端发布结果
        </a>
        <a className="rounded-full bg-surfaceAlt px-5 py-2 text-sm font-bold shadow-neu-sm" href="/teacher/mistake-book">
          查看自动收录错题
        </a>
      </div>

      <p className="mt-4 rounded-2xl bg-surfaceAlt px-4 py-3 text-sm font-semibold">发布后将自动收录错题：两位数乘法</p>
    </section>
  );
}
