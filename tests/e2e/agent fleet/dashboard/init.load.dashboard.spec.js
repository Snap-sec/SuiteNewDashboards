import { expect, test } from '@playwright/test';

test('initial load and interaction on Agent Fleet dashboard page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Agent Fleet Dashboard page (/agent)
  await page.goto('/agent');
  await page.waitForURL('**/agent**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-6')).or(page.locator('.p-4'));

  // 3. Verify Agent Stats Metrics Row
  await expect(main.getByText('Total Registered')).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('Active Agents')).toBeVisible();
  await expect(main.getByText('Outdated / Offline')).toBeVisible();

  // 4. Verify Deployment & Installation Section
  const deployHeading = main.getByRole('heading', {
    name: 'Deployment & Installation',
  });
  await expect(deployHeading).toBeVisible();
  await expect(
    main.getByText(
      'Select your platform to generate the automated installation sequence.',
    ),
  ).toBeVisible();

  // Verify Prerequisites & Command blocks
  await expect(main.getByText('Prerequisites')).toBeVisible();
  await expect(main.getByText('Run Installation Command')).toBeVisible();
  await expect(main.getByText('Verify Service Status')).toBeVisible();

  // 5. Verify Agent Inventory Table Section
  await expect(main.getByText('Agent Inventory')).toBeVisible();

  const table = main.locator('table');
  if (await table.isVisible()) {
    const thead = table.locator('thead');
    await expect(thead.getByText('Hostname')).toBeVisible();
    await expect(thead.getByText('IP Address')).toBeVisible();
    await expect(thead.getByText('OS / Platform')).toBeVisible();
    await expect(thead.getByText('Version')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Heartbeat')).toBeVisible();
  }

  // 6. Test Search Agents Input Interaction
  const searchInput = main.getByPlaceholder('Search agents...').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('agent');
    await expect(searchInput).toHaveValue('agent');
    await page.waitForTimeout(300);

    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
    await page.waitForTimeout(300);
  }
});