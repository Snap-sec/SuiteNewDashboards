import { expect, test } from '@playwright/test';

test('initial load and interaction on WAS dashboard', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to WAS Dashboard (/was)
  await page.goto('/was');
  await page.waitForURL('**/was**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State or Loaded Dashboard
  const emptyScreen = page.getByText('No dashboard data available');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    await expect(
      page.getByText(
        "You don't have any environments yet. Add one through integrations.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Goto Integration/i }),
    ).toBeVisible();
    return;
  }

  // 4. Verify Metrics Cards
  await expect(page.getByText('Total Vulnerabilities')).toBeVisible();
  await expect(page.getByText('Total Applications')).toBeVisible();
  await expect(page.getByText('Total Critical')).toBeVisible();
  await expect(page.getByText('Application with active scans')).toBeVisible();

  // 5. Verify Distribution Charts
  await expect(
    page.getByText('Vulnerabilities Distribution', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Vulnerabilities Distribution by App'),
  ).toBeVisible();
  await expect(page.getByText('CWE Distribution')).toBeVisible();

  // 6. Verify Top 5 Vulnerabilities Section & Table
  await expect(page.getByText('Top 5 Vulnerabilities')).toBeVisible();

  const table = page.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Title')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Severity')).toBeVisible();
    await expect(thead.getByText('Application Name')).toBeVisible();
    await expect(thead.getByText('Reported On')).toBeVisible();
  }
});
