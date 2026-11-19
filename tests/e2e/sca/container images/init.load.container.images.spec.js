import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../helpers/toolbar-filters.helper';

test('initial load and interaction on SCA container images page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Container Images page (/sca-ui/container-images)
  await page.goto('/sca-ui/container-images');
  await page.waitForURL('**/sca-ui/container-images**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Handle Empty Screen or Heading (wait for API response)
  const emptyScreen = page.getByText(/No Container Images Found|No data available/i);
  const heading = main.getByRole('heading', {
    name: 'Container Images',
    exact: true,
  });

  await expect(heading.or(emptyScreen).first()).toBeVisible({ timeout: 15000 });

  if (await emptyScreen.first().isVisible()) {
    await expect(emptyScreen.first()).toBeVisible();
    return;
  }

  // 4. Verify Page Heading & Description
  await expect(heading).toBeVisible();
  await expect(
    main.getByText(
      /Monitor container images, registries, OS packages|Monitored container images, GHCR registries/i,
    ),
  ).toBeVisible();

  // 5. Verify Action Button & Add Image Modal Interaction
  const addImageBtn = main.getByRole('button', { name: /Add Image/i });
  if (await addImageBtn.isVisible()) {
    await expect(addImageBtn).toBeVisible();
    await addImageBtn.click();

    const modal = page.getByRole('dialog').or(page.locator('[role="dialog"]'));
    if (await modal.isVisible()) {
      await expect(modal.getByText('Add Container Image')).toBeVisible();
      await expect(
        modal.getByText('Container Image Name / URI'),
      ).toBeVisible();
      await expect(modal.getByText('Image Tag or Digest')).toBeVisible();
      await expect(modal.getByText('Target Registry')).toBeVisible();

      // Close modal using Cancel button
      const cancelBtn = modal.getByRole('button', { name: 'Cancel' });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await expect(modal).not.toBeVisible();
      }
    }
  }

  // 6. Verify Top Metrics Row
  await expect(main.getByText('Monitored Images')).toBeVisible();
  await expect(main.getByText('OS & App Packages')).toBeVisible();
  await expect(main.getByText('Vulnerable Images')).toBeVisible();
  await expect(main.getByText('Safe Images')).toBeVisible();
  await expect(main.getByText('Passing Rate')).toBeVisible();

  // 7. Verify Table and Column Headers
  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Container Image')).toBeVisible();
    await expect(thead.getByText('Tag')).toBeVisible();
    await expect(thead.getByText('Registry')).toBeVisible();
    await expect(thead.getByText('Base OS / Arch')).toBeVisible();
    await expect(thead.getByText('Packages')).toBeVisible();
    await expect(thead.getByText('Vulnerability Breakdown')).toBeVisible();
    await expect(thead.getByText('Last Scan')).toBeVisible();
  }

  // 8. Test Search Input Interaction & Debounce
  const searchInput = main
    .getByPlaceholder('Search image name, tag or digest...')
    .or(main.getByPlaceholder(/Search image/i))
    .or(main.getByRole('textbox', { name: /Search image/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('asset');
    await expect(searchInput).toHaveValue('asset');
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

  // 9. Verify Table Toolbar Filters using helper
  await verifyTableToolbarFilters(page, main);

  // 10. Test Pagination if multiple pages exist
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