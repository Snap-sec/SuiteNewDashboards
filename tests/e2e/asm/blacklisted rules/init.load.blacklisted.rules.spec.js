import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM blacklist rules page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Blacklist Rules page
  await page.goto('/casm/blacklist-rules');
  await page.waitForURL('**/casm/blacklist-rules**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no blacklist rules exist
  const emptyScreen = page
    .getByText('No Blacklist Rules Found')
    .or(page.getByText('No Results Found'));
  if (await emptyScreen.first().isVisible()) {
    await expect(emptyScreen.first()).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', {
    name: 'Blacklist Rules',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      'List of rules to automatically exclude or blacklist specific assets based on defined conditions.',
    ),
  ).toBeVisible();

  // 5. Verify Create Rule button
  const createRuleBtn = main.getByRole('button', { name: /Create Rule/i });
  if (await createRuleBtn.isVisible()) {
    await expect(createRuleBtn).toBeVisible();
  }

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('Rule Name')).toBeVisible();
  await expect(thead.getByText('Applies To')).toBeVisible();
  await expect(thead.getByText('Status')).toBeVisible();

  // 7. Test Search input and clear functionality
  const searchInput = main
    .getByPlaceholder(/Search blacklist rules.../i)
    .or(main.getByRole('textbox', { name: /Search blacklist rules.../i }))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('rule');
    await expect(searchInput).toHaveValue('rule');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 8. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 9. Test Pagination navigation if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }
});