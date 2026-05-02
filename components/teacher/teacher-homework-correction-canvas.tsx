import type { HomeworkCorrectionArea } from '@/domain/homework/correction-canvas';

export type TeacherHomeworkCorrectionReview = {
  id: string;
  studentName: string;
  subject: string;
  originalImageUrl: string;
  originalImageFileId: string;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  areas: HomeworkCorrectionArea[];
};

export function TeacherHomeworkCorrectionCanvas({ review }: { review: TeacherHomeworkCorrectionReview }) {
  return (
    <section aria-label="作业图片与圈错区" className="bg-background text-foreground">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[2rem] bg-surface p-6 shadow-neu-sm">
          <p className="text-sm font-semibold text-muted">Homework Correction</p>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">作业批改画布</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            展示作业原图并以原图尺寸保存批改区域坐标，避免缩放后错题区域偏移。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0 rounded-[2rem] bg-surface p-5 shadow-neu-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{review.studentName} · {review.subject}</h2>
                <p className="text-sm text-muted">原图文件：{review.originalImageFileId}</p>
              </div>
              <span className="rounded-full bg-mint/50 px-4 py-2 text-sm font-semibold">图片比例和坐标保存一致</span>
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-background p-3 shadow-neu-inset">
              {/* eslint-disable-next-line @next/next/no-img-element -- MVP uses private homework file URLs that are not yet wired through next/image loaders. */}
              <img
                alt={`${review.studentName}的${review.subject}作业原图`}
                className="mx-auto max-h-[34rem] w-auto rounded-2xl object-contain"
                src={review.originalImageUrl}
              />
              <div className="mt-3 text-sm font-semibold text-muted">原图尺寸：{review.imageNaturalWidth} × {review.imageNaturalHeight}</div>
            </div>
          </div>

          <aside className="min-w-0 rounded-[2rem] bg-surface p-5 shadow-neu-sm">
            <h2 className="text-xl font-bold">批改区域</h2>
            <p className="mt-2 text-sm text-muted">老师可在画布上框选错题区域，MVP 先保存草稿坐标。</p>
            <div className="mt-5 space-y-3">
              {review.areas.map((area) => (
                <article key={area.id} className="rounded-2xl bg-surfaceAlt p-4 text-sm shadow-neu-inset">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold">{area.mistakeType}</p>
                    <span className="rounded-full bg-peach/50 px-3 py-1 text-xs font-semibold">{area.status}</span>
                  </div>
                  <p className="mt-2 text-muted">{area.note}</p>
                  <p className="mt-2 font-semibold">
                    区域坐标：x{area.originalBox.x} / y{area.originalBox.y} / w{area.originalBox.width} / h{area.originalBox.height}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </section>
  );
}
