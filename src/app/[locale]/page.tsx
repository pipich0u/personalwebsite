import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { getLocale } from "next-intl/server";

export const revalidate = 0;

export default async function HomePage() {
  const locale = await getLocale();

  const siteSettings = await prisma.siteSetting.findMany();
  const settings: Record<string, string> = {};
  for (const s of siteSettings) {
    settings[s.key] = s.value;
  }

  const slogan = locale === "zh" ? settings.home_slogan : settings.home_slogan_en;
  const subtitle = locale === "zh" ? settings.home_subtitle : settings.home_subtitle_en;

  return <HeroSection slogan={slogan} subtitle={subtitle} />;
}
