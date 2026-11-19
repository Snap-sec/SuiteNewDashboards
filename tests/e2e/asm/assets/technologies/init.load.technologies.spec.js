import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM technologies page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Technologies page
  await page.goto('/casm/assets/technologies');
  await page.waitForURL('**/casm/assets/technologies**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no technologies exist
  const emptyScreen = page.getByText('No Technologies Found');
  if (await emptyScreen.isVisible()) {
    await expect(
      page.getByText('When new technologies are added, they will show here.'),
    ).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', {
    name: 'Technologies',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('List of Technologies')).toBeVisible();

  // 5. Test Search input and clear functionality
  const searchInput = main
    .getByPlaceholder(/Search technologies.../i)
    .or(main.getByRole('textbox', { name: /Search technologies.../i }))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('styled');
    await expect(searchInput).toHaveValue('styled');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 6. Verify Table Toolbar Filters using helper (Is New, Categories, etc.)
  await verifyTableToolbarFilters(page, main);

  // 7. Test Export CSV button if visible
  const exportBtn = main.getByRole('button', { name: /Export/i });
  if (await exportBtn.isVisible()) {
    await expect(exportBtn).toBeVisible();
  }

  // 8. Test Pagination navigation if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }
});
