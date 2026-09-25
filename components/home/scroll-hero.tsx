"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, ScrollTrigger, Spring, useReducedMotion } from "./motion";
import { STAGES, drawScene, makeParticles, stageWeight, stepParticles, type Camera } from "./hero-scene";

export type HeroStage = { tag: string; title: string; formula: string };

type Rect = { x: number; y: number; w: number; h: number };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x: number) => {
  const u = clamp(x);
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
};
const lerpRect = (a: Rect, b: Rect, u: number): Rect => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });

/** Hvor stor del av scroll-lengden som brukes på å ekspandere kortet, og når filmen spilles. */
const EXPAND_END = 0.2;
const FILM_START = 0.1;
const FILM_END = 0.88;
const LAND_START = 0.9;

/**
 * Forsidens hero: et høyt avsnitt med en «sticky» visning. Canvas-kortet starter
 * i høyre kolonne, vokser til fullskjerm når du scroller, og spiller av en
 * matematikkfilm som er låst til scroll-posisjonen (via en fjær for fysisk treghet).
 */
export function ScrollHero({ stages, children }: { stages: HeroStage[]; children: ReactNode }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current,
      sticky = stickyRef.current,
      slot = slotRef.current,
      canvas = canvasRef.current,
      clip = clipRef.current,
      frame = frameRef.current;
    if (!section || !sticky || !slot || !canvas || !clip || !frame) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0,
      H = 0;
    let start: Rect = { x: 0, y: 0, w: 1, h: 1 };
    const measure = () => {
      const sr = sticky.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      W = sr.width;
      H = sr.height;
      start = { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    measure();

    const particles = makeParticles(W < 700 ? 60 : 120);
    const progress = new Spring(0, 90, 2 * Math.sqrt(90) * 1.05);
    let pointer: { x: number; y: number } | null = null;
    let cam: Camera = { cx: 0, cy: 0, unit: 50 };
    let heroDark = false;
    const releaseHeader = () => {
      if (heroDark) window.dispatchEvent(new CustomEvent("hero-dark", { detail: false }));
      heroDark = false;
    };

    const apply = (p: number, t: number) => {
      const e = ease(p / EXPAND_END);
      const land = ease((p - LAND_START) / (1 - LAND_START));
      const full: Rect = { x: 0, y: 0, w: W, h: H };
      const m = W < 700 ? 10 : 18;
      const end: Rect = { x: m, y: 72, w: W - 2 * m, h: H - 72 - m };
      const r = lerpRect(lerpRect(start, full, e), end, land);
      const radius = lerp(lerp(28, 0, e), 28, land);

      // si fra til headeren når det mørke lerretet ligger bak den
      const dark = r.y < 40 && r.x < 40 && r.w > W - 80;
      if (dark !== heroDark) {
        heroDark = dark;
        window.dispatchEvent(new CustomEvent("hero-dark", { detail: dark }));
      }

      clip.style.clipPath = `inset(${r.y}px ${W - r.x - r.w}px ${H - r.y - r.h}px ${r.x}px round ${radius}px)`;
      frame.style.transform = `translate(${r.x}px, ${r.y}px)`;
      frame.style.width = `${r.w}px`;
      frame.style.height = `${r.h}px`;
      frame.style.borderRadius = `${radius}px`;

      cam = { cx: (r.x + r.w / 2) * dpr, cy: (r.y + r.h / 2) * dpr, unit: Math.min(r.h / 8.4, r.w / 10.5) * dpr };
      const s = clamp((p - FILM_START) / (FILM_END - FILM_START));
      drawScene(ctx2d, canvas.width, canvas.height, dpr, cam, s, t, particles);

      // bildetekster og fremdriftsskinne følger samme s som filmen
      const vis = clamp((e - 0.55) / 0.45) * (1 - land * 0.6);
      capRefs.current.forEach((el, i) => {
        if (!el) return;
        // skarp overgang: bare én bildetekst synlig om gangen
        const w = clamp((stageWeight(i, s) - 0.5) / 0.4) * vis;
        el.style.opacity = String(w);
        el.style.transform = `translate3d(0, ${(1 - w) * 18}px, 0)`;
        el.style.visibility = w < 0.01 ? "hidden" : "visible";
      });
      if (railRef.current) railRef.current.style.opacity = String(vis);
      dotRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleY(${0.35 + 0.65 * stageWeight(i, s)})`;
      });
    };

    if (reduced) {
      // Ingen bevegelse: tegn ett stillbilde av kortet.
      const draw = () => {
        measure();
        apply(0, 0);
      };
      draw();
      const ro = new ResizeObserver(draw);
      ro.observe(sticky);
      return () => ro.disconnect();
    }

    // --- GSAP: scroll → fjærmål, og parallakse på tekstlagene
    const gctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.target = self.progress;
        },
        onRefresh: (self) => {
          measure();
          progress.target = self.progress;
        },
      });

      const text = textRef.current;
      if (text) {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", text);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: () => `+=${window.innerHeight * 0.42}`, scrub: 0.6 },
        });
        layers.forEach((el) => {
          const d = Number(el.dataset.depth ?? 1);
          tl.to(el, { yPercent: -60 * d, y: -90 * d, opacity: 0, scale: 1 - 0.04 * d, ease: "none" }, 0);
        });
      }
      if (hintRef.current)
        gsap.to(hintRef.current, {
          opacity: 0,
          y: 20,
          scrollTrigger: { trigger: section, start: "top top", end: "+=200", scrub: true },
        });
    }, section);

    // --- rAF-løkke: fjær + partikler + tegning (bare når hero er synlig)
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const t0 = last;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      progress.step(dt);
      stepParticles(particles, dt, pointer, (now - t0) / 1000);
      apply(clamp(progress.value, 0, 1), (now - t0) / 1000);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (!visible) releaseHeader();
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(section);
    raf = requestAnimationFrame(loop);

    const onMove = (ev: PointerEvent) => {
      const sr = sticky.getBoundingClientRect();
      const px = (ev.clientX - sr.left) * dpr,
        py = (ev.clientY - sr.top) * dpr;
      pointer = { x: (px - cam.cx) / cam.unit, y: (cam.cy - py) / cam.unit };
    };
    const onLeave = () => (pointer = null);
    sticky.addEventListener("pointermove", onMove);
    sticky.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => {
      measure();
      ScrollTrigger.refresh();
    });
    ro.observe(sticky);

    return () => {
      releaseHeader();
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      sticky.removeEventListener("pointermove", onMove);
      sticky.removeEventListener("pointerleave", onLeave);
      gctx.revert();
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className={"relative -mt-16 " + (reduced ? "" : "h-[420svh]")} aria-label="Introduksjon">
      <div ref={stickyRef} className={(reduced ? "relative min-h-[100svh]" : "sticky top-0 h-[100svh]") + " overflow-hidden"}>
        {/* dekor bak kortet */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-paper opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.16_285/0.3),transparent)] blur-2xl" />

        {/* ramme (skygge) + canvas klippet til kortets form */}
        <div
          ref={frameRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 shadow-[0_40px_120px_-30px_oklch(0.3_0.15_275/0.55)] ring-1 ring-black/5 dark:ring-white/10"
        />
        <div ref={clipRef} aria-hidden className="absolute inset-0 [clip-path:inset(50%)]">
          <canvas ref={canvasRef} className="absolute inset-0 size-full" />
        </div>

        {/* tekstlag */}
        <div className="relative mx-auto grid h-full max-w-7xl items-center gap-10 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          <div ref={textRef} className="relative z-10">
            {children}
          </div>
          <div ref={slotRef} className="aspect-[4/3] w-full max-lg:max-h-[34svh] lg:aspect-[5/4.3]" />
        </div>

        {/* bildetekster for scenene */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-6 pb-10 sm:px-10 sm:pb-14">
          <div className="relative h-40">
            {stages.map((st, i) => (
              <div
                key={st.tag}
                ref={(el) => {
                  capRefs.current[i] = el;
                }}
                className="invisible absolute bottom-0 left-0 max-w-md rounded-2xl border border-white/10 bg-[#0d1122]/70 p-5 text-white opacity-0 shadow-2xl backdrop-blur-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a9b3ff]">{st.tag}</p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{st.title}</p>
                <div className="mt-2 text-lg text-white/85 [&_.katex]:text-white" dangerouslySetInnerHTML={{ __html: st.formula }} />
              </div>
            ))}
          </div>
        </div>
        <div ref={railRef} aria-hidden className="pointer-events-none absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2 opacity-0 sm:right-8">
          {Array.from({ length: STAGES }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="block h-10 w-1 origin-center rounded-full bg-white/70"
            />
          ))}
        </div>

        {!reduced && (
          <div ref={hintRef} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              Scroll for å utforske <ChevronDown className="size-3.5 animate-bounce" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
