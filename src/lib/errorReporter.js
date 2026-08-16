'use strict';

// Client-side rate limiting & deduplication
const sentErrors = new Map();
let errorCountInWindow = 0;
let windowStartTime = Date.now();
const MAX_ERRORS_PER_MINUTE = 5;
const DEDUP_WINDOW_MS = 60 * 1000;

/**
 * Basic client-side sensitive data filter
 */
function sanitizeClientData(data) {
  if (!data || typeof data !== 'object') return data;
  const sensitiveRegex = /^(password|phone|email|token|secret|authorization|creditCard)$/i;
  const sanitized = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveRegex.test(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeClientData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Report a frontend error to Strapi /api/log-error endpoint
 * @param {Object} params
 * @param {string} params.message - Error message
 * @param {string} [params.stack] - Stack trace
 * @param {string} [params.source] - Error source (e.g. 'window.onerror', 'unhandledrejection', 'ErrorBoundary')
 * @param {Object} [params.errorInfo] - React componentStack or extra context
 * @param {Object} [params.extra] - Additional context
 */
export function reportError({
  message,
  stack,
  source = 'client',
  errorInfo = null,
  extra = {},
}) {
  if (typeof window === 'undefined') {
    return;
  }

  // Deduplication check
  const now = Date.now();
  const errorKey = `${source}:${message || ''}:${(stack || '').slice(0, 100)}`;
  const lastSent = sentErrors.get(errorKey);

  if (lastSent && now - lastSent < DEDUP_WINDOW_MS) {
    return;
  }
  sentErrors.set(errorKey, now);

  // Rate-limiting check (max 5 errors/min per browser session)
  if (now - windowStartTime > 60000) {
    errorCountInWindow = 0;
    windowStartTime = now;
  }

  if (errorCountInWindow >= MAX_ERRORS_PER_MINUTE) {
    return;
  }
  errorCountInWindow++;

  const strapiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.NEXT_PUBLIC_SRTAPI_URL ||
    'https://strapi-staging-bd62.up.railway.app';

  const endpoint = `${strapiBaseUrl.replace(/\/+$/, '')}/api/log-error`;

  const payload = {
    message: String(message || 'Unknown client error'),
    stack: stack ? String(stack) : '',
    source: String(source),
    url: window.location.href,
    pathname: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    errorInfo: errorInfo ? sanitizeClientData(errorInfo) : null,
    extra: sanitizeClientData(extra),
  };

  // In development, log to console for debugging
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_ERROR_REPORTING !== 'true') {
    console.warn('[ErrorReporter (Dev Mode)] Caught error (not sent to Strapi in dev):', payload);
    return;
  }

  // Send error asynchronously without blocking the browser
  try {
    const serializedPayload = JSON.stringify(payload);

    if (navigator.sendBeacon && serializedPayload.length < 60000) {
      const blob = new Blob([serializedPayload], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: serializedPayload,
        keepalive: true,
      }).catch(() => {
        // Silently ignore reporting network failures
      });
    }
  } catch (err) {
    // Fail silently in browser
  }
}

export default reportError;
