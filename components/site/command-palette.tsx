"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, CornerDownLeft } from "lucide-react";
import { glyphIcon } from "./glyph";

const BookOpen = glyphIcon("≔");
const FileText = glyphIcon("?");
const Sparkles = glyphIcon("→");

export type SearchItem = { kind: "seksjon" | "oppgave" | "side"; title: string; sub: string; href: string; text: string; hue?: number };

export function openSearch() {
  window.dispatchEvent(new Event("open-search"));
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9æøå.,\s]/g, " ");
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !/input|textarea/i.test((e.target as HTMLElement)?.tagName ?? "")) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    if (!items)
      fetch("/sok.json")
        .then((r) => r.json())
        .then((d: SearchItem[]) => setItems(d.map((x) => ({ ...x, text: norm(x.title + " " + x.sub + " " + x.text) }))))
        .catch(() => setItems([]));
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open, items]);

  const results = useMemo(() => {
    if (!items) return [];
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return items.filter((i) => i.kind !== "oppgave").slice(0, 12);
    const scored: { it: SearchItem; s: number }[] = [];
    for (const it of items) {
      let s = 0;
      let ok = true;
      const t = norm(it.title);
      for (const w of words) {
        if (!it.text.includes(w)) {
          ok = false;
          break;
        }
        s += t.includes(w) ? 3 : 1;
        if (t.startsWith(w) || t.includes(" " + w)) s += 2;
      }
      if (ok) scored.push({ it, s: s + (it.kind === "seksjon" ? 2 : it.kind === "side" ? 1 : 0) });
    }
    return scored
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .map((x) => x.it);
  }, [items, q]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const go = (it: SearchItem) => {
    setOpen(false);
    setQ("");
    router.push(it.href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="Søk"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-5 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setSel(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                  else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSel((s) => Math.min(s + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSel((s) => Math.max(s - 1, 0));
                  } else if (e.key === "Enter" && results[sel]) go(results[sel]);
                }}
                placeholder="Søk: «kjerneregel», «1.42», «vendepunkt»…"
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem] text-muted-foreground">Esc</kbd>
            </div>
            <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
              {!items && <p className="p-4 text-sm text-muted-foreground">Laster søkeregister…</p>}
              {items && results.length === 0 && <p className="p-4 text-sm text-muted-foreground">Ingen treff for «{q}».</p>}
              {results.map((it, i) => {
                const Icon = it.kind === "seksjon" ? BookOpen : it.kind === "oppgave" ? FileText : Sparkles;
                return (
                  <button
                    key={it.href + i}
                    data-i={i}
                    type="button"
                    onMouseEnter={() => setSel(i)}
                    onClick={() => go(it)}
                    className={"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition " + (i === sel ? "bg-muted" : "")}
                    style={it.hue !== undefined ? { ["--ch-h" as string]: it.hue } : undefined}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-chap-soft text-chap-ink">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{it.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{it.sub}</span>
                    </span>
                    {i === sel && <CornerDownLeft className="size-4 text-muted-foreground" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
