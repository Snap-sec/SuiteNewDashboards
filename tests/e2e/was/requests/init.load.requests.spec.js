import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on WAS API requests page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to WAS Requests page (/was/requests)
  await page.goto('/was/requests');
  await page.waitForURL('**/was/requests**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty Screen if no requests exist
  const emptyScreen = page.getByText(
    'Looks like there are no requests, Add one through integrations.',
  );
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Goto Integration/i }),
    ).toBeVisible();
    return;
  }

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 4. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'API Requests',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      /Discover, inventory, and monitor API endpoints|Inventory of discovered API endpoints/i,
    ),
  ).toBeVisible();

  // 5. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('URL')).toBeVisible();
    await expect(thead.getByText('Method')).toBeVisible();
    await expect(thead.getByText('Application')).toBeVisible();
    await expect(thead.getByText('Total Vulns')).toBeVisible();
  }

  // 6. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder(/Search/i)
    .or(main.getByRole('textbox', { name: /Search/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('redirect');
    await expect(searchInput).toHaveValue('redirect');
    await page.waitForTimeout(600); // Wait for debounce

    // Clear search
    const clearSearchBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearSearchBtn.isVisible()) {
      await clearSearchBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
    await page.waitForTimeout(600);
  }

  // 7. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

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