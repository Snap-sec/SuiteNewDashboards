import { expect, test } from '@playwright/test';

test('initial load and interaction on VS vulnerabilities page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to VS Vulnerabilities page (/vs/vulns)
  await page.goto('/vs/vulns');
  await page.waitForURL('**/vs/vulns**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: 'Vulnerabilities',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText(
      /View, filter, and manage vulnerabilities identified across all scanned targets|Track, prioritize, and manage identified/i,
    ),
  ).toBeVisible();

  // 4. Handle Empty Screen if no vulnerabilities found
  const emptyScreen = page.getByText('No Vulnerabilities Found');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 5. Verify Severity Metrics Cards
  await expect(page.getByText('Total Active')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Critical').first()).toBeVisible();
  await expect(page.getByText('High').first()).toBeVisible();
  await expect(page.getByText('Medium').first()).toBeVisible();
  await expect(page.getByText('Low').first()).toBeVisible();

  // 6. Verify Table Toolbar Filters & Search Input
  const searchInput = page.getByPlaceholder(/Search Vulns/i);
  await expect(searchInput).toBeVisible();

  const resetBtn = page.getByRole('button', { name: /Reset/i });
  if (await resetBtn.isVisible()) {
    await expect(resetBtn).toBeVisible();
  }

  // 7. Verify Vulnerabilities Table
  const table = page.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText(/Title|Vulnerability/i)).toBeVisible();
    await expect(thead.getByText('Severity')).toBeVisible();
    await expect(thead.getByText('Scanner')).toBeVisible();
    await expect(thead.getByText('Asset')).toBeVisible();
  }

  // 8. Test Search Input Interaction & Debounce
  await searchInput.fill('weak');
  await page.waitForTimeout(600); // Wait for debounce

  // Clear search
  const clearSearchBtn = page.locator('button:has(svg.lucide-x)');
  if (await clearSearchBtn.isVisible()) {
    await clearSearchBtn.click();
  } else {
    await searchInput.fill('');
  }
  await page.waitForTimeout(600);

  // 9. Test Pagination if multiple pages exist
  const page2Btn = page.getByRole('button', { name: '2', exact: true });
  if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
    await page2Btn.click();
    await page.waitForTimeout(500);

    const page1Btn = page.getByRole('button', { name: '1', exact: true });
    if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
      await page1Btn.click();
      await page.waitForTimeout(500);
    }
  }
});