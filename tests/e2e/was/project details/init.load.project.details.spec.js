import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on WAS project details page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to WAS Applications page (/was/projects)
  await page.goto('/was/projects');
  await page.waitForURL('**/was/projects**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no applications exist
  const emptyScreen = page.getByText('No Applications Found');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 4. Open the first available application
  const firstProjectLink = page
    .locator('a[href*="/was/projects/"]')
    .first();
  await expect(firstProjectLink).toBeVisible({ timeout: 15000 });
  await firstProjectLink.click();
  await page.waitForURL('**/was/projects/**');
  await page.waitForLoadState('domcontentloaded');

  // 5. Verify Project Details Header & Action Button
  const projectHeading = page.locator('h1').first();
  await expect(projectHeading).toBeVisible({ timeout: 15000 });

  const instantScanBtn = page.getByRole('button', {
    name: /Start Instant Scan/i,
  });
  if (await instantScanBtn.isVisible()) {
    await expect(instantScanBtn).toBeVisible();
  }

  // 6. Verify Tab Triggers
  const metricsTab = page.getByRole('tab', { name: 'Metrics' });
  const endpointsTab = page.getByRole('tab', { name: "Requests & URL's" });
  const vulnsTab = page.getByRole('tab', { name: 'Vulnerabilities' });
  const scanHistoryTab = page.getByRole('tab', { name: 'Scan History' });
  const authScopeTab = page.getByRole('tab', { name: 'Auth & Scope' });
  const rulesTab = page.getByRole('tab', { name: 'Rules and Scanners' });

  if (await metricsTab.isVisible()) {
    await expect(metricsTab).toBeVisible();
  }
  await expect(endpointsTab).toBeVisible();
  await expect(vulnsTab).toBeVisible();
  await expect(scanHistoryTab).toBeVisible();

  // 7. Test Metrics Tab (if visible)
  if (await metricsTab.isVisible()) {
    await metricsTab.click();
    await expect(metricsTab).toHaveAttribute('data-state', 'active');
    await expect(page.getByText('Status Distribution')).toBeVisible();
    await expect(page.getByText('CWE Distribution')).toBeVisible();
    await expect(page.getByText('Severity Distribution')).toBeVisible();
  }

  // 8. Test Requests & URL's Tab
  await endpointsTab.click();
  await expect(endpointsTab).toHaveAttribute('data-state', 'active');
  const tabpanelEndpoints = page.getByRole('tabpanel');
  await expect(tabpanelEndpoints).toBeVisible();

  await expect(page.getByText('Total Requests')).toBeVisible();
  await expect(page.getByText('Total Vulnerabilities')).toBeVisible();

  const endpointsSearch = tabpanelEndpoints
    .getByPlaceholder(/Search/i)
    .or(tabpanelEndpoints.getByRole('textbox', { name: /Search/i }))
    .first();
  if (await endpointsSearch.isVisible()) {
    await endpointsSearch.fill('post');
    await page.waitForTimeout(600);

    const clearSearchBtn = tabpanelEndpoints
      .locator('button:has(svg.lucide-x)')
      .first();
    if (await clearSearchBtn.isVisible()) {
      await clearSearchBtn.click();
    } else {
      await endpointsSearch.fill('');
    }
    await page.waitForTimeout(600);
  }

  await verifyTableToolbarFilters(page, tabpanelEndpoints);

  // 9. Test Vulnerabilities Tab
  await vulnsTab.click();
  await expect(vulnsTab).toHaveAttribute('data-state', 'active');
  const tabpanelVulns = page.getByRole('tabpanel');
  await expect(tabpanelVulns).toBeVisible();

  await expect(page.getByText('Critical').first()).toBeVisible();
  await expect(page.getByText('High').first()).toBeVisible();
  await expect(page.getByText('Medium').first()).toBeVisible();
  await expect(page.getByText('Low').first()).toBeVisible();
  await expect(page.getByText('Info').first()).toBeVisible();

  const vulnsSearch = tabpanelVulns
    .getByPlaceholder(/Search/i)
    .or(tabpanelVulns.getByRole('textbox', { name: /Search/i }))
    .first();
  if (await vulnsSearch.isVisible()) {
    await vulnsSearch.fill('client');
    await page.waitForTimeout(600);

    const clearVulnSearchBtn = tabpanelVulns
      .locator('button:has(svg.lucide-x)')
      .first();
    if (await clearVulnSearchBtn.isVisible()) {
      await clearVulnSearchBtn.click();
    } else {
      await vulnsSearch.fill('');
    }
    await page.waitForTimeout(600);
  }

  await verifyTableToolbarFilters(page, tabpanelVulns);

  // 10. Test Scan History Tab
  await scanHistoryTab.click();
  await expect(scanHistoryTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // 11. Test Auth & Scope Tab (if available for user role)
  if (await authScopeTab.isVisible()) {
    await authScopeTab.click();
    await expect(authScopeTab).toHaveAttribute('data-state', 'active');
    await expect(page.getByRole('tabpanel')).toBeVisible();
  }

  // 12. Test Rules and Scanners Tab (if available for user role)
  if (await rulesTab.isVisible()) {
    await rulesTab.click();
    await expect(rulesTab).toHaveAttribute('data-state', 'active');
    const tabpanelRules = page.getByRole('tabpanel');
    await expect(tabpanelRules).toBeVisible();

    await expect(page.getByText('Scanner Engines')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Scan Rules' }),
    ).toBeVisible();

    const rulesSearch = tabpanelRules
      .getByPlaceholder(/Search/i)
      .or(tabpanelRules.getByRole('textbox', { name: /Search/i }))
      .first();
    if (await rulesSearch.isVisible()) {
      await rulesSearch.fill('error');
      await page.waitForTimeout(600);

      const clearRulesSearch = tabpanelRules
        .locator('button:has(svg.lucide-x)')
        .first();
      if (await clearRulesSearch.isVisible()) {
        await clearRulesSearch.click();
      } else {
        await rulesSearch.fill('');
      }
      await page.waitForTimeout(600);
    }
  }

  // 13. Switch back to Metrics Tab (or default tab)
  if (await metricsTab.isVisible()) {
    await metricsTab.click();
    await expect(metricsTab).toHaveAttribute('data-state', 'active');
  }
});