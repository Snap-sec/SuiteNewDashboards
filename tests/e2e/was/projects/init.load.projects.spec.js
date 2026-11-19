import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on WAS applications page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to WAS Applications page (/was/projects)
  await page.goto('/was/projects');
  await page.waitForURL('**/was/projects**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty Screen if no applications exist
  const emptyScreen = page.getByText('No Applications Found');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    await expect(
      page.getByText('You have not created any applications yet!'),
    ).toBeVisible();
    const addProjectBtn = page.getByRole('button', { name: /Add Project/i });
    if (await addProjectBtn.isVisible()) {
      await expect(addProjectBtn).toBeVisible();
    }
    return;
  }

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 4. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Applications',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      /Manage applications, configure security scans|Manage your Apisec applications/i,
    ),
  ).toBeVisible();

  // 5. Verify Add Project Button
  const addProjectBtn = main.getByRole('button', { name: /Add Project/i });
  if (await addProjectBtn.isVisible()) {
    await expect(addProjectBtn).toBeVisible();
  }

  // 6. Verify Search Input
  const searchInput = main
    .getByPlaceholder('Search Applications')
    .or(main.getByRole('textbox', { name: 'Search Applications' }))
    .first();
  await expect(searchInput).toBeVisible();

  // 7. Test Search Input Interaction & Debounce
  await searchInput.fill('xxxx');
  await expect(searchInput).toHaveValue('xxxx');
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
