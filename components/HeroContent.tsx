"use client";

import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import type { IntroPhase } from "@/app/page";
import WaitlistForm from "./WaitlistForm";
import ScrollIndicator from "./ScrollIndicator";
import Footer from "./Footer";

// ─── Cinematic scroll-to-element ───────────────────────────────────────────
// Native `scrollIntoView({ behavior: "smooth" })` is linear and abrupt.
// This glides with the same ease-out-cubic curve used across the site, so
// arriving from the About page feels like part of the same choreography
// as the intro itself — slow start, soft landing, no snap.
function smoothScrollTo(target: HTMLElement, duration = 1400) {
  const startY = window.scrollY;
  // Center the element in the viewport rather than pinning it to the top —
  // reads calmer, more "presented to you" than "scrolled at".
const targetY =
  startY +
  target.getBoundingClientRect().top -
  window.innerHeight * 0.48 +   // 👈 was / 2 (i.e. 0.5), now 0.42
  target.getBoundingClientRect().height / 2;

  const distance = targetY - startY;
  const startTime = performance.now();

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ─── Below-the-fold content animation variants ────────────────────────────────
const container: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.5, // controls the delay between each item
      delayChildren: 0,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

interface HeroContentProps {
  phase: IntroPhase;
}

export default function HeroContent({ phase }: HeroContentProps) {
  // Completely responsive logo size: shrinks to 280px on tiny phones, caps at 820px on ultrawides
  const logoSize = "clamp(280px, 65vw, 820px)";

  // Logo fades in when the initial smoke intro finishes
  const logoVisible = phase === "reveal" || phase === "done";
  // Sheen only plays after logo is fully faded in (phase "done")
  const sheenActive = phase === "done";
  // Body content appears only after the intro is completely done
  const contentVisible = phase === "done";

  // ── Deep-link: arriving from /about with "Join the Waitlist" ────────────
  // Waits for the intro reveal to fully finish and the below-the-fold
  // content to settle into place before gliding down, so it reads as one
  // continuous, deliberate motion rather than a jarring jump-cut.
  useEffect(() => {
    if (!contentVisible) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollTo") !== "waitlist") return;

    const timer = setTimeout(() => {
      const el = document.getElementById("waitlist");
      if (el) smoothScrollTo(el);
      // Clean the URL so refreshing or sharing the link doesn't re-trigger it
      window.history.replaceState({}, "", window.location.pathname);
    }, 1600); // let the stagger sequence (tagline → mission → CTA → waitlist) land first

    return () => clearTimeout(timer);
  }, [contentVisible]);

  return (
    <div className="content-layer w-full">
      {/*
        ── Hero viewport section ──────────────────────────────────────────────
        The logo is ALWAYS in the DOM. It never remounts.
        During "intro" it is invisible (opacity 0).
        When phase → "reveal", the logo fades in via CSS over 2.4s.
        It sits at z-index 10, perfectly atop the persistent smoke background.
      */}
      <div className="relative flex h-screen w-full flex-col items-center justify-center -translate-y-6">

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

          {/*
            ── Typography & Footer ──────────────────────────────────────────────
            Mounts only after the overlay is fully gone (phase === "done").
            Absolutely positioned below the logo to ensure perfect 12-16px spacing
            without disrupting the logo's precise flex centering.
          */}
          {contentVisible && (
            <motion.div
              // Attach to bottom of the logo, center horizontally across the screen
              className="absolute left-1/2 top-full flex flex-col items-center pt-3 sm:pt-4"
              style={{
                width: "100vw",
                transform: "translateX(-50%)",
                // Push the footer exactly to the bottom of the viewport 
                // (50vh - 50% of the logo height is the remaining space to the bottom)
                minHeight: "calc(50vh - 50%)",
              }}
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <div
                id="mission-content"
                className="flex h-full w-full max-w-[1200px] flex-col items-center px-6 pb-2 pointer-events-auto text-center"
              >

                {/* Tagline */}
                {/* 
                {/* Tagline */}
                {/* 
                  ========================================================================
                  USER CONTROLS: TAGLINE ("Build Your World")
                  1. marginTop: We now use clamp() so it scales perfectly on phones AND monitors!
                     It pulls up by -80px on phones, and -240px on huge monitors.
                  2. marginBottom: Controls the distance between this tagline and the mission below it.
                  3. fontSize: You can use clamp() or exact sizes like "32px", "2rem".
                  4. fontFamily: Change the font/police here.
                  ========================================================================
                */}
                <motion.h2
                  variants={fadeUp}
                  className="font-light tracking-wide text-white"
                  style={{
                    fontFamily: "var(--font-heading)", /* <-- FONT (POLICE) */
                    fontSize: "clamp(0.9rem, 1.5vw, 1.25rem)", /* <-- SIZE */
                    marginTop: "clamp(-240px, -20vw, -80px)", /* <-- SCALES PROPERLY ON PHONES NOW! */
                    marginBottom: "clamp(30px, 8vw, 80px)", /* <-- CHANGE THIS TO PUSH DESCRIPTION FURTHER AWAY */
                  }}
                >
                  Build Your World
                </motion.h2>

                {/* Mission */}
                {/* 
                  ========================================================================
                  USER CONTROLS: MISSION PARAGRAPH
                  1. marginTop: If the tagline pulled this up too high, increase this (e.g., "40px") to push it down.
                  2. fontSize: Adjust the text size.
                  ========================================================================
                */}
                <motion.p
                  variants={fadeUp}
                  className="mx-auto max-w-[680px] px-4 font-light leading-[1.55] tracking-wide text-white sm:px-0"
                  style={{
                    fontFamily: "inherit", /* <-- FONT (POLICE). "inherit" uses the default font. */
                    fontSize: "clamp(0.95rem, 1.35vw, 1.1rem)", /* <-- SIZE */
                    marginTop: "0px", /* <-- INCREASE TO PUSH DOWN AWAY FROM TAGLINE */
                    marginBottom: "0px", /* <-- DISTANCE TO READ MORE LINK */
                  }}
                >
                  VOLTX&apos;s mission is to bridge the gap between curiosity and action,
                  empowering people to discover new opportunities, build meaningful
                  connections, and find where they truly belong.
                </motion.p>

                {/* Read More — links to the founder/about page */}
                {/*
                  ========================================================================
                  USER CONTROLS: READ MORE AFFORDANCE
                  1. No container/circle this time — text and arrow are sized to match
                     each other (h-4 w-4 arrow ≈ the cap-height of text-[0.9rem]), so
                     neither one dominates the other.
                  2. The arrow gently bounces left-right forever (x: [0, 4, 0]) instead
                     of the circle breathing — same "please notice me" job, quieter.
                     Delete the `animate` / `transition` props to make it static.
                  3. fontSize / tracking / opacity are all on the <span> below.
                  ========================================================================
                */}
                <motion.div variants={fadeUp} className="mb-12">
                  <Link
                    href="/about"
                    className="group relative inline-flex items-center gap-1.5"
                  >
                    <span className="relative leading-none text-[0.9rem] font-normal tracking-wide text-white/70 transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:text-white">
                      Learn more
                      {/* Underline — grows left to right on hover */}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-x-100"
                      />
                    </span>
                    <motion.svg
                      className="relative top-[1px] h-4 w-4 shrink-0 self-center text-white/70 transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </motion.svg>
                  </Link>
                </motion.div>

                {/* Launching Soon */}
                <motion.div variants={fadeUp} className="mb-12">
                  <span
                    className="inline-block text-[1.05rem] uppercase tracking-[0.4em] text-white opacity-95"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    LAUNCHING SOON
                  </span>
                </motion.div>

                {/* Waitlist Signup */}
                <motion.div
                  id="waitlist"
                  variants={fadeUp}
                  className="mb-12  flex w-full justify-center scroll-mt-24"
                >
                  <WaitlistForm />
                </motion.div>

          <motion.div
  variants={fadeUp}
  className="mt-auto flex w-full flex-col items-center justify-end pt-36 pb-0"
>
                  {/* Footer — extracted into a shared component (see ./Footer.tsx) */}
                  <Footer />
                </motion.div>

              </div>
            </motion.div>
          )}
        </header>
      </div>

      <ScrollIndicator targetId="mission-content" show={contentVisible} />
    </div>
  );
}