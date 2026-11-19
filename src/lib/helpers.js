import { useAuth } from '@/auth/context/auth-context';
import { toast } from 'sonner';

export const onAuthority = (roles = [], callback) => {
  const { user } = useAuth();

  return function secureCallback(...args) {
    const allowedRoles = Array.isArray(roles) ? [...roles] : typeof roles === 'string' ? [roles] : [];
    if (allowedRoles.includes('Admin') && !allowedRoles.includes('Platform Admin')) {
      allowedRoles.push('Platform Admin');
    }

    if (!allowedRoles.includes(user?.role)) {
      toast.error('Unauthorized to perform this action');
      return;
    }

    return callback(...args);
  };
};

export function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const throttle = (func, limit) => {
  let lastFunc = null;
  let lastRan = null;

  return function (...args) {
    if (lastRan === null) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (lastFunc !== null) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
};

export function debounce(func, wait) {
  let timeout = null;

  return function (...args) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function uid() {
  return (Date.now() + Math.floor(Math.random() * 1000)).toString();
}

export function getInitials(name, count) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase());

  return count && count > 0
    ? initials.slice(0, count).join('')
    : initials.join('');
}

export function toAbsoluteUrl(pathname) {
  const baseUrl = import.meta.env.BASE_URL;

  if (baseUrl && baseUrl !== '/') {
    return import.meta.env.BASE_URL + pathname;
  } else {
    return pathname;
  }
}

export function timeAgo(date) {
  if (!date) return ''; // Return empty string if date is null or undefined

  const now = new Date();
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
  if (diff < 604800)
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  if (diff < 2592000)
    return `${Math.floor(diff / 604800)} week${Math.floor(diff / 604800) > 1 ? 's' : ''} ago`;
  if (diff < 31536000)
    return `${Math.floor(diff / 2592000)} month${Math.floor(diff / 2592000) > 1 ? 's' : ''} ago`;

  return `${Math.floor(diff / 31536000)} year${Math.floor(diff / 31536000) > 1 ? 's' : ''} ago`;
}

export function formatDate(input) {
  if (!input) return null;

  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format file size
export const formatFileSize = (bytes) => {
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} KB`;
};

export function formatDateTime(input) {
  if (!input) return '';
  const date = new Date(input);
  const datePart = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

export const cvssScoreToSeverity = (score) => {
  const s = Number(score || 0);
  if (s === 0 || Number.isNaN(s)) return 'none';
  if (s < 4.0) return 'low';
  if (s < 7.0) return 'medium';
  if (s < 9.0) return 'high';
  return 'critical';
};

export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern asynchronous API
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

export function validatePayload(payload, schema) {
  try {
    const result = schema.parse(payload);
    return { success: true, data: result };
  } catch (error) {
    if (error.errors) {
      error.errors.forEach((err) => {
        toast.error(err.message);
      });
    } else {
      toast.error('Validation failed');
    }
    return { success: false, error };
  }
}

// labels = [{ label: hi, value: no }];
export function convertToFilters(labels) {
  const filters = { filters: '' };

  const filtersArray = labels
    .map((l) => {
      return `${l.label}:${l.value}`;
    })
    .join(',');

  filters.filters = filtersArray;

  return filters;
}

export function hasDaysPassed(dateString, days) {
  const pastDate = new Date(dateString);
  const now = new Date();

  // difference in milliseconds
  const diffMs = now - pastDate;

  // convert days to milliseconds
  const daysMs = days * 24 * 60 * 60 * 1000;

  return diffMs >= daysMs ? 'yes' : false;
}


/* Helper function to format duration
 -> accepts this like values
 egs: 266665 in ms 
*/
export const formatMsIntoDuration = (ms) => {
  if (!ms) return '-';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${minutes}m ${seconds}s`;
};

/**
 * Formats a decimal day value into a human-readable string (e.g., 3.5 -> "3 days and 12 hours")
 */
export const formatDaysToHumanReadable = (days, short = false) => {
  let d = Math.floor(days || 0);
  let h = Math.round(((days || 0) - d) * 24);

  if (h === 24) {
    d += 1;
    h = 0;
  }

  if (short) {
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    return parts.length > 0 ? parts.join(' ') : '0d';
  }

  const parts = [];
  if (d > 0) parts.push(`${d} day${d !== 1 ? 's' : ''}`);
  if (h > 0) parts.push(`${h} hour${h !== 1 ? 's' : ''}`);

  if (parts.length === 0) return '0 days';
  if (parts.length === 1) return parts[0];
  return parts.join(' and ');
};

