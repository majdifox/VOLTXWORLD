"use client";

import { motion, type Variants } from "framer-motion";
import type { IntroPhase } from "@/app/page";

// ─── Below-the-fold content animation variants ────────────────────────────────
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.16, delayChildren: 0.2 },
  },
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease },
  },
};

const fadeLine: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.0, ease },
  },
};

interface HeroContentProps {
  phase: IntroPhase;
}

export default function HeroContent({ phase }: HeroContentProps) {
  const logoSize = "clamp(320px, 48vw, 760px)";

  // Logo fades in when the initial smoke intro finishes
  const logoVisible = phase === "reveal" || phase === "done";
  // Sheen only plays after logo is fully faded in (phase "done")
  const sheenActive = phase === "done";
  // Body content appears only after the intro is completely done
  const contentVisible = phase === "done";

  return (
    <div className="content-layer w-full">
      {/*
        ── Hero viewport section ──────────────────────────────────────────────
        The logo is ALWAYS in the DOM. It never remounts.
        During "intro" it is invisible (opacity 0).
        When phase → "reveal", the logo fades in via CSS over 2.4s.
        It sits at z-index 10, perfectly atop the persistent smoke background.
      */}
      <div className="relative flex h-screen w-full flex-col items-center justify-center">

        {/* Atmospheric ambient glow — very subtle, fades in with the logo */}
        <div
          className="radial-glow absolute pointer-events-none"
          style={{
            opacity: logoVisible ? 1 : 0,
            transition: logoVisible
              ? "opacity 3s cubic-bezier(0.25, 0.1, 0.25, 1) 0.5s"
              : "none",
          }}
        />

        {/*
          ── The single, permanent VOLTX™ logo ────────────────────────────────
          Rules:
            • perfectly static
            • no transforms, scales, rotations, wobbles, or sub-pixel shifts
            • ONLY opacity changes
        */}
        <header
          aria-label="VOLTX™"
          style={{
            position: "relative",
            width: logoSize,
            // flexShrink prevents any layout-driven resize
            flexShrink: 0,
            zIndex: 10,
            // Explicit transform: none prevents any inherited or browser transform
            transform: "none",
          }}
        >
          {/*
            The logo image.
            opacity is the ONLY property that ever changes on this element.
            Transition is a single long ease — cinematic, not abrupt.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/VOLTX.svg"
            alt="VOLTX™"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              // Static — never changes position
              transform: "none",
              // The reveal: a single clean opacity fade.
              opacity: logoVisible ? 1 : 0,
              transition: logoVisible
                ? "opacity 2.4s cubic-bezier(0.25, 0.1, 0.25, 1)"
                : "none",
              willChange: "opacity",
              // Gentle permanent glow — feels metallic, not digital
              filter: "drop-shadow(0 2px 24px rgba(255,255,255,0.12))",
              // Prevent sub-pixel rendering artifacts
              backfaceVisibility: "hidden",
            }}
          />

          {/*
            ── Metallic sheen sweep ───────────────────────────────────────────
            This overlay sits exactly on top of the logo, masked to the logo shape.
            It paints a soft studio reflection that travels V → X once the logo
            is fully visible.
          */}
          {sheenActive && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                // Mask the sheen to the letter shapes — only letters get the reflection
                WebkitMaskImage: "url('/VOLTX.svg')",
                maskImage: "url('/VOLTX.svg')",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                // Overflow hidden keeps the moving gradient inside the mask boundary
                overflow: "hidden",
                // Sheen fades in gently then plays
                animation: "sheenFadeIn 0.6s ease forwards",
              }}
            >
              {/* The moving reflection gradient */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  // Wider than the container so it fully enters and exits
                  left: "-60%",
                  width: "60%",
                  // Soft radial studio-light reflection — no hard edges
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.32) 45%, rgba(255,255,255,0.44) 50%, rgba(255,255,255,0.32) 55%, rgba(255,255,255,0.04) 80%, transparent 100%)",
                  // Single left-to-right sweep — no repeat, no loop
                  animation: "metalSheen 2.0s cubic-bezier(0.25, 0.1, 0.25, 1) 0.6s forwards",
                  willChange: "transform",
                }}
              />
            </div>
          )}
        </header>
      </div>

      {/*
        ── Below-the-fold content ─────────────────────────────────────────────
        Mounts only after the overlay is fully gone (phase === "done").
        Animates in with a simple fade — no transform, no slide.
      */}
      {contentVisible && (
        <motion.div
          // Use pt-4 so the tagline sits very close to the logo
          className="flex flex-col items-center justify-center px-6 pb-24 pt-4 text-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline */}
          <motion.h2
            variants={fadeUp}
            className="mb-10 text-[clamp(1.75rem,3.5vw,3rem)] font-light tracking-wide text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Build Your World
          </motion.h2>

          {/* Mission */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mb-20 max-w-[800px] text-[clamp(1.1rem,1.8vw,1.35rem)] font-light leading-[1.8] tracking-wide text-white"
          >
            VOLTX™&apos;s mission is to bridge the gap between curiosity and action,
            empowering people to discover new opportunities, build meaningful
            connections, and find where they truly belong.
          </motion.p>

          {/* Launching Soon */}
          <motion.div variants={fadeUp} className="mb-24">
            <span
              className="inline-block text-[0.85rem] uppercase tracking-[0.4em] text-white opacity-80"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              LAUNCHING SOON
            </span>
          </motion.div>

          {/* Created By & Signature */}
          <motion.div variants={fadeUp} className="mb-24 flex flex-col items-center justify-center">
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.3em] text-white opacity-50">
              Created by
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/majdi-signature.svg"
              alt="Mehdi Majdi Signature"
              // Adjust height as needed. Use filter to ensure it displays as white if the original is black.
              className="h-14 w-auto object-contain opacity-90"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </motion.div>

          {/* Morocco Line */}
          <motion.div
            variants={fadeUp}
            className="mb-20 flex flex-wrap items-center justify-center gap-4 text-[0.8rem] tracking-widest text-white opacity-60"
          >
            <span>Built in Morocco.</span>
            {/* Small inline Moroccan Flag SVG */}
            <svg
              viewBox="0 0 900 600"
              className="h-[14px] w-auto rounded-[2px] shadow-sm"
              aria-label="Flag of Morocco"
              role="img"
            >
              <rect width="900" height="600" fill="#c1272d" />
              <polygon
                points="450,150 478,284 602,274 507,358 541,489 450,402 359,489 393,358 298,274 422,284"
                fill="none"
                stroke="#006233"
                strokeWidth="25"
                strokeLinejoin="miter"
              />
            </svg>
            <span>Designed for the world.</span>
          </motion.div>

          {/* Copyright */}
          <motion.footer variants={fadeUp} role="contentinfo">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white opacity-30">
              © 2026 VOLTX®. All rights reserved.
            </p>
          </motion.footer>
        </motion.div>
      )}
    </div>
  );
}
