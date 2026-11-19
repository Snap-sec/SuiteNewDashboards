import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on members page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Members page via direct URL or navigation
  await page.goto('/profile/account/members/team-members');
  await page.waitForURL('**/profile/account/members/team-members**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Page Heading and Tab triggers
  const pageHeading = page
    .getByRole('heading', { name: 'Members', exact: true })
    .or(page.getByText('Members', { exact: true }))
    .or(page.getByText('List of Members'));
  await expect(pageHeading.first()).toBeVisible({ timeout: 15000 });

  const membersTab = page.getByRole('tab', { name: /^Members/i });
  const invitedTab = page.getByRole('tab', { name: /Invited/i });
  const pendingRegTab = page.getByRole('tab', { name: /Pending Registerations/i });

  await expect(membersTab).toBeVisible();
  await expect(membersTab).toHaveAttribute('data-state', 'active');

  // 4. Verify Table and column headers in Members tab
  const table = page.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  const thead = table.locator('thead');
  await expect(thead.getByText('Member')).toBeVisible();
  await expect(thead.getByText('Team Name')).toBeVisible();
  await expect(thead.getByText('Department')).toBeVisible();
  await expect(thead.getByText('Role')).toBeVisible();
  await expect(thead.getByText('Status')).toBeVisible();

  // 5. Test Search input and clear functionality
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

  // 6. Test Table Toolbar Filters using helper (Role, Status, Reset, etc.)
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

  // 10. Test Tab Navigation between Members, Invited, and Pending Registerations
  if (await invitedTab.isVisible()) {
    await invitedTab.click();
    await expect(invitedTab).toHaveAttribute('data-state', 'active');
  }

  if (await pendingRegTab.isVisible()) {
    await pendingRegTab.click();
    await expect(pendingRegTab).toHaveAttribute('data-state', 'active');
  }

  // Switch back to Members Tab
  await membersTab.click();
  await expect(membersTab).toHaveAttribute('data-state', 'active');
});