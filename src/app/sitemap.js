
export default function sitemap() {
    const lastmod = new Date().toISOString()
  
    return [
      { url: 'https://tvpro-landing.vercel.app/', lastModified: lastmod },
      { url: 'https://tvpro-landing.vercel.app/#services', lastModified: lastmod },
      { url: 'https://tvpro-landing.vercel.app/#pricing', lastModified: lastmod },
      { url: 'https://tvpro-landing.vercel.app/#faq', lastModified: lastmod },
      { url: 'https://tvpro-landing.vercel.app/#contact', lastModified: lastmod },
    ]
  }