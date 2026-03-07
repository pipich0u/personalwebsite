"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const S = 9; // stroke width base
const C = "#1a1a1a";

function DogSVG({ flip }: { flip: boolean }) {
  const run = { duration: 0.30, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <svg
      width="200"
      height="165"
      viewBox="0 0 200 165"
      fill="none"
      stroke={C}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `scaleX(${flip ? -1 : 1})`, display: "block" }}
    >
      {/* ── Left ear (C-shape, upper-left) ── */}
      <path d="M 46,58 Q 24,44 26,28 Q 30,16 46,26" strokeWidth={S} />

      {/* ── Upper head arc (connects ears) ── */}
      <path d="M 46,26 Q 62,12 85,14 Q 105,8 122,16" strokeWidth={S} />

      {/* ── Right ear (hook shape, upper-right) ── */}
      <path d="M 128,20 Q 152,6 156,28 Q 157,42 144,40" strokeWidth={S} />

      {/* ── Right body side ── */}
      <path d="M 152,42 Q 170,58 166,84 Q 162,104 148,114" strokeWidth={S} />

      {/* ── Bottom body arc ── */}
      <path d="M 148,114 Q 122,128 96,126 Q 70,124 54,116" strokeWidth={S} />

      {/* ── Left body side ── */}
      <path d="M 44,62 Q 30,78 34,98 Q 38,112 54,116" strokeWidth={S} />

      {/* ── Face: left eye ── */}
      <circle cx="90" cy="72" r="5.5" fill={C} stroke="none" />

      {/* ── Face: right eye ── */}
      <circle cx="118" cy="67" r="4" fill={C} stroke="none" />

      {/* ── Nose bridge ── */}
      <path d="M 106,78 L 100,86 M 106,78 L 113,86" strokeWidth="4.5" />

      {/* ── Tongue ── */}
      <path d="M 98,90 Q 106,102 114,90" stroke="#c87070" strokeWidth="7" fill="none" />

      {/* ── Right cheek line ── */}
      <path d="M 140,58 Q 158,72 152,92" strokeWidth="7" />

      {/* ── Front-left leg + paw (animates) ── */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
        animate={{ rotate: [-22, 22, -22] }}
        transition={run}
      >
        <path d="M 52,114 Q 36,128 24,148" strokeWidth={S} />
        <path d="M 18,150 Q 26,158 38,152" strokeWidth="8" />
      </motion.g>

      {/* ── Front-right leg + paw (opposite phase) ── */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
        animate={{ rotate: [22, -22, 22] }}
        transition={run}
      >
        <path d="M 68,116 Q 56,132 50,150" strokeWidth={S} />
        <path d="M 44,152 Q 52,160 64,153" strokeWidth="8" />
      </motion.g>

      {/* ── Back-left leg + paw ── */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
        animate={{ rotate: [22, -22, 22] }}
        transition={run}
      >
        <path d="M 120,122 Q 132,136 136,152" strokeWidth={S} />
        <path d="M 130,154 Q 140,161 152,154" strokeWidth="8" />
      </motion.g>

      {/* ── Back-right leg + paw (opposite phase) ── */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center top" }}
        animate={{ rotate: [-22, 22, -22] }}
        transition={run}
      >
        <path d="M 142,120 Q 156,132 162,148" strokeWidth={S} />
        <path d="M 156,150 Q 165,157 176,150" strokeWidth="8" />
      </motion.g>
    </svg>
  );
}

export function PomeranianDog() {
  const controls = useAnimation();
  const [flip, setFlip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);
  const posRef = useRef(100);

  useEffect(() => {
    cancelledRef.current = false;
    const DOG_W = 200;
    const MARGIN = 16;
    const SPEED = 90;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const walk = async () => {
      while (!cancelledRef.current) {
        const w = containerRef.current?.offsetWidth ?? window.innerWidth;
        const max = w - DOG_W - MARGIN;
        const min = MARGIN;

        // move right
        const rt = max - Math.random() * 60;
        setFlip(true);
        await controls.start({ x: rt, transition: { duration: Math.abs(rt - posRef.current) / SPEED, ease: "linear" } });
        if (cancelledRef.current) break;
        posRef.current = rt;
        await sleep(700 + Math.random() * 1200);
        if (cancelledRef.current) break;

        // move left
        const lt = min + Math.random() * 60;
        setFlip(false);
        await controls.start({ x: lt, transition: { duration: Math.abs(posRef.current - lt) / SPEED, ease: "linear" } });
        if (cancelledRef.current) break;
        posRef.current = lt;
        await sleep(700 + Math.random() * 1200);
        if (cancelledRef.current) break;
      }
    };

    walk();
    return () => { cancelledRef.current = true; controls.stop(); };
  }, [controls]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-x-0 bottom-0 h-44">
      <motion.div animate={controls} initial={{ x: 100 }} className="absolute bottom-0">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.30, repeat: Infinity, ease: "easeInOut" }}
        >
          <DogSVG flip={flip} />
        </motion.div>
      </motion.div>
    </div>
  );
}
