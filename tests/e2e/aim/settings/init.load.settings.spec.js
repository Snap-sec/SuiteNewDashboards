import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM settings page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Settings page (/assetinventory/settings)
  await page.goto('/assetinventory/settings');
  await page.waitForURL('**/assetinventory/settings**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: /Settings/i,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText(
      /Configure inventory adapters, workflows, ownership, fields, tags, and global settings|Manage asset inventory settings and options/i,
    ),
  ).toBeVisible();

  // 4. Verify All Settings Tabs
  const adapterTab = page.getByRole('tab', { name: 'Adapter Settings' });
  const globalTab = page.getByRole('tab', { name: 'Global Settings' });
  const decommissionTab = page.getByRole('tab', {
    name: 'Decommission Workflow',
  });
  const ownershipTab = page.getByRole('tab', { name: 'Default Ownership' });
  const customFieldsTab = page.getByRole('tab', { name: 'Custom Fields' });
  const tagsTab = page.getByRole('tab', { name: 'Tags' });

  await expect(adapterTab).toBeVisible();
  await expect(globalTab).toBeVisible();
  await expect(decommissionTab).toBeVisible();
  await expect(ownershipTab).toBeVisible();
  await expect(customFieldsTab).toBeVisible();
  await expect(tagsTab).toBeVisible();

  // 5. Verify Adapter Settings (Default Tab)
  await expect(
    page.getByRole('heading', { name: 'Global Sync Configuration' }),
  ).toBeVisible();
  await expect(page.getByText('Enable Auto Sync')).toBeVisible();
  await expect(page.getByText('Sync Schedule')).toBeVisible();

  // 6. Test Global Settings Tab
  await globalTab.click();
  await expect(globalTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  await expect(
    page.getByRole('heading', { name: 'Global Asset Search' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Edit Asset' })).toBeVisible();

  // 7. Test Decommission Workflow Tab
  await decommissionTab.click();
  await expect(decommissionTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  await expect(
    page.getByRole('heading', { name: 'Eligible Approvers' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Save Configuration' }),
  ).toBeVisible();

  // 8. Test Default Ownership Tab
  await ownershipTab.click();
  await expect(ownershipTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  await expect(page.getByText('Asset Ownership Mapping')).toBeVisible();

  // 9. Test Custom Fields Tab
  await customFieldsTab.click();
  await expect(customFieldsTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  const customFieldsHeading = page
    .getByRole('heading', { name: 'Custom Fields' })
    .first();
  await expect(customFieldsHeading).toBeVisible();

  const searchFieldsInput = page.getByPlaceholder(/Search fields/i);
  if (await searchFieldsInput.isVisible()) {
    await searchFieldsInput.fill('date');
    await page.waitForTimeout(600); // Wait for filter debounce

    // Clear search input
    const clearFieldsBtn = page.locator('button:has(svg.lucide-x)');
    if (await clearFieldsBtn.isVisible()) {
      await clearFieldsBtn.click();
    } else {
      await searchFieldsInput.fill('');
    }
    await page.waitForTimeout(600);
  }

  // 10. Test Tags Tab
  await tagsTab.click();
  await expect(tagsTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  const tagsHeading = page.getByRole('heading', { name: 'Tags' }).first();
  await expect(tagsHeading).toBeVisible();
  await expect(
    page.getByText(/Tags help you group and/i),
  ).toBeVisible();

  // 11. Switch back to Adapter Settings Tab
  await adapterTab.click();
  await expect(adapterTab).toHaveAttribute('data-state', 'active');
});