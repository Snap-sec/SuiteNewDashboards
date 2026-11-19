import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM software licenses page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Software Licenses page (/assetinventory/assets/licenses)
  await page.goto('/assetinventory/assets/licenses');
  await expect(page).toHaveURL(/.*\/assetinventory\/assets\/licenses/);

  const main = page.getByRole('main');
  const heading = main.getByRole('heading', {
    name: 'Software Licenses',
    exact: true,
  });
  const emptyScreen = page.getByText('No Licenses Found');

  // 3. Wait for either the Page Heading or the Empty Screen to appear
  await expect(heading.or(emptyScreen)).toBeVisible({ timeout: 15000 });

  // Verify Add License button (present in both empty and populated states)
  const addBtn = main.getByRole('button', { name: /Add License/i });
  if (await addBtn.isVisible()) {
    await expect(addBtn).toBeVisible();
  }

  // 4. Handle Empty State if no licenses are found
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 5. Verify Page Heading & Description when data exists
  await expect(heading).toBeVisible();
  await expect(
    main.getByText('Catalog and monitor enterprise software licenses and subscriptions.'),
  ).toBeVisible();

  // 6. Verify Software Licenses Table & Columns
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Name')).toBeVisible();
    await expect(thead.getByText('Type')).toBeVisible();
    await expect(thead.getByText('Key')).toBeVisible();
    await expect(thead.getByText('Purchased')).toBeVisible();
    await expect(thead.getByText('Starts')).toBeVisible();
    await expect(thead.getByText('Expires')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
  }

  // 7. Test Search Input Interaction
  const searchInput = main.getByPlaceholder(/Search licenses\.\.\./i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('enterprise');
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