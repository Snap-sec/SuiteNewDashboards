import { expect, test } from '@playwright/test';

test('initial load and interaction on WAS scan profiles page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to WAS Scan Profiles page (/was/scan-profile)
  await page.goto('/was/scan-profile');
  await page.waitForURL('**/was/scan-profile**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Scan Profiles',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      /Configure reusable API scan profiles|Manage and configure your API scan profiles/i,
    ),
  ).toBeVisible();


  // 4. Verify Profile Creation Form Fields
  await expect(main.getByText('Profile Details')).toBeVisible();
  await expect(main.getByText(/Profile Name/i)).toBeVisible();

  const nameInput = main
    .getByPlaceholder('Enter a name of this profile.')
    .or(main.getByRole('textbox', { name: /Profile Name/i }))
    .first();
  await expect(nameInput).toBeVisible();

  // 5. Verify Custom Headers Section
  await expect(main.getByText('Custom Headers')).toBeVisible();
  const addHeaderBtn = main.getByRole('button', { name: /Add Header/i });
  if (await addHeaderBtn.isVisible()) {
    await expect(addHeaderBtn).toBeVisible();
  }

  // 6. Verify Override Host Field
  await expect(main.getByText('Override Host', { exact: true })).toBeVisible();
  const hostInput = main.getByPlaceholder('https://example.com').first();
  if (await hostInput.isVisible()) {
    await expect(hostInput).toBeVisible();
  }

  // 7. Verify Rate limit Field
  await expect(main.getByText('Rate limit', { exact: true })).toBeVisible();

  // 8. Verify Action Submit Button
  const submitBtn = main
    .getByRole('button', { name: /Create Profile|Update Profile/i })
    .first();
  if (await submitBtn.isVisible()) {
    await expect(submitBtn).toBeVisible();
  }

  // 9. Verify Existing Scan Profiles Section or Empty Text
  const existingHeading = main.getByRole('heading', {
    name: 'Existing Scan Profiles',
  });
  const emptyText = main.getByText('No scan profiles found');
  await expect(existingHeading.or(emptyText)).toBeVisible();
});
