import { expect, test } from '@playwright/test';

test('admin class assignment page prevents cross-campus assignment by only showing authorized options', async ({ page }) => {
  await page.goto('/admin/classes/assignments');

  await expect(page.getByRole('heading', { name: '班级分配老师和学生' })).toBeVisible();
  await expect(page.getByLabel('选择班级')).toContainText('东城三年级晚辅 A 班');
  await expect(page.getByLabel('选择老师')).toContainText('李老师');
  await expect(page.getByLabel('选择学生')).toContainText('王小明');
  await expect(page.getByText('已分配 1/24，可继续分配')).toBeVisible();
  await expect(page.getByText('西城托管中心')).not.toBeVisible();
});
