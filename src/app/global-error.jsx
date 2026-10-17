'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/errorReporter';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    const message = error?.message || 'Next.js Root GlobalError';
    reportError({
      message,
      stack: error?.stack || '',
      source: 'app/global-error.jsx',
      extra: { digest: error?.digest },
    });

    if (
      typeof window !== 'undefined' &&
      (message.includes('ChunkLoadError') || message.includes('Loading chunk'))
    ) {
      try {
        const reloaded = sessionStorage.getItem('chunk_error_reloaded');
        if (!reloaded) {
          sessionStorage.setItem('chunk_error_reloaded', '1');
          window.location.reload();
        }
      } catch (e) {}
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            padding: '3rem 1.5rem',
            margin: '4rem auto',
            maxWidth: '600px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            We encountered an unexpected issue. Our team has been notified.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#ffffff',
              backgroundColor: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
