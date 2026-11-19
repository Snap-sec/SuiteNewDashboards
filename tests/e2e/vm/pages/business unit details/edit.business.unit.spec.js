import { expect, test } from '@playwright/test';

test('dynamically edit business unit details', async ({ page }) => {
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

  // 4. Create a dedicated Business Unit to guarantee an editable resource exists
  const dynamicId = Date.now().toString().slice(-4);
  const initialName = `EditTest BU ${dynamicId}`;

  const createBtn = page
    .getByRole('button', { name: 'Create Business Unit' })
    .first();
  await expect(createBtn).toBeVisible({ timeout: 10000 });
  await createBtn.click();

  const createModal = page
    .getByRole('dialog')
    .filter({ hasText: 'Create Business Unit' });
  await expect(createModal).toBeVisible();

  const nameInput = createModal.getByPlaceholder('e.g. Tech Division');
  await expect(nameInput).toBeVisible();
  await nameInput.fill(initialName);

  const descInput = createModal.getByPlaceholder('Describe this business unit');
  await expect(descInput).toBeVisible();
  await descInput.fill('Business unit for edit test suite');

  const ownerCombobox = createModal.getByRole('combobox').first();
  if (await ownerCombobox.isVisible()) {
    await ownerCombobox.click();
    const firstOption = page.getByRole('option').first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();
  }

  const logoInput = createModal.getByPlaceholder('https://example.com/logo.png');
  await expect(logoInput).toBeVisible();
  await logoInput.fill('https://example.com/logo.png');

  const submitCreateBtn = createModal
    .getByRole('button', { name: 'Create Business Unit' })
    .last();
  await expect(submitCreateBtn).toBeEnabled();
  await submitCreateBtn.click();
  await expect(createModal).toBeHidden({ timeout: 10000 });

  // 5. Locate and navigate to the newly created Business Unit
  const targetCard = page
    .locator('a[href*="/vm/business-units/"]')
    .filter({ hasText: initialName })
    .or(page.locator('a[href*="/vm/business-units/"]').first())
    .first();
  await expect(targetCard).toBeVisible({ timeout: 10000 });
  await targetCard.click();
  await page.waitForURL('**/vm/business-units/**');
  await page.waitForLoadState('domcontentloaded');

  // 6. Open Edit Business Unit modal from Details tab
  const editButton = page
    .getByRole('button', { name: 'Edit Business Unit' })
    .or(page.locator('button:has(svg.lucide-square-pen)'))
    .first();
  await expect(editButton).toBeVisible({ timeout: 10000 });
  await editButton.click();

  const editModal = page
    .getByRole('dialog')
    .filter({ hasText: 'Edit Business Unit' });
  await expect(editModal).toBeVisible();
  await expect(editModal.getByText('Edit Business Unit').first()).toBeVisible();

  // 7. Update Name
  const updatedName = `Division Upd ${dynamicId}`;
  const editNameInput = editModal.getByPlaceholder('Business Unit Name');
  await expect(editNameInput).toBeVisible();
  await editNameInput.fill(updatedName);
  await expect(editNameInput).toHaveValue(updatedName);

  // 8. Update Description
  const updatedDesc = `Updated description ${dynamicId}`;
  const editDescInput = editModal.getByPlaceholder('Describe this business unit');
  await expect(editDescInput).toBeVisible();
  await editDescInput.fill(updatedDesc);
  await expect(editDescInput).toHaveValue(updatedDesc);

  // 9. Update Avatar / Logo URL
  const avatarInput = editModal.getByPlaceholder('https://example.com/image.png');
  await expect(avatarInput).toBeVisible();
  await avatarInput.fill('https://example.com/logo-updated.png');
  await expect(avatarInput).toHaveValue('https://example.com/logo-updated.png');

  // 10. Submit Update
  const updateButton = editModal.getByRole('button', {
    name: 'Update Business Unit',
  });
  await expect(updateButton).toBeVisible();
  await updateButton.click();

  // 11. Verify success toast and modal dismissal
  await expect(
    page.getByText(/Business Unit updated successfully/i),
  ).toBeVisible({ timeout: 15000 });
  await expect(editModal).toBeHidden({ timeout: 10000 });
});