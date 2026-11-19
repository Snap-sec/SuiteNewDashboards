import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on vulnerabilities page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to All Vulnerabilities via sidebar
  const allVulnsLink = page.getByRole('link', { name: 'All Vulnerabilities' });
  if (!(await allVulnsLink.isVisible())) {
    await page.getByRole('button', { name: 'Vulnerabilities', exact: true }).click();
  }
  await expect(allVulnsLink).toBeVisible();
  await allVulnsLink.click();
  await page.waitForURL('**/vm/vulnerabilities**');

  // 4. Verify page header and title
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'All Vulnerabilities' }),
  ).toBeVisible();
  await expect(
    main
      .getByText(/Comprehensive overview and management/i)
      .or(main.getByText('No Vulnerabilities Found')),
  ).toBeVisible();

  // 5. Verify Metrics Cards are rendered
  await expect(main.getByText('In Review').first()).toBeVisible({ timeout: 10000 });
  await expect(main.getByText('Triaged').first()).toBeVisible({ timeout: 10000 });

  // 6. Test search input and clear functionality
  const searchInput = main.getByPlaceholder('Search ...');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('cors');
  await expect(searchInput).toHaveValue('cors');

  await verifyTableToolbarFilters(page, main);

  // Clear search using the clear (X) button inside main
  const clearButton = main.locator('button:has(svg.lucide-x)').first();
  if (await clearButton.isVisible()) {
    await clearButton.click();
  } else {
    await searchInput.clear();
  }
  await expect(searchInput).toHaveValue('');

  // 8. Test pagination if multiple pages are present
  const page2Button = main.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  }
});

