"use client";

import { useRef, useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { Readout, WidgetCard, clamp, nok, tnok } from "./ui";

export function parseList(s: string): number[] {
  // Skilletegn: mellomrom, semikolon eller «komma + mellomrom». Et komma mellom sifre er desimalkomma.
  return s
    .split(/;|\s+|,(?=\s)|,(?=$)/)
    .map((t) => t.trim().replace(",", "."))
    .filter(Boolean)
    .map(Number)
    .filter(Number.isFinite);
}

export function stats(xs: number[]) {
  const n = xs.length;
  const sorted = [...xs].sort((a, b) => a - b);
  const sum = xs.reduce((a, b) => a + b, 0);
  const mean = n ? sum / n : NaN;
  const median = n ? (n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2) : NaN;
  const counts = new Map<number, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  const top = Math.max(0, ...counts.values());
  const modes = top > 1 ? [...counts.entries()].filter(([, c]) => c === top).map(([x]) => x).sort((a, b) => a - b) : [];
  const range = n ? sorted[n - 1] - sorted[0] : NaN;
  const sd = n ? Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / n) : NaN;
  return { n, sorted, sum, mean, median, modes, range, sd, counts };
}

/**
 * Sentral- og spredningsmål som oppdateres når du endrer dataene.
 * props: data="5,4,5,3,4,5,5,4,5,3" (komma mellom verdiene), min="0", max="10", steg="1", enhet
 */
