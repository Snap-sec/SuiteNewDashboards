import { expect, test } from '@playwright/test';

test('recompute dashboard', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management -> Operational Analytics
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  await page.getByRole('button', { name: 'Dashboards' }).click();
  await page.getByRole('link', { name: 'Operational Analytics' }).click();

  // 3. Wait for dashboard page to fully load
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Operational Analytics|Dashboard/i,
    }),
  ).toBeVisible();

  // 4. Wait for the recompute button to be BOTH visible and enabled
  const recomputeButton = page.locator(
    'main button:has(svg.lucide-refresh-ccw)',
  );
  await expect(recomputeButton).toBeVisible();
  await expect(recomputeButton).toBeEnabled({ timeout: 15000 });
  await recomputeButton.click();

  // 5. Verify confirmation dialog appears
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await expect(confirmDialog.getByText('Recompute Dashboard?')).toBeVisible();

  // 6. Confirm recomputation
  const confirmButton = confirmDialog.getByRole('button', { name: 'Confirm' });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();

  // 7. Verify confirmation dialog closes and toast appears
  await expect(confirmDialog).toBeHidden();
  await expect(
    page.getByText(/Dashboard recomputation started|recomputed successfully/i),
  ).toBeVisible({ timeout: 10000 });
});
