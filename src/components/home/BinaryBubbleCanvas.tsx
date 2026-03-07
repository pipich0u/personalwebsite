"use client";

import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  speed: number;
  char: string;
  size: number;
  baseOpacity: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  wobbleAmplitude: number;
}

export function BinaryBubbleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let bubbles: Bubble[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createBubble = (startY?: number): Bubble => ({
      x: Math.random() * canvas.width,
      y: startY ?? canvas.height + Math.random() * 80,
      speed: 0.25 + Math.random() * 0.65,
      char: Math.random() > 0.5 ? "0" : "1",
      size: 11 + Math.random() * 10,
      baseOpacity: 0.07 + Math.random() * 0.11,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.25 + Math.random() * 0.4,
      wobbleAmplitude: 12 + Math.random() * 22,
    });

    const initBubbles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      bubbles = Array.from({ length: count }, () =>
        createBubble(Math.random() * canvas.height)
      );
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.speed;

        // progress: 0 = bottom, 1 = top
        const progress = 1 - b.y / canvas.height;

        // fade in from bottom (0–20%), full in middle, fade out near top (75–100%)
        let alpha = b.baseOpacity;
        if (progress < 0.20) {
          alpha *= progress / 0.20;
        } else if (progress > 0.72) {
          alpha *= Math.max(0, (1 - progress) / 0.28);
        }

        const wx = b.x + Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * b.wobbleAmplitude;

        ctx.globalAlpha = Math.max(0, alpha);
        ctx.font = `${b.size}px ui-monospace, monospace`;
        ctx.fillStyle = "rgb(50, 60, 90)";
        ctx.fillText(b.char, wx, b.y);

        if (b.y < -20) {
          bubbles[i] = createBubble();
        }
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    resize();
    initBubbles();
    animate();

    const onResize = () => { resize(); initBubbles(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
