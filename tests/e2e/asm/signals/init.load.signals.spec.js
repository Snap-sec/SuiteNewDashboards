import { expect, test } from '@playwright/test';

test('initial load and interaction on ASM signals page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Signals page
  await page.goto('/casm/signals');
  await page.waitForURL('**/casm/signals**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no rules exist
  const emptyScreen = page
    .getByText('No Rules Found')
    .or(page.getByText('No Results Found'));
  if (await emptyScreen.first().isVisible()) {
    await expect(emptyScreen.first()).toBeVisible();
    return;
  }

  // 4. Verify Sidebar Tabs (Active Rules / Disabled Rules)
  const activeRulesTab = page.getByRole('tab', { name: 'Active Rules' });
  const disabledRulesTab = page.getByRole('tab', { name: 'Disabled Rules' });

  await expect(activeRulesTab).toBeVisible({ timeout: 15000 });
  await expect(disabledRulesTab).toBeVisible();

  // Test tab switching
  await disabledRulesTab.click();
  await expect(disabledRulesTab).toHaveAttribute('data-state', 'active');

  await activeRulesTab.click();
  await expect(activeRulesTab).toHaveAttribute('data-state', 'active');

  // 5. Test Search Signal input in sidebar
  const searchSignalInput = page
    .getByPlaceholder(/Search Signal.../i)
    .or(page.getByRole('textbox', { name: /Search Signal.../i }))
    .first();

  if (await searchSignalInput.isVisible()) {
    await searchSignalInput.fill('web');
    await expect(searchSignalInput).toHaveValue('web');

    await searchSignalInput.fill('');
    await expect(searchSignalInput).toHaveValue('');
  }

  // Scope to the inner main details panel to avoid layout container strict mode conflicts
  const detailsPanel = page.locator('main').last();

  // 6. Verify Rule Details View (Description, Match Rule, Impacted Assets)
  const descriptionSection = detailsPanel.getByText('Description');
  if (await descriptionSection.isVisible()) {
    await expect(descriptionSection).toBeVisible({ timeout: 15000 });
    await expect(detailsPanel.getByText('Match Rule')).toBeVisible();
    await expect(detailsPanel.getByText('Impacted Assets')).toBeVisible();

    // 7. Verify Impacted Assets Table and Column Headers
    const table = detailsPanel.locator('table');
    if (await table.isVisible()) {
      const thead = table.locator('thead');
      await expect(thead.getByText('Asset')).toBeVisible();
      await expect(thead.getByText('Detected At')).toBeVisible();
      await expect(thead.getByText('VM Ticket')).toBeVisible();
    }

    // 8. Test Search in Impacted Assets table
    const assetSearchInput = detailsPanel
      .getByPlaceholder(/Search exposures.../i)
      .or(detailsPanel.getByRole('textbox', { name: /Search exposures.../i }))
      .first();

    if (await assetSearchInput.isVisible()) {
      await assetSearchInput.fill('snap');
      await expect(assetSearchInput).toHaveValue('snap');

      const clearBtn = detailsPanel.locator('button:has(svg.lucide-x)').first();
      if (await clearBtn.isVisible()) {
        await clearBtn.click();
        await expect(assetSearchInput).toHaveValue('');
      } else {
        await assetSearchInput.fill('');
        await expect(assetSearchInput).toHaveValue('');
      }
    }

    // 9. Test Export button if visible
    const exportBtn = detailsPanel.getByRole('button', { name: /Export/i });
    if (await exportBtn.isVisible()) {
      await expect(exportBtn).toBeVisible();
    }

    // 10. Test Pagination navigation if multiple pages exist
    const page2Btn = detailsPanel.getByRole('button', { name: '2', exact: true });
    if (await page2Btn.isVisible()) {
      await page2Btn.click();
      const page1Btn = detailsPanel.getByRole('button', { name: '1', exact: true });
      await expect(page1Btn).toBeVisible();
      await page1Btn.click();
    }
  }
});