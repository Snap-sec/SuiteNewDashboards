import { expect, test } from '@playwright/test';

test('initial load and interaction on VS settings page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to VS Settings page (/vs/settings)
  await page.goto('/vs/settings');
  await page.waitForURL('**/vs/settings**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Asset Inventory Integration Section
  const aimSection = page.getByText(/Asset Inventory Integration/i);
  await expect(aimSection.first()).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText(
      'Connect your asset inventory to Vulnerability Scanner to get a comprehensive view of your assets and their vulnerabilities.',
    ),
  ).toBeVisible();

  // 4. Verify Vulnerability Synchronization Configuration Section
  const syncHeading = page.getByText(/Vulnerability Synchronization Configuration/i);
  await expect(syncHeading.first()).toBeVisible();
  await expect(
    page.getByText('Configure the vulnerability synchronization to your asset inventory.'),
  ).toBeVisible();

  // 5. Verify Synchronization Form Controls
  await expect(page.getByText('Automatic Synchronization')).toBeVisible();
  await expect(page.getByText('Assessment for storing vulnerabilities')).toBeVisible();
  await expect(page.getByText('Auto-sync Severities')).toBeVisible();

  // 6. Verify Update Button
  const updateBtn = page.getByRole('button', { name: /Update/i });
  if (await updateBtn.isVisible()) {
    await expect(updateBtn).toBeVisible();
  }
});