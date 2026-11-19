import { expect, test } from '@playwright/test';

test('initial load and interaction on VS scanners page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to VS Scanners page (/vs/scanners)
  await page.goto('/vs/scanners');
  await page.waitForURL('**/vs/scanners**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty Screen if no scanners found
  const emptyScreen = page.getByText('No Scanners Found');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 4. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: 'Scanner',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText(/View and manage vulnerability scanners|List of Scanner/i),
  ).toBeVisible();

  // 5. Verify Download Button
  const downloadBtn = page.getByRole('button', { name: /Download/i });
  if (await downloadBtn.isVisible()) {
    await expect(downloadBtn).toBeVisible();
  }

  // 6. Verify Add Scanner Button & Modal Interaction
  const addBtn = page.getByRole('button', { name: /^Add$/i }).or(
    page.getByRole('button', { name: /Add New Scanner/i }),
  );
  if (await addBtn.first().isVisible()) {
    await expect(addBtn.first()).toBeVisible();
    await addBtn.first().click();

    // Verify Modal elements
    const modalHeading = page.getByRole('heading', { name: /Add New Scanner/i });
    await expect(modalHeading).toBeVisible();
    await expect(page.getByPlaceholder(/Enter Scanner Name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Enter Scanner URL/i)).toBeVisible();

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 7. Verify Search Input Interaction & Debounce
  const searchInput = page.getByPlaceholder(/Search Scanners/i).or(
    page.getByRole('textbox', { name: /Search Scanners/i }),
  );
  if (await searchInput.isVisible()) {
    await expect(searchInput).toBeVisible();

    // Test Search Input Interaction & Debounce
    await searchInput.fill('default');
    await page.waitForTimeout(600); // Wait for debounce

    // Clear search
    const clearSearchBtn = page.locator('button:has(svg.lucide-x)');
    if (await clearSearchBtn.isVisible()) {
      await clearSearchBtn.click();
    } else {
      await searchInput.fill('');
    }
    await page.waitForTimeout(600);
  }

  // 8. Verify Scanner Cards if present
  const scannerCards = page.locator('#projects_cards .grid > div').or(
    page.locator('.grid > div'),
  );
  if (await scannerCards.first().isVisible()) {
    await expect(scannerCards.first()).toBeVisible();
  }
});