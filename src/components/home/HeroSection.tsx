"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { HeroLogo } from "./HeroLogo";
import { HeroButtons } from "./HeroButtons";

export function HeroSection() {
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      <video
        className="h-full w-full object-cover"
        src="/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <HeroLogo />
      <HeroButtons />
      {/* Hidden easter egg button — bottom 1/4, horizontal 2/5 to 3/5 */}
      <div
        className="absolute bottom-0 left-[40%] w-[20%] h-1/4 cursor-default z-10"
        onClick={() => router.push(`/${locale}/blog`)}
      />
    </div>
  );
}
