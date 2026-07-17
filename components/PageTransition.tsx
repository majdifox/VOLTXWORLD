"use client";

import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   PageTransition — the "one continuous motion" illusion
   ───────────────────────────────────────────────────────────────────
   Next.js unmounts the old route and mounts the new one — there's no
   real way to animate *across* that boundary from a single component.
   The trick (same one Apple's own marketing pages use under the hood)
   is to fake it with two halves that share timing + color:

     1. ExitCurtain  — lives on the ORIGIN page. On click, fades a
        pure-black layer IN over the current view, then you navigate.
     2. EntryCurtain — lives on the DESTINATION page. Mounts already
        black, then fades OUT to reveal the page underneath.

   Because both curtains are the same flat #000 with the same easing,
   the seam between "page A hides" and "page B reveals" disappears —
   it reads as one unbroken fade, not two separate page loads.
   ═══════════════════════════════════════════════════════════════════ */

const EASE_APPLE = [0.25, 0.1, 0.25, 1.0] as const;

export function ExitCurtain({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_APPLE }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 999,
            pointerEvents: "none",
          }}
        />
      )}
    </AnimatePresence>
  );
}

export function EntryCurtain() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.1, ease: EASE_APPLE, delay: 0.15 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 999,
        pointerEvents: "none",
      }}
    />
  );
}

/* Duration (ms) the ExitCurtain needs to be fully opaque before you
   call router.push() — keep this in sync with ExitCurtain's transition
   duration above. */
export const EXIT_DURATION_MS = 700;