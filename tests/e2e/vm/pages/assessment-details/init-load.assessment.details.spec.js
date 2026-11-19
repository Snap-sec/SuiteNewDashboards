import { expect, test } from '@playwright/test';

test('initial load and interaction on assessment details page', async ({
  page,
}) => {
  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  // 3. Navigate to Assessments via sidebar
  const assessmentsLink = page.getByRole('link', { name: 'Assessments' });
  if (!(await assessmentsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Assessments', exact: true })
      .or(page.getByRole('button', { name: 'Vulnerabilities', exact: true }))
      .first()
      .click();
  }
  await expect(assessmentsLink).toBeVisible();
  await assessmentsLink.click();
  await page.waitForURL('**/vm/assessments**');
  await page.waitForLoadState('domcontentloaded');

  // 4. Dynamically locate and navigate to the first assessment in table
  const firstAssessmentRow = page.locator('tbody tr').first();
  await expect(firstAssessmentRow).toBeVisible();

  const assessmentLink = firstAssessmentRow
    .locator('a[href*="/vm/assessment-edit"]')
    .first();
  await expect(assessmentLink).toBeVisible();
  await assessmentLink.click();
  await page.waitForURL('**/vm/assessment-edit**');
  await page.waitForLoadState('domcontentloaded');

  // 5. Verify all main tab triggers are visible
  const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
  const vulnsTab = page.getByRole('tab', { name: 'Vulnerabilities' });
  const evidencesTab = page.getByRole('tab', { name: 'Docs & Evidences' });
  const activityTab = page.getByRole('tab', { name: 'Activity' });
  const reportsTab = page.getByRole('tab', { name: 'Reports' });
  const automationTab = page.getByRole('tab', { name: 'Automation' });
  const settingsTab = page.getByRole('tab', { name: 'Settings' });

  await expect(dashboardTab).toBeVisible();
  await expect(vulnsTab).toBeVisible();
  await expect(evidencesTab).toBeVisible();
  await expect(activityTab).toBeVisible();
  await expect(reportsTab).toBeVisible();
  await expect(automationTab).toBeVisible();
  await expect(settingsTab).toBeVisible();

  // 6. Test Vulnerabilities tab
  await vulnsTab.click();
  await expect(vulnsTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  const searchInput = page.getByPlaceholder(/Search/i).first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('asset');
    const clearBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    } else {
      await searchInput.fill('');
    }
  }

  // 7. Test Docs & Evidences tab
  await evidencesTab.click();
  await expect(evidencesTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // 8. Test Activity tab & comment input
  await activityTab.click();
  await expect(activityTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  const commentInput = page.getByPlaceholder(/Comment as/i);
  if (await commentInput.isVisible()) {
    await commentInput.click();
    await commentInput.fill('Automated test activity comment');
    const sendBtn = page.locator('button:has(svg.lucide-send-horizonal)');
    if ((await sendBtn.isVisible()) && (await sendBtn.isEnabled())) {
      await sendBtn.click();
    }
  }

  // 9. Test Reports tab
  await reportsTab.click();
  await expect(reportsTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // 10. Test Automation tab
  await automationTab.click();
  await expect(automationTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // 11. Test Scope tab (if authorized / visible)
  const scopeTab = page.getByRole('tab', { name: 'Scope' });
  if (await scopeTab.isVisible()) {
    await scopeTab.click();
    await expect(scopeTab).toHaveAttribute('data-state', 'active');
    await expect(page.getByRole('tabpanel')).toBeVisible();
  }

  // 12. Test Settings tab
  await settingsTab.click();
  await expect(settingsTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // 13. Switch back to Dashboard tab
  await dashboardTab.click();
  await expect(dashboardTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();
});
