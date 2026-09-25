"use client";

import { useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Diagram } from "@/components/plot/diagram";
import type { DiagramSpec } from "@/lib/markup";
import { Chips, Readout, WidgetCard, nok, tnok } from "./ui";

type View = "hist" | "soyle" | "kum";

/**
 * Histogram og kumulativ frekvens for et gruppert materiale. Endre frekvensene og se
 * søylehøyder, gjennomsnitt (midtpunkt · frekvens) og median (fra den kumulative kurven).
 * props: grenser="150,160,165,…", frekvens="28,18,…", xl="Høyde (cm)"
 */
export function HistogramWidget({ props }: { props: Record<string, string> }) {
  const bounds = (props.grenser ?? "150,160,165,170,175,180,185,190,200").split(",").map(Number);
  const init = (props.frekvens ?? "28,18,43,35,48,23,15,8").split(",").map(Number);
  const [f, setF] = useState<number[]>(init);
  const [view, setView] = useState<View>("hist");
  const N = f.reduce((a, b) => a + b, 0);
  const mids = f.map((_, i) => (bounds[i] + bounds[i + 1]) / 2);
  const mean = N ? f.reduce((a, fi, i) => a + fi * mids[i], 0) / N : NaN;
  // median: lineær interpolasjon i intervallet der den kumulative frekvensen passerer N/2
  let median = NaN;
  let acc = 0;
  for (let i = 0; i < f.length; i++) {
    if (acc + f[i] >= N / 2 && f[i] > 0) {
      median = bounds[i] + ((N / 2 - acc) / f[i]) * (bounds[i + 1] - bounds[i]);
      break;
    }
    acc += f[i];
  }
  const widths = f.map((_, i) => bounds[i + 1] - bounds[i]);
  const heights = f.map((fi, i) => fi / widths[i]);
  const tallest = heights.indexOf(Math.max(...heights));
  const lab = (i: number) => `[${nok(bounds[i], 2)}, ${nok(bounds[i + 1], 2)}⟩`;
  const xl = props.xl ?? "Høyde (cm)";

  const spec: DiagramSpec =
    view === "soyle"
      ? {
          type: "soyle",
          opts: { yl: "Frekvens", xl, tittel: "Søylediagram (tar ikke hensyn til intervallbredden)" },
          cats: f.map((_, i) => lab(i)),
          xs: null,
          series: [{ name: "Frekvens", values: f, opts: { c: "muted" } }],
          slices: [],
          bounds: [],
          freq: [],
        }
      : {
          type: view === "hist" ? "histogram" : "kumulativ",
          opts:
            view === "hist"
              ? { yl: "Frekvens per enhet", xl, tittel: "Histogram: søylehøyde = frekvens / intervallbredde" }
              : { xl, yl: "Relativ kumulativ frekvens", median: "1", tittel: "Kumulativ frekvens (sum av frekvensene til og med intervallet)" },
          cats: [],
          xs: null,
          series: [],
          slices: [],
          bounds,
          freq: f,
        };

  return (
    <WidgetCard title={props.title ?? "Histogram og kumulativ frekvens"} hint="Endre frekvensene med knappene. Legg merke til at arealet av hver søyle i histogrammet er lik frekvensen.">
      <Chips
        value={view}
        onChange={setView}
        options={[
          { v: "hist", label: "Histogram" },
          { v: "soyle", label: "Søylediagram (feil)" },
          { v: "kum", label: "Kumulativ frekvens" },
        ]}
      />
      <div className="mt-3">
        <Diagram spec={spec} />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="md-table w-full text-sm">
          <tbody>
            <tr className="md-thead">
              <th>Intervall</th>
              <th>Frekvens</th>
              <th>Bredde</th>
              <th>Søylehøyde</th>
              <th>Kumulativ</th>
            </tr>
            {f.map((fi, i) => {
              const cum = f.slice(0, i + 1).reduce((a, b) => a + b, 0);
              return (
                <tr key={i}>
                  <th>{lab(i)}</th>
                  <td>
                    <span className="inline-flex items-center gap-1">
                      <button type="button" aria-label="Én mindre" onClick={() => setF(f.map((x, j) => (j === i ? Math.max(0, x - 1) : x)))} className="grid size-6 place-items-center rounded-md border border-border hover:bg-muted">
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center font-mono tabular-nums">{fi}</span>
                      <button type="button" aria-label="Én til" onClick={() => setF(f.map((x, j) => (j === i ? x + 1 : x)))} className="grid size-6 place-items-center rounded-md border border-border hover:bg-muted">
                        <Plus className="size-3" />
                      </button>
                    </span>
                  </td>
                  <td>{nok(widths[i], 2)}</td>
                  <td>{nok(heights[i], 2)}</td>
                  <td>
                    {cum} <span className="text-muted-foreground">({nok(N ? (cum / N) * 100 : 0, 1)} %)</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2">
        <button type="button" onClick={() => setF(init)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:bg-muted">
          <RotateCcw className="size-3.5" /> Tilbakestill
        </button>
      </div>
      <Readout
        items={[
          { k: "N", v: String(N) },
          { k: "\\text{Gjennomsnitt} \\approx \\dfrac{\\sum m_i f_i}{N}", v: `\\approx ${tnok(mean, 1)}`, color: "var(--plot-2)" },
          { k: "\\text{Median (interpolert)}", v: `\\approx ${tnok(median, 1)}`, color: "var(--plot-2)" },
          { k: "\\text{Høyeste søyle}", v: `\\text{${lab(tallest).replace("⟩", ")")}}` },
        ]}
      />
    </WidgetCard>
  );
}
