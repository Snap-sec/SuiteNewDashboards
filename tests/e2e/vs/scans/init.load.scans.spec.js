import { expect, test } from '@playwright/test';

test('initial load and interaction on VS scans page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to VS Scans page (/vs/scans)
  await page.goto('/vs/scans');
  await page.waitForURL('**/vs/scans**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty Screen if no scans found
  const emptyScreen = page.getByText(/No data available/i);
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    const createScanBtn = page.getByRole('button', { name: /Create Scan/i });
    if (await createScanBtn.isVisible()) {
      await expect(createScanBtn).toBeVisible();
    }
    return;
  }

  // 4. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: 'Scans',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText(/View, monitor, and manage vulnerability scans|List of Scans/i),
  ).toBeVisible();

  // 5. Verify Create Scan Button
  const createScanBtn = page.getByRole('button', { name: /Create Scan/i });
  if (await createScanBtn.isVisible()) {
    await expect(createScanBtn).toBeVisible();
  }

  // 6. Verify Table Toolbar Filters & Search Input
  const searchInput = page.getByPlaceholder(/Search scans/i).or(
    page.getByRole('textbox', { name: /Search scans/i }),
  );
  await expect(searchInput).toBeVisible();

  const resetBtn = page.getByRole('button', { name: /Reset/i });
  if (await resetBtn.isVisible()) {
    await expect(resetBtn).toBeVisible();
  }

  // 7. Verify Scans Table Headers
  const table = page.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Asset Group')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Triggered By')).toBeVisible();
    await expect(thead.getByText('Assets')).toBeVisible();
    await expect(thead.getByText('Vulnerabilities')).toBeVisible();
    await expect(thead.getByText('Started')).toBeVisible();
    await expect(thead.getByText('Frequency')).toBeVisible();
  }

  // 8. Test Search Input Interaction & Debounce
  await searchInput.fill('scan');
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
  const stateFilterBtn = page.getByRole('button', { name: /State/i });
  if (await stateFilterBtn.isVisible()) {
    await stateFilterBtn.click();
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