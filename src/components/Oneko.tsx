"use client";

import { useEffect } from "react";

const SPRITE_URL = "/oneko.gif";
const DOG_SIZE = 180;
const MAX_SPEED = 0.9;
const ACCELERATION = 0.025; // how quickly it speeds up (0–1)
const FRICTION = 0.80;      // how quickly it slows down (0–1)
const STOP_DISTANCE = 60;

export function Oneko() {
  useEffect(() => {
    const isReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    Object.assign(el.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "2147483647",
      left: "100px",
      top: `${window.innerHeight - DOG_SIZE - 20}px`,
      width: `${DOG_SIZE}px`,
      height: `${DOG_SIZE}px`,
    });

    const img = document.createElement("img");
    img.src = SPRITE_URL;
    Object.assign(img.style, {
      width: `${DOG_SIZE}px`,
      height: `${DOG_SIZE}px`,
      display: "block",
    });
    el.appendChild(img);
    document.body.appendChild(el);

    let posX = 100;
    let posY = window.innerHeight - DOG_SIZE - 20;
    let mouseX = posX;
    let mouseY = posY;
    let vx = 0;
    let vy = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    let rafId: number;

    function tick() {
      const dx = mouseX - (posX + DOG_SIZE / 2);
      const dy = mouseY - (posY + DOG_SIZE / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > STOP_DISTANCE) {
        // Accelerate toward cursor
        const targetVx = (dx / dist) * MAX_SPEED;
        const targetVy = (dy / dist) * MAX_SPEED;
        vx += (targetVx - vx) * ACCELERATION;
        vy += (targetVy - vy) * ACCELERATION;
      } else {
        // Decelerate when close
        vx *= FRICTION;
        vy *= FRICTION;
      }

      posX += vx;
      posY += vy;
      posX = Math.min(Math.max(0, posX), window.innerWidth - DOG_SIZE);
      posY = Math.min(Math.max(0, posY), window.innerHeight - DOG_SIZE);
      el.style.left = `${posX}px`;
      el.style.top = `${posY}px`;

      if (Math.abs(vx) > 0.1) {
        img.style.transform = vx < 0 ? "scaleX(-1)" : "scaleX(1)";
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      el.remove();
    };
  }, []);

  return null;
}
