"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const section = sectionRef.current?.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <div ref={sectionRef} className="contents">
      <motion.div
        className="pointer-events-none absolute z-0 h-[600px] w-[600px] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.07) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute z-0 h-[220px] w-[220px] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.05) 50%, transparent 80%)",
        }}
      />
    </div>
  );
}
