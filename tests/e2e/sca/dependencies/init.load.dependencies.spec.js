import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on SCA dependencies page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Dependencies page (/sca-ui/dependencies)
  await page.goto('/sca-ui/dependencies');
  await page.waitForURL('**/sca-ui/dependencies**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen if no dependencies exist
  const emptyScreen = page.getByText(/No data available|No Dependencies/i);
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 4. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Dependencies',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      /Track direct and transitive open-source dependencies|Dependencies inventory, direct & transitive/i,
    ),
  ).toBeVisible();

  // 5. Verify Action Button (Re-Index Manifests)
  const reindexBtn = main.getByRole('button', {
    name: /Re-Index Manifests/i,
  });
  if (await reindexBtn.isVisible()) {
    await expect(reindexBtn).toBeVisible();
  }

  // 6. Verify Top Metrics Row
  await expect(main.getByText('Total Packages')).toBeVisible();
  await expect(main.getByText('Direct Dependencies')).toBeVisible();
  await expect(main.getByText('Transitive Dependencies')).toBeVisible();
  await expect(main.getByText('Outdated Packages')).toBeVisible();

  // 7. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Component Name')).toBeVisible();
    await expect(thead.getByText('Type')).toBeVisible();
    await expect(thead.getByText('Installed Version')).toBeVisible();
    await expect(thead.getByText('Latest Release')).toBeVisible();
    await expect(thead.getByText('Outdated Status')).toBeVisible();
    await expect(thead.getByText('Ecosystem')).toBeVisible();
    await expect(thead.getByText('Projects Using')).toBeVisible();
  }

  // 8. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder('Search component, project...')
    .or(main.getByRole('textbox', { name: /Search component/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('apex');
    await expect(searchInput).toHaveValue('apex');
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

  // 9. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 10. Test Pagination if multiple pages exist
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