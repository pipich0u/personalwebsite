import { prisma } from "@/lib/prisma";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareButtons from "@/components/blog/ShareButtons";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!post) return {};

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const description = (locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt) || "";
  const categoryName = post.category?.name || "";
  const date = (post.publishedAt || post.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const postUrl = `${baseUrl}/${locale}/blog/${slug}`;

  // Use cover image if available, otherwise generate OG image
  const ogImage = post.coverImage
    ? (post.coverImage.startsWith("http") ? post.coverImage : `${baseUrl}${post.coverImage}`)
    : `${baseUrl}/api/og?title=${encodeURIComponent(title)}&excerpt=${encodeURIComponent(description)}&category=${encodeURIComponent(categoryName)}&date=${encodeURIComponent(date)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName: "小胖和小臭的空间",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post || post.status !== "published") {
    notFound();
  }

  // Increment view count
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const content = locale === "en" && post.contentEn ? post.contentEn : post.content;
  const categoryName = post.category
    ? locale === "en" && post.category.nameEn
      ? post.category.nameEn
      : post.category.name
    : null;

  const date = post.publishedAt || post.createdAt;
  const formattedDate = new Date(date).toLocaleDateString(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={`/${locale}/blog`}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {locale === "zh" ? "返回博客" : "Back to Blog"}
        </Link>
      </Button>

      {post.coverImage && (
        <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mb-8">
        {categoryName && (
          <Badge variant="secondary" className="mb-3">
            {categoryName}
          </Badge>
        )}
        <h1 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.viewCount + 1} {locale === "zh" ? "阅读" : "views"}
          </span>
        </div>
        <div className="mt-4">
          <ShareButtons title={title} slug={post.slug} locale={locale} />
        </div>
      </header>

      <div
        className="prose prose-sm prose-neutral max-w-none dark:prose-invert sm:prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
