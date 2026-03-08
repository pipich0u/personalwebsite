"use client";

import { useEffect } from "react";

const CAT_URL = "/freecat.png";
const CAT_SIZE = 130;
const MAX_SPEED = 1.2;
const ACCELERATION = 0.03;
const FRICTION = 0.88;

// Cat states
type State = "walking" | "sitting" | "idle";

export function FreeCat() {
  useEffect(() => {
    const isReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    Object.assign(el.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "2147483646",
      width: `${CAT_SIZE}px`,
      height: `${CAT_SIZE}px`,
    });

    const img = document.createElement("img");
    img.src = CAT_URL;
    Object.assign(img.style, {
      width: `${CAT_SIZE}px`,
      height: `${CAT_SIZE}px`,
      display: "block",
      mixBlendMode: "multiply",
      transition: "transform 0.2s",
    });
    el.appendChild(img);
    document.body.appendChild(el);

    let posX = Math.random() * (window.innerWidth - CAT_SIZE);
    let posY = Math.random() * (window.innerHeight - CAT_SIZE);
    let vx = 0;
    let vy = 0;
    let targetX = posX;
    let targetY = posY;
    let state: State = "idle";
    let stateTimer = 0;

    el.style.left = `${posX}px`;
    el.style.top = `${posY}px`;

    function pickNewTarget() {
      const margin = 40;
      targetX = margin + Math.random() * (window.innerWidth - CAT_SIZE - margin * 2);
      targetY = margin + Math.random() * (window.innerHeight - CAT_SIZE - margin * 2);
      state = "walking";
      // Walk for a random duration then sit/idle
      stateTimer = 180 + Math.floor(Math.random() * 240);
    }

    function startResting() {
      state = Math.random() > 0.4 ? "sitting" : "idle";
      stateTimer = 150 + Math.floor(Math.random() * 300);
    }

    // Start with a short idle before first walk
    stateTimer = 60;

    let rafId: number;

    function tick() {
      stateTimer--;

      if (state === "walking") {
        const dx = targetX - posX;
        const dy = targetY - posY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 20) {
          const targetVx = (dx / dist) * MAX_SPEED;
          const targetVy = (dy / dist) * MAX_SPEED;
          vx += (targetVx - vx) * ACCELERATION;
          vy += (targetVy - vy) * ACCELERATION;
        } else {
          vx *= FRICTION;
          vy *= FRICTION;
        }

        // Arrived or timer ran out → rest
        if (dist < 15 || stateTimer <= 0) {
          startResting();
        }
      } else {
        // Sitting or idle — decelerate
        vx *= FRICTION;
        vy *= FRICTION;

        if (stateTimer <= 0) {
          pickNewTarget();
        }
      }

      posX += vx;
      posY += vy;
      posX = Math.min(Math.max(0, posX), window.innerWidth - CAT_SIZE);
      posY = Math.min(Math.max(0, posY), window.innerHeight - CAT_SIZE);
      el.style.left = `${posX}px`;
      el.style.top = `${posY}px`;

      // Flip based on movement direction
      if (Math.abs(vx) > 0.05) {
        img.style.transform = vx < 0 ? "scaleX(-1)" : "scaleX(1)";
      }

      rafId = requestAnimationFrame(tick);
    }

    // Kick off first walk after short pause
    setTimeout(pickNewTarget, 1000);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      el.remove();
    };
  }, []);

  return null;
}
