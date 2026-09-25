"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, RefreshCw, X, Eye } from "lucide-react";
import { Glyph } from "@/components/site/glyph";
import { getTopic, type Answer, type Drill } from "@/lib/drills";
import { equivalent, parse, parseNumber, toTex, variables } from "@/lib/expr";
import { parseMarkup } from "@/lib/markup";
import { Markup } from "@/components/markup";
import { tex } from "@/lib/tex";
import { recordDrill, useProgress } from "@/lib/progress";

type Verdict = "right" | "wrong" | null;

/** Fjerner enheter og mellomrom i tall: «12 000 kr» → «12000», «15 %» → «15». */
export function cleanNum(s: string) {
  return s
    .replace(/(\d)[\s\u202f\u2009\u00a0]+(?=\d{3}(\D|$))/g, "$1")
    .replace(/\s*(kr|%|prosentpoeng|prosent|cm\^?[23]?|dm\^?[23]?|mm\^?[23]?|km\^?2?|m\^?[23]?|liter|L|dL|kg|g|år|timer|min|grader|°|elever|stemmer|poeng)\.?\s*$/i, "")
    .replace(/[²]/g, "")
    .replace(/[³]/g, "")
    .trim();
}

/** Tall på standardform: «6,371·10^6», «6.371*10^(6)», «6,371e6». Gir [mantisse, eksponent] eller null. */
function readSf(s: string): [number, number] | null {
  const t = s.replace(/\s+/g, "").replace(/[·×⋅∙xX]/g, "*").replace(/−/g, "-");
  const m = t.match(/^(-?\d+(?:[.,]\d+)?)\*10\^\(?(-?\d+)\)?$/) ?? t.match(/^(-?\d+(?:[.,]\d+)?)[eE](-?\d+)$/);
  if (!m) return null;
  return [Number(m[1].replace(",", ".")), Number(m[2])];
}

function splitSet(s: string) {
  return s
    .split(/;|∨|\beller\b|\bog\b|\|\|/i)
    .map((x) => x.replace(/^\s*x\s*=\s*/i, "").trim())
    .filter(Boolean);
}

