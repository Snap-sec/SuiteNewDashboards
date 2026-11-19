import React, { useMemo, useRef, useEffect } from 'react';
import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { useAuth } from '@/auth/context/auth-context';
import { registerMultiSelectCellType } from './MultiSelectCellType';

// Safely register all Handsontable modules and MultiSelect cell type
try {
  registerAllModules();
  registerMultiSelectCellType();
} catch (e) {
  // Safe fallback if modules are already registered
}

/**
 * Helper to safely extract nested object property value
 */
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  if (Object.prototype.hasOwnProperty.call(obj, path)) return obj[path];
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

/**
 * Helper to build an inline pill badge element with dropdown arrow if needed
 */
function createBadgeCell(td, text, bg, color, border, isDropdown = false) {
  td.innerHTML = '';
  td.style.verticalAlign = 'middle';
  td.style.padding = '0 6px';
  td.style.boxSizing = 'border-box';
  td.style.height = '28px';
  td.style.lineHeight = '27px';
  td.style.whiteSpace = 'nowrap';
  td.style.overflow = 'hidden';

  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'space-between';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.gap = '4px';

  const badge = document.createElement('span');
  badge.style.display = 'inline-flex';
  badge.style.alignItems = 'center';
  badge.style.justifyContent = 'center';
  badge.style.height = '18px';
  badge.style.lineHeight = '16px';
  badge.style.padding = '0 7px';
  badge.style.borderRadius = '9999px';
  badge.style.fontSize = '10.5px';
  badge.style.fontWeight = '500';
  badge.style.whiteSpace = 'nowrap';
  badge.style.textTransform = 'capitalize';
  badge.style.backgroundColor = bg;
  badge.style.color = color;
  badge.style.border = `1px solid ${border}`;
  badge.innerText = text;
  badge.title = text;
  container.appendChild(badge);

  if (isDropdown) {
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
    arrow.style.marginLeft = 'auto';
    arrow.style.lineHeight = '20px';
    arrow.style.opacity = '0.7';
    container.appendChild(arrow);
  }

  td.appendChild(container);
  return td;
}

/**
 * Custom renderer for Type column using GetAssetTypeInfo labels and colored pill badge
 */
function typeRenderer(instance, td, row, col, prop, value, cellProperties) {
  if (value === null || value === undefined || value === '' || value === '-') {
    td.innerText = '\u2014';
    td.style.verticalAlign = 'middle';
    td.style.padding = '0 8px';
    td.style.color = 'var(--muted-foreground)';
    return td;
  }
  const raw = String(value).toLowerCase().trim();
  let normalized = raw;
  if (normalized === 'repositories') normalized = 'repository';
  else if (normalized === 'subdomains') normalized = 'subdomain';
  else if (normalized === 'ips' || normalized === 'ip addresses') normalized = 'ip';
  else if (normalized === 'servers') normalized = 'server';
  else if (normalized === 'web servers' || normalized === 'web_servers') normalized = 'web_server';
  else if (normalized === 'ports') normalized = 'port';
  else if (normalized === 'services') normalized = 'service';
  else if (normalized === 'certificates') normalized = 'certificate';
  else if (normalized === 'technologies') normalized = 'technology';
  else if (normalized === 'registries') normalized = 'registry';
  else if (normalized === 'object storages' || normalized === 'object_storages') normalized = 'object_storage';
  else if (normalized === 'apis') normalized = 'api';
  else if (normalized === 'employees') normalized = 'employee';
  else if (normalized === 'vendors') normalized = 'vendor';
  else if (normalized === 'applications') normalized = 'application';
  else if (normalized === 'endpoints') normalized = 'endpoint';
  else if (normalized === 'workstations') normalized = 'workstation';

  const typeInfo = GetAssetTypeInfo(normalized);
  const displayLabel = typeInfo?.label || (raw.charAt(0).toUpperCase() + raw.slice(1));

  let bg = 'rgba(100, 116, 139, 0.15)';
  let color = '#94a3b8';
  let border = 'rgba(100, 116, 139, 0.3)';

  if (normalized === 'repository') {
    bg = 'rgba(59, 130, 246, 0.12)';
    color = '#60a5fa';
    border = 'rgba(59, 130, 246, 0.3)';
  } else if (normalized === 'subdomain') {
    bg = 'rgba(168, 85, 247, 0.12)';
    color = '#c084fc';
    border = 'rgba(168, 85, 247, 0.3)';
  } else if (normalized === 'ip') {
    bg = 'rgba(20, 184, 166, 0.12)';
    color = '#2dd4bf';
    border = 'rgba(20, 184, 166, 0.3)';
  } else if (normalized === 'web_server' || normalized === 'server') {
    bg = 'rgba(14, 165, 233, 0.12)';
    color = '#38bdf8';
    border = 'rgba(14, 165, 233, 0.3)';
  } else if (normalized === 'port') {
    bg = 'rgba(245, 158, 11, 0.12)';
    color = '#fbbf24';
    border = 'rgba(245, 158, 11, 0.3)';
  } else if (normalized === 'service') {
    bg = 'rgba(34, 197, 94, 0.12)';
    color = '#4ade80';
    border = 'rgba(34, 197, 94, 0.3)';
  } else if (normalized === 'certificate') {
    bg = 'rgba(139, 92, 246, 0.12)';
    color = '#a78bfa';
    border = 'rgba(139, 92, 246, 0.3)';
  } else if (normalized === 'technology') {
    bg = 'rgba(217, 70, 239, 0.12)';
    color = '#e879f9';
    border = 'rgba(217, 70, 239, 0.3)';
  } else if (normalized === 'dns') {
    bg = 'rgba(249, 115, 22, 0.12)';
    color = '#fb923c';
    border = 'rgba(249, 115, 22, 0.3)';
  } else if (normalized === 'registry') {
    bg = 'rgba(244, 63, 94, 0.12)';
    color = '#fb7185';
    border = 'rgba(244, 63, 94, 0.3)';
  } else if (normalized === 'object_storage') {
    bg = 'rgba(99, 102, 241, 0.12)';
    color = '#818cf8';
    border = 'rgba(99, 102, 241, 0.3)';
  } else if (normalized === 'api') {
    bg = 'rgba(16, 185, 129, 0.12)';
    color = '#34d399';
    border = 'rgba(16, 185, 129, 0.3)';
  } else if (normalized === 'employee') {
    bg = 'rgba(236, 72, 153, 0.12)';
    color = '#f472b6';
    border = 'rgba(236, 72, 153, 0.3)';
  } else if (normalized === 'vendor') {
    bg = 'rgba(217, 119, 6, 0.12)';
    color = '#f59e0b';
    border = 'rgba(217, 119, 6, 0.3)';
  } else if (normalized === 'application' || normalized === 'endpoint') {
    bg = 'rgba(249, 115, 22, 0.12)';
    color = '#fb923c';
    border = 'rgba(249, 115, 22, 0.3)';
  } else if (normalized === 'workstation') {
    bg = 'rgba(99, 102, 241, 0.12)';
    color = '#818cf8';
    border = 'rgba(99, 102, 241, 0.3)';
  }

  const isDropdown = !cellProperties.readOnly && (cellProperties.type === 'dropdown' || Boolean(cellProperties.source));
  return createBadgeCell(td, displayLabel, bg, color, border, isDropdown);
}

