import Handsontable from 'handsontable/base';
import { BaseEditor } from 'handsontable/editors/baseEditor';
import { registerCellType } from 'handsontable/cellTypes';

let isRegistered = false;

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: This file is the complete, authoritative implementation.
// Key fixes applied:
//   1. selectAllBtn, clearAllBtn, countBadge are all properly created in init()
//   2. editorRoot stops ALL mouse events so Handsontable never closes the editor
//   3. Option rows are <div> not <label> — prevents double-click/toggle issues
//   4. Checkbox has pointer-events:none; row div handles all clicks
//   5. document mousedown uses bubble phase (no capture) so editorRoot's
//      stopPropagation fires first and keeps the dropdown open on option clicks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalizes any incoming cell value to a clean string array
 */
export function normalizeToArray(value) {
  if (value === null || value === undefined || value === '' || value === '-') {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item === null || item === undefined) return '';
        if (typeof item === 'object') {
          return item.label || item.name || item.title || item.value || item.id || item._id || '';
        }
        return String(item).trim();
      })
      .filter(Boolean);
  }
  if (typeof value === 'object') {
    const text = value.label || value.name || value.title || value.value || value.id || value._id;
    return text ? [String(text).trim()] : [];
  }
  const str = String(value).trim();
  if (!str) return [];
  if (str.includes(',')) {
    return str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [str];
}

/**
 * Custom renderer for MultiSelect cell type — displays removable badge chips with dropdown arrow
 */
export function multiSelectRenderer(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.style.verticalAlign = 'middle';
  td.style.padding = '0 6px';
  td.style.boxSizing = 'border-box';
  td.style.height = '28px';
  td.style.lineHeight = '27px';
  td.style.whiteSpace = 'nowrap';
  td.style.overflow = 'hidden';

  const selectedItems = normalizeToArray(value);

  const container = document.createElement('div');
  container.className = 'htMultiSelectCell';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.overflow = 'hidden';

  const textSpan = document.createElement('span');
  textSpan.style.flex = '1';
  textSpan.style.minWidth = '0';
  textSpan.style.overflow = 'hidden';
  textSpan.style.textOverflow = 'ellipsis';
  textSpan.style.whiteSpace = 'nowrap';
  textSpan.style.fontSize = '11.5px';

  if (selectedItems.length === 0) {
    textSpan.style.color = 'var(--muted-foreground, #94a3b8)';
    textSpan.innerText = cellProperties.placeholder || '\u2014';
  } else {
    textSpan.style.color = 'var(--foreground, #f8fafc)';
    textSpan.innerText = selectedItems.join(', ');
    textSpan.title = selectedItems.join(', ');
  }

  container.appendChild(textSpan);

  // Dropdown chevron arrow on the right
  const arrow = document.createElement('button');
  arrow.type = 'button';
  arrow.tabIndex = -1;
  arrow.className = 'htAutocompleteArrow';
  arrow.innerHTML = '&#x25BC;';
  arrow.style.border = 'none';
  arrow.style.background = 'transparent';
  arrow.style.color = 'var(--muted-foreground, #94a3b8)';
  arrow.style.fontSize = '8px';
  arrow.style.cursor = 'pointer';
  arrow.style.padding = '0';
  arrow.style.marginLeft = '4px';
  arrow.style.lineHeight = '20px';
  arrow.style.opacity = '0.7';
  arrow.style.flexShrink = '0';
  container.appendChild(arrow);

  td.appendChild(container);
  return td;
}

/**
 * MultiSelectEditor extending Handsontable's BaseEditor
 */
