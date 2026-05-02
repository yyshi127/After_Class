import { expect, test } from '@playwright/test';

test.describe('admin campus form page', () => {
  test('renders new campus form with fixed service types', async ({ page }) => {
    await page.goto('/admin/campuses/new');

    await expect(page.getByRole('heading', { name: '新建校区' })).toBeVisible();
    await expect(page.getByLabel('校区名称')).toBeVisible();
    await expect(page.getByLabel('校区地址')).toBeVisible();
    await expect(page.getByLabel('联系电话')).toBeVisible();
    await expect(page.getByLabel('负责人')).toBeVisible();
    await expect(page.getByLabel('服务时段')).toBeVisible();
    await expect(page.getByLabel('中午托')).toBeVisible();
    await expect(page.getByLabel('下午托')).toBeVisible();
    await expect(page.getByLabel('晚辅导')).toBeVisible();
    await expect(page.getByLabel('晚全托')).toBeVisible();
  });
});
