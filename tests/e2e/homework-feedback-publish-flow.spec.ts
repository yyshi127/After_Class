import { expect, test } from '@playwright/test';

test('teacher homework upload to AI confirmation to publish is visible to parent', async ({ page }) => {
  await page.goto('/teacher/homework-upload');

  await expect(page.getByRole('heading', { name: '上传作业' })).toBeVisible();
  await expect(page.getByLabel('选择学生')).toHaveValue('王小明');
  await expect(page.getByText('上传后状态：待 AI 圈错')).toBeVisible();

  await page.getByRole('link', { name: '进入 AI 批改确认' }).click();

  await expect(page).toHaveURL(/\/teacher\/homework-correction$/);
  await expect(page.getByRole('heading', { name: '作业批改画布' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI 圈错确认' })).toBeVisible();
  await expect(page.getByText('AI 建议区域，发布前必须老师确认')).toBeVisible();
  await expect(page.getByText('确认状态：老师已确认')).toBeVisible();
  await expect(page.getByRole('button', { name: '发布给家长' })).toBeEnabled();

  await page.getByRole('link', { name: '查看家长端发布结果' }).click();

  await expect(page).toHaveURL(/\/parent\/homework-feedback$/);
  await expect(page.getByRole('heading', { name: '作业与考勤详情' })).toBeVisible();
  await expect(page.getByText('发布状态：老师已确认发布')).toBeVisible();
  await expect(page.getByText('作业原图：file-homework-original-wang')).toBeVisible();
  await expect(page.getByText('批改图：file-homework-corrected-wang')).toBeVisible();
  await expect(page.getByText('两位数乘法', { exact: true })).toBeVisible();
  await expect(page.getByText(/AI 未确认|老师内部备注|置信度/)).toHaveCount(0);
});
