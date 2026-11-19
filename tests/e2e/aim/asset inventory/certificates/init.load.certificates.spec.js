import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on AIM certificates page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Certificates page (/assetinventory/assets/certificates)
  await page.goto('/assetinventory/assets/certificates');
  await page.waitForURL('**/assetinventory/assets/certificates**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'SSL Certificates Inventory',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('Monitor certificates and prevent expiry risks.'),
  ).toBeVisible();

  // 4. Verify Tabs (Inventory & Analytics)
  const inventoryTab = main.getByRole('tab', { name: /Inventory/i });
  const analyticsTab = main.getByRole('tab', { name: /Analytics/i });
  await expect(inventoryTab).toBeVisible();
  await expect(analyticsTab).toBeVisible();

  // 5. Handle Empty State if no certificates are detected
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
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Issue By')).toBeVisible();
    await expect(thead.getByText('Valid From')).toBeVisible();
    await expect(thead.getByText('Valid Till')).toBeVisible();
    await expect(thead.getByText('Tags')).toBeVisible();
    await expect(thead.getByText('Owner')).toBeVisible();
    await expect(thead.getByText('Detected On')).toBeVisible();
  }

  // 7. Verify Table Toolbar Filters
  await verifyTableToolbarFilters(page, main);

  // 8. Test Search Input Interaction
  const searchInput = main.getByPlaceholder(/Search/i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('sec.com');
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
    await expect(main.getByText('Total Certificates')).toBeVisible();
    await expect(main.getByText('Expired Certificates')).toBeVisible();
    await expect(main.getByText('Expiring Soon')).toBeVisible();
    await expect(main.getByText('Valid Certificates')).toBeVisible();

    // Verify Analytics Distribution Charts
    await expect(main.getByText('Valid vs Expired')).toBeVisible();
    await expect(main.getByText('Self-Signed vs CA-Signed')).toBeVisible();
    await expect(main.getByText('Issuer Country')).toBeVisible();
    await expect(
      main.getByText('Certificate Expiration Timeline'),
    ).toBeVisible();
    await expect(
      main.getByText('Certificate Authority Distribution'),
    ).toBeVisible();
  }

  // 11. Switch back to Inventory Tab
  await inventoryTab.click();
  await expect(table.or(emptyScreen)).toBeVisible();
});