import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on WAS vulnerabilities page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to WAS Vulnerabilities page (/was/vulnerablities)
  await page.goto('/was/vulnerablities');
  await page.waitForURL('**/was/vulnerablities**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty Screen if no vulnerabilities exist
  const emptyScreen = page.getByText('No Vulnerabilities Found');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    await expect(
      page.getByText(
        'When new vulnerabilities are Found, they will show here.',
      ),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Goto Applications/i }),
    ).toBeVisible();
    return;
  }

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 4. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Vulnerabilities',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      /Identify, track, and manage vulnerabilities discovered across your applications|List of Vulnerabilities/i,
    ),
  ).toBeVisible();

  // 5. Verify Severity Metrics Cards
  await expect(main.getByText('Critical').first()).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('High').first()).toBeVisible();
  await expect(main.getByText('Medium').first()).toBeVisible();
  await expect(main.getByText('Low').first()).toBeVisible();
  await expect(main.getByText('Info').first()).toBeVisible();

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Title')).toBeVisible();
    await expect(thead.getByText('CWE')).toBeVisible();
    await expect(thead.getByText('Severity')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Application')).toBeVisible();
    await expect(thead.getByText('Detected On')).toBeVisible();
  }

  // 7. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder(/Search Vulnerabilities/i)
    .or(main.getByRole('textbox', { name: /Search Vulnerabilities/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('inclu');
    await expect(searchInput).toHaveValue('inclu');
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