/**
 * Custom renderer for Environment column with colored status pill badge
 */
function environmentRenderer(instance, td, row, col, prop, value, cellProperties) {
  if (value === null || value === undefined || value === '' || value === '-') {
    td.innerText = '\u2014';
    td.style.verticalAlign = 'middle';
    td.style.padding = '0 8px';
    td.style.color = 'var(--muted-foreground)';
    return td;
  }
  const raw = String(value).toLowerCase().trim();
  let bg = 'rgba(100, 116, 139, 0.15)';
  let color = '#94a3b8';
  let border = 'rgba(100, 116, 139, 0.3)';
  let label = String(value);

  if (raw === 'production' || raw === 'prod') {
    bg = 'rgba(34, 197, 94, 0.12)';
    color = '#4ade80';
    border = 'rgba(34, 197, 94, 0.3)';
    label = 'Production';
  } else if (raw === 'staging' || raw === 'stage') {
    bg = 'rgba(245, 158, 11, 0.12)';
    color = '#fbbf24';
    border = 'rgba(245, 158, 11, 0.3)';
    label = 'Staging';
  } else if (raw === 'testing' || raw === 'test' || raw === 'qa') {
    bg = 'rgba(59, 130, 246, 0.12)';
    color = '#60a5fa';
    border = 'rgba(59, 130, 246, 0.3)';
    label = 'Testing';
  } else if (raw === 'development' || raw === 'dev') {
    bg = 'rgba(244, 63, 94, 0.12)';
    color = '#fb7185';
    border = 'rgba(244, 63, 94, 0.3)';
    label = 'Development';
  } else if (raw === 'demo') {
    bg = 'rgba(168, 85, 247, 0.12)';
    color = '#c084fc';
    border = 'rgba(168, 85, 247, 0.3)';
    label = 'Demo';
  } else {
    label = raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  const isDropdown = !cellProperties.readOnly && (cellProperties.type === 'dropdown' || Boolean(cellProperties.source));
  return createBadgeCell(td, label, bg, color, border, isDropdown);
}

/**
 * Custom renderer for Is Internal (boolean) column with True / False pill badge
 */
function internalRenderer(instance, td, row, col, prop, value, cellProperties) {
  if (value === null || value === undefined || value === '') {
    td.innerText = '\u2014';
    td.style.verticalAlign = 'middle';
    td.style.padding = '0 8px';
    td.style.color = 'var(--muted-foreground)';
    return td;
  }
  const isInternal = value === true || String(value).toLowerCase() === 'true' || String(value).toLowerCase() === 'internal';
  const bg = isInternal ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)';
  const color = isInternal ? '#4ade80' : '#f87171';
  const border = isInternal ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
  const label = isInternal ? 'True' : 'False';

  const isDropdown = !cellProperties.readOnly && (cellProperties.type === 'dropdown' || Boolean(cellProperties.source));
  return createBadgeCell(td, label, bg, color, border, isDropdown);
}

/**
 * Custom renderer for Exposure column (Exposed vs Safe) with pill badge
 */
function exposureRenderer(instance, td, row, col, prop, value, cellProperties) {
  const isExposed = value === true || value === 'true' || value === 'Exposed';
  const bg = isExposed ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)';
  const color = isExposed ? '#f87171' : '#4ade80';
  const border = isExposed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)';
  const label = isExposed ? 'Exposed' : 'Safe';

  const isDropdown = !cellProperties.readOnly && (cellProperties.type === 'dropdown' || Boolean(cellProperties.source));
  return createBadgeCell(td, label, bg, color, border, isDropdown);
}

/**
 * Custom renderer for Asset Value cell using standard default font
 */
function valueRenderer(instance, td, row, col, prop, value, cellProperties) {
  td.style.verticalAlign = 'middle';
  td.style.padding = '2px 8px';
  td.style.fontSize = '12px';
  td.style.lineHeight = '20px';
  td.style.whiteSpace = 'nowrap';
  td.style.overflow = 'hidden';
  td.style.textOverflow = 'ellipsis';

  const text = String(value ?? '');
  td.innerText = text;
  td.title = text;
  return td;
}

/**
 * Custom renderer for Asset Name / Editable text cell
 */
function nameRenderer(instance, td, row, col, prop, value, cellProperties) {
  td.style.verticalAlign = 'middle';
  td.style.padding = '2px 8px';
  td.style.fontSize = '12px';
  td.style.lineHeight = '20px';
  td.style.whiteSpace = 'nowrap';
  td.style.overflow = 'hidden';
  td.style.textOverflow = 'ellipsis';
  const text = String(value ?? '');
  td.innerText = text;
  td.title = text;
  return td;
}

