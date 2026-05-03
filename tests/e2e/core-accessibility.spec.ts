import { expect, test } from '@playwright/test';

const coreMobileRoutes = ['/parent', '/parent/profile', '/student', '/student/mistake-book', '/status'] as const;

test.describe('core mobile accessibility heuristics', () => {
  for (const route of coreMobileRoutes) {
    test(`${route} has named controls, keyboard focus and touch-friendly targets`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);

      await expect(page.locator('main')).toHaveAttribute('aria-label', /.+/);

      const unlabeledControlCount = await page.locator('button, a, input, select, textarea').evaluateAll((controls) =>
        controls.filter((control) => {
          const element = control as HTMLElement;
          if (element.offsetParent === null) return false;
          const name =
            element.getAttribute('aria-label') ??
            element.getAttribute('title') ??
            element.textContent ??
            (element instanceof HTMLInputElement ? element.placeholder : '');
          if (name.trim() === 'Open Next.js Dev Tools') return false;
          return name.trim().length === 0;
        }).length,
      );
      expect(unlabeledControlCount).toBe(0);

      const smallTouchTargetCount = await page.locator('button, a').evaluateAll((controls) =>
        controls.filter((control) => {
          const element = control as HTMLElement;
          if (element.offsetParent === null) return false;
          const name =
            element.getAttribute('aria-label') ??
            element.getAttribute('title') ??
            element.textContent ??
            '';
          if (name.trim() === 'Open Next.js Dev Tools') return false;
          const rect = element.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44;
        }).length,
      );
      expect(smallTouchTargetCount).toBe(0);

      const productFocusableCount = await page.locator('button, a, input, select, textarea').evaluateAll((controls) =>
        controls.filter((control) => {
          const element = control as HTMLElement;
          if (element.offsetParent === null) return false;
          const name = element.getAttribute('aria-label') ?? element.getAttribute('title') ?? element.textContent ?? '';
          return name.trim() !== 'Open Next.js Dev Tools';
        }).length,
      );
      if (productFocusableCount > 0) {
        let activeTagName = '';
        for (let index = 0; index < 5; index += 1) {
          await page.keyboard.press('Tab');
          activeTagName = await page.evaluate(() => document.activeElement?.tagName.toLowerCase() ?? '');
          if (['a', 'button', 'input', 'select', 'textarea'].includes(activeTagName)) break;
        }
        expect(['a', 'button', 'input', 'select', 'textarea']).toContain(activeTagName);
      }

      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(horizontalOverflow).toBe(false);
    });
  }
});
