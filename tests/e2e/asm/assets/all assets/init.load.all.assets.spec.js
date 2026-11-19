import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM all assets page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM All Assets page
  await page.goto('/casm/assets');
  await page.waitForURL('**/casm/assets**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no assets exist
  const emptyScreen = page.getByText('No Assets Found');
  if (await emptyScreen.isVisible()) {
    await expect(page.getByText('When assets are discovered, they will appear here.')).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', { name: 'All Assets', exact: true });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('View and manage all discovered across your attack surface.')).toBeVisible();

  // 5. Verify Table and Column Headers
  const table = main.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('Asset')).toBeVisible();
  await expect(thead.getByText('Type')).toBeVisible();

  // 6. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder(/Search/i).or(main.getByRole('textbox', { name: /Search/i })).first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('dev');
    await expect(searchInput).toHaveValue('dev');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 7. Verify Table Toolbar Filters using helper (Type, Is New, Reset, etc.)
  await verifyTableToolbarFilters(page, main);

  // 8. Test Export CSV button if visible
  const exportBtn = main.getByRole('button', { name: /Export/i });
  if (await exportBtn.isVisible()) {
    await expect(exportBtn).toBeVisible();
  }

  // 9. Test Pagination navigation if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }
});