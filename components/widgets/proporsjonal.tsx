"use client";

import { useMemo, useState } from "react";
import { Dot, fnPath, makeView, sx, sy } from "@/components/plot/core";
import { Chips, IPlot, Readout, Slider, WidgetCard, clamp, nok, tnok } from "./ui";

type Mode = "prop" | "omvendt";

/**
 * Proporsjonale (y = k·x) og omvendt proporsjonale (y = k/x) størrelser.
 * props: mode="prop"|"omvendt", k="2"
 */
export function ProporsjonalWidget({ props }: { props: Record<string, string> }) {
  const [mode, setMode] = useState<Mode>(props.mode === "omvendt" ? "omvendt" : "prop");
  const [kp, setKp] = useState(props.mode !== "omvendt" && props.k ? Number(props.k) : 2);
  const [ko, setKo] = useState(props.mode === "omvendt" && props.k ? Number(props.k) : 24);
  const [x0, setX0] = useState(3);
  const k = mode === "prop" ? kp : ko;
  const f = (x: number) => (mode === "prop" ? k * x : k / x);
  const ymax = mode === "prop" ? Math.max(4, k * 10 * 1.05) : Math.max(4, k * 1.1);
  const v = useMemo(() => makeView(0, 10, 0, ymax, 560, 330), [ymax]);
  const xs = [1, 2, 3, 4, 5, 6, 8];

  return (
    <WidgetCard
      title="Proporsjonale og omvendt proporsjonale størrelser"
      hint={mode === "prop" ? "Dra i punktet. Forholdet y/x er alltid det samme – det er proporsjonalitetskonstanten k." : "Dra i punktet. Produktet x·y er alltid det samme – derfor blir y halvparten så stor når x dobles."}
    >
      <Chips
        value={mode}
        onChange={(m) => setMode(m)}
        options={[
          { v: "prop", label: "Proporsjonal: y = k·x" },
          { v: "omvendt", label: "Omvendt proporsjonal: y = k/x" },
        ]}
      />
      <div className="mt-3">
        <IPlot
          v={v}
          handles={[{ id: "p", x: x0, y: clamp(f(x0), 0, ymax), color: "var(--plot-2)" }]}
          onDrag={(_, x) => setX0(Math.round(clamp(x, 0.5, 10) * 10) / 10)}
        >
          <path d={fnPath(v, f, { a: mode === "prop" ? 0 : 0.05 })} fill="none" stroke="var(--plot-1)" strokeWidth={2.8} />
          {mode === "prop" ? (
            <path d={`M${sx(v, 0)},${sy(v, 0)} L${sx(v, x0)},${sy(v, 0)} L${sx(v, x0)},${sy(v, f(x0))}`} fill="none" stroke="var(--plot-muted)" strokeDasharray="5 5" strokeWidth={1.6} />
          ) : (
            <rect x={sx(v, 0)} y={sy(v, f(x0))} width={sx(v, x0) - sx(v, 0)} height={sy(v, 0) - sy(v, f(x0))} fill="var(--plot-2)" opacity={0.14} />
          )}
          <Dot v={v} x={x0} y={f(x0)} fill="var(--plot-2)" />
        </IPlot>
      </div>
      <div className="mt-4 space-y-2">
        {mode === "prop" ? (
          <Slider label="k" value={kp} min={0.1} max={10} step={0.1} onChange={setKp} format={(x) => nok(x, 1)} />
        ) : (
          <Slider label="k" value={ko} min={1} max={60} step={1} onChange={setKo} format={(x) => nok(x, 0)} />
        )}
        <Slider label="x" value={x0} min={0.5} max={10} step={0.1} onChange={setX0} format={(x) => nok(x, 1)} />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="md-table w-full text-sm">
          <tbody>
            <tr className="md-thead">
              <th>x</th>
              {xs.map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
            <tr>
              <th>y</th>
              {xs.map((x) => (
                <td key={x}>{nok(f(x), 2)}</td>
              ))}
            </tr>
            <tr>
              <th>{mode === "prop" ? "y/x" : "x·y"}</th>
              {xs.map((x) => (
                <td key={x} style={{ color: "var(--plot-2)" }}>
                  {nok(mode === "prop" ? f(x) / x : f(x) * x, 2)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <Readout
        items={
          mode === "prop"
            ? [
                { k: "\\text{Punktet}", v: `(${tnok(x0, 1)},\\ ${tnok(f(x0), 2)})`, color: "var(--plot-2)" },
                { k: "\\dfrac{y}{x} = k", v: `\\dfrac{${tnok(f(x0), 2)}}{${tnok(x0, 1)}} = ${tnok(k, 2)}` },
                { k: "\\text{Dobbelt så stor } x", v: "\\Rightarrow\\ \\text{dobbelt så stor } y" },
              ]
            : [
                { k: "\\text{Punktet}", v: `(${tnok(x0, 1)},\\ ${tnok(f(x0), 2)})`, color: "var(--plot-2)" },
                { k: "x\\cdot y = k", v: `${tnok(x0, 1)}\\cdot ${tnok(f(x0), 2)} = ${tnok(k, 2)}` },
                { k: "\\text{Dobbelt så stor } x", v: "\\Rightarrow\\ \\text{halvparten så stor } y" },
              ]
        }
      />
    </WidgetCard>
  );
}
