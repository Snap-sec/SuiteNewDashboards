/**
 * Simple, reusable PDF debug logging utility for the report frontend.
 */

const BASE_URL = 'https://snaplogs.requestcatcher.com';

// Helper to check if debug mode is enabled from query parameters
const isDebugEnabled = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('debug') === 'true';
};

// Safe serializer to handle circular references and avoid throwing errors
const safeStringify = (obj) => {
  try {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    });
  } catch (err) {
    return JSON.stringify({ error: `Serialization failed: ${err.message}` });
  }
};

// Helper to format Error objects properly for serialization
const formatError = (err) => {
  if (!err) return err;
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }
  if (typeof err === 'object') {
    return {
      name: err.name || 'Error',
      message: err.message || String(err),
      stack: err.stack,
    };
  }
  return {
    message: String(err)
  };
};

// Helper to safely summarize large data structures for debugging logs to avoid network congestion and keepalive size limits (64KB)
const summarizeData = (obj) => {
  if (obj === null || obj === undefined) return {};
  if (typeof obj !== 'object') {
    return { value: obj };
  }
  if (Array.isArray(obj)) {
    return { arrayLength: obj.length, itemsSummary: `[Array of ${obj.length} items]` };
  }
  
  const summary = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      if (val === null || val === undefined) {
        summary[key] = val;
      } else if (typeof val === 'string') {
        summary[key] = val.length > 150 ? val.substring(0, 150) + '... (truncated)' : val;
      } else if (Array.isArray(val)) {
        summary[key] = `[Array of ${val.length} items]`;
      } else if (typeof val === 'object') {
        summary[key] = '{...}';
      } else {
        summary[key] = val;
      }
    }
  }
  return summary;
};

/**
 * Common logging function.
 * Sends debugging information to request catcher endpoints.
 *
 * @param {string} stage - The rendering stage/endpoint name (e.g. 'page-loaded').
 * @param {Record<string, any>} [data] - Additional data to send.
 * @returns {Promise<void>}
 */
export const pdfDebugLog = (stage, data = {}) => {
  if (!isDebugEnabled()) {
    return Promise.resolve();
  }

  // Wrap inside setTimeout to decouple logging requests completely from the rendering loop and main thread execution
  setTimeout(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const reportId = params.get('reportId') || params.get('assessmentId') || '';
      
      const stagePath = stage.startsWith('/') ? stage : `/${stage}`;
      const url = `${BASE_URL}${stagePath}`;

      const payload = {
        reportId,
        stage,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...summarizeData(data)
      };

      fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Completely bypass CORS checks and preflight request validations
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain'
        },
        body: safeStringify(payload)
      }).catch(err => {
        console.warn(`[pdfDebug] Logging failed for stage "${stage}":`, err);
      });
    } catch (err) {
      console.warn(`[pdfDebug] Logging failed for stage "${stage}":`, err);
    }
  }, 0);

  return Promise.resolve();
};

/**
 * Reusable PDF debugging API containing convenience wrappers.
 */
export const pdfDebug = {
  pageLoaded: () => pdfDebugLog('page-loaded'),
  dataFetchStarted: () => pdfDebugLog('data-fetch-started'),
  dataFetchCompleted: (data) => pdfDebugLog('data-fetch-completed', { fetchResult: data }),
  renderSummary: () => pdfDebugLog('render-summary'),
  renderCharts: (data) => pdfDebugLog('render-charts', data),
  renderAssets: () => pdfDebugLog('render-assets'),
  pdfReady: () => pdfDebugLog('pdf-ready'),
  error: (error, extra) => pdfDebugLog('error', { error: formatError(error), ...extra }),
  logBetweenAction: (data) => pdfDebugLog('log/between/action', data)
};

// Global error and unhandled rejection interceptors
if (typeof window !== 'undefined') {
  const oldOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    try {
      pdfDebug.error(error || message, {
        source,
        lineno,
        colno,
        isGlobalError: true
      });
    } catch (e) {
      // Ignore
    }
    if (typeof oldOnError === 'function') {
      return oldOnError.apply(this, arguments);
    }
    return false;
  };

  const oldOnUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function (event) {
    try {
      pdfDebug.error(event?.reason || event, {
        isUnhandledRejection: true
      });
    } catch (e) {
      // Ignore
    }
    if (typeof oldOnUnhandledRejection === 'function') {
      return oldOnUnhandledRejection.apply(this, arguments);
    }
  };
}

export default pdfDebug;
