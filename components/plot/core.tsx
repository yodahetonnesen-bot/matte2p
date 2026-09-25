// Rene (hook-frie) byggeklosser for grafer. Brukes både av statiske grafer
// som rendres på serveren og av interaktive widgets på klienten.
import type { ReactNode } from "react";
import { tex } from "@/lib/tex";
import { formatNum } from "@/lib/expr";

export type View = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  W: number;
  H: number;
};

export function makeView(xmin: number, xmax: number, ymin: number, ymax: number, W = 560, H?: number): View {
  const h = H ?? Math.round(Math.min(Math.max((W * (ymax - ymin)) / (xmax - xmin), W * 0.45), W * 1.05));
  return { xmin, xmax, ymin, ymax, W, H: h };
}

export const sx = (v: View, x: number) => ((x - v.xmin) / (v.xmax - v.xmin)) * v.W;
export const sy = (v: View, y: number) => v.H - ((y - v.ymin) / (v.ymax - v.ymin)) * v.H;
export const ix = (v: View, px: number) => v.xmin + (px / v.W) * (v.xmax - v.xmin);
export const iy = (v: View, py: number) => v.ymin + ((v.H - py) / v.H) * (v.ymax - v.ymin);

export function niceStep(range: number, target: number) {
  const raw = range / Math.max(1, target);
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  const n = m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10;
  return n * p;
}

export const COLORS = ["var(--plot-1)", "var(--plot-2)", "var(--plot-3)", "var(--plot-4)", "var(--plot-5)", "var(--plot-6)"];
export function color(c: string | number | undefined, i = 0) {
  if (c === undefined || c === "") return COLORS[i % COLORS.length];
  const n = Number(c);
  if (Number.isInteger(n) && n >= 1 && n <= 6) return COLORS[n - 1];
  if (c === "ink") return "var(--plot-ink)";
  if (c === "muted") return "var(--plot-muted)";
  return String(c);
}

export type Label = {
  x: number;
  y: number;
  text: string; // markup: ren tekst med $matte$, eller bare matte hvis math=true
  math?: boolean;
  pos?: string; // n, s, e, w, ne, nw, se, sw, c
  color?: string;
  small?: boolean;
};

export function Grid({
  v,
  xstep,
  ystep,
  showNumbers = true,
  xLabel = "x",
  yLabel = "y",
  axes = true,
  piTicks = false,
}: {
  v: View;
  xstep?: number;
  ystep?: number;
  showNumbers?: boolean;
  xLabel?: string;
  yLabel?: string;
  axes?: boolean;
  piTicks?: boolean;
}) {
  const xs = xstep ?? niceStep(v.xmax - v.xmin, v.W / 55);
  const ys = ystep ?? niceStep(v.ymax - v.ymin, v.H / 45);
  const lines: ReactNode[] = [];
  const labels: ReactNode[] = [];
  const x0 = Math.min(Math.max(0, v.xmin), v.xmax);
  const y0 = Math.min(Math.max(0, v.ymin), v.ymax);
  const X0 = sx(v, x0);
  const Y0 = sy(v, y0);
  for (let k = Math.ceil(v.xmin / xs); k * xs <= v.xmax + 1e-9; k++) {
    const x = k * xs;
    const px = sx(v, x);
    lines.push(<line key={"gx" + k} x1={px} x2={px} y1={0} y2={v.H} className="plot-grid" />);
    if (showNumbers && Math.abs(x) > 1e-9 && px > 12 && px < v.W - 12) {
      const below = Y0 + 15 < v.H - 2 ? Y0 + 15 : Y0 - 6;
      labels.push(
        <text key={"lx" + k} x={px} y={below} textAnchor="middle" className="plot-num">
          {piTicks ? "" : formatNum(x, 4)}
        </text>,
      );
    }
  }
  for (let k = Math.ceil(v.ymin / ys); k * ys <= v.ymax + 1e-9; k++) {
    const y = k * ys;
    const py = sy(v, y);
    lines.push(<line key={"gy" + k} x1={0} x2={v.W} y1={py} y2={py} className="plot-grid" />);
    if (showNumbers && Math.abs(y) > 1e-9 && py > 10 && py < v.H - 8) {
      const left = X0 - 6 > 18;
      labels.push(
        <text key={"ly" + k} x={left ? X0 - 6 : X0 + 6} y={py + 4} textAnchor={left ? "end" : "start"} className="plot-num">
          {groupNum(formatNum(y, 4))}
        </text>,
      );
    }
  }
  return (
    <g>
      {lines}
      {axes && (
        <g className="plot-axis">
          <line x1={0} x2={v.W - 2} y1={Y0} y2={Y0} />
          <line x1={X0} x2={X0} y1={v.H} y2={2} />
          <path d={`M${v.W - 1},${Y0} l-9,-4.5 v9 z`} className="plot-axis-head" />
          <path d={`M${X0},1 l-4.5,9 h9 z`} className="plot-axis-head" />
          <text x={v.W - 8} y={Y0 - 8} textAnchor="end" className="plot-axis-label" style={{ fontStyle: axisItalic(xLabel) }}>
            {axisText(xLabel)}
          </text>
          <text x={X0 + 9} y={13} className="plot-axis-label" style={{ fontStyle: axisItalic(yLabel) }}>
            {axisText(yLabel)}
          </text>
          {showNumbers && x0 === 0 && y0 === 0 && (
            <text x={X0 - 6} y={Y0 + 15} textAnchor="end" className="plot-num">
              0
            </text>
          )}
        </g>
      )}
      {labels}
    </g>
  );
}

