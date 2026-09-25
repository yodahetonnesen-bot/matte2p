"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Trash2, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { parse, toTex, tryFn1 } from "@/lib/expr";
import { roots, touchRoots, niceTex } from "@/lib/numeric";
import { Dot, Grid, PlotFrame, COLORS, fnPath, makeView } from "@/components/plot/core";
import { fitModel, modelTex, MODEL_LABEL, texNum, type ModelKind } from "@/lib/regression";
import { tex } from "@/lib/tex";
import { NumInput } from "@/components/widgets/ui";

type F = { id: number; src: string; show: boolean };
type Win = { x0: number; x1: number; y0: number; y1: number };

const START: F[] = [
  { id: 1, src: "5x + 300", show: true },
  { id: 2, src: "15x + 60", show: true },
];
const START_WIN: Win = { x0: -5, x1: 45, y0: -50, y1: 800 };

function parsePoints(s: string): [number, number][] {
  return s
    .split(/\n|;/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      // «x, y», «x y» eller «x<tab>y». Desimalkomma er lov når tallene skilles med mellomrom/tab.
      const parts = /\t|\s{1,}|;/.test(l.replace(/,\s+/g, " ")) ? l.replace(/,\s+/g, " ").split(/\s+/) : l.split(",");
      const nums = parts.map((p) => Number(p.replace(",", ".")));
      return nums as [number, number];
    })
    .filter((p) => p.length === 2 && p.every(Number.isFinite));
}

