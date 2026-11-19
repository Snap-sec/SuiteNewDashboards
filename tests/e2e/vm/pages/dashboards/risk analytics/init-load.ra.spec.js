import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  await page.getByRole('button', { name: 'Dashboards' }).click();
  await page.getByRole('link', { name: 'Risk Analytics' }).click();
  await page
    .getByRole('combobox')
    .filter({ hasText: 'Executive Insights' })
    .click();
  await page.getByText('Remediation Opportunities').click();
});
