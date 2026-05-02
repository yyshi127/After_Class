import { expect, test } from '@playwright/test';

test('admin class settlements page is campus scoped and shows gross profit', async ({ page }) => {
  await page.goto('/admin/settlements');

  await expect(page.getByRole('heading', { name: '班级核算' })).toBeVisible();
  await expect(page.getByLabel('校区筛选', { exact: true })).toBeVisible();
  await expect(page.getByLabel('日期筛选')).toBeVisible();
  await expect(page.getByLabel('班级筛选')).toBeVisible();
  await expect(page.getByLabel('托管类型筛选')).toBeVisible();
  await expect(page.getByLabel('老师筛选')).toBeVisible();

  const eastRow = page.getByRole('row', { name: /东城三年级晚辅 A 班/ });
  await expect(eastRow).toContainText('王老师');
  await expect(eastRow).toContainText('应到 4 / 到课 1 / 请假 1 / 缺勤 1 / 待确认 1');
  await expect(eastRow).toContainText('¥90.00');
  await expect(eastRow).toContainText('¥220.00');
  await expect(eastRow).toContainText('-¥160.00');
  await expect(page.getByText('西城托管中心')).toHaveCount(0);
});
