'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/errorReporter';

/**
 * Global Error Handler component
 * Intercepts ALL frontend errors:
 * 1. Uncaught JavaScript exceptions & resource/chunk load failures (capture phase)
 * 2. Unhandled Promise rejections
 * 3. All console.error(...) calls (caught errors in try/catch blocks)
 * 4. Failed fetch() API calls (HTTP 4xx/5xx or network failures)
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    const handleGlobalError = (event) => {
      // Resource loading error (e.g. <script> chunk 404)
      if (event.target && event.target !== window) {
        const tag = event.target.tagName;
        const src = event.target.src || event.target.href;
        if (tag === 'SCRIPT' && src) {
          reportError({
            message: `Failed to load script: ${src}`,
            stack: `Tag: <${tag.toLowerCase()} src="${src}">`,
            source: 'resource.error',
            extra: { tag, src },
          });
        }
        return;
      }

      if (!event.error && !event.message) return;

      reportError({
        message: event.message || (event.error && event.error.message) || 'Uncaught window.onerror',
        stack: event.error && event.error.stack ? event.error.stack : `at ${event.filename || 'unknown'}:${event.lineno || 0}:${event.colno || 0}`,
        source: 'window.onerror',
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const handleUnhandledRejection = (event) => {
      const reason = event.reason;
      let message = 'Unhandled Promise Rejection';
      let stack = '';

      if (reason instanceof Error) {
        message = reason.message;
        stack = reason.stack || '';
      } else if (typeof reason === 'string') {
        message = reason;
      } else if (reason && typeof reason === 'object') {
        try {
          message = JSON.stringify(reason);
        } catch (e) {
          message = String(reason);
        }
      }

      reportError({
        message,
        stack,
        source: 'unhandledrejection',
      });
    };

    // Intercept console.error so caught errors inside try/catch blocks are also reported
    const originalConsoleError = console.error;
    console.error = function (...args) {
      originalConsoleError.apply(console, args);
      try {
        const firstArg = args[0];
        if (typeof firstArg === 'string' && firstArg.includes('[ErrorReporter')) {
          return;
        }
        let stack = '';
        const parts = args.map((arg) => {
          if (arg instanceof Error) {
            if (!stack && arg.stack) stack = arg.stack;
            return arg.message || String(arg);
          }
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg);
            } catch (e) {
              return String(arg);
            }
          }
          return String(arg);
        });
        const message = parts.join(' ').slice(0, 1000);
        if (message) {
          reportError({
            message,
            stack: stack || new Error(message).stack || '',
            source: 'console.error',
          });
        }
      } catch (e) {
        // Ignore internal reporting errors
      }
    };

    // Intercept window.fetch to catch HTTP 4xx/5xx API errors and network failures
    const originalFetch = window.fetch;
    if (typeof originalFetch === 'function') {
      window.fetch = async function (...args) {
        const reqUrl = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
        const isInternalIgnore =
          reqUrl.includes('/api/log-error') ||
          reqUrl.includes('/api/quiz-analytics');

        try {
          const response = await originalFetch.apply(this, args);
          if (!response.ok && !isInternalIgnore) {
            let errorBody = '';
            try {
              const cloned = response.clone();
              errorBody = (await cloned.text()).slice(0, 800);
            } catch (e) {}

            reportError({
              message: `HTTP ${response.status} on fetch ${reqUrl}`,
              stack: errorBody,
              source: 'fetch.http_error',
              extra: {
                status: response.status,
                statusText: response.statusText,
                url: reqUrl,
                responseBody: errorBody,
              },
            });
          }
          return response;
        } catch (err) {
          if (!isInternalIgnore && err?.name !== 'AbortError') {
            reportError({
              message: `Fetch network error on ${reqUrl}: ${err?.message || String(err)}`,
              stack: err?.stack || '',
              source: 'fetch.network_error',
              extra: { url: reqUrl },
            });
          }
          throw err;
        }
      };
    }

    window.addEventListener('error', handleGlobalError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.error = originalConsoleError;
      if (originalFetch) {
        window.fetch = originalFetch;
      }
    };
  }, []);

  return null;
}
