import type { ReactNode } from 'react';
import { Bot, Building2, Calculator, ClipboardList, CreditCard, FileClock, GraduationCap, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';

import { getVisibleCampusesForAdmin, type AdminCampusOption } from '@/domain/admin/admin-layout';
import type { PermissionActor } from '@/domain/auth/permissions';

const navItems = [
  { label: '首页看板', href: '/admin', icon: LayoutDashboard },
  { label: '校区管理', href: '/admin/campuses', icon: Building2 },
  { label: '学生档案', href: '/admin/students', icon: Users },
  { label: '班级管理', href: '/admin/classes', icon: GraduationCap },
  { label: '作业反馈', href: '/admin/homework', icon: ClipboardList },
  { label: '收费记录', href: '/admin/billing', icon: CreditCard },
  { label: '班级核算', href: '/admin/settlements', icon: Calculator },
  { label: 'AI 经营助手', href: '/admin/ai-assistant', icon: Bot },
  { label: 'AI 操作日志', href: '/admin/ai-logs', icon: FileClock },
  { label: '系统设置', href: '/admin/settings', icon: Settings },
];

type AdminLayoutProps = {
  actor: PermissionActor;
  campuses: readonly AdminCampusOption[];
  currentUserName: string;
  children: ReactNode;
};

export function AdminLayout({ actor, campuses, currentUserName, children }: AdminLayoutProps) {
  const visibleCampuses = getVisibleCampusesForAdmin(actor, campuses);

  return (
    <div className="min-h-screen bg-background text-text lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-white/70 bg-surface/95 p-5 shadow-neu lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="rounded-3xl bg-surfaceAlt p-4 shadow-neu-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">AfterClass</p>
          <h1 className="mt-2 font-heading text-2xl font-bold">管理端</h1>
          <p className="mt-1 text-sm text-muted">多校区运营后台</p>
        </div>

        <nav aria-label="管理端主导航" className="mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                className="flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted transition hover:bg-surfaceAlt hover:text-text"
                href={item.href}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 border-b border-white/70 bg-background/90 px-5 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div aria-label="顶部校区筛选" className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-muted">校区</span>
              {visibleCampuses.length === 0 ? (
                <span className="rounded-full bg-surfaceAlt px-3 py-2 text-sm text-muted shadow-neu-sm">无授权校区</span>
              ) : (
                visibleCampuses.map((campus) => (
                  <button
                    key={campus.id}
                    className="min-h-11 rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-neu-sm"
                    type="button"
                  >
                    {campus.name}
                  </button>
                ))
              )}
            </div>

            <button
              aria-label={`用户菜单：${currentUserName}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold shadow-neu-sm"
              type="button"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                {currentUserName.slice(0, 1)}
              </span>
              {currentUserName}
              <LogOut aria-hidden="true" className="h-4 w-4 text-muted" />
            </button>
          </div>
        </header>

        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
