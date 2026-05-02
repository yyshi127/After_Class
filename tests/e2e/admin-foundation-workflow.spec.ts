import { expect, test } from '@playwright/test';

test('admin foundation setup flow links campus, class, student, guardian, and teacher assignment pages', async ({ page }) => {
  await page.goto('/admin/campuses');
  await page.getByRole('link', { name: '新建校区' }).click();
  await expect(page.getByRole('heading', { name: '新建校区' })).toBeVisible();
  await expect(page.getByLabel('校区名称')).toBeVisible();

  await page.goto('/admin/classes');
  await page.getByRole('link', { name: '新建班级' }).click();
  await expect(page.getByRole('heading', { name: '新建班级' })).toBeVisible();
  await expect(page.getByLabel('所属校区')).toBeVisible();
  await expect(page.getByLabel('班级名称')).toBeVisible();
  await expect(page.getByText('班级必须属于一个校区')).toBeVisible();

  await page.goto('/admin/students');
  await page.getByRole('link', { name: '新建学生' }).click();
  await expect(page.getByRole('heading', { name: '新建学生' })).toBeVisible();
  await expect(page.getByText('未选托管类型不能保存')).toBeVisible();

  await page.goto('/admin/guardians');
  await expect(page.getByRole('heading', { name: '家长绑定管理' })).toBeVisible();
  await expect(page.getByLabel('绑定学生')).toContainText('王小明');

  await page.goto('/admin/classes/assignments');
  await expect(page.getByRole('heading', { name: '班级分配老师和学生' })).toBeVisible();
  await expect(page.getByLabel('选择老师')).toContainText('李老师');
  await expect(page.getByLabel('选择学生')).toContainText('王小明');
});
