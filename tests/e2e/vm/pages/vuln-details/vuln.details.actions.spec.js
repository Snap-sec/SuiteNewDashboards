import { expect, test } from '@playwright/test';

test('verify vulnerability details page all actions', async ({ page }) => {
  test.setTimeout(60000);

  // 1. Starts on Home workspace (/) using auth storageState from login.setup.js
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  // 2. Navigate to Vulnerability Management -> All Vulnerabilities
  await page.getByText('Vulnerability Management').click();
  await page.waitForURL('**/vm**');

  const allVulnsLink = page.getByRole('link', { name: 'All Vulnerabilities' });
  if (!(await allVulnsLink.isVisible())) {
    await page
      .getByRole('button', { name: 'Vulnerabilities', exact: true })
      .click();
  }
  await expect(allVulnsLink).toBeVisible();
  await allVulnsLink.click();
  await page.waitForURL('**/vm/vulnerabilities**');

  // 3. Locate the first vulnerability in the list and navigate to its report page
  const main = page.getByRole('main');
  const firstVulnRow = main.locator('tbody tr').first();
  await expect(firstVulnRow).toBeVisible();

  const vulnLink = firstVulnRow.locator('a').first();
  await expect(vulnLink).toBeVisible();

  const href = await vulnLink.getAttribute('href');
  if (href) {
    await page.goto(href);
  } else {
    await vulnLink.click();
  }

  // 4. Verify navigation to Vulnerability Report page
  await page.waitForURL('**/vm/vulnerability-report**');
  await page.waitForLoadState('domcontentloaded');

  const reportContainer = page.locator('#report-content');
  await expect(reportContainer).toBeVisible();
  await expect(page.getByText('Report Details')).toBeVisible();

  // ==================== ACTION 1: UPDATE OWNER ====================
  const ownerRow = page.locator('tr', { hasText: 'Owner' });
  await expect(ownerRow).toBeVisible();
  await ownerRow.hover();
  const ownerEditBtn = ownerRow
    .locator('button:has(svg.lucide-square-pen)')
    .or(ownerRow.getByRole('button').last());
  if (await ownerEditBtn.isVisible()) {
    await ownerEditBtn.click();
    const ownerSelectBtn = ownerRow.getByRole('combobox');
    if (await ownerSelectBtn.isVisible()) {
      await ownerSelectBtn.click();
      const firstMemberOption = page.locator('[data-slot="command-item"]').first();
      if (await firstMemberOption.isVisible()) {
        await firstMemberOption.click();
      }
    }
    const ownerSaveBtn = ownerRow.locator('button:has(svg.lucide-check)');
    if (await ownerSaveBtn.isVisible()) {
      await ownerSaveBtn.click();
    }
  }

  // ==================== ACTION 2: UPDATE STATE ====================
  const stateRow = page.locator('tr', { hasText: 'State' });
  await expect(stateRow).toBeVisible();
  await stateRow.hover();
  const stateEditBtn = stateRow
    .locator('button:has(svg.lucide-square-pen)')
    .or(stateRow.getByRole('button').last());
  if (await stateEditBtn.isVisible()) {
    await stateEditBtn.click();
    const stateCombobox = stateRow.getByRole('combobox');
    if (await stateCombobox.isVisible()) {
      await stateCombobox.click();
      const triagedOption = page.getByRole('option', { name: 'Triaged' }).or(page.getByText('Triaged')).first();
      if (await triagedOption.isVisible()) {
        await triagedOption.click();
      }
    }
    const stateSaveBtn = stateRow.locator('button:has(svg.lucide-check)');
    if (await stateSaveBtn.isVisible()) {
      await stateSaveBtn.click();
      const claimOwnerBtn = page.getByRole('button', { name: /Claim Ownership|Yes/i });
      if (await claimOwnerBtn.isVisible()) {
        await claimOwnerBtn.click();
      }
    }
  }

  // ==================== ACTION 3: UPDATE ASSESSMENT ====================
  const assessmentRow = page.locator('tr', { hasText: 'Assessment' });
  await expect(assessmentRow).toBeVisible();
  await assessmentRow.hover();
  const assmtEditBtn = assessmentRow
    .locator('button:has(svg.lucide-square-pen)')
    .or(assessmentRow.getByText('Set Assessment'));
  if (await assmtEditBtn.isVisible()) {
    await assmtEditBtn.click();
    const assmtCombobox = assessmentRow.getByRole('combobox');
    if (await assmtCombobox.isVisible()) {
      await assmtCombobox.click();
      const firstAssmtOption = page.locator('[role="option"]').first();
      if (await firstAssmtOption.isVisible()) {
        await firstAssmtOption.click();
      }
    }
    const assmtSaveBtn = assessmentRow.locator('button:has(svg.lucide-check)');
    if (await assmtSaveBtn.isVisible()) {
      await assmtSaveBtn.click();
    }
  }

  // ==================== ACTION 4: UPDATE COLLABORATORS ====================
  const collabRow = page.locator('tr', { hasText: 'Collaborators' });
  await expect(collabRow).toBeVisible();
  await collabRow.hover();
  const collabEditBtn = collabRow
    .locator('button:has(svg.lucide-square-pen)')
    .or(collabRow.getByText('Add Collaborators'));
  if (await collabEditBtn.isVisible()) {
    await collabEditBtn.click();
    const collabCombobox = collabRow.getByRole('combobox');
    if (await collabCombobox.isVisible()) {
      await collabCombobox.click();
      const firstCollabOption = page.locator('[data-slot="command-item"]').first();
      if (await firstCollabOption.isVisible()) {
        await firstCollabOption.click();
      }
    }
    const collabSaveBtn = collabRow.locator('button:has(svg.lucide-check)');
    if (await collabSaveBtn.isVisible()) {
      await collabSaveBtn.click();
    }
  }

  // ==================== ACTION 5: UPDATE AFFECTED ASSET ====================
  const assetRow = page.locator('tr', { hasText: 'Affected Asset' });
  await expect(assetRow).toBeVisible();
  await assetRow.hover();
  const assetEditBtn = assetRow
    .locator('button:has(svg.lucide-square-pen)')
    .or(assetRow.getByText('Set Affected Asset'));
  if (await assetEditBtn.isVisible()) {
    await assetEditBtn.click();
    const assetCombobox = assetRow.getByRole('combobox');
    if (await assetCombobox.isVisible()) {
      await assetCombobox.click();
      const firstAssetOption = page.locator('[role="option"]').first();
      if (await firstAssetOption.isVisible()) {
        await firstAssetOption.click();
      }
    }
    const assetSaveBtn = assetRow.locator('button:has(svg.lucide-check)');
    if (await assetSaveBtn.isVisible()) {
      await assetSaveBtn.click();
    }
  }

  // ==================== ACTION 6: UPDATE CWE ====================
  const cweRow = page.locator('tr', { hasText: 'CWE' });
  await expect(cweRow).toBeVisible();
  await cweRow.hover();
  const cweEditBtn = cweRow
    .locator('button:has(svg.lucide-square-pen)')
    .or(cweRow.getByText('Set CWE'));
  if (await cweEditBtn.isVisible()) {
    await cweEditBtn.click();
    const cweCombobox = cweRow.getByRole('combobox');
    if (await cweCombobox.isVisible()) {
      await cweCombobox.click();
      const firstCweOption = page.locator('[role="option"]').first();
      if (await firstCweOption.isVisible()) {
        await firstCweOption.click();
      }
    }
    const cweSaveBtn = cweRow.locator('button:has(svg.lucide-check)');
    if (await cweSaveBtn.isVisible()) {
      await cweSaveBtn.click();
    }
  }

  // ==================== ACTION 7: UPDATE BUSINESS UNIT ====================
  const buRow = page.locator('tr', { hasText: 'Business Unit' });
  await expect(buRow).toBeVisible();
  await buRow.hover();
  const buEditBtn = buRow
    .locator('button:has(svg.lucide-square-pen)')
    .or(buRow.getByText('Set Business Unit'));
  if (await buEditBtn.isVisible()) {
    await buEditBtn.click();
    const buCombobox = buRow.getByRole('combobox');
    if (await buCombobox.isVisible()) {
      await buCombobox.click();
      const firstBuOption = page.locator('[role="option"]').first();
      if (await firstBuOption.isVisible()) {
        await firstBuOption.click();
      }
    }
    const buSaveBtn = buRow.locator('button:has(svg.lucide-check)');
    if (await buSaveBtn.isVisible()) {
      await buSaveBtn.click();
    }
  }

  // ==================== ACTION 8: TOGGLE SHARE REPORT SWITCH ====================
  const shareRow = page.locator('tr', { hasText: 'Share Report' });
  await expect(shareRow).toBeVisible();
  const shareSwitch = shareRow.getByRole('switch');
  if (await shareSwitch.isVisible()) {
    await shareSwitch.click();
    await page.waitForTimeout(500);
    await shareSwitch.click();
  }

  // ==================== ACTION 9: CVSS CALCULATOR MODAL ====================
  const cvssEditBtn = page.locator('div:has(> .bg-accent) button').first();
  if (await cvssEditBtn.isVisible()) {
    await cvssEditBtn.click();
    const cvssModal = page.getByText('CVSS v3.0 Calculator');
    if (await cvssModal.isVisible()) {
      const highTab = page.getByRole('dialog').getByRole('tab', { name: 'High' }).first();
      if (await highTab.isVisible()) {
        await highTab.click();
      }
      const updateCvssBtn = page.getByRole('dialog').getByRole('button', { name: 'Update' });
      await expect(updateCvssBtn).toBeVisible();
      await updateCvssBtn.click();
    }
  }

  // ==================== ACTION 10: REPORT EDITOR & ACTIONS ====================
  const vulnEditor = page.locator('.VulnReportEditor');
  await expect(vulnEditor).toBeVisible();

  const copyMarkdownBtn = vulnEditor.getByTitle('Copy markdown');
  if (await copyMarkdownBtn.isVisible()) {
    await copyMarkdownBtn.click();
  }

  const toggleEditModeBtn = vulnEditor.getByTitle(/Enable Edit Mode|Enable Readonly Mode/i);
  if (await toggleEditModeBtn.isVisible()) {
    await toggleEditModeBtn.click();
  }

  // ==================== ACTION 11: COMMENT & BLOCKER PANEL ====================
  const commentBox = page.getByText('Comment & Blocker Panel');
  await expect(commentBox).toBeVisible();

  const commentInput = page.getByPlaceholder(/Comment as/i);
  if (await commentInput.isVisible()) {
    await commentInput.click();
    await commentInput.fill('Automated test comment check');

    // Toggle Blocker form
    const blockerToggleBtn = page.locator('button:has(svg.lucide-octagon-alert)');
    if (await blockerToggleBtn.isVisible()) {
      await blockerToggleBtn.click();
      await page.waitForTimeout(300);
      await blockerToggleBtn.click();
    }

    // Send Comment
    const sendCommentBtn = page.locator('button:has(svg.lucide-send-horizonal)');
    if (await sendCommentBtn.isVisible() && (await sendCommentBtn.isEnabled())) {
      await sendCommentBtn.click();
    }
  }

  // ==================== ACTION 12: ATTACHMENTS ====================
  const attachmentsCard = page.getByText('Attachments');
  await expect(attachmentsCard).toBeVisible();

  // ==================== ACTION 13: DOWNLOAD & DUPLICATE MODALS ====================
  const downloadBtn = page.locator('button:has(svg.lucide-download)').first();
  if (await downloadBtn.isVisible()) {
    await downloadBtn.click();
    const downloadDialog = page.getByText('Download Report');
    if (await downloadDialog.isVisible()) {
      const cancelBtn = page.getByRole('dialog').getByRole('button', { name: 'Cancel' });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    }
  }

  const duplicateBtn = page.locator('button:has(svg.lucide-copy-plus)').first();
  if (await duplicateBtn.isVisible()) {
    await duplicateBtn.click();
    const duplicateDialog = page.getByText('Duplicate Vulnerability');
    if (await duplicateDialog.isVisible()) {
      const cancelBtn = page.getByRole('dialog').getByRole('button', { name: 'Cancel' });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    }
  }
});