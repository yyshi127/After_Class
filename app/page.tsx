export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10 text-text">
      <section className="mx-auto max-w-5xl rounded-neu bg-surface p-8 shadow-neu">
        <p className="mb-3 text-sm font-semibold text-muted">Afterclass MVP</p>
        <h1 className="mb-4 font-heading text-3xl font-bold">智能晚辅托管系统开发环境已就绪</h1>
        <p className="max-w-2xl text-muted">
          当前项目已安装 Next.js、React、Prisma、PostgreSQL、Tailwind CSS、Vitest 与 Playwright，后续将按开发计划逐项落地业务闭环。
        </p>
      </section>
    </main>
  );
}
