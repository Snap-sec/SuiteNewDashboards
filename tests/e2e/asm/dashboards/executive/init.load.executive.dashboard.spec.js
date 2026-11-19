import { expect, test } from '@playwright/test';

test('initial load and interaction on ASM executive dashboard', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Executive Dashboard
  await page.goto('/casm');
  await page.waitForURL('**/casm**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State or Loaded Dashboard
  const emptyScreen = page.getByText('No data available');
  if (await emptyScreen.isVisible()) {
    await expect(page.getByText('There are no data to show, please create a scan to see dashboard data')).toBeVisible();
    await expect(page.getByRole('button', { name: /Setup ASM/i })).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading
  const heading = main.getByRole('heading', { name: 'Dashboard', exact: true });
  await expect(heading).toBeVisible({ timeout: 15000 });

  // 5. Verify Metrics Cards
  await expect(main.getByText('Total Assets')).toBeVisible();
  await expect(main.getByText('Risk Signals')).toBeVisible();
  await expect(main.getByText('Tickets Escalated').first()).toBeVisible();
  await expect(main.getByText('Next Scan')).toBeVisible();

  // 6. Verify Dashboard Charts
  await expect(main.getByText('Asset Distribution')).toBeVisible();
  await expect(main.getByText('Signal Distribution')).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Tickets Escalated' })).toBeVisible();

  // 7. Verify Current Attack Surface Posture Table
  const postureHeading = main.getByText('Current Attack Surface Posture');
  await expect(postureHeading).toBeVisible();

  const postureTable = main.locator('table').last();
  if (await postureTable.isVisible()) {
    const thead = postureTable.locator('thead');
    await expect(thead.getByText('Asset Type')).toBeVisible();
    await expect(thead.getByText('Current Asset Count')).toBeVisible();
    await expect(thead.getByText('Total Signals')).toBeVisible();
    await expect(thead.getByText('Total Risks')).toBeVisible();
  }
});