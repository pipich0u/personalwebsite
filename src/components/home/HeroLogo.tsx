"use client";

export function HeroLogo() {
  return (
    <div className="absolute left-10 top-8 z-20 select-none sm:left-14 sm:top-10 md:left-16 md:top-12">
      <div
        className="flex items-baseline gap-[0.4em] text-[clamp(2.2rem,5vw,4rem)] font-bold leading-none"
        style={{
          fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
          color: "rgba(255,255,255,0.92)",
          filter: "drop-shadow(0 0 12px rgba(255,255,255,0.15))",
          letterSpacing: "0.08em",
          fontStyle: "italic",
          transform: "skewX(-6deg)",
        }}
      >
        <span>FANYAO</span>
        <span
          className="text-[0.35em] font-medium tracking-[0.2em] uppercase"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontStyle: "italic",
          }}
        >
          JustDiving
        </span>
      </div>
    </div>
  );
}
