import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('dynamically manage associated assets in business unit details', async ({
  page,
}) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Business Units via sidebar
  const businessUnitsLink = page
    .getByRole('link', { name: 'Business Units' })
    .or(page.getByRole('button', { name: 'Business Units' }))
    .first();
  await expect(businessUnitsLink).toBeVisible();
  await businessUnitsLink.click();
  await page.waitForURL('**/vm/business-units**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Dynamically locate and navigate to the first Business Unit
  const firstBusinessUnitCard = page
    .locator('a[href*="/vm/business-units/"]')
    .first();
  await expect(firstBusinessUnitCard).toBeVisible();
  await firstBusinessUnitCard.click();
  await page.waitForURL('**/vm/business-units/**');
  await page.waitForLoadState('domcontentloaded');

  // 5. Navigate to Associated Assets tab
  const assetsTab = page.getByRole('tab', { name: 'Associated Assets' });
  await expect(assetsTab).toBeVisible();
  await assetsTab.click();
  await expect(assetsTab).toHaveAttribute('data-state', 'active');
  const tabpanel = page.getByRole('tabpanel');
  await expect(tabpanel).toBeVisible();

  // 6. Test Add Assets modal flow
  const addAssetsBtn = page.getByRole('button', { name: 'Add Assets' }).first();
  if (await addAssetsBtn.isVisible()) {
    await addAssetsBtn.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Wait for skeleton loaders to finish loading assets
    await expect(
      modal.locator('.animate-pulse, [data-slot="skeleton"]'),
    ).toHaveCount(0, { timeout: 10000 }).catch(() => {});

    // Test asset search inside modal
    const modalSearchInput = modal.getByPlaceholder('Type to search assets');
    if (await modalSearchInput.isVisible()) {
      await modalSearchInput.fill('api');
      await expect(modalSearchInput).toHaveValue('api');
      await modalSearchInput.fill('');
      // Allow debounced search to settle and network requests to finish
      await page.waitForTimeout(600);
    }

    // Toggle the first available asset checkbox in the list
    const firstAssetRow = modal
      .locator('.bg-card')
      .locator('[role="checkbox"]')
      .first();
    if (await firstAssetRow.isVisible()) {
      await firstAssetRow.click();
    }

    // Click Update Assets
    const updateAssetsBtn = modal.getByRole('button', {
      name: 'Update Assets',
    });
    if (await updateAssetsBtn.isVisible()) {
      await updateAssetsBtn.click();
      await expect(
        page
          .getByText(/Assets updated successfully|No changes to save/i)
          .first(),
      ).toBeVisible({ timeout: 15000 });
    }

    // Ensure modal is closed before continuing table interactions
    if (await modal.isVisible()) {
      const closeBtn = modal
        .locator('button:has(svg.lucide-x)')
        .or(modal.getByRole('button', { name: /Close|Cancel/i }))
        .first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await expect(modal).toBeHidden();
    }
  }

  // 7. Test Table Toolbar Filters
  await verifyTableToolbarFilters(page, tabpanel);

  // 8. Test Assets Search input and clear functionality
  const searchInput = tabpanel.getByPlaceholder('Search Assets');
  if (await searchInput.isVisible()) {
    await searchInput.fill('test');
    await expect(searchInput).toHaveValue('test');

    const clearButton = tabpanel.locator('button:has(svg.lucide-x)').first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 9. Test pagination if present
  const page2Btn = tabpanel.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = tabpanel.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }

//   10. Test Removing an Associated Asset if rows are present
    const firstRowActions = tabpanel
      .locator('tbody tr')
      .first()
      .getByRole('button', { name: 'Open menu' })
      .or(tabpanel.locator('tbody tr').first().locator('button:has(svg.lucide-more-horizontal)'));

    if (await firstRowActions.isVisible()) {
      await firstRowActions.click();

      const removeOption = page.getByRole('button', {
        name: 'Remove Association',
      });
      if (await removeOption.isVisible()) {
        await removeOption.click();

        const confirmBtn = page.getByRole('button', { name: 'Confirm' });
        await expect(confirmBtn).toBeVisible();
        await confirmBtn.click();

        await expect(
          page.getByText(/Asset removed successfully/i),
        ).toBeVisible({ timeout: 15000 });
      }
    }
});
