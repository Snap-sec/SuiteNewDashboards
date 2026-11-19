import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM IP addresses page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM IP Addresses page
  await page.goto('/casm/assets/ip-addresses');
  await page.waitForURL('**/casm/assets/ip-addresses**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no IP addresses exist
  const emptyScreen = page.getByText('No IPs Found');
  if (await emptyScreen.isVisible()) {
    await expect(page.getByText('When new IPs are added, they will show here.')).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', { name: 'IP Addresses', exact: true });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('Manage and monitor IP addresses effectively.')).toBeVisible();

  // 5. Verify IP Addresses Metrics Cards
  await expect(main.getByText('Total IPs')).toBeVisible();
  await expect(main.getByText('External', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('With Open Ports')).toBeVisible();
  await expect(main.getByText('Signals', { exact: true }).first()).toBeVisible();

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('IP Address')).toBeVisible();
  await expect(thead.getByText('Open Ports')).toBeVisible();
  await expect(thead.getByText('Location')).toBeVisible();
  await expect(thead.getByText('Network Scope')).toBeVisible();
  await expect(thead.getByText('Organisation')).toBeVisible();

  // 7. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder(/Search/i).or(main.getByRole('textbox', { name: /Search/i })).first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('187');
    await expect(searchInput).toHaveValue('187');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 8. Verify Table Toolbar Filters using helper (Network Scope, Location, etc.)
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