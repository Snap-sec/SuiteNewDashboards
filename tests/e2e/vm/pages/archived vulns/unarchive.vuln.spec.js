import { expect, test } from '@playwright/test';

test('unarchive a vulnerability from archived vulnerabilities list', async ({ page }) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Archived Vulnerabilities via sidebar
  const archivedVulnsLink = page.getByRole('link', {
    name: 'Archived Vulnerabilities',
  });
  if (!(await archivedVulnsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Vulnerabilities', exact: true })
      .click();
  }
  await expect(archivedVulnsLink).toBeVisible();
  await archivedVulnsLink.click();
  await page.waitForURL('**/vm/archived-vulns**');

  // 4. Verify page header and title
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'Archived Vulnerabilities' }),
  ).toBeVisible();
  await expect(
    main.getByText(
      'Review and restore vulnerabilities that have been previously archived or dismissed.',
    ),
  ).toBeVisible();

  // 5. Open action menu for the vulnerability at index 0 (first row in table) and unarchive
  const targetRow = main.locator('tbody tr').nth(0);
  await expect(targetRow).toBeVisible();

  const actionMenuButton = targetRow.getByRole('button', { name: 'Open menu' });
  await expect(actionMenuButton).toBeVisible();
  await actionMenuButton.click();

  // Click Unarchive option in the dropdown menu
  const unarchiveButton = page.getByRole('button', { name: 'Unarchive' });
  await expect(unarchiveButton).toBeVisible();
  await unarchiveButton.click();

  // Verify and confirm action in confirmation dialog
  const confirmDialog = page.getByRole('dialog');
  await expect(confirmDialog).toBeVisible();
  await expect(
    confirmDialog.getByText('Are you sure you want to unarchive this vulnerability?'),
  ).toBeVisible();

  const confirmButton = confirmDialog.getByRole('button', { name: 'Confirm' });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();

  // Verify confirmation dialog closes and success toast notification appears
  await expect(confirmDialog).toBeHidden();
  await expect(
    page.getByText(/Vulnerability Unarchived Successfully/i),
  ).toBeVisible();
});

