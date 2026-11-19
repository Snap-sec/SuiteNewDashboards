import { expect, test } from '@playwright/test';

test('initial load and interaction on assessment groups page', async ({
  page,
}) => {
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

  // 4. Verify page heading
  await expect(
    main
      .getByRole('heading', { level: 1, name: 'Assessment Groups' })
      .or(main.getByText('Assessment Groups').first()),
  ).toBeVisible();
  await expect(
    main.getByText(
      'Group Assessments into folders to manage them more effectively.',
    ),
  ).toBeVisible();

  // 5. Verify all main tab triggers
  const byCategoryTab = main.getByRole('tab', { name: 'By Category' });
  const byTimeTab = main.getByRole('tab', { name: 'By Time' });
  const customTab = main.getByRole('tab', { name: 'Custom' });

  await expect(byCategoryTab).toBeVisible();
  await expect(byTimeTab).toBeVisible();
  await expect(customTab).toBeVisible();

  const searchInput = main.getByPlaceholder('Search Groups...');
  await expect(searchInput).toBeVisible();

  // 6. Test 'By Category' tab interactions
  await byCategoryTab.click();
  await expect(byCategoryTab).toHaveAttribute('data-state', 'active');

  await searchInput.fill('SAST');
  await expect(searchInput).toHaveValue('SAST');
  const clearBtn = main.locator('button:has(svg.lucide-x)').first();
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
  }

  // Click first category card if available and return via breadcrumb
  const firstCategoryCard = main
    .locator('.cursor-pointer')
    .filter({ has: page.locator('img[alt="folder"]') })
    .first();
  if (await firstCategoryCard.isVisible()) {
    await firstCategoryCard.click();
    const homeBreadcrumb = main
      .locator('nav[aria-label="breadcrumb"]')
      .getByText('Home')
      .first();
    if (await homeBreadcrumb.isVisible()) {
      await homeBreadcrumb.click();
    }
  }

  // 7. Test 'By Time' tab interactions
  await byTimeTab.click();
  await expect(byTimeTab).toHaveAttribute('data-state', 'active');

  await searchInput.fill('202');
  await expect(searchInput).toHaveValue('202');
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
  }

  // Click first yearly card if available and return via breadcrumb
  const firstYearCard = main
    .locator('.cursor-pointer')
    .filter({ has: page.locator('img[alt="folder"]') })
    .first();
  if (await firstYearCard.isVisible()) {
    await firstYearCard.click();
    const homeBreadcrumb = main
      .locator('nav[aria-label="breadcrumb"]')
      .getByText('Home')
      .first();
    if (await homeBreadcrumb.isVisible()) {
      await homeBreadcrumb.click();
    }
  }

  // 8. Test 'Custom' tab interactions & Create Folder Modal
  await customTab.click();
  await expect(customTab).toHaveAttribute('data-state', 'active');

  await searchInput.fill('sec');
  await expect(searchInput).toHaveValue('sec');
  if (await clearBtn.isVisible()) {
    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
  } else {
    await searchInput.fill('');
  }

  // Open and dismiss Create Folder modal
  const createFolderTrigger = main
    .getByText('Create a new folder.')
    .or(main.getByRole('button', { name: /Create Folder/i }))
    .first();
  if (await createFolderTrigger.isVisible()) {
    await createFolderTrigger.click();

    const createModal = page.getByRole('dialog', { name: /Create Folder/i });
    await expect(createModal).toBeVisible();

    const nameInput = createModal
      .getByPlaceholder(/folder name/i)
      .or(createModal.getByRole('textbox', { name: /Name/i }))
      .or(createModal.locator('input[type="text"]'))
      .first();
    if (await nameInput.isVisible()) {
      await nameInput.fill(`Test Group ${Date.now().toString().slice(-4)}`);
    }

    const cancelBtn = createModal.getByRole('button', { name: 'Cancel' });
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }

    await expect(createModal).toBeHidden();
  }
});