/**
 * Universal fallback renderer — handles objects, arrays, booleans, and primitives
 */
function genericRenderer(instance, td, row, col, prop, value, cellProperties) {
  td.innerHTML = '';
  td.style.verticalAlign = 'middle';
  td.style.padding = '2px 8px';
  td.style.fontSize = '12px';
  td.style.lineHeight = '20px';
  td.style.whiteSpace = 'nowrap';
  td.style.overflow = 'hidden';
  td.style.textOverflow = 'ellipsis';

  // Null / undefined / empty
  if (value === null || value === undefined || value === '') {
    td.innerText = '\u2014';
    td.style.color = 'var(--muted-foreground)';
    return td;
  }

  // Array — extract text from each item
  if (Array.isArray(value)) {
    if (value.length === 0) {
      td.innerText = '\u2014';
      td.style.color = 'var(--muted-foreground)';
      return td;
    }
    const texts = value
      .map((item) => {
        if (item === null || item === undefined) return '';
        if (typeof item === 'object') {
          return (
            item.title ||
            item.name ||
            item.label ||
            item.value ||
            item.type ||
            item.id ||
            Object.values(item)
              .filter((v) => typeof v !== 'object')
              .join(' ')
          );
        }
        return String(item);
      })
      .filter(Boolean);
    const display = texts.join(', ');
    td.innerText = display || '\u2014';
    td.title = display;
    return td;
  }

  // Plain object — extract meaningful fields
  if (typeof value === 'object') {
    const text =
      value.title ||
      value.name ||
      value.label ||
      value.value ||
      value.type ||
      value.id ||
      Object.entries(value)
        .filter(([, v]) => typeof v !== 'object')
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    td.innerText = text || '\u2014';
    td.title = text;
    return td;
  }

  // Boolean
  if (typeof value === 'boolean') {
    td.innerText = value ? 'Yes' : 'No';
    return td;
  }

  // Primitive (string / number)
  const text = String(value);
  td.innerText = text;
  td.title = text;
  return td;
}

/**
 * Safely extracts schema properties array from schemaData response
 */
export function getSchemaProperties(schemaData) {
  if (!schemaData) return [];
  if (Array.isArray(schemaData)) return schemaData;
  if (Array.isArray(schemaData.data)) return schemaData.data;
  if (Array.isArray(schemaData.properties)) return schemaData.properties;
  if (Array.isArray(schemaData.data?.properties)) return schemaData.data.properties;
  return [];
}

/**
 * Safely sets nested object property value, un-freezing nested objects from Redux/RTK Query
 */
function setNestedValue(obj, path, value) {
  if (!obj || !path) return;
  const parts = path.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!curr[part] || typeof curr[part] !== 'object') {
      curr[part] = {};
    } else {
      curr[part] = { ...curr[part] };
    }
    curr = curr[part];
  }
  curr[parts[parts.length - 1]] = value;
}

