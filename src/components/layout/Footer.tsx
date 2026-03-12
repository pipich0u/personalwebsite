"use client";

import { Github, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on homepage
  const isHome = pathname === "/zh" || pathname === "/zh/" || pathname === "/en" || pathname === "/en/";
  if (isHome) return null;

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 范遥. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="mailto:2300078818@qq.com"
            className="p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
