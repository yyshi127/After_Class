import {
  getAdminHomeworkFeedbackProgress,
  type AdminHomeworkFeedbackProgressRow,
} from '@/domain/admin/homework-feedback-progress';
import type { PermissionActor } from '@/domain/auth/permissions';

type AdminHomeworkFeedbackProgressProps = {
  actor: PermissionActor;
  rows: readonly AdminHomeworkFeedbackProgressRow[];
};

export function AdminHomeworkFeedbackProgress({ actor, rows }: AdminHomeworkFeedbackProgressProps) {
  const progress = getAdminHomeworkFeedbackProgress(actor, rows);

  if (progress.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-muted">Homework Feedback</p>
          <h2 className="font-heading text-3xl font-bold">作业反馈进度</h2>
        </div>
        <p className="rounded-3xl bg-surface p-6 text-sm text-muted shadow-neu-sm">暂无可查看作业反馈进度</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-muted">Homework Feedback</p>
        <h2 className="font-heading text-3xl font-bold">作业反馈进度</h2>
        <p className="mt-2 text-sm text-muted">按校区/班级查看待批改、待发布、已发布进度。</p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-surface shadow-neu-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-surfaceAlt text-muted">
            <tr>
              <th className="px-5 py-4 font-semibold">校区</th>
              <th className="px-5 py-4 font-semibold">班级</th>
              <th className="px-5 py-4 font-semibold">托管类型</th>
              <th className="px-5 py-4 font-semibold">待批改</th>
              <th className="px-5 py-4 font-semibold">待发布</th>
              <th className="px-5 py-4 font-semibold">已发布</th>
              <th className="px-5 py-4 font-semibold">发布率</th>
            </tr>
          </thead>
          <tbody>
            {progress.map((item) => (
              <tr key={`${item.campusId}-${item.classId}-${item.serviceType}`} className="border-t border-white/70">
                <td className="px-5 py-4">{item.campusName}</td>
                <td className="px-5 py-4 font-semibold">{item.className}</td>
                <td className="px-5 py-4">{item.serviceType}</td>
                <td className="px-5 py-4">待批改 {item.pendingCorrectionCount}</td>
                <td className="px-5 py-4">待发布 {item.pendingPublishCount}</td>
                <td className="px-5 py-4">已发布 {item.publishedCount}</td>
                <td className="px-5 py-4">{item.publishedRateLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
