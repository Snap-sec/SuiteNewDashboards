import { expect, test } from '@playwright/test';

test('initial load and interaction on company profile page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Company Settings via Home workspace card or direct route
  const companySettingsCard = page
    .locator('div')
    .filter({ hasText: /^Company Settings/i })
    .first();

  if (await companySettingsCard.isVisible()) {
    await companySettingsCard.click();
  } else {
    await page.goto('/profile/account/company-profile');
  }

  await page.waitForURL('**/profile/account/company-profile**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify General Info Card and fields
  await expect(
    page.getByText('General Info', { exact: true }).or(page.getByRole('heading', { name: 'General Info' })),
  ).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Company Name', { exact: true })).toBeVisible();
  await expect(page.getByText('Company Website', { exact: true })).toBeVisible();

  // 4. Test General Info edit toggles
  const companyNameRow = page.locator('tr').filter({ hasText: 'Company Name' });
  const editCompanyNameBtn = companyNameRow.getByRole('button').first();
  if (await editCompanyNameBtn.isVisible()) {
    await editCompanyNameBtn.click();
    const companyNameInput = companyNameRow.locator('input');
    await expect(companyNameInput).toBeVisible();
    await editCompanyNameBtn.click();
  }

  const websiteRow = page.locator('tr').filter({ hasText: 'Company Website' });
  const editWebsiteBtn = websiteRow.getByRole('button').last();
  if (await editWebsiteBtn.isVisible()) {
    await editWebsiteBtn.click();
    const websiteInput = websiteRow.locator('input');
    await expect(websiteInput).toBeVisible();
    await editWebsiteBtn.click();
  }

  // 5. Verify Branding Card header and identity fields
  await expect(
    page.getByRole('heading', { name: 'Branding' }).or(page.getByText('Branding', { exact: true })),
  ).toBeVisible();
  await expect(page.getByText('Company Logo', { exact: true })).toBeVisible();
  await expect(page.getByText('Emblematic Corporate Identity Symbol')).toBeVisible();
  await expect(
    page.getByRole('img', { name: 'image' }).or(page.locator('img[alt="image"]')),
  ).toBeVisible();

  // 6. Verify Company Logo Url input
  const logoUrlInput = page
    .locator('input#companyLogoUrl')
    .or(page.getByPlaceholder('https://example.com/logo.png'));
  await expect(logoUrlInput).toBeVisible();

  // Test updating logo URL input
  const originalLogoUrl = await logoUrlInput.inputValue();
  await logoUrlInput.fill('https://snapsec.co/logo.png');
  await expect(logoUrlInput).toHaveValue('https://snapsec.co/logo.png');
  await logoUrlInput.fill(originalLogoUrl);

  // 7. Verify Brand Color section and color pickers
  await expect(page.getByText('Brand Color', { exact: true })).toBeVisible();
  await expect(page.getByText('Signature Palette Branding Element')).toBeVisible();

  // Primary color controls
  await expect(page.getByText('Primary Color', { exact: true })).toBeVisible();
  const primaryColorSection = page
    .locator('div')
    .filter({ hasText: /^Primary Color/ })
    .last();
  const primaryColorTextInput = primaryColorSection.locator('input[type="text"]');
  const primaryColorPicker = primaryColorSection.locator('input[type="color"]');
  await expect(primaryColorTextInput).toBeVisible();
  await expect(primaryColorPicker).toBeVisible();

  // Secondary color controls
  await expect(page.getByText('Secondary Color', { exact: true })).toBeVisible();
  const secondaryColorSection = page
    .locator('div')
    .filter({ hasText: /^Secondary Color/ })
    .last();
  const secondaryColorTextInput = secondaryColorSection.locator('input[type="text"]');
  const secondaryColorPicker = secondaryColorSection.locator('input[type="color"]');
  await expect(secondaryColorTextInput).toBeVisible();
  await expect(secondaryColorPicker).toBeVisible();

  // 8. Verify Save Changes button
  const saveChangesBtn = page.getByRole('button', { name: /Save Changes/i });
  if (await saveChangesBtn.isVisible()) {
    await expect(saveChangesBtn).toBeEnabled();
  }
});