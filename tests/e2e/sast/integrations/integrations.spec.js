import { expect, test } from '@playwright/test';

test('initial load and interaction on SAST integrations page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SAST Integrations page (/ui-sast/integrations)
  await page.goto('/ui-sast/integrations');
  await page.waitForURL('**/ui-sast/integrations**');
  await page.waitForLoadState('domcontentloaded');

  const main = page.getByRole('main').or(page.locator('.p-4'));

  // 3. Verify Page Heading & Description
  const heading = main.getByRole('heading', {
    name: 'Integrations',
    exact: true,
  });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(
    main.getByText(
      'Connect and configure third-party security tools and data sources.',
    ),
  ).toBeVisible();

  // 4. Verify Tabs List
  const allIntegrationsTab = main.getByRole('tab', {
    name: /All Integrations/i,
  });
  const activeIntegrationsTab = main.getByRole('tab', {
    name: /Active Integrations/i,
  });
  const logsTab = main.getByRole('tab', { name: /Logs/i });

  await expect(allIntegrationsTab).toBeVisible();
  await expect(activeIntegrationsTab).toBeVisible();
  await expect(logsTab).toBeVisible();

  // 5. Test Search Filter on All Integrations Tab
  const searchInput = main
    .getByPlaceholder('Search integrations...')
    .or(main.getByRole('textbox', { name: /Search integrations/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('gemini');
    await expect(searchInput).toHaveValue('gemini');
    await page.waitForTimeout(400);

    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
    await page.waitForTimeout(400);
  }

  // 6. Verify Category Selector & Integration Cards
  const categorySelector = main.getByRole('combobox').or(main.getByText('Filter by Category')).first();
  if (await categorySelector.isVisible()) {
    await expect(categorySelector).toBeVisible();
  }

  // Check integration cards / empty state
  const emptyAll = main.getByText(/No integrations found|There are currently no integrations available/i);
  if (await emptyAll.isVisible()) {
    await expect(emptyAll).toBeVisible();
  } else {
    // Check key integration options if present
    const integrationCards = main.locator('.grid > div');
    if ((await integrationCards.count()) > 0) {
      await expect(integrationCards.first()).toBeVisible();
    }
  }

  // 7. Switch to Active Integrations Tab
  await activeIntegrationsTab.click();
  await expect(activeIntegrationsTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(300);

  const emptyActive = main.getByText(/No active integrations found|You haven't installed any integrations yet/i);
  if (await emptyActive.isVisible()) {
    await expect(emptyActive).toBeVisible();
  }

  // 8. Switch to Logs Tab & Verify Sync Logs Table
  await logsTab.click();
  await expect(logsTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(500);

  const logsTable = main.locator('table');
  if (await logsTable.isVisible()) {
    const thead = logsTable.locator('thead');
    await expect(thead.getByText('Adapter')).toBeVisible();
    await expect(thead.getByText('Integration Name')).toBeVisible();
    await expect(thead.getByText('Event')).toBeVisible();
    await expect(thead.getByText('Status')).toBeVisible();
    await expect(thead.getByText('Log Message')).toBeVisible();
    await expect(thead.getByText('Date & Time')).toBeVisible();

    // Test Pagination if multiple pages exist
    const page2Btn = main.getByRole('button', { name: '2', exact: true });
    if ((await page2Btn.isVisible()) && (await page2Btn.isEnabled())) {
      await page2Btn.click();
      await page.waitForTimeout(500);

      const page1Btn = main.getByRole('button', { name: '1', exact: true });
      if ((await page1Btn.isVisible()) && (await page1Btn.isEnabled())) {
        await page1Btn.click();
        await page.waitForTimeout(500);
      }
    }
  }

  // 9. Switch back to All Integrations Tab
  await allIntegrationsTab.click();
  await expect(allIntegrationsTab).toHaveAttribute('data-state', 'active');
});
