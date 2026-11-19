import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../../helpers/toolbar-filters.helper';

test('initial load and interaction on false positive analysis page', async ({
  page,
}) => {
  test.setTimeout(60000);

  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to False Positive Analysis via Prioritization sidebar menu
  const fpLink = page.getByRole('link', {
    name: 'False Positive Analysis',
  });
  if (!(await fpLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Prioritization', exact: true })
      .click();
  }
  await expect(fpLink).toBeVisible();
  await fpLink.click();
  await page.waitForURL('**/vm/false-positive-analysis**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify main tabs are visible
  const reviewTab = page.getByRole('tab', { name: 'Review Requests' });
  const rulesTab = page.getByRole('tab', { name: 'Analysis Rules' });

  await expect(reviewTab).toBeVisible();
  await expect(rulesTab).toBeVisible();
  await expect(reviewTab).toHaveAttribute('data-state', 'active');

  const reviewPanel = page.getByRole('tabpanel', { name: 'Review Requests' });
  await expect(reviewPanel).toBeVisible();

  // 5. Check for AI Configuration Required, Empty Setup State, or Active List
  const aiRequired = reviewPanel.getByText('AI Configuration Required');
  const emptySetup = reviewPanel.getByText('No False Positive Requests');
  const sidebarHeading = reviewPanel.getByRole('heading', {
    name: 'False Positive Workflow',
  });

  await verifyTableToolbarFilters(page);

  await expect(aiRequired.or(emptySetup).or(sidebarHeading)).toBeVisible();

  // 6. Test Review Requests workflow if items exist
  if (await sidebarHeading.isVisible()) {
    // 6a. Test Search Input functionality
    const searchInput = reviewPanel.getByPlaceholder(
      'Search vulnerabilities...',
    );
    if (await searchInput.isVisible()) {
      await searchInput.fill('vulnerability');
      await expect(searchInput).toHaveValue('vulnerability');
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }

    // 6b. Test Filter button if present
    const filterBtn = reviewPanel
      .locator('button:has(svg.lucide-filter)')
      .first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      const popoverOrDrawer = page
        .locator('[data-slot="popover-content"], [role="dialog"]')
        .first();
      if (await popoverOrDrawer.isVisible()) {
        const closeBtn = popoverOrDrawer
          .getByRole('button', { name: /Close|Cancel/i })
          .or(page.locator('.fixed.inset-0'))
          .first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        } else {
          await filterBtn.click();
        }
      }
    }

    // 6c. Test card selection in sidebar
    const vulnCards = reviewPanel.locator('aside .cursor-pointer');
    const cardCount = await vulnCards.count();
    if (cardCount > 1) {
      await vulnCards.nth(1).click();
      await page.waitForTimeout(300);
    }

    // 6d. Verify Detail View components
    await expect(reviewPanel.getByText('AI Explanation')).toBeVisible();
    await expect(reviewPanel.getByText('Vulnerability Report')).toBeVisible();

    // 6e. Test Approve / Reject Action modal (safe check with Cancel)
    const approveBtn = reviewPanel.getByRole('button', { name: 'Approve' });
    if (await approveBtn.isVisible()) {
      await approveBtn.click();

      const confirmDialog = page.getByRole('dialog');
      if (await confirmDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(
          confirmDialog.getByText('Approve False Positive'),
        ).toBeVisible();
        const cancelBtn = confirmDialog.getByRole('button', { name: 'Cancel' });
        if (await cancelBtn.isVisible()) {
          await cancelBtn.click();
        }
      }
    }
  }

  // 7. Test Tab switching to Analysis Rules
  await rulesTab.click();
  await expect(rulesTab).toHaveAttribute('data-state', 'active');

  const rulesPanel = page.getByRole('tabpanel', { name: 'Analysis Rules' });
  await expect(rulesPanel).toBeVisible();

  // Verify Automation Engine inside Analysis Rules
  const automationContent = rulesPanel
    .getByText('No Automation Rules Found')
    .or(rulesPanel.getByRole('button', { name: /Create Rule/i }))
    .or(rulesPanel.locator('aside'));
  await expect(automationContent.first()).toBeVisible();

  // 8. Switch back to Review Requests tab
  await reviewTab.click();
  await expect(reviewTab).toHaveAttribute('data-state', 'active');
  await expect(reviewPanel).toBeVisible();
});
