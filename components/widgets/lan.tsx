"use client";

import { useState } from "react";
import { Diagram } from "@/components/plot/diagram";
import type { DiagramSpec } from "@/lib/markup";
import { Chips, NumInput, Readout, WidgetCard, nok, tnok } from "./ui";

type Kind = "annuitet" | "serie";

export function nedbetaling(kind: Kind, L: number, p: number, n: number) {
  const r = p / 100;
  const A = kind === "annuitet" ? (r === 0 ? L / n : (L * r) / (1 - Math.pow(1 + r, -n))) : NaN;
  const rows: { t: number; rest: number; renter: number; avdrag: number; termin: number }[] = [];
  let rest = L;
  for (let t = 1; t <= n; t++) {
    const renter = rest * r;
    const avdrag = kind === "annuitet" ? A - renter : L / n;
    const termin = renter + avdrag;
    rows.push({ t, rest, renter, avdrag, termin });
    rest -= avdrag;
  }
  return { A, rows };
}

/**
 * Serielån og annuitetslån: avdrag og renter for hver termin.
 * props: belop="800000", rente="2.5" (per termin), terminer="10", type="annuitet"|"serie"
 */
export function LanWidget({ props }: { props: Record<string, string> }) {
  const [kind, setKind] = useState<Kind>(props.type === "serie" ? "serie" : "annuitet");
  const [L, setL] = useState(Number(props.belop ?? 800000));
  const [p, setP] = useState(Number(props.rente ?? 2.5));
  const [n, setN] = useState(Number(props.terminer ?? 10));
  const nn = Math.max(1, Math.min(40, Math.round(n)));
  const { A, rows } = nedbetaling(kind, L, p, nn);
  const sumR = rows.reduce((a, r) => a + r.renter, 0);
  const sumT = rows.reduce((a, r) => a + r.termin, 0);
  const spec: DiagramSpec = {
    type: "soyle",
    opts: { stablet: "1", yl: "kr", xl: "Termin", tittel: kind === "annuitet" ? "Annuitetslån: like store terminbeløp" : "Serielån: like store avdrag" },
    cats: rows.map((r) => String(r.t)),
    xs: null,
    series: [
      { name: "Avdrag", values: rows.map((r) => Math.round(r.avdrag)), opts: { c: "1" } },
      { name: "Renter", values: rows.map((r) => Math.round(r.renter)), opts: { c: "2" } },
    ],
    slices: [],
    bounds: [],
    freq: [],
  };
  return (
    <WidgetCard title="Serielån og annuitetslån" hint="Terminbeløp = avdrag + renter. Rentene regnes av restgjelden, så de blir mindre etter hvert som lånet betales ned.">
      <Chips
        value={kind}
        onChange={setKind}
        options={[
          { v: "annuitet", label: "Annuitetslån" },
          { v: "serie", label: "Serielån" },
        ]}
      />
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        <NumInput label="Lån" value={L} onChange={setL} min={1} suffix="kr" width="7.5rem" />
        <NumInput label="Rente per termin" value={p} onChange={setP} min={0} max={50} suffix="%" width="4.5rem" />
        <NumInput label="Terminer" value={n} onChange={setN} min={1} max={40} width="3.5rem" />
      </div>
      <div className="mt-4">
        <Diagram spec={spec} />
      </div>
      <div className="mt-4 max-h-80 overflow-auto">
        <table className="md-table w-full text-sm">
          <tbody>
            <tr className="md-thead">
              <th>Termin</th>
              <th>Restlån før</th>
              <th>Renter</th>
              <th>Avdrag</th>
              <th>Terminbeløp</th>
            </tr>
            {rows.map((r) => (
              <tr key={r.t}>
                <th>{r.t}</th>
                <td>{nok(r.rest, 0)}</td>
                <td>{nok(r.renter, 0)}</td>
                <td>{nok(r.avdrag, 0)}</td>
                <td>{nok(r.termin, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Readout
        items={[
          kind === "annuitet"
            ? { k: "\\text{Terminbeløp (likt hver gang)}", v: `\\approx ${tnok(A, 0)}\\ \\text{kr}`, color: "var(--plot-1)" }
            : { k: "\\text{Avdrag} = \\dfrac{\\text{lånesum}}{\\text{antall terminer}}", v: `\\dfrac{${tnok(L, 0)}}{${nn}} \\approx ${tnok(L / nn, 0)}\\ \\text{kr}`, color: "var(--plot-1)" },
          { k: "\\text{Sum renter}", v: `\\approx ${tnok(sumR, 0)}\\ \\text{kr}`, color: "var(--plot-2)" },
          { k: "\\text{Sum betalt}", v: `\\approx ${tnok(sumT, 0)}\\ \\text{kr}` },
        ]}
      />
    </WidgetCard>
  );
}
