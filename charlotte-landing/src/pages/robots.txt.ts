import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: https://tvprousa.com/charlotte/sitemap.xml
`.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
