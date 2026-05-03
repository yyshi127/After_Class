export type AppStatusKind = 'loading' | 'empty' | 'error' | 'permissionDenied' | 'aiThinking' | 'voiceRecording';

export type AppStatusItem = {
  kind: AppStatusKind;
  label: string;
  title: string;
  description: string;
  role: 'status' | 'alert';
  actionLabel?: string;
};

export function getAppStatusItems(): AppStatusItem[] {
  return [
    {
      kind: 'loading',
      label: '加载中',
      title: '正在加载数据',
      description: '用于列表、详情和看板首次进入时提示系统正在读取数据。',
      role: 'status',
    },
    {
      kind: 'empty',
      label: '空状态',
      title: '暂无可显示内容',
      description: '用于无学生、无作业、无考勤、无错题等场景，引导用户创建或等待同步。',
      role: 'status',
    },
    {
      kind: 'error',
      label: '错误状态',
      title: '数据加载失败',
      description: '提示用户可以重试，同时避免暴露内部错误堆栈或敏感信息。',
      role: 'alert',
      actionLabel: '重试',
    },
    {
      kind: 'permissionDenied',
      label: '无权限',
      title: '没有访问权限',
      description: '用于校区、学生、家长绑定、财务字段等权限不足场景。',
      role: 'alert',
      actionLabel: '返回首页',
    },
    {
      kind: 'aiThinking',
      label: 'AI 思考中',
      title: 'AI 正在生成草稿',
      description: '用于 AI 查询、讲解、反馈草稿和同类题生成，必须保留人工确认链路。',
      role: 'status',
    },
    {
      kind: 'voiceRecording',
      label: '语音录入中',
      title: '正在录音 00:12',
      description: '用于家长、老师或学生语音输入，入口不遮挡底部操作。',
      role: 'status',
      actionLabel: '结束录音',
    },
  ];
}

const toneClassByKind: Record<AppStatusKind, string> = {
  loading: 'bg-lavender/45',
  empty: 'bg-mint/40',
  error: 'bg-peach/50',
  permissionDenied: 'bg-surfaceAlt',
  aiThinking: 'bg-lavender/45',
  voiceRecording: 'bg-mint/40',
};

export function AppStatusCard({ item }: { item: AppStatusItem }) {
  const RoleTag = item.role === 'alert' ? 'div' : 'section';

  return (
    <RoleTag
      aria-label={item.label}
      className={`rounded-3xl p-5 shadow-neu-sm ${toneClassByKind[item.kind]}`}
      role={item.role}
    >
      <p className="text-sm font-semibold text-muted">{item.label}</p>
      <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
      {item.actionLabel ? (
        <button className="mt-4 min-h-11 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground" type="button">
          {item.actionLabel}
        </button>
      ) : null}
    </RoleTag>
  );
}

export function AppStatusShowcasePage() {
  const items = getAppStatusItems();

  return (
    <main aria-label="全局状态页面" className="min-h-screen overflow-x-hidden bg-background px-4 py-6 text-foreground sm:px-6 sm:py-10">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-neu bg-surface p-5 shadow-neu sm:p-6">
          <p className="text-sm font-semibold text-muted">Global States</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">全局状态页面</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            统一 loading、empty、error、permission denied、AI thinking 和 voice recording 的页面状态，核心页面复用同一套语义、文案和触控尺寸。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <AppStatusCard key={item.kind} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
