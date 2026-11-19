import { expect, test } from '@playwright/test';

test('initial load and filtering on Archived Vulnerabilities page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Archived Vulnerabilities via sidebar
  const archivedVulnsLink = page.getByRole('link', {
    name: 'Archived Vulnerabilities',
  });
  if (!(await archivedVulnsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Vulnerabilities', exact: true })
      .click();
  }
  await expect(archivedVulnsLink).toBeVisible({ timeout: 10000 });
  await archivedVulnsLink.click();
  await page.waitForURL('**/vm/archived-vulns**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify page header and title
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'Archived Vulnerabilities' }),
  ).toBeVisible();
  await expect(
    main.getByText(
      'Review and restore vulnerabilities that have been previously archived or dismissed.',
    ),
  ).toBeVisible();

  // 5. Test Severity Filter
  const severityFilterBtn = main.getByRole('button', { name: /Severity/i }).first();
  if (await severityFilterBtn.isVisible()) {
    await severityFilterBtn.click();
    const criticalCheckbox = page.getByRole('checkbox', { name: 'Critical' });
    if (await criticalCheckbox.isVisible()) {
      await criticalCheckbox.click();
      await criticalCheckbox.click(); // Toggle back
    }
    const resetBtn = page.getByRole('button', { name: 'Reset' });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
  }

  // 6. Test State Filter
  const stateFilterBtn = main.getByRole('button', { name: /State/i }).first();
  if (await stateFilterBtn.isVisible()) {
    await stateFilterBtn.click();
    const resetBtn = page.getByRole('button', { name: 'Reset' });
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
  }
});
