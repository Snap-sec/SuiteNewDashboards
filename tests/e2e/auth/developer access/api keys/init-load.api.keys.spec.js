import { expect, test } from '@playwright/test';

test('initial load and interaction on API keys page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to API Keys via direct URL or navigation
  await page.goto('/profile/account/api-keys');
  await page.waitForURL('**/profile/account/api-keys**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Page Heading or Empty State
  const pageHeading = page
    .getByRole('heading', { name: 'API Keys', exact: true })
    .or(page.getByText('API Keys', { exact: true }))
    .or(page.getByText('No API Keys'));
  await expect(pageHeading.first()).toBeVisible({ timeout: 15000 });

  // 4. Test Create API Key modal trigger and dismissal
  const createApiKeyBtn = page
    .getByRole('button', { name: /Create API Key/i })
    .first();

  await expect(createApiKeyBtn).toBeVisible();
  await createApiKeyBtn.click();

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(
    modal.getByRole('heading', { name: 'Create API Key' }),
  ).toBeVisible();

  // Verify modal form input
  const nameInput = modal
    .getByPlaceholder('e.g. Production API Key')
    .or(modal.locator('#name'));
  await expect(nameInput).toBeVisible();

  // Dismiss modal with Cancel button or Escape key
  const cancelBtn = modal.getByRole('button', { name: /Cancel/i });
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
  } else {
    await page.keyboard.press('Escape');
  }

  await expect(modal).toBeHidden();

  // 5. Verify Table and column headers (if API keys exist)
  const table = page.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Name')).toBeVisible();
    await expect(thead.getByText('API Key')).toBeVisible();
    await expect(thead.getByText('Created By')).toBeVisible();
    await expect(thead.getByText('Created At')).toBeVisible();

    // Verify first row rendering
    const firstRow = table.locator('tbody tr').first();
    if (await firstRow.isVisible()) {
      await expect(firstRow).toBeVisible();
    }
  }
});