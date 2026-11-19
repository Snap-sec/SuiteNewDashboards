import { expect, test } from '@playwright/test';

test('initial load and interaction on risk relevance groups page', async ({
  page,
}) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Risk Relevance Groups via Prioritization sidebar menu
  const riskGroupsLink = page.getByRole('link', {
    name: 'Risk Relevance Groups',
  });
  if (!(await riskGroupsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Prioritization', exact: true })
      .click();
  }
  await expect(riskGroupsLink).toBeVisible();
  await riskGroupsLink.click();
  await page.waitForURL('**/vm/relevance-groups**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Verify page heading or empty screen state
  const headingOrEmpty = page
    .getByRole('heading', { level: 1, name: 'Risk Relevance Groups' })
    .or(page.getByText('No Relevance Groups Found'))
    .first();
  await expect(headingOrEmpty).toBeVisible({ timeout: 10000 });

  // 5. Test Refresh / Classify Groups action with confirmation modal
  const actionBtn = page
    .getByRole('button', { name: /Refresh Groups|Classify Groups/i })
    .first();

  if (await actionBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await actionBtn.click();

    const confirmDialog = page.getByRole('dialog');
    if (await confirmDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      const confirmBtn = confirmDialog
        .getByRole('button', { name: /Confirm|Execute/i })
        .first();
      await expect(confirmBtn).toBeVisible();
      await confirmBtn.click();
      await expect(
        page.getByText(/Classification triggered successfully/i).or(confirmDialog),
      ).toBeVisible({ timeout: 15000 });
    }
  }

  // 6. Verify cards container or empty state is rendered
  const cardsContainerOrEmpty = page
    .locator('.custom-scrollbar')
    .or(page.getByText('No Relevance Groups Found'))
    .first();
  await expect(cardsContainerOrEmpty).toBeVisible({ timeout: 10000 });

  // 7. If groups exist, verify card metadata (Vulns / Risk badges)
  const firstGroupCard = page
    .locator('a[href*="/vm/relevance-groups/"]')
    .first();
  if (await firstGroupCard.isVisible({ timeout: 3000 }).catch(() => false)) {
    await expect(firstGroupCard.getByText(/Vulns/i)).toBeVisible();
    await expect(firstGroupCard.getByText(/Risk/i)).toBeVisible();
  }
});