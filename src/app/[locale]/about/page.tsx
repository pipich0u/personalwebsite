import { prisma } from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import Image from "next/image";
import { Mail, Github } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "zh" ? "关于我" : "About Me",
  };
}

async function getPageContent(key: string): Promise<string> {
  const content = await prisma.pageContent.findUnique({
    where: { pageKey: key },
  });
  return content?.content || "";
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");

  const bioKey = locale === "en" ? "about_bio_en" : "about_bio";
  const bio = await getPageContent(bioKey);
  const avatar = await getPageContent("about_avatar");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <AnimatedSection>
        <h1 className="mb-12 text-3xl font-bold">{t("title")}</h1>
      </AnimatedSection>

      <div className="grid gap-12 md:grid-cols-[200px_1fr]">
        <AnimatedSection direction="left">
          <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-full border-4 border-border/50 md:mx-0">
            <Image
              src={avatar || "/uploads/avatar.jpg"}
              alt="范遥"
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection direction="right" delay={0.1}>
          <div className="prose prose-neutral dark:prose-invert">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {bio}
            </p>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={0.3}>
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-semibold">{t("contact")}</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:admin@fanyao.com"
              className="flex items-center gap-2 rounded-lg border border-border/50 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
              admin@fanyao.com
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border/50 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <Github className="h-5 w-5" />
              GitHub
            </a>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
