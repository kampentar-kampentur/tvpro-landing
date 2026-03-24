import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://tvprousa.com';
  const lastUpdated = '2026-03-24T00:00:00.000Z';

  const entries = [
    { url: `${baseUrl}/chicago/`, priority: 1.0, freq: 'daily' },
  ];

  const urlset = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${lastUpdated}</lastmod>
    <changefreq>${entry.freq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
