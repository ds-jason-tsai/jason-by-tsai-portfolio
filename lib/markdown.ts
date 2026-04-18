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
  
  const categories: Record<string, { label: string, tags: string[] }> = {
    ai: {
      label: { zh: 'AI 相關', en: 'AI Related', ja: 'AI 関連' }[lang] || 'AI',
      tags: [] as string[]
    },
    biz: {
      label: { zh: '成長策略', en: 'Growth Strategy', ja: '成長戦略' }[lang] || 'Strategy',
      tags: [] as string[]
    },
    tech: {
      label: { zh: '技術實務', en: 'Tech Practice', ja: '技術実務' }[lang] || 'Tech',
      tags: [] as string[]
    }
  };

  // Specific Lists based on user request (Sort Order)
  const aiOrder = ['AI 趨勢', 'AI 應用', 'AI 治理'];
  const bizOrder = ['成長策略', '數據分析', '產業洞察', '數位轉型', '企業轉型'];
  const techOrder = ['SEO', 'MarTech', 'Python', 'SQL', 'BigQuery', 'Next.js', 'GA4', '技術實務'];
  const techKeywords = ['Python', 'SQL', 'BigQuery', 'Next.js', 'GA4', '技術實務', 'SEO', 'MarTech'];

  // 1. Distribute all discovered tags into categories first
  tags.forEach(tag => {
    const lowerTag = tag.toLowerCase();
    
    // Explicit match checks
    if (aiOrder.includes(tag)) {
      categories.ai.tags.push(tag);
    } else if (techOrder.includes(tag)) {
      categories.tech.tags.push(tag);
    } else if (bizOrder.includes(tag)) {
      categories.biz.tags.push(tag);
    } 
    // Heuristic fallbacks
    else if (['ai', '趨勢', '應用', '治理', 'llm', 'crawler', 'n8n', '自動化'].some(k => lowerTag.includes(k))) {
      categories.ai.tags.push(tag);
    } else if (['python', 'sql', 'query', 'next', 'ga4'].some(k => lowerTag.includes(k))) {
       categories.tech.tags.push(tag);
    } else {
      categories.biz.tags.push(tag);
    }
  });

  // 2. Perform STRICT sorting on each category based on the requested order
  const sortTags = (tagList: string[], order: string[]) => {
    return [...new Set(tagList)].sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      // If both not in order, keep discovery order (alphabetical)
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      // If only one in order, that one comes first
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  categories.ai.tags = sortTags(categories.ai.tags, aiOrder);
  categories.biz.tags = sortTags(categories.biz.tags, bizOrder);
  categories.tech.tags = sortTags(categories.tech.tags, techOrder);

  return categories;
}

