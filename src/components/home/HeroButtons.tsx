"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

/* ── Equalizer — canvas-drawn bouncing bars ── */
function MusicEqualizer({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const size = 120;
    canvas.width = size;
    canvas.height = size;

    const bars = 5;
    const barW = 6;
    const gap = 4;
    const totalW = bars * barW + (bars - 1) * gap;
    const startX = (size - totalW) / 2;
    const baseY = size * 0.75;
    const maxH = size * 0.55;
    // Each bar has its own phase and speed
    const phases = [0, 0.7, 1.4, 0.3, 1.1];
    const speeds = [4.2, 5.5, 3.8, 6.0, 4.8];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      for (let i = 0; i < bars; i++) {
        const x = startX + i * (barW + gap);
        let h: number;
        if (playing) {
          const wave = (Math.sin(t * speeds[i] + phases[i]) + 1) / 2;
          h = maxH * 0.15 + wave * maxH * 0.85;
        } else {
          h = maxH * 0.12;
        }
        const y = baseY - h;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, 2);
        ctx.fillStyle = playing ? "#1a1a1a" : "#1a1a1a";
        ctx.fill();
      }

      t += 0.016;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ borderRadius: "50%" }}
    />
  );
}

/* ── Menu Dropdown — left edge aligns with music circle ── */
function MenuDropdown({ onClose }: { onClose: () => void }) {
  const locale = useLocale();
  const router = useRouter();

  const items = [
    { label: "HOME", path: `/${locale}` },
    { label: "ABOUT ME", path: `/${locale}/about` },
    { label: "BLOG", path: `/${locale}/blog` },
    { label: "CONTACT", path: `/${locale}/contact` },
  ];

  return (
    <div
      className="absolute top-full mt-4 overflow-hidden rounded-2xl py-3"
      style={{
        left: 0,
        width: "100%",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          className="block w-full text-left font-semibold tracking-wider text-gray-700 transition-colors hover:bg-gray-100 hover:text-black"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            fontSize: "clamp(1.3rem, 2.2vw, 1.7rem)",
            padding: "clamp(0.9rem, 1.5vw, 1.3rem) clamp(1.5rem, 2.5vw, 2rem)",
          }}
          onClick={() => {
            router.push(item.path);
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ── Main Buttons Component ── */
export function HeroButtons() {
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bgmUrl, setBgmUrl] = useState<string | null>(null);
  const hasInteracted = useRef(false);

  // Fetch BGM URL from settings
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.home_bgm_url) setBgmUrl(data.home_bgm_url);
      })
      .catch(() => {});
  }, []);

  // Create audio element and auto-play
  useEffect(() => {
    if (!bgmUrl) return;

    const audio = new Audio(bgmUrl);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Try to auto-play
    const tryPlay = () => {
      audio.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        // Browser blocked autoplay, wait for user interaction
      });
    };

    tryPlay();

    // If autoplay blocked, play on first user interaction
    const handleInteraction = () => {
      if (hasInteracted.current) return;
      hasInteracted.current = true;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [bgmUrl]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      // No audio loaded — just toggle visual state
      setPlaying((p) => !p);
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing]);

  const handleEmail = () => {
    window.location.href = "mailto:2300078818@qq.com";
  };

  return (
    <div className="absolute right-10 top-8 z-20 sm:right-14 sm:top-10 md:right-16 md:top-12">
      <div className="relative flex items-center gap-4">
        {/* Music Button — white+equalizer when playing, dark+triangle when paused */}
        <button
          onClick={toggleMusic}
          className="relative flex-shrink-0 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            width: "clamp(2.6rem, 4.8vw, 3.8rem)",
            height: "clamp(2.6rem, 4.8vw, 3.8rem)",
            background: playing ? "#ffffff" : "#333333",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
          title={playing ? "Pause music" : "Play music"}
        >
          {playing ? (
            <MusicEqualizer playing={playing} />
          ) : (
            /* Play triangle */
            <svg
              viewBox="0 0 24 24"
              className="absolute inset-0 m-auto"
              style={{ width: "40%", height: "40%" }}
            >
              <polygon points="8,5 20,12 8,19" fill="#ffffff" />
            </svg>
          )}
        </button>

        {/* LET'S TALK — solid dark pill */}
        <button
          onClick={handleEmail}
          className="flex-shrink-0 rounded-full text-white transition-transform hover:scale-105 active:scale-95"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            fontSize: "clamp(0.85rem, 1.6vw, 1.2rem)",
            padding: "clamp(0.55rem, 1.1vw, 0.85rem) clamp(1.5rem, 2.8vw, 2.2rem)",
            fontWeight: 600,
            letterSpacing: "0.12em",
            background: "#333333",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          LET&apos;S TALK
        </button>

        {/* MENU — solid white pill */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex-shrink-0 rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{
            fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
            fontSize: "clamp(0.85rem, 1.6vw, 1.2rem)",
            padding: "clamp(0.55rem, 1.1vw, 0.85rem) clamp(1.5rem, 2.8vw, 2.2rem)",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#1a1a1a",
            background: "#ffffff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          MENU
        </button>

        {/* Dropdown spans full width of button group */}
        {menuOpen && <MenuDropdown onClose={() => setMenuOpen(false)} />}
      </div>
    </div>
  );
}
