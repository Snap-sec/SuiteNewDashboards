import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on AIM workstations page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Workstations page (/assetinventory/assets/workstation)
  await page.goto('/assetinventory/assets/workstation');
  await page.waitForURL('**/assetinventory/assets/workstation**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Workstation Inventory',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('Monitor endpoints and devices.'),
  ).toBeVisible();

  // 4. Verify Tabs (Inventory & Analytics)
  const inventoryTab = main.getByRole('tab', { name: /Inventory/i });
  const analyticsTab = main.getByRole('tab', { name: /Analytics/i });
  await expect(inventoryTab).toBeVisible();
  await expect(analyticsTab).toBeVisible();

  // 5. Handle Empty State if no workstations are detected
  const emptyScreen = page.getByText('No assets have been detected so far.');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 6. Verify Inventory Tab Table & Columns
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Asset')).toBeVisible();
    await expect(thead.getByText('Operating System')).toBeVisible();
    await expect(thead.getByText('Vuln Count')).toBeVisible();
    await expect(thead.getByText('Tags')).toBeVisible();
    await expect(thead.getByText('Owner')).toBeVisible();
    await expect(thead.getByText('Detected On')).toBeVisible();
  }

  // 7. Verify Table Toolbar Filters
  await verifyTableToolbarFilters(page, main);

  // 8. Test Search Input Interaction
  const searchInput = main.getByPlaceholder(/Search/i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('kali');
    await page.waitForTimeout(600); // Wait for debounce
    await searchInput.fill('');
    await page.waitForTimeout(600);
  }

  // 9. Test Pagination on Inventory Tab if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
    await page2Btn.click();
    await page.waitForTimeout(500);

    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
      await page1Btn.click();
    }
  }

  // 10. Switch to Analytics Tab & Verify Stats & Charts
  await analyticsTab.click();

  if (!(await emptyScreen.isVisible())) {
    // Verify Analytics Metrics Cards
    await expect(main.getByText('Total Workstations')).toBeVisible();
    await expect(main.getByText('Live Workstations')).toBeVisible();
    await expect(main.getByText('Vulnerable Workstations')).toBeVisible();
    await expect(main.getByText('Critical Workstations')).toBeVisible();

    // Verify Analytics Distribution Charts
    await expect(main.getByText('Platform Distribution')).toBeVisible();
    await expect(main.getByText('Region Distribution')).toBeVisible();
    await expect(main.getByText('RAM Distribution')).toBeVisible();
    await expect(main.getByText('Architecture Distribution')).toBeVisible();
    await expect(
      main.getByText('Vulnerability Distribution'),
    ).toBeVisible();
    await expect(main.getByText('Status Distribution')).toBeVisible();
  }

  // 11. Switch back to Inventory Tab
  await inventoryTab.click();
  await expect(table.or(emptyScreen)).toBeVisible();
});