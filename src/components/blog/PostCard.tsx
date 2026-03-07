"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import type { PostWithCategory } from "@/types";

interface PostCardProps {
  post: PostWithCategory;
}

export function PostCard({ post }: PostCardProps) {
  const locale = useLocale();
  const t = useTranslations("blog");

  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
  const categoryName =
    post.category
      ? locale === "en" && post.category.nameEn
        ? post.category.nameEn
        : post.category.name
      : null;

  const date = post.publishedAt || post.createdAt;
  const formattedDate = new Date(date).toLocaleDateString(
    locale === "zh" ? "zh-CN" : "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <Link href={`/${locale}/blog/${post.slug}`}>
      <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardContent className="p-4">
          {categoryName && (
            <Badge variant="secondary" className="mb-2 text-xs">
              {categoryName}
            </Badge>
          )}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight">
            {title}
          </h3>
          {excerpt && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.viewCount} {t("views")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