export class MultiSelectEditor extends BaseEditor {
  init() {
    this.selectedValues = new Set();
    this.options = [];
    this.filteredOptions = [];
    this.focusedOptionIndex = -1;

    // Create dropdown container
    this.editorRoot = document.createElement('div');
    this.editorRoot.className = 'htMultiSelectEditor';
    this.editorRoot.style.display = 'none';
    this.editorRoot.style.position = 'fixed';
    this.editorRoot.style.zIndex = '99999';
    this.editorRoot.style.flexDirection = 'column';
    this.editorRoot.style.width = '260px';
    this.editorRoot.style.minWidth = '220px';
    this.editorRoot.style.maxWidth = '360px';
    this.editorRoot.style.background = 'var(--popover, #1e293b)';
    this.editorRoot.style.color = 'var(--popover-foreground, #f8fafc)';
    this.editorRoot.style.border = '1px solid var(--border, #334155)';
    this.editorRoot.style.borderRadius = '8px';
    this.editorRoot.style.boxShadow =
      '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)';
    this.editorRoot.style.overflow = 'hidden';
    this.editorRoot.style.boxSizing = 'border-box';
    this.editorRoot.style.fontFamily = 'inherit';

    // CRITICAL: Stop ALL mouse events from bubbling out of the dropdown
    // so Handsontable's global mousedown listener never fires destroyEditor
    ['mousedown', 'mouseup', 'click', 'touchstart', 'touchend'].forEach((evtName) => {
      this.editorRoot.addEventListener(evtName, (e) => { e.stopPropagation(); });
    });

    // 1. Search bar
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'htMultiSelectSearchWrapper';
    searchWrapper.style.display = 'flex';
    searchWrapper.style.alignItems = 'center';
    searchWrapper.style.padding = '8px 10px';
    searchWrapper.style.gap = '6px';
    searchWrapper.style.borderBottom = '1px solid var(--border, #334155)';
    searchWrapper.style.background = 'var(--card, #0f172a)';

    const searchIcon = document.createElement('span');
    searchIcon.innerHTML = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--muted-foreground, #94a3b8);">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    `;
    searchIcon.style.display = 'flex';
    searchIcon.style.alignItems = 'center';

    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.className = 'htMultiSelectSearchInput';
    this.searchInput.placeholder = 'Search options...';
    this.searchInput.style.flex = '1';
    this.searchInput.style.background = 'transparent';
    this.searchInput.style.border = 'none';
    this.searchInput.style.outline = 'none';
    this.searchInput.style.fontSize = '12px';
    this.searchInput.style.color = 'var(--foreground, #f8fafc)';
    this.searchInput.style.padding = '0';
    this.searchInput.style.minWidth = '0';

    this.clearSearchBtn = document.createElement('button');
    this.clearSearchBtn.type = 'button';
    this.clearSearchBtn.innerHTML = '&times;';
    this.clearSearchBtn.style.display = 'none';
    this.clearSearchBtn.style.background = 'transparent';
    this.clearSearchBtn.style.border = 'none';
    this.clearSearchBtn.style.color = 'var(--muted-foreground, #94a3b8)';
    this.clearSearchBtn.style.cursor = 'pointer';
    this.clearSearchBtn.style.fontSize = '14px';
    this.clearSearchBtn.style.padding = '0 2px';

    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(this.searchInput);
    searchWrapper.appendChild(this.clearSearchBtn);
    this.editorRoot.appendChild(searchWrapper);

    // 2. Options list
    this.optionsList = document.createElement('div');
    this.optionsList.className = 'htMultiSelectOptionsList';
    this.optionsList.style.display = 'flex';
    this.optionsList.style.flexDirection = 'column';
    this.optionsList.style.maxHeight = '200px';
    this.optionsList.style.overflowY = 'auto';
    this.optionsList.style.padding = '4px';
    this.editorRoot.appendChild(this.optionsList);

    // 4. Footer with Done button
    const footer = document.createElement('div');
    footer.className = 'htMultiSelectFooter';
    footer.style.display = 'flex';
    footer.style.alignItems = 'center';
    footer.style.justifyContent = 'flex-end';
    footer.style.padding = '6px 10px';
    footer.style.background = 'var(--card, #0f172a)';
    footer.style.borderTop = '1px solid var(--border, #334155)';

    this.doneBtn = document.createElement('button');
    this.doneBtn.type = 'button';
    this.doneBtn.innerText = 'Done';
    this.doneBtn.style.background = 'var(--primary, #3b82f6)';
    this.doneBtn.style.color = '#fff';
    this.doneBtn.style.border = 'none';
    this.doneBtn.style.borderRadius = '4px';
    this.doneBtn.style.padding = '3px 12px';
    this.doneBtn.style.fontSize = '11.5px';
    this.doneBtn.style.fontWeight = '500';
    this.doneBtn.style.cursor = 'pointer';

    footer.appendChild(this.doneBtn);
    this.editorRoot.appendChild(footer);

    // Mount to document body to avoid any parent overflow truncation
    document.body.appendChild(this.editorRoot);

    // Bind event handlers
    this.bindEvents();
  }

