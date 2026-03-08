"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface HeroSectionProps {
  slogan?: string;
  subtitle?: string;
}

export function HeroSection({ slogan, subtitle }: HeroSectionProps) {
  const t = useTranslations("home");
  const locale = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  const displaySlogan = slogan || t("slogan");
  const displaySubtitle = subtitle || t("subtitle");

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const contentX = useTransform(springX, [-1, 1], [-8, 8]);
  const contentY = useTransform(springY, [-1, 1], [-5, 5]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handler = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    section.addEventListener("mousemove", handler);
    return () => section.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen items-center justify-center overflow-hidden bg-white"
    >
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute h-[400px] w-[400px] rounded-full blur-[80px] sm:h-[600px] sm:w-[600px] sm:blur-[100px] md:h-[900px] md:w-[900px] md:blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(199,210,254,0.45) 0%, transparent 70%)",
            top: "-20%", left: "-10%",
          }}
          animate={{ x: [0, 50, -20, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-[300px] w-[300px] rounded-full blur-[60px] sm:h-[500px] sm:w-[500px] sm:blur-[80px] md:h-[700px] md:w-[700px] md:blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(216,180,254,0.30) 0%, transparent 70%)",
            bottom: "-15%", right: "-5%",
          }}
          animate={{ x: [0, -40, 25, 0], y: [0, 30, -40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        <motion.div
          className="absolute h-[200px] w-[200px] rounded-full blur-[50px] sm:h-[350px] sm:w-[350px] sm:blur-[60px] md:h-[500px] md:w-[500px] md:blur-[80px]"
          style={{
            background: "radial-gradient(circle, rgba(165,214,255,0.25) 0%, transparent 70%)",
            top: "40%", left: "55%",
          }}
          animate={{ x: [0, 30, -15, 0], y: [0, -20, 35, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        />
      </div>

      {/* Content with parallax */}
      <motion.div
        style={{ x: contentX, y: contentY }}
        className="relative z-10 px-4 text-center"
      >
        {/* Pre-title label */}
        <motion.div
          className="mb-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">
            {locale === "zh" ? "个人空间" : "Personal Space"}
          </span>
        </motion.div>

        {/* Main headline */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[5.5rem] lg:leading-[1.08]">
          {displaySlogan.split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block cursor-default select-none"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.045, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          className="mb-12 text-sm tracking-[0.25em] text-muted-foreground sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {displaySubtitle}
        </motion.p>

        {/* Divider */}
        <motion.div
          className="mx-auto mb-12 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        />

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          <Link href={`/${locale}/blog`} className="rounded-full bg-neutral-900 px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-900/20 hover:-translate-y-0.5">
            {locale === "zh" ? "浏览博客" : "Read Blog"}
          </Link>
          <Link href={`/${locale}/about`} className="rounded-full border border-neutral-200 bg-white/60 px-7 py-3 text-sm font-medium text-neutral-600 backdrop-blur-sm transition-all duration-300 hover:border-neutral-400 hover:text-neutral-900 hover:-translate-y-0.5 hover:shadow-md">
            {locale === "zh" ? "关于我" : "About Me"}
          </Link>
        </motion.div>
      </motion.div>

    </section>
  );
}
