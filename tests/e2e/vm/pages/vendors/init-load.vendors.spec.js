import { expect, test } from '@playwright/test';

test('initial load and interaction on Service Vendors page', async ({
  page,
}) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Service Vendors via Reports and Vendors sidebar menu
  const serviceVendorsLink = page.getByRole('link', {
    name: 'Service Vendors',
    exact: true,
  });
  if (!(await serviceVendorsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Reports and Vendors', exact: true })
      .click();
  }
  await expect(serviceVendorsLink).toBeVisible({ timeout: 10000 });
  await serviceVendorsLink.click();
  await page.waitForURL('**/vm/service-vendors**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main');

  // 4. Verify Page Heading or Empty Screen
  await expect(
    main
      .getByRole('heading', { level: 1, name: 'Service Vendors Management' })
      .or(main.getByText('No Service Vendors Found')),
  ).toBeVisible();

  // 5. Test Add Service Vendor modal trigger and dismissal
  const addVendorBtn = main.getByRole('button', { name: 'Add Service Vendor' });
  if (await addVendorBtn.isVisible()) {
    await addVendorBtn.click();

    const formModal = page.getByRole('dialog');
    await expect(formModal).toBeVisible();
    await expect(
      formModal.getByRole('heading', { name: 'Add New Service Vendor' }),
    ).toBeVisible();

    const cancelBtn = formModal.getByRole('button', { name: 'Cancel' });
    await cancelBtn.click();
    await expect(formModal).toBeHidden();
  }

  // 6. Test Search input and clear functionality
  const searchInput = main
    .getByPlaceholder('Search...')
    .or(main.getByRole('textbox', { name: /Search/i }))
    .first();

  if (await searchInput.isVisible()) {
    await searchInput.fill('test');
    await expect(searchInput).toHaveValue('test');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 7. Test Pagination if multiple pages are present (properly scoped to main)
  const page2Button = main.getByRole('button', { name: '2', exact: true });
  if (await page2Button.isVisible()) {
    await page2Button.click();
    const page1Button = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Button).toBeVisible();
    await page1Button.click();
  }

  // 8. Test Row Actions Menu (Mark as Default / Edit)
  const firstRow = main.locator('tbody tr').first();
  if (await firstRow.isVisible()) {
    const actionBtn = firstRow
      .getByRole('button')
      .filter({ has: page.locator('svg.lucide-ellipsis') })
      .or(firstRow.getByRole('button', { name: 'Open menu' }))
      .first();

    if (await actionBtn.isVisible()) {
      await actionBtn.click();
      const menu = page.getByRole('menu');
      await expect(menu).toBeVisible();

      // Check Mark as Default action
      const markDefaultBtn = menu.getByRole('menuitem', {
        name: /Mark as Default/i,
      });

      if (await markDefaultBtn.isVisible()) {
        await markDefaultBtn.click();
        const confirmDialog = page.getByRole('dialog');
        if (await confirmDialog.isVisible()) {
          const cancelDialogBtn = confirmDialog.getByRole('button', {
            name: /Cancel/i,
          });
          if (await cancelDialogBtn.isVisible()) {
            await cancelDialogBtn.click();
          } else {
            await page.keyboard.press('Escape');
          }
        }
      } else {
        await page.keyboard.press('Escape');
      }
    }
  }
});