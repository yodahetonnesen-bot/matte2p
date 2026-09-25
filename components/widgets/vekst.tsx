"use client";

import { useMemo, useState } from "react";
import { Dot, fnPath, makeView, sx, sy } from "@/components/plot/core";
import { IPlot, Readout, Slider, WidgetCard, nok, tnok } from "./ui";

/**
 * Lineær og eksponentiell vekst side om side.
 * props: a (start), d (fast økning per periode), p (prosent per periode), n (antall perioder), enhet
 */
export function VekstWidget({ props }: { props: Record<string, string> }) {
  const [a, setA] = useState(Number(props.a ?? 1000));
  const [d, setD] = useState(Number(props.d ?? 100));
  const [p, setP] = useState(Number(props.p ?? 5));
  const [n, setN] = useState(Number(props.n ?? 30));
  const [x0, setX0] = useState(5);
  const k = 1 + p / 100;
  const L = (x: number) => a + d * x;
  const E = (x: number) => a * Math.pow(k, x);
  const ymax = Math.max(L(n), E(n), a) * 1.08;
  const ymin = Math.min(0, L(n), E(n));
  const v = useMemo(() => makeView(0, n, ymin, ymax, 560, 340), [n, ymin, ymax]);

  // når blir den eksponentielle modellen større enn den lineære (første fortegnsskifte etter start)?
  let cross: number | null = null;
  for (let i = 1; i <= 400 * n; i++) {
    const x = i / 400;
    if (E(x) - L(x) > 0 !== E(x - 1 / 400) - L(x - 1 / 400) > 0 && x > 0.01) {
      cross = x;
      break;
    }
  }
  const rows = Array.from({ length: 6 }, (_, i) => i);

  return (
    <WidgetCard title="Lineær eller eksponentiell vekst?" hint="Lineær vekst legger til det samme tallet hver periode. Eksponentiell vekst ganger med den samme vekstfaktoren hver periode.">
      <IPlot v={v} xLabel="x" yLabel="y">
        <path d={fnPath(v, L)} fill="none" stroke="var(--plot-1)" strokeWidth={2.8} />
        <path d={fnPath(v, E)} fill="none" stroke="var(--plot-2)" strokeWidth={2.8} />
        {cross !== null && cross <= n && (
          <line x1={sx(v, cross)} x2={sx(v, cross)} y1={sy(v, 0)} y2={sy(v, E(cross))} stroke="var(--plot-muted)" strokeDasharray="5 5" strokeWidth={1.6} />
        )}
        <Dot v={v} x={x0} y={L(x0)} fill="var(--plot-1)" />
        <Dot v={v} x={x0} y={E(x0)} fill="var(--plot-2)" />
      </IPlot>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs">
        <span className="font-medium" style={{ color: "var(--plot-1)" }}>
          ━ Lineær: {nok(a, 0)} + {nok(d, 1)}x
        </span>
        <span className="font-medium" style={{ color: "var(--plot-2)" }}>
          ━ Eksponentiell: {nok(a, 0)} · {nok(k, 4)}ˣ
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <Slider label="a" value={a} min={10} max={5000} step={10} onChange={setA} format={(x) => nok(x, 0)} />
        <Slider label="d" value={d} min={-200} max={1000} step={5} onChange={setD} format={(x) => nok(x, 0)} />
        <Slider label="p\,\%" value={p} min={-30} max={40} step={0.5} onChange={setP} format={(x) => nok(x, 1) + " %"} />
        <Slider label="n" value={n} min={5} max={100} step={1} onChange={(x) => { setN(x); setX0(Math.min(x0, x)); }} format={(x) => nok(x, 0)} />
        <Slider label="x" value={x0} min={0} max={n} step={1} onChange={setX0} format={(x) => nok(x, 0)} />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="md-table w-full text-sm">
          <tbody>
            <tr className="md-thead">
              <th>Periode x</th>
              {rows.map((i) => (
                <th key={i}>{i}</th>
              ))}
            </tr>
            <tr>
              <th style={{ color: "var(--plot-1)" }}>Lineær (+{nok(d, 1)})</th>
              {rows.map((i) => (
                <td key={i}>{nok(L(i), 1)}</td>
              ))}
            </tr>
            <tr>
              <th style={{ color: "var(--plot-2)" }}>Eksponentiell (·{nok(k, 4)})</th>
              {rows.map((i) => (
                <td key={i}>{nok(E(i), 1)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <Readout
        items={[
          { k: "L(x) = a + d\\cdot x", v: `L(${x0}) = ${tnok(a, 0)} + ${tnok(d, 1)}\\cdot ${x0} = ${tnok(L(x0), 1)}`, color: "var(--plot-1)" },
          { k: "E(x) = a\\cdot k^x,\\ k = 1 + \\tfrac{p}{100}", v: `E(${x0}) = ${tnok(a, 0)}\\cdot ${tnok(k, 4)}^{${x0}} \\approx ${tnok(E(x0), 1)}`, color: "var(--plot-2)" },
          {
            k: "\\text{Skifter hvem som er størst}",
            v: cross !== null ? `x \\approx ${tnok(cross, 1)}` : "\\text{ikke i dette utsnittet}",
          },
        ]}
      />
    </WidgetCard>
  );
}
