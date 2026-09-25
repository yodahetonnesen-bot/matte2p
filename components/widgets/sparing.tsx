"use client";

import { useState } from "react";
import { Diagram } from "@/components/plot/diagram";
import type { DiagramSpec } from "@/lib/markup";
import { Chips, NumInput, Readout, WidgetCard, nok, tnok } from "./ui";

type Unit = "år" | "måned";

/**
 * Renters rente: sparing med eller uten faste innskudd, eller kredittkortgjeld med månedsrente.
 * props: start="40000", rente="1.5", innskudd="0", perioder="6", enhet="år"|"måned", tittel
 */
export function SparingWidget({ props }: { props: Record<string, string> }) {
  const [B, setB] = useState(Number(props.start ?? 40000));
  const [p, setP] = useState(Number(props.rente ?? 1.5));
  const [d, setD] = useState(Number(props.innskudd ?? 0));
  const [n, setN] = useState(Number(props.perioder ?? 6));
  const [unit, setUnit] = useState<Unit>(props.enhet === "måned" ? "måned" : "år");
  const nn = Math.max(1, Math.min(120, Math.round(n)));
  const k = 1 + p / 100;
  // Innskudd settes inn i starten av hver periode (etter den første), som i bokas regneark.
  const saldo: number[] = [];
  let s = B;
  for (let t = 1; t <= nn; t++) {
    if (t > 1) s += d;
    s *= k;
    saldo.push(s);
  }
  const innbetalt = B + d * (nn - 1);
  const renter = saldo[nn - 1] - innbetalt;
  let dbl = NaN;
  if (p > 0 && d === 0) dbl = Math.ceil(Math.log(2) / Math.log(k) - 1e-9);
  const step = nn > 24 ? Math.ceil(nn / 24) : 1;
  const idx = saldo.map((_, i) => i).filter((i) => (i + 1) % step === 0 || i === nn - 1);
  const spec: DiagramSpec = {
    type: "soyle",
    opts: { yl: "kr", xl: `Antall ${unit === "år" ? "år" : "måneder"}`, tittel: "Saldo ved slutten av hver periode" },
    cats: idx.map((i) => String(i + 1)),
    xs: null,
    series: [{ name: "Saldo", values: idx.map((i) => Math.round(saldo[i])), opts: { c: "3" } }],
    slices: [],
    bounds: [],
    freq: [],
  };
  const unitWord = unit === "år" ? "år" : "måned";
  return (
    <WidgetCard title={props.tittel ?? "Renters rente: sparing og gjeld"} hint="Hver periode ganges saldoen med vekstfaktoren 1 + p/100. Rentene gir nye renter – derfor vokser beløpet eksponentielt.">
      <Chips
        value={unit}
        onChange={setUnit}
        options={[
          { v: "år", label: "Rente per år" },
          { v: "måned", label: "Rente per måned (kredittkort)" },
        ]}
      />
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        <NumInput label="Startbeløp" value={B} onChange={setB} min={0} suffix="kr" width="7rem" />
        <NumInput label={`Rente per ${unitWord}`} value={p} onChange={setP} min={-50} max={100} suffix="%" width="4.5rem" />
        <NumInput label={`Innskudd hver ${unitWord}`} value={d} onChange={setD} min={0} suffix="kr" width="6rem" />
        <NumInput label={unit === "år" ? "Antall år" : "Antall måneder"} value={n} onChange={setN} min={1} max={120} width="4rem" />
      </div>
      <div className="mt-4">
        <Diagram spec={spec} />
      </div>
      <Readout
        items={[
          d === 0
            ? { k: "B\\cdot k^n", v: `${tnok(B, 0)}\\cdot ${tnok(k, 4)}^{${nn}} \\approx ${tnok(saldo[nn - 1], 2)}\\ \\text{kr}`, color: "var(--plot-3)" }
            : { k: `\\text{Saldo etter ${nn} ${unit === "år" ? "år" : "mnd"}}`, v: `\\approx ${tnok(saldo[nn - 1], 2)}\\ \\text{kr}`, color: "var(--plot-3)" },
          { k: "\\text{Satt inn / lånt}", v: `${tnok(innbetalt, 0)}\\ \\text{kr}` },
          { k: "\\text{Renter til sammen}", v: `\\approx ${tnok(renter, 2)}\\ \\text{kr}`, color: "var(--plot-2)" },
          ...(unit === "måned"
            ? [{ k: "\\text{Årlig rente} = k^{12} - 1", v: `${tnok(k, 4)}^{12} - 1 \\approx ${tnok((Math.pow(k, 12) - 1) * 100, 2)}\\,\\%` }]
            : []),
          ...(Number.isFinite(dbl) ? [{ k: "\\text{Doblet etter}", v: `${dbl}\\ \\text{${unit === "år" ? "år" : "måneder"}}` }] : []),
        ]}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {d > 0 ? `Første innskudd er startbeløpet. Deretter settes ${nok(d, 0)} kr inn i starten av hver ${unitWord}, og rentene legges til på slutten.` : "Rentene legges til på slutten av hver periode."}
      </p>
    </WidgetCard>
  );
}
