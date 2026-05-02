import { AdminDataTableFrame } from '@/components/admin/admin-data-table-frame';
import { filterCampusesForList, type CampusListFilters, type CampusListItem } from '@/domain/admin/campus-list';

type AdminCampusListProps = {
  campuses: readonly CampusListItem[];
  filters: CampusListFilters;
  isLoading?: boolean;
  errorMessage?: string;
};

function statusLabel(status: CampusListItem['status']) {
  return status === 'ACTIVE' ? '启用' : '停用';
}

export function AdminCampusList({ campuses, filters, isLoading = false, errorMessage }: AdminCampusListProps) {
  const filteredCampuses = filterCampusesForList(campuses, filters);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted">Campus</p>
          <h2 className="font-heading text-3xl font-bold">校区管理</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-3xl bg-surface p-3 shadow-neu-sm" aria-label="校区列表筛选条件">
          <span className="rounded-full bg-surfaceAlt px-3 py-2 text-sm text-muted">关键词：{filters.keyword || '全部'}</span>
          <span className="rounded-full bg-surfaceAlt px-3 py-2 text-sm text-muted">
            状态：{filters.status === 'ALL' ? '全部' : statusLabel(filters.status)}
          </span>
          <a className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" href="/admin/campuses/new">
            新建校区
          </a>
        </div>
      </div>

      <AdminDataTableFrame
        emptyMessage="暂无符合条件的校区"
        errorMessage={errorMessage}
        isLoading={isLoading}
        itemLabel="校区资料"
        minWidthClassName="min-w-[720px]"
        title="校区资料表格"
        totalCount={filteredCampuses.length}
      >
          <table className="w-full text-left text-sm">
            <thead className="bg-surfaceAlt text-muted">
              <tr>
                <th className="px-5 py-4 font-semibold">校区名称</th>
                <th className="px-5 py-4 font-semibold">状态</th>
                <th className="px-5 py-4 font-semibold">负责人</th>
                <th className="px-5 py-4 font-semibold">电话</th>
                <th className="px-5 py-4 font-semibold">地址</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampuses.map((campus) => (
                <tr key={campus.id} className="border-t border-white/70">
                  <td className="px-5 py-4 font-semibold">{campus.name}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {statusLabel(campus.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">{campus.principalName}</td>
                  <td className="px-5 py-4">{campus.phone}</td>
                  <td className="px-5 py-4 text-muted">{campus.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </AdminDataTableFrame>
    </section>
  );
}
