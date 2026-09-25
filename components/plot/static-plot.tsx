import type { ReactNode } from "react";
import type { PlotSpec } from "@/lib/markup";
import { tryFn1 } from "@/lib/expr";
import { Arrow, Dot, Grid, PlotFrame, color, fnPath, makeView, paramPath, sx, sy, type Label } from "./core";

/** Tegner en graf beskrevet av en ::plot-blokk. Ingen hooks – fungerer på serveren. */
export function StaticPlot({ spec }: { spec: PlotSpec }) {
  const o = spec.opts;
  const W = o.w ? Number(o.w) : 560;
  // eq: lik skala på aksene (geometri), ellers en høyde som passer utsnittet
  const H = o.h ? Number(o.h) : "eq" in o ? Math.round((W * (spec.ymax - spec.ymin)) / (spec.xmax - spec.xmin)) : undefined;
  const v = makeView(spec.xmin, spec.xmax, spec.ymin, spec.ymax, W, H);
  const els: ReactNode[] = [];
  const labels: Label[] = [];
  let ci = 0;

  spec.items.forEach((it, idx) => {
    const c = color(it.opts.c, it.k === "f" || it.k === "c" ? ci++ : 0);
    const dash = "dash" in it.opts ? "7 6" : undefined;
    const width = it.opts.lw ? Number(it.opts.lw) : 2.6;
    switch (it.k) {
      case "f": {
        const f = tryFn1(it.expr, "x");
        if (!f) break;
        const dom = it.opts.dom?.split(",").map(Number);
        // brk=x1,x2,… : loddrette asymptoter der grafen skal brytes
        const a0 = Math.max(dom?.[0] ?? v.xmin, v.xmin);
        const b0 = Math.min(dom?.[1] ?? v.xmax, v.xmax);
        const eps = (v.xmax - v.xmin) * 1e-4;
        const cuts = (it.opts.brk ?? "")
          .split(",")
          .filter(Boolean)
          .map(Number)
          .filter((x) => x > a0 && x < b0)
          .sort((p, q) => p - q);
        const ends = [a0, ...cuts, b0];
        let d = "";
        for (let i = 0; i + 1 < ends.length; i++)
          d += fnPath(v, f, { a: ends[i] + (i > 0 ? eps : 0), b: ends[i + 1] - (i + 1 < ends.length - 1 ? eps : 0) });
        els.push(<path key={idx} d={d} fill="none" stroke={c} strokeWidth={width} strokeDasharray={dash} strokeLinejoin="round" strokeLinecap="round" />);
        if (it.opts.label) {
          const lx = it.opts.at ? Number(it.opts.at) : (dom ? Math.min(dom[1], v.xmax) : v.xmax) - (v.xmax - v.xmin) * 0.1;
          const ly = f(lx);
          if (Number.isFinite(ly)) labels.push({ x: lx, y: Math.min(Math.max(ly, v.ymin), v.ymax), text: it.opts.label, math: true, pos: it.opts.pos ?? "nw", color: c });
        }
        break;
      }
      case "c": {
        const fx = tryFn1(it.xe, "t");
        const fy = tryFn1(it.ye, "t");
        if (!fx || !fy) break;
        els.push(
          <path
            key={idx}
            d={paramPath(v, fx, fy, it.t0, it.t1) + ("fill" in it.opts ? "Z" : "")}
            fill={"fill" in it.opts ? c : "none"}
            fillOpacity={"fill" in it.opts ? 0.14 : undefined}
            stroke={c}
            strokeWidth={width}
            strokeDasharray={dash}
            strokeLinejoin="round"
          />,
        );
        if (it.opts.label) {
          const t = it.opts.at ? Number(it.opts.at) : it.t0 + (it.t1 - it.t0) * 0.8;
          labels.push({ x: fx(t), y: fy(t), text: it.opts.label, math: true, pos: it.opts.pos ?? "nw", color: c });
        }
        break;
      }
      case "area": {
        const f = tryFn1(it.f, "x");
        const g = tryFn1(it.g, "x");
        if (!f || !g) break;
        const n = 120;
        const top: string[] = [];
        const bot: string[] = [];
        for (let i = 0; i <= n; i++) {
          const x = it.a + ((it.b - it.a) * i) / n;
          top.push(`${sx(v, x).toFixed(2)},${sy(v, f(x)).toFixed(2)}`);
          bot.unshift(`${sx(v, x).toFixed(2)},${sy(v, g(x)).toFixed(2)}`);
        }
        els.unshift(<polygon key={idx} points={[...top, ...bot].join(" ")} fill={color(it.opts.c, 0)} opacity={0.16} />);
        break;
      }
      case "p": {
        const pc = color(it.opts.c ?? "ink");
        els.push(<Dot key={idx} v={v} x={it.x} y={it.y} fill={pc} open={"open" in it.opts} />);
        if (it.opts.label) labels.push({ x: it.x, y: it.y, text: it.opts.label, math: !("text" in it.opts), pos: it.opts.pos ?? "ne", color: pc });
        if ("proj" in it.opts) {
          els.unshift(
            <g key={idx + "pr"} stroke="var(--plot-muted)" strokeDasharray="4 4" strokeWidth={1.3}>
              <line x1={sx(v, it.x)} y1={sy(v, it.y)} x2={sx(v, it.x)} y2={sy(v, Math.min(Math.max(0, v.ymin), v.ymax))} />
              <line x1={sx(v, it.x)} y1={sy(v, it.y)} x2={sx(v, Math.min(Math.max(0, v.xmin), v.xmax))} y2={sy(v, it.y)} />
            </g>,
          );
        }
        break;
      }
      case "v": {
        const vc = color(it.opts.c, idx);
        els.push(<Arrow key={idx} v={v} x1={it.x1} y1={it.y1} x2={it.x2} y2={it.y2} stroke={vc} dash={!!dash} />);
        if (it.opts.label) {
          const t = it.opts.t ? Number(it.opts.t) : 0.5;
          labels.push({
            x: it.x1 + (it.x2 - it.x1) * t,
            y: it.y1 + (it.y2 - it.y1) * t,
            text: it.opts.label,
            math: true,
            pos: it.opts.pos ?? "nw",
            color: vc,
          });
        }
        break;
      }
      case "s": {
        const scol = color(it.opts.c ?? "ink");
        els.push(
          <line key={idx} x1={sx(v, it.x1)} y1={sy(v, it.y1)} x2={sx(v, it.x2)} y2={sy(v, it.y2)} stroke={scol} strokeWidth={it.opts.lw ? Number(it.opts.lw) : 2} strokeDasharray={dash} strokeLinecap="round" />,
        );
        if (it.opts.label)
          labels.push({ x: (it.x1 + it.x2) / 2, y: (it.y1 + it.y2) / 2, text: it.opts.label, math: true, pos: it.opts.pos ?? "n", color: scol });
        break;
      }
      case "poly": {
        const pcol = color(it.opts.c ?? "ink");
        const pts = it.pts.map(([x, y]) => `${sx(v, x)},${sy(v, y)}`).join(" ");
        els.push(
          <polygon
            key={idx}
            points={pts}
            fill={"fill" in it.opts ? pcol : "none"}
            fillOpacity={"fill" in it.opts ? 0.14 : 0}
            stroke={pcol}
            strokeWidth={2}
            strokeDasharray={dash}
            strokeLinejoin="round"
          />,
        );
        break;
      }
      case "vx":
      case "hy": {
        const lc = color(it.opts.c ?? "muted");
        const d = dash ?? "7 6";
        if (it.k === "vx")
          els.push(<line key={idx} x1={sx(v, it.at)} x2={sx(v, it.at)} y1={0} y2={v.H} stroke={lc} strokeWidth={1.8} strokeDasharray={"solid" in it.opts ? undefined : d} />);
        else els.push(<line key={idx} y1={sy(v, it.at)} y2={sy(v, it.at)} x1={0} x2={v.W} stroke={lc} strokeWidth={1.8} strokeDasharray={"solid" in it.opts ? undefined : d} />);
        if (it.opts.label) {
          if (it.k === "vx") labels.push({ x: it.at, y: v.ymax - (v.ymax - v.ymin) * 0.06, text: it.opts.label, math: true, pos: "e", color: lc });
          else labels.push({ x: v.xmax - (v.xmax - v.xmin) * 0.04, y: it.at, text: it.opts.label, math: true, pos: "nw", color: lc });
        }
        break;
      }
      case "vf": {
        // vektorfelt: pil i hvert gitterpunkt, skalert med k (eller normert med «norm»)
        const step = it.opts.step ? Number(it.opts.step) : 1;
        const k = it.opts.k ? Number(it.opts.k) : 0.1;
        const vcol = color(it.opts.c ?? "1");
        for (let gy = Math.ceil(v.ymin / step) * step; gy <= v.ymax + 1e-9; gy += step) {
          const fx = tryFn1(it.xe, "x", { y: gy });
          const fy = tryFn1(it.ye, "x", { y: gy });
          if (!fx || !fy) break;
          for (let gx = Math.ceil(v.xmin / step) * step; gx <= v.xmax + 1e-9; gx += step) {
            let dx = fx(gx);
            let dy = fy(gx);
            if (!Number.isFinite(dx) || !Number.isFinite(dy)) continue;
            if ("norm" in it.opts) {
              const r = Math.hypot(dx, dy);
              if (r < 1e-9) continue;
              dx /= r;
              dy /= r;
            }
            els.push(<Arrow key={`${idx}-${gx}-${gy}`} v={v} x1={gx} y1={gy} x2={gx + k * dx} y2={gy + k * dy} stroke={vcol} width={1.5} head={7} />);
          }
        }
        break;
      }
      case "txt":
        labels.push({ x: it.x, y: it.y, text: it.text, pos: it.opts.pos ?? "c", color: it.opts.c ? color(it.opts.c) : undefined, small: "sm" in it.opts });
        break;
      case "pl": {
        // brutt linje (ikke lukket), f.eks. linjediagram eller kumulativ frekvens
        const lc = color(it.opts.c, idx);
        const pts = it.pts.filter((q) => q.length === 2 && q.every(Number.isFinite));
        els.push(
          <polyline
            key={idx}
            points={pts.map(([x, y]) => `${sx(v, x).toFixed(2)},${sy(v, y).toFixed(2)}`).join(" ")}
            fill="none"
            stroke={lc}
            strokeWidth={width}
            strokeDasharray={dash}
            strokeLinejoin="round"
            strokeLinecap="round"
          />,
        );
        if ("dots" in it.opts) pts.forEach(([x, y], j) => els.push(<Dot key={idx + "d" + j} v={v} x={x} y={y} fill={lc} r={3.6} />));
        break;
      }
      case "ang":
      case "rett": {
        // vinkelbue (ang) eller rett-vinkel-firkant (rett) i hjørnet b, mellom retningene b→a og b→c
        const ac = color(it.opts.c ?? "ink");
        const [bx, by] = [sx(v, it.b[0]), sy(v, it.b[1])];
        const dir = (p: [number, number]) => {
          const dx = sx(v, p[0]) - bx,
            dy = sy(v, p[1]) - by;
          const L = Math.hypot(dx, dy) || 1;
          return [dx / L, dy / L];
        };
        const [ux, uy] = dir(it.a);
        const [wx, wy] = dir(it.c);
        const r = it.opts.r ? Number(it.opts.r) : it.k === "rett" ? 13 : 26;
        if (it.k === "rett") {
          els.push(
            <path
              key={idx}
              d={`M${bx + ux * r},${by + uy * r} L${bx + (ux + wx) * r},${by + (uy + wy) * r} L${bx + wx * r},${by + wy * r}`}
              fill="none"
              stroke={ac}
              strokeWidth={1.6}
            />,
          );
          break;
        }
        const a1 = Math.atan2(uy, ux),
          a2 = Math.atan2(wy, wx);
        let d = a2 - a1;
        while (d <= -Math.PI) d += 2 * Math.PI;
        while (d > Math.PI) d -= 2 * Math.PI;
        const n = it.opts.n ? Number(it.opts.n) : 1;
        const arc = (rr: number) =>
          `M${bx + Math.cos(a1) * rr},${by + Math.sin(a1) * rr} A${rr},${rr} 0 0 ${d > 0 ? 1 : 0} ${bx + Math.cos(a1 + d) * rr},${by + Math.sin(a1 + d) * rr}`;
        const arcs = [];
        for (let k = 0; k < Math.min(n, 3); k++) arcs.push(<path key={k} d={arc(r + k * 4.5)} fill="none" stroke={ac} strokeWidth={1.6} />);
        if ("fill" in it.opts)
          arcs.unshift(<path key="f" d={`${arc(r)} L${bx},${by} Z`} fill={ac} fillOpacity={0.14} stroke="none" />);
        els.push(<g key={idx}>{arcs}</g>);
        if (it.opts.label) {
          const mid = a1 + d / 2;
          const rr = r + 16 + (n - 1) * 4.5 + (it.opts.lr ? Number(it.opts.lr) : 0);
          const px = bx + Math.cos(mid) * rr,
            py = by + Math.sin(mid) * rr;
          labels.push({ x: v.xmin + (px / v.W) * (v.xmax - v.xmin), y: v.ymin + ((v.H - py) / v.H) * (v.ymax - v.ymin), text: it.opts.label, math: true, pos: "c", color: ac, small: true });
        }
        break;
      }
    }
  });

  const noGrid = "nogrid" in o;
  return (
    <PlotFrame v={v} labels={labels} maxWidth={o.mw ? Number(o.mw) : W} caption={o.cap?.replace(/_/g, " ")}>
      {!noGrid && (
        <Grid
          v={v}
          xstep={o.xs ? Number(o.xs) : undefined}
          ystep={o.ys ? Number(o.ys) : undefined}
          xLabel={(o.xl ?? "x").replace(/_/g, " ")}
          yLabel={(o.yl ?? "y").replace(/_/g, " ")}
          axes={!("noaxes" in o)}
          showNumbers={!("nonum" in o)}
        />
      )}
      <g>{els}</g>
    </PlotFrame>
  );
}
