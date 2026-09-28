"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Hal hovering: a slow bob and tilt, like a hummingbird holding position. */
export function HalHover({ src, alt, className, flip = false }: { src: string; alt: string; className?: string; flip?: boolean }) {
  const still = useReducedMotion();
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      style={{ scaleX: flip ? -1 : 1, filter: "drop-shadow(6px 12px 10px rgba(40,30,20,.22))" }}
      animate={still ? undefined : { y: [0, -12, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Content rises in once when it scrolls into view. Always visible: only the position animates. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? false : { y: 28 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
