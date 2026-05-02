import { test, expect } from '@playwright/test';

test('teacher can open homework upload page with assigned class and student only', async ({ page }) => {
  await page.goto('/teacher/homework-upload');

  await expect(page.getByRole('heading', { name: '上传作业' })).toBeVisible();
  await expect(page.getByLabel('选择班级')).toBeVisible();
  await expect(page.getByLabel('选择学生')).toBeVisible();
  await expect(page.getByLabel('作业图片')).toBeVisible();
  await expect(page.getByText('可上传学生：王小明')).toBeVisible();
  await expect(page.getByText('赵小西')).toHaveCount(0);
  await expect(page.getByText('老师不能给非负责学生上传作业')).toBeVisible();
});
