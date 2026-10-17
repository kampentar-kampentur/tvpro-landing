'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/errorReporter';

export default function Error({ error, reset }) {
  useEffect(() => {
    const message = error?.message || 'Next.js Route Error';
    reportError({
      message,
      stack: error?.stack || '',
      source: 'app/error.jsx',
      extra: { digest: error?.digest },
    });

    // Auto-recover from ChunkLoadError during deployment rollouts (once per session)
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
    <div
      style={{
        padding: '3rem 1.5rem',
        margin: '2rem auto',
        maxWidth: '600px',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '0.5rem',
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          marginBottom: '1.5rem',
        }}
      >
        We encountered an unexpected issue while loading this page. Our team has been notified.
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
  );
}
