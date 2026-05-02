import { expect, test } from '@playwright/test';

test('parent can open homework and attendance detail without internal AI or teacher notes', async ({ page }) => {
  await page.goto('/parent/homework-feedback');

  await expect(page.getByRole('heading', { name: '作业与考勤详情' })).toBeVisible();
  await expect(page.getByText('王小明 · 数学')).toBeVisible();
  await expect(page.getByText('作业原图：file-homework-original-wang')).toBeVisible();
  await expect(page.getByText('批改图：file-homework-corrected-wang')).toBeVisible();
  await expect(page.getByText('行为表现')).toBeVisible();
  await expect(page.getByText('作业完成')).toBeVisible();
  await expect(page.getByText('知识掌握')).toBeVisible();
  await expect(page.getByText('到托/离校时间线')).toBeVisible();
  await expect(page.getByText(/已到/)).toBeVisible();
  await expect(page.getByText(/已离校/)).toBeVisible();
  await expect(page.getByText('错题摘要')).toBeVisible();
  await expect(page.getByText('两位数乘法', { exact: true })).toBeVisible();

  await expect(page.getByText(/AI 内部|置信度|老师内部备注|课堂后单独跟进|未确认草稿/)).toHaveCount(0);
});
