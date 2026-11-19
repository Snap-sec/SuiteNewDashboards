import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on SLA violations tab', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to SLA via sidebar
  const slaLink = page
    .getByRole('link', { name: 'SLA' })
    .or(page.getByRole('button', { name: 'SLA' }))
    .first();
  await expect(slaLink).toBeVisible();
  await slaLink.click();
  await page.waitForURL('**/vm/sla**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Navigate to Violations Tab
  const violationsTab = page.getByRole('tab', { name: 'Violations' });
  await expect(violationsTab).toBeVisible();
  await violationsTab.click();
  await expect(violationsTab).toHaveAttribute('data-state', 'active');
  const tabpanel = page.getByRole('tabpanel');
  await expect(tabpanel).toBeVisible();

  // 5. Verify Page Heading or Empty State
  await expect(
    page.getByRole('heading', { level: 1, name: 'SLA Violations' }).or(page.getByText('No SLA Violations')),
  ).toBeVisible();

  // 6. Test Toolbar Filters
  await verifyTableToolbarFilters(page, tabpanel);

  // 7. Test Search input and clear functionality
  const searchInput = tabpanel.getByPlaceholder(/Search/i);
  if (await searchInput.isVisible()) {
    await searchInput.fill('lodash');
    await expect(searchInput).toHaveValue('lodash');

    const clearBtn = tabpanel.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 8. Test Pagination if multiple pages are present
  const page2Button = tabpanel.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = tabpanel.getByRole('button', { name: '1', exact: true });
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  }

  // 9. Test Download CSV action with confirmation dialog
  const downloadBtn = page.getByRole('button', { name: 'Download CSV' });
  if (await downloadBtn.isVisible()) {
    await downloadBtn.click();

    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog).toBeVisible();

    const proceedBtn = confirmDialog.getByRole('button', { name: 'Proceed' });
    if (await proceedBtn.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
        proceedBtn.click(),
      ]);
    }
  }
});