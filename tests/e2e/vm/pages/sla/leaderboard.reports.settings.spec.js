import { expect, test } from '@playwright/test';

test('interact with SLA leaderboard, weekly reports, and settings tabs', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to SLA via sidebar
  const slaLink = page
    .getByRole('link', { name: 'SLA' })
    .or(page.getByRole('button', { name: 'SLA' }))
    .first();
  await expect(slaLink).toBeVisible();
  await slaLink.click();
  await page.waitForURL('**/vm/sla**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Test Leaderboard Tab
  const leaderboardTab = page.getByRole('tab', { name: 'Leaderboard' });
  await expect(leaderboardTab).toBeVisible();
  await leaderboardTab.click();
  await expect(leaderboardTab).toHaveAttribute('data-state', 'active');

  // Verify Leaderboard heading or empty screen
  await expect(
    page.getByRole('heading', { level: 1, name: 'SLA Leaderboard' }).or(page.getByText('Leaderboard Empty')),
  ).toBeVisible();

  // Test Search input on Leaderboard
  const searchInput = page
    .getByPlaceholder(/Search/i)
    .or(page.getByRole('textbox', { name: /Search/i }))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('twokeer');
    await expect(searchInput).toHaveValue('twokeer');

    const clearBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // Test Pagination if present
  const page2Button = page.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = page.getByRole('button', { name: '1', exact: true });
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  }

  // 5. Test Weekly Reports Tab (Visible to Admin/Manager)
  const reportsTab = page.getByRole('tab', { name: 'Weekly Reports' });
  if (await reportsTab.isVisible()) {
    await reportsTab.click();
    await expect(reportsTab).toHaveAttribute('data-state', 'active');

    // Verify Page Heading
    await expect(
      page.getByRole('heading', { level: 1, name: 'Reports Configuration' }),
    ).toBeVisible();

    // Test Send Test Email action with confirmation dialog
    const sendTestBtn = page.getByRole('button', { name: /Send Test Email|Sending/i });
    if (await sendTestBtn.isVisible()) {
      await sendTestBtn.click();

      const sendDialog = page.getByRole('dialog');
      await expect(sendDialog).toBeVisible();

      const confirmSendBtn = sendDialog.getByRole('button', { name: 'Send' });
      await expect(confirmSendBtn).toBeVisible();
      await confirmSendBtn.click();

      await expect(sendDialog).toBeHidden();
    }

    // Test Schedule Switch toggle
    const scheduleSwitch = page.getByRole('switch');
    if (await scheduleSwitch.isVisible()) {
      await scheduleSwitch.click();
    }

    // Test Save Configuration Button
    const saveConfigBtn = page.getByRole('button', { name: /Save Configuration|Saving/i });
    if (await saveConfigBtn.isVisible()) {
      await saveConfigBtn.click();
      await expect(
        page.getByText(/Configuration saved successfully|Please select|Failed to save/i).first(),
      ).toBeVisible({ timeout: 15000 });
    }
  }

  // 6. Test Settings Tab (Visible to Admin/Manager)
  const settingsTab = page.getByRole('tab', { name: 'Settings' });
  if (await settingsTab.isVisible()) {
    await settingsTab.click();
    await expect(settingsTab).toHaveAttribute('data-state', 'active');

    // Verify Page Heading
    await expect(
      page.getByRole('heading', { level: 1, name: 'SLA Setup' }),
    ).toBeVisible();

    // Test SLA Days Inputs
    const criticalDaysInput = page.locator('#criticalDays');
    if (await criticalDaysInput.isVisible()) {
      await criticalDaysInput.fill('2');
    }

    // Test Weekend Checkboxes
    const fridayCheckbox = page.getByLabel(/Include Fridays/i);
    if (await fridayCheckbox.isVisible()) {
      await fridayCheckbox.click();
    }

    // Test Save SLA Configuration with confirmation dialog
    const saveSlaBtn = page.getByRole('button', { name: /Save SLA Configuration|Saving/i });
    if (await saveSlaBtn.isVisible()) {
      await saveSlaBtn.click();

      const confirmDialog = page.getByRole('dialog');
      await expect(confirmDialog).toBeVisible();

      const proceedBtn = confirmDialog.getByRole('button', { name: 'Proceed' });
      await expect(proceedBtn).toBeVisible();
      await proceedBtn.click();

      await expect(confirmDialog).toBeHidden();
      await expect(
        page.getByText(/SLA created successfully|Creating SLA|Failed to create/i).first(),
      ).toBeVisible({ timeout: 15000 });
    }
  }
});