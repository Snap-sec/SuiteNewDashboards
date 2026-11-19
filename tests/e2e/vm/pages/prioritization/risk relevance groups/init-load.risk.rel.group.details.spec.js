import { expect, test } from '@playwright/test';

test('initial load and interaction on risk relevance group details page', async ({
  page,
}) => {
  test.setTimeout(60000);

  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Risk Relevance Groups via Prioritization sidebar menu
  const riskGroupsLink = page.getByRole('link', {
    name: 'Risk Relevance Groups',
  });
  if (!(await riskGroupsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Prioritization', exact: true })
      .click();
  }
  await expect(riskGroupsLink).toBeVisible();
  await riskGroupsLink.click();
  await page.waitForURL('**/vm/relevance-groups**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Dynamically locate and navigate to the first Risk Relevance Group details page if available
  const firstGroupCard = page
    .locator('a[href^="/vm/relevance-groups/"]')
    .first();

  if (await firstGroupCard.isVisible({ timeout: 5000 }).catch(() => false)) {
    await firstGroupCard.click();
    await page.waitForURL('**/vm/relevance-groups/**');
    await page.waitForLoadState('domcontentloaded');

    // 5. Verify page header and metrics summary
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(page.getByText('Vulnerabilities').first()).toBeVisible();
    await expect(page.getByText('Risk Points').first()).toBeVisible();

    // 6. Verify main tabs navigation
    const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
    const aboutTab = page.getByRole('tab', { name: 'About' });
    const vulnsTab = page.getByRole('tab', { name: 'Vulnerabilities' });
    const automationTab = page.getByRole('tab', { name: 'Automation' });

    await expect(dashboardTab).toBeVisible();
    await expect(aboutTab).toBeVisible();
    await expect(vulnsTab).toBeVisible();
    await expect(automationTab).toBeVisible();

    // 7. Test About tab interaction
    await aboutTab.click();
    await expect(page.getByRole('tabpanel')).toBeVisible();

    // 8. Test Vulnerabilities tab interaction
    await vulnsTab.click();
    await expect(page.getByRole('tabpanel')).toBeVisible();
  } else {
    // If no groups exist yet, assert empty state or page heading gracefully
    await expect(
      page.getByText('No Relevance Groups Found').or(page.getByRole('heading', { level: 1, name: 'Risk Relevance Groups' })),
    ).toBeVisible();
  }
});
