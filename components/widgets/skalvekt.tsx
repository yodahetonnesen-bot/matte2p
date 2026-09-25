"use client";

import { useState } from "react";
import { RotateCcw, Shuffle } from "lucide-react";
import { tex } from "@/lib/tex";
import { WidgetCard } from "./ui";

// Likningen a·x + b = c·x + d med naturlige tall. Posene er x, loddene er 1.
type Eq = { a: number; b: number; c: number; d: number };

const PRESETS: Eq[] = [
  { a: 1, b: 2, c: 0, d: 5 },
  { a: 1, b: 3, c: 0, d: 8 },
  { a: 1, b: 5, c: 2, d: 3 },
  { a: 3, b: 5, c: 1, d: 11 },
  { a: 4, b: 2, c: 2, d: 8 },
  { a: 0, b: 5, c: 2, d: 1 },
];

function side(k: number, m: number) {
  const x = k === 0 ? "" : k === 1 ? "x" : `${k}x`;
  if (!x) return String(m);
  return m ? `${x} + ${m}` : x;
}
const eqTex = (e: Eq) => `${side(e.a, e.b)} = ${side(e.c, e.d)}`;

function randomEq(): Eq {
  for (;;) {
    const x = 1 + Math.floor(Math.random() * 5);
    const a = Math.floor(Math.random() * 4);
    const c = Math.floor(Math.random() * 4);
    if (a === c) continue;
    const b = Math.floor(Math.random() * 7);
    const d = a * x + b - c * x;
    if (d < 0 || d > 12 || a * x + b > 16) continue;
    return { a, b, c, d };
  }
}

/** «3·2 + 5 = 11» for prøven: k poser à x og m lodd. */
function prove(k: number, m: number, x: number) {
  const terms: string[] = [];
  if (k) terms.push(k === 1 ? String(x) : `${k}\\cdot ${x}`);
  if (m || !k) terms.push(String(m));
  const val = k * x + m;
  return terms.length > 1 || k > 1 ? `${terms.join(" + ")} = ${val}` : String(val);
}

