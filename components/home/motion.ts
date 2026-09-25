"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** true når brukeren har bedt om redusert bevegelse. Starter som `true` på serveren slik at ingenting animeres før vi vet. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** true for mus/styreflate (hover finnes). */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

/**
 * Kritisk dempet fjær: følger et mål med treghet, uten å skyte over.
 * Brukes til å gi scroll-verdier en fysisk, «tung» følelse.
 */
export class Spring {
  value: number;
  velocity = 0;
  target: number;
  constructor(
    initial: number,
    public stiffness = 120,
    public damping = 2 * Math.sqrt(120),
  ) {
    this.value = initial;
    this.target = initial;
  }
  step(dt: number) {
    // semi-implisitt Euler med små delsteg for stabilitet
    const n = Math.max(1, Math.ceil(dt / (1 / 240)));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = this.stiffness * (this.target - this.value) - this.damping * this.velocity;
      this.velocity += a * h;
      this.value += this.velocity * h;
    }
    return this.value;
  }
  get settled() {
    return Math.abs(this.target - this.value) < 1e-4 && Math.abs(this.velocity) < 1e-4;
  }
}
