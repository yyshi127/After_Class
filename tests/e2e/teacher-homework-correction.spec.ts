import { expect, test } from '@playwright/test';

test('teacher homework correction page shows original image and saved coordinate area', async ({ page }) => {
  await page.goto('/teacher/homework-correction');

  await expect(page.getByRole('heading', { name: '作业批改画布' })).toBeVisible();
  await expect(page.getByAltText('王小明的数学作业原图')).toBeVisible();
  await expect(page.getByText('原图尺寸：1200 × 1600')).toBeVisible();
  await expect(page.getByText('区域坐标：x120 / y320 / w360 / h480')).toBeVisible();
  await expect(page.getByText('图片比例和坐标保存一致')).toBeVisible();
});
