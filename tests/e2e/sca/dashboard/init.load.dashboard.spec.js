import { expect, test } from '@playwright/test';

test('initial load and interaction on SCA dashboard', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Dashboard (/sca-ui)
  await page.goto('/sca-ui');
  await page.waitForURL('**/sca-ui**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen if no active integrations / data
  const gotoIntegrationsBtn = page.getByRole('button', {
    name: /Goto Integrations/i,
  });
  const totalRepos = main.getByText('Total Repositories');

  await expect(totalRepos.or(gotoIntegrationsBtn).first()).toBeVisible({
    timeout: 15000,
  });

  if (await gotoIntegrationsBtn.first().isVisible()) {
    await expect(gotoIntegrationsBtn.first()).toBeVisible();
    return;
  }

  // 4. Verify Page Heading
  const heading = main.getByRole('heading', {
    name: 'Dashboard',
    exact: true,
  });
  await expect(heading).toBeVisible();

  // 5. Verify KPI Metrics Cards
  await expect(totalRepos).toBeVisible();
  await expect(main.getByText('Failing Repos')).toBeVisible();
  await expect(main.getByText('Passing Repos')).toBeVisible();
  await expect(main.getByText('Total Dependencies')).toBeVisible();
  await expect(main.getByText('Total Vulnerabilities')).toBeVisible();
  await expect(main.getByText('Critical').first()).toBeVisible();
  await expect(main.getByText('High').first()).toBeVisible();
  await expect(main.getByText('Medium').first()).toBeVisible();
  await expect(main.getByText('Low').first()).toBeVisible();
  await expect(main.getByText('Total Scans')).toBeVisible();
  await expect(main.getByText('Active Integrations')).toBeVisible();

  // 6. Verify Dashboard Charts
  await expect(
    main.getByText('CVE Severity Distribution'),
  ).toBeVisible();
  await expect(
    main.getByText('Ecosystem Packages Distribution'),
  ).toBeVisible();
  await expect(
    main.getByText('Outdated Dependencies by Ecosystem'),
  ).toBeVisible();

  // 7. Verify Top Discovered Vulnerabilities Table
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Vulnerability ID')).toBeVisible();
    await expect(thead.getByText('Package Name')).toBeVisible();
    await expect(thead.getByText('Installed / Fixed')).toBeVisible();
    await expect(thead.getByText('Repository')).toBeVisible();
    await expect(thead.getByText('Severity')).toBeVisible();
    await expect(thead.getByText('CVSS')).toBeVisible();
  }
});
