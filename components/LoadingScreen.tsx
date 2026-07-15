"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ isVideoReady = true }: { isVideoReady?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // The cinematic letter sweep animation takes exactly 3.0 seconds
    const timer = setTimeout(() => setMinTimeElapsed(true), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // Only exit the loading screen when the 3s animation finishes AND the video is fully buffered
    if (minTimeElapsed && isVideoReady) {
      setIsLoading(false);
      document.body.style.overflow = "";
    }
  }, [minTimeElapsed, isVideoReady]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1, ease: "linear" }}
          aria-hidden="true"
        >
          <div className="relative flex justify-center w-[clamp(320px,48vw,760px)] mx-auto">

            {/* Unpowered Base Logo - dictated height */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/VOLTX.svg"
              alt="VOLTX Logo Base"
              className="w-full h-auto opacity-[0.05]"
            />

            {/* Masked Container: Light only exists exactly inside the letters V-O-L-T-X */}
            <div
              className="absolute inset-0 w-full h-full mask-glow-container"
              style={{
                WebkitMaskImage: "url('/VOLTX.svg')",
                maskImage: "url('/VOLTX.svg')",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            >
              {/* Final solid fill that fades in to keep the logo powered */}
              <div className="absolute inset-0 bg-white sweep-solid-fill" />

              {/* The bright laser highlight that sweeps left to right */}
              <div className="absolute top-0 bottom-0 w-[40%] bg-white blur-[8px] sweep-laser-bar" />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
