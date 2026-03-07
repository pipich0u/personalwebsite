export interface PostWithCategory {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  content: string;
  contentEn: string | null;
  excerpt: string | null;
  excerptEn: string | null;
  coverImage: string | null;
  status: string;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    nameEn: string | null;
    slug: string;
  } | null;
  tags: string | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  sortOrder: number;
  _count: {
    posts: number;
  };
}
