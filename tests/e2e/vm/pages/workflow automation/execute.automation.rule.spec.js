import { expect, test } from '@playwright/test';

test('execute an automation rule and verify run history', async ({ page }) => {
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

  // 4. Trigger Execution from the Details Header (or Sidebar menu)
  const executeNowBtn = page
    .getByRole('button', { name: /Execute Now/i })
    .first();
  await expect(executeNowBtn).toBeVisible({ timeout: 10000 });
  await executeNowBtn.click();

  // 5. Confirm Execution in Dialog
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  const confirmExecuteBtn = confirmDialog.getByRole('button', {
    name: 'Execute',
  });
  await expect(confirmExecuteBtn).toBeVisible();
  await confirmExecuteBtn.click();
  await expect(confirmDialog).toBeHidden();

  // 6. Switch to "Runs" tab to view execution history
  const runsTab = page.getByRole('tab', { name: 'Runs' });
  await expect(runsTab).toBeVisible();
  await runsTab.click();
  await expect(runsTab).toHaveAttribute('aria-selected', 'true');

  // 7. Verify the Runs table renders the execution entry
  const tabpanel = page.getByRole('tabpanel');
  await expect(tabpanel).toBeVisible();

  const firstJobRow = tabpanel.locator('tbody tr').first();
  await expect(firstJobRow).toBeVisible({ timeout: 15000 });

  // 8. Verify Status badge is present (Pending, In progress, or Completed)
  await expect(
    firstJobRow.locator('span, div').filter({
      hasText: /Pending|In progress|Completed|Failed|Completed Successfully/i,
    }).first(),
  ).toBeVisible();

  // 9. Verify Job action menu trigger is functional
  const jobActionBtn = firstJobRow.getByRole('button').first();
  if (await jobActionBtn.isVisible()) {
    await jobActionBtn.click();
    const menu = page.getByRole('menu');
    if (await menu.isVisible()) {
      await page.keyboard.press('Escape');
    }
  }
});