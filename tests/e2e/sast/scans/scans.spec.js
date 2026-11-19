import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on SAST scans page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SAST Scans page (/ui-sast/scans)
  await page.goto('/ui-sast/scans');
  await page.waitForURL('**/ui-sast/scans**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen if no scans exist
  const emptyScreen = page.getByText(
    /No Scans|Nothing to Display|No data available/i,
  );
  const emptySubText = page.getByText(
    /Theres currently no data available|Please take an action to get started/i,
  );
  const createScanBtn = page.getByRole('button', { name: /Create Scan/i });

  if ((await emptyScreen.isVisible()) || (await emptySubText.isVisible())) {
    await expect(emptyScreen.or(emptySubText).first()).toBeVisible();

    // Verify Create Scan action button on empty screen & modal interaction
    if (await createScanBtn.isVisible()) {
      await expect(createScanBtn).toBeVisible();
      await createScanBtn.click();

      const modal = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
      if (await modal.isVisible()) {
        await expect(
          modal.getByRole('heading', { name: 'Create SAST Scan' }),
        ).toBeVisible();
        await expect(modal.getByText('Scan All')).toBeVisible();
        await expect(modal.getByText('Select Project')).toBeVisible();

        const cancelBtn = modal.getByRole('button', { name: 'Cancel' });
        if (await cancelBtn.isVisible()) {
          await cancelBtn.click();
          await expect(modal).not.toBeVisible();
        }
      }
    }
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
      'Execution records for automated SAST code scans and static analysis.',
    ),
  ).toBeVisible();

  // 5. Verify Action Button & Create Scan Modal Interaction
  if (await createScanBtn.isVisible()) {
    await expect(createScanBtn).toBeVisible();
    await createScanBtn.click();

    const modal = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
    if (await modal.isVisible()) {
      await expect(
        modal.getByRole('heading', { name: 'Create SAST Scan' }),
      ).toBeVisible();
      await expect(modal.getByText('Scan All')).toBeVisible();
      await expect(modal.getByText('Select Project')).toBeVisible();

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

  // 8. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 9. Test Pagination if multiple pages exist
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
