import type { ParentProfileStudent } from '@/domain/parent/profile';

export function ParentProfileServicePage({ profiles }: { profiles: readonly ParentProfileStudent[] }) {
  return (
    <section aria-label="家长我的服务" className="rounded-neu bg-surface p-5 shadow-neu sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Parent Profile</p>
          <h1 className="mt-2 font-heading text-2xl font-bold">我的与服务</h1>
          <p className="mt-2 text-sm leading-6 text-muted">查看绑定孩子、通知设置、请假记录和服务有效期，敏感身份信息默认脱敏。</p>
        </div>
        <span className="rounded-full bg-mint/50 px-4 py-2 text-sm font-semibold">家长可见</span>
      </div>

      {profiles.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-background p-4 text-sm text-muted shadow-neu-sm">暂无绑定孩子信息。</p>
      ) : (
        <div className="mt-5 grid gap-4">
          {profiles.map((profile) => (
            <article key={profile.id} className="overflow-hidden rounded-3xl bg-background p-4 shadow-neu-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-heading text-xl font-bold">{profile.name}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {profile.school} · {profile.grade} · {profile.serviceType}
                  </p>
                </div>
                <span className="rounded-full bg-lavender/50 px-3 py-1 text-sm font-semibold">{profile.serviceValidityLabel}</span>
              </div>

              <div aria-label={`${profile.name}孩子信息`} className="mt-4 grid gap-3 md:grid-cols-2" role="region">
                <InfoLine label="身份证" value={profile.identityNumberMasked} />
                <InfoLine label="家长关系" value={profile.relationship} />
                <InfoLine label="联系电话" value={profile.guardianPhone} />
                <InfoLine label="安全备注" value={profile.safetyNote} />
              </div>

              <div aria-label={`${profile.name}通知设置`} className="mt-4 rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset" role="region">
                <p className="text-sm font-bold">通知设置</p>
                <p className="mt-2 text-sm text-muted">到托/离校通知：{profile.notifyEnabled ? '已开启' : '已关闭'}</p>
                <p className="mt-1 text-sm text-muted">作业反馈提醒：老师发布后提醒</p>
              </div>

              <div aria-label={`${profile.name}请假记录`} className="mt-4 rounded-2xl bg-surfaceAlt p-4 shadow-neu-inset" role="region">
                <p className="text-sm font-bold">请假记录</p>
                {profile.leaveRecords.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">暂无请假记录。</p>
                ) : (
                  <div className="mt-3 grid gap-3">
                    {profile.leaveRecords.map((record) => (
                      <div key={record.id} className="rounded-2xl bg-background p-3 text-sm shadow-neu-sm">
                        <p className="font-semibold">
                          {record.leaveDate} · {record.serviceType} · {record.status}
                        </p>
                        <p className="mt-1 text-muted">原因：{record.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface px-4 py-3 text-sm shadow-neu-sm">
      <p className="text-muted">{label}</p>
      <p className="mt-1 break-all font-semibold">{value}</p>
    </div>
  );
}
