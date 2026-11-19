import { expect, test } from '@playwright/test';

test('initial load and interaction on SAST settings page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SAST Settings page (/ui-sast/settings)
  await page.goto('/ui-sast/settings');
  await page.waitForURL('**/ui-sast/settings**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-6')).or(page.locator('.p-4'));

  // 3. Verify Page / Card Heading & Description
  const heading = main.getByText('Vulnerability Synchronization Configuration');
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      'Configure the vulnerability synchronization to your asset inventory.',
    ),
  ).toBeVisible();

  // 4. Verify Automatic Synchronization Switch Section
  await expect(main.getByText('Automatic Synchronization')).toBeVisible();
  await expect(
    main.getByText(
      'Automatically push new findings to the linked assessment in real-time.',
    ),
  ).toBeVisible();

  const syncSwitch = main.locator('#auto-sync').or(main.getByRole('switch'));
  await expect(syncSwitch).toBeVisible();

  // 5. Test Automatic Synchronization Toggle & Confirmation Dialog
  await syncSwitch.click();

  const confirmDialog = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
  if (await confirmDialog.isVisible()) {
    const dialogTitle = confirmDialog.getByRole('heading', {
      name: /(Enable|Disable) Automatic Synchronization\?/i,
    });
    await expect(dialogTitle).toBeVisible();

    const confirmBtn = confirmDialog.getByRole('button', { name: 'Confirm' });
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // Toggle back to restore initial state
  if (await syncSwitch.isVisible()) {
    await syncSwitch.click();
    if (await confirmDialog.isVisible()) {
      const confirmBtn = confirmDialog.getByRole('button', { name: 'Confirm' });
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(500);
      }
    }
  }

  // 6. Verify Select Assessment Dropdown Section
  await expect(main.getByText('Select Assessment')).toBeVisible();

  const assessmentSelect = main.getByRole('combobox').first();
  if (await assessmentSelect.isVisible()) {
    await expect(assessmentSelect).toBeVisible();
    await assessmentSelect.click();
    await page.waitForTimeout(300);

    // Close or select option if open
    const noneOption = page.getByRole('option', { name: 'None' });
    if (await noneOption.isVisible()) {
      await noneOption.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(300);
  }

  // 7. Verify Save / Update Configuration Button
  const saveBtn = main.getByRole('button', {
    name: /(Update|Save) Configuration/i,
  });
  await expect(saveBtn).toBeVisible();

  if (await saveBtn.isEnabled()) {
    await saveBtn.click();
    await page.waitForTimeout(500);
  }
});
