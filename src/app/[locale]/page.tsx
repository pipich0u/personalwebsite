import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { PostCard } from "@/components/blog/PostCard";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("blog");

  const featuredPosts = await prisma.post.findMany({
    where: { status: "published" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <HeroSection />

      {featuredPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-20">
          <AnimatedSection>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {locale === "zh" ? "最新文章" : "Latest Posts"}
              </h2>
              <Button variant="ghost" asChild>
                <Link href={`/${locale}/blog`} className="gap-1">
                  {t("readMore")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.1}>
                <PostCard post={post} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
