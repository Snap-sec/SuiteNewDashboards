import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM adapters page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Adapters page (/assetinventory/adapters)
  await page.goto('/assetinventory/adapters');
  await page.waitForURL('**/assetinventory/adapters**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: 'Integrations',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('List of Integrations')).toBeVisible();

  // 4. Verify Tabs (All Integrations, Active Integrations, Refresh Logs)
  const allIntegrationsTab = page.getByRole('tab', {
    name: /All Integrations/i,
  });
  const activeIntegrationsTab = page.getByRole('tab', {
    name: /Active Integrations/i,
  });
  const refreshLogsTab = page.getByRole('tab', {
    name: /Refresh Logs/i,
  });

  await expect(allIntegrationsTab).toBeVisible();
  await expect(activeIntegrationsTab).toBeVisible();
  await expect(refreshLogsTab).toBeVisible();

  // 5. Test Search Input on All Integrations Tab
  const searchInput = page.getByPlaceholder(/Search integrations/i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('oracle');
    await page.waitForTimeout(600); // Wait for filter debounce

    // Clear search input
    const clearSearchBtn = page.locator('button:has(svg.lucide-x)');
    if (await clearSearchBtn.isVisible()) {
      await clearSearchBtn.click();
    } else {
      await searchInput.fill('');
    }
    await page.waitForTimeout(600);
  }

  // 6. Test Category Filter Dropdown if present
  const categorySelector = page.getByRole('combobox').first();
  if (await categorySelector.isVisible()) {
    await categorySelector.click();
    const allOption = page
      .getByRole('option', { name: 'All' })
      .or(page.getByText('All').first());
    if (await allOption.isVisible()) {
      await allOption.click();
    } else {
      await page.keyboard.press('Escape');
    }
  }

  // 7. Switch to Active Integrations Tab
  await activeIntegrationsTab.click();
  await expect(activeIntegrationsTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  // 8. Switch to Refresh Logs Tab & Verify Table
  await refreshLogsTab.click();
  await expect(refreshLogsTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  const table = page.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Adapter')).toBeVisible();
    await expect(thead.getByText('Event')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Log Message')).toBeVisible();
    await expect(thead.getByText('Records Synced')).toBeVisible();
    await expect(thead.getByText('Date & Time')).toBeVisible();

    // Test Pagination if multiple pages exist
    const page2Btn = page.getByRole('button', { name: '2', exact: true });
    if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
      await page2Btn.click();
      await page.waitForTimeout(500);

      const page1Btn = page.getByRole('button', { name: '1', exact: true });
      if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
        await page1Btn.click();
        await page.waitForTimeout(500);
      }
    }
  }

  // 9. Switch back to All Integrations Tab
  await allIntegrationsTab.click();
  await expect(allIntegrationsTab).toHaveAttribute('data-state', 'active');
});
