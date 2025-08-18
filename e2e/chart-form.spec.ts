import { test, expect } from '@playwright/test';

test.describe('Natal chart form', () => {
  test('submits when all fields are filled', async ({ page }) => {
    await page.goto('/chart');

    await page.fill('#name', 'Тестовый Пользователь');
    await page.fill('#date', '1990-01-01');
    await page.fill('#time', '12:30');

    await page.fill('#place', 'Moscow');
    await page.waitForSelector('[data-testid="suggestions"] button');
    await page.click('[data-testid="suggestion-item"]');

    await expect(page.locator('button[type="submit"]')).toBeEnabled();
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Отправленные данные')).toBeVisible();
  });

  test('handles unknown time checkbox', async ({ page }) => {
    await page.goto('/chart');

    await page.fill('#name', 'Тест');
    await page.fill('#date', '1990-01-01');
    await page.check('input[type="checkbox"]');

    await expect(page.locator('#time')).toBeDisabled();
  });
});
