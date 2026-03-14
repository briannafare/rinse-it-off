"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export function FadeIn({ children, delay = 0, className = "", y = 30 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className = "", stagger = 0.08 }: { children: ReactNode; className?: string; stagger?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerChild({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }} className={className}>
      {children}
    </motion.div>
  );
}

export function Parallax({ children, speed = 0.15, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, from = "left", delay = 0, className = "" }: { children: ReactNode; from?: "left" | "right"; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const x = from === "left" ? -60 : 60;
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}
