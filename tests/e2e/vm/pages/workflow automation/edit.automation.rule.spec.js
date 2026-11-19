import { expect, test } from '@playwright/test';

test('dynamically edit an automation rule', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Workflow Automation via sidebar menu
  const automationLink = page.getByRole('link', {
    name: 'Workflow Automation',
  });
  await expect(automationLink).toBeVisible({ timeout: 10000 });
  await automationLink.click();
  await page.waitForURL('**/vm/automation-engine**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Trigger Edit modal from the details header (or sidebar menu)
  const editRuleTrigger = page
    .getByRole('button', { name: /Edit rule/i })
    .or(page.getByText('Edit rule'))
    .first();
  await expect(editRuleTrigger).toBeVisible({ timeout: 10000 });
  await editRuleTrigger.click();

  const dialog = page.getByRole('dialog', { name: 'Edit Automation Rule' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'Edit Automation Rule' }),
  ).toBeVisible();

  // 5. Generate dynamic update data
  const dynamicId = Date.now().toString().slice(-6);
  const updatedName = `Auto Rule ${dynamicId} UPDATED`;
  const updatedDesc = `Automated test workflow rule ${dynamicId} UPDATED`;

  // 6. Update Rule Name and Description
  const nameInput = dialog.getByPlaceholder('e.g. Auto-push criticals');
  await nameInput.fill(updatedName);
  await expect(nameInput).toHaveValue(updatedName);

  const descInput = dialog.getByPlaceholder('Describe what this rule does');
  await descInput.fill(updatedDesc);
  await expect(descInput).toHaveValue(updatedDesc);

  // 7. Update Condition Value (e.g. Critical)
  const selectValueCombobox = dialog
    .getByRole('combobox')
    .filter({ hasText: /Medium|Critical|High|Low|Select value/i })
    .or(dialog.getByRole('combobox').nth(2))
    .first();

  if (await selectValueCombobox.isVisible()) {
    await selectValueCombobox.click();
    const criticalOption = page.getByRole('option', {
      name: 'Critical',
      exact: true,
    });
    if (await criticalOption.isVisible()) {
      await criticalOption.click();
    } else {
      await page.keyboard.press('Escape');
    }
  }

  // 8. Submit changes
  const updateBtn = dialog.getByRole('button', { name: 'Update Rule' });
  await expect(updateBtn).toBeVisible();
  await updateBtn.click();

  // 9. Verify dialog is dismissed and updated rule name is displayed
  await expect(dialog).toBeHidden({ timeout: 10000 });
  await expect(
    page
      .getByText(/Automation rule updated successfully/i)
      .or(page.getByText(/Rule updated/i)),
  ).toBeVisible({ timeout: 15000 });

  const aside = page.locator('aside');
  const ruleLocator = aside.getByText(updatedName).first();

  if (!(await ruleLocator.isVisible())) {
    const searchInput = aside
      .getByPlaceholder('Search rules...')
      .or(aside.getByRole('textbox'))
      .first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(updatedName);
    }
  }

  await expect(ruleLocator).toBeVisible({ timeout: 10000 });
});
