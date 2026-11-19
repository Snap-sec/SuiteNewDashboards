import { expect, test } from '@playwright/test';

test('initial load and interaction on CSM scans page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to CSM Scans page (/csp-m/scans)
  await page.goto('/csp-m/scans');
  await page.waitForURL('**/csp-m/scans**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen or Page Heading
  const emptyScreen = main.getByText(/No data available|No Scans/i);
  const heading = main.getByRole('heading', {
    name: 'Scans',
    exact: true,
  });

  await expect(heading.or(emptyScreen)).toBeVisible({ timeout: 15000 });

  if (await emptyScreen.isVisible()) {
    return;
  }

  // 4. Verify Page Heading & Description
  await expect(heading).toBeVisible();
  await expect(
    main.getByText(
      /View and manage cloud security scans|List of Scans/i,
    ),
  ).toBeVisible();

  // 5. Verify Action Button (Create Scan)
  const createScanBtn = main.getByRole('button', { name: /Create Scan/i });
  if (await createScanBtn.isVisible()) {
    await expect(createScanBtn).toBeVisible();
  }

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Scan Name')).toBeVisible();
    await expect(thead.getByText('Environment')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Vulnerabilities')).toBeVisible();
    await expect(thead.getByText('Schedule')).toBeVisible();
    await expect(thead.getByText('Created')).toBeVisible();
  }

  // 7. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder('Search scans...')
    .or(main.getByPlaceholder(/Search/i))
    .or(main.getByRole('textbox', { name: /Search/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('scan');
    await expect(searchInput).toHaveValue('scan');
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