// Helper function to format time until give date
export const formatTimestampDuration = (timestamp) => {
  if (!timestamp) return '-';
  const now = new Date();
  const target = new Date(timestamp);
  const diffMs = Math.abs(now - target);
  const totalMinutes = Math.floor(diffMs / 60000);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const days = totalDays % 30;
  const months = Math.floor(totalDays / 30);

  let parts = [];
  if (months > 0) parts.push(`${months}mo`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}min`);
  return parts.join(" ");
};

export function validateStrictYAML(
  yamlText,
  allowedSections = ['match', 'set'],
  allowedTopLevelKeys = [
    'name',
    'description',
    'severity',
    'product',
    'assetType',
  ],
) {
  return 'Valid YAML rule';

  const lines = yamlText.trim().split('\n');
  let currentSection = null;
  const structure = {};
  const topLevel = {};

  const expectedKeys = {
    match: ['field', 'operator', 'value', 'options'],
    set: ['field', 'value'],
  };

  let currentObject = null;

  for (let line of lines) {
    line = line.replace(/\r/g, '');

    // Detect section (e.g., match: or set:)
    if (/^\s*[a-zA-Z]+:\s*$/.test(line)) {
      const section = line.trim().slice(0, -1); // remove trailing :
      if (!allowedSections.includes(section)) {
        return `Invalid YAML rule: unknown section '${section}'`;
      }
      currentSection = section;
      structure[currentSection] = [];
      currentObject = null;
      continue;
    }

    // Top-level key: value before any section
    if (!currentSection && /^\s*[a-zA-Z0-9_]+:\s*.*$/.test(line)) {
      const [key, ...rest] = line.trim().split(':');
      const value = rest.join(':').trim();
      if (!allowedTopLevelKeys.includes(key)) {
        return `Invalid YAML rule: unknown top-level key '${key}'`;
      }
      topLevel[key] = value;
      continue;
    }

    // Start of new object in list (e.g., - field: something)
    if (/^\s*-\s*[a-zA-Z0-9_]+:\s*.*$/.test(line)) {
      if (!currentSection)
        return 'Invalid YAML rule: list item outside of section';
      const keyValue = line.trim().slice(1).trim(); // remove "- "
      const [key, ...rest] = keyValue.split(':');
      const value = rest.join(':').trim();
      currentObject = { [key.trim()]: value };
      structure[currentSection].push(currentObject);
      continue;
    }

    // Key-value within the current object
    if (/^\s+[a-zA-Z0-9_]+:\s*.*$/.test(line)) {
      if (!currentObject) return 'Invalid YAML rule: value outside of object';
      const [key, ...rest] = line.trim().split(':');
      const value = rest.join(':').trim();
      currentObject[key.trim()] = value;
    } else {
      return 'Invalid YAML rule: malformed line';
    }
  }

  // Validate each object in match and set
  for (const section of allowedSections) {
    if (structure[section]) {
      for (const obj of structure[section]) {
        const keys = Object.keys(obj).sort();
        const expected = expectedKeys[section].slice().sort();
        if (JSON.stringify(keys) !== JSON.stringify(expected)) {
          return `Invalid YAML rule: '${section}' must have keys: ${expected.join(', ')}`;
        }
      }
    }
  }

  return 'Valid YAML rule';
}

export const hasUnresolvedBlocker = (comments) => {
  if (!comments || !Array.isArray(comments)) return false;

  const blockerStates = {};
  const sortedComments = [...comments].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  for (const comment of sortedComments) {
    if (comment.isDeleted) continue;
    if (comment.commentType && comment.commentType.startsWith('blocker:') && comment.blockerId) {
      if (comment.commentType === 'blocker:created' || comment.commentType === 'blocker:re-opened') {
        blockerStates[comment.blockerId] = true;
      } else if (comment.commentType === 'blocker:resolved') {
        blockerStates[comment.blockerId] = false;
      }
    }
  }

  return Object.values(blockerStates).some((isBlocked) => isBlocked === true);
};
