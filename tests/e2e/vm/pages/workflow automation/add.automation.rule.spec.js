import { expect, test } from '@playwright/test';

test('create a new automation rule with dynamic data', async ({ page }) => {
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

  // 4. Open Create Automation Rule modal
  const createRuleBtn = page
    .getByRole('button', { name: 'Create New Rule' })
    .or(page.getByRole('button', { name: 'Create Rule' }))
    .first();
  await expect(createRuleBtn).toBeVisible();
  await createRuleBtn.click();

  const dialog = page.getByRole('dialog', { name: 'Create Automation Rule' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('heading', { name: 'Create Automation Rule' }),
  ).toBeVisible();

  // 5. Generate dynamic rule data
  const dynamicId = Date.now().toString().slice(-6);
  const ruleName = `Auto Rule ${dynamicId}`;
  const ruleDesc = `Automated test workflow rule ${dynamicId}`;

  // 6. Fill Rule Name and Description
  const nameInput = dialog.getByPlaceholder('e.g. Auto-push criticals');
  await nameInput.fill(ruleName);
  await expect(nameInput).toHaveValue(ruleName);

  const descInput = dialog.getByPlaceholder('Describe what this rule does');
  await descInput.fill(ruleDesc);
  await expect(descInput).toHaveValue(ruleDesc);

  // 7. Select condition value (Field defaults to Severity, Operator to Equals -> select Medium)
  const selectValueCombobox = dialog
    .getByRole('combobox')
    .filter({ hasText: /Select value/i })
    .or(dialog.getByRole('combobox').nth(2));
  await expect(selectValueCombobox).toBeVisible({ timeout: 10000 });
  await selectValueCombobox.click();

  const mediumOption = page.getByRole('option', {
    name: 'Medium',
    exact: true,
  });
  await expect(mediumOption).toBeVisible();
  await mediumOption.click();

  // 8. Configure Action
  const actionTab = dialog.getByRole('tab', { name: 'Action' });
  await expect(actionTab).toBeVisible();
  await actionTab.click();

  // Select an action (e.g. Archive Vulnerability)
  const archiveAction = dialog
    .locator('label')
    .filter({ hasText: /Archive/i })
    .first();
  if (await archiveAction.isVisible()) {
    await archiveAction.click();
  } else {
    const firstActionCheckbox = dialog
      .locator('label:has(button[role="checkbox"])')
      .first();
    if (await firstActionCheckbox.isVisible()) {
      await firstActionCheckbox.click();
    }
  }

  // 9. Save the rule
  const saveBtn = dialog.getByRole('button', { name: 'Save Rule' });
  await expect(saveBtn).toBeVisible();
  await saveBtn.click();

  // 10. Verify dialog is dismissed and rule appears in sidebar
  await expect(dialog).toBeHidden({ timeout: 10000 });
  await expect(
    page
      .getByText(/Automation rule created successfully/i)
      .or(page.getByText(/Rule created/i)),
  ).toBeVisible({ timeout: 15000 });

  // Locate the newly created rule in sidebar (use search if paginated)
  const aside = page.locator('aside');
  const ruleLocator = aside.getByText(ruleName).first();

  if (!(await ruleLocator.isVisible())) {
    const searchInput = aside
      .getByPlaceholder('Search rules...')
      .or(aside.getByRole('textbox'))
      .first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(ruleName);
    }
  }

  await expect(ruleLocator).toBeVisible({ timeout: 10000 });
});