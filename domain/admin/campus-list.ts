export type CampusListStatus = 'ACTIVE' | 'INACTIVE';

export type CampusListItem = {
  id: string;
  name: string;
  address: string;
  phone: string;
  principalName: string;
  status: CampusListStatus;
};

export type CampusListFilters = {
  keyword: string;
  status: CampusListStatus | 'ALL';
};

export function filterCampusesForList(
  campuses: readonly CampusListItem[],
  filters: CampusListFilters,
): CampusListItem[] {
  const keyword = filters.keyword.trim();

  return campuses.filter((campus) => {
    const matchesKeyword = keyword.length === 0 || campus.name.includes(keyword) || campus.principalName.includes(keyword);
    const matchesStatus = filters.status === 'ALL' || campus.status === filters.status;

    return matchesKeyword && matchesStatus;
  });
}
