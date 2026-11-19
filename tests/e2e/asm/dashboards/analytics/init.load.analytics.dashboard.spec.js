import { expect, test } from '@playwright/test';

test('initial load and interaction on ASM analytics dashboard', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Analytics Dashboard
  await page.goto('/casm/dashboards/analytics');
  await page.waitForURL('**/casm/dashboards/analytics**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', { name: 'Attack Surface Analytics' });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('Full breakdown by asset type')).toBeVisible();

  // 4. Verify Metrics Cards
  await expect(main.getByRole('link', { name: /Total Assets/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Subdomains/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Ports/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /IP Addresses/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Web Servers/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Certificates/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Technologies/i })).toBeVisible();

  // 5. Verify Asset Breakdown Charts (Row 1)
  await expect(main.getByRole('heading', { name: 'All Assets' })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'SSL Certificates' })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'IP Addresses' })).toBeVisible();

  // 6. Verify Status & Scope Breakdown Charts (Row 2)
  await expect(main.getByText('Web Servers Status Distribution')).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Subdomains' })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Open Ports' })).toBeVisible();
});