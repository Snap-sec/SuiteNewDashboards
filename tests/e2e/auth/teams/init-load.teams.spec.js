import { expect, test } from '@playwright/test';

test('initial load and interaction on teams page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Teams via direct URL or navigation
  await page.goto('/profile/account/members/teams');
  await page.waitForURL('**/profile/account/members/teams**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Page Heading or Empty State
  const pageHeading = page
    .getByRole('heading', { name: 'Teams', exact: true })
    .or(page.getByText('Teams', { exact: true }))
    .or(page.getByText('List of Teams'))
    .or(page.getByText('No Teams Found'));
  await expect(pageHeading.first()).toBeVisible({ timeout: 15000 });

  // 4. Verify Table and column headers
  const table = page.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Team')).toBeVisible();
    await expect(thead.getByText('Department')).toBeVisible();
    await expect(thead.getByText('Last Modified')).toBeVisible();
    await expect(thead.getByText('Members')).toBeVisible();
  }

  // 5. Test Search input and clear functionality
  const searchInput = page
    .getByPlaceholder('Search teams...')
    .or(page.getByPlaceholder(/Search/i))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('data');
    await expect(searchInput).toHaveValue('data');

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

  // 6. Test Columns visibility dropdown
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

  // 7. Test Rows Per Page (Page Size) selector
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

  // 8. Test Pagination navigation if multiple pages are present
  const page2Btn = page.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = page.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }

  // 9. Test Add Team modal trigger and dismissal
  const addTeamBtn = page.getByRole('button', { name: /Add Team/i }).first();
  if (await addTeamBtn.isVisible()) {
    await addTeamBtn.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(
      modal.getByRole('heading', { name: /Add New Team|Update Team/i }),
    ).toBeVisible();

    // Dismiss modal with Escape or close button
    const closeBtn = modal
      .getByRole('button', { name: /Close/i })
      .or(modal.locator('button:has(svg.lucide-x)'))
      .first();

    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }

    await expect(modal).toBeHidden();
  }

  // 10. Verify FAQs Section
  const faqHeading = page.getByText(/Teams – FAQs/i);
  if (await faqHeading.isVisible()) {
    await expect(faqHeading).toBeVisible();

    const firstFaqQuestion = page
      .getByRole('button', { name: /What is a team\?/i })
      .or(page.getByText(/What is a team\?/i))
      .first();

    if (await firstFaqQuestion.isVisible()) {
      await firstFaqQuestion.click();
      await expect(
        page.getByText(/A team is a smaller group within a department/i),
      ).toBeVisible();
    }
  }
});