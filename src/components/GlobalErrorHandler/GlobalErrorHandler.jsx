'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/errorReporter';

/**
 * Global Error Handler component
 * Intercepts uncaught JavaScript exceptions and unhandled promise rejections in the browser
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    const handleGlobalError = (event) => {
      // Ignore cross-origin script errors with no details
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

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
