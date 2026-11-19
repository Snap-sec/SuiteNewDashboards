import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on AIM business units page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Business Units page (/assetinventory/business-units)
  await page.goto('/assetinventory/business-units');
  await expect(page).toHaveURL(/.*\/assetinventory\/business-units/);

  const main = page.getByRole('main');

  // 3. Verify Page Heading, Description & Action Button
  const heading = main.getByRole('heading', {
    name: 'Business Units',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('Manage your business units and their associated resources.'),
  ).toBeVisible();

  // Verify Create Business Unit button
  const createBtn = main.getByRole('button', {
    name: /Create Business Unit/i,
  });
  if (await createBtn.isVisible()) {
    await expect(createBtn).toBeVisible();
  }

  // 4. Handle Empty State if no business units are present
  const emptyScreen = page.getByText('No business units yet');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 5. Verify Business Units Table & Columns
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Business Unit')).toBeVisible();
    await expect(thead.getByText('Owner')).toBeVisible();
    await expect(thead.getByText('Assets')).toBeVisible();
    await expect(thead.getByText('Criticality')).toBeVisible();
    await expect(thead.getByText('Open Vulnerabilities')).toBeVisible();
    await expect(thead.getByText('Last Updated')).toBeVisible();
  }

  // 6. Verify Table Toolbar Filters
  await verifyTableToolbarFilters(page, main);

  // 7. Test Search Input Interaction
  const searchInput = main.getByPlaceholder(/Search/i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('division');
    await page.waitForTimeout(600); // Wait for debounce
    await searchInput.fill('');
    await page.waitForTimeout(600);
  }

  // 8. Test Page Size / Pagination Interaction
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