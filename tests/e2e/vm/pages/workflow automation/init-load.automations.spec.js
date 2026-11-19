import { expect, test } from '@playwright/test';

test('initial load and interaction on Workflow Automation page', async ({
  page,
}) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Workflow Automation via sidebar menu
  const automationLink = page.getByRole('link', {
    name: 'Workflow Automation',
  });
  await expect(automationLink).toBeVisible({ timeout: 10000 });
  await automationLink.click();
  await page.waitForURL('**/vm/automation-engine**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify Sidebar and Heading
  await expect(
    page.getByRole('heading', { level: 2, name: /Automation Rules/i }),
  ).toBeVisible();

  // 5. Test Search input and clearing
  const searchInput = page.getByPlaceholder('Search rules...');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('ssl');
  await expect(searchInput).toHaveValue('ssl');

  await searchInput.fill('test');
  await expect(searchInput).toHaveValue('test');

  await searchInput.fill('');
  await expect(searchInput).toHaveValue('');

  // 6. Test tab navigation between Details and Runs if an active rule is selected
  const runsTab = page.getByRole('tab', { name: 'Runs' });
  const detailsTab = page.getByRole('tab', { name: 'Details' });

  if (await runsTab.isVisible()) {
    // Switch to Runs tab
    await runsTab.click();
    await expect(runsTab).toHaveAttribute('aria-selected', 'true');

    // Switch back to Details tab
    await detailsTab.click();
    await expect(detailsTab).toHaveAttribute('aria-selected', 'true');
  }
});