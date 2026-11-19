import { expect, test } from '@playwright/test';

test('dynamically delete a business unit', async ({ page }) => {
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

  // 5. Open Delete confirmation dialog from Details tab
  const deleteButton = page
    .getByRole('button', { name: 'Delete this business unit' })
    .or(page.locator('button:has(svg.lucide-trash-2)'))
    .first();
  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  // 6. Verify confirmation dialog is visible
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await expect(
    confirmDialog.getByRole('heading', { name: 'Are you sure?' }),
  ).toBeVisible();

  // 7. Click confirm Delete button
  const confirmDeleteBtn = confirmDialog.getByRole('button', {
    name: 'Delete',
  });
  await expect(confirmDeleteBtn).toBeVisible();
  await confirmDeleteBtn.click();

  // 8. Verify deletion success toast and navigation back to business units page
  await expect(
    page.getByText(/Business unit Deleted/i),
  ).toBeVisible({ timeout: 15000 });
  await page.waitForURL('**/vm/business-units**');
});