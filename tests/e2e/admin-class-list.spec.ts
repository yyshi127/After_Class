import { expect, test } from '@playwright/test';

test('admin classes page shows class list with campus isolation columns', async ({ page }) => {
  await page.goto('/admin/classes');

  await expect(page.getByRole('heading', { name: '班级管理' })).toBeVisible();
  await expect(page.getByText('东城三年级晚辅 A 班')).toBeVisible();
  await expect(page.getByRole('cell', { name: '东城托管中心' })).toBeVisible();
  await expect(page.getByText('李老师')).toBeVisible();
  await expect(page.getByText('1/24')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: '今日应到' })).toBeVisible();
});
