"use client";

import { useMemo, useState } from "react";
import { fnPath, makeView, sx, sy } from "@/components/plot/core";
import { IPlot, Readout, WidgetCard, clamp, tnok } from "./ui";

type P = [number, number];

/** Stigningstall og konstantledd: dra i punktene A og B og se trappetrinnet Δx og Δy. */
export function StigningWidget() {
  const [A, setA] = useState<P>([1, 1]);
  const [B, setB] = useState<P>([4, 3]);
  const v = useMemo(() => makeView(-6, 6, -5, 5, 560, 400), []);
  const dx = B[0] - A[0],
    dy = B[1] - A[1];
  const vertical = Math.abs(dx) < 1e-9;
  const a = vertical ? NaN : dy / dx;
  const b = vertical ? NaN : A[1] - a * A[0];
  const f = (x: number) => a * x + b;
  const snap = (x: number) => Math.round(x * 2) / 2;
  const frac = (p: number, q: number) => {
    if (q < 0) {
      p = -p;
      q = -q;
    }
    return Number.isInteger(p / q) ? tnok(p / q, 2) : `\\tfrac{${tnok(p, 1)}}{${tnok(q, 1)}}`;
  };
  return (
    <WidgetCard title="Stigningstall og konstantledd" hint="Stigningstallet a forteller hvor mye y endrer seg når x øker med 1. Konstantleddet b er der linja skjærer y-aksen.">
      <IPlot
        v={v}
        handles={[
          { id: "A", x: A[0], y: A[1], color: "var(--plot-1)" },
          { id: "B", x: B[0], y: B[1], color: "var(--plot-2)" },
        ]}
        onDrag={(id, x, y) => {
          const p: P = [snap(clamp(x, -5.5, 5.5)), snap(clamp(y, -4.5, 4.5))];
          if (id === "A") setA(p);
          else setB(p);
        }}
      >
        {!vertical && <path d={fnPath(v, f)} fill="none" stroke="var(--plot-1)" strokeWidth={2.6} />}
        {vertical && <line x1={sx(v, A[0])} x2={sx(v, A[0])} y1={0} y2={v.H} stroke="var(--plot-1)" strokeWidth={2.6} />}
        <path d={`M${sx(v, A[0])},${sy(v, A[1])} L${sx(v, B[0])},${sy(v, A[1])} L${sx(v, B[0])},${sy(v, B[1])}`} fill="none" stroke="var(--plot-4)" strokeWidth={2.2} strokeDasharray="6 4" />
        <text x={(sx(v, A[0]) + sx(v, B[0])) / 2} y={sy(v, A[1]) + (dy >= 0 ? 18 : -8)} textAnchor="middle" className="plot-num" style={{ fill: "var(--plot-4)", fontWeight: 700 }}>
          Δx = {String(dx).replace(".", ",")}
        </text>
        <text x={sx(v, B[0]) + 8} y={(sy(v, A[1]) + sy(v, B[1])) / 2} className="plot-num" style={{ fill: "var(--plot-4)", fontWeight: 700 }}>
          Δy = {String(dy).replace(".", ",")}
        </text>
        {!vertical && <circle cx={sx(v, 0)} cy={sy(v, b)} r={5} fill="var(--plot-3)" />}
      </IPlot>
      <Readout
        items={[
          { k: "A,\\ B", v: `(${tnok(A[0], 1)},\\ ${tnok(A[1], 1)}),\\ (${tnok(B[0], 1)},\\ ${tnok(B[1], 1)})` },
          { k: "a = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{y_2 - y_1}{x_2 - x_1}", v: vertical ? "\\text{loddrett linje – ingen stigningstall}" : `\\dfrac{${tnok(dy, 1)}}{${tnok(dx, 1)}} = ${frac(dy, dx)}`, color: "var(--plot-4)" },
          { k: "b = y_1 - a\\cdot x_1", v: vertical ? "–" : tnok(b, 2), color: "var(--plot-3)" },
          { k: "\\text{Linja}", v: vertical ? `x = ${tnok(A[0], 1)}` : `y = ${tnok(a, 2)}x ${b < 0 ? "-" : "+"} ${tnok(Math.abs(b), 2)}`, color: "var(--plot-1)" },
        ]}
      />
    </WidgetCard>
  );
}
