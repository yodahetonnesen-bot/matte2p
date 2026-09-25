"use client";

import { useState } from "react";
import { Readout, Slider, WidgetCard, tnok } from "./ui";

/** Pytagorassetningen: kvadratene på katetene har til sammen samme areal som kvadratet på hypotenusen. */
export function PytagorasWidget({ props }: { props: Record<string, string> }) {
  const [a, setA] = useState(Number(props.a ?? 3));
  const [b, setB] = useState(Number(props.b ?? 4));
  const c = Math.hypot(a, b);
  // tegning: rett vinkel i origo, katet a langs y-aksen, katet b langs x-aksen
  const S = 26 / Math.max(1, (a + b + c) / 9);
  const P = (x: number, y: number) => `${(x * S).toFixed(2)},${(-y * S).toFixed(2)}`;
  const tri = [P(0, 0), P(b, 0), P(0, a)].join(" ");
  const sqA = [P(0, 0), P(0, a), P(-a, a), P(-a, 0)].join(" ");
  const sqB = [P(0, 0), P(b, 0), P(b, -b), P(0, -b)].join(" ");
  // kvadratet på hypotenusen: fra (b,0) til (0,a), bygget utover
  const q = 12 / S; // rett-vinkel-merket er 12 px uansett skala
  const nx = a / c,
    ny = b / c; // normal utover
  const H1 = [b, 0],
    H2 = [0, a];
  const sqC = [P(H1[0], H1[1]), P(H2[0], H2[1]), P(H2[0] + nx * c, H2[1] + ny * c), P(H1[0] + nx * c, H1[1] + ny * c)].join(" ");
  const cxm = (b + nx * c) / 2 + 0,
    cym = (a + ny * c) / 2;
  const minX = -a - 0.5,
    maxX = Math.max(b, b + nx * c) + 0.5,
    minY = -b - 0.5,
    maxY = Math.max(a, a + ny * c) + 0.5;
  const vb = `${(minX * S).toFixed(1)} ${(-maxY * S).toFixed(1)} ${((maxX - minX) * S).toFixed(1)} ${((maxY - minY) * S).toFixed(1)}`;
  const n = (x: number) => x.toFixed(x % 1 ? 2 : 0).replace(".", ",");
  return (
    <WidgetCard title="Pytagorassetningen" hint="Endre katetene a og b. Arealet av det store kvadratet er alltid summen av de to små: a² + b² = c².">
      <div className="plot-box">
        <svg viewBox={vb} className="plot-svg mx-auto" style={{ maxHeight: 380 }} role="img" aria-label="Rettvinklet trekant med kvadrater på sidene">
          <polygon points={sqA} fill="var(--plot-1)" fillOpacity={0.18} stroke="var(--plot-1)" strokeWidth={2} />
          <polygon points={sqB} fill="var(--plot-3)" fillOpacity={0.2} stroke="var(--plot-3)" strokeWidth={2} />
          <polygon points={sqC} fill="var(--plot-2)" fillOpacity={0.15} stroke="var(--plot-2)" strokeWidth={2} />
          <polygon points={tri} fill="var(--plot-bg)" stroke="var(--plot-ink)" strokeWidth={2.4} strokeLinejoin="round" />
          <path d={`M${P(q, 0)} L${P(q, q)} L${P(0, q)}`} fill="none" stroke="var(--plot-ink)" strokeWidth={1.5} />
          <text x={-a * S * 0.5} y={-a * S * 0.5 + 5} textAnchor="middle" className="plot-num" style={{ fill: "var(--plot-1)", fontWeight: 700, fontSize: 14 }}>
            a² = {n(a * a)}
          </text>
          <text x={b * S * 0.5} y={b * S * 0.5 + 5} textAnchor="middle" className="plot-num" style={{ fill: "var(--plot-3)", fontWeight: 700, fontSize: 14 }}>
            b² = {n(b * b)}
          </text>
          <text x={cxm * S} y={-cym * S + 5} textAnchor="middle" className="plot-num" style={{ fill: "var(--plot-2)", fontWeight: 700, fontSize: 14 }}>
            c² = {n(c * c)}
          </text>
        </svg>
      </div>
      <div className="mt-4 space-y-2">
        <Slider label="a" value={a} min={1} max={10} step={0.5} onChange={setA} format={(x) => n(x)} />
        <Slider label="b" value={b} min={1} max={10} step={0.5} onChange={setB} format={(x) => n(x)} />
      </div>
      <Readout
        items={[
          { k: "a^2 + b^2", v: `${tnok(a, 1)}^2 + ${tnok(b, 1)}^2 = ${tnok(a * a + b * b, 2)}`, color: "var(--plot-1)" },
          { k: "c^2 = a^2 + b^2", v: `c = \\sqrt{${tnok(a * a + b * b, 2)}} \\approx ${tnok(c, 3)}`, color: "var(--plot-2)" },
          { k: "\\text{Heltallig trippel?}", v: Number.isInteger(a) && Number.isInteger(b) && Math.abs(c - Math.round(c)) < 1e-9 ? `\\text{Ja: } ${a},\\ ${b},\\ ${Math.round(c)}` : "\\text{Nei}" },
        ]}
      />
    </WidgetCard>
  );
}
