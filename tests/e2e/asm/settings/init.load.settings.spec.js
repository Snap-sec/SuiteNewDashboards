import { expect, test } from '@playwright/test';

test('initial load and interaction on ASM settings page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Settings page
  await page.goto('/casm/settings');
  await page.waitForURL('**/casm/settings**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 3. Verify Page Heading and Description
  const heading = main.getByRole('heading', {
    name: 'ASM Configuration',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText('Configure your attack surface management tool'),
  ).toBeVisible();

  // 4. Verify Target Domains Card
  await expect(
    main.getByRole('heading', { name: 'Target Domains' }),
  ).toBeVisible();
  const domainInput = main.getByPlaceholder(/example.com/i);
  await expect(domainInput).toBeVisible();
  await expect(main.getByRole('button', { name: /Add/i })).toBeVisible();

  // 5. Verify Scan Schedule Card & Frequency buttons
  await expect(
    main.getByRole('heading', { name: 'Scan Schedule' }),
  ).toBeVisible();
  const onceBtn = main.getByRole('button', { name: 'Once', exact: true });
  const dailyBtn = main.getByRole('button', { name: 'Daily', exact: true });
  const weeklyBtn = main.getByRole('button', { name: 'Weekly', exact: true });

  await expect(onceBtn).toBeVisible();
  await expect(dailyBtn).toBeVisible();
  await expect(weeklyBtn).toBeVisible();

  // Test frequency button selection (if scanning is enabled)
  if (await dailyBtn.isEnabled()) {
    await dailyBtn.click();
  }
  if (await weeklyBtn.isEnabled()) {
    await weeklyBtn.click();
  }

  // Verify Pause/Resume Scanning Switch
  const autoScanSwitch = main.locator('#auto-scan');
  await expect(autoScanSwitch).toBeVisible();

  // 6. Verify Vulnerability Synchronization Configuration Card
  await expect(
    main.getByRole('heading', {
      name: 'Vulnerability Synchronization Configuration',
    }),
  ).toBeVisible();
  await expect(
    main.getByText('Automatic Synchronization', { exact: true }),
  ).toBeVisible();
  await expect(
    main.getByText('Select Assessment', { exact: true }),
  ).toBeVisible();

  // 7. Verify Save/Update Configuration Button
  const saveBtn = main.getByRole('button', {
    name: /Update Configuration|Save Configuration/i,
  });
  await expect(saveBtn).toBeVisible();
});