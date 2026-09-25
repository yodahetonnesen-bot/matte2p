"use client";

import { useState } from "react";
import { Diagram } from "@/components/plot/diagram";
import type { DiagramSpec } from "@/lib/markup";
import { Chips, WidgetCard, nok } from "./ui";

/**
 * Sektordiagram for hånd: andel · 360° gir vinkelen til hver sektor.
 * props: data="Buss:90;Sykkel:80;Moped/ATV:30;Annet:40"
 */
export function SektorWidget({ props }: { props: Record<string, string> }) {
  const init = (props.data ?? "Buss:90;Bil:60;Sykkel:30;Gange:60").split(";").map((p) => {
    const [l, v] = p.split(":");
    return { label: l.trim(), value: Number(v) };
  });
  const [rows, setRows] = useState(init);
  const [vis, setVis] = useState<"grader" | "prosent">("grader");
  const tot = rows.reduce((a, r) => a + r.value, 0);
  const spec: DiagramSpec = {
    type: "sektor",
    opts: { vis, des: vis === "grader" ? "0" : "1" },
    cats: [],
    xs: null,
    series: [],
    slices: rows.map((r) => ({ label: r.label, value: r.value, opts: {} })),
    bounds: [],
    freq: [],
  };
  return (
    <WidgetCard title="Sektordiagram: fra antall til grader" hint="Hele sirkelen er 360°. En sektor skal ha vinkelen (antall / total) · 360°. Endre tallene og se diagrammet.">
      <Chips
        value={vis}
        onChange={setVis}
        options={[
          { v: "grader", label: "Vis grader" },
          { v: "prosent", label: "Vis prosent" },
        ]}
      />
      <div className="mt-3">
        <Diagram spec={spec} />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="md-table w-full text-sm">
          <tbody>
            <tr className="md-thead">
              <th>Kategori</th>
              <th>Antall</th>
              <th>Andel</th>
              <th>Vinkel</th>
            </tr>
            {rows.map((r, i) => (
              <tr key={i}>
                <th>{r.label}</th>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={r.value}
                    onChange={(e) => setRows(rows.map((q, j) => (j === i ? { ...q, value: Math.max(0, Number(e.target.value) || 0) } : q)))}
                    className="h-8 w-20 rounded-md border border-border bg-background px-2 text-right font-mono tabular-nums"
                  />
                </td>
                <td>
                  {r.value}/{tot} = {nok(tot ? (r.value / tot) * 100 : 0, 1)} %
                </td>
                <td>{nok(tot ? (r.value / tot) * 360 : 0, 1)}°</td>
              </tr>
            ))}
            <tr>
              <th>Sum</th>
              <td>{tot}</td>
              <td>100 %</td>
              <td>360°</td>
            </tr>
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}
