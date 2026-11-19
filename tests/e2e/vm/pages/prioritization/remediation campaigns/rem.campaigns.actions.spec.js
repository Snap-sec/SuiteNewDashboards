import { expect, test } from '@playwright/test';

test('verify remediation campaign details page all actions', async ({
  page,
}) => {
  test.setTimeout(60000);

  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Remediation Campaigns via Prioritization sidebar menu
  const campaignsLink = page.getByRole('link', {
    name: 'Remediation Campaigns',
  });
  if (!(await campaignsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Prioritization', exact: true })
      .click();
  }
  await expect(campaignsLink).toBeVisible();
  await campaignsLink.click();
  await page.waitForURL(/.*\/vm\/(remidation-campaigns|remediation-campaigns).*/);
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 4. Locate first available campaign card or handle empty state gracefully
  const firstCard = main
    .locator('a[href*="/vm/remidation-campaign-details"]')
    .first();

  const emptyState = main
    .getByText('No Remidation Campaigns Found')
    .or(main.getByText('Nothing matched your filters'));

  await expect(firstCard.or(emptyState).first()).toBeVisible();

  if (!(await firstCard.isVisible())) {
    return;
  }

  await firstCard.click();
  await page.waitForURL('**/vm/remidation-campaign-details**');
  await page.waitForLoadState('domcontentloaded');

  // 5. Verify Campaign Details Header Card
  const heading = page.locator('h1').first();
  await expect(heading).toBeVisible();

  // ==================== ACTION 1: UPDATE OWNER ====================
  const ownerBox = page
    .locator('.border-dashed')
    .filter({ hasText: 'Owner' })
    .first();

  if (await ownerBox.isVisible()) {
    await ownerBox.hover();
    const ownerEditBtn = ownerBox
      .locator('button:has(svg.lucide-square-pen)')
      .or(ownerBox.getByRole('button').last());

    if (await ownerEditBtn.isVisible()) {
      await ownerEditBtn.click();

      const ownerCombobox = ownerBox.getByRole('combobox');
      if (await ownerCombobox.isVisible()) {
        await ownerCombobox.click();
        const firstMemberOption = page
          .locator('[data-slot="command-item"]')
          .or(page.locator('[role="option"]'))
          .first();

        if (await firstMemberOption.isVisible()) {
          await firstMemberOption.click();
        }
      }

      const saveOwnerBtn = ownerBox.locator('button:has(svg.lucide-check)');
      if (await saveOwnerBtn.isVisible()) {
        await saveOwnerBtn.click();
      }
    }
  }

  // ==================== ACTION 2: UPDATE STATE ====================
  const stateBox = page
    .locator('.border-dashed')
    .filter({ hasText: 'State' })
    .first();

  if (await stateBox.isVisible()) {
    await stateBox.hover();
    const stateEditBtn = stateBox
      .locator('button:has(svg.lucide-square-pen)')
      .or(stateBox.getByRole('button').last());

    if (await stateEditBtn.isVisible()) {
      await stateEditBtn.click();

      const stateCombobox = stateBox.getByRole('combobox');
      if (await stateCombobox.isVisible()) {
        await stateCombobox.click();

        const stateOption = page
          .getByRole('option', { name: /In Progress|Open|Dismissed|Completed/i })
          .or(page.locator('[data-slot="command-item"]'))
          .first();

        if (await stateOption.isVisible()) {
          await stateOption.click();
        }
      }

      const saveStateBtn = stateBox.locator('button:has(svg.lucide-check)');
      if (await saveStateBtn.isVisible()) {
        await saveStateBtn.click();
      }
    }
  }

  // ==================== ACTION 3: EXPORT ACTION PLAN ====================
  const exportBtn = page.locator('button:has(svg.lucide-download)').first();

  if (await exportBtn.isVisible()) {
    await exportBtn.click();
    const proceedBtn = page.getByRole('button', { name: 'Proceed' });
    if (await proceedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      const downloadPromise = page
        .waitForEvent('download', { timeout: 3000 })
        .catch(() => null);
      await proceedBtn.click();
      await downloadPromise;
    }
  }

  // ==================== ACTION 4: RECOMPUTE CAMPAIGN ====================
  const recomputeBtn = page
    .locator('button:has(svg.lucide-refresh-ccw)')
    .first();

  if (await recomputeBtn.isVisible()) {
    await recomputeBtn.click();
    const proceedBtn = page.getByRole('button', { name: 'Proceed' });
    if (await proceedBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await proceedBtn.click();
    }
  }

  // ==================== ACTION 5: SAFE DELETE MODAL CHECK ====================
  const deleteBtn = page.locator('button:has(svg.lucide-trash-2)').first();

  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    const cancelBtn = page.getByRole('button', { name: 'Cancel' });
    if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cancelBtn.click();
    }
  }

  // ==================== ACTION 6: TABS NAVIGATION & INTERACTIONS ====================
  // 1. Assets Tab
  const assetsTab = page.getByRole('tab', { name: 'Assets' });
  if (await assetsTab.isVisible()) {
    await assetsTab.click();
    await expect(assetsTab).toHaveAttribute('data-state', 'active');
    await expect(page.getByRole('tabpanel')).toBeVisible();

    const assetsSearch = page.getByPlaceholder(/Search/i).first();
    if (await assetsSearch.isVisible()) {
      await assetsSearch.fill('test');
      await assetsSearch.fill('');
    }

    const nextBtn = page.getByRole('button', { name: 'Next' });
    if ((await nextBtn.isVisible()) && (await nextBtn.isEnabled())) {
      await nextBtn.click();
      const prevBtn = page.getByRole('button', { name: 'Previous' });
      if ((await prevBtn.isVisible()) && (await prevBtn.isEnabled())) {
        await prevBtn.click();
      }
    }
  }

  // 2. Vulnerabilities Tab
  const vulnsTab = page.getByRole('tab', { name: 'Vulnerabilities' });
  if (await vulnsTab.isVisible()) {
    await vulnsTab.click();
    await expect(vulnsTab).toHaveAttribute('data-state', 'active');
    await expect(page.getByRole('tabpanel')).toBeVisible();

    const vulnsSearch = page.getByPlaceholder(/Search/i).first();
    if (await vulnsSearch.isVisible()) {
      await vulnsSearch.fill('test');
      await vulnsSearch.fill('');
    }

    const page2Btn = page.getByRole('button', { name: '2', exact: true });
    if (await page2Btn.isVisible()) {
      await page2Btn.click();
      const page1Btn = page.getByRole('button', { name: '1', exact: true });
      if (await page1Btn.isVisible()) {
        await page1Btn.click();
      }
    }
  }

  // 3. Dashboard Tab
  const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
  if (await dashboardTab.isVisible()) {
    await dashboardTab.click();
    await expect(dashboardTab).toHaveAttribute('data-state', 'active');
    await expect(page.getByRole('tabpanel')).toBeVisible();
  }
});