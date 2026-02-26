// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap() {
  const baseUrl = 'https://mita-group.vercel.app';
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/books',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // You can also fetch dynamic routes from your API/database
  // const posts = await getPosts();
  // const dynamicRoutes = posts.map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'monthly',
  //   priority: 0.6,
  // }));

  return [...staticRoutes];
}