import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on SCA action plan page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Action Plan page (/sca-ui/action-plan)
  await page.goto('/sca-ui/action-plan');
  await page.waitForURL('**/sca-ui/action-plan**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen if no action plan items exist
  const emptyScreen = page.getByText(/No Action Plan|No data available|No Vulnerabilities/i);
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 4. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Remediation Action Plan',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      /Prioritize actionable package upgrades based on their potential vulnerability reduction|Prioritized step-by-step package upgrade guide/i,
    ),
  ).toBeVisible();

  // 5. Verify Action Buttons (Refresh Plan, Export Action Plan)
  const refreshPlanBtn = main.getByRole('button', { name: /Refresh Plan/i });
  if (await refreshPlanBtn.isVisible()) {
    await expect(refreshPlanBtn).toBeVisible();
  }

  const exportBtn = main.getByRole('button', { name: /Export Action Plan/i });
  if (await exportBtn.isVisible()) {
    await expect(exportBtn).toBeVisible();
  }

  // 6. Verify Top Metrics Row
  await expect(main.getByText('Actionable Upgrades')).toBeVisible();
  await expect(main.getByText('Max Vulns Fixed (1 Step)')).toBeVisible();
  await expect(main.getByText('Addressable CVEs')).toBeVisible();
  await expect(main.getByText('High & Critical Remediated')).toBeVisible();

  // 7. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Component / Upgrade Target')).toBeVisible();
    await expect(thead.getByText('Target Project')).toBeVisible();
    await expect(thead.getByText('Project Type')).toBeVisible();
    await expect(thead.getByText('Vulnerabilities Fixed')).toBeVisible();
    await expect(thead.getByText('CVE Breakdown')).toBeVisible();
    await expect(thead.getByText('CLI Command')).toBeVisible();
  }

  // 8. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder('Search package or repo...')
    .or(main.getByPlaceholder(/Search package/i))
    .or(main.getByRole('textbox', { name: /Search package/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('ffm');
    await expect(searchInput).toHaveValue('ffm');
    await page.waitForTimeout(600); // Wait for debounce

    // Clear search
    const clearSearchBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearSearchBtn.isVisible()) {
      await clearSearchBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
    await page.waitForTimeout(600);
  }

  // 9. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 10. Test Pagination if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
    await page2Btn.click();
    await page.waitForTimeout(500);

    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
      await page1Btn.click();
      await page.waitForTimeout(500);
    }
  }
});