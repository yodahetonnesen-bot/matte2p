"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const dark = !root.classList.contains("dark");
    const apply = () => {
      root.classList.toggle("dark", dark);
      try {
        localStorage.setItem("theme", dark ? "dark" : "light");
      } catch {
        /* ignorer */
      }
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) doc.startViewTransition(apply);
    else apply();
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className="relative grid size-9 place-items-center rounded-full border border-border bg-card text-foreground/80 transition hover:bg-muted hover:text-foreground"
      aria-label="Bytt mellom lyst og mørkt tema"
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all [html.dark_&]:scale-0 [html.dark_&]:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all [html.dark_&]:scale-100 [html.dark_&]:rotate-0" />
    </button>
  );
}
