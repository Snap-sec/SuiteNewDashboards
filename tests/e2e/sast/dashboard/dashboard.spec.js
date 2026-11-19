import { expect, test } from '@playwright/test';

test('initial load and interaction on SAST dashboard', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SAST Dashboard (/ui-sast)
  await page.goto('/ui-sast');
  await page.waitForURL('**/ui-sast**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty Screen if no active projects / data
  const emptyScreen = page.getByText('No SAST Projects');
  const setupIntegrationsBtn = page.getByRole('button', {
    name: /Setup Integrations/i,
  });

  if ((await emptyScreen.isVisible()) || (await setupIntegrationsBtn.isVisible())) {
    await expect(emptyScreen.or(setupIntegrationsBtn)).toBeVisible();
    return;
  }

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 4. Verify Page Heading
  const heading = main.getByRole('heading', {
    name: 'Dashboard',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });

  // 5. Verify KPI Metrics Cards
  await expect(main.getByText('Total Repositories')).toBeVisible();
  await expect(main.getByText('Vulnerable Repos')).toBeVisible();
  await expect(main.getByText('Critical Vulns')).toBeVisible();
  await expect(main.getByText('Total Scans')).toBeVisible();

  // 6. Verify Dashboard Charts
  await expect(main.getByText('Severity Distribution')).toBeVisible();
  await expect(main.getByText('Project Distribution')).toBeVisible();
  await expect(main.getByText('Vulnerability Timeline')).toBeVisible();

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

    // 8. Test Search Input Interaction
    const searchInput = main.getByPlaceholder('Search package...').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('CVE');
      await expect(searchInput).toHaveValue('CVE');
      await page.waitForTimeout(300);

      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
      await page.waitForTimeout(300);
    }
  }
});