import type { AiMistakeSuggestionArea } from '@/domain/homework/ai-mistake-suggestion';

export function TeacherMistakeAreaReviewPanel({
  reviewId,
  aiSuggestedAreas,
}: {
  reviewId: string;
  aiSuggestedAreas: AiMistakeSuggestionArea[];
}) {
  return (
    <section className="rounded-[2rem] bg-surface p-5 shadow-neu-sm" aria-labelledby="mistake-area-review-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">AI Suggestion Review</p>
          <h2 id="mistake-area-review-heading" className="text-xl font-bold">
            AI 圈错确认
          </h2>
          <p className="mt-2 text-sm text-muted">作业批改记录：{reviewId}</p>
        </div>
        <span className="rounded-full bg-peach/50 px-4 py-2 text-sm font-semibold">未确认 AI 区域不会发布</span>
      </div>

      <div className="mt-4 rounded-2xl bg-mint/40 px-4 py-3 text-sm font-semibold text-foreground">
        <p>确认区域将进入批改图和错题本候选</p>
        <p className="mt-1 text-muted">忽略或未确认区域仅保留为 AI 草稿审阅痕迹。</p>
      </div>

      <div className="mt-5 space-y-3">
        {aiSuggestedAreas.map((area) => (
          <article key={area.id} className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold">{area.subject} · {area.mistakeReason}</p>
                <p className="mt-1 text-sm text-muted">
                  坐标：x{area.originalBox.x} / y{area.originalBox.y} / w{area.originalBox.width} / h
                  {area.originalBox.height}
                </p>
                <p className="mt-1 text-sm text-muted">置信度：{Math.round(area.confidence * 100)}% · {area.confirmationHint}</p>
              </div>
              <span className="rounded-full bg-lavender/50 px-3 py-1 text-xs font-semibold">
                {area.confidenceLevel}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="min-h-11 rounded-full bg-mint px-4 py-2 text-sm font-bold shadow-neu-sm" type="button">
                确认区域
              </button>
              <button className="min-h-11 rounded-full bg-lavender px-4 py-2 text-sm font-bold shadow-neu-sm" type="button">
                修改区域
              </button>
              <button className="min-h-11 rounded-full bg-peach px-4 py-2 text-sm font-bold shadow-neu-sm" type="button">
                忽略区域
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
