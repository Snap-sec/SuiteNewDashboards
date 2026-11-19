import { expect, test } from '@playwright/test';

test('dynamically create a new assessment group folder', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Groups via sidebar
  const groupsLink = page.getByRole('link', { name: 'Groups' });
  if (!(await groupsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Assessments', exact: true })
      .or(page.getByRole('button', { name: 'Vulnerabilities', exact: true }))
      .first()
      .click();
  }
  await expect(groupsLink).toBeVisible();
  await groupsLink.click();
  await page.waitForURL(/.*\/vm\/(folders|groups).*/);
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 4. Switch to Custom tab where folder creation is available
  const customTab = main.getByRole('tab', { name: 'Custom' });
  await expect(customTab).toBeVisible();
  await customTab.click();
  await expect(customTab).toHaveAttribute('data-state', 'active');

  // 5. Open Create Folder modal (unambiguously targets creation card / button)
  const createFolderTrigger = main
    .getByText('Create a new folder.')
    .or(main.locator('.border-dashed'))
    .or(main.getByRole('button', { name: 'Create Folder' }))
    .first();
  await expect(createFolderTrigger).toBeAttached({ timeout: 10000 });
  await createFolderTrigger.dispatchEvent('click');
  const modal = page.getByRole('dialog').filter({ hasText: 'Create Folder' });
  await expect(modal).toBeVisible({ timeout: 10000 });

  // 6. Fill dynamic folder name
  const dynamicFolderName = `Grp-${Date.now().toString().slice(-6)}`;
  const nameInput = modal
    .getByPlaceholder(/Enter folder name/i)
    .or(modal.getByRole('textbox', { name: /Name/i }))
    .first();
  await expect(nameInput).toBeVisible();
  await nameInput.fill(dynamicFolderName);

  // 7. Submit folder creation
  const submitBtn = modal.getByRole('button', { name: 'Create Folder' });
  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();

  // 8. Verify success toast appears and modal closes
  await expect(page.getByText(/Folder created successfully/i)).toBeVisible({
    timeout: 15000,
  });
  await expect(modal).toBeHidden({ timeout: 10000 });

  // 9. Search and verify created folder is visible in Custom tab
  const searchInput = main.getByPlaceholder('Search Groups...');
  if (await searchInput.isVisible()) {
    await searchInput.fill(dynamicFolderName);
    await expect(main.getByText(dynamicFolderName).first()).toBeVisible({
      timeout: 10000,
    });
  }
});
