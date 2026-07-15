"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";
import HeroContent from "@/components/HeroContent";

// Dynamic imports for canvas components (no SSR needed)
const SmokeBackground = dynamic(
  () => import("@/components/SmokeBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen />

      {/* Background Effects */}
      <SmokeBackground />

      {/* Main Content */}
      <main id="main-content" role="main">
        <HeroContent />
      </main>
    </>
  );
}
