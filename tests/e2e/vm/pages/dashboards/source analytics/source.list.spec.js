import { expect, test } from '@playwright/test';

test('filter sources in sources list tab', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management -> Source Analytics
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  await page.getByRole('button', { name: 'Dashboards' }).click();
  await page.getByRole('link', { name: 'Source Analytics' }).click();

  // 3. Switch to Sources List tab
  const sourcesTab = page.getByRole('tab', { name: 'Sources List' });
  await expect(sourcesTab).toBeVisible();
  await sourcesTab.click();

  // 4. Search for a source
  const searchInput = page.getByPlaceholder('Filter sources by name or type...');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('trivy');
  await expect(searchInput).toHaveValue('trivy');

  // 5. Clear search using the clear (X) button
  const clearButton = page.locator('button:has(svg.lucide-x)');
  await expect(clearButton).toBeVisible();
  await clearButton.click();
  await expect(searchInput).toHaveValue('');

  // 6. Search for another term and clear again
  await searchInput.fill('test');
  await expect(searchInput).toHaveValue('test');
  await clearButton.click();
  await expect(searchInput).toHaveValue('');
});
