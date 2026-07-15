"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface ParallaxWrapperProps {
  children: React.ReactNode;
  intensity?: number;
}

export default function ParallaxWrapper({
  children,
  intensity = 15,
}: ParallaxWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 30, mass: 1 };
  const x = useSpring(
    useTransform(mouseX, [-1, 1], [intensity, -intensity]),
    springConfig
  );
  const y = useSpring(
    useTransform(mouseY, [-1, 1], [intensity, -intensity]),
    springConfig
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    function handleMouse(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    }

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div style={{ x, y }} className="will-change-transform">
      {children}
    </motion.div>
  );
}
