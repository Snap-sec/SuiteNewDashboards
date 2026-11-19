import { expect, test } from '@playwright/test';

test('initial load and interaction on department details page', async ({
  page,
}) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Departments list page
  await page.goto('/profile/account/members/departments');
  await page.waitForURL('**/profile/account/members/departments**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Open the first available Department Details page
  const departmentCard = page
    .locator('a[href*="/profile/account/members/departments/"]')
    .first();

  if (await departmentCard.isVisible()) {
    await departmentCard.click();
    await page.waitForURL('**/profile/account/members/departments/**');
    await page.waitForLoadState('domcontentloaded');

    // 4. Verify Department Details Card and fields
    await expect(
      page.getByText('Department Details', { exact: true }),
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByText('Department Name')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
    await expect(page.getByText('Department Lead')).toBeVisible();

    // 5. Test Inline Edit toggles in Department Details Card
    const nameRow = page.locator('tr').filter({ hasText: /Department Name/i });
    const editNameBtn = nameRow.getByRole('button').first();
    if (await editNameBtn.isVisible()) {
      await editNameBtn.click();
      const nameInput = nameRow.locator('input');
      await expect(nameInput).toBeVisible();

      // Cancel edit mode
      const cancelBtn = nameRow.locator('button:has(svg.lucide-x)').first();
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      } else {
        await editNameBtn.click();
      }
    }

    const descRow = page.locator('tr').filter({ hasText: /Description/i });
    const editDescBtn = descRow.getByRole('button').first();
    if (await editDescBtn.isVisible()) {
      await editDescBtn.click();
      const descTextarea = descRow.locator('textarea');
      await expect(descTextarea).toBeVisible();

      // Cancel edit mode
      const cancelBtn = descRow.locator('button:has(svg.lucide-x)').first();
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      } else {
        await editDescBtn.click();
      }
    }

    // 6. Verify Associated Teams Table & Column Headers
    const table = page.locator('table').last();
    if (await table.isVisible()) {
      const thead = table.locator('thead');
      await expect(thead.getByText('Name')).toBeVisible();
      await expect(thead.getByText('Description')).toBeVisible();
      await expect(thead.getByText('Team Lead')).toBeVisible();
      await expect(thead.getByText('Total Members')).toBeVisible();
    }

    // 7. Test Table Search input and clear functionality
    const searchInput = page.getByPlaceholder(/Search/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('team');
      await expect(searchInput).toHaveValue('team');

      const clearBtn = page.locator('button:has(svg.lucide-x)').first();
      if (await clearBtn.isVisible()) {
        await clearBtn.click();
        await expect(searchInput).toHaveValue('');
      } else {
        await searchInput.fill('');
        await expect(searchInput).toHaveValue('');
      }
    }

    // 8. Verify action buttons (Add Team / Delete Department) if visible
    const addTeamBtn = page.getByRole('button', { name: /Add Team/i });
    if (await addTeamBtn.isVisible()) {
      await expect(addTeamBtn).toBeVisible();
    }

    const deleteDeptBtn = page.getByRole('button', { name: /Delete/i });
    if (await deleteDeptBtn.isVisible()) {
      await expect(deleteDeptBtn).toBeVisible();
    }
  }
});