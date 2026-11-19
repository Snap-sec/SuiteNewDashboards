import { expect, test } from '@playwright/test';

test('enable and disable an automation rule', async ({ page }) => {
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

  const targetRuleTitle = (
    await firstRuleCard.locator('h4').first().textContent()
  )?.trim();
  const targetCard = targetRuleTitle
    ? page
        .locator('aside')
        .locator('div[class*="cursor-pointer"]')
        .filter({ hasText: targetRuleTitle })
        .first()
    : firstRuleCard;

  // 5. Open rule card action menu
  const actionBtn = targetCard.getByRole('button').first();
  await expect(actionBtn).toBeVisible();
  await actionBtn.click();

  // 6. Check if current state allows Disable or Enable
  const disableMenuBtn = page
    .locator('[role="menu"]')
    .last()
    .getByRole('button', { name: 'Disable' })
    .or(page.getByRole('button', { name: 'Disable' }))
    .first();
  const enableMenuBtn = page
    .locator('[role="menu"]')
    .last()
    .getByRole('button', { name: 'Enable' })
    .or(page.getByRole('button', { name: 'Enable' }))
    .first();

  if (await disableMenuBtn.isVisible()) {
    // --- Disable Flow ---
    await disableMenuBtn.click();
    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog).toBeVisible({ timeout: 10000 });
    await confirmDialog.getByRole('button', { name: 'Disable' }).click();
    await expect(confirmDialog).toBeHidden({ timeout: 10000 });

    await expect(page.getByText('Status updated')).toBeVisible({
      timeout: 15000,
    });

    // Verify status updated to Disabled
    await expect(
      targetCard.getByText('Disabled').or(firstRuleCard.getByText('Disabled')),
    ).toBeVisible({
      timeout: 10000,
    });

    // --- Re-Enable Flow ---
    await actionBtn.click();
    const reEnableBtn = page
      .locator('[role="menu"]')
      .last()
      .getByRole('button', { name: 'Enable' })
      .or(page.getByRole('button', { name: 'Enable' }))
      .first();
    await expect(reEnableBtn).toBeVisible({ timeout: 10000 });
    await reEnableBtn.click();

    const enableDialog = page.getByRole('dialog');
    await expect(enableDialog).toBeVisible({ timeout: 10000 });
    await enableDialog.getByRole('button', { name: 'Enable' }).click();
    await expect(enableDialog).toBeHidden({ timeout: 10000 });

    await expect(page.getByText('Status updated')).toBeVisible({
      timeout: 15000,
    });

    // Verify status updated to Active
    await expect(
      targetCard.getByText('Active').or(firstRuleCard.getByText('Active')),
    ).toBeVisible({
      timeout: 10000,
    });
  } else if (await enableMenuBtn.isVisible()) {
    // --- Enable Flow ---
    await enableMenuBtn.click();
    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog).toBeVisible({ timeout: 10000 });
    await confirmDialog.getByRole('button', { name: 'Enable' }).click();
    await expect(confirmDialog).toBeHidden({ timeout: 10000 });

    await expect(page.getByText('Status updated')).toBeVisible({
      timeout: 15000,
    });

    // Verify status updated to Active
    await expect(
      targetCard.getByText('Active').or(firstRuleCard.getByText('Active')),
    ).toBeVisible({
      timeout: 10000,
    });
  }
});