import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLocation } from 'react-router-dom';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function resetPagination(set, to) {
    set(to || { pageIndex: 0, pageSize: 10 });
}


export function currentProduct() {
    const location = useLocation();

    const path = location.pathname;

    const components = path.split("/");

    const productPrefix = components[1];

    const map = {
        "vm": "VM",
        "casm": "ASM",
        "caim": "AIM",
        "vs": "VS",
    }

    return map[productPrefix] || `Unknown - ${productPrefix}`;
}


export const generateMongoLikeObjectId = (() => {
    // Helper function to get random bytes, preferring crypto module if available.
    function _getRandomBytes(numBytes) {
        // For modern browsers
        if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
            const byteArray = new Uint8Array(numBytes);
            window.crypto.getRandomValues(byteArray);
            return byteArray;
        }
        // For Node.js
        // Check for Node.js environment more reliably
        else if (typeof process === 'object' && process.versions && process.versions.node && typeof require === 'function') {
            try {
                const cryptoNode = require('crypto'); // 'crypto' is a core Node.js module
                return cryptoNode.randomBytes(numBytes);
            } catch (e) {
                // This catch is for very unusual scenarios where 'crypto' might fail in a Node-like env.
                console.warn("generateMongoLikeObjectId: 'crypto.randomBytes' failed. Falling back to Math.random.", e);
            }
        }
        
        // Fallback for other environments or if crypto fails
        // console.warn(`generateMongoLikeObjectId: Using Math.random for ${numBytes} bytes as crypto is not available.`);
        const fallbackArray = new Uint8Array(numBytes);
        for (let i = 0; i < numBytes; i++) {
            fallbackArray[i] = Math.floor(Math.random() * 256);
        }
        return fallbackArray;
    }

    // Initialize the 5-byte "process-specific" random part once.
    // This mimics the behavior of having a unique value for the current "process" or "instance".
    const processUniqueBytes = _getRandomBytes(5);
    let processUniqueHex = '';
    for (let i = 0; i < 5; i++) {
        processUniqueHex += processUniqueBytes[i].toString(16).padStart(2, '0');
    }

    // State for the counter
    let lastTimestamp = 0;
    let counter;

    // Initialize counter with a random 3-byte value
    const initialCounterBytes = _getRandomBytes(3);
    counter = (initialCounterBytes[0] << 16) | (initialCounterBytes[1] << 8) | initialCounterBytes[2];

    // The actual ID generation function
    return function generate() {
        // 1. Timestamp (4 bytes)
        const currentTimestamp = Math.floor(Date.now() / 1000); // seconds since epoch

        if (currentTimestamp !== lastTimestamp) {
            lastTimestamp = currentTimestamp;
            // Reset counter to a new random 3-byte value when the second changes,
            // mimicking how a fresh counter starts if a new second begins.
            const newCounterBytes = _getRandomBytes(3);
            counter = (newCounterBytes[0] << 16) | (newCounterBytes[1] << 8) | newCounterBytes[2];
        } else {
            // Increment counter, ensuring it wraps around within 3 bytes (0xFFFFFF)
            counter = (counter + 1) & 0xFFFFFF;
        }

        const timestampHex = currentTimestamp.toString(16).padStart(8, '0');
        const counterHex = counter.toString(16).padStart(6, '0');

        // Concatenate parts: 4-byte timestamp + 5-byte random + 3-byte counter
        return timestampHex + processUniqueHex + counterHex;
    };
})();

/**
 * Sanitizes a redirect path to prevent Open Redirect vulnerabilities.
 * It only allows relative paths starting with a single '/' and prevents protocol-relative URLs (starting with '//').
 * 
 * @param {string|null} path - The path to sanitize.
 * @param {string} defaultPath - The fallback path if the provided path is unsafe or empty.
 * @returns {string} - A safe, relative redirect path.
 */
export function getSafeRedirect(path, defaultPath = '/') {
  if (!path) return defaultPath;

  // Decodes the path to handle URL encoding
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(path);
  } catch (e) {
    return defaultPath;
  }

  // Prevents protocol-relative URLs (e.g., //evil.com)
  // and absolute URLs (e.g., http://evil.com)
  if (decodedPath.startsWith('//') || decodedPath.includes('://')) {
    return defaultPath;
  }

  // Ensures it starts with / but not //
  if (decodedPath.startsWith('/')) {
    return decodedPath;
  }

  // If it's a relative path without leading /, it's okay for navigate() but safer to prepend /
  return `/${decodedPath}`;
}

/**
 * Dynamically decodes URL-encoded filter values in a filters object so they are not double-encoded by RTK Query.
 *
 * @param {Record<string, any>} filters - The raw filters object from store.
 * @returns {Record<string, any>} - Object with decoded filter values.
 */
export function decodeFilters(filters) {
  if (!filters || typeof filters !== 'object') return {};
  const decoded = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;
    if (typeof value === 'string') {
      try {
        decoded[key] = decodeURIComponent(value);
      } catch {
        decoded[key] = value;
      }
    } else if (Array.isArray(value)) {
      decoded[key] = value.map((v) => {
        if (typeof v === 'string') {
          try {
            return decodeURIComponent(v);
          } catch {
            return v;
          }
        }
        return v;
      });
    } else {
      decoded[key] = value;
    }
  }
  return decoded;
}
