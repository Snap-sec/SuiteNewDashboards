import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on assessments page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Assessments via sidebar
  const assessmentsLink = page.getByRole('link', { name: 'Assessments' });
  if (!(await assessmentsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Assessments', exact: true })
      .or(page.getByRole('button', { name: 'Vulnerabilities', exact: true }))
      .first()
      .click();
  }
  await expect(assessmentsLink).toBeVisible();
  await assessmentsLink.click();
  await page.waitForURL('**/vm/assessments**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify page header and title
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'Assessments' }),
  ).toBeVisible();
  await expect(
    main.getByText(
      'Manage and track all security assessments across your organization.',
    ),
  ).toBeVisible();

  // 5. Verify Table or Empty State
  await expect(
    main.locator('table').or(main.getByText('No Assessments Found')).first(),
  ).toBeVisible();

  // 6. Test Toolbar Filters
  await verifyTableToolbarFilters(page);

  // 7. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder('Type Assessment Title');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('test');
  await expect(searchInput).toHaveValue('test');

  const clearButton = main.locator('button:has(svg.lucide-x)');
  if (await clearButton.isVisible()) {
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  }

  // 8. Test Page Size Dropdown if present
  const pageSizeSelect = main
    .locator('button[role="combobox"]')
    .or(main.locator('[data-slot="pagination-select"]'))
    .first();
  if (await pageSizeSelect.isVisible()) {
    await pageSizeSelect.click();
    const option = page.locator('[role="option"]').first();
    if (await option.isVisible()) {
      await option.click();
    }
  }

  // 9. Test pagination if multiple pages are present
  const page2Button = main.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  }
});
