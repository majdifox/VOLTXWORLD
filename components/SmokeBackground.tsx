"use client";

import { useEffect, useRef } from "react";

export default function SmokeBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Cinematic slow-mo as requested
    video.playbackRate = 0.4;

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeLeft = video.duration - video.currentTime;
      const fadeDuration = 1.5; // 1.5 seconds fade to hide the cut

      // Base opacity is 0.8 for cinematic presence
      const baseOpacity = 0.8;

      if (timeLeft < fadeDuration) {
        // Fade out to black at the end to hide the harsh cut
        video.style.opacity = String(Math.max(0, timeLeft / fadeDuration) * baseOpacity);
      } else {
        // Instantly visible at base opacity (no initial fade-in needed since we wait for loading screen)
        video.style.opacity = String(baseOpacity);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        backgroundColor: "#000000",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.8, // Starts instantly visible
          transition: "opacity 0.1s linear",
        }}
      >
        <source src="/smoke-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
