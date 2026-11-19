import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on AIM advanced search', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Advanced Search page (/assetinventory/advance-search)
  await page.goto('/assetinventory/advance-search');
  await page.waitForURL('**/assetinventory/advance-search**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Search Input & Query Wizard Button
  const searchInput = main.getByPlaceholder(/Search by value, type, owner/i);
  await expect(searchInput).toBeVisible({ timeout: 15000 });

  const queryWizardBtn = main.getByRole('button', { name: /Query Wizard/i });
  await expect(queryWizardBtn).toBeVisible();

  // 4. Verify Metric Stats Cards or Handle Empty State (wait for API response)
  const emptyState = page.getByText('No Assets Found');
  const firstStatCard = main.getByText('Subdomains').first();

  await expect(firstStatCard.or(emptyState)).toBeVisible({ timeout: 15000 });

  if (await emptyState.isVisible()) {
    await expect(emptyState).toBeVisible();
    return;
  }

  await expect(firstStatCard).toBeVisible();
  await expect(main.getByText('IPs').first()).toBeVisible();
  await expect(main.getByText('Employees').first()).toBeVisible();
  await expect(main.getByText('APIs').first()).toBeVisible();
  await expect(main.getByText('Certificates').first()).toBeVisible();
  await expect(main.getByText('DNS').first()).toBeVisible();
  await expect(main.getByText('Applications').first()).toBeVisible();

  // 6. Verify Advanced Search Table & Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Asset')).toBeVisible();
    await expect(thead.getByText('Type')).toBeVisible();
    await expect(thead.getByText('Source')).toBeVisible();
    await expect(thead.getByText('Active Vulns')).toBeVisible();
    await expect(thead.getByText('Owner')).toBeVisible();
    await expect(thead.getByText('Last Detected')).toBeVisible();
  }

  // 7. Verify Table Toolbar Filters
  await verifyTableToolbarFilters(page, main);

  // 8. Test Search Input Interaction & Clear
  await searchInput.fill('snap-se');
  await page.waitForTimeout(600); // Wait for debounce

  // Clear search input using clear button or filling empty string
  const clearSearchBtn = main.locator('button:has(svg.lucide-x)');
  if (await clearSearchBtn.isVisible()) {
    await clearSearchBtn.click();
  } else {
    await searchInput.fill('');
  }
  await page.waitForTimeout(600);

  // 9. Test Query Wizard Modal Open & Cancel
  await queryWizardBtn.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'Query Wizard' }),
  ).toBeVisible();
  await expect(
    dialog.getByText('Build advanced nested filters for your asset registry'),
  ).toBeVisible();

  // Cancel / Close dialog
  const cancelBtn = dialog.getByRole('button', { name: 'Cancel' });
  await expect(cancelBtn).toBeVisible();
  await cancelBtn.click();
  await expect(dialog).toBeHidden();

  // 10. Test Pagination if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
    await page2Btn.click();
    await page.waitForTimeout(500);

    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
      await page1Btn.click();
    }
  }
});
