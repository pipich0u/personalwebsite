"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
  speed: number;
}

export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let points: Point[] = [];
    let prevX = -100;
    let prevY = -100;
    let animId: number;

    const MAX_AGE = 24;
    const MAX_POINTS = 60;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;
      const dx = mx - prevX;
      const dy = my - prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1) {
        // Dense interpolation for smooth curves
        const steps = Math.max(1, Math.min(Math.ceil(speed / 3), 10));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          points.push({
            x: prevX + dx * t,
            y: prevY + dy * t,
            age: 0,
            speed: Math.min(speed, 100),
          });
        }
        if (points.length > MAX_POINTS) {
          points = points.slice(-MAX_POINTS);
        }
      }

      prevX = mx;
      prevY = my;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Age points
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].age++;
        if (points[i].age > MAX_AGE) {
          points.splice(i, 1);
        }
      }

      const len = points.length;
      if (len < 2) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // === Pass 1: Wide outer glow (LCD pressure halo) ===
      ctx.save();
      ctx.filter = "blur(10px)";
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < len - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[len - 1].x, points[len - 1].y);
      const newestLife = 1 - points[len - 1].age / MAX_AGE;
      ctx.strokeStyle = `hsla(260, 100%, 75%, ${newestLife * 0.1})`;
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();

      // === Pass 2: Mid glow ===
      ctx.save();
      ctx.filter = "blur(4px)";
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < len - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[len - 1].x, points[len - 1].y);
      ctx.strokeStyle = `hsla(265, 90%, 70%, ${newestLife * 0.18})`;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();

      // === Pass 3: Core trail with per-segment color/width ===
      for (let i = 1; i < len; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];

        const life0 = 1 - p0.age / MAX_AGE;
        const life1 = 1 - p1.age / MAX_AGE;
        const avgLife = (life0 + life1) / 2;
        const posRatio = i / len;

        const speedFactor = Math.min(p1.speed / 50, 1);
        const taper = posRatio * avgLife;
        const lineW = (1.2 + speedFactor * 2) * taper;

        if (lineW < 0.08 || avgLife < 0.02) continue;

        const alpha = avgLife * 0.75 * (0.2 + posRatio * 0.8);
        const hue = 230 + posRatio * 70;
        const sat = 80 + posRatio * 20;

        // Smooth segment using midpoint with neighbors
        ctx.beginPath();
        if (i === 1) {
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
        } else {
          const prev = points[i - 2];
          const mx0 = (prev.x + p0.x) / 2;
          const my0 = (prev.y + p0.y) / 2;
          const mx1 = (p0.x + p1.x) / 2;
          const my1 = (p0.y + p1.y) / 2;
          ctx.moveTo(mx0, my0);
          ctx.quadraticCurveTo(p0.x, p0.y, mx1, my1);
        }

        ctx.strokeStyle = `hsla(${hue}, ${sat}%, 65%, ${alpha})`;
        ctx.lineWidth = lineW;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Bright center line
        if (lineW > 0.5) {
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `hsla(${hue + 10}, 100%, 88%, ${alpha * 0.5})`;
          ctx.lineWidth = lineW * 0.3;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      // === Cursor hot spot — LCD pressure glow ===
      if (len > 2) {
        const last = points[len - 1];
        const life = 1 - last.age / MAX_AGE;
        if (life > 0.15) {
          const grad = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 10);
          grad.addColorStop(0, `hsla(270, 100%, 92%, ${life * 0.45})`);
          grad.addColorStop(0.3, `hsla(260, 90%, 72%, ${life * 0.2})`);
          grad.addColorStop(1, `hsla(250, 80%, 60%, 0)`);
          ctx.beginPath();
          ctx.arc(last.x, last.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
