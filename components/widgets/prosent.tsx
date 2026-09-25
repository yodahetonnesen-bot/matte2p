"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { tex } from "@/lib/tex";
import { NumInput, Readout, Slider, WidgetCard, nok, tnok } from "./ui";

/**
 * Prosent og vekstfaktor: startverdi og én eller flere prosentvise endringer.
 * props: start="400", p="20" (flere endringer: p="10,-10").
 */
export function ProsentWidget({ props }: { props: Record<string, string> }) {
  const [B, setB] = useState(Number(props.start ?? 400));
  const [ps, setPs] = useState<number[]>((props.p ?? "20").split(",").map(Number));
  const factors = ps.map((p) => 1 + p / 100);
  const values = [B];
  factors.forEach((k) => values.push(values[values.length - 1] * k));
  const total = factors.reduce((a, k) => a * k, 1);
  const end = values[values.length - 1];
  const maxV = Math.max(...values);
  const sumP = ps.reduce((a, p) => a + p, 0);
  const unit = props.enhet ?? "kr";

  return (
    <WidgetCard title={props.title ?? "Prosent og vekstfaktor"} hint="Endre startverdien og prosentene. Legg til flere endringer etter hverandre og se at vekstfaktorene ganges sammen.">
      <div className="flex flex-wrap items-center gap-3">
        <NumInput label="Startverdi" value={B} onChange={setB} min={0} suffix={unit} />
      </div>
      <div className="mt-4 space-y-2.5">
        {ps.map((p, i) => (
          <div key={i}>
            <Slider
              label={`p_{${i + 1}}`}
              value={p}
              min={-90}
              max={150}
              step={0.5}
              onChange={(x) => setPs(ps.map((q, j) => (j === i ? x : q)))}
              format={(x) => (x > 0 ? "+" : "") + nok(x, 1) + " %"}
            />
          </div>
        ))}
        <div className="flex gap-2 pl-16">
          {ps.length < 5 && (
            <button type="button" onClick={() => setPs([...ps, 10])} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:bg-muted">
              <Plus className="size-3.5" /> Ny endring
            </button>
          )}
          {ps.length > 1 && (
            <button type="button" onClick={() => setPs(ps.slice(0, -1))} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:bg-muted">
              <Minus className="size-3.5" /> Fjern siste
            </button>
          )}
        </div>
      </div>

      {/* søyler: startverdien er 100 % */}
      <div className="mt-5 space-y-2" aria-label="Verdien etter hver endring">
        {values.map((v, i) => (
          <div key={i} className="grid grid-cols-[5.2rem_minmax(0,1fr)] items-center gap-2 text-xs">
            <span className="text-right text-muted-foreground">{i === 0 ? "Start" : `Etter ${i}. endring`}</span>
            <div className="relative h-7 rounded-md bg-muted/70">
              <div
                className="absolute inset-y-0 left-0 rounded-md transition-[width] duration-300"
                style={{
                  width: `${maxV > 0 ? (v / maxV) * 100 : 0}%`,
                  background:
                    i === 0
                      ? "color-mix(in oklch, var(--plot-muted) 45%, transparent)"
                      : i === values.length - 1
                        ? "color-mix(in oklch, var(--plot-1) 45%, transparent)"
                        : "color-mix(in oklch, var(--plot-1) 25%, transparent)",
                }}
              />
              <span className="absolute inset-y-0 left-2 flex items-center font-mono font-semibold text-foreground">
                {nok(v, 2)} {unit} · {nok((v / (B || 1)) * 100, 1)} %
              </span>
            </div>
          </div>
        ))}
      </div>

      <Readout
        items={[
          ...ps.map((p, i) => ({
            k: `\\text{Vekstfaktor ${i + 1}}`,
            v: `1 ${p < 0 ? "-" : "+"} \\tfrac{${tnok(Math.abs(p), 1)}}{100} = ${tnok(factors[i], 4)}`,
          })),
          {
            k: "\\text{Ny verdi} = \\text{startverdi}\\cdot\\text{vekstfaktor}",
            v: `${tnok(B, 2)}${factors.map((k) => `\\cdot ${tnok(k, 4)}`).join("")} = ${tnok(end, 2)}`,
            color: "var(--plot-1)",
          },
          ...(ps.length > 1
            ? [
                {
                  k: "\\text{Samlet vekstfaktor}",
                  v: `${factors.map((k) => tnok(k, 4)).join("\\cdot ")} = ${tnok(total, 4)}`,
                  color: "var(--plot-2)",
                },
              ]
            : []),
          {
            k: "\\text{Samlet endring}",
            v: `${total >= 1 ? "+" : "-"}${tnok(Math.abs(total - 1) * 100, 2)}\\,\\%`,
            color: "var(--plot-2)",
          },
        ]}
      />
      {ps.length > 1 && Math.abs(sumP) < 1e-9 && Math.abs(total - 1) > 1e-9 && (
        <p className="mt-3 rounded-xl border border-border bg-background/60 p-3 text-sm" dangerouslySetInnerHTML={{
          __html: `Prosentene summerer seg til 0, men verdien endres likevel med ${tex(`${tnok((total - 1) * 100, 2)}\\,\\%`)}. Prosentene regnes av ulike verdier – derfor må vi gange vekstfaktorene, ikke legge sammen prosentene.`,
        }} />
      )}
    </WidgetCard>
  );
}
