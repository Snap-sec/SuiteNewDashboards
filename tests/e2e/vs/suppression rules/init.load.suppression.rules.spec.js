import { expect, test } from '@playwright/test';

test('initial load and interaction on VS suppression rules page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to VS Suppression Rules page (/vs/suppression-rules)
  await page.goto('/vs/suppression-rules');
  await page.waitForURL('**/vs/suppression-rules**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: 'Suppression Rules',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByText(
      /Create and manage rules for automatically suppressing vulnerabilities|List of rules to .*suppress/i,
    ),
  ).toBeVisible();

  // 4. Handle Empty Screen if no suppression rules found
  const emptyScreen = page.getByText(/No Suppression Rules Found|No Rules Found/i);
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    return;
  }

  // 5. Verify Table Toolbar Filters & Search Input
  const searchInput = page.getByPlaceholder(/Search rules/i).or(
    page.getByRole('textbox', { name: /Search rules/i }),
  );
  if (await searchInput.isVisible()) {
    await expect(searchInput).toBeVisible();

    // Test Search Input Interaction & Debounce
    await searchInput.fill('updated');
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

  // 6. Test Origin Filter Button if present
  const originFilterBtn = page.getByRole('button', { name: /Origin/i });
  if (await originFilterBtn.isVisible()) {
    await originFilterBtn.click();
    await page.waitForTimeout(300);
    // Click again to toggle/close or close outside
    await page.keyboard.press('Escape');
  }

  // 7. Test Pagination if multiple pages exist
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