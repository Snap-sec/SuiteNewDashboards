import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on AIM IP inventory page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM IP Inventory page (/assetinventory/assets/ips)
  await page.goto('/assetinventory/assets/ips');
  await page.waitForURL('**/assetinventory/assets/ips**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'IP Inventory',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('Track live IPs and detect associated risks.'),
  ).toBeVisible();

  // 4. Verify Tabs (Inventory & Analytics)
  const inventoryTab = main.getByRole('tab', { name: /Inventory/i });
  const analyticsTab = main.getByRole('tab', { name: /Analytics/i });
  await expect(inventoryTab).toBeVisible();
  await expect(analyticsTab).toBeVisible();

  // 5. Handle Empty State if no IPs are detected
  const emptyScreen = page.getByText('No assets have been detected so far.');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 6. Verify Inventory Tab Table & Columns
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Asset Value')).toBeVisible();
    await expect(thead.getByText('Location')).toBeVisible();
    await expect(thead.getByText('Reachability')).toBeVisible();
    await expect(thead.getByText('ISP')).toBeVisible();
    await expect(thead.getByText('Vulnerabilities')).toBeVisible();
    await expect(thead.getByText('Tags')).toBeVisible();
    await expect(thead.getByText('Owner')).toBeVisible();
    await expect(thead.getByText('Associations')).toBeVisible();
    await expect(thead.getByText('Detected On')).toBeVisible();
  }

  // 7. Verify Table Toolbar Filters
  await verifyTableToolbarFilters(page, main);

  // 8. Test Search Input Interaction
  const searchInput = main.getByPlaceholder(/Search/i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('187');
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
    await expect(main.getByText('Total IPs')).toBeVisible();
    await expect(main.getByText('External IPs')).toBeVisible();
    await expect(main.getByText('Vulnerable IPs')).toBeVisible();
    await expect(main.getByText('Critical IPs')).toBeVisible();

    // Verify Analytics Distribution Charts
    await expect(main.getByText('External Reachability')).toBeVisible();
    await expect(main.getByText('Location Distribution')).toBeVisible();
    await expect(main.getByText('Vulnerable vs Safe')).toBeVisible();
    await expect(
      main.getByText('Vulnerabilities Severity Distribution'),
    ).toBeVisible();
    await expect(main.getByText('Network Scope')).toBeVisible();
    await expect(main.getByText('ASN Distribution')).toBeVisible();
  }

  // 11. Switch back to Inventory Tab
  await inventoryTab.click();
  await expect(table.or(emptyScreen)).toBeVisible();
});