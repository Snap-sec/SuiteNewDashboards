import { expect, test } from '@playwright/test';

test('initial load and interaction on SCA integrations page', async ({
  page,
}) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to SCA Integrations page (/sca-ui/integrations)
  await page.goto('/sca-ui/integrations');
  await page.waitForURL('**/sca-ui/integrations**');
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
      /Connect third-party security tools and data sources to automate|Connect and configure third-party security tools/i,
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
  const webhooksTab = main.getByRole('tab', { name: /Webhooks/i });

  await expect(allIntegrationsTab).toBeVisible();
  await expect(activeIntegrationsTab).toBeVisible();
  await expect(logsTab).toBeVisible();
  await expect(webhooksTab).toBeVisible();

  // 5. Test Search Filter on All Integrations Tab
  const searchInput = main
    .getByPlaceholder('Search integrations...')
    .or(main.getByRole('textbox', { name: /Search integrations/i }))
    .first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('github');
    await expect(searchInput).toHaveValue('github');
    await page.waitForTimeout(400);

    await searchInput.fill('');
    await expect(searchInput).toHaveValue('');
    await page.waitForTimeout(400);
  }

  // 6. Switch to Active Integrations Tab
  await activeIntegrationsTab.click();
  await expect(activeIntegrationsTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(300);

  // 7. Switch to Logs Tab & Verify Sync Logs Table
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

  // 8. Switch to Webhooks Tab & Verify Webhook Elements
  await webhooksTab.click();
  await expect(webhooksTab).toHaveAttribute('data-state', 'active');
  await page.waitForTimeout(300);

  await expect(main.getByText('Scan Trigger Webhook')).toBeVisible();
  await expect(
    main
      .getByText(/System Webhook Token/i)
      .or(main.getByText(/Shared Secret/i)),
  ).toBeVisible();
  await expect(main.getByText(/Generic Webhook Curl Trigger/i)).toBeVisible();
});
