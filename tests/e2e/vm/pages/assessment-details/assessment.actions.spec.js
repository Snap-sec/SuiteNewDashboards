import { expect, test } from '@playwright/test';

test('dynamically perform actions and update settings on assessment details page', async ({
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

  // 4. Dynamically pick and navigate to the first assessment
  const firstAssessmentRow = page.locator('tbody tr').first();
  await expect(firstAssessmentRow).toBeVisible();

  const assessmentLink = firstAssessmentRow
    .locator('a[href*="/vm/assessment-edit"]')
    .first();
  await expect(assessmentLink).toBeVisible();
  await assessmentLink.click();
  await page.waitForURL('**/vm/assessment-edit**');
  await page.waitForLoadState('domcontentloaded');

  // 5. Navigate to Settings tab
  const settingsTab = page.getByRole('tab', { name: 'Settings' });
  await expect(settingsTab).toBeVisible();
  await settingsTab.click();
  await expect(settingsTab).toHaveAttribute('data-state', 'active');
  await expect(page.getByRole('tabpanel')).toBeVisible();

  // Ensure Assessment Info card is visible
  await expect(page.getByText('Assessment Info')).toBeVisible();

  // 6. Action: Dynamically update Assessment Name
  const nameRow = page
    .locator('tr')
    .filter({ hasText: 'Assessment Name' })
    .first();
  await expect(nameRow).toBeVisible();
  await nameRow.hover();
  const nameEditBtn = nameRow
    .locator('button:has(svg.lucide-square-pen)')
    .or(nameRow.getByRole('button'))
    .last();
  await nameEditBtn.click({ force: true });

  const dynamicAssessmentName = `Assmt-Upd-${Date.now().toString().slice(-6)}`;
  const nameInput = page.getByPlaceholder(/Enter Assessment Name/i);
  await expect(nameInput).toBeVisible();
  await nameInput.fill(dynamicAssessmentName);

  const saveNameBtn = nameRow.locator('button:has(svg.lucide-check)');
  await saveNameBtn.click();
  await expect(nameInput).toBeHidden({ timeout: 5000 });

  // 7. Action: Dynamically update Date
  const dateRow = page.locator('tr').filter({ hasText: 'Date' }).first();
  if (await dateRow.isVisible()) {
    await dateRow.hover();
    const dateEditBtn = dateRow
      .locator('button:has(svg.lucide-square-pen)')
      .or(dateRow.getByRole('button'))
      .last();
    if (await dateEditBtn.isVisible()) {
      await dateEditBtn.click({ force: true });
      const datePickerBtn = dateRow
        .locator('button[role="combobox"]')
        .or(dateRow.locator('button:has(svg.lucide-calendar)'))
        .or(dateRow.getByRole('button'))
        .first();
      if (await datePickerBtn.isVisible()) {
        await datePickerBtn.click();
        const availableDayBtn = page
          .locator('[role="gridcell"] button:not([disabled])')
          .first();
        if (await availableDayBtn.isVisible()) {
          await availableDayBtn.click();
        }
      }
      const saveDateBtn = dateRow.locator('button:has(svg.lucide-check)');
      if (await saveDateBtn.isVisible()) {
        await saveDateBtn.click();
      }
    }
  }

  // 8. Action: Dynamically update Category
  const categoryRow = page
    .locator('tr')
    .filter({ hasText: 'Category' })
    .first();
  if (await categoryRow.isVisible()) {
    await categoryRow.hover();
    const catEditBtn = categoryRow
      .locator('button:has(svg.lucide-square-pen)')
      .or(categoryRow.getByRole('button'))
      .last();
    if (await catEditBtn.isVisible()) {
      await catEditBtn.click({ force: true });
      const categoryCombobox = categoryRow
        .locator('button[role="combobox"]')
        .first();
      if (await categoryCombobox.isVisible()) {
        await categoryCombobox.click();
        const firstCategoryOption = page.locator('[role="option"]').first();
        if (await firstCategoryOption.isVisible()) {
          await firstCategoryOption.click();
        }
      }
      const saveCatBtn = categoryRow.locator('button:has(svg.lucide-check)');
      if (await saveCatBtn.isVisible()) {
        await saveCatBtn.click();
      }
    }
  }

  // 9. Action: Dynamically update Scope
  const scopeRow = page.locator('tr').filter({ hasText: 'Scope' }).first();
  if (await scopeRow.isVisible()) {
    await scopeRow.hover();
    const scopeEditBtn = scopeRow
      .locator('button:has(svg.lucide-square-pen)')
      .or(scopeRow.getByRole('button'))
      .last();
    if (await scopeEditBtn.isVisible()) {
      await scopeEditBtn.click({ force: true });
      const scopeTextarea = scopeRow.locator('textarea');
      if (await scopeTextarea.isVisible()) {
        await scopeTextarea.fill(
          `Dynamic scope updated at ${new Date().toISOString()}`,
        );
      }
      const saveScopeBtn = scopeRow.locator('button:has(svg.lucide-check)');
      if (await saveScopeBtn.isVisible()) {
        await saveScopeBtn.click();
      }
    }
  }

  // 10. Action: Dynamically update Default Ticket Assignee
  const assigneeRow = page
    .locator('tr')
    .filter({ hasText: 'Default Ticket Assignee' })
    .first();
  if (await assigneeRow.isVisible()) {
    await assigneeRow.hover();
    const assigneeEditBtn = assigneeRow
      .locator('button:has(svg.lucide-square-pen)')
      .or(assigneeRow.getByRole('button'))
      .last();
    if (await assigneeEditBtn.isVisible()) {
      await assigneeEditBtn.click({ force: true });
      const assigneeCombobox = assigneeRow
        .locator('button[role="combobox"]')
        .first();
      if (await assigneeCombobox.isVisible()) {
        await assigneeCombobox.click();
        const firstAssigneeOption = page.locator('[role="option"]').first();
        if (await firstAssigneeOption.isVisible()) {
          await firstAssigneeOption.click();
        }
      }
      const saveAssigneeBtn = assigneeRow.locator(
        'button:has(svg.lucide-check)',
      );
      if (await saveAssigneeBtn.isVisible()) {
        await saveAssigneeBtn.click();

        // Handle Override Existing Owners dialog if opened
        const overrideModal = page.getByRole('dialog', {
          name: /Override Existing Owners/i,
        });
        if (
          await overrideModal.isVisible({ timeout: 1500 }).catch(() => false)
        ) {
          const modalSaveBtn = overrideModal.getByRole('button', {
            name: /Save/i,
          });
          if (await modalSaveBtn.isVisible()) {
            await modalSaveBtn.click();
          }
        }
      }
    }
  }

  // 11. Action: Dynamically update Departments
  const deptRow = page.locator('tr').filter({ hasText: 'Departments' }).first();
  if (await deptRow.isVisible()) {
    await deptRow.hover();
    const deptEditBtn = deptRow
      .locator('button:has(svg.lucide-square-pen)')
      .or(deptRow.getByRole('button'))
      .last();
    if (await deptEditBtn.isVisible()) {
      await deptEditBtn.click({ force: true });
      const deptCombobox = deptRow.locator('button[role="combobox"]').first();
      if (await deptCombobox.isVisible()) {
        await deptCombobox.click();
        const firstDeptOption = page.locator('[role="option"]').first();
        if (await firstDeptOption.isVisible()) {
          await firstDeptOption.click();
        }
        await deptRow.click({ force: true }).catch(() => {});
      }
      const saveDeptBtn = deptRow.locator('button:has(svg.lucide-check)');
      if (await saveDeptBtn.isVisible()) {
        await saveDeptBtn.click();
      }
    }
  }

  // 12. Action: Dynamically update Business unit
  const buRow = page.locator('tr').filter({ hasText: 'Business unit' }).first();
  if (await buRow.isVisible()) {
    await buRow.hover();
    const buEditBtn = buRow
      .locator('button:has(svg.lucide-square-pen)')
      .or(buRow.getByRole('button'))
      .last();
    if (await buEditBtn.isVisible()) {
      await buEditBtn.click({ force: true });
      const buCombobox = buRow.locator('button[role="combobox"]').first();
      if (await buCombobox.isVisible()) {
        await buCombobox.click();
        const firstBuOption = page.locator('[role="option"]').first();
        if (await firstBuOption.isVisible()) {
          await firstBuOption.click();
        }
      }
      const saveBuBtn = buRow.locator('button:has(svg.lucide-check)');
      if (await saveBuBtn.isVisible()) {
        await saveBuBtn.click();

        // Handle Proceed confirmation modal if displayed
        const proceedBtn = page.getByRole('button', { name: 'Proceed' });
        if (await proceedBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
          await proceedBtn.click();
        }
      }
    }
  }

  // 13. Action: Dynamically update Vendor
  const vendorRow = page.locator('tr').filter({ hasText: 'Vendor' }).first();
  if (await vendorRow.isVisible()) {
    await vendorRow.hover();
    const vendorEditBtn = vendorRow
      .locator('button:has(svg.lucide-square-pen)')
      .or(vendorRow.getByRole('button'))
      .last();
    if (await vendorEditBtn.isVisible()) {
      await vendorEditBtn.click({ force: true });
      const vendorCombobox = vendorRow
        .locator('button[role="combobox"]')
        .first();
      if (await vendorCombobox.isVisible()) {
        await vendorCombobox.click();
        const firstVendorOption = page.locator('[role="option"]').first();
        if (await firstVendorOption.isVisible()) {
          await firstVendorOption.click();
        }
      }
      const saveVendorBtn = vendorRow.locator('button:has(svg.lucide-check)');
      if (await saveVendorBtn.isVisible()) {
        await saveVendorBtn.click();
      }
    }
  }

  // 14. Action: Dynamically update Vulnerability Source
  const sourceRow = page
    .locator('tr')
    .filter({ hasText: 'Vulnerability Source' })
    .first();
  if (await sourceRow.isVisible()) {
    await sourceRow.hover();
    const sourceEditBtn = sourceRow
      .locator('button:has(svg.lucide-square-pen)')
      .or(sourceRow.getByRole('button'))
      .last();
    if (await sourceEditBtn.isVisible()) {
      await sourceEditBtn.click({ force: true });
      const sourceCombobox = sourceRow
        .locator('button[role="combobox"]')
        .first();
      if (await sourceCombobox.isVisible()) {
        await sourceCombobox.click();
        const firstSourceOption = page.locator('[role="option"]').first();
        if (await firstSourceOption.isVisible()) {
          await firstSourceOption.click();
        }
      }
      const saveSourceBtn = sourceRow.locator('button:has(svg.lucide-check)');
      if (await saveSourceBtn.isVisible()) {
        await saveSourceBtn.click();
      }
    }
  }

  // 15. Action: Toggle Assessment Privacy / Access Type
  const privacyCards = ['Black Box', 'Grey Box', 'White Box'];
  for (const privacyType of privacyCards) {
    const card = page
      .locator('.border-b')
      .filter({ hasText: privacyType })
      .first();
    if (await card.isVisible()) {
      await card.click();
    }
  }

  // 16. Action: Collaborators interaction (Add & Remove)
  const collabCard = page
    .locator('div, [data-slot="card"]')
    .filter({ hasText: 'Collaborators' })
    .first();
  if (await collabCard.isVisible()) {
    const memberSelectTrigger = collabCard
      .getByText('Add New Member')
      .or(collabCard.locator('button:has-text("Add New Member")'))
      .first();

    if (await memberSelectTrigger.isVisible()) {
      await memberSelectTrigger.click();
      const firstMemberOption = page.locator('[role="option"]').first();
      if (await firstMemberOption.isVisible()) {
        await firstMemberOption.click();
        const addBtn = collabCard.getByRole('button', {
          name: 'Add',
          exact: true,
        });
        if ((await addBtn.isVisible()) && (await addBtn.isEnabled())) {
          await addBtn.click();
        }
      }
    }

    // Attempt collaborator deletion with confirmation dialog if any exists
    const removeBtn = collabCard
      .locator('button:has(svg.lucide-delete), button:has(svg.lucide-trash-2)')
      .first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      const confirmBtn = page.getByRole('button', { name: 'Confirm' });
      if (await confirmBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await confirmBtn.click();
      }
    }
  }
});
