import { useRouter as useNextRouter } from 'next/navigation';

export const useSafeRouter = () => {
    try {
        // This will only work inside a Next.js App Router context
        return useNextRouter();
    } catch (e) {
        // Fallback for Astro or other non-Next.js environments
        return {
            push: (url) => {
                if (typeof window !== 'undefined') {
                    window.location.href = url;
                }
            },
            replace: (url) => {
                if (typeof window !== 'undefined') {
                    window.location.replace(url);
                }
            },
            back: () => {
                if (typeof window !== 'undefined') {
                    window.history.back();
                }
            },
            forward: () => {
                if (typeof window !== 'undefined') {
                    window.history.forward();
                }
            },
            refresh: () => {
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            },
            prefetch: () => { } // No-op for Astro
        };
    }
};
