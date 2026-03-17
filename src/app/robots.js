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
      ],
    },
    sitemap: 'https://niyog-publications.vercel.app/sitemap.xml',
    host: 'https://niyog-publications.vercel.app',
  };
}