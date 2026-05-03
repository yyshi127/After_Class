import { expect, test } from '@playwright/test';

const aliases = ['/homework-feedback', '/parent/homework'];

for (const route of aliases) {
  test(`${route} opens the parent homework feedback page`, async ({ page }) => {
    await page.goto(route);

    await expect(page).toHaveURL(/\/parent\/homework-feedback$/);
    await expect(page.getByText('作业与考勤详情')).toBeVisible();
    await expect(page.getByText('作业原图：file-homework-original-wang')).toBeVisible();
    await expect(page.getByText('批改图：file-homework-corrected-wang')).toBeVisible();
  });
}
