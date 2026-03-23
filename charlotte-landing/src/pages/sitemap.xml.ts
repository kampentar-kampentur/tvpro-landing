import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://tvprousa.com';
  const now = new Date().toISOString();

  const entries = [
    { url: `${baseUrl}/charlotte/`, priority: 1.0, freq: 'daily' },
    { url: `${baseUrl}/privacy-policy/`, priority: 0.3, freq: 'monthly' },
    { url: `${baseUrl}/terms/`, priority: 0.3, freq: 'monthly' },
    { url: `${baseUrl}/sms-consent/`, priority: 0.3, freq: 'monthly' },
  ];

  const urlset = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${now}</lastmod>
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
