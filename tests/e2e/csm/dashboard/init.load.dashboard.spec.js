import { expect, test } from '@playwright/test';

test('initial load and interaction on CSM dashboard page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to CSM Dashboard page (/csp-m)
  await page.goto('/csp-m');
  await page.waitForURL('**/csp-m**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Verify Page Heading or Empty Screen
  const emptyScreen = main.getByText(/No dashboard data available|No data available/i);
  const heading = main.getByRole('heading', {
    name: /Dashboard|Cloud Posture Overview/i,
  });

  await expect(heading.or(emptyScreen)).toBeVisible({ timeout: 15000 });

  if (await emptyScreen.isVisible()) {
    const integrationsBtn = page.getByRole('button', {
      name: /Go to Integrations/i,
    });
    if (await integrationsBtn.isVisible()) {
      await expect(integrationsBtn).toBeVisible();
    }
    return;
  }

  // 4. Verify Page Heading & Description
  await expect(heading).toBeVisible();
  await expect(
    main.getByText(
      /Monitor cloud security posture across connected accounts|Misconfigurations and risk across every connected cloud account/i,
    ),
  ).toBeVisible();

  // 5. Verify Top Metrics Strip Cards
  await expect(main.getByText('Total Findings')).toBeVisible();
  await expect(main.getByText('Critical', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('High', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('Medium', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('Low', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('Resources Scanned')).toBeVisible();
  await expect(main.getByText('Failed Checks')).toBeVisible();

  // 6. Verify Dashboard Charts
  await expect(main.getByText('Severity Distribution')).toBeVisible();
  await expect(main.getByText('Findings by Category')).toBeVisible();
  await expect(main.getByText('Vulnerabilities by Provider')).toBeVisible();
  await expect(main.getByText('Findings Opened vs. Resolved')).toBeVisible();
});