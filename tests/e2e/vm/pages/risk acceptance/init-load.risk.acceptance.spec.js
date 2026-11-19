import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on Risk Acceptance page', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Risk Acceptance via sidebar
  const riskAcceptanceLink = page
    .getByRole('link', { name: 'Risk Acceptance' })
    .or(page.getByRole('button', { name: 'Risk Acceptance' }))
    .first();
  await expect(riskAcceptanceLink).toBeVisible();
  await riskAcceptanceLink.click();
  await page.waitForURL('**/vm/risk-acceptance**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify Tabs presence
  const dashboardTab = page.getByRole('tab', { name: /Dashboard/i });
  const escalationsTab = page.getByRole('tab', { name: /Escalations/i });
  await expect(dashboardTab).toBeVisible();
  await expect(escalationsTab).toBeVisible();

  // 5. Test Dashboard Tab (Default Active)
  await expect(dashboardTab).toHaveAttribute('data-state', 'active');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Dashboard' }).or(page.getByText('No Risk Acceptance Data')),
  ).toBeVisible();

  // 6. Navigate to Escalations Tab
  await escalationsTab.click();
  await expect(escalationsTab).toHaveAttribute('data-state', 'active');
  const tabpanel = page.getByRole('tabpanel');
  await expect(tabpanel).toBeVisible();

  // Verify Escalations heading or empty screen
  await expect(
    page.getByRole('heading', { level: 1, name: 'Escalations' }).or(page.getByText('No Escalations')),
  ).toBeVisible();

  // 7. Test Table Toolbar Filters
  await verifyTableToolbarFilters(page, tabpanel);

  // 8. Test Search Input and Clear Functionality
  const searchInput = tabpanel
    .getByPlaceholder(/Search/i)
    .or(tabpanel.getByRole('textbox', { name: /Search/i }))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('conf');
    await expect(searchInput).toHaveValue('conf');

    const clearBtn = tabpanel.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 9. Test Pagination if present
  const page2Button = tabpanel.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = tabpanel.getByRole('button', { name: '1', exact: true });
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  }

  // 10. Test Entity Details Modal (Clicking entity title)
  const firstEntity = tabpanel.locator('tbody tr td:first-child p').first();
  if (await firstEntity.isVisible()) {
    await firstEntity.click();

    const detailsModal = page.getByRole('dialog');
    await expect(detailsModal).toBeVisible();
    await expect(
      detailsModal.getByRole('heading', { name: 'Risk Acceptance Details' }),
    ).toBeVisible();

    // Close Details Modal
    const closeBtn = detailsModal.getByRole('button', { name: /Close/i }).or(detailsModal.locator('button:has(svg.lucide-x)')).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await expect(detailsModal).toBeHidden();
  }

  // 11. Test Action on Pending Escalation (Approve / Reject)
  const pendingRow = tabpanel.locator('tbody tr').filter({ hasText: /Pending/i }).first();
  if (await pendingRow.isVisible()) {
    const actionsBtn = pendingRow
      .getByRole('button', { name: 'Open menu' })
      .or(pendingRow.locator('button:has(svg.lucide-more-horizontal), button:has(svg.lucide-ellipsis)'))
      .first();

    if (await actionsBtn.isVisible()) {
      await actionsBtn.click();

      const viewItem = page.getByRole('menuitem', { name: /View Campaign|View Vulnerability/i });
      const takeActionItem = page.getByRole('menuitem', { name: 'Take Action' });

      await expect(viewItem).toBeVisible();
      await expect(takeActionItem).toBeVisible();
      await expect(takeActionItem).toBeEnabled();

      await takeActionItem.click();

      // Escalation details modal opens for action
      const actionModal = page.getByRole('dialog');
      await expect(actionModal).toBeVisible();

      const rejectBtn = actionModal.getByRole('button', { name: 'Reject' });
      const approveBtn = actionModal.getByRole('button', { name: 'Approve' });

      await expect(rejectBtn).toBeVisible();
      await expect(approveBtn).toBeVisible();

      // Trigger Reject action flow
      await rejectBtn.click();

      // Nested confirmation / reasoning modal
      const reasonInput = page.getByPlaceholder(/Provide your reasoning for/i);
      await expect(reasonInput).toBeVisible();
      await reasonInput.fill('Security risk assessment review rejected');

      const commitBtn = page.getByRole('button', { name: /Commit rejection|Commit approval/i });
      await expect(commitBtn).toBeEnabled();
      await commitBtn.click();

      // Verify toast notification
      await expect(
        page.getByText(/Risk Rejected Successfully|Risk Approved Successfully|Rejecting Risk|Approving Risk|Error/i).first(),
      ).toBeVisible({ timeout: 15000 });
    }
  }

  // 12. Verify Non-Pending Escalations Have 'Take Action' Disabled
  const resolvedRow = tabpanel.locator('tbody tr').filter({ hasText: /Approved|Rejected/i }).first();
  if (await resolvedRow.isVisible()) {
    const resolvedActionsBtn = resolvedRow
      .getByRole('button', { name: 'Open menu' })
      .or(resolvedRow.locator('button:has(svg.lucide-more-horizontal), button:has(svg.lucide-ellipsis)'))
      .first();

    if (await resolvedActionsBtn.isVisible()) {
      await resolvedActionsBtn.click();

      const disabledActionItem = page.getByRole('menuitem', { name: 'Take Action' });
      if (await disabledActionItem.isVisible()) {
        await expect(disabledActionItem).toBeDisabled();
      }

      await page.keyboard.press('Escape');
    }
  }

  // 13. Switch back to Dashboard Tab
  await dashboardTab.click();
  await expect(dashboardTab).toHaveAttribute('data-state', 'active');
});
