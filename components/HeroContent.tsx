"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 2.2,
    },
  },
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease,
    },
  },
};

const fadeLine: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 1.2,
      ease,
    },
  },
};

export default function HeroContent() {
  return (
    <div className="content-layer w-full">
      {/* 
        First section: 100vh tall, perfectly centers the logo.
        This forces the user to scroll down for the rest.
      */}
      <div className="flex h-screen w-full flex-col items-center justify-center">
        {/* Radial Glow */}
        <div className="radial-glow absolute pointer-events-none" />

        {/* VOLTX Logo (static, perfectly matches loading screen) */}
        <header className="relative flex justify-center w-full z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/VOLTX.svg"
            alt="VOLTX Logo"
            className="w-[clamp(320px,48vw,760px)] h-auto"
            style={{
              filter: "drop-shadow(0 4px 30px rgba(255,255,255,0.08))",
            }}
          />
        </header>
      </div>

      {/* 
        Second section: The rest of the content. 
        Appears below the fold, requiring scrolling.
      */}
      <motion.div
        className="flex flex-col items-center justify-center px-6 pb-24 pt-12 text-center"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="mb-12 max-w-2xl text-[clamp(1rem,2.5vw,1.35rem)] leading-relaxed tracking-wide"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          Technology should bring people closer, not keep them apart.
        </motion.p>

        {/* Gradient Divider */}
        <motion.div variants={fadeLine} className="gradient-line mb-12" />

        {/* Description */}
        <motion.section variants={fadeUp} aria-label="About VOLTX">
          <p
            className="mx-auto mb-16 max-w-xl text-[clamp(0.85rem,1.8vw,1rem)] leading-[1.85]"
            style={{ color: "rgba(255, 255, 255, 0.42)" }}
          >
            VOLTX is building the future of local experiences by helping students,
            communities, creators, and businesses discover opportunities, meet the
            right people, and transform digital interactions into meaningful
            real-world connections. We believe technology should inspire people to
            explore, connect, and find where they truly belong.
          </p>
        </motion.section>

        {/* Launching Soon */}
        <motion.div variants={fadeUp} className="mb-24">
          <span
            className="inline-block rounded-full border px-6 py-2 text-xs tracking-[0.25em] uppercase"
            style={{
              borderColor: "rgba(255, 255, 255, 0.12)",
              color: "rgba(255, 255, 255, 0.55)",
              fontFamily: "var(--font-heading), system-ui, sans-serif",
            }}
          >
            Launching Soon
          </span>
        </motion.div>

        {/* Gradient Divider */}
        <motion.div variants={fadeLine} className="gradient-line mb-16" />

        {/* Founder */}
        <motion.section variants={fadeUp} aria-label="Founder" className="mb-20">
          <p
            className="mb-2 text-[0.7rem] uppercase tracking-[0.3em]"
            style={{ color: "rgba(255, 255, 255, 0.3)" }}
          >
            Founded by
          </p>
          <p
            className="mb-1 text-lg tracking-wide"
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontFamily: "var(--font-heading), system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            Mehdi Majdi
          </p>
          <p
            className="text-xs tracking-[0.15em]"
            style={{ color: "rgba(255, 255, 255, 0.35)" }}
          >
            Founder &amp; CEO
          </p>
        </motion.section>

        {/* Footer */}
        <motion.footer
          variants={fadeUp}
          role="contentinfo"
        >
          <p
            className="text-[0.65rem] tracking-[0.15em]"
            style={{ color: "rgba(255, 255, 255, 0.2)" }}
          >
            © 2026 VOLTX®. All rights reserved.
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
