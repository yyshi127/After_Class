import type { ReactNode } from 'react';

type AdminDataTableFrameProps = {
  title: string;
  itemLabel: string;
  totalCount: number;
  isLoading?: boolean;
  errorMessage?: string;
  emptyMessage: string;
  minWidthClassName?: string;
  children: ReactNode;
};

export function AdminDataTableFrame({
  title,
  itemLabel,
  totalCount,
  isLoading = false,
  errorMessage,
  emptyMessage,
  minWidthClassName = 'min-w-[720px]',
  children,
}: AdminDataTableFrameProps) {
  const statusBaseClass = 'rounded-3xl bg-surface p-6 text-sm shadow-neu-sm';

  if (errorMessage) {
    return (
      <div aria-label={`${itemLabel}错误状态`} className={`${statusBaseClass} text-destructive`} role="alert">
        <p className="font-semibold">{errorMessage}</p>
        <p className="mt-2 text-muted">请保留当前筛选条件，稍后重试或联系管理员排查权限与数据源。</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div aria-label={`${itemLabel}加载中`} className={`${statusBaseClass} text-muted`} role="status">
        <p className="font-semibold text-text">正在加载{itemLabel}</p>
        <p className="mt-2">系统正在读取授权范围内的数据，不会跨校区展示未授权资料。</p>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div aria-label={`${itemLabel}空状态`} className={`${statusBaseClass} text-muted`} role="status">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <section aria-label={title} className="overflow-hidden rounded-3xl bg-surface shadow-neu-sm">
      <div className="flex flex-col gap-2 border-b border-white/70 bg-surfaceAlt px-5 py-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-text">{title}</p>
        <p>共 {totalCount} 条{itemLabel}</p>
      </div>
      <div className="overflow-x-auto">
        <div className={minWidthClassName}>{children}</div>
      </div>
    </section>
  );
}
