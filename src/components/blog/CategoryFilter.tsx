"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const locale = useLocale();
  const t = useTranslations("blog");
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleFilter = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/${locale}/blog?${params.toString()}`);
  };

  return (
    <div className="-mx-1 flex overflow-x-auto pb-1 scrollbar-none sm:flex-wrap sm:overflow-visible sm:pb-0">
      <div className="flex gap-1 px-1 sm:flex-wrap sm:gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFilter(null)}
        className={cn(
          "rounded-full",
          !activeCategory && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
        )}
      >
        {t("all")}
      </Button>
      {categories.map((cat) => {
        const name = locale === "en" && cat.nameEn ? cat.nameEn : cat.name;
        return (
          <Button
            key={cat.id}
            variant="ghost"
            size="sm"
            onClick={() => handleFilter(cat.slug)}
            className={cn(
              "rounded-full",
              activeCategory === cat.slug &&
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
            )}
          >
            {name}
          </Button>
        );
      })}
      </div>
    </div>
  );
}
