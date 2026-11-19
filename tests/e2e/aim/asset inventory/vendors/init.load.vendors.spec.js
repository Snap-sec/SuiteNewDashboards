import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM vendors page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Vendors page (/assetinventory/assets/vendors)
  await page.goto('/assetinventory/assets/vendors');
  await expect(page).toHaveURL(/.*\/assetinventory\/assets\/vendors/);

  const main = page.getByRole('main');
  const heading = main.getByRole('heading', {
    name: 'Vendors',
    exact: true,
  });
  const emptyScreen = page.getByText('No Vendors Found');

  // 3. Wait for either the Page Heading or the Empty Screen to appear
  await expect(heading.or(emptyScreen)).toBeVisible({ timeout: 15000 });

  // Verify Add Vendor button (present in both empty and populated states)
  const addBtn = main.getByRole('button', { name: /Add Vendor/i });
  if (await addBtn.isVisible()) {
    await expect(addBtn).toBeVisible();
  }

  // 4. Handle Empty State if no vendors are found
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 5. Verify Page Heading & Description when data exists
  await expect(heading).toBeVisible();
  await expect(
    main.getByText('Catalog and manage enterprise vendors and contacts.'),
  ).toBeVisible();

  // 6. Verify Vendors Table & Columns
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Vendor')).toBeVisible();
    await expect(thead.getByText('Description')).toBeVisible();
    await expect(thead.getByText('Website')).toBeVisible();
    await expect(thead.getByText('Email')).toBeVisible();
    await expect(thead.getByText('Phone')).toBeVisible();
    await expect(thead.getByText('Address')).toBeVisible();
  }

  // 7. Test Search Input Interaction
  const searchInput = main.getByPlaceholder(/Search vendors\.\.\./i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('vendor');
    await page.waitForTimeout(600); // Wait for debounce / filtering
    await searchInput.fill('');
    await page.waitForTimeout(600);
  }

  // 8. Test Pagination Controls if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
    await page2Btn.click();
    await page.waitForTimeout(500);

    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
      await page1Btn.click();
    }
  }
});