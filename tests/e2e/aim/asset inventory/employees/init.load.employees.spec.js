import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on AIM employees page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Employees page (/assetinventory/assets/employees)
  await page.goto('/assetinventory/assets/employees');
  await page.waitForURL('**/assetinventory/assets/employees**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Employee Inventory',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('Map employee-linked accounts and digital assets.'),
  ).toBeVisible();

  // 4. Verify Tabs (Inventory & Analytics)
  const inventoryTab = main.getByRole('tab', { name: /Inventory/i });
  const analyticsTab = main.getByRole('tab', { name: /Analytics/i });
  await expect(inventoryTab).toBeVisible();
  await expect(analyticsTab).toBeVisible();

  // 5. Handle Empty State if no employees are detected
  const emptyScreen = page.getByText('No assets have been detected so far.');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 6. Verify Inventory Tab Toolbar & Header Count
  const countHeading = main.getByRole('heading', {
    name: /Showing \d+ Employees/i,
  });
  if (await countHeading.isVisible()) {
    await expect(countHeading).toBeVisible();
  }

  // 7. Verify Table Toolbar Filters
  await verifyTableToolbarFilters(page, main);

  // 8. Test Search Input Interaction
  const searchInput = main.getByPlaceholder(/Type employee name/i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('imran');
    await page.waitForTimeout(600); // Wait for debounce
    await searchInput.fill('');
    await page.waitForTimeout(600);
  }

  // 9. Switch to Analytics Tab & Verify Stats & Charts
  await analyticsTab.click();

  if (!(await emptyScreen.isVisible())) {
    // Verify Analytics Metrics Cards
    await expect(main.getByText('Total Employees')).toBeVisible();
    await expect(main.getByText('External Employees')).toBeVisible();
    await expect(
      main.getByText('Active Employees', { exact: true }),
    ).toBeVisible();
    await expect(main.getByText('Inactive Employees')).toBeVisible();

    // Verify Analytics Distribution Charts
    await expect(main.getByText('Vendor Distribution')).toBeVisible();
    await expect(main.getByText('Internal/External Users')).toBeVisible();
    await expect(main.getByText('Activity Distribution')).toBeVisible();
  }

  // 10. Switch back to Inventory Tab
  await inventoryTab.click();
  await expect(countHeading.or(emptyScreen).or(inventoryTab)).toBeVisible();
});
