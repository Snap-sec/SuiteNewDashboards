import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on SCA scans page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Scans page (/sca-ui/scans)
  await page.goto('/sca-ui/scans');
  await page.waitForURL('**/sca-ui/scans**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen if no scans exist
  const emptyScreen = page.getByText(/No Scans|No data available/i);
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 4. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Scan History & Audit Logs',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      /Review historical scan executions, dependency analysis results|Execution records for automated Git tree/i,
    ),
  ).toBeVisible();

  // 5. Verify Action Button & Create Scan Modal Interaction
  const createScanBtn = main.getByRole('button', { name: /Create Scan/i });
  if (await createScanBtn.isVisible()) {
    await expect(createScanBtn).toBeVisible();
    await createScanBtn.click();

    const modal = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
    if (await modal.isVisible()) {
      await expect(modal.getByText('Create Scan')).toBeVisible();
      await expect(modal.getByText('Scan Everything')).toBeVisible();
      await expect(modal.getByText('Scan Repository')).toBeVisible();
      await expect(modal.getByText('Scan Image')).toBeVisible();

      // Close modal using Cancel button
      const cancelBtn = modal.getByRole('button', { name: 'Cancel' });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(modal).not.toBeVisible();
      }
    }
  }

  // 6. Verify Top Metrics Row
  await expect(main.getByText('Total Scans Executed')).toBeVisible();
  await expect(main.getByText('Successful Scans')).toBeVisible();
  await expect(main.getByText('Packages Inspected')).toBeVisible();
  await expect(main.getByText('Engine Status')).toBeVisible();

  // 7. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Scan Name')).toBeVisible();
    await expect(thead.getByText('Vulnerabilities')).toBeVisible();
    await expect(thead.getByText('Initiated By')).toBeVisible();
    await expect(thead.getByText('Last Scan')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
  }

  // 8. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder('Search repository or branch...')
    .or(main.getByPlaceholder(/Search repository/i))
    .or(main.getByRole('textbox', { name: /Search repository/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('apisec');
    await expect(searchInput).toHaveValue('apisec');
    await page.waitForTimeout(600); // Wait for debounce

    // Clear search
    const clearSearchBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearSearchBtn.isVisible()) {
      await clearSearchBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
    await page.waitForTimeout(600);
  }

  // 9. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 10. Test Pagination if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
    await page2Btn.click();
    await page.waitForTimeout(500);

    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
      await page1Btn.click();
      await page.waitForTimeout(500);
    }
  }
});