import { expect, test } from '@playwright/test';

test('add vulnerability source', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management -> Source Analytics
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  await page.getByRole('button', { name: 'Dashboards' }).click();
  await page.getByRole('link', { name: 'Source Analytics' }).click();

  // 3. Open Add Source dialog
  await page.getByRole('button', { name: 'Add Source' }).click();

  // 4. Fill in the modal form
  const dialog = page.getByRole('dialog', { name: 'Add New Source' });
  await expect(dialog).toBeVisible();

  // Enter Source Name
  const uniqueSourceName = `Source Test ${Date.now()}`;
  await dialog.getByPlaceholder('e.g. Burp Suite Pro').fill(uniqueSourceName);

  // Select Type
  const typeCombobox = dialog.getByRole('combobox').filter({ hasText: 'Scanner' });
  await typeCombobox.click();
  await page.getByRole('option', { name: 'Manual' }).click();

  // Select Confidence Level
  const confidenceCombobox = dialog.getByRole('combobox').filter({ hasText: 'Medium' });
  await confidenceCombobox.click();
  await page.getByRole('option', { name: 'High' }).click();

  // Enter Description
  await dialog
    .getByPlaceholder('Brief description of the source...')
    .fill('Automated test vulnerability source description');

  // 5. Submit the form
  const submitButton = dialog.getByRole('button', { name: 'Add Source' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // 6. Verify dialog closes and success notification appears
  await expect(dialog).toBeHidden();
  await expect(
    page.getByText(/Vulnerability source created successfully/i),
  ).toBeVisible();
});
