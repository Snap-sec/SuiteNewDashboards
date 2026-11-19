import { expect, test } from '@playwright/test';

test('initial load and interaction on blockers page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Blockers via sidebar
  const blockersLink = page
    .getByRole('link', { name: 'Blockers' })
    .or(page.getByRole('button', { name: 'Blockers' }))
    .first();
  await expect(blockersLink).toBeVisible();
  await blockersLink.click();
  await page.waitForURL('**/vm/blockers**');

  // 4. Verify page header and title
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'Blockers' }),
  ).toBeVisible();
  await expect(
    main.getByText(
      'Track and resolve critical issues blocking the remediation of vulnerabilities.',
    ),
  ).toBeVisible();

  // 5. Verify Tabs and switch to All Blockers
  const myBlockersTab = main.getByRole('tab', { name: /My Blockers/i });
  const allBlockersTab = main.getByRole('tab', { name: /All Blockers/i });

  await expect(myBlockersTab).toBeVisible();
  await expect(allBlockersTab).toBeVisible();

  // Switch to All Blockers tab
  await allBlockersTab.click();
  await expect(allBlockersTab).toHaveAttribute('data-state', 'active');
  const allBlockersPanel = main.getByRole('tabpanel');
  await expect(allBlockersPanel).toBeVisible();

  // 6. Test Priority filter
  const priorityFilterBtn = main.getByRole('button', { name: /Priority/i });
  if (await priorityFilterBtn.isVisible()) {
    await priorityFilterBtn.click();
    const criticalOption = page
      .getByRole('checkbox', { name: 'Critical' })
      .or(page.getByText('Critical'))
      .first();
    if (await criticalOption.isVisible()) {
      await criticalOption.click();
    }
    const resetBtn = page.getByRole('button', { name: 'Reset' }).first();
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    } else {
      await priorityFilterBtn.click();
    }
  }

  // 7. Test Assignee filter
  const assigneeFilterBtn = main.getByRole('button', { name: /Assignee/i });
  if (await assigneeFilterBtn.isVisible()) {
    await assigneeFilterBtn.click();
    const firstAssignee = page.locator('[role="checkbox"]').first();
    if (await firstAssignee.isVisible()) {
      await firstAssignee.click();
      await firstAssignee.click();
    }
    await assigneeFilterBtn.click();
  }

  // 8. Test Status filter
  const statusFilterBtn = main.getByRole('button', { name: /Status/i });
  if (await statusFilterBtn.isVisible()) {
    await statusFilterBtn.click();
    const pendingOption = page
      .locator('label')
      .filter({ hasText: 'Pending' })
      .first();
    if (await pendingOption.isVisible()) {
      await pendingOption.click();
      await pendingOption.click();
    }
    await statusFilterBtn.click();
  }

  // 9. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder('Search blockers...');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('finding');
  await expect(searchInput).toHaveValue('finding');

  const clearButton = main.locator('button:has(svg.lucide-x)');
  if (await clearButton.isVisible()) {
    await clearButton.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  }

  // 10. Switch back to My Blockers tab
  await myBlockersTab.click();
  await expect(myBlockersTab).toHaveAttribute('data-state', 'active');
  await expect(main.getByRole('tabpanel')).toBeVisible();
});