function check(a: Answer, inputs: string[], choice: number | null): boolean {
  const close = (x: number, y: number, tol?: number, rel?: boolean) =>
    Math.abs(x - y) <= (tol !== undefined ? (rel ? tol * Math.max(1, Math.abs(y)) : tol) : 1e-7 * Math.max(1, Math.abs(y)));
  switch (a.type) {
    case "num": {
      const s = cleanNum(inputs[0].replace(/^\s*[a-zA-Z]{1,2}\s*=\s*/, ""));
      const x = parseNumber(s);
      return x !== null && close(x, a.value, a.tol, a.rel);
    }
    case "sf": {
      const r = readSf(inputs[0]);
      if (!r) return false;
      const [m, e] = r;
      return Math.abs(m) >= 1 && Math.abs(m) < 10 && close(m * 10 ** e, a.value, 1e-9, true);
    }
    case "expr": {
      let s = inputs[0].replace(/\s+/g, "");
      if (a.strip) {
        const st = a.strip.replace(/\s+/g, "");
        if (s.toLowerCase().startsWith(st.toLowerCase())) s = s.slice(st.length);
      }
      s = s.replace(/^y=/i, "").replace(/^f'\(x\)=/i, "");
      if (!s) return false;
      return equivalent(s, a.expr, { v: a.v ?? "x", lo: a.lo ?? -3, hi: a.hi ?? 3, tol: 1e-5 });
    }
    case "set": {
      const xs = splitSet(inputs[0]).map((t) => parseNumber(t));
      if (xs.some((x) => x === null) || xs.length !== a.values.length) return false;
      const rest = [...a.values];
      for (const x of xs as number[]) {
        const i = rest.findIndex((y) => close(x, y, a.tol ?? 1e-6, true));
        if (i < 0) return false;
        rest.splice(i, 1);
      }
      return true;
    }
    case "vec":
    case "pair": {
      const xs = inputs.map((t) => parseNumber(t));
      return xs[0] !== null && xs[1] !== null && close(xs[0]!, a.value[0], a.tol) && close(xs[1]!, a.value[1], a.tol);
    }
    case "choice":
      return choice === a.correct;
  }
}

function Preview({ s, kind }: { s: string; kind: Answer["type"] }) {
  const html = useMemo(() => {
    if (!s.trim()) return "";
    try {
      if (kind === "set") return splitSet(s).map((t) => tex(toTex(parse(t)))).join(" ; ");
      if (kind === "sf") {
        const r = readSf(s);
        return r ? tex(`${String(r[0]).replace(".", "{,}")}\\cdot 10^{${r[1]}}`) : "";
      }
      const clean = kind === "num" ? cleanNum(s.replace(/^\s*[a-zA-Z]{1,2}\s*=\s*/, "")) : s.replace(/^\s*(y|f'\(x\))\s*=\s*/i, "");
      const node = parse(clean);
      if (kind === "num" && variables(node).size) return "";
      return tex(toTex(node));
    } catch {
      return "";
    }
  }, [s, kind]);
  if (!s.trim()) return null;
  return (
    <div className="mt-1.5 min-h-6 text-sm text-muted-foreground">
      {html ? (
        <span>
          Tolkes som: <span className="text-foreground" dangerouslySetInnerHTML={{ __html: html }} />
        </span>
      ) : (
        <span className="text-destructive">Klarer ikke å lese uttrykket ennå</span>
      )}
    </div>
  );
}

export function DrillRunner({ slug }: { slug: string }) {
  const topic = getTopic(slug)!;
  const [level, setLevel] = useState(1);
  const [seed, setSeed] = useState(0);
  const [drill, setDrill] = useState<Drill | null>(null);
  const [inputs, setInputs] = useState(["", ""]);
  const [choice, setChoice] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [tries, setTries] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [session, setSession] = useState({ right: 0, total: 0, streak: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const progress = useProgress();
  const stats = progress.drills[slug];

  useEffect(() => {
    // Oppgaven lages først på klienten, slik at den ikke avviker mellom server og nettleser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrill(topic.gen(level));
    setInputs(["", ""]);
    setChoice(null);
    setVerdict(null);
    setTries(0);
    setShowSol(false);
    setShowHint(false);
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    return () => clearTimeout(t);
  }, [seed, level, topic]);

  const qBlocks = useMemo(() => (drill ? parseMarkup(drill.q) : []), [drill]);
  const solBlocks = useMemo(() => (drill ? parseMarkup(drill.solution) : []), [drill]);
  const hintBlocks = useMemo(() => (drill?.hint ? parseMarkup(drill.hint) : []), [drill]);
  const showBlocks = useMemo(() => (drill ? parseMarkup(drill.answer.show) : []), [drill]);

  const submit = (ch?: number) => {
    if (!drill || verdict === "right") return;
    const c = ch ?? choice;
    const ok = check(drill.answer, inputs, c);
    setVerdict(ok ? "right" : "wrong");
    setTries((t) => t + 1);
    if (tries === 0) {
      recordDrill(slug, ok);
      setSession((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1, streak: ok ? s.streak + 1 : 0 }));
    }
  };

  const next = () => setSeed((s) => s + 1);
  const a = drill?.answer;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Nivå:</span>
          {[1, 2].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={
                "rounded-full border px-3 py-1 text-sm transition " +
                (level === l ? "border-transparent bg-chap text-white dark:text-background" : "border-border hover:bg-muted")
              }
            >
              {l === 1 ? "Grunnleggende" : "Utfordrende"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {drill && a && (
            <motion.div
              key={seed + "-" + level}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7"
            >
              <div className="text-lg">
                <Markup blocks={qBlocks} />
              </div>

              <motion.div
                className="mt-6"
                animate={verdict === "wrong" ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                key={tries}
              >
                {(a.type === "num" || a.type === "expr" || a.type === "set" || a.type === "sf") && (
                  <>
                    <div className="flex gap-2">
                      <input
                        ref={inputRef}
                        value={inputs[0]}
                        onChange={(e) => {
                          setInputs([e.target.value, inputs[1]]);
                          if (verdict === "wrong") setVerdict(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (verdict === "right" ? next() : submit())}
                        placeholder={a.type === "expr" ? "Skriv uttrykket, f.eks. 3x + 2" : a.type === "set" ? "Løsninger adskilt med ;" : a.type === "sf" ? "F.eks. 6,371*10^6" : "Svar, f.eks. 1234,5"}
                        spellCheck={false}
                        autoComplete="off"
                        className={
                          "h-12 w-full rounded-xl border bg-background px-4 font-mono text-base outline-none transition focus:ring-2 " +
                          (verdict === "right"
                            ? "border-success ring-[color-mix(in_oklch,var(--success)_30%,transparent)]"
                            : verdict === "wrong"
                              ? "border-destructive ring-[color-mix(in_oklch,var(--destructive)_25%,transparent)]"
                              : "border-border focus:border-chap focus:ring-[color-mix(in_oklch,var(--chap)_25%,transparent)]")
                        }
                      />
                    </div>
                    <Preview s={inputs[0]} kind={a.type} />
                  </>
                )}
                {(a.type === "vec" || a.type === "pair") && (
                  <div className="flex flex-wrap items-center gap-2 font-mono">
                    {a.type === "vec" && <span className="text-xl">[</span>}
                    {[0, 1].map((i) => (
                      <label key={i} className="flex items-center gap-2">
                        {a.type === "pair" && <span className="font-sans text-sm">{a.labels[i]}</span>}
                        <input
                          ref={i === 0 ? inputRef : undefined}
                          value={inputs[i]}
                          onChange={(e) => {
                            const n = [...inputs];
                            n[i] = e.target.value;
                            setInputs(n);
                            if (verdict === "wrong") setVerdict(null);
                          }}
                          onKeyDown={(e) => e.key === "Enter" && (verdict === "right" ? next() : submit())}
                          placeholder={a.type === "vec" ? (i === 0 ? "x" : "y") : ""}
                          className="h-12 w-24 rounded-xl border border-border bg-background px-3 text-center text-base outline-none focus:border-chap focus:ring-2 focus:ring-[color-mix(in_oklch,var(--chap)_25%,transparent)]"
                        />
                        {a.type === "vec" && i === 0 && <span className="text-xl">,</span>}
                      </label>
                    ))}
                    {a.type === "vec" && <span className="text-xl">]</span>}
                  </div>
                )}
                {a.type === "choice" && (
                  <div className="flex flex-wrap gap-2">
                    {a.options.map((o, i) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => {
                          setChoice(i);
                          submit(i);
                        }}
                        className={
                          "min-w-24 rounded-xl border px-5 py-3 font-medium transition " +
                          (choice === i ? (verdict === "right" ? "border-success bg-success/15" : "border-destructive bg-destructive/10") : "border-border hover:bg-muted")
                        }
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {a.type !== "choice" && verdict !== "right" && (
                  <button
                    type="button"
                    onClick={() => submit()}
                    className="inline-flex items-center gap-2 rounded-full bg-chap px-5 py-2.5 font-medium text-white transition hover:brightness-110 active:scale-[0.98] dark:text-background"
                  >
                    <Check className="size-4" /> Sjekk svaret
                  </button>
                )}
                {(verdict === "right" || showSol) && (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-medium text-background transition hover:opacity-90 active:scale-[0.98]"
                  >
                    <RefreshCw className="size-4" /> Ny oppgave
                  </button>
                )}
                {drill.hint && verdict !== "right" && (
                  <button type="button" onClick={() => setShowHint((h) => !h)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
                    <Glyph g="?" /> Hint
                  </button>
                )}
                <button type="button" onClick={() => setShowSol((s) => !s)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
                  <Eye className="size-4" /> {showSol ? "Skjul løsning" : "Vis løsning"}
                </button>
                {verdict !== "right" && !showSol && (
                  <button type="button" onClick={next} className="ml-auto text-sm text-muted-foreground hover:text-foreground">
                    Hopp over →
                  </button>
                )}
              </div>

              <AnimatePresence>
                {verdict && (
                  <motion.div
                    key={verdict + tries}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={
                      "mt-5 flex items-start gap-3 rounded-2xl p-4 " +
                      (verdict === "right" ? "bg-[color-mix(in_oklch,var(--success)_14%,var(--card))]" : "bg-[color-mix(in_oklch,var(--destructive)_10%,var(--card))]")
                    }
                  >
                    <span className={"grid size-8 shrink-0 place-items-center rounded-full text-white " + (verdict === "right" ? "bg-success" : "bg-destructive")}>
                      {verdict === "right" ? <Check className="size-4" /> : <X className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold">{verdict === "right" ? (tries > 1 ? "Riktig nå!" : "Riktig! Bra jobba.") : "Ikke helt riktig – prøv igjen, eller se hint."}</p>
                      {verdict === "right" && (
                        <div className="mt-1 text-sm">
                          <Markup blocks={showBlocks} compact />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showHint && hintBlocks.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-4 rounded-2xl border border-[color-mix(in_oklch,var(--warn)_40%,var(--border))] bg-[color-mix(in_oklch,var(--warn)_8%,var(--card))] p-4 text-sm">
                      <Markup blocks={hintBlocks} compact />
                    </div>
                  </motion.div>
                )}
                {showSol && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-4 rounded-2xl border border-border bg-muted/60 p-4">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Løsning</p>
                      <Markup blocks={solBlocks} compact />
                      <div className="mt-3 border-t border-border pt-3 text-sm">
                        <span className="font-semibold">Fasit: </span>
                        <Markup blocks={showBlocks} compact />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Denne økten</p>
          <div className="mt-3 flex items-end gap-6">
            <div>
              <div className="font-display text-4xl font-semibold">
                {session.right}
                <span className="text-xl text-muted-foreground">/{session.total}</span>
              </div>
              <div className="text-xs text-muted-foreground">riktige på første forsøk</div>
            </div>
            <div className="text-[color-mix(in_oklch,var(--warn)_70%,var(--foreground))]">
              <span className="font-display text-2xl font-semibold">{session.streak}</span>
              <div className="text-xs text-muted-foreground">riktige på rad</div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Totalt på dette temaet
          </p>
          <p className="mt-2 text-sm">
            {stats ? (
              <>
                {stats.right} av {stats.total} riktige · beste rekke {stats.best}
              </>
            ) : (
              "Ingen forsøk ennå."
            )}
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
            Slik skriver du svar
          </p>
          <ul className="space-y-1.5">
            <li>
              Desimaltall med komma eller punktum: <code className="rounded bg-muted px-1">1,025</code>
            </li>
            <li>
              Enheter kan stå med: <code className="rounded bg-muted px-1">12 000 kr</code>, <code className="rounded bg-muted px-1">15 %</code>
            </li>
            <li>
              Negativt tall for nedgang: <code className="rounded bg-muted px-1">-12,5</code>
            </li>
            <li>
              Standardform: <code className="rounded bg-muted px-1">6,371*10^6</code>
            </li>
            <li>
              Brøk og regnestykker går også: <code className="rounded bg-muted px-1">3/8</code>, <code className="rounded bg-muted px-1">455/0,65</code>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
