import { expect, test } from '@playwright/test';

test.describe('admin student list page', () => {
  test('renders scoped student list with masked identity number', async ({ page }) => {
    await page.goto('/admin/students');

    await expect(page.getByRole('heading', { name: '学生档案' })).toBeVisible();
    const studentRow = page.getByRole('row', { name: /王小明/ });
    await expect(studentRow).toBeVisible();
    await expect(studentRow.getByText('3101********3218')).toBeVisible();
    await expect(studentRow.getByText('东城托管中心')).toBeVisible();
    await expect(studentRow.getByText('东城三年级晚辅 A 班')).toBeVisible();
    await expect(studentRow.getByText('晚辅导')).toBeVisible();
  });
});
