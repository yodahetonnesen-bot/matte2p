// Statistiske diagrammer (søyle-, sektor-, linjediagram, histogram og kumulativ
// frekvens) fra en ::diagram-blokk. Figuren tegnes i SVG, mens all tekst er vanlig
// HTML, slik at tallene er like lette å lese på mobil som på PC. Ingen hooks –
// alt rendres på serveren.
import type { CSSProperties, ReactNode } from "react";
import type { DiagramSpec } from "@/lib/markup";
import { inlineHtml } from "@/lib/inline";

const PAL = ["var(--plot-1)", "var(--plot-2)", "var(--plot-3)", "var(--plot-4)", "var(--plot-5)", "var(--plot-6)"];
function col(c: string | undefined, i: number) {
  if (c === undefined || c === "") return PAL[i % PAL.length];
  const n = Number(c);
  if (Number.isInteger(n) && n >= 1 && n <= 6) return PAL[n - 1];
  if (c === "muted") return "var(--plot-muted)";
  return c;
}

/** Norsk tallformat: desimalkomma, og mellomrom i tall fra 10 000. */
export function fmtNo(x: number, dec = 2): string {
  if (!Number.isFinite(x)) return "–";
  const r = Number(x.toFixed(dec));
  let [i, d] = String(Math.abs(r)).split(".");
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (r < 0 ? "−" : "") + i + (d ? "," + d : "");
}

function niceStep(range: number, target: number) {
  const raw = range / Math.max(1, target);
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  const n = m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10;
  return n * p;
}

type Axis = { lo: number; hi: number; step: number };
function axis(lo: number, hi: number, o: Record<string, string>, target = 5): Axis {
  const a = o.ymin !== undefined ? Number(o.ymin) : Math.min(0, lo);
  let b = o.ymax !== undefined ? Number(o.ymax) : hi;
  const step = o.ys ? Number(o.ys) : niceStep(b - a || 1, target);
  if (o.ymax === undefined) b = Math.ceil((b - 1e-9) / step) * step;
  if (b <= a) b = a + step;
  return { lo: a, hi: b, step };
}
function tickValues(ax: Axis) {
  const out: number[] = [];
  for (let k = Math.ceil(ax.lo / ax.step - 1e-9); k * ax.step <= ax.hi + 1e-9; k++) out.push(Number((k * ax.step).toPrecision(12)));
  return out;
}
const decOf = (step: number) => Math.max(0, Math.min(4, -Math.floor(Math.log10(step) + 1e-9)));
const txt = (s: string) => ({ __html: inlineHtml(s.replace(/_/g, " ")) });

/** Rammen rundt kartesiske diagrammer: y-akse med tall, plottflate, x-akse og titler. */
function Frame({
  spec,
  legend,
  yTicks,
  yPos,
  xRow,
  svg,
  overlay,
  height,
  yColWidth,
  yCats,
}: {
  spec: DiagramSpec;
  legend?: { name: string; color: string; dash?: boolean }[];
  yTicks: number[];
  yPos: (y: number) => number; // prosent fra toppen
  xRow: ReactNode;
  svg: ReactNode;
  overlay?: ReactNode;
  height: string;
  yColWidth: string;
  yCats?: ReactNode;
}) {
  const o = spec.opts;
  const dec = yTicks.length > 1 ? decOf(yTicks[1] - yTicks[0]) : 0;
  return (
    <figure className="dia" style={{ maxWidth: o.mw ? Number(o.mw) : o.w ? Number(o.w) : 600 }} role="img" aria-label={o.tittel ?? "Diagram"}>
      <div className="dia-box">
        {o.tittel && <div className="dia-title" dangerouslySetInnerHTML={txt(o.tittel)} />}
        {legend && legend.length > 1 && (
          <div className="dia-legend">
            {legend.map((l) => (
              <span key={l.name} className="dia-leg">
                <span className="dia-sw" style={{ background: l.color, opacity: l.dash ? 0.55 : 1 }} />
                <span dangerouslySetInnerHTML={txt(l.name)} />
              </span>
            ))}
          </div>
        )}
        <div className="dia-grid" style={{ ["--dia-h" as string]: height } as CSSProperties}>
          <div className="dia-ytitle" dangerouslySetInnerHTML={o.yl ? txt(o.yl) : { __html: "" }} />
          {yCats ?? (
            <div className="dia-yticks" style={{ width: yColWidth }}>
              {yTicks.map((t) => (
                <span key={t} style={{ top: yPos(t) + "%" }}>
                  {o.prosent ? fmtNo(t * 100, Math.max(0, dec - 2)) + " %" : fmtNo(t, dec)}
                </span>
              ))}
            </div>
          )}
          <div className="dia-plot">
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden>
              {svg}
            </svg>
            {overlay}
          </div>
          <div />
          <div />
          {xRow}
          {o.xl && (
            <>
              <div />
              <div />
              <div className="dia-xtitle" dangerouslySetInnerHTML={txt(o.xl)} />
            </>
          )}
        </div>
        {o.kilde && <div className="dia-src" dangerouslySetInnerHTML={txt("Kilde: " + o.kilde)} />}
      </div>
      {o.cap && <figcaption className="plot-caption" dangerouslySetInnerHTML={txt(o.cap)} />}
    </figure>
  );
}

