import { expect, test } from '@playwright/test';

test('initial load and interaction on SCA settings page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Settings page (/sca-ui/settings)
  await page.goto('/sca-ui/settings');
  await page.waitForURL('**/sca-ui/settings**');
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

  // 5. Verify Select Assessment Dropdown Section
  await expect(main.getByText('Select Assessment')).toBeVisible();

  // 6. Verify Save / Update Configuration Button
  const saveBtn = main.getByRole('button', {
    name: /(Update|Save) Configuration/i,
  });
  await expect(saveBtn).toBeVisible();
});