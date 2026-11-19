import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM scans page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Scans page
  await page.goto('/casm/scans');
  await page.waitForURL('**/casm/scans**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no scans exist
  const emptyScreen = page.getByText('No data available');
  if (await emptyScreen.isVisible()) {
    await expect(
      page.getByText('There are no data to show, please create a scan, click the button below.'),
    ).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', { name: 'Scans', exact: true });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('Dashboard and List of Scans')).toBeVisible();

  // 5. Verify Table and Column Headers
  const table = main.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('Domain')).toBeVisible();
  await expect(thead.getByText('Status')).toBeVisible();
  await expect(thead.getByText('Started')).toBeVisible();
  await expect(thead.getByText('Duration')).toBeVisible();
  await expect(thead.getByText('Frequency')).toBeVisible();

  // 6. Test Search input and clear functionality
  const searchInput = main
    .getByPlaceholder(/Search scans.../i)
    .or(main.getByRole('textbox', { name: /Search scans.../i }))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('snap');
    await expect(searchInput).toHaveValue('snap');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 7. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 8. Test Pagination navigation if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }
});