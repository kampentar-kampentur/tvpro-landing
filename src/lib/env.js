export const getBaseUrl = () => {
    return (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SRTAPI_URL || process.env?.PUBLIC_NEXT_PUBLIC_SRTAPI_URL)) ||
        (import.meta.env?.PUBLIC_NEXT_PUBLIC_SRTAPI_URL) ||
        (import.meta.env?.NEXT_PUBLIC_SRTAPI_URL) ||
        'https://strapi-dev-e587.up.railway.app';
};
