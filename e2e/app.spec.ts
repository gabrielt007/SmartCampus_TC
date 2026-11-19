import { expect, test } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('ion-title')).toContainText('SmartCampus');
  await expect(page.locator('ion-tab-button')).toHaveCount(4);
});
