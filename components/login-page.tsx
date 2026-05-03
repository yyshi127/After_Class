const roleEntries = [
  { label: '管理员登录', href: '/admin', description: '校区配置、学生档案、收费核算与 AI 操作日志' },
  { label: '老师登录', href: '/teacher', description: '到托签到、作业批改、错题与每日反馈' },
  { label: '家长登录', href: '/parent', description: '到托安全、作业反馈、服务有效期与家校沟通' },
  { label: '学生登录', href: '/student', description: '今日任务、错题订正与学习入口' },
];

export function LoginPage() {
  return (
    <main className="min-h-screen px-5 py-8 text-text sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 rounded-neu bg-surface p-6 shadow-neu sm:p-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold text-muted">Afterclass MVP</p>
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">智能晚辅托管系统登录</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            请选择你的角色进入演示工作台。正式账号密码登录、短信登录和机构 SSO 可在试点账号体系接入后继续扩展。
          </p>
          <div className="mt-6 rounded-2xl bg-surfaceAlt p-4 text-sm leading-6 text-muted shadow-neu-sm">
            当前为试点演示入口：AI 结果均为草稿/建议，高风险操作不会自动执行；家长端仅展示安全、学习与服务有效期信息。
          </div>
        </div>

        <nav aria-label="角色登录入口" className="grid gap-3">
          {roleEntries.map((entry) => (
            <a
              key={entry.href}
              className="block rounded-2xl bg-surfaceAlt p-4 shadow-neu-sm transition hover:-translate-y-0.5 hover:shadow-neu focus:outline-none focus:ring-2 focus:ring-primary"
              href={entry.href}
            >
              <span className="block text-lg font-semibold">{entry.label}</span>
              <span className="mt-1 block text-sm leading-6 text-muted">{entry.description}</span>
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}
