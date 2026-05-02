import { expect, test } from '@playwright/test';

test('admin guardian binding route renders form and existing bindings', async ({ page }) => {
  await page.goto('/admin/guardians');

  await expect(page.getByRole('heading', { name: '家长绑定管理' })).toBeVisible();
  await expect(page.getByLabel('家长姓名')).toBeVisible();
  await expect(page.getByLabel('手机号')).toBeVisible();
  await expect(page.getByLabel('与学生关系')).toBeVisible();
  await expect(page.getByLabel('绑定学生')).toBeVisible();
  await expect(page.getByLabel('开启到托和作业通知')).toBeVisible();
  await expect(page.getByText('王小明家长')).toBeVisible();
});
