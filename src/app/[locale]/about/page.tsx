import { prisma } from "@/lib/prisma";
import { getLocale, getTranslations } from "next-intl/server";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import Image from "next/image";
import { Mail, Github } from "lucide-react";
import type { Metadata } from "next";
import { WechatQrButton } from "@/components/about/WechatQrButton";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "zh" ? "关于我" : "About Me",
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");

  const contents = await prisma.pageContent.findMany();
  const pc: Record<string, string> = {};
  for (const c of contents) {
    pc[c.pageKey] = c.content;
  }

  const bio = locale === "en" ? (pc.about_bio_en || pc.about_bio) : pc.about_bio;
  const avatar = pc.about_avatar;
  const email = pc.contact_email;
  const github = pc.contact_github;
  const wechatQr = pc.contact_wechat_qr;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">

      {/* 头像 + 简介 */}
      <AnimatedSection>
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-14">
          {avatar && (
            <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-2xl border border-border/60">
              <Image src={avatar} alt="avatar" fill className="object-cover" sizes="224px" />
            </div>
          )}
          <div className="flex flex-col justify-center text-center sm:text-left">
            <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>
            <p className="text-base leading-8 text-muted-foreground">{bio}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* 联系方式 */}
      <AnimatedSection delay={0.2}>
        <div className="mt-16 border-t border-border/50 pt-12">
          <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
            {t("contact")}
          </p>
          <div className="flex flex-wrap gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/30 px-5 py-3 text-sm text-muted-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>{email}</span>
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/30 px-5 py-3 text-sm text-muted-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground"
              >
                <Github className="h-4 w-4 shrink-0" />
                <span>GitHub</span>
              </a>
            )}
            {wechatQr && <WechatQrButton qrUrl={wechatQr} label={t("wechat")} />}
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
