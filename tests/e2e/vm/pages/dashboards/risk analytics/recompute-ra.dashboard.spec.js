import { expect, test } from '@playwright/test';

test('recompute dashboard in risk analytics', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management -> Risk Analytics
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  await page.getByRole('button', { name: 'Dashboards' }).click();
  await page.getByRole('link', { name: 'Risk Analytics' }).click();

  // 3. Wait for Risk Analytics view to load and click Recompute button
  await expect(
    page.getByRole('heading', { level: 1, name: 'Risk Analytics' }),
  ).toBeVisible();

  const recomputeBtn = page.getByRole('button', { name: 'Recompute' });
  await expect(recomputeBtn).toBeVisible();
  await recomputeBtn.click();

  // 4. Verify confirmation dialog appears
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await expect(confirmDialog.getByText('Recompute Dashboard?')).toBeVisible();

  // 5. Confirm recomputation
  const confirmButton = confirmDialog.getByRole('button', { name: 'Confirm' });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();

  // 6. Verify confirmation dialog closes and toast notification appears
  await expect(confirmDialog).toBeHidden();
  await expect(page.getByText(/Dashboard recomputation started/i)).toBeVisible();
});
