import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on AIM staged assets page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Staged page (/assetinventory/assets/staged)
  await page.goto('/assetinventory/assets/staged');
  await page.waitForURL('**/assetinventory/assets/staged**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Staged Inventory',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('Review and manage assets currently in staging.'),
  ).toBeVisible();

  // 4. Handle Empty State if no assets are in staging
  const emptyScreen = page.getByText('No Staged Assets Found');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 5. Verify Table & Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Asset')).toBeVisible();
    await expect(thead.getByText('Active Vulns')).toBeVisible();
    await expect(thead.getByText('Tags')).toBeVisible();
    await expect(thead.getByText('Owner')).toBeVisible();
    await expect(thead.getByText('Staged By')).toBeVisible();
    await expect(thead.getByText('Staged At')).toBeVisible();
    await expect(thead.getByText('Reason')).toBeVisible();
  }

  // 6. Verify Table Toolbar Filters
  await verifyTableToolbarFilters(page, main);

  // 7. Test Search Input Interaction & Debounce
  const searchInput = main.getByPlaceholder(/Search/i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('76');
    await page.waitForTimeout(600); // Wait for debounce

    // Clear search input using clear button or empty fill
    const clearSearchBtn = main.locator('button:has(svg.lucide-x)');
    if (await clearSearchBtn.isVisible()) {
      await clearSearchBtn.click();
    } else {
      await searchInput.fill('');
    }
    await page.waitForTimeout(600);
  }

  // 8. Test Pagination if multiple pages exist
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
