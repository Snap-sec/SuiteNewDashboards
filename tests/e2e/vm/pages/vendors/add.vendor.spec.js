import { expect, test } from '@playwright/test';

test('add service vendor with dynamic data', async ({ page }) => {
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

  // 4. Open Add Service Vendor modal
  const addVendorBtn = main.getByRole('button', { name: 'Add Service Vendor' });
  await expect(addVendorBtn).toBeVisible();
  await addVendorBtn.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'Add New Service Vendor' }),
  ).toBeVisible();

  // 5. Generate dynamic data (Name schema: only alphabets and spaces, max 30 chars)
  const charSuffix = Date.now()
    .toString()
    .split('')
    .map((d) => String.fromCharCode(97 + Number(d)))
    .slice(-6)
    .join('');
  const vendorName = `Vendor ${charSuffix}`;
  const vendorEmail = `vendor_${Date.now()}@example.com`;
  const vendorPhone = '15551234567';
  const vendorAddress = '123 Security Avenue, Tech City';
  const vendorLogo = 'https://example.com/logo.png';
  const vendorDesc = 'Automated test service vendor';

  // 6. Fill form fields
  await dialog
    .getByRole('textbox', { name: /Service Vendor Name/i })
    .fill(vendorName);
  await dialog.getByRole('textbox', { name: /Email/i }).fill(vendorEmail);
  await dialog.getByRole('textbox', { name: /Phone/i }).fill(vendorPhone);
  await dialog.getByRole('textbox', { name: /Address/i }).fill(vendorAddress);
  await dialog.getByRole('textbox', { name: /Logo URL/i }).fill(vendorLogo);
  await dialog
    .getByRole('textbox', { name: /Description/i })
    .fill(vendorDesc);

  // 7. Submit form and ensure dialog closes
  await dialog.getByRole('button', { name: 'Add Service Vendor' }).click();
  await expect(dialog).toBeHidden();

  // 8. Verify registration success toast
  await expect(
    page.getByText(/Vendor registered successfully/i).or(page.getByText(/Registering vendor/i)),
  ).toBeVisible({ timeout: 15000 });

  // 9. Verify the newly created vendor is rendered in the list/table (use search if paginated)
  const vendorLocator = main.getByText(vendorName).first();
  if (!(await vendorLocator.isVisible())) {
    const searchInput = main
      .getByPlaceholder('Search...')
      .or(main.getByRole('textbox', { name: /Search/i }))
      .first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(vendorName);
    }
  }

  await expect(vendorLocator).toBeVisible({ timeout: 10000 });
});