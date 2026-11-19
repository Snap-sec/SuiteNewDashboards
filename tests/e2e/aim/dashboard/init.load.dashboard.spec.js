import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM dashboard', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Asset Inventory Dashboard (/assetinventory)
  await page.goto('/assetinventory');
  await page.waitForURL('**/assetinventory**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Default Overview Dashboard Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Asset Inventory Dashboard',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('High-level overview of all your digital assets.'),
  ).toBeVisible();

  // 4. Verify Overview Asset Metric Cards or Empty State (wait for stats API to complete)
  const totalAssetsMetric = main.getByText('Total Assets');
  await expect(totalAssetsMetric.or(emptyState)).toBeVisible({
    timeout: 15000,
  });

  if (await emptyState.isVisible()) {
    await expect(emptyState).toBeVisible();
    return;
  }

  await expect(totalAssetsMetric).toBeVisible();
  await expect(main.getByRole('link', { name: /Subdomains/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /APIs/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /IP Addresses/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Repositories/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Certificates/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Employees/i })).toBeVisible();
  await expect(main.getByRole('link', { name: /Applications/i })).toBeVisible();

  // 5. Verify Overview Dashboard Charts
  await expect(main.getByText('Active Vulnerabilities')).toBeVisible();
  await expect(main.getByText('Code Repos')).toBeVisible();
  await expect(main.getByText("API's")).toBeVisible();
  await expect(main.getByText('SSL Certificates')).toBeVisible();
  await expect(main.getByText('Object Storage')).toBeVisible();
  await expect(main.getByText('Registry')).toBeVisible();

  // 6. Test Asset Type Selector - Switch to Applications Dashboard
  const typeSelector = main.getByRole('combobox');
  await expect(typeSelector).toBeVisible();
  await typeSelector.click();
  await page.getByRole('option', { name: 'Applications' }).click();

  await expect(
    main.getByRole('heading', { name: 'Application Inventory' }),
  ).toBeVisible();
  await expect(
    main.getByText('Catalog and monitor enterprise applications.'),
  ).toBeVisible();

  // 7. Test Asset Type Selector - Switch to Employee Dashboard
  await typeSelector.click();
  await page.getByRole('option', { name: 'Employees' }).click();

  await expect(
    main.getByRole('heading', { name: 'Employee Inventory' }),
  ).toBeVisible();
  await expect(
    main.getByText('Map employee-linked accounts and digital assets.'),
  ).toBeVisible();
  await expect(main.getByText('Total Employees')).toBeVisible();
  await expect(main.getByText('Vendor Distribution')).toBeVisible();
  await expect(main.getByText('Activity Distribution')).toBeVisible();

  // 8. Test Asset Type Selector - Switch to APIs Dashboard
  await typeSelector.click();
  await page.getByRole('option', { name: 'APIs' }).click();

  await expect(
    main.getByRole('heading', { name: 'API Inventory' }),
  ).toBeVisible();
  await expect(
    main.getByText('Monitor APIs with ownership and risk visibility.'),
  ).toBeVisible();
  await expect(main.getByText('Total APIs')).toBeVisible();
  await expect(main.getByText('Internal vs External APIs')).toBeVisible();
  await expect(main.getByText('Environment Distribution')).toBeVisible();
  await expect(main.getByText('Vulnerability Distribution')).toBeVisible();
  await expect(main.getByText('HTTP Method Distribution')).toBeVisible();
  await expect(main.getByText('Auth Distribution')).toBeVisible();

  // 9. Switch back to Default Overview
  await typeSelector.click();
  await page.getByRole('option', { name: 'Default' }).click();

  await expect(
    main.getByRole('heading', { name: 'Asset Inventory Dashboard' }),
  ).toBeVisible();
});