/** Lager SVG-path for en funksjon; bryter linja ved asymptoter og hull. */
export function fnPath(
  v: View,
  f: (x: number) => number,
  opts: { a?: number; b?: number; n?: number; brk?: number } = {},
): string {
  const a = Math.max(opts.a ?? v.xmin, v.xmin - 1e-9);
  const b = Math.min(opts.b ?? v.xmax, v.xmax + 1e-9);
  if (!(b > a)) return "";
  const n = opts.n ?? 480;
  const span = v.ymax - v.ymin;
  const lim = opts.brk ?? span * 0.75;
  const lo = v.ymin - span * 2;
  const hi = v.ymax + span * 2;
  let d = "";
  let pen = false;
  let prev = NaN;
  for (let i = 0; i <= n; i++) {
    const x = a + ((b - a) * i) / n;
    let y = f(x);
    if (!Number.isFinite(y)) {
      pen = false;
      prev = NaN;
      continue;
    }
    if (pen && Math.abs(y - prev) > lim) pen = false;
    prev = y;
    y = Math.min(hi, Math.max(lo, y));
    const px = sx(v, x).toFixed(2);
    const py = sy(v, y).toFixed(2);
    d += (pen ? "L" : "M") + px + "," + py;
    pen = true;
  }
  return d;
}

export function paramPath(v: View, fx: (t: number) => number, fy: (t: number) => number, t0: number, t1: number, n = 400) {
  let d = "";
  let pen = false;
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    const x = fx(t);
    const y = fy(t);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      pen = false;
      continue;
    }
    d += (pen ? "L" : "M") + sx(v, x).toFixed(2) + "," + sy(v, y).toFixed(2);
    pen = true;
  }
  return d;
}

export function Arrow({
  v,
  x1,
  y1,
  x2,
  y2,
  stroke,
  width = 2.4,
  dash,
  head = 11,
}: {
  v: View;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  width?: number;
  dash?: boolean;
  head?: number;
}) {
  const X1 = sx(v, x1),
    Y1 = sy(v, y1),
    X2 = sx(v, x2),
    Y2 = sy(v, y2);
  const len = Math.hypot(X2 - X1, Y2 - Y1);
  if (len < 0.5) return null;
  const ux = (X2 - X1) / len,
    uy = (Y2 - Y1) / len;
  const h = Math.min(head, len * 0.6);
  const bx = X2 - ux * h,
    by = Y2 - uy * h;
  const px = -uy * h * 0.42,
    py = ux * h * 0.42;
  return (
    <g>
      <line x1={X1} y1={Y1} x2={bx + ux * 1} y2={by + uy * 1} stroke={stroke} strokeWidth={width} strokeDasharray={dash ? "6 5" : undefined} strokeLinecap="round" />
      <path d={`M${X2},${Y2} L${bx + px},${by + py} L${bx - px},${by - py} Z`} fill={stroke} />
    </g>
  );
}