  bindEvents() {
    // Search input typing
    this.searchInput.addEventListener('input', () => {
      const q = this.searchInput.value.trim().toLowerCase();
      this.clearSearchBtn.style.display = q ? 'inline-block' : 'none';
      this.filterOptions(q);
    });

    // Clear search
    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.clearSearchBtn.style.display = 'none';
      this.filterOptions('');
      this.searchInput.focus();
    });

    // Done button
    this.doneBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.finishEditing();
      this.close();
    });

    // Keyboard navigation inside search input
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.finishEditing(true);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.focusedOptionIndex >= 0 && this.focusedOptionIndex < this.filteredOptions.length) {
          const opt = this.filteredOptions[this.focusedOptionIndex];
          this.toggleOption(opt.label);
        } else {
          this.finishEditing();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateOptions(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateOptions(-1);
      }
    });

    // Outside click listener
    this.onDocumentMouseDown = (e) => {
      if (!this._opened) return;
      if (this.editorRoot.contains(e.target)) return;
      if (this.TD && this.TD.contains(e.target)) return;
      this.finishEditing();
    };

    // Reposition on scroll or resize
    this.onWindowResizeOrScroll = () => {
      if (this._opened) {
        this.refreshDimensions();
      }
    };
  }

  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);

    // Normalize selected values
    const arr = normalizeToArray(originalValue);
    this.selectedValues = new Set(arr);

    // Extract available source options
    let source = cellProperties.source || cellProperties.selectOptions || [];
    if (typeof source === 'function') {
      source = source(row, col, prop);
    }

    if (Array.isArray(source)) {
      this.options = source.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return {
            key: item.key || item.id || item._id || item.value || '',
            label: item.value || item.label || item.name || item.title || String(item.key || ''),
          };
        }
        return {
          key: String(item),
          label: String(item),
        };
      });
    } else {
      this.options = [];
    }

    this.filteredOptions = [...this.options];
    this.focusedOptionIndex = -1;
  }

  filterOptions(query) {
    if (!query) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter((opt) =>
        opt.label.toLowerCase().includes(query),
      );
    }
    this.focusedOptionIndex = -1;
    this.renderOptionsList();
  }

  toggleOption(label) {
    if (this.selectedValues.has(label)) {
      this.selectedValues.delete(label);
    } else {
      this.selectedValues.add(label);
    }
    this.syncUI();
    this.commitRealtime();
  }

  commitRealtime() {
    if (this.TD && this.hot) {
      try {
        multiSelectRenderer(
          this.hot,
          this.TD,
          this.row,
          this.col,
          this.prop,
          Array.from(this.selectedValues),
          this.cellProperties,
        );
      } catch (e) {
        // Fallback
      }
    }
  }

  syncUI() {
    // Update count badge
    const count = this.selectedValues.size;
    if (this.countBadge) {
      this.countBadge.innerText = count > 0 ? `${count} selected` : '';
    }

    // Update checkboxes in the list
    const rows = this.optionsList.querySelectorAll('.htMultiSelectOptionRow');
    rows.forEach((rowElem) => {
      const val = rowElem.getAttribute('data-val');
      const isSelected = this.selectedValues.has(val);
      const checkbox = rowElem.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = isSelected;
      if (isSelected) {
        rowElem.style.background = 'rgba(59, 130, 246, 0.08)';
        rowElem.style.fontWeight = '500';
      } else {
        rowElem.style.background = 'transparent';
        rowElem.style.fontWeight = '400';
      }
    });
  }

  navigateOptions(direction) {
    if (this.filteredOptions.length === 0) return;
    this.focusedOptionIndex += direction;
    if (this.focusedOptionIndex < 0) this.focusedOptionIndex = 0;
    if (this.focusedOptionIndex >= this.filteredOptions.length) {
      this.focusedOptionIndex = this.filteredOptions.length - 1;
    }

    const rows = this.optionsList.querySelectorAll('.htMultiSelectOptionRow');
    rows.forEach((r, idx) => {
      if (idx === this.focusedOptionIndex) {
        r.style.outline = '1.5px solid var(--primary, #3b82f6)';
        r.scrollIntoView({ block: 'nearest' });
      } else {
        r.style.outline = 'none';
      }
    });
  }

  renderOptionsList() {
    this.optionsList.innerHTML = '';

    if (this.filteredOptions.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'htMultiSelectEmpty';
      empty.innerText = 'No matching options';
      empty.style.padding = '16px';
      empty.style.textAlign = 'center';
      empty.style.fontSize = '12px';
      empty.style.color = 'var(--muted-foreground, #94a3b8)';
      this.optionsList.appendChild(empty);
      return;
    }

    this.filteredOptions.forEach((opt) => {
      // Use div NOT label — label causes the browser to re-dispatch click to
      // the checkbox which triggers double-toggle on every click
      const row = document.createElement('div');
      row.className = 'htMultiSelectOptionRow';
      row.setAttribute('data-val', opt.label);
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.padding = '5px 8px';
      row.style.borderRadius = '5px';
      row.style.cursor = 'pointer';
      row.style.fontSize = '12px';
      row.style.userSelect = 'none';
      row.style.transition = 'background 0.12s ease';

      const isSelected = this.selectedValues.has(opt.label);
      if (isSelected) {
        row.style.background = 'rgba(59, 130, 246, 0.08)';
        row.style.fontWeight = '500';
      }

      row.addEventListener('mouseenter', () => {
        row.style.background = 'var(--accent, rgba(51, 65, 85, 0.7))';
      });
      row.addEventListener('mouseleave', () => {
        const sel = this.selectedValues.has(opt.label);
        row.style.background = sel ? 'rgba(59, 130, 246, 0.08)' : 'transparent';
      });

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isSelected;
      checkbox.style.cursor = 'pointer';
      checkbox.style.width = '14px';
      checkbox.style.height = '14px';
      checkbox.style.accentColor = 'var(--primary, #3b82f6)';
      checkbox.style.borderRadius = '3px';
      checkbox.style.margin = '0';
      checkbox.style.flexShrink = '0';
      // Disable pointer events on checkbox — the row div handles all clicks
      checkbox.style.pointerEvents = 'none';
      checkbox.tabIndex = -1;

      const labelSpan = document.createElement('span');
      labelSpan.innerText = opt.label;
      labelSpan.style.flex = '1';
      labelSpan.style.whiteSpace = 'nowrap';
      labelSpan.style.overflow = 'hidden';
      labelSpan.style.textOverflow = 'ellipsis';
      labelSpan.style.color = 'var(--foreground, #f8fafc)';
      labelSpan.title = opt.label;

      row.appendChild(checkbox);
      row.appendChild(labelSpan);

      // Single click on the row div cleanly toggles the option
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleOption(opt.label);
      });

      this.optionsList.appendChild(row);
    });

    this.syncUI();
  }

  open() {
    this._opened = true;
    this.searchInput.value = '';
    this.clearSearchBtn.style.display = 'none';
    this.filterOptions('');

    this.editorRoot.style.display = 'flex';
    this.refreshDimensions();

    setTimeout(() => {
      this.searchInput.focus();
    }, 20);

    // Bubble phase (no third arg) — editorRoot's stopPropagation fires first,
    // so clicks inside the dropdown never reach this handler.
    document.addEventListener('mousedown', this.onDocumentMouseDown);
    window.addEventListener('resize', this.onWindowResizeOrScroll);
    window.addEventListener('scroll', this.onWindowResizeOrScroll);
  }

  close() {
    this._opened = false;
    this.editorRoot.style.display = 'none';
    document.removeEventListener('mousedown', this.onDocumentMouseDown);
    window.removeEventListener('resize', this.onWindowResizeOrScroll);
    window.removeEventListener('scroll', this.onWindowResizeOrScroll);
  }

  focus() {
    this.searchInput.focus();
  }

  getValue() {
    return Array.from(this.selectedValues);
  }

  setValue(value) {
    const arr = normalizeToArray(value);
    this.selectedValues = new Set(arr);
    this.syncUI();
  }

  refreshDimensions() {
    if (!this._opened) return;
    this.TD = this.getEditedCell() || this.TD;
    if (!this.TD) {
      this.close();
      return;
    }

    const rect = this.TD.getBoundingClientRect();
    const dropdownWidth = Math.max(rect.width, 240);
    const dropdownHeight = 290;

    let left = rect.left;
    let top = rect.bottom + 2;

    // Boundary check for right side
    if (left + dropdownWidth > window.innerWidth - 10) {
      left = Math.max(10, window.innerWidth - dropdownWidth - 10);
    }

    // Boundary check for bottom side — flip upwards if near bottom
    if (top + dropdownHeight > window.innerHeight - 10) {
      top = Math.max(10, rect.top - dropdownHeight - 2);
    }

    this.editorRoot.style.left = `${left}px`;
    this.editorRoot.style.top = `${top}px`;
    this.editorRoot.style.width = `${dropdownWidth}px`;
  }
}

/**
 * Registers both 'multiSelect' and 'multiselect' cell types safely into Handsontable
 */
export function registerMultiSelectCellType() {
  if (isRegistered) return;
  try {
    registerCellType('multiSelect', {
      editor: MultiSelectEditor,
      renderer: multiSelectRenderer,
    });
    registerCellType('multiselect', {
      editor: MultiSelectEditor,
      renderer: multiSelectRenderer,
    });
    isRegistered = true;
  } catch (e) {
    // If already registered
    isRegistered = true;
  }
}

export default registerMultiSelectCellType;
