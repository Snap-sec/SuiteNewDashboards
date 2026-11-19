import { expect, test } from '@playwright/test';

test('dynamically create a new vulnerability', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to All Vulnerabilities via sidebar
  const allVulnsLink = page.getByRole('link', { name: 'All Vulnerabilities' });
  if (!(await allVulnsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Vulnerabilities', exact: true })
      .click();
  }
  await expect(allVulnsLink).toBeVisible();
  await allVulnsLink.click();
  await page.waitForURL('**/vm/vulnerabilities**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify page header
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'All Vulnerabilities' }),
  ).toBeVisible();

  // 5. Open Create Vulnerability modal
  const createBtn = page.getByRole('button', {
    name: 'Create Vulnerability',
  });
  await expect(createBtn).toBeVisible({ timeout: 10000 });
  await createBtn.click();

  const modal = page.getByRole('dialog', {
    name: 'Create Vulnerability',
  });
  await expect(modal).toBeVisible({ timeout: 10000 });
  await expect(
    modal.getByRole('heading', { name: 'Create Vulnerability' }),
  ).toBeVisible();

  // 6. Generate dynamic vulnerability title (within 60 char limit)
  const dynamicId = Date.now().toString().slice(-6);
  const vulnTitle = `Vuln ${dynamicId} Test`;

  // 7. Fill Vulnerability Title
  const titleInput = modal
    .getByPlaceholder('e.g Session Hijacking via Insecure Cookies')
    .or(modal.getByRole('textbox', { name: /Vulnerability Title/i }));
  await expect(titleInput).toBeVisible();
  await titleInput.fill(vulnTitle);
  await expect(titleInput).toHaveValue(vulnTitle);

  // 8. Dynamically select Assessment from dropdown
  const assessmentCombobox = modal.getByRole('combobox').first();
  await expect(assessmentCombobox).toBeVisible({ timeout: 10000 });
  await assessmentCombobox.click();
  await expect(assessmentCombobox).toHaveAttribute('aria-expanded', 'true');

  const assessmentOption = page
    .locator('[data-slot="command-item"], [cmdk-item]')
    .first();
  await expect(assessmentOption).toBeVisible({ timeout: 10000 });
  await assessmentOption.click();

  // 9. Submit the form
  const submitBtn = modal.getByRole('button', { name: 'Create', exact: true });
  await expect(submitBtn).toBeEnabled({ timeout: 10000 });
  await submitBtn.click();

  // 10. Verify success feedback and modal dismissal
  await expect(
    page.getByText(/Vulnerability Created Successfully/i),
  ).toBeVisible({ timeout: 15000 });
  await expect(modal).toBeHidden({ timeout: 10000 });
});
