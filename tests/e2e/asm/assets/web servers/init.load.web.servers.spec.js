import { expect, test } from '@playwright/test';
import { verifyTableToolbarFilters } from '../../../helpers/toolbar-filters.helper';

test('initial load and interaction on ASM web servers page', async ({ page }) => {
  // 1. Start on Home workspace (/) using auth storageState
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to ASM Web Servers page
  await page.goto('/casm/assets/web-servers');
  await page.waitForURL('**/casm/assets/web-servers**');
  await page.waitForLoadState('domcontentloaded');

  // 3. Handle Empty State if no web servers exist
  const emptyScreen = page.getByText('No Webservers Found');
  if (await emptyScreen.isVisible()) {
    await expect(page.getByText('Your webserver list is empty. Add webservers to populate it.')).toBeVisible();
    return;
  }

  const main = page.getByRole('main');

  // 4. Verify Page Heading and Description
  const heading = main.getByRole('heading', { name: 'Web Servers', exact: true });
  await expect(heading).toBeVisible({ timeout: 15000 });
  await expect(main.getByText('List of all Web Servers found during scanning')).toBeVisible();

  // 5. Verify Web Servers Metrics Cards
  await expect(main.getByText('Total Web Servers')).toBeVisible();
  await expect(main.getByText('External', { exact: true }).first()).toBeVisible();
  await expect(main.getByText('With Open Ports')).toBeVisible();
  await expect(main.getByText('Signals', { exact: true }).first()).toBeVisible();

  // 6. Test Search input and clear functionality
  const searchInput = main.getByPlaceholder(/Search/i).or(main.getByRole('textbox', { name: /Search/i })).first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('snap');
    await expect(searchInput).toHaveValue('snap');

    await searchInput.fill('net');
    await expect(searchInput).toHaveValue('net');

    const clearBtn = main.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await expect(searchInput).toHaveValue('');
    } else {
      await searchInput.fill('');
      await expect(searchInput).toHaveValue('');
    }
  }

  // 7. Verify Table Toolbar Filters using helper (Status Code, Is New, Network Scope, Reset, etc.)
  await verifyTableToolbarFilters(page, main);

  // 8. Test Pagination navigation if multiple pages exist
  const page2Btn = main.getByRole('button', { name: '2', exact: true });
  if (await page2Btn.isVisible()) {
    await page2Btn.click();
    const page1Btn = main.getByRole('button', { name: '1', exact: true });
    await expect(page1Btn).toBeVisible();
    await page1Btn.click();
  }
});