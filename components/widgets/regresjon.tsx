"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { Dot, fnPath, makeView, niceStep } from "@/components/plot/core";
import { fitModel, modelTex, MODEL_LABEL, texNum, type ModelKind } from "@/lib/regression";
import { Chips, IPlot, NumInput, Readout, WidgetCard, clamp, nok, tnok } from "./ui";

function parseData(s: string): [number, number][] {
  return s
    .split(";")
    .map((p) => p.split(",").map((t) => Number(t.trim())) as [number, number])
    .filter((p) => p.length === 2 && p.every(Number.isFinite));
}

/**
 * Regresjon på en punktsky. Dra i punktene, velg modell og les av formel og R².
 * props: data="0,300;5,414;…", modell="eksponentiell", x="0,40", y="0,1600", xl, yl, pred="22"
 */
export function RegresjonWidget({ props }: { props: Record<string, string> }) {
  const start = useMemo(() => parseData(props.data ?? "0,300;5,414;10,432;15,521;20,636;25,886;30,1119"), [props.data]);
  const [pts, setPts] = useState<[number, number][]>(start);
  const [kind, setKind] = useState<ModelKind>((props.modell as ModelKind) ?? "eksponentiell");
  const [sel, setSel] = useState<number | null>(null);
  const [px, setPx] = useState(Number(props.pred ?? NaN));

  const view = useMemo(() => {
    const xs = start.map((p) => p[0]),
      ys = start.map((p) => p[1]);
    const [x0, x1] = props.x ? props.x.split(",").map(Number) : [Math.min(0, ...xs), Math.max(...xs) * 1.35];
    const [y0, y1] = props.y ? props.y.split(",").map(Number) : [Math.min(0, ...ys), Math.max(...ys) * 1.45];
    return makeView(x0, x1, y0, y1, 560, 360);
  }, [start, props.x, props.y]);

  const fit = useMemo(() => fitModel(kind, pts), [kind, pts]);
  const snap = (val: number, span: number) => {
    const st = niceStep(span, 40);
    return Math.round(val / st) * st;
  };
  const pred = fit.ok && Number.isFinite(px) ? fit.f(px) : NaN;

  const extra: { k: string; v: string; color?: string }[] = [];
  if (fit.ok && kind === "eksponentiell") {
    const k = fit.params[1];
    extra.push({
      k: "\\text{Vekstfaktor } k",
      v: `${texNum(k, 4)} \\Rightarrow ${k >= 1 ? "\\text{økning}" : "\\text{nedgang}"}\\ ${texNum(Math.abs(k - 1) * 100, 2)}\\,\\%\\ \\text{per enhet}`,
    });
  }
  if (fit.ok && kind === "lineaer") extra.push({ k: "\\text{Stigningstall } a", v: `${texNum(fit.params[0], 3)}\\ \\text{per enhet}` });

  return (
    <WidgetCard title={props.title ?? "Regresjon på en punktsky"} hint="Dra i punktene. Modellen og R² oppdateres med en gang. R² nær 1 betyr at modellen ligger nær punktene – men sjekk alltid om modellen er fornuftig utenfor dataene.">
      <Chips
        value={kind}
        onChange={setKind}
        options={(Object.keys(MODEL_LABEL) as ModelKind[]).map((m) => ({ v: m, label: MODEL_LABEL[m] }))}
      />
      <div className="mt-3">
        <IPlot
          v={view}
          xLabel={props.xl ?? "x"}
          yLabel={props.yl ?? "y"}
          handles={pts.map(([x, y], i) => ({ id: String(i), x, y, color: sel === i ? "var(--plot-2)" : "var(--plot-1)", r: 5.5 }))}
          onDrag={(id, x, y) => {
            const i = Number(id);
            setSel(i);
            const nx = snap(clamp(x, view.xmin, view.xmax), view.xmax - view.xmin);
            const ny = snap(clamp(y, view.ymin, view.ymax), view.ymax - view.ymin);
            setPts(pts.map((p, j) => (j === i ? [nx, ny] : p)));
          }}
        >
          {fit.ok && <path d={fnPath(view, fit.f)} fill="none" stroke="var(--plot-2)" strokeWidth={2.6} />}
          {Number.isFinite(pred) && <Dot v={view} x={px} y={pred} fill="var(--plot-4)" />}
        </IPlot>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => {
            const cx = (view.xmin + view.xmax) / 2,
              cy = (view.ymin + view.ymax) / 2;
            setPts([...pts, [snap(cx, view.xmax - view.xmin), snap(cy, view.ymax - view.ymin)]]);
            setSel(pts.length);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted"
        >
          <Plus className="size-3.5" /> Nytt punkt
        </button>
        <button
          type="button"
          disabled={sel === null || pts.length <= 2}
          onClick={() => {
            if (sel === null) return;
            setPts(pts.filter((_, j) => j !== sel));
            setSel(null);
          }}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted disabled:opacity-40"
        >
          <Trash2 className="size-3.5" /> Fjern valgt punkt
        </button>
        <button type="button" onClick={() => { setPts(start); setSel(null); }} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:bg-muted">
          <RotateCcw className="size-3.5" /> Tilbakestill
        </button>
        <span className="ml-auto">
          <NumInput label="Regn ut for x =" value={px} onChange={setPx} width="5rem" />
        </span>
      </div>
      {fit.ok ? (
        <Readout
          items={[
            { k: `\\text{${MODEL_LABEL[kind]} modell}`, v: modelTex(fit), color: "var(--plot-2)" },
            { k: "R^2", v: texNum(fit.r2, 4) },
            ...extra,
            ...(Number.isFinite(pred) ? [{ k: `f(${tnok(px, 2)})`, v: `\\approx ${tnok(pred, 2)}`, color: "var(--plot-4)" }] : []),
          ]}
        />
      ) : (
        <p className="mt-3 text-sm text-destructive">{fit.msg}</p>
      )}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted-foreground">Vis punktene som tabell</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="md-table text-sm">
            <tbody>
              <tr className="md-thead">
                <th>x</th>
                {pts.map((p, i) => (
                  <th key={i}>{nok(p[0], 2)}</th>
                ))}
              </tr>
              <tr>
                <th>y</th>
                {pts.map((p, i) => (
                  <td key={i}>{nok(p[1], 2)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </WidgetCard>
  );
}
