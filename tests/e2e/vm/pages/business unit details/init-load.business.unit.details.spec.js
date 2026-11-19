import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on business unit details page', async ({
  page,
}) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Business Units via sidebar
  const businessUnitsLink = page
    .getByRole('link', { name: 'Business Units' })
    .or(page.getByRole('button', { name: 'Business Units' }))
    .first();
  await expect(businessUnitsLink).toBeVisible();
  await businessUnitsLink.click();
  await page.waitForURL('**/vm/business-units**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Dynamically locate and navigate to the first Business Unit
  const firstBusinessUnitCard = page
    .locator('a[href*="/vm/business-units/"]')
    .first();
  await expect(firstBusinessUnitCard).toBeVisible();
  await firstBusinessUnitCard.click();
  await page.waitForURL('**/vm/business-units/**');
  await page.waitForLoadState('domcontentloaded');

  // 5. Verify all main tab triggers are visible
  const detailsTab = page.getByRole('tab', { name: 'Details' });
  const riskTab = page.getByRole('tab', { name: 'Risk Assessment' });
  const assetsTab = page.getByRole('tab', { name: 'Associated Assets' });
  const vulnsTab = page.getByRole('tab', { name: 'Vulnerabilities' });

  await expect(detailsTab).toBeVisible();
  await expect(riskTab).toBeVisible();
  await expect(assetsTab).toBeVisible();
  await expect(vulnsTab).toBeVisible();

  // 6. Verify Details tab (default active tab)
  await expect(detailsTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // 7. Test Risk Assessment tab
  await riskTab.click();
  await expect(riskTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  await expect(page.getByText('Risk Level Guide')).toBeVisible();
  await expect(page.getByText('Risk Parameters')).toBeVisible();

  // Dynamically interact with a parameter combobox dropdown
  const riskCombobox = page
    .getByRole('tabpanel')
    .getByRole('combobox')
    .first();
  if (await riskCombobox.isVisible()) {
    await riskCombobox.click();
    const firstOption = page.getByRole('option').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    }
  }

  // Save changes if button is enabled
  const saveBtn = page.getByRole('button', { name: 'Save Changes' });
  if ((await saveBtn.isVisible()) && (await saveBtn.isEnabled())) {
    await saveBtn.click();
    await expect(
      page.getByText(/Risk assessment updated successfully/i),
    ).toBeVisible({ timeout: 15000 });
  }

  // 8. Test Associated Assets tab
  await assetsTab.click();
  await expect(assetsTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // Test Toolbar filters
  await verifyTableToolbarFilters(page, page.getByRole('tabpanel'));

  // Test Assets search input and clear functionality
  const assetSearchInput = page.getByPlaceholder('Search Assets');
  if (await assetSearchInput.isVisible()) {
    await assetSearchInput.fill('test');
    await expect(assetSearchInput).toHaveValue('test');

    const clearButton = page.locator('button:has(svg.lucide-x)').first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(assetSearchInput).toHaveValue('');
    } else {
      await assetSearchInput.fill('');
      await expect(assetSearchInput).toHaveValue('');
    }
  }

  // Test pagination on Assets if multiple pages are present
  const page2AssetBtn = page
    .getByRole('tabpanel')
    .getByRole('button', { name: '2', exact: true });
  if (await page2AssetBtn.isVisible()) {
    await page2AssetBtn.click();
    const page1AssetBtn = page
      .getByRole('tabpanel')
      .getByRole('button', { name: '1', exact: true });
    await expect(page1AssetBtn).toBeVisible();
    await page1AssetBtn.click();
  }

  // 9. Test Vulnerabilities tab
  await vulnsTab.click();
  await expect(vulnsTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // Test Toolbar filters
  await verifyTableToolbarFilters(page, page.getByRole('tabpanel'));

  // Test Vulnerabilities search input and clear functionality
  const vulnSearchInput = page.getByPlaceholder('Search Vulnerabilities');
  if (await vulnSearchInput.isVisible()) {
    await vulnSearchInput.fill('vuln');
    await expect(vulnSearchInput).toHaveValue('vuln');

    const clearButton = page.locator('button:has(svg.lucide-x)').first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(vulnSearchInput).toHaveValue('');
    } else {
      await vulnSearchInput.fill('');
      await expect(vulnSearchInput).toHaveValue('');
    }
  }

  // Test pagination on Vulnerabilities if multiple pages are present
  const page2VulnBtn = page
    .getByRole('tabpanel')
    .getByRole('button', { name: '2', exact: true });
  if (await page2VulnBtn.isVisible()) {
    await page2VulnBtn.click();
    const page1VulnBtn = page
      .getByRole('tabpanel')
      .getByRole('button', { name: '1', exact: true });
    await expect(page1VulnBtn).toBeVisible();
    await page1VulnBtn.click();
  }

  // 10. Switch back to Details tab
  await detailsTab.click();
  await expect(detailsTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();
});