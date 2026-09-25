"use client";

import { useMemo, useState } from "react";
import { makeView, sx, sy } from "@/components/plot/core";
import { IPlot, Readout, Slider, WidgetCard, clamp, tnok } from "./ui";

type P = [number, number];
const dist = (p: P, q: P) => Math.hypot(p[0] - q[0], p[1] - q[1]);
function angle(a: P, b: P, c: P) {
  const u = [a[0] - b[0], a[1] - b[1]],
    w = [c[0] - b[0], c[1] - b[1]];
  const cos = (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1]));
  return (Math.acos(clamp(cos, -1, 1)) * 180) / Math.PI;
}
const area = (a: P, b: P, c: P) => Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;

/** Formlike trekanter: dra i hjørnet C og endre forstørrelsesfaktoren k. */
export function FormlikhetWidget() {
  const [C, setC] = useState<P>([1.2, 2.6]);
  const [k, setK] = useState(1.5);
  const A: P = [0, 0],
    B: P = [3, 0];
  const off = 4;
  const D: P = [off, 0],
    E: P = [off + 3 * k, 0],
    F: P = [off + C[0] * k, C[1] * k];
  const v = useMemo(() => makeView(-0.6, 13, -0.8, 6.2, 560, 300), []);
  const poly = (ps: P[]) => ps.map((p) => `${sx(v, p[0])},${sy(v, p[1])}`).join(" ");
  const sides = [dist(B, C), dist(A, C), dist(A, B)];
  const angs = [angle(C, A, B), angle(A, B, C), angle(B, C, A)];
  const lab = (p: P, q: P, t: string, col: string) => {
    const mx = (p[0] + q[0]) / 2,
      my = (p[1] + q[1]) / 2;
    return (
      <text x={sx(v, mx)} y={sy(v, my) + (p[1] === q[1] ? 18 : -6)} textAnchor="middle" className="plot-num" style={{ fill: col, fontWeight: 600 }}>
        {t}
      </text>
    );
  };
  const n = (x: number) => x.toFixed(2).replace(".", ",");
  return (
    <WidgetCard title="Formlike trekanter" hint="Dra i det blå hjørnet C og endre k. Vinklene er de samme i begge trekantene, og alle sidene blir k ganger så lange.">
      <IPlot
        v={v}
        grid={false}
        handles={[{ id: "C", x: C[0], y: C[1], color: "var(--plot-1)" }]}
        onDrag={(_, x, y) => setC([Math.round(clamp(x, -0.3, 3.4) * 10) / 10, Math.round(clamp(y, 0.8, 3.8) * 10) / 10])}
      >
        <polygon points={poly([A, B, C])} fill="var(--plot-1)" fillOpacity={0.12} stroke="var(--plot-1)" strokeWidth={2.4} strokeLinejoin="round" />
        <polygon points={poly([D, E, F])} fill="var(--plot-2)" fillOpacity={0.12} stroke="var(--plot-2)" strokeWidth={2.4} strokeLinejoin="round" />
        {lab(A, B, `c = ${n(sides[2])}`, "var(--plot-1)")}
        {lab(A, C, `b = ${n(sides[1])}`, "var(--plot-1)")}
        {lab(B, C, `a = ${n(sides[0])}`, "var(--plot-1)")}
        {lab(D, E, n(k * sides[2]), "var(--plot-2)")}
        {lab(D, F, n(k * sides[1]), "var(--plot-2)")}
        {lab(E, F, n(k * sides[0]), "var(--plot-2)")}
        {[
          [A, "A"],
          [B, "B"],
          [D, "D"],
          [E, "E"],
          [F, "F"],
        ].map(([p, t]) => (
          <text key={t as string} x={sx(v, (p as P)[0]) + ((t as string) === "B" || (t as string) === "E" ? 8 : -12)} y={sy(v, (p as P)[1]) + 16} className="plot-num" style={{ fontWeight: 700 }}>
            {t as string}
          </text>
        ))}
      </IPlot>
      <div className="mt-4">
        <Slider label="k" value={k} min={0.3} max={2.6} step={0.05} onChange={setK} format={(x) => x.toFixed(2).replace(".", ",")} />
      </div>
      <Readout
        items={[
          { k: "\\angle A = \\angle D", v: `${tnok(angs[0], 1)}^\\circ` },
          { k: "\\angle B = \\angle E", v: `${tnok(angs[1], 1)}^\\circ` },
          { k: "\\angle C = \\angle F", v: `${tnok(angs[2], 1)}^\\circ` },
          { k: "\\dfrac{DE}{AB} = \\dfrac{DF}{AC} = \\dfrac{EF}{BC}", v: `${tnok(k, 2)}`, color: "var(--plot-2)" },
          { k: "\\dfrac{\\text{areal } DEF}{\\text{areal } ABC}", v: `\\dfrac{${tnok(area(D, E, F), 2)}}{${tnok(area(A, B, C), 2)}} = ${tnok(k * k, 2)} = k^2` },
        ]}
      />
    </WidgetCard>
  );
}
