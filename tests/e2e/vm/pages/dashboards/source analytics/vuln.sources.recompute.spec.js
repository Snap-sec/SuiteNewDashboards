import { expect, test } from '@playwright/test';

test('recompute dashboard in vulnerability sources', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management -> Source Analytics
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  await page.getByRole('button', { name: 'Dashboards' }).click();
  await page.getByRole('link', { name: 'Source Analytics' }).click();

  // 3. Click the Recompute (Refresh) button in the header
  const recomputeButton = page.locator('main button:has(svg.lucide-refresh-ccw)');
  await expect(recomputeButton).toBeVisible();
  await recomputeButton.click();

  // 4. Verify confirmation dialog appears
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await expect(confirmDialog.getByText('Recompute Dashboard?')).toBeVisible();

  // 5. Confirm the recomputation in the dialog
  const confirmButton = confirmDialog.getByRole('button', { name: 'Confirm' });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();

  // 6. Verify confirmation dialog closes and success notification appears
  await expect(confirmDialog).toBeHidden();
  await expect(
    page.getByText(/Dashboard recomputed successfully/i),
  ).toBeVisible();
});