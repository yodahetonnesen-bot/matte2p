"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Myk inntoning når elementet kommer inn i bildet. */
export function Reveal({ children, delay = 0, y = 14, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
