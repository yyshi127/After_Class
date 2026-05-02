import { getTeacherTodayCustodyItems, getTeacherTodayFilterOptions, type TeacherTodayCustodyRecord } from '@/domain/teacher/today-custody';
import type { PermissionActor } from '@/domain/auth/permissions';

export function TeacherTodayCustodyPage({
  actor,
  records,
  today,
}: {
  actor: PermissionActor;
  records: readonly TeacherTodayCustodyRecord[];
  today: string;
}) {
  const items = getTeacherTodayCustodyItems({ actor, records, today });
  const filterOptions = getTeacherTodayFilterOptions(items);
  const firstResponsibleItem = items[0];
  const responsibleSummary = firstResponsibleItem
    ? `今日负责：${firstResponsibleItem.campusName} · ${firstResponsibleItem.className}`
    : '今日暂无负责班级';
  const expiringItems = items.filter((item) => item.isExpiringSoon || item.serviceExpiryLabel === '服务已到期');

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <section data-testid="teacher-today-shell" className="mx-auto max-w-6xl space-y-8">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="min-w-0 rounded-[2rem] bg-surface p-6 shadow-neu-sm">
            <p className="text-sm font-semibold text-muted">Teacher Portal</p>
            <h1 className="font-heading text-3xl font-bold md:text-4xl">老师端工作台</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">查看今日负责校区、班级、托管类型下的学生到托状态，并优先处理服务即将到期提醒。</p>
            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="rounded-2xl bg-surfaceAlt px-4 py-3 text-sm font-semibold">{responsibleSummary}</p>
              <div className="flex flex-wrap gap-3">
                <button className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" type="button">到岗签到</button>
                <button className="min-h-11 rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" type="button">离岗签退</button>
              </div>
            </div>
          </div>

          <section aria-label="老师 AI 快捷录入" className="min-w-0 rounded-[2rem] bg-lavender/45 p-6 shadow-neu-sm">
            <p className="text-sm font-semibold text-primary">AI Quick Entry</p>
            <h2 className="mt-1 font-heading text-2xl font-bold">AI 快捷录入</h2>
            <p className="mt-3 text-sm leading-6 text-muted">可先用语音/文字记录请假、纪律、作业反馈草稿；语音/文字记录后需老师确认，AI 不会直接发布给家长。</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button className="min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" type="button">AI 快捷录入</button>
              <button className="min-h-11 rounded-full bg-surfaceAlt px-5 py-2 text-sm font-semibold" type="button">查看草稿箱</button>
            </div>
          </section>
        </div>

        <div className="space-y-5 rounded-[2rem] bg-surface p-6 shadow-neu-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-muted">Expiry Reminder</p>
              <h2 className="font-heading text-3xl font-bold">服务到期提醒</h2>
            </div>
            <p className="rounded-full bg-surfaceAlt px-4 py-2 text-sm font-semibold text-muted">仅提醒服务到期/续费跟进，不展示经营或收费金额。</p>
          </div>
          {expiringItems.length === 0 ? (
            <p className="rounded-3xl bg-surfaceAlt p-5 text-sm text-muted">7 天内暂无服务到期学生</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {expiringItems.map((item) => (
                <article key={`expiry-${item.id}`} className="rounded-3xl bg-peach/30 p-5 text-sm font-semibold">
                  <p>{item.studentName} · {item.serviceExpiryLabel}</p>
                  <p className="mt-2 text-muted">{item.campusName} · {item.className} · {item.serviceType}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5 rounded-[2rem] bg-surface p-6 shadow-neu-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-muted">Today Custody</p>
              <h2 className="font-heading text-3xl font-bold">今日托管</h2>
            </div>
            <p className="rounded-full bg-surfaceAlt px-4 py-2 text-sm font-semibold text-muted">负责学生 {items.length} 人</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm font-semibold" htmlFor="teacher-campus-filter">
              校区筛选
              <select id="teacher-campus-filter" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                <option>全部校区</option>
                {filterOptions.campuses.map((campus) => (
                  <option key={campus.id}>{campus.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold" htmlFor="teacher-class-filter">
              班级筛选
              <select id="teacher-class-filter" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                <option>全部班级</option>
                {filterOptions.classes.map((custodyClass) => (
                  <option key={custodyClass.id}>{custodyClass.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-semibold" htmlFor="teacher-service-type-filter">
              托管类型筛选
              <select id="teacher-service-type-filter" className="min-h-11 w-full rounded-2xl border border-white/70 bg-background px-4 text-sm shadow-neu-inset">
                <option>全部托管类型</option>
                {filterOptions.serviceTypes.map((serviceType) => (
                  <option key={serviceType}>{serviceType}</option>
                ))}
              </select>
            </label>
          </div>

          {items.length === 0 ? (
            <p className="rounded-3xl bg-surfaceAlt p-6 text-sm text-muted">暂无负责学生</p>
          ) : (
            <section aria-label="今日托管学生列表" className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <article key={item.id} className="rounded-3xl bg-background p-5 shadow-neu-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{item.studentName}</h3>
                      <p className="mt-1 text-sm text-muted">{item.campusName} · {item.className} · {item.serviceType}</p>
                    </div>
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">{item.statusLabel}</span>
                  </div>
                  <p className={item.isExpiringSoon ? 'mt-4 rounded-2xl bg-peach/40 px-4 py-3 text-sm font-semibold' : 'mt-4 rounded-2xl bg-surfaceAlt px-4 py-3 text-sm text-muted'}>
                    {item.isExpiringSoon ? <span>服务 7 天内到期</span> : null}
                    {item.isExpiringSoon ? <span aria-hidden="true"> · </span> : null}
                    <span>{item.serviceExpiryLabel}</span>
                  </p>
                  <a aria-label={`为${item.studentName}拍照签到`} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" href={`/teacher/photo-check-in?studentId=${item.id}`}>
                    拍照签到
                  </a>
                </article>
              ))}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
