import { expect, test } from '@playwright/test';

test('initial load and interaction on Reports page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Reports via Reports and Vendors sidebar menu
  const reportsLink = page.getByRole('link', {
    name: 'Reports',
    exact: true,
  });
  if (!(await reportsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Reports and Vendors', exact: true })
      .click();
  }
  await expect(reportsLink).toBeVisible({ timeout: 10000 });
  await reportsLink.click();
  await page.waitForURL('**/vm/reports**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify Page Heading or Empty Screen
  await expect(
    page
      .getByRole('heading', { level: 1, name: 'Reports' })
      .or(page.getByText('No Reports Found')),
  ).toBeVisible();

  // 5. Test Search input and clear functionality
  const searchInput = page
    .getByPlaceholder('Search by Report Title')
    .or(page.getByRole('textbox', { name: /Search by Report Title/i }))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('vulnerability');
    await expect(searchInput).toHaveValue('vulnerability');

    const clearBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 6. Test Pagination if multiple pages are present
  const page2Button = page.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = page
      .getByRole('main')
      .getByRole('button', { name: '1', exact: true })
      .or(page.getByRole('button', { name: '1', exact: true }))
      .first();
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  }

  // 8. Test Row Actions Dropdown if reports are listed
  const firstRow = page.locator('tbody tr').first();
  if (await firstRow.isVisible()) {
    const rowMenuBtn = firstRow
      .getByRole('button')
      .filter({ has: page.locator('svg.lucide-more-horizontal') })
      .first();

    if (await rowMenuBtn.isVisible()) {
      await rowMenuBtn.click();
      const menu = page.getByRole('menu');
      if (await menu.isVisible()) {
        await expect(menu).toBeVisible();
        await page.keyboard.press('Escape');
      }
    }
  }
});
