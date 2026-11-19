import { expect, test } from '@playwright/test';

test('verify false positive analysis rules creation, execution, and management', async ({
  page,
}) => {
  test.setTimeout(60000);

  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to False Positive Analysis via Prioritization sidebar menu
  const fpLink = page.getByRole('link', {
    name: 'False Positive Analysis',
  });
  if (!(await fpLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Prioritization', exact: true })
      .click();
  }
  await expect(fpLink).toBeVisible();
  await fpLink.click();
  await page.waitForURL('**/vm/false-positive-analysis**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Navigate to Analysis Rules tab
  const rulesTab = page.getByRole('tab', { name: 'Analysis Rules' });
  await expect(rulesTab).toBeVisible();
  await rulesTab.click();
  await expect(rulesTab).toHaveAttribute('data-state', 'active');

  const rulesPanel = page.getByRole('tabpanel', { name: 'Analysis Rules' });
  await expect(rulesPanel).toBeVisible();

  // 5. Test Search input on rules sidebar
  const searchInput = rulesPanel.getByPlaceholder('Search rules...');
  if (await searchInput.isVisible()) {
    await searchInput.fill('test-search');
    await expect(searchInput).toHaveValue('test-search');
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  }

  // 6. Test Create Automation Rule Modal & Workflow
  const createRuleBtn = rulesPanel
    .getByRole('button', { name: /Create New Rule|Create Rule/i })
    .or(rulesPanel.locator('button[title="Create New Rule"]'))
    .first();

  await expect(createRuleBtn).toBeVisible({ timeout: 10000 });
  await createRuleBtn.click();

  const modal = page.getByRole('dialog', {
    name: /Create Automation Rule/i,
  });
  await expect(modal).toBeVisible({ timeout: 10000 });

  const uniqueRuleName = `FP-Rule-${Date.now().toString().slice(-6)}`;
  await modal.getByPlaceholder('e.g. Auto-push criticals').fill(uniqueRuleName);
  await modal
    .getByPlaceholder('Describe what this rule does')
    .fill('Automated test rule for false positive analysis');

  // Conditions tab: Select value for default severity condition
  const conditionsPanel = modal.getByRole('tabpanel', { name: 'Conditions' });
  const valueCombobox = conditionsPanel
    .getByRole('combobox')
    .filter({ hasText: /Select value/i })
    .or(conditionsPanel.getByRole('combobox').nth(2));

  await expect(valueCombobox).toBeVisible({ timeout: 10000 });
  await valueCombobox.click();

  const option = page
    .getByRole('option', { name: 'High', exact: true })
    .or(page.getByRole('option').first())
    .first();
  await expect(option).toBeVisible({ timeout: 10000 });
  await option.click();

  // Switch to Action tab (auto-configured for falsepositive_analysis)
  const actionTab = modal.getByRole('tab', { name: 'Action' });
  await expect(actionTab).toBeVisible();
  await actionTab.click();
  await expect(actionTab).toHaveAttribute('data-state', 'active');

  // Ensure action is selected (using .check() so already-checked actions are never toggled off)
  const actionCheckbox = modal.getByRole('checkbox').first();
  if (await actionCheckbox.isVisible()) {
    if (!(await actionCheckbox.isChecked())) {
      await actionCheckbox.check();
    }
  }

  // Save Rule
  const saveBtn = modal.getByRole('button', { name: 'Save Rule' });
  await expect(saveBtn).toBeEnabled({ timeout: 10000 });
  await saveBtn.click();
  await expect(modal).toBeHidden({ timeout: 10000 });

  // 7. Test Rule Selection and Details View
  const firstRuleCard = rulesPanel
    .locator('aside')
    .locator('.cursor-pointer')
    .filter({ hasText: uniqueRuleName })
    .first();

  await expect(firstRuleCard).toBeVisible({ timeout: 10000 });
  await firstRuleCard.click();

  // Verify Details Header
  const heading = rulesPanel
    .getByRole('heading', { level: 1 })
    .filter({ hasText: uniqueRuleName })
    .first();
  await expect(heading).toBeVisible({ timeout: 10000 });

  // Test Execute Now in Details Header
  const executeBtn = rulesPanel
    .getByRole('button', { name: /Execute Now/i })
    .first();
  if (await executeBtn.isVisible()) {
    await executeBtn.click();
    const confirmExecute = page
      .getByRole('dialog')
      .getByRole('button', { name: 'Execute' })
      .first();
    if (await confirmExecute.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmExecute.click();
    }
  }

  // Test Edit Rule trigger in Details Header
  const editRuleBtn = rulesPanel.getByText('Edit rule').first();
  if (await editRuleBtn.isVisible()) {
    await editRuleBtn.click();
    const editModal = page.getByRole('dialog', {
      name: /Edit Automation Rule/i,
    });
    if (await editModal.isVisible({ timeout: 2000 }).catch(() => false)) {
      const descInput = editModal.getByPlaceholder(
        /Describe what this rule does/i,
      );
      if (await descInput.isVisible()) {
        await descInput.fill(`Updated description at ${Date.now()}`);
      }

      const updateBtn = editModal
        .getByRole('button', {
          name: /Update Rule/i,
        })
        .first();
      if (await updateBtn.isEnabled()) {
        await updateBtn.click();
        await expect(editModal).toBeHidden({ timeout: 5000 });
      } else {
        await editModal.getByRole('button', { name: 'Cancel' }).first().click();
      }
    }
  }

  // Test Tabs in Details View (Details & Runs)
  const runsTab = rulesPanel.getByRole('tab', { name: 'Runs' }).first();
  if (await runsTab.isVisible()) {
    await runsTab.click();
    await expect(runsTab).toHaveAttribute('data-state', 'active');
  }

  const detailsTab = rulesPanel.getByRole('tab', { name: 'Details' }).first();
  if (await detailsTab.isVisible()) {
    await detailsTab.click();
    await expect(detailsTab).toHaveAttribute('data-state', 'active');
  }

  // 8. Test Sidebar Card Row Actions Menu (Toggle & Safe Delete)
  const cardMenuBtn = firstRuleCard
    .locator('button:has(svg.lucide-ellipsis)')
    .or(firstRuleCard.getByRole('button').first());

  if (await cardMenuBtn.isVisible()) {
    await cardMenuBtn.click();

    // Test Disable / Enable Toggle
    const toggleOption = page
      .getByRole('button', {
        name: /Disable|Enable/i,
      })
      .first();
    if (await toggleOption.isVisible()) {
      await toggleOption.click();
      const confirmToggle = page
        .getByRole('dialog')
        .getByRole('button', { name: /Disable|Enable/i })
        .first();
      if (await confirmToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmToggle.click();
      }
    }

    // Test Delete option with safe Cancel
    if (await cardMenuBtn.isVisible()) {
      await cardMenuBtn.click();
      const deleteOption = page
        .getByRole('button', { name: 'Delete' })
        .or(page.getByRole('menuitem', { name: 'Delete' }))
        .first();
      if (await deleteOption.isVisible()) {
        await deleteOption.click();
        const cancelDelete = page
          .getByRole('dialog')
          .getByRole('button', { name: 'Cancel' })
          .first();
        if (
          await cancelDelete.isVisible({ timeout: 2000 }).catch(() => false)
        ) {
          await cancelDelete.click();
        }
      }
    }
  }
});
