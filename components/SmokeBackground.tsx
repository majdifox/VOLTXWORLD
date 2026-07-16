"use client";

import { useEffect, useRef, useState } from "react";

export default function SmokeBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Natural realistic speed, no slow-mo distortion
    video.playbackRate = 1.0;
    
    // We only fade it in once enough data is loaded so it doesn't pop
    const handleCanPlay = () => setIsLoaded(true);
    video.addEventListener("canplaythrough", handleCanPlay);
    // If it's already ready (cached), fire immediately
    if (video.readyState >= 3) setIsLoaded(true);

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
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
          // Subtle atmospheric background
          opacity: isLoaded ? 0.35 : 0,
          // Very slow, natural fade-in when the page loads
          transition: "opacity 4s cubic-bezier(0.25, 0.1, 0.25, 1)",
          willChange: "opacity",
        }}
      >
        <source src="/smoke-intro.mp4" type="video/mp4" />
        <source src="/smoke-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
