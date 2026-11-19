import { expect, test } from '@playwright/test';

test('initial load and interaction on member details page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Members page
  await page.goto('/profile/account/members/team-members');
  await page.waitForURL('**/profile/account/members/team-members**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Open the first available Member Details / Permissions Toggle page
  const memberLink = page
    .locator('a[href*="/profile/account/members/permissions-toggle"]')
    .first();

  if (await memberLink.isVisible()) {
    await memberLink.click();
    await page.waitForURL('**/profile/account/members/permissions-toggle**');
    await page.waitForLoadState('domcontentloaded');

    // 4. Verify Member Profile Details & Account Info
    await expect(page.getByText('Product Access')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Role', { exact: true })).toBeVisible();
    await expect(page.getByText('Team', { exact: true })).toBeVisible();
    await expect(page.getByText('Assessments', { exact: true })).toBeVisible();

    // 5. Verify 2FA Switch if present
    const twoFactorToggle = page.locator('#two-factor-toggle');
    if (await twoFactorToggle.isVisible()) {
      await expect(twoFactorToggle).toBeVisible();
    }

    // 6. Verify Role Selector & Update Button
    const roleCombobox = page.getByRole('combobox').first();
    if (await roleCombobox.isVisible()) {
      await expect(roleCombobox).toBeVisible();
    }

    // 7. Verify MultiSelect fields for Teams and Assessments
    const teamsSelect = page.getByPlaceholder('Select teams').or(page.getByText('Select teams'));
    if (await teamsSelect.first().isVisible()) {
      await expect(teamsSelect.first()).toBeVisible();
    }

    const assessmentsSelect = page.getByPlaceholder('Select assessments').or(page.getByText('Select assessments'));
    if (await assessmentsSelect.first().isVisible()) {
      await expect(assessmentsSelect.first()).toBeVisible();
    }

    // 8. Verify Product Access Modules & Switches
    const productAccessCard = page.locator('text=Product Access').locator('..');
    await expect(productAccessCard).toBeVisible();

    await expect(page.getByText('Vulnerability Management', { exact: true })).toBeVisible();
    await expect(page.getByText('Attack Surface Management', { exact: true })).toBeVisible();
    await expect(page.getByText('Vulnerability Scanning', { exact: true })).toBeVisible();
    await expect(page.getByText('Asset Inventory Management', { exact: true })).toBeVisible();
    await expect(page.getByText('Web Application Security', { exact: true })).toBeVisible();
    await expect(page.getByText('Software Composition Analysis', { exact: true })).toBeVisible();
    await expect(page.getByText('Cloud Security Management', { exact: true })).toBeVisible();

    // Check module switch controls
    const vmSwitch = page.locator('#VM');
    const asmSwitch = page.locator('#ASM');
    const vsSwitch = page.locator('#VS');
    const aimSwitch = page.locator('#AIM');
    const wasSwitch = page.locator('#WAS');
    const scaSwitch = page.locator('#SCA');
    const cspmSwitch = page.locator('#CSPM');

    await expect(vmSwitch).toBeVisible();
    await expect(asmSwitch).toBeVisible();
    await expect(vsSwitch).toBeVisible();
    await expect(aimSwitch).toBeVisible();
    await expect(wasSwitch).toBeVisible();
    await expect(scaSwitch).toBeVisible();
    await expect(cspmSwitch).toBeVisible();

    // 9. Verify Action Buttons (Reset Password / Delete Member) if present
    const resetPasswordBtn = page.getByRole('button', { name: /Reset Password/i });
    if (await resetPasswordBtn.isVisible()) {
      await expect(resetPasswordBtn).toBeVisible();
    }

    const deleteMemberBtn = page.getByRole('button', { name: /Delete/i });
    if (await deleteMemberBtn.isVisible()) {
      await expect(deleteMemberBtn).toBeVisible();
    }
  }
});
