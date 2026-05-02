import { expect, test } from '@playwright/test';

test('admin homework feedback progress page is campus scoped', async ({ page }) => {
  await page.goto('/admin/homework-feedback');

  await expect(page.getByRole('heading', { name: '作业反馈进度' })).toBeVisible();
  await expect(page.getByText('按校区/班级查看待批改、待发布、已发布进度。')).toBeVisible();
  await expect(page.getByRole('row', { name: /东城托管中心/ })).toContainText('待批改 1');
  await expect(page.getByRole('row', { name: /东城托管中心/ })).toContainText('待发布 1');
  await expect(page.getByRole('row', { name: /东城托管中心/ })).toContainText('已发布 1');
  await expect(page.getByText('西城托管中心')).toHaveCount(0);
});