function gridLines(ticks: number[], yp: (y: number) => number, horizontal = true) {
  return ticks.map((t) =>
    horizontal ? (
      <line key={"g" + t} x1={0} x2={1000} y1={yp(t) * 10} y2={yp(t) * 10} className={t === 0 ? "dia-axis" : "dia-gridline"} vectorEffect="non-scaling-stroke" />
    ) : (
      <line key={"g" + t} y1={0} y2={1000} x1={yp(t) * 10} x2={yp(t) * 10} className={t === 0 ? "dia-axis" : "dia-gridline"} vectorEffect="non-scaling-stroke" />
    ),
  );
}

// ---------------------------------------------------------------------------
// Søylediagram (også liggende og stablet)
// ---------------------------------------------------------------------------
function Bars({ spec }: { spec: DiagramSpec }) {
  const o = spec.opts;
  const n = spec.cats.length || Math.max(0, ...spec.series.map((s) => s.values.length));
  const cats = spec.cats.length ? spec.cats : Array.from({ length: n }, (_, i) => String(i + 1));
  const stacked = "stablet" in o;
  const sums = cats.map((_, i) => spec.series.reduce((a, s) => a + (s.values[i] ?? 0), 0));
  const maxV = stacked ? Math.max(0, ...sums) : Math.max(0, ...spec.series.flatMap((s) => s.values.map((v) => v ?? 0)));
  const minV = Math.min(0, ...spec.series.flatMap((s) => s.values.map((v) => v ?? 0)));
  const ax = axis(minV, maxV * (o.verdier ? 1.12 : 1.02), o);
  const ticks = tickValues(ax);
  const vp = (y: number) => Math.min(100, Math.max(0, ((y - ax.lo) / (ax.hi - ax.lo)) * 100)); // 0–100 fra null-linja
  const dec = Number(o.des ?? 2);
  const horiz = "liggende" in o;
  const slot = 1000 / n;
  const groupW = slot * (stacked || spec.series.length === 1 ? 0.6 : 0.78);
  const ns = stacked ? 1 : spec.series.length;
  const bw = groupW / ns;
  const rects: ReactNode[] = [];
  const vals: ReactNode[] = [];
  cats.forEach((_, i) => {
    let acc = 0;
    spec.series.forEach((s, j) => {
      const v = s.values[i];
      if (v === null || v === undefined) return;
      const c = col(s.opts.c, j);
      const from = stacked ? acc : Math.max(ax.lo, 0);
      const to = stacked ? acc + v : v;
      acc += stacked ? v : 0;
      const p0 = vp(Math.min(from, to)),
        p1 = vp(Math.max(from, to));
      const off = i * slot + (slot - groupW) / 2 + (stacked ? 0 : j * bw);
      if (horiz) rects.push(<rect key={i + "-" + j} y={off} height={bw * 0.94} x={p0 * 10} width={(p1 - p0) * 10} fill={c} />);
      else rects.push(<rect key={i + "-" + j} x={off + bw * 0.03} width={bw * 0.94} y={1000 - p1 * 10} height={(p1 - p0) * 10} fill={c} />);
      if (o.verdier && !stacked) {
        const pos = (off + bw / 2) / 10;
        vals.push(
          <span key={"v" + i + j} className="dia-val" style={horiz ? { top: pos + "%", left: p1 + "%", transform: "translate(0.3rem,-50%)" } : { left: pos + "%", bottom: p1 + "%", transform: "translate(-50%,-0.15rem)" }}>
            {fmtNo(v, dec)}
          </span>,
        );
      }
    });
    if (o.verdier && stacked) {
      const pos = (i * slot + slot / 2) / 10;
      vals.push(
        <span key={"s" + i} className="dia-val" style={horiz ? { top: pos + "%", left: vp(sums[i]) + "%", transform: "translate(0.3rem,-50%)" } : { left: pos + "%", bottom: vp(sums[i]) + "%", transform: "translate(-50%,-0.15rem)" }}>
          {fmtNo(sums[i], dec)}
        </span>,
      );
    }
  });
  const legend = spec.series.map((s, j) => ({ name: s.name, color: col(s.opts.c, j) }));
  const catLabels = cats.map((c, i) => <span key={i} dangerouslySetInnerHTML={txt(c)} />);
  const tickDec = ticks.length > 1 ? decOf(ticks[1] - ticks[0]) : 0;
  const yColWidth = `${Math.max(1.4, Math.max(...ticks.map((t) => fmtNo(t, tickDec).length)) * 0.46 + 0.3)}rem`;

  if (horiz) {
    const rowH = Number(o.rad ?? 2.3);
    return (
      <Frame
        spec={spec}
        legend={legend}
        yTicks={[]}
        yPos={() => 0}
        height={`${n * rowH}rem`}
        yColWidth="auto"
        yCats={<div className="dia-ycats">{catLabels}</div>}
        xRow={
          <div className="dia-xticks dia-xticks-num">
            {ticks.map((t) => (
              <span key={t} style={{ left: vp(t) + "%" }}>
                {fmtNo(t, tickDec)}
              </span>
            ))}
          </div>
        }
        svg={
          <>
            {gridLines(ticks, vp, false)}
            {rects}
            <line x1={0} x2={0} y1={0} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
          </>
        }
        overlay={vals}
      />
    );
  }
  return (
    <Frame
      spec={spec}
      legend={legend}
      yTicks={ticks}
      yPos={(y) => 100 - vp(y)}
      height={o.h ? `${Number(o.h) / 16}rem` : "15rem"}
      yColWidth={yColWidth}
      xRow={<div className="dia-xcats">{catLabels}</div>}
      svg={
        <>
          {gridLines(ticks, (y) => 100 - vp(y))}
          {rects}
          <line x1={0} x2={1000} y1={1000} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
          <line x1={0} x2={0} y1={0} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
        </>
      }
      overlay={vals}
    />
  );
}