export function EditAssetTable({
  data = [],
  schemaData = null,
  selectedType = '',
  onCellUpdate,
  isLoading = false,
  isFetching = false,
  visibleColumnKeys = [],
  onAvailableColumnsChange,
  currentPage = 1,
  pageSize = 50,
  businessUnitsList = [],
  departmentsList = [],
  teamsList = [],
  membersList = [],
  isAuditor: isAuditorProp,
}) {
  const { user } = useAuth();
  const isAuditor = isAuditorProp ?? (user?.role === 'Auditor');
  const hotRef = useRef(null);

  // Map business unit IDs to names and extract option names
  const { buIdToNameMap, businessUnitOptions } = useMemo(() => {
    const idToName = new Map();
    const options = [];

    (businessUnitsList || []).forEach((bu) => {
      const id = bu._id || bu.businessUnitId || bu.id;
      const name = bu.name || id;
      if (id) {
        idToName.set(String(id), String(name));
        if (bu.name && !options.includes(String(bu.name))) {
          options.push(String(bu.name));
        }
      }
    });

    return {
      buIdToNameMap: idToName,
      businessUnitOptions: options,
    };
  }, [businessUnitsList]);

  // Map Department IDs
  const { deptIdToNameMap, departmentOptions } = useMemo(() => {
    const idToName = new Map();
    const options = [];
    (departmentsList || []).forEach((dept) => {
      const id = dept._id || dept.id;
      const name = dept.name || id;
      if (id) {
        idToName.set(String(id), String(name));
        if (dept.name && !options.includes(String(dept.name))) {
          options.push(String(dept.name));
        }
      }
    });
    return { deptIdToNameMap: idToName, departmentOptions: options };
  }, [departmentsList]);

  // Map Team IDs
  const { teamIdToNameMap, teamOptions } = useMemo(() => {
    const idToName = new Map();
    const options = [];
    (teamsList || []).forEach((team) => {
      const id = team._id || team.id;
      const name = team.name || id;
      if (id) {
        idToName.set(String(id), String(name));
        if (team.name && !options.includes(String(team.name))) {
          options.push(String(team.name));
        }
      }
    });
    return { teamIdToNameMap: idToName, teamOptions: options };
  }, [teamsList]);

  // Map Member IDs
  const { memberIdToNameMap, memberOptions } = useMemo(() => {
    const idToName = new Map();
    const options = [];
    (membersList || []).forEach((user) => {
      const id = user._id || user.id;
      const name = user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null) || user.email || id;
      if (id) {
        idToName.set(String(id), String(name));
        if (name && !options.includes(String(name))) {
          options.push(String(name));
        }
      }
    });
    return { memberIdToNameMap: idToName, memberOptions: options };
  }, [membersList]);

  // Dynamic row headers based on current page offset (1, 2, 3...)
  const rowHeaders = useMemo(() => {
    return (index) => {
      const base = ((currentPage || 1) - 1) * (pageSize || 50);
      return String(base + index + 1);
    };
  }, [currentPage, pageSize]);

  // Map array data to internal Handsontable row model
  const tableData = useMemo(() => {
    const schemaProps = getSchemaProperties(schemaData);

    // Keys that need their raw object/value preserved for nested path resolution
    const RAW_KEYS = new Set([
      'id',
      '_id',
      'type',
      'assetType',
      'value',
      'assetValue',
      'exposure',
      'owner',
      'risk',
      'subdomain',
    ]);

    /** Converts an unknown value to a clean readable string */
    function toReadable(val) {
      if (val === null || val === undefined) return '';
      if (Array.isArray(val)) {
        return val
          .map((item) => {
            if (item === null || item === undefined) return '';
            if (typeof item === 'object') {
              return (
                item.title ||
                item.name ||
                item.label ||
                item.value ||
                item.type ||
                item.id ||
                Object.values(item)
                  .filter((v) => typeof v !== 'object' && v !== null && v !== undefined)
                  .join(' ')
              );
            }
            return String(item);
          })
          .filter(Boolean)
          .join(', ');
      }
      if (typeof val === 'object') {
        return (
          val.title ||
          val.name ||
          val.label ||
          val.value ||
          val.type ||
          val.id ||
          Object.entries(val)
            .filter(([, v]) => typeof v !== 'object' && v !== null && v !== undefined)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')
        );
      }
      if (typeof val === 'boolean') return val ? 'true' : 'false';
      return val;
    }

    return data.map((item) => {
      const rowObj = { ...item };
      rowObj.id = item._id || item.id;
      rowObj.value = item.value || item.assetValue || item.domain || item.ip || item.url || '-';
      rowObj.type = item.type || item.assetType || '-';
      rowObj.name = item.name || '';
      rowObj.exposure = item.risk?.exposure ?? item.exposure ?? item.status ?? false;
      rowObj.environment = toReadable(item.environment || item.env || '-');

      const rawCreated = item.createdAt || item.created_at || item.detectedOn || item.firstSeen;
      let formattedCreated = '-';
      if (rawCreated) {
        try {
          const d = new Date(rawCreated);
          formattedCreated = isNaN(d.getTime()) ? String(rawCreated) : d.toLocaleDateString();
        } catch (e) {
          formattedCreated = String(rawCreated);
        }
      }
      rowObj.createdAt = formattedCreated;

      // Extract business units directly from asset item model as well
      const rawBu = item.businessUnitIds || item.businessUnits || item.businessUnit;
      let initialBu = [];
      if (Array.isArray(rawBu)) {
        initialBu = rawBu
          .map((v) => {
            if (typeof v === 'object' && v !== null) return v.name || v.title || v._id || '';
            return buIdToNameMap.get(String(v)) || String(v);
          })
          .filter(Boolean);
      } else if (typeof rawBu === 'object' && rawBu !== null) {
        const name = rawBu.name || rawBu.title || rawBu._id || '';
        initialBu = name ? [name] : [];
      } else if (rawBu && rawBu !== '-') {
        const str = String(rawBu);
        const parts = str.includes(',') ? str.split(',').map((s) => s.trim()).filter(Boolean) : [str];
        initialBu = parts.map((p) => buIdToNameMap.get(p) || p);
      }
      rowObj.businessUnitIds = initialBu;
      rowObj.businessUnits = initialBu;

      // Extract values for nested schema keys and format cleanly
      schemaProps.forEach((prop) => {
        if (prop.key) {
          const val = getNestedValue(item, prop.key);
          if (val !== undefined && !RAW_KEYS.has(prop.key)) {
            let formattedVal;
            const isBuKey =
              prop.key === 'businessUnitIds' ||
              prop.key === 'businessUnits' ||
              prop.key.toLowerCase().includes('businessunit');
            const isDeptKey = prop.key === 'ownerDepartmentId' || prop.key === 'ownerDepartmentIds' || prop.key.toLowerCase().includes('departmentid');
            const isTeamKey = prop.key === 'ownerTeamId' || prop.key === 'ownerTeamIds' || prop.key.toLowerCase().includes('teamid');
            const isUserKey = prop.key === 'ownerUserId' || prop.key === 'ownerUserIds' || prop.key.toLowerCase().includes('userid') || prop.key.toLowerCase().includes('ownerid');

            if (isBuKey || isDeptKey || isTeamKey || isUserKey) {
              const mapToUse = isBuKey ? buIdToNameMap : isDeptKey ? deptIdToNameMap : isTeamKey ? teamIdToNameMap : memberIdToNameMap;

              if (isBuKey) {
                if (Array.isArray(val)) {
                  formattedVal = val
                    .map((v) => {
                      if (typeof v === 'object' && v !== null) {
                        return v.name || v.title || v._id || '';
                      }
                      return mapToUse.get(String(v)) || String(v);
                    })
                    .filter(Boolean);
                } else if (typeof val === 'object' && val !== null) {
                  const name = val.name || val.title || val._id || '';
                  formattedVal = name ? [name] : [];
                } else if (val && val !== '-') {
                  const str = String(val);
                  const parts = str.includes(',')
                    ? str.split(',').map((s) => s.trim()).filter(Boolean)
                    : [str];
                  formattedVal = parts.map((p) => mapToUse.get(p) || p);
                } else {
                  formattedVal = [];
                }
              } else {
                // For single-select dropdowns (Dept, Team, User), output a string
                if (Array.isArray(val)) {
                  const firstVal = val[0];
                  if (typeof firstVal === 'object' && firstVal !== null) {
                    formattedVal = firstVal.name || firstVal.title || firstVal._id || '';
                  } else {
                    formattedVal = firstVal ? (mapToUse.get(String(firstVal)) || String(firstVal)) : '';
                  }
                } else if (typeof val === 'object' && val !== null) {
                  formattedVal = val.name || val.title || val._id || '';
                } else if (val && val !== '-') {
                  const str = String(val);
                  const parts = str.includes(',')
                    ? str.split(',').map((s) => s.trim()).filter(Boolean)
                    : [str];
                  const firstVal = parts[0];
                  formattedVal = firstVal ? (mapToUse.get(firstVal) || firstVal) : '';
                } else {
                  formattedVal = '';
                }
              }
            } else if (prop.type === 'array' || prop.type === 'multiselect' || prop.type === 'multi-select') {
              if (Array.isArray(val)) {
                formattedVal = val.map(String);
              } else if (typeof val === 'string' && val.includes(',')) {
                formattedVal = val.split(',').map((s) => s.trim()).filter(Boolean);
              } else if (val !== null && val !== undefined && val !== '') {
                formattedVal = [String(val)];
              } else {
                formattedVal = [];
              }
            } else if (prop.type === 'enum' || (prop.options && prop.options.length > 0)) {
              formattedVal = val !== null && val !== undefined ? String(val) : '';
            } else if (typeof val === 'boolean') {
              formattedVal = val ? 'true' : 'false';
            } else {
              formattedVal = toReadable(val);
            }
            rowObj[prop.key] = formattedVal;
            setNestedValue(rowObj, prop.key, formattedVal);
          }
        }
      });

      return rowObj;
    });
  }, [data, schemaData, buIdToNameMap, deptIdToNameMap, teamIdToNameMap, memberIdToNameMap]);

  // All available candidate columns dynamically generated 100% from schema response payload
  const allCandidateColumns = useMemo(() => {
    const schemaProps = getSchemaProperties(schemaData);

    if (!Array.isArray(schemaProps) || schemaProps.length === 0) {
      return [];
    }

    const processedKeys = new Set();
    const finalColumns = [];

    // Dynamic schema columns built directly from backend schema response payload
    schemaProps.forEach((prop) => {
      const key = prop.key;
      if (!key || processedKeys.has(key)) return;

      const label = prop.label || key;
      const isEditable = !isAuditor && Boolean(prop.editable);
      const propType = prop.type;
      const options = prop.options || [];

      const colConfig = {
        data: key,
        title: isEditable ? `${label}` : label,
        readOnly: isAuditor ? true : !isEditable,
        width: 220,
        headerClassName: 'htLeft',
      };

      if (isAuditor) {
        colConfig.readOnly = true;
        colConfig.editor = false;
      }

      const keyLower = key.toLowerCase();
      const isBuKey =
        key === 'businessUnitIds' ||
        key === 'businessUnits' ||
        keyLower.includes('businessunit');
      const isDeptKey = key === 'ownerDepartmentId' || key === 'ownerDepartmentIds' || keyLower.includes('departmentid');
      const isTeamKey = key === 'ownerTeamId' || key === 'ownerTeamIds' || keyLower.includes('teamid');
      const isUserKey = key === 'ownerUserId' || key === 'ownerUserIds' || keyLower.includes('userid') || keyLower.includes('ownerid');

      if (isBuKey) {
        colConfig.type = isAuditor ? 'text' : 'multiSelect';
        colConfig.source = isAuditor ? [] : businessUnitOptions;
        colConfig.placeholder = isAuditor ? '' : 'Select business units';
        colConfig.width = 250;
        colConfig.readOnly = isAuditor ? true : false;
        if (isAuditor) colConfig.editor = false;
      } else if (isDeptKey) {
        colConfig.type = isAuditor ? 'text' : 'dropdown';
        colConfig.source = isAuditor ? [] : departmentOptions;
        colConfig.placeholder = isAuditor ? '' : 'Select department';
        colConfig.width = 200;
        colConfig.readOnly = isAuditor ? true : false;
        if (isAuditor) colConfig.editor = false;
      } else if (isTeamKey) {
        colConfig.type = isAuditor ? 'text' : 'dropdown';
        colConfig.source = isAuditor ? [] : teamOptions;
        colConfig.placeholder = isAuditor ? '' : 'Select team';
        colConfig.width = 200;
        colConfig.readOnly = isAuditor ? true : false;
        if (isAuditor) colConfig.editor = false;
      } else if (isUserKey) {
        colConfig.type = isAuditor ? 'text' : 'dropdown';
        colConfig.source = isAuditor ? [] : memberOptions;
        colConfig.placeholder = isAuditor ? '' : 'Select user';
        colConfig.width = 200;
        colConfig.readOnly = isAuditor ? true : false;
        if (isAuditor) colConfig.editor = false;
      } else if (keyLower === 'type' || keyLower === 'assettype') {
        colConfig.type = isAuditor || !isEditable ? 'text' : 'dropdown';
        colConfig.source =
          isAuditor || !isEditable
            ? []
            : options.length > 0
              ? options.map(String)
              : [
                'subdomain',
                'ip',
                'web_server',
                'server',
                'port',
                'service',
                'certificate',
                'technology',
                'dns',
                'repository',
                'registry',
                'object_storage',
                'api',
                'employee',
                'vendor',
                'application',
                'endpoint',
                'workstation',
              ];
        colConfig.width = 175;
        colConfig.renderer = typeRenderer;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else if (keyLower === 'environment' || keyLower === 'env') {
        colConfig.type = isAuditor || !isEditable ? 'text' : 'dropdown';
        colConfig.source = isAuditor || !isEditable ? [] : options.length > 0 ? options.map(String) : ['production', 'staging', 'testing', 'development', 'demo', 'unknown'];
        colConfig.width = 160;
        colConfig.renderer = environmentRenderer;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else if (keyLower === 'is_internal' || keyLower === 'isinternal' || keyLower.includes('internal')) {
        colConfig.type = isAuditor || !isEditable ? 'text' : 'dropdown';
        colConfig.source = isAuditor || !isEditable ? [] : ['true', 'false'];
        colConfig.width = 140;
        colConfig.renderer = internalRenderer;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else if (keyLower === 'exposure' || keyLower.includes('exposure')) {
        colConfig.type = isAuditor || !isEditable ? 'text' : 'dropdown';
        colConfig.source = isAuditor || !isEditable ? [] : ['Exposed', 'Safe'];
        colConfig.width = 130;
        colConfig.renderer = exposureRenderer;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else if (propType === 'boolean') {
        colConfig.type = isAuditor || !isEditable ? 'text' : 'dropdown';
        colConfig.source = isAuditor || !isEditable ? [] : ['true', 'false'];
        colConfig.width = 140;
        colConfig.renderer = internalRenderer;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else if (propType === 'array' || propType === 'multiselect' || propType === 'multi-select') {
        colConfig.type = isAuditor || !isEditable ? 'text' : 'multiSelect';
        colConfig.source = isAuditor || !isEditable ? [] : options.length > 0 ? options.map(String) : [];
        colConfig.placeholder = isAuditor || !isEditable ? '' : 'Select options';
        colConfig.width = 220;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else if (propType === 'enum' || options.length > 0) {
        colConfig.type = isAuditor || !isEditable ? 'text' : 'dropdown';
        colConfig.source = isAuditor || !isEditable ? [] : options.map(String);
        colConfig.width = 180;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else if (propType === 'number') {
        colConfig.type = 'numeric';
        colConfig.width = 150;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else if (propType === 'date') {
        colConfig.type = 'date';
        colConfig.dateFormat = 'YYYY-MM-DD';
        colConfig.width = 160;
        if (isAuditor || !isEditable) colConfig.editor = false;
      } else {
        colConfig.type = 'text';
        colConfig.width = 220;
        if (isEditable) {
          colConfig.renderer = nameRenderer;
        } else {
          colConfig.editor = false;
        }
      }

      finalColumns.push(colConfig);
      processedKeys.add(key);
    });

    return finalColumns;
  }, [schemaData, businessUnitOptions, departmentOptions, teamOptions, memberOptions, isAuditor]);

  // Inform parent of available column metadata whenever candidate columns change
  useEffect(() => {
    if (onAvailableColumnsChange) {
      const colsList = allCandidateColumns.map((col) => ({
        key: col.data,
        title: col.title,
      }));
      onAvailableColumnsChange(colsList);
    }
  }, [allCandidateColumns, onAvailableColumnsChange]);

  // Filter visible columns based on visibleColumnKeys selection
  const columns = useMemo(() => {
    if (!visibleColumnKeys || visibleColumnKeys.length === 0) {
      return allCandidateColumns;
    }
    const filtered = allCandidateColumns.filter((col) =>
      visibleColumnKeys.includes(col.data)
    );
    return filtered.length > 0 ? filtered : allCandidateColumns;
  }, [allCandidateColumns, visibleColumnKeys]);

  // Intercept inline cell edits and delegate to RTK mutation
  const handleAfterChange = (changes, source) => {
    if (isAuditor || source === 'loadData' || !changes) {
      return;
    }

    changes.forEach(([row, prop, oldValue, newValue]) => {
      const isSame =
        Array.isArray(oldValue) && Array.isArray(newValue)
          ? oldValue.length === newValue.length &&
          oldValue.every((v, i) => v === newValue[i])
          : oldValue === newValue;

      if (isSame) return;

      const rowData = tableData[row];
      if (!rowData || !rowData.id) return;

      onCellUpdate(rowData.id, prop, newValue);
    });
  };

  // Render skeleton loader grid matching standard table design when loading or fetching
  if (isLoading || isFetching) {
    return (
      <div className="w-full bg-card overflow-hidden">
        {/* Table Header Skeleton — matches actual column header height */}
        <div className="flex border-b border-border bg-muted/20 h-[28px] px-3 gap-4 items-center w-full">
          <Skeleton className="h-3 w-8 shrink-0" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 flex-1" />
        </div>
        {/* Table Rows Skeleton — 20 rows, each exactly 28px to match rowHeights={28} */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex border-b border-border/40 h-[28px] px-3 gap-4 items-center w-full last:border-b-0"
          >
            <Skeleton className="h-3 w-8 shrink-0 rounded" style={{ opacity: 1 - i * 0.03 }} />
            <div className="flex-1"><Skeleton className="h-3 rounded" style={{ width: `${60 + (i % 5) * 8}%`, opacity: 1 - i * 0.03 }} /></div>
            <div className="flex-1"><Skeleton className="h-3 rounded" style={{ width: `${50 + (i % 4) * 10}%`, opacity: 1 - i * 0.03 }} /></div>
            <div className="flex-1"><Skeleton className="h-3 rounded-full" style={{ width: '60%', opacity: 1 - i * 0.03 }} /></div>
            <div className="flex-1"><Skeleton className="h-3 rounded" style={{ width: `${70 + (i % 3) * 5}%`, opacity: 1 - i * 0.03 }} /></div>
            <div className="flex-1"><Skeleton className="h-3 rounded" style={{ width: `${55 + (i % 4) * 12}%`, opacity: 1 - i * 0.03 }} /></div>
            <div className="flex-1"><Skeleton className="h-3 rounded" style={{ width: `${65 + (i % 5) * 6}%`, opacity: 1 - i * 0.03 }} /></div>
            <div className="flex-1"><Skeleton className="h-3 rounded" style={{ width: `${45 + (i % 3) * 15}%`, opacity: 1 - i * 0.03 }} /></div>
            <div className="flex-1"><Skeleton className="h-3 rounded" style={{ width: `${80 + (i % 4) * 5}%`, opacity: 1 - i * 0.03 }} /></div>
          </div>
        ))}
      </div>
    );
  }

  // Render "No data available" text when filtering or searching returns zero results
  if (!isLoading && !isFetching && data.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-center text-sm text-muted-foreground border-b border-border bg-card w-full">
        No data available
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden border-b border-border">
      <style>{`
        .htCustomContainer .handsontable,
        .htCustomContainer .handsontable table,
        .htCustomContainer .handsontable th,
        .htCustomContainer .handsontable td,
        .htCustomContainer .handsontable .htCore,
        .htCustomContainer .handsontable .wtBorder,
        .htCustomContainer .handsontable .wtHolder {
          border-color: var(--border) !important;
          background-color: var(--card) !important;
        }

        .htCustomContainer .handsontable .ht_clone_top,
        .htCustomContainer .handsontable .ht_clone_left,
        .htCustomContainer .handsontable .ht_clone_top_left_corner {
          z-index: 10 !important;
          box-shadow: none !important;
        }

        .htCustomContainer .handsontable th,
        .htCustomContainer .handsontable .ht_clone_top th,
        .htCustomContainer .handsontable .ht_clone_left th,
        .htCustomContainer .handsontable .ht_clone_top_left_corner th {
          background-color: var(--card) !important;
          background: var(--card) !important;
        }

        .htCustomContainer .handsontable thead th,
        .htCustomContainer .handsontable thead th .relative,
        .htCustomContainer .handsontable thead th .colHeader,
        .htCustomContainer .handsontable thead th div,
        .htCustomContainer .handsontable thead th span {
          text-align: left !important;
          justify-content: flex-start !important;
          align-items: center !important;
        }

        /* Unified strict row and cell heights across Handsontable tables */
        .htCustomContainer .handsontable table {
          border-collapse: separate !important;
          border-spacing: 0 !important;
        }

        .htCustomContainer .handsontable tr,
        .htCustomContainer .handsontable tbody tr,
        .htCustomContainer .handsontable .ht_clone_left tbody tr,
        .htCustomContainer .handsontable .ht_clone_top thead tr,
        .htCustomContainer .handsontable .ht_clone_top_left_corner thead tr {
          box-sizing: border-box !important;
          height: 28px !important;
          min-height: 28px !important;
          max-height: 28px !important;
        }

        .htCustomContainer .handsontable thead th span {
          text-align: left !important;
          justify-content: flex-start !important;
          align-items: center !important;
        }

        .htCustomContainer .handsontable thead th,
        .htCustomContainer .handsontable .ht_clone_top thead tr th,
        .htCustomContainer .handsontable .ht_clone_top_left_corner thead tr th {
          background-color: var(--card) !important;
          background: var(--card) !important;
          color: var(--muted-foreground) !important;
          font-weight: 600 !important;
          font-size: 0.75rem !important;
          text-transform: capitalize !important;
          border-top: none !important;
          border-left: none !important;
          border-bottom: 1px solid var(--border) !important;
          border-right: 1px solid var(--border) !important;
          box-sizing: border-box !important;
          height: 28px !important;
          min-height: 28px !important;
          max-height: 28px !important;
          line-height: 27px !important;
          padding: 0 8px !important;
          vertical-align: middle !important;
          white-space: nowrap !important;
        }

        /* Row header (1, 2, 3...) cell - strictly identical 28px height matching td */
        .htCustomContainer .handsontable tbody th,
        .htCustomContainer .handsontable th.htRowHeader,
        .htCustomContainer .handsontable .ht_clone_left th,
        .htCustomContainer .handsontable .ht_clone_left tbody th {
          background-color: var(--card) !important;
          background: var(--card) !important;
          color: var(--muted-foreground) !important;
          text-align: center !important;
          vertical-align: middle !important;
          font-weight: 500 !important;
          font-size: 0.75rem !important;
          box-sizing: border-box !important;
          height: 28px !important;
          min-height: 28px !important;
          max-height: 28px !important;
          line-height: 27px !important;
          padding: 0 !important;
          user-select: none !important;
          border-top: none !important;
          border-left: none !important;
          border-bottom: 1px solid var(--border) !important;
          border-right: 1px solid var(--border) !important;
          box-shadow: none !important;
        }

        /* Inner text wrappers - NO borders, NO outlines, pure clean text */
        .htCustomContainer .handsontable tbody th *,
        .htCustomContainer .handsontable .ht_clone_left th *,
        .htCustomContainer .handsontable .rowHeader,
        .htCustomContainer .handsontable tbody th div,
        .htCustomContainer .handsontable tbody th span,
        .htCustomContainer .handsontable .ht_clone_left th div,
        .htCustomContainer .handsontable .ht_clone_left th span,
        .htCustomContainer .handsontable tbody th .relative,
        .htCustomContainer .handsontable .ht_clone_left th .relative {
          border: none !important;
          border-top: none !important;
          border-bottom: none !important;
          border-left: none !important;
          border-right: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
          background-color: transparent !important;
        }

        /* Corner header (top-left intersection above 1) */
        .htCustomContainer .handsontable .ht_clone_top_left_corner th,
        .htCustomContainer .handsontable thead tr th:first-child {
          background-color: var(--card) !important;
          background: var(--card) !important;
          border-top: none !important;
          border-left: none !important;
          border-bottom: 1px solid var(--border) !important;
          border-right: 1px solid var(--border) !important;
          box-shadow: none !important;
          box-sizing: border-box !important;
          height: 28px !important;
          min-height: 28px !important;
          max-height: 28px !important;
        }

        .htCustomContainer .handsontable tbody tr:hover th,
        .htCustomContainer .handsontable .ht_clone_left tbody tr:hover th {
          background-color: var(--accent) !important;
          background: var(--accent) !important;
        }

        /* Data cells - strictly 28px matching left row numbers */
        .htCustomContainer .handsontable td {
          background-color: var(--card) !important;
          color: var(--foreground) !important;
          border-bottom: 1px solid var(--border) !important;
          border-right: 1px solid var(--border) !important;
          box-sizing: border-box !important;
          height: 28px !important;
          min-height: 28px !important;
          max-height: 28px !important;
          line-height: 27px !important;
          padding: 0 8px !important;
          font-size: 0.75rem !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          vertical-align: middle !important;
        }
        .htCustomContainer .handsontable:not(.ht_clone_left) thead tr th:last-child,
        .htCustomContainer .handsontable:not(.ht_clone_left) tbody tr td:last-child {
          border-right: none !important;
        }
        .htCustomContainer .handsontable .ht_clone_left tbody th,
        .htCustomContainer .handsontable .ht_clone_top_left_corner th {
          border-right: 1px solid var(--border) !important;
        }
        .htCustomContainer .handsontable tr:last-child td {
          border-bottom: none !important;
        }
        .htCustomContainer .handsontable tr:hover td {
          background-color: var(--accent) !important;
        }
        .htCustomContainer .handsontable .currentHeader {
          background-color: var(--accent) !important;
        }

        /* Cell editor — grayish to match dark theme instead of white */
        .htCustomContainer .handsontableInput,
        .htCustomContainer .handsontableInputHolder textarea {
          background: var(--muted) !important;
          color: var(--foreground) !important;
          border: 1.5px solid var(--primary) !important;
          border-radius: 3px !important;
          caret-color: var(--primary) !important;
          padding: 2px 6px !important;
          font-size: 12px !important;
          line-height: 20px !important;
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 20%, transparent) !important;
        }

        /* Dim placeholder text (like "Select department", "Select user") */
        .htCustomContainer .handsontable td.htPlaceholder {
          color: var(--muted-foreground) !important;
        }

        /* No vertical (right-side) scrollbar — width: 0 hides it completely */
        .htCustomContainer .wtHolder::-webkit-scrollbar {
          height: 7px;
          width: 0px;
        }
        .htCustomContainer .wtHolder::-webkit-scrollbar-corner {
          background: transparent;
        }
        .htCustomContainer .wtHolder::-webkit-scrollbar-track {
          background: transparent;
        }
        /* Dim by default, full-color on hover */
        .htCustomContainer .wtHolder::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--muted-foreground) 25%, transparent);
          border-radius: 999px;
          transition: background 0.25s ease;
        }
        .htCustomContainer:hover .wtHolder::-webkit-scrollbar-thumb {
          background: var(--muted-foreground);
        }
        /* Firefox */
        .htCustomContainer .wtHolder {
          scrollbar-width: thin;
          scrollbar-color: color-mix(in srgb, var(--muted-foreground) 25%, transparent) transparent;
        }
        .htCustomContainer:hover .wtHolder {
          scrollbar-color: var(--muted-foreground) transparent;
        }

        /* Context Menu Theme Styling */
        .htContextMenu,
        .htContextMenu .htCustomMenu,
        .htContextMenu table.htCore,
        .htContextMenu table.htCore tbody,
        .htContextMenu table.htCore tr,
        .htContextMenu table.htCore td {
          background-color: var(--popover) !important;
          background: var(--popover) !important;
          color: var(--popover-foreground) !important;
        }

        .htContextMenu table.htCore {
          border: 1px solid var(--border) !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
          overflow: hidden !important;
        }

        .htContextMenu table.htCore td {
          padding: 6px 14px !important;
          font-size: 0.8125rem !important;
          border: none !important;
        }

        .htContextMenu table.htCore tr td.htDisabled,
        .htContextMenu table.htCore tr td.htDisabled:hover,
        .htContextMenu table.htCore tbody tr td.htDisabled,
        .htContextMenu table.htCore td.htDisabled div,
        .htContextMenu table.htCore td.htDisabled div.htItemWrapper {
          background-color: transparent !important;
          background: transparent !important;
          color: var(--muted-foreground) !important;
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

        .htContextMenu table.htCore td:hover:not(.htDisabled),
        .htContextMenu table.htCore td.current:not(.htDisabled) {
          background-color: var(--accent) !important;
          background: var(--accent) !important;
          color: var(--accent-foreground) !important;
        }

        .htContextMenu table.htCore td.htSeparator {
          border-top: 1px solid var(--border) !important;
          padding: 0 !important;
          background-color: transparent !important;
          background: transparent !important;
        }

        /* MultiSelect Cell & Editor Styling */
        .htMultiSelectCell {
          font-size: 11.5px;
          user-select: none;
        }

        .htMultiSelectChip {
          transition: all 0.15s ease;
        }

        .htMultiSelectChip:hover {
          border-color: rgba(59, 130, 246, 0.5) !important;
          background: rgba(59, 130, 246, 0.18) !important;
        }

        .htMultiSelectChipRemove:hover {
          color: #ef4444 !important;
          opacity: 1 !important;
        }

        .htMultiSelectEditor {
          animation: htFadeSlideDown 0.15s ease-out;
        }

        @keyframes htFadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="htCustomContainer w-full">
        <HotTable
          ref={hotRef}
          data={tableData}
          columns={columns}
          colHeaders={true}
          rowHeaders={rowHeaders}
          rowHeaderWidth={42}
          columnHeaderHeight={28}
          rowHeights={28}
          autoRowSize={false}
          autoColumnSize={false}
          contextMenu={!isAuditor}
          cells={() => (isAuditor ? { readOnly: true } : {})}
          height="auto"
          width="100%"
          stretchH="last"
          autoWrapRow={false}
          autoWrapCol={false}
          manualColumnResize={true}
          manualRowResize={false}
          wordWrap={false}
          afterChange={handleAfterChange}
          afterOnCellMouseDown={(event, coords) => {
            if (isAuditor || coords.row < 0 || coords.col < 0) return;
            const colDef = columns[coords.col];
            if (colDef?.readOnly) return;
            if (
              colDef &&
              (colDef.type === 'multiSelect' || colDef.type === 'multiselect')
            ) {
              if (!event.target.closest('.htMultiSelectChipRemove')) {
                const hot = hotRef.current?.hotInstance;
                const editor = hot?.getActiveEditor();
                if (editor && typeof editor.open === 'function') {
                  setTimeout(() => {
                    if (editor.isOpened && !editor.isOpened()) {
                      editor.open();
                    }
                  }, 40);
                }
              }
            }
          }}
          licenseKey="non-commercial-and-evaluation"
          className="text-xs w-full"
          outsideClickDeselects={(target) => !target?.closest?.('.htMultiSelectEditor')}
        />
      </div>
    </div>
  );
}

export default EditAssetTable;
