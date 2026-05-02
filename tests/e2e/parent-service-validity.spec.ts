import { expect, test } from '@playwright/test';

test('parent home shows service validity without balances or debt amounts', async ({ page }) => {
  await page.goto('/parent');

  await expect(page.getByRole('heading', { name: '服务有效期' })).toBeVisible();
  await expect(page.getByText('当前服务有效期至 2026-05-31')).toBeVisible();
  await expect(page.getByText('仅展示有效期')).toBeVisible();
  await expect(page.getByText(/余额|欠费|欠费金额|应收|实收|amountDue|amountPaid|balanceAmount|debtAmount|1800|1400|2600/)).toHaveCount(0);
});
