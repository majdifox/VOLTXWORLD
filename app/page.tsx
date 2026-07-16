"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroContent from "@/components/HeroContent";

const LazySmokeBackground = dynamic(
  () => import("@/components/SmokeBackground"),
  { ssr: false }
);

export type IntroPhase = "intro" | "reveal" | "done";

export default function Home() {
  const [phase, setPhase] = useState<IntroPhase>("intro");

  useEffect(() => {
    // Lock scroll during intro
    document.body.style.overflow = "hidden";

    // 0.0s - 1.3s: pure smoke fading in, viewer absorbs atmosphere
    const tReveal = setTimeout(() => {
      setPhase("reveal");
    }, 1300);

    // 1.3s - 3.7s: logo fades in (2.4s fade).
    // 3.7s - 4.3s: logo holds for 0.6s at full opacity.
    // 4.3s: phase="done" -> metal sheen fires, below-fold content fades in.
    const tDone = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 2300);

    return () => {
      clearTimeout(tReveal);
      clearTimeout(tDone);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <LazySmokeBackground />
      <main id="main-content" role="main">
        <HeroContent phase={phase} />
      </main>
    </>
  );
}
