"use client";

import { useRef, useState, type ReactNode } from "react";
import { tex } from "@/lib/tex";
import { PlotFrame, Grid, type Label, type View } from "@/components/plot/core";

export function WidgetCard({ title, children, hint }: { title: string; children: ReactNode; hint?: string }) {
  return (
    <section className="not-prose overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center gap-x-2 gap-y-0.5 border-b border-border bg-muted/60 px-4 py-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-chap-ink">Interaktivt</span>
        <span className="text-sm font-medium">{title}</span>
      </header>
      <div className="p-3 sm:p-4">{children}</div>
      {hint && <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">{hint}</p>}
    </section>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  format,
}: {
  label: string; // TeX
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-14 shrink-0 text-right" dangerouslySetInnerHTML={{ __html: tex(label) }} />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-[var(--chap)]"
      />
      <span className="w-16 shrink-0 font-mono text-xs tabular-nums">{format ? format(value) : fmt(value, 2)}</span>
    </label>
  );
}

export function fmt(x: number, d = 2) {
  if (!Number.isFinite(x)) return "–";
  let s = x.toFixed(d);
  if (d > 0 && s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  if (s === "-0") s = "0";
  return s.replace(".", ",").replace("-", "−");
}

/** Tall formatert for bruk inni TeX (desimalkomma blir {,}) */
export function tfmt(x: number, d = 2) {
  return fmt(x, d).replace("−", "-").replace(",", "{,}");
}

export function Readout({ items }: { items: { k: string; v: string; color?: string }[] }) {
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-border bg-background/60 px-3 py-2">
          <div className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: tex(it.k) }} />
          <div className="mt-0.5 overflow-x-auto text-sm font-medium" style={{ color: it.color }} dangerouslySetInnerHTML={{ __html: tex(it.v) }} />
        </div>
      ))}
    </div>
  );
}

export function Toggle({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition " +
        (on ? "border-chap bg-chap-soft text-chap-ink" : "border-border text-muted-foreground hover:bg-muted")
      }
    >
      <span className={"size-2 rounded-full " + (on ? "bg-chap" : "bg-muted-foreground/40")} />
      {children}
    </button>
  );
}

export function Chips<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={
            "rounded-full border px-3 py-1 text-xs transition " +
            (o.v === value ? "border-transparent bg-chap text-white dark:text-background" : "border-border hover:bg-muted")
          }
          dangerouslySetInnerHTML={{ __html: o.label.includes("\\") || o.label.includes("^") ? tex(o.label) : o.label }}
        />
      ))}
    </div>
  );
}

export type Handle = { id: string; x: number; y: number; color: string; r?: number };

/** Interaktiv graf: tegner rutenett + children, og lar brukeren dra i håndtak. */
export function IPlot({
  v,
  children,
  labels,
  handles = [],
  onDrag,
  grid = true,
  maxWidth,
  xLabel,
  yLabel,
}: {
  v: View;
  children?: ReactNode;
  labels?: Label[];
  handles?: Handle[];
  onDrag?: (id: string, x: number, y: number) => void;
  grid?: boolean;
  maxWidth?: number;
  xLabel?: string;
  yLabel?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const toData = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * v.W;
    const py = ((e.clientY - r.top) / r.height) * v.H;
    return {
      x: v.xmin + (px / v.W) * (v.xmax - v.xmin),
      y: v.ymin + ((v.H - py) / v.H) * (v.ymax - v.ymin),
    };
  };

  return (
    <PlotFrame
      v={v}
      labels={labels}
      maxWidth={maxWidth}
      svgProps={{
        ref,
        onPointerMove: (e) => {
          if (!active || !onDrag) return;
          const d = toData(e);
          onDrag(active, d.x, d.y);
        },
        onPointerUp: () => setActive(null),
        onPointerCancel: () => setActive(null),
        style: { cursor: active ? "grabbing" : undefined },
      }}
    >
      {grid && <Grid v={v} xLabel={xLabel} yLabel={yLabel} />}
      {children}
      {handles.map((h) => {
        const cx = ((h.x - v.xmin) / (v.xmax - v.xmin)) * v.W;
        const cy = v.H - ((h.y - v.ymin) / (v.ymax - v.ymin)) * v.H;
        return (
          <g
            key={h.id}
            style={{ cursor: "grab" }}
            onPointerDown={(e) => {
              (e.currentTarget.ownerSVGElement as SVGSVGElement).setPointerCapture(e.pointerId);
              setActive(h.id);
            }}
          >
            <circle cx={cx} cy={cy} r={18} fill="transparent" />
            <circle cx={cx} cy={cy} r={active === h.id ? 15 : 11} fill={h.color} opacity={0.18} style={{ transition: "r .15s" }} />
            <circle cx={cx} cy={cy} r={h.r ?? 6.5} fill="var(--plot-bg)" stroke={h.color} strokeWidth={3} />
          </g>
        );
      })}
    </PlotFrame>
  );
}

export function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(b, x));
}

export function FnInput({ value, onChange, label = "f(x) =" }: { value: string; onChange: (s: string) => void; label?: string }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="shrink-0 font-medium" dangerouslySetInnerHTML={{ __html: tex(label.replace("=", "\\,=")) }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="h-9 w-full min-w-0 rounded-lg border border-border bg-background px-3 font-mono text-sm outline-none transition focus:border-chap focus:ring-2 focus:ring-[color-mix(in_oklch,var(--chap)_25%,transparent)]"
      />
    </label>
  );
}

/** Tallfelt med norsk desimalkomma. Oppdaterer bare når teksten er et gyldig tall. */
export function NumInput({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  width = "6.5rem",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  width?: string;
}) {
  const [text, setText] = useState(fmtPlain(value));
  const [last, setLast] = useState(value);
  if (!Object.is(value, last)) {
    setLast(value);
    setText(fmtPlain(value));
  }
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <input
        inputMode="decimal"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const v = Number(e.target.value.replace(/\s/g, "").replace(",", "."));
          if (e.target.value.trim() && Number.isFinite(v) && (min === undefined || v >= min) && (max === undefined || v <= max)) {
            setLast(v);
            onChange(v);
          }
        }}
        style={{ width }}
        className="h-9 rounded-lg border border-border bg-background px-2.5 text-right font-mono text-sm tabular-nums outline-none focus:border-chap focus:ring-2 focus:ring-[color-mix(in_oklch,var(--chap)_25%,transparent)]"
      />
      {suffix && <span className="text-muted-foreground">{suffix}</span>}
    </label>
  );
}

function fmtPlain(x: number) {
  return Number.isFinite(x) ? String(Number(x.toFixed(6))).replace(".", ",") : "";
}

/** Norsk tall med mellomrom som tusenskille (fra 10 000) og desimalkomma. */
export function nok(x: number, d = 2) {
  if (!Number.isFinite(x)) return "–";
  const r = Number(x.toFixed(d));
  let [i, dd] = String(Math.abs(r)).split(".");
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return (r < 0 ? "−" : "") + i + (dd ? "," + dd : "");
}

/** Som nok(), men klar for TeX (tusenskille som tynt mellomrom, desimalkomma som {,}). */
export function tnok(x: number, d = 2) {
  return nok(x, d).replace(/\u202f/g, "\\,").replace("−", "-").replace(",", "{,}");
}
