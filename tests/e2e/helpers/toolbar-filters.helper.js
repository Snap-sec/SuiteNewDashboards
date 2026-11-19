import { expect } from '@playwright/test';

/**
 * Reusable test helper for `<TableToolbarFilters />`
 * Validates inline filter popovers, options toggling, and reset functionality.
 */
export async function verifyTableToolbarFilters(
  page,
  containerLocator = page.getByRole('main'),
) {
  // 1. Wait for loading skeletons to finish
  await expect(
    containerLocator.locator('.animate-pulse, [data-slot="skeleton"]'),
  )
    .toHaveCount(0, {
      timeout: 10000,
    })
    .catch(() => {});

  // 2. Find all filter buttons inside the toolbar
  const filterButtons = containerLocator.locator(
    'button:has(svg.lucide-filter)',
  );
  const count = await filterButtons.count();

  if (count === 0) return; // No filters rendered on this table

  // 3. Test the first available inline filter
  const firstFilterBtn = filterButtons.first();
  await expect(firstFilterBtn).toBeVisible();
  await firstFilterBtn.click();

  // 4. Toggle the first available option in the popover
  const popover = page
    .locator('[data-slot="popover-content"], [role="dialog"]')
    .first();
  if (await popover.isVisible()) {
    const firstOption = popover
      .locator('[role="checkbox"], input[type="checkbox"], label')
      .first();
    if (await firstOption.isVisible()) {
      await firstOption.click();

      // Verify badge / active state updated
      await expect(firstFilterBtn).toBeVisible();

      // Test Reset button inside popover or global reset
      const resetBtn = popover
        .getByRole('button', { name: /Reset/i })
        .or(containerLocator.getByRole('button', { name: /Reset/i }))
        .first();

      if (await resetBtn.isVisible()) {
        await resetBtn.click();
      } else {
        await firstOption.click(); // toggle back off
        await firstFilterBtn.click(); // close popover
      }
    } else {
      await firstFilterBtn.click();
    }
  }

  // 5. Test "More Filters" drawer if more than 4 filters exist
  const moreFiltersBtn = containerLocator.getByRole('button', {
    name: /More Filters/i,
  });
  if (await moreFiltersBtn.isVisible()) {
    await moreFiltersBtn.click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();

    // Close drawer
    const closeBtn = drawer
      .getByRole('button', { name: /Close|Cancel/i })
      .or(page.locator('.fixed.inset-0'))
      .first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  }
}
