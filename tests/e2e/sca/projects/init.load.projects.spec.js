import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on SCA code repos page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Code Repos page (/sca-ui/projects)
  await page.goto('/sca-ui/projects');
  await page.waitForURL('**/sca-ui/projects**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen or Heading (wait for API response)
  const emptyScreen = page
    .getByRole('heading', { name: /Nothing to Display|No Repositories/i })
    .or(page.getByText(/No data available|No Repositories/i));
  const heading = main.getByRole('heading', {
    name: /Code Repositories|Code Repos/i,
  });

  await expect(heading.or(emptyScreen).first()).toBeVisible({ timeout: 15000 });

  if (await emptyScreen.first().isVisible()) {
    await expect(emptyScreen.first()).toBeVisible();
    return;
  }

  // 4. Verify Page Heading & Description
  await expect(heading).toBeVisible();
  await expect(
    main.getByText(
      /Monitor source-code repositories, package manifests|Monitored repositories, package manifests/i,
    ),
  ).toBeVisible();

  // 5. Verify Top Metrics Row
  await expect(main.getByText('Monitored Repos', { exact: true })).toBeVisible();
  await expect(main.getByText('Dependencies Scanned')).toBeVisible();
  await expect(main.getByText('Vulnerable Repos')).toBeVisible();
  await expect(main.getByText('Safe Repositories')).toBeVisible();
  await expect(main.getByText('Passing Rate')).toBeVisible();

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Repository')).toBeVisible();
    await expect(thead.getByText('Branch')).toBeVisible();
    await expect(thead.getByText('Ecosystem')).toBeVisible();
    await expect(thead.getByText('Packages')).toBeVisible();
    await expect(thead.getByText('CVE Severity Breakdown')).toBeVisible();
    await expect(thead.getByText('Last Scan')).toBeVisible();
  }

  // 7. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder('Search repo or branch...')
    .or(main.getByRole('textbox', { name: /Search repo/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('apisec');
    await expect(searchInput).toHaveValue('apisec');
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

  // 8. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 9. Test Pagination if multiple pages exist
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