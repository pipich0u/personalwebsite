import type { Metadata } from "next";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { Oneko } from "@/components/Oneko";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }

  const title = map.site_title || "范遥的个人空间";
  const description = map.site_description || "探索 · 记录 · 分享";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Oneko />
      </body>
    </html>
  );
}
