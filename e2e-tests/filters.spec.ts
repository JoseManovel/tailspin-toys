import { test, expect } from '@playwright/test';

test.describe('Game filters', () => {
  test('should filter games by category and publisher', async ({ page }) => {
    await page.goto('/');
    const cards = page.getByTestId('game-card');
    const total = await cards.count();

    await test.step('Filter by category', async () => {
      const category = page.getByTestId('category-filter');
      await category.selectOption({ index: 1 });
      const name = (await category.locator('option:checked').textContent())?.trim() ?? '';
      const visible = page.locator('[data-testid="game-card"]:visible');
      expect(await visible.count()).toBeGreaterThan(0);
      for (const tag of await visible.getByTestId('game-category').allTextContents()) {
        expect(tag.trim()).toBe(name);
      }
    });

    await test.step('Combine with publisher filter then reset', async () => {
      await page.getByTestId('publisher-filter').selectOption({ index: 1 });
      expect(await page.locator('[data-testid="game-card"]:visible').count()).toBeLessThanOrEqual(total);
      await page.getByTestId('category-filter').selectOption('');
      await page.getByTestId('publisher-filter').selectOption('');
      await expect(page.locator('[data-testid="game-card"]:visible')).toHaveCount(total);
    });
  });
});
