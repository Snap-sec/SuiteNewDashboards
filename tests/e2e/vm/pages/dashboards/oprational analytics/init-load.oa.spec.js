import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  await page.getByRole('button', { name: 'Dashboards' }).click();
  await page.getByRole('link', { name: 'Operational Analytics' }).click();

  // Switch to custom dashboard 'ppr'
  await page
    .getByRole('combobox')
    .filter({ hasText: 'Default Dashboard' })
    .click();
  await page.getByRole('option', { name: 'ppr' }).click();

  // Wait for the 'ppr' dashboard view to load
  await expect(
    page.getByRole('heading', { level: 1, name: 'ppr' }),
  ).toBeVisible();

  // Switch back to 'Default Dashboard'
  const pprCombobox = page.getByRole('combobox').filter({ hasText: 'ppr' });
  await pprCombobox.click();
  const defaultOption = page.getByRole('option', { name: 'Default Dashboard' });
  await expect(defaultOption).toBeVisible();
  await defaultOption.click();

  // Wait for Operational Analytics default view to load
  await expect(
    page.getByRole('heading', { level: 1, name: 'Operational Analytics' }),
  ).toBeVisible();
});
