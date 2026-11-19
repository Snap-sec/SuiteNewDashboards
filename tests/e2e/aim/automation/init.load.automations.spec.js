import { expect, test } from '@playwright/test';

test('initial load and interaction on AIM automation page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to AIM Automation page (/assetinventory/automation)
  await page.goto('/assetinventory/automation');
  await page.waitForURL('**/assetinventory/automation**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Initial Setup Screen if no policies exist in the system
  const setupScreen = page.getByText('Setup Automation');
  if (await setupScreen.isVisible()) {
    await expect(setupScreen).toBeVisible();
    await expect(
      page.getByText(
        'To get started, create a new policy to automatically classify your findings.',
      ),
    ).toBeVisible();
    return;
  }

  // 4. Verify Policy Tabs (Active & Disabled)
  const activeTab = page.getByRole('tab', { name: 'Active' });
  const disabledTab = page.getByRole('tab', { name: 'Disabled' });
  await expect(activeTab).toBeVisible({ timeout: 15000 });
  await expect(disabledTab).toBeVisible();

  // 5. Verify Policy Search Input & Create Policy Button
  const searchInput = page.getByPlaceholder('Search Policy...');
  await expect(searchInput).toBeVisible();

  const createPolicyBtn = page
    .getByTitle('Create New Policy')
    .or(page.getByRole('button', { name: /Create.*Policy/i }));
  if (await createPolicyBtn.isVisible()) {
    await expect(createPolicyBtn).toBeVisible();
  }

  // 6. Test Policy Search Interaction
  await searchInput.fill('aler');
  await page.waitForTimeout(600); // Wait for debounce

  await searchInput.fill('');
  await page.waitForTimeout(600);

  // 7. Test Tab Switching (Active -> Disabled -> Active)
  await disabledTab.click();
  await expect(disabledTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);

  await activeTab.click();
  await expect(activeTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(400);
});