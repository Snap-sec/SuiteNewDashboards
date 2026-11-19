import { expect, test } from '@playwright/test';

test('dynamically create a new assessment', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Assessments via sidebar
  const assessmentsLink = page.getByRole('link', { name: 'Assessments' });
  if (!(await assessmentsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Assessments', exact: true })
      .or(page.getByRole('button', { name: 'Vulnerabilities', exact: true }))
      .first()
      .click();
  }
  await expect(assessmentsLink).toBeVisible();
  await assessmentsLink.click();
  await page.waitForURL('**/vm/assessments**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify page header and title
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'Assessments' }),
  ).toBeVisible();

  // 5. Open Create Assessment modal
  const createAssessmentBtn = page.getByRole('button', {
    name: 'Create Assessment',
  });
  await expect(createAssessmentBtn).toBeVisible();
  await createAssessmentBtn.click();

  const modal = page.getByRole('dialog', { name: 'Create Assessment' });
  await expect(modal).toBeVisible();

  // 6. Fill dynamic assessment name (max 35 chars)
  const dynamicName = `Assmt-${Date.now()}`;
  const nameInput = modal.getByPlaceholder(/Enter Assessment Name/i);
  await expect(nameInput).toBeVisible();
  await nameInput.fill(dynamicName);

  // 7. Select Category dynamically from dropdown
  const categoryCombobox = modal.locator('button[role="combobox"]').first();
  if (await categoryCombobox.isVisible()) {
    await categoryCombobox.click();
    const firstCategoryOption = page.locator('[role="option"]').first();
    if (await firstCategoryOption.isVisible()) {
      await firstCategoryOption.click();
    }
  }

  // 8. Optionally select department dynamically if available
  const deptSelect = modal
    .getByText('Select departments')
    .or(modal.locator('button:has-text("Select departments")'))
    .first();
  if (await deptSelect.isVisible()) {
    await deptSelect.click();
    const firstDeptOption = page.locator('[role="option"]').first();
    if (await firstDeptOption.isVisible()) {
      await firstDeptOption.click();
    }
    // Close multi-select popover by clicking label
    await modal
      .getByText('Departments')
      .click({ force: true })
      .catch(() => {});
  }

  // 9. Submit the form
  const submitBtn = modal
    .locator('button[type="submit"]')
    .or(modal.getByRole('button', { name: 'Create Assessment' }))
    .last();
  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  // 10. Verify creation success notification appears and modal closes
  await expect(
    page.getByText(/Assessment created successfully/i),
  ).toBeVisible({ timeout: 15000 });
  await expect(modal).toBeHidden({ timeout: 10000 });
});
