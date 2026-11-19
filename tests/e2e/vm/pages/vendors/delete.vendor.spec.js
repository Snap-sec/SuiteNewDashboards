import { expect, test } from '@playwright/test';

test('dynamically delete a service vendor', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Service Vendors via Reports and Vendors sidebar menu
  const serviceVendorsLink = page.getByRole('link', {
    name: 'Service Vendors',
    exact: true,
  });
  if (!(await serviceVendorsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Reports and Vendors', exact: true })
      .click();
  }
  await expect(serviceVendorsLink).toBeVisible({ timeout: 10000 });
  await serviceVendorsLink.click();
  await page.waitForURL('**/vm/service-vendors**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 4. Locate the first vendor row and open the action menu
  const firstRow = main.locator('tbody tr').first();
  await expect(firstRow).toBeVisible();

  const actionBtn = firstRow
    .getByRole('button')
    .filter({ has: page.locator('svg.lucide-ellipsis') })
    .or(firstRow.getByRole('button', { name: 'Open menu' }))
    .first();
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();

  // 5. Click "Delete" option from the dropdown menu
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  const deleteMenuItem = menu.getByRole('menuitem', { name: 'Delete' });
  await expect(deleteMenuItem).toBeVisible();
  await deleteMenuItem.click();

  // 6. Verify Delete confirmation dialog is visible
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await expect(
    confirmDialog.getByText(/Are you sure you want to delete/i),
  ).toBeVisible();

  // 7. Confirm deletion
  const confirmDeleteBtn = confirmDialog.getByRole('button', {
    name: 'Delete Service Vendor',
  });
  await expect(confirmDeleteBtn).toBeVisible();
  await confirmDeleteBtn.click();
  await expect(confirmDialog).toBeHidden();

  // 8. Verify deletion feedback toast
  await expect(
    page.getByText(/Vendor deleted successfully/i).or(page.getByText(/Deleting vendor/i)),
  ).toBeVisible({ timeout: 10000 });
});