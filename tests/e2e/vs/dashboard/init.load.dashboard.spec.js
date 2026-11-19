import { expect, test } from '@playwright/test';

test('initial load and interaction on VS dashboard', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Scanner Dashboard (/vs)
  await page.goto('/vs');
  await page.waitForURL('**/vs**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Dashboard Heading
  const heading = page.getByRole('heading', {
    name: 'Dashboard',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });

  // 4. Verify Vulnerabilities Trend Chart Card
  await expect(page.getByText('Vulnerabilities').first()).toBeVisible();

  // 5. Verify Metrics Cards
  await expect(page.getByText('Total Vulnerabilities')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Total Scans')).toBeVisible();
  await expect(page.getByText('Total Scanners')).toBeVisible();
  await expect(page.getByText('Total Assets')).toBeVisible();

  // 6. Verify Top 10 Vulnerabilities Section
  await expect(page.getByText('Top 10 Vulnerabilities')).toBeVisible();

  const emptyScreen = page.getByText('No Vulnerabilities Found');
  const table = page.locator('table');
  await expect(table.or(emptyScreen)).toBeVisible({ timeout: 15000 });
});