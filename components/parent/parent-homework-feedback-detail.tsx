import type { ParentHomeworkFeedbackDetail as ParentHomeworkFeedbackDetailData } from '@/domain/parent/homework-feedback-detail';

export function ParentHomeworkFeedbackDetail({
  detail,
}: {
  detail: ParentHomeworkFeedbackDetailData | null;
}) {
  if (!detail) {
    return (
      <section aria-label="家长作业详情" className="rounded-neu bg-surface p-5 shadow-neu-sm sm:p-6">
        <p className="text-sm font-semibold text-muted">Homework Detail</p>
        <h1 className="mt-2 font-heading text-2xl font-bold">作业与考勤详情</h1>
        <p className="mt-3 text-sm text-muted">暂无可查看的已发布作业反馈。</p>
      </section>
    );
  }

  return (
    <section
      aria-label="家长作业详情"
      aria-labelledby="parent-homework-detail-heading"
      className="rounded-neu bg-surface p-5 shadow-neu-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Homework & Attendance Detail</p>
          <h1 id="parent-homework-detail-heading" className="mt-2 font-heading text-2xl font-bold">
            作业与考勤详情
          </h1>
          <p className="mt-2 text-sm text-muted">
            {detail.studentName} · {detail.subject}
          </p>
        </div>
        <span className="rounded-full bg-mint/50 px-4 py-2 text-sm font-semibold">家长可见版本</span>
        <span className="rounded-full bg-lavender/50 px-4 py-2 text-sm font-semibold">发布状态：老师已确认发布</span>
      </div>

      <div aria-label="作业图片凭证" className="mt-5 grid gap-4 md:grid-cols-2" role="region">
        <InfoBlock title="作业原图" content={`作业原图：${detail.originalImageFileId}`} />
        <InfoBlock title="老师批改图" content={`批改图：${detail.correctedImageFileId}`} />
      </div>

      <div aria-label="三类学习反馈" className="mt-5 grid gap-4 md:grid-cols-3" role="region">
        <InfoBlock title="行为表现" content={detail.feedback.behaviorPerformance ?? '老师暂未填写行为表现补充。'} />
        <InfoBlock title="作业完成" content={detail.feedback.homeworkCompletion} />
        <InfoBlock title="知识掌握" content={detail.feedback.knowledgeMastery ?? '老师暂未填写知识掌握补充。'} />
      </div>

      <div aria-label="到托离校时间线" className="mt-6 rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset sm:p-5" role="region">
        <h2 className="text-lg font-bold">到托/离校时间线</h2>
        <div className="mt-4 grid gap-3">
          {detail.attendanceTimeline.map((record) => (
            <article key={record.id} className="rounded-2xl bg-background p-4 shadow-neu-sm">
              <p className="font-semibold">
                {record.status} · {new Date(record.checkedAt).toLocaleString('zh-CN', { hour12: false })}
              </p>
              <p className="mt-1 text-sm text-muted">托管类型：{record.serviceType}</p>
              {record.photoFileId ? <p className="mt-1 break-all text-sm text-muted">签到照片：{record.photoFileId}</p> : null}
            </article>
          ))}
        </div>
      </div>

      <div aria-label="家长错题摘要" className="mt-6 rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset sm:p-5" role="region">
        <h2 className="text-lg font-bold">错题摘要</h2>
        {detail.mistakeSummaries.length === 0 ? (
          <p className="mt-3 text-sm text-muted">本次作业暂无老师确认错题。</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {detail.mistakeSummaries.map((mistake) => (
              <article key={mistake.id} className="rounded-2xl bg-background p-4 shadow-neu-sm">
                <p className="font-semibold">{mistake.knowledgePoint}</p>
                <p className="mt-1 text-sm text-muted">错因：{mistake.mistakeReason}</p>
                <p className="mt-1 text-sm text-muted">订正状态：{mistake.correctionStatus}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return (
    <article className="rounded-2xl bg-background p-4 shadow-neu-sm">
      <h2 className="text-sm font-bold">{title}</h2>
      <p className="mt-2 break-all text-sm leading-6 text-muted">{content}</p>
    </article>
  );
}
