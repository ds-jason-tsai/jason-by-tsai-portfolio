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

export function getLatestArticle(): ArticleData | null {
  const articles = getSortedArticlesData();
  return articles.length > 0 ? articles[0] : null;
}

export function getAllTagsByLanguage(lang: string = 'zh'): string[] {
  const articles = getSortedArticlesData();
  const allTags = articles.flatMap(art => (art.tags as any)[lang] || []);
  return Array.from(new Set(allTags));
}

export function getCategorizedTags(lang: string = 'zh') {
  const tags = getAllTagsByLanguage(lang);
  
  // Categorization Logic
  const categories: Record<string, { label: string, tags: string[] }> = {
    ai: {
      label: { zh: 'AI 趨勢與自動化', en: 'AI & Automation', ja: 'AIとオートメーション' }[lang] || 'AI',
      tags: [] as string[]
    },
    tech: {
      label: { zh: '數據分析與技術實務', en: 'Data & Analytics', ja: 'データと分析技術' }[lang] || 'Tech',
      tags: [] as string[]
    },
    biz: {
      label: { zh: '商務成長與策略洞察', en: 'Business Strategy', ja: 'ビジネス戦略' }[lang] || 'Business',
      tags: [] as string[]
    }
  };

  const aiKeywords = ['AI', '生成式', 'LLM', 'Crawler', 'n8n', '自動化', '趨勢', '趨勢記事'];
  const techKeywords = ['Python', 'SQL', 'BigQuery', 'Next.js', 'GA4', '技術教學', '技術實務'];

  tags.forEach(tag => {
    const lowerTag = tag.toLowerCase();
    if (aiKeywords.some(k => lowerTag.includes(k.toLowerCase()))) {
      categories.ai.tags.push(tag);
    } else if (techKeywords.some(k => lowerTag.includes(k.toLowerCase()))) {
      categories.tech.tags.push(tag);
    } else {
      categories.biz.tags.push(tag);
    }
  });

  return categories;
}

