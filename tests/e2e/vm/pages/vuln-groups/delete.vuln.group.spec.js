import { expect, test } from '@playwright/test';

test('dynamically create and delete a custom vulnerability group', async ({
  page,
}) => {
  const dynamicGroupName = `Del Group ${Date.now()}`;
  const dynamicGroupDesc = `Description for ${dynamicGroupName}`;

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

  // 5. Navigate to Custom tab (tab=custom-groups)
  const customTab = main.getByRole('tab', { name: 'Custom' });
  await expect(customTab).toBeVisible();
  await customTab.click();
  await expect(page).toHaveURL(/.*tab=custom-groups.*/);

  // 6. Create a new custom vulnerability group so the test user is the owner
  const createButton = main.getByRole('button', { name: 'Create' });
  await expect(createButton).toBeVisible();
  await createButton.click();

  const createModal = page.getByRole('dialog');
  await expect(createModal).toBeVisible();

  const nameInput = createModal.getByPlaceholder('Enter Name');
  await nameInput.fill(dynamicGroupName);

  const descInput = createModal.getByPlaceholder('Enter Description');
  await descInput.fill(dynamicGroupDesc);

  const submitCreateButton = createModal.getByRole('button', {
    name: 'Create',
  });
  await submitCreateButton.click();
  await expect(createModal).toBeHidden();
  await expect(page.getByText(/Vulnerability List Created/i)).toBeVisible();

  // 7. Locate the newly created custom group card (use search if paginated)
  const customPanel = main.getByRole('tabpanel');
  await expect(customPanel).toBeVisible();

  const targetCard = customPanel
    .locator('[data-slot="card"]')
    .filter({ hasText: dynamicGroupName })
    .first();

  if (!(await targetCard.isVisible())) {
    const searchBox = main
      .getByPlaceholder('Search...')
      .or(main.getByRole('textbox', { name: /Search/i }))
      .first();
    if (await searchBox.isVisible()) {
      await searchBox.fill(dynamicGroupName);
    }
  }

  await expect(targetCard).toBeVisible({ timeout: 10000 });

  // 8. Open the action menu on the target group card
  const menuTrigger = targetCard
    .locator('button:has(svg.lucide-ellipsis-vertical)')
    .or(targetCard.getByRole('button'))
    .first();
  await expect(menuTrigger).toBeVisible();
  await menuTrigger.click();

  // 9. Click the Delete option from the dropdown menu (visible because logged-in user is creator)
  const deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
  await expect(deleteMenuItem).toBeVisible();
  await deleteMenuItem.click();

  // 10. Confirm deletion in the confirmation dialog
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await expect(confirmDialog.getByText(/Are you sure/i)).toBeVisible();

  const confirmDeleteButton = confirmDialog.getByRole('button', {
    name: 'Delete',
  });
  await expect(confirmDeleteButton).toBeVisible();
  await confirmDeleteButton.click();

  // 11. Verify confirmation dialog closes and deletion success toast appears
  await expect(confirmDialog).toBeHidden();
  await expect(page.getByText(/Vulnerability List Deleted/i)).toBeVisible();
});