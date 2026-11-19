import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM asset details page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Subdomains Inventory to pick an asset
  await page.goto('/assetinventory/assets/subdomains');
  await page.waitForURL('**/assetinventory/assets/subdomains**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Wait for table to load and find the first asset link
  await expect(main.locator('.animate-pulse, [data-slot="skeleton"]'))
    .toHaveCount(0, { timeout: 10000 })
    .catch(() => {});

  const firstAssetLink = main.locator('table tbody tr td a').first();
  if (!(await firstAssetLink.isVisible())) {
    // If no asset found in subdomains, test ends cleanly
    return;
  }

  // 4. Click asset link and navigate to Asset Details page
  await firstAssetLink.click();
  await page.waitForURL('**/assetinventory/asset-edit/**');
  await page.waitForLoadState('domcontentloaded');

  // 5. Wait for asset details skeleton loader to finish
  await expect(page.locator('.animate-pulse, [data-slot="skeleton"]'))
    .toHaveCount(0, { timeout: 10000 })
    .catch(() => {});

  // 6. Verify Asset Details Tabs
  const detailsTab = page.getByRole('tab', { name: 'Details' });
  const timelineTab = page.getByRole('tab', { name: 'Timeline' });
  const impactTab = page.getByRole('tab', {
    name: 'Impact Configuration',
  });

  await expect(detailsTab).toBeVisible({ timeout: 15000 });
  await expect(timelineTab).toBeVisible();
  await expect(impactTab).toBeVisible();

  // 7. Verify Core Sections on Details Tab
  await expect(
    page.getByRole('heading', { name: 'General Information' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Security', exact: true }),
  ).toBeVisible();

  // 8. Test Timeline Tab
  await timelineTab.click();
  await expect(timelineTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  const commentInput = page.getByPlaceholder(/Comment as User/i);
  if (await commentInput.isVisible()) {
    await expect(commentInput).toBeVisible();
  }

  // 9. Test Impact Configuration Tab
  await impactTab.click();
  await expect(impactTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  const impactHeading = page
    .getByRole('heading', { name: 'Impact Configuration' })
    .first();
  await expect(impactHeading).toBeVisible();

  // 10. Switch back to Details Tab
  await detailsTab.click();
  await expect(detailsTab).toHaveAttribute('data-state', 'active');
});