// ---------------------------------------------------------------------------
// Linjediagram: kategorier (kat:) med lik avstand, eller tall (x:) med riktig avstand
// ---------------------------------------------------------------------------
function Lines({ spec }: { spec: DiagramSpec }) {
  const o = spec.opts;
  const n = spec.cats.length;
  const numeric = !!spec.xs;
  const xs = spec.xs ?? [];
  const xlo = o.xmin !== undefined ? Number(o.xmin) : numeric ? Math.min(...xs) : 0;
  const xhi = o.xmax !== undefined ? Number(o.xmax) : numeric ? Math.max(...xs) : 0;
  const xp = (i: number) => (numeric ? ((xs[i] - xlo) / (xhi - xlo || 1)) * 100 : ((i + 0.5) / n) * 100);
  const all = spec.series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const ax = axis(Math.min(...all), Math.max(...all) * 1.02, o);
  const ticks = tickValues(ax);
  const yp = (y: number) => 100 - ((y - ax.lo) / (ax.hi - ax.lo)) * 100;
  const lines: ReactNode[] = [];
  const dots: ReactNode[] = [];
  const vals: ReactNode[] = [];
  const dec = Number(o.des ?? 2);
  spec.series.forEach((s, j) => {
    const c = col(s.opts.c, j);
    let seg: string[] = [];
    const flush = (k: number) => {
      if (seg.length > 1)
        lines.push(
          <polyline key={j + "-" + k} points={seg.join(" ")} fill="none" stroke={c} strokeWidth={2.6} strokeLinejoin="round" strokeDasharray={"dash" in s.opts ? "7 6" : undefined} vectorEffect="non-scaling-stroke" />,
        );
      seg = [];
    };
    s.values.forEach((v, i) => {
      if (v === null || i >= n) {
        flush(i);
        return;
      }
      seg.push(`${(xp(i) * 10).toFixed(2)},${(yp(v) * 10).toFixed(2)}`);
      if (!("ingenpunkter" in o)) dots.push(<span key={j + "p" + i} className="dia-dot" style={{ left: xp(i) + "%", top: yp(v) + "%", background: c }} />);
      if (o.verdier) vals.push(<span key={j + "v" + i} className="dia-val" style={{ left: xp(i) + "%", top: yp(v) + "%", transform: "translate(-50%,-135%)" }}>{fmtNo(v, dec)}</span>);
    });
    flush(-1);
  });
  const legend = spec.series.map((s, j) => ({ name: s.name, color: col(s.opts.c, j), dash: "dash" in s.opts }));
  const tickDec = ticks.length > 1 ? decOf(ticks[1] - ticks[0]) : 0;
  const yColWidth = `${Math.max(1.4, Math.max(...ticks.map((t) => fmtNo(t, tickDec).length)) * 0.46 + 0.3)}rem`;
  let xRow: ReactNode;
  if (numeric) {
    const step = o.xs ? Number(o.xs) : null;
    const xt = step ? tickValues({ lo: xlo, hi: xhi, step }) : xs;
    xRow = (
      <div className="dia-xticks dia-xticks-num">
        {xt.map((t, i) => (
          <span key={i} style={{ left: ((t - xlo) / (xhi - xlo || 1)) * 100 + "%" }}>
            {step ? fmtNo(t, 2) : spec.cats[i]}
          </span>
        ))}
      </div>
    );
  } else xRow = <div className="dia-xcats">{spec.cats.map((c, i) => <span key={i} dangerouslySetInnerHTML={txt(c)} />)}</div>;
  return (
    <Frame
      spec={spec}
      legend={legend}
      yTicks={ticks}
      yPos={yp}
      height={o.h ? `${Number(o.h) / 16}rem` : "15rem"}
      yColWidth={yColWidth}
      xRow={xRow}
      svg={
        <>
          {gridLines(ticks, yp)}
          {numeric && o.xs && tickValues({ lo: xlo, hi: xhi, step: Number(o.xs) }).map((t) => (
            <line key={"vx" + t} x1={((t - xlo) / (xhi - xlo)) * 1000} x2={((t - xlo) / (xhi - xlo)) * 1000} y1={0} y2={1000} className="dia-gridline" vectorEffect="non-scaling-stroke" />
          ))}
          <line x1={0} x2={1000} y1={1000} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
          <line x1={0} x2={0} y1={0} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
          {lines}
        </>
      }
      overlay={
        <>
          {dots}
          {vals}
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Histogram og kumulativ frekvens (gruppert materiale)
// ---------------------------------------------------------------------------
function Grouped({ spec }: { spec: DiagramSpec }) {
  const o = spec.opts;
  const b = spec.bounds;
  const f = spec.freq;
  const N = f.reduce((a, x) => a + x, 0);
  const xlo = o.xmin !== undefined ? Number(o.xmin) : b[0];
  const xhi = o.xmax !== undefined ? Number(o.xmax) : b[b.length - 1];
  const xp = (x: number) => ((x - xlo) / (xhi - xlo)) * 100;
  const dec = Number(o.des ?? 2);
  const xRow = (
    <div className="dia-xticks dia-xticks-num">
      {b.map((t, i) => (
        <span key={i} style={{ left: xp(t) + "%" }}>
          {fmtNo(t, 2)}
        </span>
      ))}
    </div>
  );
  if (spec.type === "histogram") {
    const heights = f.map((v, i) => (o.hoyder ? v : v / (b[i + 1] - b[i])));
    const ax = axis(0, Math.max(...heights) * (o.verdier ? 1.14 : 1.02), o);
    const ticks = tickValues(ax);
    const yp = (y: number) => 100 - ((y - ax.lo) / (ax.hi - ax.lo)) * 100;
    const tickDec = ticks.length > 1 ? decOf(ticks[1] - ticks[0]) : 0;
    return (
      <Frame
        spec={spec}
        yTicks={ticks}
        yPos={yp}
        height={o.h ? `${Number(o.h) / 16}rem` : "15rem"}
        yColWidth={`${Math.max(1.4, Math.max(...ticks.map((t) => fmtNo(t, tickDec).length)) * 0.46 + 0.3)}rem`}
        xRow={xRow}
        svg={
          <>
            {gridLines(ticks, yp)}
            {heights.map((h, i) => (
              <rect
                key={i}
                x={xp(b[i]) * 10}
                width={(xp(b[i + 1]) - xp(b[i])) * 10}
                y={yp(h) * 10}
                height={(100 - yp(h)) * 10}
                fill={col(o.c, 0)}
                fillOpacity={0.78}
                stroke="var(--plot-bg)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <line x1={0} x2={1000} y1={1000} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
            <line x1={0} x2={0} y1={0} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
          </>
        }
        overlay={
          o.verdier
            ? heights.map((h, i) => (
                <span key={i} className="dia-val" style={{ left: (xp(b[i]) + xp(b[i + 1])) / 2 + "%", top: yp(h) + "%", transform: "translate(-50%,-120%)" }}>
                  {o.verdier === "frekvens" ? fmtNo(f[i], 0) : fmtNo(h, dec)}
                </span>
              ))
            : null
        }
      />
    );
  }
  // kumulativ frekvens: relativ (0–1) eller absolutt («abs»)
  const abs = "abs" in o;
  const pts: [number, number][] = [[b[0], 0]];
  let acc = 0;
  f.forEach((v, i) => {
    acc += v;
    pts.push([b[i + 1], abs ? acc : acc / N]);
  });
  const ax = axis(0, abs ? N : 1, abs ? o : { ...o, ymax: o.ymax ?? "1", ys: o.ys ?? "0.1" });
  const ticks = tickValues(ax);
  const yp = (y: number) => 100 - ((y - ax.lo) / (ax.hi - ax.lo)) * 100;
  let med: number | null = null;
  const half = abs ? N / 2 : 0.5;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1],
      [x1, y1] = pts[i];
    if (y0 <= half && y1 >= half && y1 > y0) {
      med = x0 + ((half - y0) / (y1 - y0)) * (x1 - x0);
      break;
    }
  }
  const tickDec = ticks.length > 1 ? decOf(ticks[1] - ticks[0]) : 0;
  return (
    <Frame
      spec={spec}
      yTicks={ticks}
      yPos={yp}
      height={o.h ? `${Number(o.h) / 16}rem` : "15rem"}
      yColWidth={`${Math.max(1.4, Math.max(...ticks.map((t) => (o.prosent ? fmtNo(t * 100, 0) + " %" : fmtNo(t, tickDec)).length)) * 0.46 + 0.3)}rem`}
      xRow={xRow}
      svg={
        <>
          {gridLines(ticks, yp)}
          {b.map((t) => (
            <line key={"v" + t} x1={xp(t) * 10} x2={xp(t) * 10} y1={0} y2={1000} className="dia-gridline" vectorEffect="non-scaling-stroke" />
          ))}
          <line x1={0} x2={1000} y1={1000} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
          <line x1={0} x2={0} y1={0} y2={1000} className="dia-axis" vectorEffect="non-scaling-stroke" />
          {o.median && med !== null && (
            <polyline
              points={`0,${yp(half) * 10} ${xp(med) * 10},${yp(half) * 10} ${xp(med) * 10},1000`}
              fill="none"
              stroke="var(--plot-2)"
              strokeWidth={1.8}
              strokeDasharray="6 5"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <polyline points={pts.map(([x, y]) => `${xp(x) * 10},${yp(y) * 10}`).join(" ")} fill="none" stroke={col(o.c, 0)} strokeWidth={2.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </>
      }
      overlay={
        <>
          {pts.map(([x, y], i) => (
            <span key={i} className="dia-dot" style={{ left: xp(x) + "%", top: yp(y) + "%", background: col(o.c, 0) }} />
          ))}
          {o.median && med !== null && (
            <span className="dia-val dia-med" style={{ left: xp(med) + "%", bottom: "0%", transform: "translate(0.3rem,-0.3rem)" }}>
              median ≈ {fmtNo(med, Number(o.des ?? 1))}
            </span>
          )}
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Sektordiagram
// ---------------------------------------------------------------------------
function Pie({ spec }: { spec: DiagramSpec }) {
  const o = spec.opts;
  const tot = spec.slices.reduce((a, s) => a + s.value, 0) || 1;
  const vis = o.vis ?? "prosent";
  const dec = Number(o.des ?? 1);
  let a0 = -Math.PI / 2;
  const R = 100;
  const paths: ReactNode[] = [];
  const labels: ReactNode[] = [];
  spec.slices.forEach((s, i) => {
    const frac = s.value / tot;
    const a1 = a0 + frac * 2 * Math.PI;
    const c = col(s.opts.c, i);
    if (frac >= 0.9999) paths.push(<circle key={i} cx={0} cy={0} r={R} fill={c} stroke="var(--plot-bg)" strokeWidth={2} />);
    else if (frac > 0) {
      const large = a1 - a0 > Math.PI ? 1 : 0;
      paths.push(
        <path
          key={i}
          d={`M0,0 L${R * Math.cos(a0)},${R * Math.sin(a0)} A${R},${R} 0 ${large} 1 ${R * Math.cos(a1)},${R * Math.sin(a1)} Z`}
          fill={c}
          stroke="var(--plot-bg)"
          strokeWidth={2}
          strokeLinejoin="round"
        />,
      );
    }
    const mid = (a0 + a1) / 2;
    const inside = frac > 0.07;
    const rr = inside ? R * 0.64 : R * 1.16;
    const t =
      vis === "verdi" ? fmtNo(s.value, dec) : vis === "grader" ? fmtNo(frac * 360, dec) + "°" : vis === "ingen" ? "" : fmtNo(frac * 100, dec) + " %";
    if (t && frac > 0.004)
      labels.push(
        <text key={"t" + i} x={rr * Math.cos(mid)} y={rr * Math.sin(mid)} textAnchor="middle" dominantBaseline="central" className={inside ? "dia-pie-in" : "dia-pie-out"}>
          {t}
        </text>,
      );
    a0 = a1;
  });
  return (
    <figure className="dia" style={{ maxWidth: o.mw ? Number(o.mw) : 600 }} role="img" aria-label={o.tittel ?? "Sektordiagram"}>
      <div className="dia-box">
        {o.tittel && <div className="dia-title" dangerouslySetInnerHTML={txt(o.tittel)} />}
        <div className="dia-pie">
          <svg viewBox="-132 -132 264 264" className="dia-pie-svg" aria-hidden>
            {paths}
            {labels}
          </svg>
          <ul className="dia-pie-legend">
            {spec.slices.map((s, i) => (
              <li key={i}>
                <span className="dia-sw" style={{ background: col(s.opts.c, i) }} />
                <span dangerouslySetInnerHTML={txt(s.label)} />
                {o.legendeverdi && <span className="dia-leg-v">{fmtNo(s.value, dec)}</span>}
              </li>
            ))}
          </ul>
        </div>
        {o.kilde && <div className="dia-src" dangerouslySetInnerHTML={txt("Kilde: " + o.kilde)} />}
      </div>
      {o.cap && <figcaption className="plot-caption" dangerouslySetInnerHTML={txt(o.cap)} />}
    </figure>
  );
}

export function Diagram({ spec }: { spec: DiagramSpec }) {
  switch (spec.type) {
    case "sektor":
      return <Pie spec={spec} />;
    case "linje":
      return <Lines spec={spec} />;
    case "histogram":
    case "kumulativ":
      return <Grouped spec={spec} />;
    default:
      return <Bars spec={spec} />;
  }
}

/** Fri SVG-figur (geometri). Innholdet er skrevet for siden og bruker fargene i temaet. */
export function SvgFigure({ w, h, body, cap, mw }: { w: number; h: number; body: string; cap?: string; mw?: number }) {
  return (
    <figure className="plot-figure" style={{ maxWidth: mw ?? w }}>
      <div className="plot-box geo-box">
        <svg viewBox={`0 0 ${w} ${h}`} className="plot-svg geo-svg" role="img" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
      {cap && <figcaption className="plot-caption" dangerouslySetInnerHTML={txt(cap)} />}
    </figure>
  );
}
