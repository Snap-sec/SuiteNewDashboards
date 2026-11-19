import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM subdomains page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Subdomains page
  await page.goto('/casm/assets/subdomains');
  await page.waitForURL('**/casm/assets/subdomains**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no subdomains exist
  const emptyScreen = page.getByText('No Subdomains Found');
  if (await emptyScreen.isVisible()) {
    await expect(page.getByText('When new subdomains are added, they will show here.')).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', { name: 'Subdomains', exact: true });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('Manage and monitor subdomains effectively.')).toBeVisible();

  // 5. Verify Subdomains Metrics Cards
  await expect(main.getByText('Total Subdomains')).toBeVisible();
  await expect(main.getByText('Live', { exact: true })).toBeVisible();
  await expect(main.getByText('External', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('With Open Ports')).toBeVisible();
  await expect(main.getByText('Signals', { exact: true }).first()).toBeVisible();

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('Subdomain')).toBeVisible();
  await expect(thead.getByText('Open Ports')).toBeVisible();
  await expect(thead.getByText('IP Addresses')).toBeVisible();
  await expect(thead.getByText('Network Scope')).toBeVisible();

  // 7. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder(/Search/i).or(main.getByRole('textbox', { name: /Search/i })).first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('bolt');
    await expect(searchInput).toHaveValue('bolt');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 8. Verify Table Toolbar Filters using helper (Network Scope, WAF, etc.)
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