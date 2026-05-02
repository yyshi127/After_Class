import { expect, test } from '@playwright/test';

test('photo check-in notification flow from teacher to parent home', async ({ page }) => {
  await page.goto('/teacher');

  await expect(page.getByRole('heading', { name: '今日托管' })).toBeVisible();
  await page.getByRole('button', { name: '到岗签到' }).click();
  await page.getByRole('link', { name: '为王小明拍照签到' }).click();

  await expect(page.getByRole('heading', { name: '拍照签到' })).toBeVisible();
  await expect(page.getByText('王小明')).toBeVisible();
  await expect(page.getByText('照片将以私有文件授权方式提供给绑定家长')).toBeVisible();
  await page.getByRole('button', { name: '确认已到托管中心并通知家长' }).click();
  await expect(page.getByText('到托记录已生成，家长端安全到达卡片可查看照片引用。')).toBeVisible();

  await page.goto('/parent');
  await expect(page.getByRole('heading', { name: '安全到达' })).toBeVisible();
  await expect(page.getByText('王小明')).toBeVisible();
  await expect(page.getByText('已到托管中心')).toBeVisible();
  await expect(page.getByText('photo://demo-arrival-wang')).toBeVisible();
});
