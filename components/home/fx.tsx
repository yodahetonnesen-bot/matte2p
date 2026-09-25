"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, ScrollTrigger, useFinePointer, useReducedMotion } from "./motion";

/**
 * 3D-tilt med spotlight (tilpasset fra 21st.dev «Tilt Card»). Vinkler og lys
 * drives av GSAP-fjærer (quickTo med elastisk utgang) i stedet for React-state,
 * så kortet svinger mykt tilbake når pekeren forlater det. Av ved berøring og
 * redusert bevegelse.
 */
export function TiltCard({
  children,
  className,
  style,
  tilt = 7,
  lift = 1.02,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tilt?: number;
  lift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;
    gsap.set(el, { transformPerspective: 1100, transformStyle: "preserve-3d" });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    const sc = gsap.quickTo(el, "scale", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width,
        py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * tilt * 2);
      ry((px - 0.5) * tilt * 2);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    };
    const enter = () => {
      sc(lift);
      el.dataset.hover = "1";
    };
    const leave = () => {
      gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 1.1, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
      delete el.dataset.hover;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [reduced, fine, tilt, lift]);

  return (
    <div ref={ref} className={"tilt-card group/tilt relative will-change-transform " + (className ?? "")} style={style}>
      {children}
      <div aria-hidden className="tilt-spot pointer-events-none absolute inset-0 z-20 rounded-[inherit]" />
    </div>
  );
}

/** Magnetisk knapp: trekkes mot pekeren og fjærer tilbake. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !fine) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [reduced, fine, strength]);
  return (
    <span ref={ref} className={"inline-flex " + (className ?? "")}>
      {children}
    </span>
  );
}

/**
 * Scroll-koblet inntoning: elementene tones inn og skaleres opp mens de
 * scrolles inn i bildet (scrub, ikke en engangsanimasjon). Barn med
 * `data-fx` animeres forskjøvet etter hverandre.
 */
export function ScrollScale({
  children,
  className,
  from = 0.9,
  y = 60,
  stagger = 0.12,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  y?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const items = gsap.utils.toArray<HTMLElement>("[data-fx]", el);
    const targets = items.length ? items : [el];
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, scale: from, y, transformOrigin: "50% 100%" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 92%", end: "top 45%", scrub: 0.9 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, from, y, stagger]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Parallakse: laget beveger seg med en annen fart enn scrollen (speed < 0 = motsatt vei). */
export function Parallax({ children, speed = 0.2, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: speed * 100 },
        { yPercent: -speed * 100, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, speed]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Tall som teller opp når de kommer inn i bildet. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const obj = { v: 0 };
    el.textContent = "0";
    const tw = gsap.to(obj, {
      v: value,
      duration: 1.6,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v));
      },
    });
    const st = ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => tw.play() });
    return () => {
      st.kill();
      tw.kill();
      el.textContent = String(value);
    };
  }, [reduced, value]);
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/** En linje som tegnes etter hvert som man scroller gjennom beholderen. */
export function ScrollLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !el.parentElement) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
      );
    });
    return () => ctx.revert();
  }, [reduced]);
  return <div ref={ref} aria-hidden className={"origin-top " + (className ?? "")} />;
}
