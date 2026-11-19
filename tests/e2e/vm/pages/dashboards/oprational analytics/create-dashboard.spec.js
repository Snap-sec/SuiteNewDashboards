import { expect, test } from '@playwright/test';

test('create custom dashboard', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management -> Operational Analytics
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  await page.getByRole('button', { name: 'Dashboards' }).click();
  await page.getByRole('link', { name: 'Operational Analytics' }).click();

  // 3. Open Create Custom Dashboard modal (click the Plus button in header)
  await page.locator('main').locator('button:has(svg.lucide-plus)').first().click();

  // 4. Fill in the modal form
  const dialog = page.getByRole('dialog', { name: 'Create Custom Dashboard' });
  await expect(dialog).toBeVisible();

  await dialog
    .getByRole('textbox', { name: 'Dashboard Name *' })
    .fill(`Test Dashboard ${Date.now()}`);
  await dialog
    .getByRole('textbox', { name: 'Description *' })
    .fill('This is a test description');

  // Select first available assessment from MultiSelect
  await dialog.getByRole('combobox').click();
  const firstOption = page.getByRole('option').first();
  await expect(firstOption).toBeVisible();
  await firstOption.click();
  await page.keyboard.press('Escape');

  // Toggle public switch (optional)
  await dialog.getByRole('switch').click();

  // 5. Submit form
  const submitButton = dialog.getByRole('button', { name: 'Create Dashboard' });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  // 6. Verify modal closes / dashboard created
  await expect(dialog).toBeHidden();
});
