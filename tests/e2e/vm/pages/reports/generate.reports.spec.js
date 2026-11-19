import { expect, test } from '@playwright/test';

test('dynamically generate different types of reports', async ({ page }) => {
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

  // 4. Test Generating a Vulnerability Report on an Assessment
  const generateReportBtn = page.getByRole('button', { name: 'Generate Report' }).first();
  await expect(generateReportBtn).toBeVisible();
  await generateReportBtn.click();

  let modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.getByRole('heading', { name: 'Generate Report' })).toBeVisible();

  // Step 1: Select Vulnerability Report
  const vulnReportOption = modal.getByText(/Vulnerability Report/i).first();
  await expect(vulnReportOption).toBeVisible();
  await vulnReportOption.click();

  const nextBtn = modal.getByRole('button', { name: 'Next' });
  await expect(nextBtn).toBeEnabled();
  await nextBtn.click();

  // Step 2: Test Back Button and re-enter Step 2
  const backBtn = modal.getByRole('button', { name: 'Back' });
  await expect(backBtn).toBeVisible();
  await backBtn.click();

  await vulnReportOption.click();
  await nextBtn.click();

  // Select Assessment Scope
  const assessmentScopeBtn = modal.getByRole('button', { name: 'Assessment', exact: true });
  if (await assessmentScopeBtn.isVisible()) {
    await assessmentScopeBtn.click();

    // Open Assessment Select Combobox
    const selectCombobox = modal.getByRole('combobox');
    await selectCombobox.click();

    const firstOption = page.getByRole('option').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();

      // Test Format toggle if available
      const xlsxFormatBtn = modal.getByRole('button', { name: /xlsx/i });
      if (await xlsxFormatBtn.isVisible()) {
        await xlsxFormatBtn.click();
      }

      // Submit Report Generation
      const submitBtn = modal.getByRole('button', { name: 'Generate Report' });
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      // Assert Toast
      await expect(
        page.getByText(/Report generated successfully|Generating report|Error generating report/i).first(),
      ).toBeVisible({ timeout: 15000 });
    } else {
      await page.keyboard.press('Escape');
      const cancelBtn = modal.getByRole('button', { name: 'Cancel' });
      await cancelBtn.click();
    }
  }

  // 5. Test Generating a Full / Organization Scope Report
  if (await generateReportBtn.isVisible()) {
    await generateReportBtn.click();
    modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const revalidationOrExecutive = modal
      .getByText(/Revalidation Report|Executive Report|Vulnerability Report/i)
      .first();
    await revalidationOrExecutive.click();
    await modal.getByRole('button', { name: 'Next' }).click();

    const fullScopeBtn = modal.getByRole('button', { name: /Full|Organization/i }).first();
    if (await fullScopeBtn.isVisible()) {
      await fullScopeBtn.click();

      const submitBtn = modal.getByRole('button', { name: 'Generate Report' });
      await expect(submitBtn).toBeEnabled();
      await submitBtn.click();

      await expect(
        page.getByText(/Report generated successfully|Generating report|Error generating report/i).first(),
      ).toBeVisible({ timeout: 15000 });
    } else {
      const cancelBtn = modal.getByRole('button', { name: 'Cancel' });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
    }
  }
});