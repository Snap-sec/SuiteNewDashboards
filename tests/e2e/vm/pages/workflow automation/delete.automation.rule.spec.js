import { expect, test } from '@playwright/test';

test('dynamically delete an automation rule', async ({ page }) => {
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

  // 4. Locate the first rule card in the sidebar
  const firstRuleCard = page
    .locator('aside')
    .locator('div[class*="cursor-pointer"]')
    .first();
  await expect(firstRuleCard).toBeVisible({ timeout: 10000 });

  // 5. Open rule card action menu
  const actionBtn = firstRuleCard.getByRole('button').first();
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();

  // 6. Click Delete option in the dropdown menu
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  const deleteMenuItem = menu.getByRole('menuitem', { name: 'Delete' });
  await expect(deleteMenuItem).toBeVisible();
  await deleteMenuItem.click();

  // 7. Confirm deletion in the confirmation dialog
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  const confirmDeleteBtn = confirmDialog.getByRole('button', {
    name: 'Delete',
  });
  await expect(confirmDeleteBtn).toBeVisible();
  await confirmDeleteBtn.click();
  await expect(confirmDialog).toBeHidden();

  // 8. Verify deletion feedback toast
  await expect(
    page.getByText(/Rule deleted|Deleting rule/i),
  ).toBeVisible({ timeout: 10000 });
});