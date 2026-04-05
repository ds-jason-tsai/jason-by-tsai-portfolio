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

      return {
        id,
        ...matterResult.data,
      } as ArticleData;
    });

  return allArticlesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getArticleData(id: string): Promise<ArticleData | null> {
  const fullPath = path.join(articlesDirectory, `${id}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  
  const contentHtml = processedContent.toString();

  return {
    id,
    ...(matterResult.data as Omit<ArticleData, 'id' | 'contentHtml'>),
    contentHtml,
  };
}
