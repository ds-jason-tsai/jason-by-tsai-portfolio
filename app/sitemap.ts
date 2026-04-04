import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // Replace with the final Vercel Domain provided after deployment
  const baseUrl = 'https://jason-by-tsai-portfolio.vercel.app';
  
  const pages = ['', '/services', '/portfolio', '/experience', '/contact'];
  const langs = ['/zh', '/en', '/ja'];
  
  const urls: MetadataRoute.Sitemap = [];
  
  for(const lang of langs) {
      for(const page of pages) {
          urls.push({
              url: `${baseUrl}${lang}${page}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: page === '' ? 1 : 0.8
          });
      }
  }

  return urls;
}
