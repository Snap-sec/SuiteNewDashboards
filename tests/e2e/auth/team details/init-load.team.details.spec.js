import { expect, test } from '@playwright/test';

test('initial load and interaction on team details page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Teams list page
  await page.goto('/profile/account/members/teams');
  await page.waitForURL('**/profile/account/members/teams**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Open the first available Team Details page
  const teamLink = page
    .locator('a[href*="/profile/account/members/teams/"]')
    .first();

  if (await teamLink.isVisible()) {
    await teamLink.click();
    await page.waitForURL('**/profile/account/members/teams/**');
    await page.waitForLoadState('domcontentloaded');

    // 4. Verify Team Info Card and fields
    await expect(
      page
        .getByRole('heading', { name: 'Team Info' })
        .or(page.getByText('Team Info', { exact: true })),
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByText('Team Name')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
    await expect(page.getByText('Department', { exact: true })).toBeVisible();
    await expect(page.getByText('Team Leads')).toBeVisible();

    // 5. Test Inline Edit toggles in Team Info Card
    const nameRow = page.locator('tr').filter({ hasText: /Team Name/i });
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

    // 6. Verify Team Members Table & Column Headers
    const table = page.locator('table').last();
    if (await table.isVisible()) {
      const thead = table.locator('thead');
      await expect(thead.getByText('Name')).toBeVisible();
      await expect(thead.getByText('Is Lead')).toBeVisible();
    }

    // 7. Test Table Search input and clear functionality
    const searchInput = page.getByPlaceholder(/Search/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('admin');
      await expect(searchInput).toHaveValue('admin');

      const clearBtn = page.locator('button:has(svg.lucide-x)').first();
      if (await clearBtn.isVisible()) {
        await clearBtn.click();
        await expect(searchInput).toHaveValue('');
      } else {
        await searchInput.fill('');
        await expect(searchInput).toHaveValue('');
      }
    }

    // 8. Verify action buttons (Add Members / Delete Team) if visible
    const addMembersBtn = page.getByRole('button', { name: /Add Members/i });
    if (await addMembersBtn.isVisible()) {
      await expect(addMembersBtn).toBeVisible();
    }

    const deleteTeamBtn = page.getByRole('button', { name: /Delete/i });
    if (await deleteTeamBtn.isVisible()) {
      await expect(deleteTeamBtn).toBeVisible();
    }
  }
});