export function Dot({ v, x, y, fill, open, r = 4.6 }: { v: View; x: number; y: number; fill: string; open?: boolean; r?: number }) {
  return (
    <circle
      cx={sx(v, x)}
      cy={sy(v, y)}
      r={r}
      fill={open ? "var(--plot-bg)" : fill}
      stroke={fill}
      strokeWidth={open ? 2 : 1.5}
    />
  );
}

const POS: Record<string, [string, string]> = {
  n: ["-50%", "-115%"],
  s: ["-50%", "15%"],
  e: ["10px", "-50%"],
  w: ["calc(-100% - 10px)", "-50%"],
  ne: ["6px", "-110%"],
  nw: ["calc(-100% - 6px)", "-110%"],
  se: ["6px", "10%"],
  sw: ["calc(-100% - 6px)", "10%"],
  c: ["-50%", "-50%"],
};
POS.above = POS.n;
POS.below = POS.s;
POS.left = POS.w;
POS.right = POS.e;

function labelHtml(text: string, math?: boolean) {
  if (math) return tex(text);
  // ren tekst med innebygd $matte$
  return text
    .split(/(\$[^$]+\$)/g)
    .map((s) => (s.startsWith("$") && s.endsWith("$") && s.length > 1 ? tex(s.slice(1, -1)) : escapeHtml(s)))
    .join("");
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function PlotFrame({
  v,
  children,
  labels = [],
  className = "",
  svgProps,
  maxWidth,
  caption,
}: {
  v: View;
  children: ReactNode;
  labels?: Label[];
  className?: string;
  svgProps?: React.SVGProps<SVGSVGElement>;
  maxWidth?: number;
  caption?: string;
}) {
  return (
    <figure className={"plot-figure " + className} style={{ maxWidth: maxWidth ?? v.W }}>
      <div className="plot-box">
        <svg viewBox={`0 0 ${v.W} ${v.H}`} className="plot-svg" role="img" {...svgProps}>
          {children}
        </svg>
        {labels.map((l, i) => {
          const px = (sx(v, l.x) / v.W) * 100;
          const py = (sy(v, l.y) / v.H) * 100;
          if (px < -5 || px > 105 || py < -5 || py > 105) return null;
          const [tx, ty] = POS[l.pos ?? "ne"] ?? POS.ne;
          return (
            <div
              key={i}
              className={"plot-label" + (l.small ? " plot-label-sm" : "")}
              style={{ left: px + "%", top: py + "%", transform: `translate(${tx}, ${ty})`, color: l.color }}
              dangerouslySetInnerHTML={{ __html: labelHtml(l.text, l.math) }}
            />
          );
        })}
      </div>
      {caption && <figcaption className="plot-caption">{caption}</figcaption>}
    </figure>
  );
}

/** Aksetitler kan skrives som enkel TeX: \text{år}, \ln y, t. */
function axisText(s: string) {
  return s
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\(ln|lg|log|sin|cos)\b\s*/g, "$1 ")
    .replace(/[{}]/g, "")
    .replace(/\\,/g, " ")
    .trim();
}
function axisItalic(s: string) {
  return /^[a-zA-Z]$/.test(axisText(s)) ? "italic" : "normal";
}
/** 12000 → 12 000 (tynt mellomrom) for store tall på aksene. */
function groupNum(s: string) {
  return /^[−-]?\d{5,}$/.test(s) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009") : s;
}
