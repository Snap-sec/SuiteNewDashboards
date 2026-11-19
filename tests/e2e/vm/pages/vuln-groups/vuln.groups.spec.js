import { expect, test } from '@playwright/test';

test('verify vulnerability groups load from backend across tabs', async ({
  page,
}) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Vulnerability Groups via sidebar
  const vulnGroupsLink = page.getByRole('link', {
    name: 'Vulnerability Groups',
  });
  if (!(await vulnGroupsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Vulnerabilities', exact: true })
      .click();
  }
  await expect(vulnGroupsLink).toBeVisible({ timeout: 10000 });
  await vulnGroupsLink.click();
  await expect(page).toHaveURL(/.*\/vm\/vulnerability-list/, { timeout: 15000 });
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify page heading
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'Vulnerability Groups' }),
  ).toBeVisible();

  // 5. Verify By CWE tab groups load from backend (default tab)
  const cweTab = main.getByRole('tab', { name: 'By CWE' });
  await expect(cweTab).toBeVisible();
  const cwePanel = main.getByRole('tabpanel');
  await expect(cwePanel).toBeVisible();
  // Ensure group cards/content from backend are visible
  await expect(cwePanel.locator('.grid').first()).toBeVisible();

  // 6. Verify By CVE tab groups load from backend
  const cveTab = main.getByRole('tab', { name: 'By CVE' });
  await expect(cveTab).toBeVisible();
  await cveTab.click();
  const cvePanel = main.getByRole('tabpanel');
  await expect(cvePanel).toBeVisible();
  // Ensure group cards/content from backend are visible
  await expect(cvePanel.locator('.grid').first()).toBeVisible();

  // 7. Verify Custom groups tab loads from backend
  const customTab = main.getByRole('tab', { name: 'Custom' });
  await expect(customTab).toBeVisible();
  await customTab.click();
  const customPanel = main.getByRole('tabpanel');
  await expect(customPanel).toBeVisible();
  // Ensure custom group cards or empty state from backend are visible
  await expect(
    customPanel.locator('.grid, .text-muted-foreground').first(),
  ).toBeVisible();

  // 8. Verify search input and clear functionality
  const searchInput = main.getByPlaceholder('Search...');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('injection');
  await expect(searchInput).toHaveValue('injection');

  // Clear search using the clear (X) button inside the search input or by resetting
  const clearButton = main.locator('button:has(svg.lucide-x)');
  if (await clearButton.isVisible()) {
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  }

  // 9. Verify pagination interaction if multiple pages are present
  const page2Button = main.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  } else {
    const nextButton = main.getByRole('button', { name: /Next/i });
    if ((await nextButton.isVisible()) && (await nextButton.isEnabled())) {
      await nextButton.click();
      const prevButton = main.getByRole('button', { name: /Previous/i });
      await expect(prevButton).toBeVisible();
      await prevButton.click();
    }
  }
});
