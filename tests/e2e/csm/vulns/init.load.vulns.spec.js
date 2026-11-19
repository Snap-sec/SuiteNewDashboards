import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on CSM vulnerabilities page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to CSM Vulnerabilities page (/csp-m/vulnerabilities)
  await page.goto('/csp-m/vulnerabilities');
  await page.waitForURL('**/csp-m/vulnerabilities**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.px-4')).or(page.locator('.p-4'));

  // 3. Handle Empty Screen or Page Heading
  const emptyScreen = main.getByText(/No Vulnerabilities Found|No data available/i);
  const heading = main.getByRole('heading', {
    name: /All Vulnerabilities|Vulnerabilities/i,
  });

  await expect(heading.or(emptyScreen)).toBeVisible({ timeout: 15000 });

  if (await emptyScreen.isVisible()) {
    return;
  }

  // 4. Verify Page Heading & Description
  await expect(heading).toBeVisible();
  await expect(
    main.getByText(
      /View, filter, and manage cloud security findings|List of All Vulnerabilities|List of Vulnerabilities/i,
    ),
  ).toBeVisible();

  // 5. Verify Metrics Cards Strip
  await expect(main.getByText('In Review', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('Triaged', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('Duplicate', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('Retest', { exact: true }).first()).toBeVisible();

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Title')).toBeVisible();
    await expect(thead.getByText('Owner')).toBeVisible();
    await expect(thead.getByText('State')).toBeVisible();
    await expect(thead.getByText('Severity')).toBeVisible();
    await expect(thead.getByText('Reported On')).toBeVisible();
  }

  // 7. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder(/Search/i)
    .or(main.getByRole('textbox', { name: /Search/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('audit');
    await expect(searchInput).toHaveValue('audit');
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