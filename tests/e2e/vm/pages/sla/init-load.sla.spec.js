import { expect, test } from '@playwright/test';

test('initial load and interaction on SLA page', async ({ page }) => {
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

  // 4. Verify all main tab triggers
  const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
  const violationsTab = page.getByRole('tab', { name: 'Violations' });
  const leaderboardTab = page.getByRole('tab', { name: 'Leaderboard' });
  const reportsTab = page.getByRole('tab', { name: 'Weekly Reports' });
  const settingsTab = page.getByRole('tab', { name: 'Settings' });

  await expect(dashboardTab).toBeVisible();
  await expect(violationsTab).toBeVisible();
  await expect(leaderboardTab).toBeVisible();

  // 5. Test Dashboard Tab interactions
  await expect(dashboardTab).toHaveAttribute('data-state', 'active');
  await expect(
    page.getByRole('heading', { level: 1, name: 'SLA Dashboard' }).or(page.getByText('SLA Dashboard Empty')),
  ).toBeVisible();

  // Test Refresh Data action with confirmation dialog
  const refreshDataBtn = page.getByRole('button', { name: /Refresh Data|Refreshing/i });
  if (await refreshDataBtn.isVisible()) {
    await refreshDataBtn.click();

    const refreshDialog = page.getByRole('dialog');
    await expect(refreshDialog).toBeVisible();

    const proceedBtn = refreshDialog.getByRole('button', { name: 'Proceed' });
    await expect(proceedBtn).toBeVisible();
    await proceedBtn.click();

    // Verify dialog closes and refresh triggers
    await expect(refreshDialog).toBeHidden();
    await expect(
      page.getByText(/SLA refreshed successfully|Failed to refresh/i).or(page.getByRole('button', { name: /Refreshing|Refresh Data/i })),
    ).toBeVisible({ timeout: 20000 });
  }

  // Test Export Report action with confirmation dialog
  const exportBtn = page.getByRole('button', { name: /Export Report|Exporting/i });
  if (await exportBtn.isVisible()) {
    await exportBtn.click();

    const exportDialog = page.getByRole('dialog');
    if (await exportDialog.isVisible()) {
      const proceedBtn = exportDialog.getByRole('button', { name: 'Proceed' });
      if (await proceedBtn.isVisible()) {
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
          proceedBtn.click(),
        ]);
      }
    }
  }

  // 6. Test Violations Tab
  await violationsTab.click();
  await expect(violationsTab).toHaveAttribute('data-state', 'active');
  await expect(
    page.getByRole('heading', { level: 1, name: 'SLA Violations' }).or(page.getByText('No SLA Violations')),
  ).toBeVisible();

  // 7. Test Leaderboard Tab
  await leaderboardTab.click();
  await expect(leaderboardTab).toHaveAttribute('data-state', 'active');
  await expect(
    page.getByRole('heading', { level: 1, name: 'SLA Leaderboard' }).or(page.getByText('Leaderboard Empty')),
  ).toBeVisible();

  // 8. Test Weekly Reports Tab if visible
  if (await reportsTab.isVisible()) {
    await reportsTab.click();
    await expect(reportsTab).toHaveAttribute('data-state', 'active');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Reports Configuration' }).or(page.getByText('Reports Configuration')),
    ).toBeVisible();
  }

  // 9. Test Settings Tab if visible
  if (await settingsTab.isVisible()) {
    await settingsTab.click();
    await expect(settingsTab).toHaveAttribute('data-state', 'active');
    await expect(
      page.getByRole('heading', { level: 1, name: 'SLA Setup' }).or(page.getByText('SLA Setup')),
    ).toBeVisible();
  }

  // 10. Switch back to Dashboard Tab
  await dashboardTab.click();
  await expect(dashboardTab).toHaveAttribute('data-state', 'active');
});
