export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
      sitemap: 'https://tvpro-landing.vercel.app/sitemap.xml',
    }
  }