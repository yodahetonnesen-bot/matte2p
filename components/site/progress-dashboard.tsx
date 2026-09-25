"use client";

import Link from "next/link";
import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { resetProgress, useProgress } from "@/lib/progress";

type Ch = { n: number; title: string; hue: number; sections: string[]; ex: { id: string; title: string; href: string }[] };

export function ProgressDashboard({ chapters }: { chapters: Ch[] }) {
  const p = useProgress();
  const [confirm, setConfirm] = useState(false);
  const all = chapters.flatMap((c) => c.ex.map((e) => ({ ...e, hue: c.hue, ch: c.n })));
  const review = all.filter((e) => p.ex[e.id] === "review");
  const done = all.filter((e) => p.ex[e.id] === "done").length;
  const read = chapters.reduce((s, c) => s + c.sections.filter((x) => p.read[x]).length, 0);
  const secTotal = chapters.reduce((s, c) => s + c.sections.length, 0);
  const drills = Object.values(p.drills);
  const drillRight = drills.reduce((s, d) => s + d.right, 0);
  const drillTotal = drills.reduce((s, d) => s + d.total, 0);

  return (
    <div className="mt-8 space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { k: "Oppgaver løst", v: `${done}`, s: `av ${all.length}` },
          { k: "Teori lest", v: `${read}`, s: `av ${secTotal} delkapitler` },
          { k: "Treningsoppgaver", v: `${drillRight}`, s: `riktige av ${drillTotal}` },
        ].map((x) => (
          <div key={x.k} className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">{x.k}</p>
            <p className="mt-1 font-display text-5xl font-semibold">{x.v}</p>
            <p className="text-sm text-muted-foreground">{x.s}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-display text-2xl font-semibold">Per kapittel</h2>
        <div className="mt-4 space-y-3">
          {chapters.map((c) => {
            const d = c.ex.filter((e) => p.ex[e.id] === "done").length;
            const r = c.ex.filter((e) => p.ex[e.id] === "review").length;
            return (
              <div key={c.n} className="rounded-2xl border border-border bg-card p-4" style={{ ["--ch-h" as string]: c.hue }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/kapittel/${c.n}`} className="font-semibold hover:underline">
                    <span className="text-chap">{c.n}</span> {c.title}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {d} løst · {r} å øve på · {c.sections.filter((s) => p.read[s]).length}/{c.sections.length} lest
                  </span>
                </div>
                <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="bg-success transition-all duration-700" style={{ width: `${(d / Math.max(1, c.ex.length)) * 100}%` }} />
                  <div className="bg-warn transition-all duration-700" style={{ width: `${(r / Math.max(1, c.ex.length)) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
          <RotateCcw className="size-5 text-warn" /> Oppgaver du vil øve mer på
        </h2>
        {review.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {review.map((e) => (
              <Link
                key={e.id}
                href={e.href}
                style={{ ["--ch-h" as string]: e.hue }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition hover:border-chap"
              >
                <span className="text-chap-ink">Kap. {e.ch}</span> · {e.title}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-muted-foreground">Ingen ennå. Trykk «Må øve mer» på en oppgave for å samle den her.</p>
        )}
      </section>

      <div className="border-t border-border pt-6">
        {confirm ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm">Sikker? All fremgang slettes fra denne nettleseren.</span>
            <button
              type="button"
              onClick={() => {
                resetProgress();
                setConfirm(false);
              }}
              className="rounded-full bg-destructive px-4 py-1.5 text-sm font-medium text-white"
            >
              Ja, nullstill
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="rounded-full border border-border px-4 py-1.5 text-sm">
              Avbryt
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirm(true)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive">
            <Trash2 className="size-4" /> Nullstill fremgang
          </button>
        )}
      </div>
    </div>
  );
}
