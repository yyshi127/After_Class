import { expect, test } from '@playwright/test';

test('admin can review AI action logs with permission-scoped audit rows', async ({ page }) => {
  await page.goto('/admin/ai-logs');

  await expect(page.getByRole('heading', { name: 'AI 操作日志' })).toBeVisible();
  await expect(page.getByLabel('时间筛选')).toBeVisible();
  await expect(page.getByLabel('用户筛选')).toBeVisible();
  await expect(page.getByLabel('意图筛选')).toBeVisible();
  await expect(page.getByLabel('风险筛选')).toBeVisible();
  await expect(page.getByLabel('确认状态筛选')).toBeVisible();
  await expect(page.getByLabel('结果筛选')).toBeVisible();

  const table = page.getByRole('table');
  await expect(table.getByRole('row', { name: /王小明家长.*考勤查询.*低风险.*无需确认.*已执行/ })).toBeVisible();
  await expect(table.getByRole('row', { name: /东城校区管理员.*服务有效期\/收费查询.*高风险.*无需确认.*已拒绝/ })).toBeVisible();
  await expect(table).not.toContainText('西城校区管理员');
});
