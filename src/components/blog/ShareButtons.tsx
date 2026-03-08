"use client";

import { Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  slug: string;
  locale: string;
}

export default function ShareButtons({ title, slug, locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/${locale}/blog/${slug}`
    : "";

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success(locale === "zh" ? "链接已复制" : "Link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      name: "X",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.044 1.613.115v3.146c-.427-.086-.964-.086-1.391-.086-1.978 0-2.748.747-2.748 2.687v1.696h3.996l-.685 3.667h-3.311v7.98C19.395 22.838 24 18.22 24 12.634 24 6.186 18.627.814 12.18.814S.361 6.186.361 12.634c0 5.001 3.645 9.15 8.74 10.057z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: locale === "zh" ? "微博" : "Weibo",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.642 4.318-.341 5.132-2.145.8-1.752-.148-3.71-2.161-4.183zM16.527 4.665c-2.419-.654-5.119.316-6.354 2.235-.171.266.035.596.337.63 1.429.161 3.698 1.03 3.698 1.03s.447-1.363 1.357-2.345c.91-.982 1.605-1.086 1.605-1.086.263-.073.372-.389.357-.464zM24 6.823c-.018-2.817-2.325-4.076-4.827-4.076-2.404 0-5.252 1.162-7.58 3.748-.366.407-.321 1.024.017 1.451 1.478 1.867 2.089 3.167 2.089 3.167-.036 0-3.016-1.281-5.423-.241-2.411 1.043-3.676 3.527-3.676 3.527-.9 1.903-.375 4.281 1.237 5.641 1.612 1.36 3.961 1.822 5.924 1.258 1.963-.564 3.618-2.035 4.505-3.844.887-1.808.672-3.906-.284-5.43 0 0 1.229.307 2.696-.02 1.467-.326 2.695-1.295 3.439-2.42.743-1.125 1.077-2.254.883-2.761z" />
        </svg>
      ),
      href: `https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground">
        {locale === "zh" ? "分享" : "Share"}:
      </span>
      <button
        onClick={copyLink}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        title={locale === "zh" ? "复制链接" : "Copy link"}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Link2 className="h-4 w-4" />}
      </button>
      {platforms.map((p) => (
        <a
          key={p.name}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title={p.name}
        >
          {p.icon}
        </a>
      ))}
    </div>
  );
}
