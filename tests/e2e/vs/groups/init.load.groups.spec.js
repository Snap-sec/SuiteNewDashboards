import { expect, test } from '@playwright/test';

test('initial load and interaction on VS groups page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to VS Groups page (/vs/groups)
  await page.goto('/vs/groups');
  await page.waitForURL('**/vs/groups**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Wait for either Groups content or Empty Screen to appear
  const mainHeading = page
    .getByRole('heading', { name: 'Groups', level: 1 })
    .or(page.getByText(/View and organize assets into groups/i))
    .or(page.getByText('No Groups Found'));
  await expect(mainHeading.first()).toBeVisible({ timeout: 15000 });

  // 4. Handle Empty Screen if no groups found
  const emptyScreen = page.getByText('No Groups Found');
  if (await emptyScreen.isVisible()) {
    await expect(emptyScreen).toBeVisible();
    const createBtn = page.getByRole('button', { name: /Create a Group/i });
    if (await createBtn.isVisible()) {
      await expect(createBtn).toBeVisible();
    }
    return;
  }

  // 5. Verify Page Heading & Description
  const heading = page.getByRole('heading', {
    name: 'Groups',
    level: 1,
  });
  await expect(heading).toBeVisible();
  await expect(
    page.getByText(/View and organize assets into groups|Group of Assets/i),
  ).toBeVisible();

  // 5. Verify Add Group Button & Modal Interaction
  const addGroupBtn = page.getByRole('button', { name: /Add Group/i });
  if (await addGroupBtn.isVisible()) {
    await expect(addGroupBtn).toBeVisible();
    await addGroupBtn.click();

    // Verify Create Asset Group Modal opens
    const modalHeading = page.getByRole('heading', { name: /Create Asset Group/i });
    await expect(modalHeading).toBeVisible();
    await expect(page.getByPlaceholder('Enter Name')).toBeVisible();
    await expect(page.getByPlaceholder('Enter Description')).toBeVisible();

    // Close Modal via Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // 6. Verify Group Cards if present
  const groupCards = page.locator('.grid > div');
  if (await groupCards.first().isVisible()) {
    await expect(groupCards.first()).toBeVisible();
  }
});