/** Én skål: poser (x) og lodd (1). */
function Pan({ cx, bags, ones }: { cx: number; bags: number; ones: number }) {
  const items: { kind: "x" | "1" }[] = [...Array(bags).fill({ kind: "x" }), ...Array(ones).fill({ kind: "1" })];
  const perRow = 6;
  return (
    <g>
      <path d={`M${cx - 95},150 Q${cx},188 ${cx + 95},150 Z`} fill="color-mix(in oklch, var(--plot-muted) 22%, transparent)" stroke="var(--plot-axis)" strokeWidth={2} />
      <line x1={cx} x2={cx} y1={40} y2={150} stroke="var(--plot-axis)" strokeWidth={1.2} strokeDasharray="3 3" />
      {items.map((it, i) => {
        const row = Math.floor(i / perRow),
          col = i % perRow;
        const n = Math.min(perRow, items.length - row * perRow);
        const x = cx + (col - (n - 1) / 2) * 27;
        const y = 136 - row * 27;
        return it.kind === "x" ? (
          <g key={i}>
            <rect x={x - 12} y={y - 12} width={24} height={24} rx={6} fill="var(--plot-1)" />
            <text x={x} y={y + 5} textAnchor="middle" fill="white" style={{ font: "italic 15px KaTeX_Math, serif" }}>
              x
            </text>
          </g>
        ) : (
          <g key={i}>
            <circle cx={x} cy={y} r={11} fill="var(--plot-4)" />
            <text x={x} y={y + 4.5} textAnchor="middle" fill="black" style={{ font: "600 13px var(--font-geist-sans), sans-serif" }}>
              1
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Likninger som skålvekt: gjør det samme på begge sider, så holder vekta balansen. */
export function SkalvektWidget({ props }: { props: Record<string, string> }) {
  const first = PRESETS[Math.min(PRESETS.length - 1, Number(props.nr ?? 0))];
  const [eq, setEq] = useState<Eq>(first);
  const [start, setStart] = useState<Eq>(first);
  const [steps, setSteps] = useState<{ op: string; eq: Eq }[]>([]);
  const act = (op: string, next: Eq) => {
    setSteps([...steps, { op, eq: next }]);
    setEq(next);
  };
  const reset = (e: Eq) => {
    setStart(e);
    setEq(e);
    setSteps([]);
  };
  const minOnes = Math.min(eq.b, eq.d);
  const minBags = Math.min(eq.a, eq.c);
  const solved = (eq.a === 1 && eq.b === 0 && eq.c === 0) || (eq.c === 1 && eq.d === 0 && eq.a === 0);
  const canDivide = !solved && ((eq.a > 1 && eq.b === 0 && eq.c === 0 && eq.d % eq.a === 0) || (eq.c > 1 && eq.d === 0 && eq.a === 0 && eq.b % eq.c === 0));
  const divisor = eq.a > 1 ? eq.a : eq.c;
  const sol = eq.a > eq.c ? (eq.d - eq.b) / (eq.a - eq.c) : (eq.b - eq.d) / (eq.c - eq.a);
  const x0 = (start.d - start.b) / (start.a - start.c);

  const btn = "rounded-full border border-border px-3 py-1.5 text-sm transition hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <WidgetCard title="Likninger som skålvekt" hint="Posene (x) veier like mye hver. Fjern like mye fra begge skålene, så er vekta fortsatt i balanse – til én pose står alene.">
      <div className="text-center text-xl" dangerouslySetInnerHTML={{ __html: tex(eqTex(eq)) }} />
      <div className="plot-box mt-3">
        <svg viewBox="0 0 520 215" className="plot-svg" role="img" aria-label={"Skålvekt for likningen " + eqTex(eq)}>
          <path d="M260,205 L240,215 L280,215 Z" fill="var(--plot-axis)" />
          <line x1={260} x2={260} y1={32} y2={206} stroke="var(--plot-axis)" strokeWidth={4} />
          <line x1={130} x2={390} y1={40} y2={40} stroke="var(--plot-axis)" strokeWidth={5} strokeLinecap="round" />
          <circle cx={260} cy={40} r={6} fill="var(--plot-axis)" />
          <Pan cx={130} bags={eq.a} ones={eq.b} />
          <Pan cx={390} bags={eq.c} ones={eq.d} />
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button type="button" className={btn} disabled={minOnes < 1} onClick={() => act(`-${minOnes}`, { ...eq, b: eq.b - minOnes, d: eq.d - minOnes })}>
          Fjern {minOnes || ""} lodd fra begge sider
        </button>
        <button type="button" className={btn} disabled={minBags < 1} onClick={() => act(`-${minBags === 1 ? "" : minBags}x`, { ...eq, a: eq.a - minBags, c: eq.c - minBags })}>
          Fjern {minBags || ""} {minBags === 1 ? "pose" : "poser"} fra begge sider
        </button>
        <button
          type="button"
          className={btn}
          disabled={!canDivide}
          onClick={() => act(`:${divisor}`, eq.a > 1 ? { a: 1, b: 0, c: 0, d: eq.d / eq.a } : { a: 0, b: eq.b / eq.c, c: 1, d: 0 })}
        >
          Del begge sider på {canDivide ? divisor : "…"}
        </button>
      </div>
      {steps.length > 0 && (
        <ol className="mx-auto mt-4 max-w-md space-y-1 rounded-xl border border-border bg-background/60 p-3 text-sm">
          <li dangerouslySetInnerHTML={{ __html: tex(eqTex(start)) }} />
          {steps.map((s, i) => (
            <li key={i} className="flex items-center justify-between gap-3">
              <span dangerouslySetInnerHTML={{ __html: tex(eqTex(s.eq)) }} />
              <span className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: tex(`\\left|\\, ${s.op.startsWith(":") ? ":" + s.op.slice(1) : s.op}\\right.`) }} />
            </li>
          ))}
        </ol>
      )}
      {solved && (
        <p
          className="mt-3 rounded-xl border border-[color-mix(in_oklch,var(--success)_40%,var(--border))] bg-[color-mix(in_oklch,var(--success)_9%,var(--card))] p-3 text-center text-sm"
          dangerouslySetInnerHTML={{
            __html: `Løst: ${tex(`x = ${sol}`)}. Prøve i den opprinnelige likningen: ${tex(`\\text{V.S.} = ${prove(start.a, start.b, x0)}`)} og ${tex(`\\text{H.S.} = ${prove(start.c, start.d, x0)}`)}. Begge sider er like, så svaret stemmer.`,
          }}
        />
      )}
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
        <button type="button" onClick={() => reset(start)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted">
          <RotateCcw className="size-3.5" /> Start på nytt
        </button>
        <button type="button" onClick={() => reset(randomEq())} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted">
          <Shuffle className="size-3.5" /> Ny likning
        </button>
        {PRESETS.map((p, i) => (
          <button key={i} type="button" onClick={() => reset(p)} className="rounded-full border border-border px-3 py-1 hover:bg-muted" dangerouslySetInnerHTML={{ __html: tex(eqTex(p)) }} />
        ))}
      </div>
    </WidgetCard>
  );
}
