import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on asset catalog page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Asset Catalog via sidebar
  const assetCatalogLink = page
    .getByRole('link', { name: 'Asset catalog' })
    .or(page.getByRole('button', { name: 'Asset catalog' }))
    .first();
  await expect(assetCatalogLink).toBeVisible();
  await assetCatalogLink.click();
  await page.waitForURL('**/vm/assets**');
  await page.waitForLoadState('domcontentloaded');

  // Tests all filters on this table automatically!
  await verifyTableToolbarFilters(page);

  // 4. Verify page header and title
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: /Assets? Catalog/i }),
  ).toBeVisible();
  await expect(
    main.getByText(
      'Maintain a centralized inventory of all organizational assets and their security posture.',
    ),
  ).toBeVisible();

  // 5. Verify Stats Cards / Metrics are rendered
  await expect(
    main.locator('[data-slot="card"]').or(main.locator('.grid')).first(),
  ).toBeVisible();

  // 6. Test Asset Type filter interaction
  const typeFilterBtn = main.getByRole('button', { name: /Asset Type|Type/i });
  if (await typeFilterBtn.isVisible()) {
    await typeFilterBtn.click();
    const firstOption = page
      .locator('[role="checkbox"]')
      .or(page.getByRole('checkbox'))
      .first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
      await firstOption.click();
    }
    await typeFilterBtn.click();
  }

  // 7. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder(/Search/i);
  await expect(searchInput).toBeVisible();

  await searchInput.fill('test');
  await expect(searchInput).toHaveValue('test');

  const clearButton = main.locator('button:has(svg.lucide-x)');
  if (await clearButton.isVisible()) {
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  }

  // 8. Test pagination if multiple pages are present
  const page2Button = main.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  }
});
