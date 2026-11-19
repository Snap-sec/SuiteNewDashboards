import { expect, test } from '@playwright/test';

test('initial load and interaction on current sessions page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Current Sessions via direct URL or navigation
  await page.goto('/profile/account/security/current-sessions');
  await page.waitForURL('**/profile/account/security/current-sessions**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Table and column headers
  const table = page.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('Person')).toBeVisible();
  await expect(thead.getByText('Last Login')).toBeVisible();
  await expect(thead.getByText('Browser')).toBeVisible();
  await expect(thead.getByText('Login Device')).toBeVisible();
  await expect(thead.getByText('Login OS')).toBeVisible();

  // 4. Test Search input and clear functionality
  const searchInput = page.getByPlaceholder(/Search/i).first();
  await expect(searchInput).toBeVisible();

  await searchInput.fill('admin');
  await expect(searchInput).toHaveValue('admin');

  // Clear search using the clear (X) button or input clear
  const clearBtn = page.locator('button:has(svg.lucide-x)').first();
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  }

  // 5. Test Columns visibility dropdown
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

  // 6. Test Rows Per Page (Page Size) selector
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

  // 7. Test Pagination navigation if multiple pages are present
  const page2Btn = page.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = page.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }

  // 8. Verify session rows (if records exist)
  const rows = page.locator('tbody tr');
  if ((await rows.count()) > 0) {
    const firstRow = rows.first();
    await expect(firstRow).toBeVisible();
  }
});