export function SentralmalWidget({ props }: { props: Record<string, string> }) {
  const init = (props.data ?? "5,4,5,3,4,5,5,4,5,3").split(/[,;]/).map((t) => Number(t.trim())).filter(Number.isFinite);
  const lo = Number(props.min ?? Math.min(0, ...init));
  const hi = Number(props.max ?? Math.max(...init) + 2);
  const step = Number(props.steg ?? 1);
  const [xs, setXs] = useState<number[]>(init);
  const [text, setText] = useState(init.map((x) => String(x).replace(".", ",")).join("; "));
  const [drag, setDrag] = useState<number | null>(null);
  const [band, setBand] = useState(true);
  const ref = useRef<SVGSVGElement>(null);
  const s = stats(xs);
  const W = 560,
    H = 190,
    pad = 28;
  const X = (x: number) => pad + ((x - lo) / (hi - lo)) * (W - 2 * pad);
  const axisY = 130;
  const maxCount = Math.max(1, ...s.counts.values());
  const r = Math.max(3, Math.min(8, (axisY - 22) / (2 * maxCount + 0.5)));
  const dec = step < 1 ? 2 : 0;

  // plassering av prikkene: like verdier stables oppover
  const seen = new Map<number, number>();
  const dots = xs.map((x, i) => {
    const k = seen.get(x) ?? 0;
    seen.set(x, k + 1);
    return { i, x, y: axisY - r - 2 - k * (2 * r + 1) };
  });
  const update = (next: number[]) => {
    setXs(next);
    setText(next.map((x) => String(x).replace(".", ",")).join("; "));
  };
  const toVal = (clientX: number) => {
    const b = ref.current!.getBoundingClientRect();
    const px = ((clientX - b.left) / b.width) * W;
    const v = lo + ((px - pad) / (W - 2 * pad)) * (hi - lo);
    return Number((Math.round(clamp(v, lo, hi) / step) * step).toFixed(6));
  };
  const ticks: number[] = [];
  const tstep = (hi - lo) / step > 20 ? Math.ceil((hi - lo) / 10 / step) * step : step;
  for (let t = lo; t <= hi + 1e-9; t += tstep) ticks.push(Number(t.toFixed(6)));

  return (
    <WidgetCard title={props.title ?? "Sentralmål og spredningsmål"} hint="Dra i prikkene langs tallinja, eller skriv inn egne data. Gjennomsnittet er balansepunktet (trekanten), medianen er verdien i midten.">
      <div className="plot-box">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="plot-svg"
          onPointerMove={(e) => {
            if (drag === null) return;
            const v = toVal(e.clientX);
            if (v !== xs[drag]) update(xs.map((x, j) => (j === drag ? v : x)));
          }}
          onPointerUp={() => setDrag(null)}
          onPointerCancel={() => setDrag(null)}
          style={{ cursor: drag !== null ? "grabbing" : undefined }}
          role="img"
          aria-label="Prikkdiagram over dataene"
        >
          {band && Number.isFinite(s.sd) && (
            <rect x={X(clamp(s.mean - s.sd, lo, hi))} width={X(clamp(s.mean + s.sd, lo, hi)) - X(clamp(s.mean - s.sd, lo, hi))} y={14} height={axisY - 14} fill="var(--plot-4)" opacity={0.13} />
          )}
          <line x1={pad - 10} x2={W - pad + 10} y1={axisY} y2={axisY} stroke="var(--plot-axis)" strokeWidth={1.5} />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={X(t)} x2={X(t)} y1={axisY - 4} y2={axisY + 4} stroke="var(--plot-axis)" />
              <text x={X(t)} y={axisY + 19} textAnchor="middle" className="plot-num">
                {nok(t, dec)}
              </text>
            </g>
          ))}
          {Number.isFinite(s.median) && (
            <g>
              <line x1={X(s.median)} x2={X(s.median)} y1={14} y2={axisY} stroke="var(--plot-3)" strokeWidth={2} strokeDasharray="6 4" />
              <text x={X(s.median)} y={11} textAnchor="middle" className="plot-num" style={{ fill: "var(--plot-3)", fontWeight: 600 }}>
                median
              </text>
            </g>
          )}
          {Number.isFinite(s.mean) && (
            <g>
              <path d={`M${X(s.mean)},${axisY + 26} l-9,15 h18 z`} fill="var(--plot-2)" />
              <text x={X(s.mean)} y={axisY + 56} textAnchor="middle" className="plot-num" style={{ fill: "var(--plot-2)", fontWeight: 600 }}>
                gjennomsnitt
              </text>
            </g>
          )}
          {dots.map((d) => (
            <circle
              key={d.i}
              cx={X(d.x)}
              cy={Math.max(r, d.y)}
              r={r}
              fill={drag === d.i ? "var(--plot-2)" : "var(--plot-1)"}
              stroke="var(--plot-bg)"
              strokeWidth={1.5}
              style={{ cursor: "grab" }}
              onPointerDown={(e) => {
                (e.currentTarget.ownerSVGElement as SVGSVGElement).setPointerCapture(e.pointerId);
                setDrag(d.i);
              }}
            />
          ))}
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <button type="button" onClick={() => update([...xs, Number.isFinite(s.median) ? Math.round(s.median / step) * step : lo])} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted">
          <Plus className="size-3.5" /> Ny verdi
        </button>
        <button type="button" disabled={xs.length <= 1} onClick={() => update(xs.slice(0, -1))} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted disabled:opacity-40">
          <Minus className="size-3.5" /> Fjern siste
        </button>
        <button type="button" onClick={() => update(init)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted">
          <RotateCcw className="size-3.5" /> Tilbakestill
        </button>
        <label className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground">
          <input type="checkbox" checked={band} onChange={(e) => setBand(e.target.checked)} /> vis ett standardavvik til hver side
        </label>
      </div>
      <label className="mt-3 block text-sm">
        <span className="text-muted-foreground">Dataene (skill verdiene med semikolon eller mellomrom):</span>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const v = parseList(e.target.value).map((x) => clamp(x, lo, hi));
            if (v.length) setXs(v);
          }}
          spellCheck={false}
          className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none focus:border-chap"
        />
      </label>
      <p className="mt-2 text-xs text-muted-foreground">Sortert: {s.sorted.map((x) => nok(x, 2)).join(", ")}</p>
      <Readout
        items={[
          { k: "N", v: String(s.n) },
          { k: "\\text{Gjennomsnitt } \\bar x", v: `\\tfrac{${tnok(s.sum, 2)}}{${s.n}} \\approx ${tnok(s.mean, 2)}`, color: "var(--plot-2)" },
          { k: "\\text{Median}", v: tnok(s.median, 2), color: "var(--plot-3)" },
          { k: "\\text{Typetall}", v: s.modes.length ? s.modes.map((m) => tnok(m, 2)).join(" \\text{ og } ") : "\\text{ingen (alle like ofte)}" },
          { k: "\\text{Variasjonsbredde}", v: `${tnok(s.sorted[s.n - 1] ?? NaN, 2)} - ${tnok(s.sorted[0] ?? NaN, 2)} = ${tnok(s.range, 2)}` },
          { k: "\\text{Standardavvik } \\sigma", v: `\\approx ${tnok(s.sd, 2)}`, color: "var(--plot-4)" },
        ]}
      />
    </WidgetCard>
  );
}
