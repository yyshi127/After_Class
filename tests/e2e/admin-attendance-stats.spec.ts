import { expect, test } from '@playwright/test';

test('admin attendance stats page shows campus scoped summary', async ({ page }) => {
  await page.goto('/admin/attendance');

  await expect(page.getByRole('heading', { name: '考勤统计' })).toBeVisible();
  await expect(page.getByText('东城三年级晚辅 A 班')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '应到' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '实到' })).toBeVisible();
  await expect(page.getByText('100.00%')).toBeVisible();
  await expect(page.getByText('西城托管中心')).not.toBeVisible();
});
