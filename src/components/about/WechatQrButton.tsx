"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, X } from "lucide-react";

interface WechatQrButtonProps {
  qrUrl: string;
  label: string;
}

export function WechatQrButton({ qrUrl, label }: WechatQrButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-muted/30 px-5 py-3 text-sm text-muted-foreground transition-all hover:border-border hover:bg-muted hover:text-foreground"
      >
        <MessageCircle className="h-5 w-5" />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative rounded-2xl bg-background p-4 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 rounded-full p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="mb-4 text-center text-sm font-medium">{label}</p>
            <div className="relative h-44 w-44 sm:h-52 sm:w-52">
              <Image src={qrUrl} alt="WeChat QR" fill className="object-contain" sizes="208px" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
