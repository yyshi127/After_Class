type RoleShellProps = {
  label: string;
  title: string;
  description: string;
  highlights: string[];
};

export function RoleShell({ label, title, description, highlights }: RoleShellProps) {
  return (
    <main className="min-h-screen px-6 py-10 text-text">
      <section className="mx-auto max-w-5xl rounded-neu bg-surface p-8 shadow-neu">
        <p className="mb-3 text-sm font-semibold text-muted">{label}</p>
        <h1 className="mb-4 font-heading text-3xl font-bold">{title}</h1>
        <p className="max-w-2xl text-muted">{description}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div key={highlight} className="rounded-2xl bg-surfaceAlt p-4 shadow-neu-sm">
              {highlight}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
