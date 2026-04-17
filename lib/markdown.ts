import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articlesDirectory = path.join(process.cwd(), 'content/articles');

// Define the shape of our localized content
export interface ArticleData {
  id: string;
  date: string;
  title: {
    zh: string;
    en: string;
    ja: string;
  };
  description: {
    zh: string;
    en: string;
    ja: string;
  };
  tags: {
    zh: string[];
    en: string[];
    ja: string[];
  };
  pinned?: boolean;
  contentHtml?: string;
}

export function getSortedArticlesData(): ArticleData[] {
  // Ensure the directory exists
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticlesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const matterResult = matter(fileContents);
      const data = matterResult.data;

      // Provide robust defaults for multi-lingual fields to prevent frontend crashes
      const safeData: ArticleData = {
        id,
        date: data.date || '',
        title: {
          zh: data.title?.zh || data.title || '無標題',
          en: data.title?.en || data.title || 'Untitled',
          ja: data.title?.ja || data.title || '無題'
        },
        description: {
          zh: data.description?.zh || data.description || '',
          en: data.description?.en || data.description || '',
          ja: data.description?.ja || data.description || ''
        },
        tags: {
          zh: Array.isArray(data.tags?.zh) ? data.tags.zh : (Array.isArray(data.tags) ? data.tags : []),
          en: Array.isArray(data.tags?.en) ? data.tags.en : (Array.isArray(data.tags) ? data.tags : []),
          ja: Array.isArray(data.tags?.ja) ? data.tags.ja : (Array.isArray(data.tags) ? data.tags : []),
        },
        pinned: !!data.pinned,
      };

      return safeData;
    });

  return allArticlesData.sort((a, b) => {
    // 1. Pinned articles come first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // 2. Then sort by date (descending)
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getArticleData(id: string, lang: string = 'zh'): Promise<ArticleData | null> {
  const fullPath = path.join(articlesDirectory, `${id}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const data = matterResult.data;

  // Split content based on language markers
  const rawContent = matterResult.content;
  let localizedContent = rawContent;

  if (lang === 'en') {
    const enMatch = rawContent.split('<!-- en -->');
    if (enMatch.length > 1) {
      localizedContent = enMatch[1].split('<!-- ja -->')[0].trim();
    }
  } else if (lang === 'ja') {
    const jaMatch = rawContent.split('<!-- ja -->');
    if (jaMatch.length > 1) {
      localizedContent = jaMatch[1].trim();
    }
  } else {
    // Default to 'zh' or everything before markers
    localizedContent = rawContent.split('<!-- en -->')[0].split('<!-- ja -->')[0].trim();
  }

  const processedContent = await remark()
    .use(html)
    .process(localizedContent);
  
  const contentHtml = processedContent.toString();

  return {
    id,
    date: data.date || '',
    title: {
      zh: data.title?.zh || data.title || '無標題',
      en: data.title?.en || data.title || 'Untitled',
      ja: data.title?.ja || data.title || '無題'
    },
    description: {
      zh: data.description?.zh || data.description || '',
      en: data.description?.en || data.description || '',
      ja: data.description?.ja || data.description || ''
    },
    tags: {
      zh: Array.isArray(data.tags?.zh) ? data.tags.zh : (Array.isArray(data.tags) ? data.tags : []),
      en: Array.isArray(data.tags?.en) ? data.tags.en : (Array.isArray(data.tags) ? data.tags : []),
      ja: Array.isArray(data.tags?.ja) ? data.tags.ja : (Array.isArray(data.tags) ? data.tags : []),
    },
    pinned: !!data.pinned,
    contentHtml,
  };
}

