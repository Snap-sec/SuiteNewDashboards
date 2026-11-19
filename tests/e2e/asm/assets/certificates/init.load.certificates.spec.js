import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM certificates page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Certificates page
  await page.goto('/casm/assets/certificates');
  await page.waitForURL('**/casm/assets/certificates**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no certificates exist
  const emptyScreen = page.getByText('No Certificates Found');
  if (await emptyScreen.isVisible()) {
    await expect(page.getByText('When new certificates are added, they will show here.')).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', { name: 'Certificates', exact: true });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('Manage and monitor certificates effectively.')).toBeVisible();

  // 5. Verify Certificates Metrics Cards
  await expect(main.getByText('Total', { exact: true })).toBeVisible();
  await expect(main.getByText('Expired', { exact: true })).toBeVisible();
  await expect(main.getByText('At Risk', { exact: true })).toBeVisible();
  await expect(main.getByText('Signals', { exact: true }).first()).toBeVisible();

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('Common Name')).toBeVisible();
  await expect(thead.getByText('Valid From')).toBeVisible();
  await expect(thead.getByText('Valid To')).toBeVisible();
  await expect(thead.getByText('Status')).toBeVisible();

  // 7. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder(/Search/i).or(main.getByRole('textbox', { name: /Search/i })).first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('pass');
    await expect(searchInput).toHaveValue('pass');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 8. Verify Table Toolbar Filters using helper (Status, etc.)
  await verifyTableToolbarFilters(page, main);

  // 9. Test Export CSV button if visible
  const exportBtn = main.getByRole('button', { name: /Export/i });
  if (await exportBtn.isVisible()) {
    await expect(exportBtn).toBeVisible();
  }

  // 10. Test Pagination navigation if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }
});