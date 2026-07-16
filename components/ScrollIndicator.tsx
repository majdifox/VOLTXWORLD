"use client";

import { useEffect, useState } from "react";

interface ScrollIndicatorProps {
  /** Element id to scroll to when clicked */
  targetId: string;
  /** Only render once the intro/reveal sequence has finished */
  show: boolean;
}

export default function ScrollIndicator({ targetId, show }: ScrollIndicatorProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visible = show && !scrolled;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to our mission"
      className="fixed bottom-8 right-6 z-20 flex flex-col items-center gap-3 sm:bottom-10 sm:right-8"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
    >
      <span
        className="text-[0.6rem] uppercase tracking-[0.35em] text-white opacity-50"
        style={{
          writingMode: "vertical-rl",
          fontFamily: "var(--font-heading)",
        }}
      >
        Scroll
      </span>

      <span
        aria-hidden="true"
        className="relative block h-10 w-px overflow-hidden bg-white/20"
      >
        <span
          className="absolute left-0 top-0 h-2.5 w-px bg-white/80"
          style={{ animation: "scrollDotMove 2.2s ease-in-out infinite" }}
        />
      </span>
    </button>
  );
}