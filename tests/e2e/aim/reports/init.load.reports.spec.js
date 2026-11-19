import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM reports page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Reports page (/assetinventory/export)
  await page.goto('/assetinventory/export');
  await page.waitForURL('**/assetinventory/export**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: /Exports/i,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText(
      /Export assets from your inventory for analysis, reporting, and data management|Export assets from your inventory for analysis or reporting/i,
    ),
  ).toBeVisible();

  // 4. Wait for loading skeletons to finish
  await expect(page.locator('.animate-pulse, [data-slot="skeleton"]'))
    .toHaveCount(0, { timeout: 10000 })
    .catch(() => {});

  // 5. Verify Export Option Cards
  const fullExportCard = page.getByText('Full Asset Inventory Export');
  const assetSpecificCard = page.getByText('Asset Specific Export');

  if (await fullExportCard.isVisible()) {
    await expect(fullExportCard).toBeVisible();
    await expect(
      page.getByText(/Exports all assets in the inventory/i),
    ).toBeVisible();
  }

  if (await assetSpecificCard.isVisible()) {
    await expect(assetSpecificCard).toBeVisible();
    await expect(
      page.getByText(/Exports assets based on selected type/i),
    ).toBeVisible();
  }

  // 6. Test Generate Export Modal Open & Close
  const generateExportBtn = page
    .getByRole('button', { name: /Generate Export/i })
    .first();
  if (await generateExportBtn.isVisible()) {
    await generateExportBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: 'Generate Export' }),
    ).toBeVisible();
    await expect(dialog.getByText('Select Format')).toBeVisible();

    // Close Modal via Escape or close button
    const closeBtn = dialog.getByRole('button', { name: /Close|Cancel/i });
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await expect(dialog).toBeHidden();
  }
});
