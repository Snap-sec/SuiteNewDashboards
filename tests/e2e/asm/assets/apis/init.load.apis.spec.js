import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM APIs page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM APIs page
  await page.goto('/casm/assets/apis');
  await page.waitForURL('**/casm/assets/apis**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no APIs exist
  const emptyScreen = page.getByText('No APIs Found');
  if (await emptyScreen.isVisible()) {
    await expect(
      page.getByText('When new APIs are discovered, they will show here.'),
    ).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', { name: 'APIs', exact: true });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('Manage and monitor discovered APIs.'),
  ).toBeVisible();

  // 5. Verify APIs Metrics Cards
  await expect(main.getByText('Total Endpoints')).toBeVisible();
  await expect(main.getByText('JSON APIs')).toBeVisible();
  await expect(main.getByText('200 OK')).toBeVisible();
  await expect(main.getByText('Total External')).toBeVisible();
  await expect(
    main.getByText('Total Signals', { exact: true }).first(),
  ).toBeVisible();

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('Host')).toBeVisible();
  await expect(thead.getByText('Endpoint')).toBeVisible();
  await expect(thead.getByText('Discovery Technique')).toBeVisible();
  await expect(thead.getByText('Status Code')).toBeVisible();
  await expect(thead.getByText('Network Scope')).toBeVisible();

  // 7. Test Search input and clear functionality
  const searchInput = main
    .getByPlaceholder(/Search/i)
    .or(main.getByRole('textbox', { name: /Search/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('api');
    await expect(searchInput).toHaveValue('api');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 8. Verify Table Toolbar Filters using helper (Status Code, Network Scope, etc.)
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
