"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, EyeOff, RotateCcw } from "lucide-react";
import { glyphIcon } from "@/components/site/glyph";

const Lightbulb = glyphIcon("?");
const ListChecks = glyphIcon("⇒");
import { setExStatus, useProgress } from "@/lib/progress";

type Ctx = { all: boolean; hint: boolean; sol: boolean; n: number };
const ExCtx = createContext<Ctx>({ all: false, hint: false, sol: false, n: 0 });

export function ExerciseShell({
  id,
  hasAnswers,
  hasHint,
  hasSolution,
  header,
  children,
  hint,
  solution,
}: {
  id: string;
  hasAnswers: boolean;
  hasHint: boolean;
  hasSolution: boolean;
  header: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  solution?: ReactNode;
}) {
  const [all, setAll] = useState(false);
  const [n, setN] = useState(0);
  const [hintOpen, setHint] = useState(false);
  const [solOpen, setSol] = useState(false);
  const progress = useProgress();
  const status = progress.ex[id];

  return (
    <ExCtx.Provider value={{ all, hint: hintOpen, sol: solOpen, n }}>
      <article
        id={"oppg-" + id}
        className={
          "group/ex relative scroll-mt-24 rounded-2xl border bg-card p-4 shadow-[0_1px_2px_oklch(0_0_0/0.04)] transition-colors sm:p-5 " +
          (status === "done"
            ? "border-[color-mix(in_oklch,var(--success)_45%,var(--border))]"
            : status === "review"
              ? "border-[color-mix(in_oklch,var(--warn)_55%,var(--border))]"
              : "border-border")
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {header}
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            {hasHint && (
              <PillButton active={hintOpen} onClick={() => setHint((h) => !h)} Icon={Lightbulb}>
                Hint
              </PillButton>
            )}
            {hasSolution && (
              <PillButton active={solOpen} onClick={() => setSol((s) => !s)} Icon={ListChecks}>
                Løsning
              </PillButton>
            )}
            {hasAnswers && (
              <PillButton
                active={all}
                onClick={() => {
                  setAll((a) => !a);
                  setN((x) => x + 1);
                }}
                Icon={all ? EyeOff : Eye}
                strong
              >
                {all ? "Skjul fasit" : "Vis fasit"}
              </PillButton>
            )}
          </div>
        </div>

        <div className="mt-3">{children}</div>

        <AnimatePresence initial={false}>
          {hintOpen && hint && (
            <Collapse key="hint">
              <div className="mt-4 rounded-xl border border-[color-mix(in_oklch,var(--warn)_40%,var(--border))] bg-[color-mix(in_oklch,var(--warn)_8%,var(--card))] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[color-mix(in_oklch,var(--warn)_70%,var(--foreground))]">
                  <Lightbulb className="size-3.5" /> Hint
                </div>
                {hint}
              </div>
            </Collapse>
          )}
          {solOpen && solution && (
            <Collapse key="sol">
              <div className="mt-4 rounded-xl border border-border bg-muted/60 p-3 sm:p-4">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <ListChecks className="size-3.5" /> Løsningsforslag
                </div>
                {solution}
              </div>
            </Collapse>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-3">
          <span className="mr-1 text-xs text-muted-foreground">Hvordan gikk det?</span>
          <StatusButton on={status === "done"} kind="done" onClick={() => setExStatus(id, status === "done" ? null : "done")} />
          <StatusButton on={status === "review"} kind="review" onClick={() => setExStatus(id, status === "review" ? null : "review")} />
        </div>
      </article>
    </ExCtx.Provider>
  );
}

function PillButton({
  children,
  onClick,
  active,
  Icon,
  strong,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  Icon: typeof Eye | ReturnType<typeof glyphIcon>;
  strong?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[0.82rem] font-medium transition active:scale-[0.97] " +
        (strong
          ? active
            ? "border-transparent bg-foreground text-background"
            : "border-transparent bg-chap text-white hover:brightness-110 dark:text-background"
          : active
            ? "border-chap bg-chap-soft text-chap-ink"
            : "border-border bg-card text-foreground/80 hover:bg-muted")
      }
    >
      <Icon className="size-3.5" />
      {children}
    </button>
  );
}

function StatusButton({ on, kind, onClick }: { on: boolean; kind: "done" | "review"; onClick: () => void }) {
  const done = kind === "done";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition active:scale-95 " +
        (on
          ? done
            ? "border-transparent bg-success text-white dark:text-background"
            : "border-transparent bg-warn text-black"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground")
      }
    >
      {done ? <Check className="size-3.5" /> : <RotateCcw className="size-3.5" />}
      {done ? "Fikk det til" : "Må øve mer"}
    </button>
  );
}

function Collapse({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

/** Fasit for én deloppgave (eller hele oppgaven). Kan åpnes enkeltvis eller via «Vis fasit». */
export function AnswerReveal({ children, own, label }: { children: ReactNode; own?: boolean; label?: string }) {
  const { all, n } = useContext(ExCtx);
  const [local, setLocal] = useState<{ open: boolean; n: number }>({ open: false, n: 0 });
  const open = local.n === n ? local.open || all : all;
  return (
    <div className="mt-1.5">
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <Collapse key="a">
            <div className="ex-answer">
              <div className="mb-0.5 flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-wider text-success">
                {label ?? "Fasit"}
                {own && <span className="rounded-full bg-muted px-1.5 py-px text-[0.62rem] font-semibold normal-case tracking-normal text-muted-foreground">eget svar</span>}
                <button type="button" onClick={() => setLocal({ open: false, n })} className="ml-auto text-muted-foreground normal-case tracking-normal hover:text-foreground" aria-label="Skjul fasit">
                  skjul
                </button>
              </div>
              {children}
            </div>
          </Collapse>
        ) : (
          <motion.button
            key="b"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLocal({ open: true, n })}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground transition hover:border-solid hover:border-success hover:text-success"
          >
            <Eye className="size-3" /> {label ?? "Fasit"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
