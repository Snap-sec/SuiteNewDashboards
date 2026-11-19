import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on SCA vulnerabilities page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Vulnerabilities page (/sca-ui/vulnerabilities)
  await page.goto('/sca-ui/vulnerabilities');
  await page.waitForURL('**/sca-ui/vulnerabilities**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen or Metrics Cards (wait for API response)
  const emptyScreen = page
    .getByRole('heading', { name: /Nothing to Display|No Vulnerabilities Found/i })
    .or(page.getByText('No data available'));
  const totalCves = main.getByText('Total CVEs');

  await expect(totalCves.or(emptyScreen).first()).toBeVisible({
    timeout: 15000,
  });

  if (await emptyScreen.first().isVisible()) {
    await expect(emptyScreen.first()).toBeVisible();
    return;
  }

  // 4. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Vulnerabilities (CVE Findings)',
    exact: true,
  });
  await expect(heading).toBeVisible();
  await expect(
    main.getByText(
      /Monitor CVE findings across project dependencies|Real-time open-source vulnerability scanner/i,
    ),
  ).toBeVisible();

  // 5. Verify Severity Metrics Cards Row
  await expect(totalCves).toBeVisible();
  await expect(main.getByText('Critical', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('High', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('Medium', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('Low', { exact: true }).first()).toBeVisible();

  // 6. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Vulnerability ID')).toBeVisible();
    await expect(thead.getByText('Package Name')).toBeVisible();
    await expect(thead.getByText('Installed Version')).toBeVisible();
    await expect(thead.getByText('Fixed Version')).toBeVisible();
    await expect(thead.getByText('Project')).toBeVisible();
    await expect(thead.getByText('Severity')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('VM Ticket')).toBeVisible();
  }

  // 7. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder('Search CVE, package...')
    .or(main.getByPlaceholder(/Search CVE/i))
    .or(main.getByRole('textbox', { name: /Search CVE/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('389');
    await expect(searchInput).toHaveValue('389');
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

  // 8. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 9. Test Pagination if multiple pages exist
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