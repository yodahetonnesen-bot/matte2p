"use client";

import { useMemo, useState } from "react";
import { Dot, fnPath, makeView, sx, sy } from "@/components/plot/core";
import { IPlot, Readout, Slider, WidgetCard, nok, tnok } from "./ui";

const lin = (a: number, b: number) => `${a === 0 ? "" : a === 1 ? "x" : a === -1 ? "-x" : tnok(a, 2) + "x"}${a === 0 ? tnok(b, 2) : b === 0 ? "" : b < 0 ? " - " + tnok(-b, 2) : " + " + tnok(b, 2)}`;

/**
 * Grafisk løsning av likninger og ulikheter med to rette linjer.
 * props: a1,b1,a2,b2, x="0,40", y="0,700", f="Tilbud A", g="Tilbud B", xl, yl
 */
export function GrafiskWidget({ props }: { props: Record<string, string> }) {
  const [a1, setA1] = useState(Number(props.a1 ?? 5));
  const [b1, setB1] = useState(Number(props.b1 ?? 300));
  const [a2, setA2] = useState(Number(props.a2 ?? 15));
  const [b2, setB2] = useState(Number(props.b2 ?? 60));
  const [x0, x1] = (props.x ?? "0,40").split(",").map(Number);
  const [y0, y1] = (props.y ?? "0,700").split(",").map(Number);
  const v = useMemo(() => makeView(x0, x1, y0, y1, 560, 340), [x0, x1, y0, y1]);
  const f = (x: number) => a1 * x + b1;
  const g = (x: number) => a2 * x + b2;
  const par = Math.abs(a1 - a2) < 1e-9;
  const xs = par ? NaN : (b2 - b1) / (a1 - a2);
  const ys = f(xs);
  const nf = props.f ?? "f",
    ng = props.g ?? "g";
  const aRange = Math.max(Math.abs(a1), Math.abs(a2), 1) * 2.5;
  const bRange = Math.max(Math.abs(b1), Math.abs(b2), 5) * 2;
  // f(x) < g(x) når (a1 - a2)x < b2 - b1
  const lessText = par
    ? b1 < b2
      ? "\\text{for alle } x"
      : "\\text{aldri}"
    : a1 - a2 > 0
      ? `x < ${tnok(xs, 2)}`
      : `x > ${tnok(xs, 2)}`;
  const shadeLeft = !par && a1 - a2 > 0;

  return (
    <WidgetCard title={props.title ?? "Grafisk løsning: skjæringspunktet mellom to linjer"} hint="Løsningen av likningen f(x) = g(x) er x-koordinaten til skjæringspunktet. Der den blå linja ligger under den røde, er f(x) < g(x).">
      <IPlot v={v} xLabel={props.xl ?? "x"} yLabel={props.yl ?? "y"}>
        {!par && Number.isFinite(xs) && xs > v.xmin && xs < v.xmax && (
          <rect
            x={shadeLeft ? 0 : sx(v, xs)}
            width={shadeLeft ? sx(v, xs) : v.W - sx(v, xs)}
            y={sy(v, Math.min(v.ymax, Math.max(0, v.ymin))) - 7}
            height={7}
            fill="var(--plot-1)"
            opacity={0.35}
          />
        )}
        <path d={fnPath(v, f)} fill="none" stroke="var(--plot-1)" strokeWidth={2.8} />
        <path d={fnPath(v, g)} fill="none" stroke="var(--plot-2)" strokeWidth={2.8} />
        {!par && Number.isFinite(xs) && (
          <>
            <line x1={sx(v, xs)} x2={sx(v, xs)} y1={sy(v, ys)} y2={sy(v, Math.max(0, v.ymin))} stroke="var(--plot-muted)" strokeDasharray="5 5" strokeWidth={1.6} />
            <line x1={sx(v, Math.max(0, v.xmin))} x2={sx(v, xs)} y1={sy(v, ys)} y2={sy(v, ys)} stroke="var(--plot-muted)" strokeDasharray="5 5" strokeWidth={1.6} />
            <Dot v={v} x={xs} y={ys} fill="var(--plot-ink)" />
          </>
        )}
      </IPlot>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium">
        <span style={{ color: "var(--plot-1)" }}>━ {nf}(x) = {nok(a1, 2)}x + {nok(b1, 2)}</span>
        <span style={{ color: "var(--plot-2)" }}>━ {ng}(x) = {nok(a2, 2)}x + {nok(b2, 2)}</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Slider label="a_1" value={a1} min={-aRange} max={aRange} step={aRange > 10 ? 0.5 : 0.1} onChange={setA1} format={(x) => nok(x, 1)} />
        <Slider label="a_2" value={a2} min={-aRange} max={aRange} step={aRange > 10 ? 0.5 : 0.1} onChange={setA2} format={(x) => nok(x, 1)} />
        <Slider label="b_1" value={b1} min={-bRange} max={bRange} step={bRange > 50 ? 5 : 0.5} onChange={setB1} format={(x) => nok(x, 1)} />
        <Slider label="b_2" value={b2} min={-bRange} max={bRange} step={bRange > 50 ? 5 : 0.5} onChange={setB2} format={(x) => nok(x, 1)} />
      </div>
      <Readout
        items={[
          { k: "\\text{Likningen}", v: `${lin(a1, b1)} = ${lin(a2, b2)}` },
          {
            k: "\\text{Skjæringspunkt}",
            v: par ? (Math.abs(b1 - b2) < 1e-9 ? "\\text{linjene er like – uendelig mange løsninger}" : "\\text{parallelle linjer – ingen løsning}") : `(${tnok(xs, 2)},\\ ${tnok(ys, 2)})`,
            color: "var(--plot-ink)",
          },
          { k: `${nf}(x) < ${ng}(x)`, v: lessText, color: "var(--plot-1)" },
        ]}
      />
    </WidgetCard>
  );
}
