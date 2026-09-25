"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { glyphIcon } from "./glyph";

const ListOrdered = glyphIcon("∑");
const Layers = glyphIcon("∪");
const Open = glyphIcon("∞");
const NotebookText = glyphIcon("≡");
import type { ChapterMeta } from "@/lib/chapters";
import { markRead, setLast, useProgress } from "@/lib/progress";

export function ChapterSidebar({ ch }: { ch: ChapterMeta }) {
  const pathname = usePathname();
  const progress = useProgress();
  return (
    <nav aria-label={`Kapittel ${ch.n}`} className="text-sm">
      <Link href={`/kapittel/${ch.n}`} className="mb-3 block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-chap-ink">Kapittel {ch.n}</span>
        <span className="block font-display text-base font-semibold leading-tight">{ch.title}</span>
      </Link>
      <ul className="relative space-y-0.5 border-l border-border">
        {ch.sections.map((s) => {
          const href = `/kapittel/${ch.n}/${s.slug}`;
          const active = pathname === href;
          const read = !!progress.read[s.id];
          return (
            <li key={s.id}>
              <Link
                href={href}
                className={
                  "relative -ml-px flex items-center gap-2 border-l-2 py-1.5 pl-3 pr-2 transition " +
                  (active ? "border-chap font-medium text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground")
                }
              >
                <span className="w-7 shrink-0 tabular-nums text-xs opacity-70">{s.id}</span>
                <span className="flex-1 leading-snug">{s.short ?? s.title}</span>
                {read && <Check className="size-3.5 shrink-0 text-success" aria-label="lest" />}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 space-y-1 border-t border-border pt-4">
        {[
          { href: `/kapittel/${ch.n}/oppgaver/repetisjon`, label: "Repetisjonsoppgaver", Icon: ListOrdered },
          { href: `/kapittel/${ch.n}/oppgaver/blandet`, label: "Blandede oppgaver", Icon: Layers },
          { href: `/kapittel/${ch.n}/oppgaver/apen`, label: "Åpne oppgaver", Icon: Open },
          { href: `/kapittel/${ch.n}/sammendrag`, label: "Sammendrag", Icon: NotebookText },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              "flex items-center gap-2 rounded-lg px-2 py-1.5 transition " +
              (pathname === l.href ? "bg-chap-soft text-chap-ink" : "text-muted-foreground hover:bg-muted hover:text-foreground")
            }
          >
            <l.Icon className="size-4" /> {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function ReadToggle({ id }: { id: string }) {
  const progress = useProgress();
  const read = !!progress.read[id];
  return (
    <button
      type="button"
      onClick={() => markRead(id, !read)}
      className={
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-[0.98] " +
        (read ? "border-transparent bg-success text-white dark:text-background" : "border-border bg-card hover:bg-muted")
      }
    >
      <Check className="size-4" />
      {read ? "Markert som lest" : "Marker teorien som lest"}
    </button>
  );
}

export function RememberVisit({ href, title }: { href: string; title: string }) {
  useEffect(() => {
    setLast(href, title);
  }, [href, title]);
  return null;
}

export function SectionProgress({ ids }: { ids: string[] }) {
  const progress = useProgress();
  const done = ids.filter((i) => progress.ex[i] === "done").length;
  const review = ids.filter((i) => progress.ex[i] === "review").length;
  const pct = ids.length ? (done / ids.length) * 100 : 0;
  return (
    <div className="min-w-48">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {done}/{ids.length} løst
        </span>
        {review > 0 && <span className="text-[color-mix(in_oklch,var(--warn)_70%,var(--foreground))]">{review} å øve på</span>}
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-success transition-all duration-700" style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}
