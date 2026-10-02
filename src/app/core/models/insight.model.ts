export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  category: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  coverImageUrl: string;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
  isFeatured?: boolean;
}
