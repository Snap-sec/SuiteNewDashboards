import { expect, test } from '@playwright/test';

test('initial load and interaction on CSM environments page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to CSM Environments page (/csp-m/accounts)
  await page.goto('/csp-m/accounts');
  await page.waitForURL('**/csp-m/accounts**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen or Page Heading
  const emptyScreen = main.getByText(/No Environments Found|No data available/i);
  const heading = main.getByRole('heading', {
    name: 'Environments',
    exact: true,
  });

  await expect(heading.or(emptyScreen)).toBeVisible({ timeout: 15000 });

  if (await emptyScreen.isVisible()) {
    await expect(
      page.getByText('You have not connected any cloud environments yet!'),
    ).toBeVisible();
    return;
  }

  // 4. Verify Page Heading & Description
  await expect(heading).toBeVisible();
  await expect(
    main.getByText(/Manage connected cloud environments|Manage your connected CSM environments/i),
  ).toBeVisible();

  // 5. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder('Search Environments')
    .or(main.getByRole('textbox', { name: /Search Environments/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('goo');
    await expect(searchInput).toHaveValue('goo');
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

  // 6. Test Pagination if multiple pages exist
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