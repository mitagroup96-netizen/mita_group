// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', 
        '/private/', 
        '/admin/',
        '/*?*', // Prevents crawling of URLs with query parameters
      ],
    },
    sitemap: 'https://mita-group.vercel.app/sitemap.xml',
    host: 'https://mita-group.vercel.app',
  };
}