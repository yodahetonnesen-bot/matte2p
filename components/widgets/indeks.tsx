"use client";

import { useState } from "react";
import { Chips, NumInput, Readout, WidgetCard, nok, tnok } from "./ui";

import { KPI, KPI_YEARS as YEARS } from "@/lib/kpi";

type Mode = "pris" | "real";

function YearSelect({ label, value, onChange }: { label: string; value: number; onChange: (y: number) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-9 rounded-lg border border-border bg-background px-2 text-sm">
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Regn om beløp mellom år med KPI, og finn kroneverdi og reallønn. */
export function IndeksWidget({ props }: { props: Record<string, string> }) {
  const [mode, setMode] = useState<Mode>(props.mode === "real" ? "real" : "pris");
  const [y1, setY1] = useState(Number(props.fra ?? 2000));
  const [y2, setY2] = useState(Number(props.til ?? 2019));
  const [amount, setAmount] = useState(Number(props.belop ?? 449));
  const [l1, setL1] = useState(405000);
  const [l2, setL2] = useState(420000);
  const i1 = KPI[y1],
    i2 = KPI[y2];
  const k1 = 100 / i1,
    k2 = 100 / i2;
  const conv = (amount / i1) * i2;
  const r1 = l1 * k1,
    r2 = l2 * k2;
  return (
    <WidgetCard title="Konsumprisindeks, kroneverdi og reallønn" hint="Pris og indeks er proporsjonale: pris/indeks er den samme for alle år. Kroneverdien er 100/KPI, og reallønn = nominell lønn · kroneverdi.">
      <Chips
        value={mode}
        onChange={setMode}
        options={[
          { v: "pris", label: "Regn om et beløp" },
          { v: "real", label: "Sammenlikn reallønn" },
        ]}
      />
      {mode === "pris" ? (
        <>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            <NumInput label="Beløp" value={amount} onChange={setAmount} min={0} suffix="kr" width="7rem" />
            <YearSelect label="i år" value={y1} onChange={setY1} />
            <YearSelect label="regnet om til år" value={y2} onChange={setY2} />
          </div>
          <Readout
            items={[
              { k: `\\text{KPI}_{${y1}},\\ \\text{KPI}_{${y2}}`, v: `${tnok(i1, 1)},\\ ${tnok(i2, 1)}` },
              { k: "\\dfrac{\\text{pris}}{\\text{indeks}} = \\dfrac{\\text{pris}}{\\text{indeks}}", v: `\\dfrac{${tnok(amount, 2)}}{${tnok(i1, 1)}} = \\dfrac{x}{${tnok(i2, 1)}}` },
              { k: `\\text{Beløpet i ${y2}}`, v: `x = \\dfrac{${tnok(amount, 2)}\\cdot ${tnok(i2, 1)}}{${tnok(i1, 1)}} \\approx ${tnok(conv, 2)}\\ \\text{kr}`, color: "var(--plot-1)" },
              { k: `\\text{Prisendring ${y1}–${y2}}`, v: `\\dfrac{${tnok(i2, 1)}}{${tnok(i1, 1)}} \\approx ${tnok(i2 / i1, 4)} \\Rightarrow ${i2 >= i1 ? "+" : "-"}${tnok(Math.abs(i2 / i1 - 1) * 100, 1)}\\,\\%` },
            ]}
          />
        </>
      ) : (
        <>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="flex flex-wrap gap-2">
              <YearSelect label="År" value={y1} onChange={setY1} />
              <NumInput label="lønn" value={l1} onChange={setL1} min={0} suffix="kr" width="7rem" />
            </div>
            <div className="flex flex-wrap gap-2">
              <YearSelect label="År" value={y2} onChange={setY2} />
              <NumInput label="lønn" value={l2} onChange={setL2} min={0} suffix="kr" width="7rem" />
            </div>
          </div>
          <Readout
            items={[
              { k: `\\text{Kroneverdi ${y1}}`, v: `\\dfrac{100}{${tnok(i1, 1)}} \\approx ${tnok(k1, 4)}` },
              { k: `\\text{Kroneverdi ${y2}}`, v: `\\dfrac{100}{${tnok(i2, 1)}} \\approx ${tnok(k2, 4)}` },
              { k: `\\text{Reallønn ${y1}}`, v: `${tnok(l1, 0)}\\cdot ${tnok(k1, 4)} \\approx ${tnok(r1, 0)}\\ \\text{kr}`, color: "var(--plot-1)" },
              { k: `\\text{Reallønn ${y2}}`, v: `${tnok(l2, 0)}\\cdot ${tnok(k2, 4)} \\approx ${tnok(r2, 0)}\\ \\text{kr}`, color: "var(--plot-2)" },
              {
                k: "\\text{Kjøpekraft}",
                v: r2 > r1 ? `\\text{økte med } ${tnok((r2 / r1 - 1) * 100, 1)}\\,\\%` : r2 < r1 ? `\\text{sank med } ${tnok((1 - r2 / r1) * 100, 1)}\\,\\%` : "\\text{uendret}",
              },
            ]}
          />
        </>
      )}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted-foreground">KPI-tabellen (2015 = 100)</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="md-table text-sm">
            <tbody>
              <tr className="md-thead">
                <th>År</th>
                {YEARS.map((y) => (
                  <th key={y}>{y}</th>
                ))}
              </tr>
              <tr>
                <th>KPI</th>
                {YEARS.map((y) => (
                  <td key={y}>{nok(KPI[y], 1)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </WidgetCard>
  );
}
