"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, Search, X, Calculator, Sigma, ChartSpline, ChartNoAxesColumnIncreasing, LogOut } from "lucide-react";
import { CHAPTERS } from "@/lib/chapters";
import { LogoMark } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { CHAPTER_ICONS } from "./icons";
import { openSearch } from "./command-palette";

const LINKS = [
  { href: "/trening", label: "Trening", Icon: Calculator },
  { href: "/formler", label: "Formler", Icon: Sigma },
  { href: "/graftegner", label: "Graftegner", Icon: ChartSpline },
  { href: "/fremgang", label: "Fremgang", Icon: ChartNoAxesColumnIncreasing },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMega(false);
    setMobile(false);
  }

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const on = (e: Event) => setOverHero((e as CustomEvent<boolean>).detail);
    window.addEventListener("hero-dark", on);
    return () => window.removeEventListener("hero-dark", on);
  }, []);

  useEffect(() => {
    if (!mega) return;
    const close = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [mega]);

  const inChapters = pathname.startsWith("/kapittel");

  return (
    <header
      className={
        "sticky top-0 z-40 w-full transition-[background,box-shadow,border-color] duration-300 " +
        (overHero && !mega && !mobile
          ? "dark border-b border-white/10 bg-[#0b0f1f]/55 text-foreground shadow-[0_1px_24px_-8px_oklch(0_0_0/0.5)] backdrop-blur-xl"
          : scrolled || mega || mobile
          ? "border-b border-border bg-background/80 shadow-[0_1px_12px_-6px_oklch(0_0_0/0.15)] backdrop-blur-xl"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm")
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Til forsiden">
          <LogoMark className="size-9 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
          <span className="leading-none">
            <span className="block font-display text-[1.15rem] font-semibold tracking-tight">2P Matte</span>
            <span className="block text-[0.7rem] text-muted-foreground">Teori · oppgaver · fasit</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Hovedmeny">
          <div ref={megaRef} className="relative">
            <button
              type="button"
              onClick={() => setMega((m) => !m)}
              aria-expanded={mega}
              className={
                "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition hover:bg-muted " +
                (inChapters ? "text-foreground" : "text-foreground/75")
              }
            >
              Kapitler
              <ChevronDown className={"size-4 transition-transform " + (mega ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {mega && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 top-12 w-[min(940px,calc(100vw-3rem))] origin-top-left rounded-2xl border border-border bg-popover p-3 shadow-2xl shadow-black/10"
                >
                  <div className="grid grid-cols-3 gap-1.5">
                    {CHAPTERS.map((c) => {
                      const Icon = CHAPTER_ICONS[c.icon];
                      return (
                        <div key={c.n} className="rounded-xl p-3 transition hover:bg-muted/70" style={{ ["--ch-h" as string]: c.hue }}>
                          <Link href={`/kapittel/${c.n}`} className="flex items-start gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-chap-soft text-chap-ink">
                              <Icon className="size-4.5" />
                            </span>
                            <span>
                              <span className="block text-xs font-semibold text-chap-ink">Kapittel {c.n}</span>
                              <span className="block text-sm font-semibold leading-snug">{c.title}</span>
                            </span>
                          </Link>
                          <ul className="mt-2 space-y-0.5 pl-12">
                            {c.sections.map((s) => (
                              <li key={s.id}>
                                <Link
                                  href={`/kapittel/${c.n}/${s.slug}`}
                                  className="block truncate rounded px-1 py-0.5 text-[0.8rem] text-muted-foreground transition hover:bg-chap-soft hover:text-chap-ink"
                                >
                                  <span className="tabular-nums">{s.id}</span> {s.short ?? s.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {LINKS.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition hover:bg-muted " +
                  (active ? "text-foreground" : "text-foreground/75")
                }
              >
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-muted" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSearch()}
            className="flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-56"
            aria-label="Søk"
          >
            <Search className="size-4" />
            <span className="hidden truncate whitespace-nowrap sm:inline">Søk tema eller oppgave…</span>
            <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 font-mono text-[0.7rem] sm:inline">⌘K</kbd>
          </button>
          <ThemeToggle />
          {/* Vanlig lenke, ikke <Link>: utloggingen er en funksjon på Netlify, ikke en side. */}
          <a
            href="/api/logg-ut"
            className="grid size-9 place-items-center rounded-full border border-border bg-card text-foreground/80 transition hover:bg-muted hover:text-foreground"
            aria-label="Logg ut"
            title="Logg ut"
          >
            <LogOut className="size-4" />
          </a>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full border border-border bg-card lg:hidden"
            onClick={() => setMobile((m) => !m)}
            aria-label="Meny"
            aria-expanded={mobile}
          >
            {mobile ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border lg:hidden"
            aria-label="Mobilmeny"
          >
            <div className="max-h-[75vh] space-y-4 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                {LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium">
                    <l.Icon className="size-4 text-primary" /> {l.label}
                  </Link>
                ))}
              </div>
              {CHAPTERS.map((c) => (
                <details key={c.n} className="group rounded-xl border border-border bg-card" style={{ ["--ch-h" as string]: c.hue }}>
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-sm font-semibold">
                    <span className="grid size-6 place-items-center rounded-md bg-chap-soft text-xs text-chap-ink">{c.n}</span>
                    {c.title}
                    <ChevronDown className="ml-auto size-4 transition group-open:rotate-180" />
                  </summary>
                  <ul className="px-3 pb-3">
                    <li>
                      <Link href={`/kapittel/${c.n}`} className="block rounded px-2 py-1.5 text-sm font-medium text-chap-ink">
                        Oversikt over kapitlet
                      </Link>
                    </li>
                    {c.sections.map((s) => (
                      <li key={s.id}>
                        <Link href={`/kapittel/${c.n}/${s.slug}`} className="block rounded px-2 py-1.5 text-sm text-muted-foreground">
                          {s.id} {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
