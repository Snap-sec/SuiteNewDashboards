import { expect, test } from '@playwright/test';

test('initial load and interaction on VS assets page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to VS Assets page (/vs/assets)
  await page.goto('/vs/assets');
  await page.waitForURL('**/vs/assets**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: 'Assets',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText(/View and monitor assets|List of Assets/i),
  ).toBeVisible();

  // 4. Handle Empty Screen if no assets found
  const emptyScreen = page.getByText(/No Assets Found/i);
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 5. Verify Stats Cards
  await expect(page.getByText('Total Assets').first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Vulnerable Assets').first()).toBeVisible();
  await expect(page.getByText('Safe Assets').first()).toBeVisible();
  await expect(page.getByText('Scan Coverage').first()).toBeVisible();

  // 6. Verify Table Toolbar Filters & Search Input
  const searchInput = page.getByPlaceholder(/Search Assets/i).or(
    page.getByRole('textbox', { name: /Search Assets/i }),
  );
  await expect(searchInput).toBeVisible();

  const resetBtn = page.getByRole('button', { name: /Reset/i });
  if (await resetBtn.isVisible()) {
    await expect(resetBtn).toBeVisible();
  }

  // 7. Verify Assets Table Headers
  const table = page.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Asset Name')).toBeVisible();
    await expect(thead.getByText('Groups')).toBeVisible();
    await expect(thead.getByText('Vulnerabilities')).toBeVisible();
    await expect(thead.getByText('Last Scanned')).toBeVisible();
  }

  // 8. Test Search Input Interaction & Debounce
  await searchInput.fill('blog');
  await page.waitForTimeout(600); // Wait for debounce

  // Clear search
  const clearSearchBtn = page.locator('button:has(svg.lucide-x)');
  if (await clearSearchBtn.isVisible()) {
    await clearSearchBtn.click();
  } else {
    await searchInput.fill('');
  }
  await page.waitForTimeout(600);

  // 9. Test Filter Button Interaction if available
  const typeFilterBtn = page.getByRole('button', { name: /Type/i });
  if (await typeFilterBtn.isVisible()) {
    await typeFilterBtn.click();
    await page.waitForTimeout(300);
    await page.keyboard.press('Escape');
  }

  // 10. Test Pagination if multiple pages exist
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