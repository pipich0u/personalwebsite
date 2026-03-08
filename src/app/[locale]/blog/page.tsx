import { prisma } from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "zh" ? "博客" : "Blog",
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const { category } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const posts = await prisma.post.findMany({
    where: {
      status: "published",
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <AnimatedSection>
        <h1 className="mb-8 text-2xl font-bold sm:text-3xl">{t("title")}</h1>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="mb-8">
          <CategoryFilter categories={categories} />
        </div>
      </AnimatedSection>

      {posts.length === 0 ? (
        <AnimatedSection delay={0.2}>
          <div className="py-20 text-center text-muted-foreground">
            {t("noPosts")}
          </div>
        </AnimatedSection>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <AnimatedSection key={post.id} delay={0.1 + i * 0.05}>
              <PostCard post={post} />
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}
