import { expect, test } from '@playwright/test';

test('verify vulnerability details page loads and fetches data correctly', async ({
  page,
}) => {
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

  // 4. Verify page header and table
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'All Vulnerabilities' }),
  ).toBeVisible();

  // 5. Dynamically locate the first vulnerability link in the table and navigate to report
  const firstVulnRow = main.locator('tbody tr').first();
  await expect(firstVulnRow).toBeVisible();

  const vulnLink = firstVulnRow.locator('a').first();
  await expect(vulnLink).toBeVisible();

  const href = await vulnLink.getAttribute('href');
  if (href) {
    await page.goto(href);
  } else {
    await vulnLink.click();
  }

  // 6. Verify navigation to Vulnerability Report page
  await page.waitForURL('**/vm/vulnerability-report**');
  await page.waitForLoadState('domcontentloaded');

  const reportContainer = page.locator('#report-content');
  await expect(reportContainer).toBeVisible();

  // 7. Verify report data and details are fetched and rendered
  await expect(page.getByText('Report Details')).toBeVisible();
  await expect(page.locator('.VulnReportEditor')).toBeVisible();
  await expect(page.getByText('Comment & Blocker Panel')).toBeVisible();

  // Verify comment input is present and functional
  const commentInput = page.getByPlaceholder(/Comment as/i);
  await expect(commentInput).toBeVisible();

  // 8. Test Ask AI tab if visible/authorized
  const askAiTab = page.getByRole('tab', { name: 'Ask AI' });
  if (await askAiTab.isVisible()) {
    await askAiTab.click();
    const askAiPanel = page.getByRole('tabpanel');
    await expect(askAiPanel).toBeVisible();
    await expect(
      page
        .getByPlaceholder(/Ask anything about this vulnerability/i)
        .or(page.getByText(/AI security assistant/i))
        .first(),
    ).toBeVisible();
  }

  // 9. Test Similar Findings tab
  const similarVulnsTab = page.getByRole('tab', { name: 'Similar Findings' });
  await expect(similarVulnsTab).toBeVisible();
  await similarVulnsTab.click();
  const similarPanel = page.getByRole('tabpanel');
  await expect(similarPanel).toBeVisible();

  // 10. Switch back to Report tab and verify report view
  const reportTab = page.getByRole('tab', { name: 'Report' });
  await expect(reportTab).toBeVisible();
  await reportTab.click();
  await expect(page.getByText('Report Details')).toBeVisible();
  await expect(page.locator('.VulnReportEditor')).toBeVisible();
});
