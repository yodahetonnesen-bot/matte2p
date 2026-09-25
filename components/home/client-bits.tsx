"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProgress } from "@/lib/progress";

export function ContinueCard() {
  const p = useProgress();
  if (!p.last) return null;
  return (
    <Link
      href={p.last.href}
      className="group mt-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm shadow-sm backdrop-blur transition hover:border-primary"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-secondary text-primary">
      </span>
      <span>
        <span className="block text-xs text-muted-foreground">Fortsett der du slapp</span>
        <span className="block font-medium">{p.last.title}</span>
      </span>
      <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-1" />
    </Link>
  );
}

export function ChapterProgressRing({ ids, sections }: { ids: string[]; sections: string[] }) {
  const p = useProgress();
  const done = ids.filter((i) => p.ex[i] === "done").length;
  const read = sections.filter((s) => p.read[s]).length;
  const frac = ids.length ? done / ids.length : 0;
  const r = 17;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 44 44" className="size-11 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--muted)" strokeWidth="5" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="var(--chap)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="text-xs leading-tight text-muted-foreground">
        <div>
          <span className="font-semibold text-foreground">{done}</span> / {ids.length} oppgaver
        </div>
        <div>
          <span className="font-semibold text-foreground">{read}</span> / {sections.length} teorier lest
        </div>
      </div>
    </div>
  );
}
