import { expect, test } from '@playwright/test';

test('admin billing records page is campus scoped', async ({ page }) => {
  await page.goto('/admin/billing');

  await expect(page.getByRole('heading', { name: '收费记录' })).toBeVisible();
  await expect(page.getByText('学生服务周期、缴费周期、到期时间、应收实收。')).toBeVisible();
  await expect(page.getByRole('row', { name: /王小明/ })).toContainText('月缴');
  await expect(page.getByRole('row', { name: /王小明/ })).toContainText('2026-05-01 至 2026-05-31');
  await expect(page.getByRole('row', { name: /王小明/ })).toContainText('¥1800.00');
  await expect(page.getByText('西城托管中心')).toHaveCount(0);
});
