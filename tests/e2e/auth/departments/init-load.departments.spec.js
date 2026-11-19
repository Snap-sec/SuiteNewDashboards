import { expect, test } from '@playwright/test';

test('initial load and interaction on departments page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Departments via direct URL or navigation
  await page.goto('/profile/account/members/departments');
  await page.waitForURL('**/profile/account/members/departments**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Page Heading or Empty State
  const pageHeading = page
    .getByRole('heading', { name: 'Departments', exact: true })
    .or(page.getByText('Departments', { exact: true }))
    .or(page.getByText('List of Departments'))
    .or(page.getByText('No Departments Found'));
  await expect(pageHeading.first()).toBeVisible({ timeout: 15000 });

  // 4. Test Add Department modal trigger and dismissal
  const addDepartmentBtn = page
    .getByRole('button', { name: /Add Department|Create Department/i })
    .first();

  if (await addDepartmentBtn.isVisible()) {
    await addDepartmentBtn.click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(
      modal.getByRole('heading', { name: /Add New Department|Update Department/i }),
    ).toBeVisible();

    // Verify form fields inside modal
    const nameInput = modal
      .getByPlaceholder('e.g. IT department, Finance department')
      .or(modal.locator('#team-name'));
    await expect(nameInput).toBeVisible();

    const descInput = modal
      .getByPlaceholder('What is this department responsible for?')
      .or(modal.locator('#team-desc'));
    await expect(descInput).toBeVisible();

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

  // 5. Verify Department Cards (if departments exist)
  const departmentCards = page.locator('a[href*="/profile/account/members/departments/"]');
  if ((await departmentCards.count()) > 0) {
    const firstCard = departmentCards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator('span').filter({ hasText: /Team|Member/i }).first()).toBeVisible();
  }

  // 6. Verify FAQs Section
  const faqHeading = page.getByText(/Departments – FAQs/i);
  if (await faqHeading.isVisible()) {
    await expect(faqHeading).toBeVisible();

    const firstFaqQuestion = page
      .getByRole('button', { name: /What is a department in the system\?/i })
      .or(page.getByText(/What is a department in the system\?/i))
      .first();

    if (await firstFaqQuestion.isVisible()) {
      await firstFaqQuestion.click();
      await expect(
        page.getByText(/A department represents a high-level organizational unit/i),
      ).toBeVisible();
    }
  }
});
