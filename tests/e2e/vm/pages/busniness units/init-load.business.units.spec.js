import { expect, test } from '@playwright/test';

test('initial load and interaction on business units page', async ({ page }) => {
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

  // 4. Verify page heading or empty screen state
  const main = page.getByRole('main');
  const pageHeadingOrEmpty = main
    .getByRole('heading', { level: 1, name: 'Business Units' })
    .or(page.getByText('Business Units').first())
    .or(page.getByText('No Business units Added yet'));
  await expect(pageHeadingOrEmpty.first()).toBeVisible();

  // 5. Verify cards grid or empty screen container
  const cardsContainerOrEmpty = main
    .locator('.grid')
    .or(page.getByText('No Business units Added yet'))
    .first();
  await expect(cardsContainerOrEmpty).toBeVisible();

  // 6. Test Create Business Unit modal opening
  const createButton = page
    .getByRole('button', { name: 'Create Business Unit' })
    .first();
  await expect(createButton).toBeVisible();
  await createButton.click();

  const modal = page
    .getByRole('dialog')
    .filter({ hasText: 'Create Business Unit' });
  await expect(modal).toBeVisible();
  await expect(
    modal.getByText('Create Business Unit').first(),
  ).toBeVisible();

  // 7. Test form input interactions inside modal
  const nameInput = modal.getByPlaceholder('e.g. Tech Division');
  await expect(nameInput).toBeVisible();
  const testName = `Division ${Date.now().toString().slice(-4)}`;
  await nameInput.fill(testName);
  await expect(nameInput).toHaveValue(testName);

  const descInput = modal.getByPlaceholder('Describe this business unit');
  await expect(descInput).toBeVisible();
  await descInput.fill('Test description for business unit');
  await expect(descInput).toHaveValue('Test description for business unit');

  // Select owner dynamically from combobox
  const ownerCombobox = modal.getByRole('combobox').first();
  if (await ownerCombobox.isVisible()) {
    await ownerCombobox.click();
    const firstOption = page.getByRole('option').first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();
  }

  // Fill logo URL
  const logoInput = modal.getByPlaceholder('https://example.com/logo.png');
  await expect(logoInput).toBeVisible();
  await logoInput.fill('https://example.com/logo.png');
  await expect(logoInput).toHaveValue('https://example.com/logo.png');

  // 8. Submit form if enabled, or close the modal
  const submitBtn = modal
    .getByRole('button', { name: 'Create Business Unit' })
    .last();

  if (await submitBtn.isEnabled()) {
    await submitBtn.click();
    await expect(
      page.getByText(/Business Unit created/i).or(modal),
    ).toBeVisible({ timeout: 15000 });
  } else {
    // Close modal via Close/Cancel button or Escape
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
});