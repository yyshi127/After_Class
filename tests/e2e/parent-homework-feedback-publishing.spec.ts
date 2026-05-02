import { expect, test } from '@playwright/test';

test('parent sees published homework original, corrected image and three-part feedback only after publish', async ({ page }) => {
  await page.goto('/parent');

  await expect(page.getByRole('heading', { name: '今日作业反馈' })).toBeVisible();
  await expect(page.getByText('作业原图：file-homework-original-wang')).toBeVisible();
  await expect(page.getByText('批改图：file-homework-corrected-wang')).toBeVisible();
  await expect(page.getByText('行为表现')).toBeVisible();
  await expect(page.getByText('作业完成')).toBeVisible();
  await expect(page.getByText('知识掌握')).toBeVisible();
  await expect(page.getByText('草稿反馈不会展示给家长')).not.toBeVisible();
  await expect(page.getByText(/置信度|AI 内部|老师内部备注/)).toHaveCount(0);
});
