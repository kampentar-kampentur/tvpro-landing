export function minimizeMedia(media) {
    if (!media) return null;

    // Handle Strapi v4 nested structure if present
    const data = (media.data?.attributes || media.attributes || media);
    const formats = data.formats || {};

    return {
        url: data.url,
        alternativeText: data.alternativeText || "",
        width: data.width,
        height: data.height,
        formats: typeof formats === 'object' && !Array.isArray(formats) ? Object.keys(formats).reduce((acc, key) => {
            const f = formats[key];
            if (f && f.url) {
                acc[key] = {
                    url: f.url,
                    width: f.width,
                    height: f.height
                };
            }
            return acc;
        }, {}) : null
    };
}
