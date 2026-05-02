import type { ParentVisibleHomeworkFeedback } from '@/domain/feedback/homework-feedback-publishing';

export function ParentHomeworkFeedbackCard({
  feedback,
}: {
  feedback: ParentVisibleHomeworkFeedback | null;
}) {
  if (!feedback) {
    return (
      <section className="rounded-neu bg-surface p-6 shadow-neu-sm">
        <p className="text-sm font-semibold text-muted">Homework Feedback</p>
        <h2 className="mt-2 text-xl font-bold">今日作业反馈</h2>
        <p className="mt-3 text-sm text-muted">老师发布后，家长可查看作业原图、批改图和三类点评。</p>
      </section>
    );
  }

  return (
    <section className="rounded-neu bg-surface p-6 shadow-neu-sm" aria-labelledby="parent-homework-feedback-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Homework Feedback</p>
          <h2 id="parent-homework-feedback-heading" className="mt-2 text-xl font-bold">
            今日作业反馈
          </h2>
          <p className="mt-2 text-sm text-muted">
            {feedback.subject} · 发布于 {new Date(feedback.publishedAt).toLocaleString('zh-CN', { hour12: false })}
          </p>
        </div>
        <span className="rounded-full bg-mint/50 px-4 py-2 text-sm font-semibold">老师已确认发布</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
          <p className="text-sm font-bold">作业原图</p>
          <p className="mt-2 text-sm text-muted">作业原图：{feedback.originalImageFileId}</p>
        </div>
        <div className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
          <p className="text-sm font-bold">老师批改图</p>
          <p className="mt-2 text-sm text-muted">批改图：{feedback.correctedImageFileId}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <FeedbackItem title="行为表现" content={feedback.behaviorPerformance ?? '老师暂未填写行为表现补充。'} />
        <FeedbackItem title="作业完成" content={feedback.homeworkCompletion} />
        <FeedbackItem title="知识掌握" content={feedback.knowledgeMastery ?? '老师暂未填写知识掌握补充。'} />
      </div>
    </section>
  );
}

function FeedbackItem({ title, content }: { title: string; content: string }) {
  return (
    <article className="rounded-2xl bg-background p-4 shadow-neu-sm">
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{content}</p>
    </article>
  );
}
