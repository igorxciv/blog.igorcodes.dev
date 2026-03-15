export type PostFrontmatter = {
  title: string;
  description?: string;
  date: string;
  updated?: string;
  topics: string[];
  tags: string[];
  published: boolean;
  featured?: boolean;
  readingTime?: number;
};

export type PostSummary = PostFrontmatter & {
  slug: string;
};

export type PostContent = PostSummary & {
  body: string;
};
