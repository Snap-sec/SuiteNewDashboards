import { expect, test } from '@playwright/test';

test('initial load and interaction on WAS detection rules page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to WAS Detection Rules page (/was/rules)
  await page.goto('/was/rules');
  await page.waitForURL('**/was/rules**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty Screen if no rule categories exist
  const emptyScreen = page.getByText('No Rule categories available');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    await expect(
      page.getByText(
        'Looks like, you have not added any rule category, Add one to start',
      ),
    ).toBeVisible();
    return;
  }

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 4. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Rule Categories',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      /Organize and manage security rules used to identify vulnerabilities|List of Rule Categories/i,
    ),
  ).toBeVisible();

  // 5. Verify Action Buttons (Create Rule, Sync default rules)
  const createRuleBtn = main.getByRole('button', { name: /Create Rule/i });
  if (await createRuleBtn.isVisible()) {
    await expect(createRuleBtn).toBeVisible();
  }

  const syncDefaultRulesBtn = main.getByRole('button', {
    name: /Sync default rules/i,
  });
  if (await syncDefaultRulesBtn.isVisible()) {
    await expect(syncDefaultRulesBtn).toBeVisible();
  }

  // 6. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder(/Search Groups.../i)
    .or(main.getByRole('textbox', { name: /Search Groups.../i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('xss');
    await expect(searchInput).toHaveValue('xss');
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

  // 7. Click on the first available Rule Category Card
  const firstCategoryCard = main
    .locator('.grid > div')
    .first();
  if (await firstCategoryCard.isVisible()) {
    await firstCategoryCard.click();
    await page.waitForURL('**/was/category-rules/**');
    await page.waitForLoadState('domcontentloaded');

    // 8. Verify Category Rules Details View
    const rulesHeading = page
      .getByRole('heading', {
        name: 'Rules',
        exact: true,
      })
      .or(page.getByText('No Rules Found'));
    await expect(rulesHeading.first()).toBeVisible({ timeout: 15000 });

    const emptyRules = page.getByText('No Rules Found');
    if (await emptyRules.isVisible()) {
      await expect(emptyRules).toBeVisible();
    } else {
      await expect(
        page.getByText(
          /Manage security rules used to detect and identify vulnerabilities|List of Rules/i,
        ),
      ).toBeVisible();
    }
  }
});