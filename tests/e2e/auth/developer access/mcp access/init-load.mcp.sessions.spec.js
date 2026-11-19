import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from "../../../helpers/toolbar-filters.helper";

test('initial load and interaction on MCP sessions page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to MCP Access page via direct URL or navigation
  await page.goto('/profile/account/mcp-access?tab=sessions');
  await page.waitForURL('**/profile/account/mcp-access**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Tabs and ensure MCP Sessions tab is active
  const sessionsTab = page.getByRole('tab', { name: /MCP Sessions/i });
  const configTab = page.getByRole('tab', { name: /MCP Configuration/i });

  await expect(sessionsTab).toBeVisible({ timeout: 15000 });
  await expect(configTab).toBeVisible();

  if ((await sessionsTab.getAttribute('data-state')) !== 'active') {
    await sessionsTab.click();
  }
  await expect(sessionsTab).toHaveAttribute('data-state', 'active');

  // 4. Verify Table and column headers (if records exist)
  const table = page.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('IDE / Tool')).toBeVisible();
    await expect(thead.getByText('Device')).toBeVisible();
    await expect(thead.getByText('User')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Vuln Requests')).toBeVisible();
    await expect(thead.getByText('Created At')).toBeVisible();
  }

  // 5. Test Search input and clear functionality
  const searchInput = page
    .getByPlaceholder('Search sessions...')
    .or(page.getByPlaceholder(/Search/i))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('mcp');
    await expect(searchInput).toHaveValue('mcp');

    // Clear search using the clear (X) button or input clear
    const clearBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 6. Test Table Toolbar Filters using helper (Users filter, options, Reset, etc.)
  await verifyTableToolbarFilters(page);

  // 7. Test Columns visibility dropdown
  const columnsBtn = page.getByRole('button', { name: /Columns/i });
  if (await columnsBtn.isVisible()) {
    await columnsBtn.click();
    const columnsDropdown = page
      .getByRole('menu')
      .or(page.locator('[data-slot="popover-content"], [role="menu"]'))
      .first();
    await expect(columnsDropdown).toBeVisible();

    // Close columns dropdown
    await page.keyboard.press('Escape');
  }

  // 8. Test Rows Per Page (Page Size) selector
  const pageSizeCombobox = page.getByRole('combobox').first();
  if (await pageSizeCombobox.isVisible()) {
    await pageSizeCombobox.click();
    const option20 = page
      .getByRole('option', { name: '20' })
      .or(page.locator('[role="option"]').filter({ hasText: '20' }));
    if (await option20.isVisible()) {
      await option20.click();
    } else {
      await page.keyboard.press('Escape');
    }
  }

  // 9. Test Pagination navigation if multiple pages are present
  const page2Btn = page.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = page.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }

  // 10. Verify session rows rendering (if table has rows)
  const rows = page.locator('tbody tr');
  if ((await rows.count()) > 0) {
    const firstRow = rows.first();
    await expect(firstRow).toBeVisible();
  }
});