"use client";

import { useState } from "react";
import { Readout, WidgetCard } from "./ui";

/** Gjør et tall om til standardform a · 10^n med 1 ≤ a < 10, og viser hvor mange plasser kommaet flyttes. */
export function standardform(raw: string): { a: string; n: number; moves: number; dir: "venstre" | "høyre" | "ingen"; ok: boolean } {
  const t = raw.replace(/[\s  ]/g, "").replace(",", ".");
  if (!/^-?\d*\.?\d+$/.test(t) || Number(t) === 0) return { a: "", n: 0, moves: 0, dir: "ingen", ok: false };
  const neg = t.startsWith("-");
  const u = neg ? t.slice(1) : t;
  const [ip, fp = ""] = u.split(".");
  const digits = (ip + fp).replace(/^0+/, "");
  const lead = (ip + fp).length - digits.length; // ledende nuller
  const n = ip.replace(/^0+/, "").length > 0 ? ip.replace(/^0+/, "").length - 1 : -(lead - ip.length + 1);
  const sig = digits.replace(/0+$/, "") || "0";
  const a = sig.length > 1 ? `${sig[0]},${sig.slice(1)}` : sig;
  return { a: (neg ? "−" : "") + a, n, moves: Math.abs(n), dir: n > 0 ? "venstre" : n < 0 ? "høyre" : "ingen", ok: true };
}

export function StandardformWidget({ props }: { props: Record<string, string> }) {
  const [x, setX] = useState(props.tall ?? "6371000");
  const s = standardform(x);
  const examples = ["6 371 000", "299 792 458", "0,00042", "0,000 000 001", "7 900 000 000", "45,6"];
  return (
    <WidgetCard title="Tall på standardform" hint="På standardform skrives tallet som a · 10ⁿ, der 1 ≤ a < 10. Store tall får positiv eksponent, små tall negativ.">
      <label className="block text-sm">
        <span className="text-muted-foreground">Skriv et tall (mellomrom og desimalkomma er lov):</span>
        <input
          value={x}
          onChange={(e) => setX(e.target.value)}
          inputMode="decimal"
          spellCheck={false}
          className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 font-mono text-lg outline-none focus:border-chap"
        />
      </label>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {examples.map((e) => (
          <button key={e} type="button" onClick={() => setX(e)} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs hover:bg-muted">
            {e}
          </button>
        ))}
      </div>
      {s.ok ? (
        <Readout
          items={[
            { k: "\\text{Standardform}", v: `${s.a.replace(",", "{,}").replace("−", "-")}\\cdot 10^{${s.n}}`, color: "var(--plot-1)" },
            {
              k: "\\text{Kommaet flyttes}",
              v: s.dir === "ingen" ? "\\text{ingen plasser (eksponent 0)}" : `${s.moves}\\ \\text{plass${s.moves === 1 ? "" : "er"} mot ${s.dir}}`,
            },
            { k: "\\text{Eksponenten}", v: s.n > 0 ? "\\text{positiv: tallet er større enn 10}" : s.n < 0 ? "\\text{negativ: tallet er mindre enn 1}" : "\\text{0: tallet er mellom 1 og 10}" },
          ]}
        />
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Skriv et tall som ikke er null.</p>
      )}
    </WidgetCard>
  );
}
