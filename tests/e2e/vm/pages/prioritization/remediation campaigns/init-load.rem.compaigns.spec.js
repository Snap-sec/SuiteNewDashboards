import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../../helpers/toolbar-filters.helper';

test('initial load and interaction on remediation campaigns page', async ({
  page,
}) => {
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

  // 4. Verify page header and title
  await expect(
    main
      .getByRole('heading', { level: 1, name: /Remediation Campaigns|Remidation Campaigns/i })
      .or(main.getByText(/Remediation Campaigns|Remidation Campaigns/i).first()),
  ).toBeVisible();
  await expect(
    main
      .getByText('Track and manage the progress of your vulnerability remediation campaigns.')
      .or(main.getByText(/No Remidation Campaigns Found|No Remediation Campaigns Found/i)),
  ).toBeVisible();

  // 5. Test Table Toolbar Filters
  await verifyTableToolbarFilters(page, main);

  // 6. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder('Type Campaign Name');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('upgrade');
  await expect(searchInput).toHaveValue('upgrade');

  const clearBtn = main.locator('button:has(svg.lucide-x)').first();
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
  }

  // 7. Test Recompute Campaigns action with confirmation modal if present
  const recomputeBtn = main.getByRole('button', { name: /Recompute/i });
  if (await recomputeBtn.isVisible()) {
    await recomputeBtn.click();

    const proceedBtn = page.getByRole('button', { name: 'Proceed' });
    if (await proceedBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await proceedBtn.click();
    }
  }

  // 8. Verify campaign cards or empty state
  const cardsContainer = main
    .locator('a[href*="/vm/remidation-campaign-details"]')
    .or(main.getByText('No Remidation Campaigns Found'))
    .or(main.getByText('Nothing matched your filters'));
  await expect(cardsContainer.first()).toBeVisible();

  // 9. Test pagination buttons if present
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    if (await page1Btn.isVisible()) {
      await page1Btn.click();
    }
  }

  const nextBtn = main.getByRole('button', { name: 'Next' });
  if ((await nextBtn.isVisible()) && (await nextBtn.isEnabled())) {
    await nextBtn.click();
    const prevBtn = main.getByRole('button', { name: 'Previous' });
    if ((await prevBtn.isVisible()) && (await prevBtn.isEnabled())) {
      await prevBtn.click();
    }
  }

  // 10. If campaign cards exist, verify badge elements
  const firstCard = main
    .locator('a[href*="/vm/remidation-campaign-details"]')
    .first();
  if (await firstCard.isVisible()) {
    await expect(firstCard.getByText('Vulns')).toBeVisible();
    await expect(firstCard.getByText('Risk')).toBeVisible();
  }
});