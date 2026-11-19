import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM manage assets page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Manage Assets page (/assetinventory/edit-asset)
  await page.goto('/assetinventory/edit-asset');
  await page.waitForURL('**/assetinventory/edit-asset**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Manage Assets',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      'Manage and update organization asset details using interactive spreadsheet data grid.',
    ),
  ).toBeVisible();

  // 4. Verify Header Toolbar Controls
  const searchInput = main.getByPlaceholder(/Search assets by name or value/i);
  await expect(searchInput).toBeVisible();

  const assetTypeSelector = main
    .getByRole('combobox')
    .filter({
      hasText:
        /All Asset Types|Subdomains|APIs|IP Addresses|DNS Records|Repositories|Certificates|Employees|Applications|Workstations|Servers|Registries|Object Storage|Compartments|Vendors/i,
    })
    .first();
  await expect(assetTypeSelector).toBeVisible();

  const exportBtn = main.getByRole('button', { name: /Export View/i });
  await expect(exportBtn).toBeVisible();

  // 5. Wait for loading skeletons to finish and verify data grid or empty state
  await expect(main.locator('.animate-pulse, [data-slot="skeleton"]'))
    .toHaveCount(0, { timeout: 10000 })
    .catch(() => {});

  const gridContainer = main.getByRole('treegrid');
  const emptyState = main.getByText('No data available');
  await expect(gridContainer.or(emptyState)).toBeVisible();

  // 6. Test Search Input Interaction & Debounce
  await searchInput.fill('kali');
  await page.waitForTimeout(600); // Wait for debounce

  // Clear search input using clear button or empty fill
  const clearSearchBtn = main.locator('button:has(svg.lucide-x)');
  if (await clearSearchBtn.isVisible()) {
    await clearSearchBtn.click();
  } else {
    await searchInput.fill('');
  }
  await page.waitForTimeout(600);

  // 7. Test Asset Type Filter Dropdown Selection
  await assetTypeSelector.click();
  const subdomainsOption = page.getByRole('option', { name: 'Subdomains' });
  if (await subdomainsOption.isVisible()) {
    await subdomainsOption.click();
    await expect(assetTypeSelector).toContainText('Subdomains');
    await page.waitForTimeout(400);

    // Switch back to All Asset Types
    await assetTypeSelector.click();
    const allOption = page.getByRole('option', { name: 'All Asset Types' });
    if (await allOption.isVisible()) {
      await allOption.click();
      await expect(assetTypeSelector).toContainText('All Asset Types');
      await page.waitForTimeout(400);
    }
  }

  // 8. Test Columns Toggle Dropdown if available
  const columnsBtn = main.getByRole('button', { name: /Columns/i });
  if (await columnsBtn.isVisible()) {
    await columnsBtn.click();
    const menuContent = page.locator('[data-slot="dropdown-menu-content"]');
    if (await menuContent.isVisible()) {
      await expect(page.getByText('Toggle Columns')).toBeVisible();
      await page.keyboard.press('Escape');
    }
  }

  // 9. Verify Pagination Controls
  await expect(main.getByText('Rows per page')).toBeVisible();

  // Test Pagination navigation if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
    await page2Btn.click();
    await page.waitForTimeout(500);

    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
      await page1Btn.click();
      await page.waitForTimeout(500);
    }
  }
});
