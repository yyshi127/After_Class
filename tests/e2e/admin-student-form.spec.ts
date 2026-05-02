import { expect, test } from '@playwright/test';

test('admin student new form route renders required fields and custody type validation copy', async ({ page }) => {
  await page.goto('/admin/students/new');

  await expect(page.getByRole('heading', { name: '新建学生' })).toBeVisible();
  await expect(page.getByLabel('学生姓名')).toBeVisible();
  await expect(page.locator('select[name="campusId"]')).toBeVisible();
  await expect(page.locator('select[name="classId"]')).toBeVisible();
  await expect(page.getByLabel('晚辅导')).toBeVisible();
  await expect(page.getByText('未选托管类型不能保存')).toBeVisible();
});
