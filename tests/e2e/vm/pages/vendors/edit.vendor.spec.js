import { expect, test } from '@playwright/test';

test('edit service vendor details dynamically', async ({ page }) => {
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

  // 5. Click "Edit" option in the dropdown menu
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  const editMenuItem = menu.getByRole('menuitem', { name: 'Edit' });
  await expect(editMenuItem).toBeVisible();
  await editMenuItem.click();

  // 6. Verify Edit Service Vendor dialog is displayed
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'Edit Service Vendor' }),
  ).toBeVisible();

  // 7. Generate dynamic update data (Name schema: alphabets and spaces only, max 30 chars)
  const charSuffix = Date.now()
    .toString()
    .split('')
    .map((d) => String.fromCharCode(97 + Number(d)))
    .slice(-6)
    .join('');
  const updatedName = `Upd Vendor ${charSuffix}`;
  const updatedEmail = `upd_vendor_${Date.now()}@example.com`;
  const updatedPhone = '15559876543';
  const updatedAddress = '789 Enterprise Way, Tech City';
  const updatedDesc = 'Automated test updated service vendor description';

  // 8. Fill updated values in the dialog
  const nameInput = dialog.getByRole('textbox', {
    name: /Service Vendor Name/i,
  });
  await nameInput.fill(updatedName);
  await expect(nameInput).toHaveValue(updatedName);

  const emailInput = dialog.getByRole('textbox', { name: /Email/i });
  await emailInput.fill(updatedEmail);
  await expect(emailInput).toHaveValue(updatedEmail);

  const phoneInput = dialog.getByRole('textbox', { name: /Phone/i });
  await phoneInput.fill(updatedPhone);
  await expect(phoneInput).toHaveValue(updatedPhone);

  const addressInput = dialog.getByRole('textbox', { name: /Address/i });
  await addressInput.fill(updatedAddress);
  await expect(addressInput).toHaveValue(updatedAddress);

  const descInput = dialog.getByRole('textbox', {
    name: /Description/i,
  });
  await descInput.fill(updatedDesc);
  await expect(descInput).toHaveValue(updatedDesc);

  // 9. Save changes and ensure dialog is dismissed
  const saveBtn = dialog.getByRole('button', { name: 'Save Changes' });
  await expect(saveBtn).toBeVisible();
  await saveBtn.click();
  await expect(dialog).toBeHidden();

  // 10. Verify that the updated vendor name is visible in the table
  await expect(main.getByText(updatedName).first()).toBeVisible({
    timeout: 10000,
  });
});