/** Graftegner for 2P: grafer, skjæringspunkter, likninger f(x) = c, avlesning og regresjon. */
export function GraphTool() {
  const [fs, setFs] = useState<F[]>(START);
  const [win, setWin] = useState<Win>(START_WIN);
  const [sel, setSel] = useState(1);
  const [a, setA] = useState(24);
  const [c, setC] = useState(NaN);
  const [ptsText, setPtsText] = useState("0, 300\n5, 414\n10, 432\n15, 521\n20, 636\n25, 886\n30, 1119");
  const [showPts, setShowPts] = useState(false);
  const [model, setModel] = useState<ModelKind>("eksponentiell");
  const drag = useRef<{ x: number; y: number; w: Win } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const v = useMemo(() => makeView(win.x0, win.x1, win.y0, win.y1, 720, 480), [win]);
  const fns = useMemo(() => fs.map((f) => ({ ...f, fn: f.src.trim() ? tryFn1(f.src) : null })), [fs]);
  const cur = fns.find((f) => f.id === sel && f.fn);
  const pts = useMemo(() => parsePoints(ptsText), [ptsText]);
  const fit = useMemo(() => (showPts ? fitModel(model, pts) : null), [showPts, model, pts]);

  const analysis = useMemo(() => {
    if (!cur?.fn) return null;
    const f = cur.fn;
    const zeros = [...roots(f, win.x0, win.x1), ...touchRoots(f, win.x0, win.x1)].sort((p, q) => p - q);
    const y0 = f(0);
    const solC = Number.isFinite(c) ? roots((x) => f(x) - c, win.x0, win.x1) : [];
    return { f, zeros, y0, solC };
  }, [cur, win, c]);

  // skjæringspunkter mellom alle par av synlige funksjoner
  const inter = useMemo(() => {
    const ok = fns.filter((f) => f.fn && f.show);
    const out: { x: number; y: number; i: number; j: number }[] = [];
    for (let i = 0; i < ok.length; i++)
      for (let j = i + 1; j < ok.length; j++) {
        const p = ok[i],
          q = ok[j];
        for (const x of roots((t) => p.fn!(t) - q.fn!(t), win.x0, win.x1)) out.push({ x, y: p.fn!(x), i: fs.findIndex((g) => g.id === p.id), j: fs.findIndex((g) => g.id === q.id) });
      }
    return out;
  }, [fns, fs, win]);

  const zoom = (k: number) => {
    const cx = (win.x0 + win.x1) / 2,
      cy = (win.y0 + win.y1) / 2;
    setWin({ x0: cx + (win.x0 - cx) * k, x1: cx + (win.x1 - cx) * k, y0: cy + (win.y0 - cy) * k, y1: cy + (win.y1 - cy) * k });
  };
  const fitWindow = () => {
    const xs = pts.map((p) => p[0]),
      ys = pts.map((p) => p[1]);
    if (!xs.length) return;
    const xr = Math.max(...xs) - Math.min(...xs) || 1,
      yr = Math.max(...ys) - Math.min(...ys) || 1;
    setWin({ x0: Math.min(0, Math.min(...xs) - xr * 0.1), x1: Math.max(...xs) + xr * 0.4, y0: Math.min(0, Math.min(...ys) - yr * 0.1), y1: Math.max(...ys) + yr * 0.5 });
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, w: win };
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const d = drag.current;
    const dx = ((e.clientX - d.x) / r.width) * (d.w.x1 - d.w.x0);
    const dy = ((e.clientY - d.y) / r.height) * (d.w.y1 - d.w.y0);
    setWin({ x0: d.w.x0 - dx, x1: d.w.x1 - dx, y0: d.w.y0 + dy, y1: d.w.y1 + dy });
  };

  const fa = analysis?.f(a) ?? NaN;
  const names = "fghpqr";

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Funksjoner</p>
          <div className="space-y-2">
            {fs.map((f, i) => {
              const ok = !f.src.trim() || !!tryFn1(f.src);
              let preview = "";
              try {
                preview = f.src.trim() ? tex(toTex(parse(f.src))) : "";
              } catch {
                preview = "";
              }
              return (
                <div key={f.id} className={"rounded-xl border p-2 transition " + (sel === f.id ? "border-primary bg-secondary/40" : "border-border")} onClick={() => setSel(f.id)}>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Vis/skjul"
                      onClick={() => setFs(fs.map((g) => (g.id === f.id ? { ...g, show: !g.show } : g)))}
                      className="size-4 shrink-0 rounded-full border-2"
                      style={{ borderColor: COLORS[i % 6], background: f.show ? COLORS[i % 6] : "transparent" }}
                    />
                    <span className="font-mono text-sm italic">{names[i]}(x)=</span>
                    <input
                      value={f.src}
                      onChange={(e) => setFs(fs.map((g) => (g.id === f.id ? { ...g, src: e.target.value } : g)))}
                      onFocus={() => setSel(f.id)}
                      placeholder="skriv et uttrykk…"
                      spellCheck={false}
                      className={"h-8 min-w-0 flex-1 rounded-lg border bg-background px-2 font-mono text-sm outline-none " + (ok ? "border-border" : "border-destructive")}
                    />
                    {fs.length > 1 && (
                      <button type="button" aria-label="Fjern" onClick={() => setFs(fs.filter((g) => g.id !== f.id))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  {preview && <div className="mt-1 overflow-x-auto pl-6 text-sm" dangerouslySetInnerHTML={{ __html: preview }} />}
                </div>
              );
            })}
          </div>
          {fs.length < 5 && (
            <button
              type="button"
              onClick={() => {
                const id = Math.max(...fs.map((f) => f.id)) + 1;
                setFs([...fs, { id, src: "", show: true }]);
                setSel(id);
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <Plus className="size-4" /> Legg til funksjon
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 text-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Valgt funksjon: {names[fs.findIndex((f) => f.id === sel)] ?? "–"}</p>
          <div className="flex flex-wrap gap-3">
            <NumInput label="Les av i x =" value={a} onChange={setA} width="5rem" />
            <NumInput label="Løs f(x) =" value={c} onChange={setC} width="5.5rem" />
          </div>
          {analysis ? (
            <div className="mt-3 space-y-2">
              <Row k={`${names[fs.findIndex((f) => f.id === sel)]}(${texNum(a, 3)})`} v={Number.isFinite(fa) ? `\\approx ${niceTex(fa, 3)}` : "\\text{ikke definert}"} />
              {Number.isFinite(c) && (
                <Row
                  k={`\\text{Løsning av } ${names[fs.findIndex((f) => f.id === sel)]}(x) = ${texNum(c, 3)}`}
                  v={analysis.solC.length ? analysis.solC.map((x) => `x \\approx ${niceTex(x, 3)}`).join(",\\; ") : "\\text{ingen i vinduet}"}
                />
              )}
              <Row k="Nullpunkter" v={analysis.zeros.map((x) => `x \\approx ${niceTex(x)}`).join(",\\; ") || "\\text{ingen i vinduet}"} />
              <Row k="Skjæring med y-aksen" v={Number.isFinite(analysis.y0) ? `(0,\\ ${niceTex(analysis.y0)})` : "\\text{ingen}"} />
              {inter.length > 0 && (
                <Row k="Skjæringspunkter mellom grafene" v={inter.map((p) => `${names[p.i]}\\cap ${names[p.j]}:\\ (${niceTex(p.x)},\\ ${niceTex(p.y)})`).join(",\\; ")} />
              )}
            </div>
          ) : (
            <p className="mt-2 text-muted-foreground">Velg en funksjon med gyldig uttrykk.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 text-sm">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <input type="checkbox" checked={showPts} onChange={(e) => setShowPts(e.target.checked)} /> Punkter og regresjon
          </label>
          {showPts && (
            <>
              <p className="mt-2 text-xs text-muted-foreground">Ett punkt per linje: x, y (f.eks. «5, 414»). Du kan lime inn to kolonner fra et regneark.</p>
              <textarea value={ptsText} onChange={(e) => setPtsText(e.target.value)} rows={6} spellCheck={false} className="mt-1 w-full rounded-lg border border-border bg-background p-2 font-mono text-sm outline-none focus:border-primary" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(Object.keys(MODEL_LABEL) as ModelKind[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModel(m)}
                    className={"rounded-full border px-3 py-1 text-xs transition " + (m === model ? "border-transparent bg-primary text-primary-foreground" : "border-border hover:bg-muted")}
                  >
                    {MODEL_LABEL[m]}
                  </button>
                ))}
              </div>
              {fit &&
                (fit.ok ? (
                  <div className="mt-3 space-y-2">
                    <Row k="Modell" v={modelTex(fit, "r")} />
                    <Row k="R^2" v={texNum(fit.r2, 4)} />
                    <button
                      type="button"
                      onClick={() => {
                        const p = fit.params;
                        const src =
                          fit.kind === "lineaer"
                            ? `${p[0]}x + (${p[1]})`
                            : fit.kind === "eksponentiell"
                              ? `${p[0]}*${p[1]}^x`
                              : fit.kind === "potens"
                                ? `${p[0]}*x^(${p[1]})`
                                : `${p[0]}x^2 + (${p[1]})x + (${p[2]})`;
                        const id = Math.max(...fs.map((f) => f.id)) + 1;
                        if (fs.length < 5) {
                          setFs([...fs, { id, src: src.replace(/(\d\.\d{6})\d+/g, "$1"), show: true }]);
                          setSel(id);
                        }
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Legg modellen til som funksjon
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-destructive">{fit.msg}</p>
                ))}
              <button type="button" onClick={fitWindow} className="mt-2 block text-xs text-primary hover:underline">
                Tilpass vinduet til punktene
              </button>
            </>
          )}
        </div>
        <p className="px-1 text-xs text-muted-foreground">
          Skriv for eksempel <code>5x + 300</code>, <code>300*1,043^x</code>, <code>x^2 - 2x - 3</code> eller <code>24/x</code>. Desimalkomma er lov. Dra i grafen for å flytte deg.
        </p>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-end gap-1.5">
          <div className="mr-auto flex flex-wrap gap-2 text-xs">
            <NumInput label="x fra" value={win.x0} onChange={(x) => x < win.x1 && setWin({ ...win, x0: x })} width="4.2rem" />
            <NumInput label="til" value={win.x1} onChange={(x) => x > win.x0 && setWin({ ...win, x1: x })} width="4.2rem" />
            <NumInput label="y fra" value={win.y0} onChange={(y) => y < win.y1 && setWin({ ...win, y0: y })} width="4.2rem" />
            <NumInput label="til" value={win.y1} onChange={(y) => y > win.y0 && setWin({ ...win, y1: y })} width="4.2rem" />
          </div>
          <IconBtn onClick={() => zoom(0.7)} label="Zoom inn">
            <ZoomIn className="size-4" />
          </IconBtn>
          <IconBtn onClick={() => zoom(1.4)} label="Zoom ut">
            <ZoomOut className="size-4" />
          </IconBtn>
          <IconBtn onClick={() => setWin(START_WIN)} label="Tilbakestill">
            <Maximize className="size-4" />
          </IconBtn>
        </div>
        <PlotFrame
          v={v}
          maxWidth={2000}
          svgProps={{
            ref: svgRef,
            onPointerDown: onDown,
            onPointerMove: onMove,
            onPointerUp: () => (drag.current = null),
            onWheel: (e) => zoom(e.deltaY > 0 ? 1.1 : 0.9),
            style: { cursor: "grab" },
          }}
        >
          <Grid v={v} />
          {Number.isFinite(c) && <line x1={0} x2={v.W} y1={v.H - ((c - v.ymin) / (v.ymax - v.ymin)) * v.H} y2={v.H - ((c - v.ymin) / (v.ymax - v.ymin)) * v.H} stroke="var(--plot-muted)" strokeDasharray="7 6" strokeWidth={1.6} />}
          {fns.map((f, i) =>
            f.fn && f.show ? <path key={f.id} d={fnPath(v, f.fn, { n: 900 })} fill="none" stroke={COLORS[i % 6]} strokeWidth={sel === f.id ? 3 : 2.2} /> : null,
          )}
          {fit?.ok && <path d={fnPath(v, fit.f, { n: 600 })} fill="none" stroke="var(--plot-ink)" strokeWidth={2} strokeDasharray="8 5" />}
          {showPts && pts.map(([x, y], i) => <Dot key={"p" + i} v={v} x={x} y={y} fill="var(--plot-ink)" r={4.2} />)}
          {analysis?.zeros.map((x) => <Dot key={"z" + x} v={v} x={x} y={0} fill="var(--plot-ink)" r={4} open />)}
          {analysis?.solC.map((x) => <Dot key={"c" + x} v={v} x={x} y={c} fill="var(--plot-2)" />)}
          {inter.map((p) => (
            <Dot key={"s" + p.x + p.i + p.j} v={v} x={p.x} y={p.y} fill="var(--plot-5)" />
          ))}
          {analysis && Number.isFinite(fa) && <Dot v={v} x={a} y={fa} fill="var(--plot-4)" />}
        </PlotFrame>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-2.5 py-1.5">
      <div className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: tex(/[\\^_(]/.test(k) ? k : `\\text{${k}}`) }} />
      <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: tex(v) }} />
    </div>
  );
}

function IconBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="grid size-9 place-items-center rounded-lg border border-border bg-card hover:bg-muted">
      {children}
    </button>
  );
}
