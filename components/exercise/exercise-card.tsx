import Link from "next/link";
import type { Exercise } from "@/lib/markup";
import { CATEGORY_LABEL } from "@/lib/markup";
import { Markup } from "../markup";
import { AnswerReveal, ExerciseShell } from "./client";

export function ExerciseCard({ ex, showSection = false }: { ex: Exercise; showSection?: boolean }) {
  const hasAnswers = ex.answer.length > 0 || ex.parts.some((p) => p.answer.length > 0);
  const title = ex.cat === "repetisjon" ? `Repetisjon ${ex.num}` : `Oppgave ${ex.num}`;
  const header = (
    <>
      <h3 className="font-display text-lg font-semibold tracking-tight">
        <a href={"#oppg-" + ex.id} className="hover:underline">
          {title}
        </a>
      </h3>
      {ex.cat !== "teori" && ex.cat !== "repetisjon" && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground">{CATEGORY_LABEL[ex.cat]}</span>
      )}
      {showSection && ex.section && (
        <Link
          href={`/kapittel/${ex.chapter}/${ex.section.replace(".", "-")}`}
          className="rounded-full bg-chap-soft px-2 py-0.5 text-[0.7rem] font-semibold text-chap-ink hover:underline"
        >
          {ex.section}
        </Link>
      )}
    </>
  );

  return (
    <ExerciseShell
      id={ex.id}
      header={header}
      hasAnswers={hasAnswers}
      hasHint={ex.hint.length > 0}
      hasSolution={ex.solution.length > 0}
      hint={ex.hint.length ? <Markup blocks={ex.hint} compact /> : undefined}
      solution={ex.solution.length ? <Markup blocks={ex.solution} compact /> : undefined}
    >
      {ex.intro.length > 0 && <Markup blocks={ex.intro} compact />}
      {ex.parts.length > 0 && (
        <ol className="mt-2 space-y-3">
          {ex.parts.map((p) => (
            <li key={p.label} className="grid grid-cols-[1.75rem_1fr] gap-x-1">
              <span className="pt-[0.2rem] font-semibold text-chap-ink">{p.label})</span>
              <div className="min-w-0">
                {p.body.length > 0 && <Markup blocks={p.body} compact />}
                {p.answer.length > 0 && (
                  <AnswerReveal own={p.own}>
                    <Markup blocks={p.answer} compact />
                  </AnswerReveal>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      {ex.answer.length > 0 && (
        <div className="mt-2">
          <AnswerReveal own={ex.own}>
            <Markup blocks={ex.answer} compact />
          </AnswerReveal>
        </div>
      )}
    </ExerciseShell>
  );
}

export function ExerciseList({ list, showSection }: { list: Exercise[]; showSection?: boolean }) {
  if (!list.length) return <p className="text-sm text-muted-foreground">Ingen oppgaver her ennå.</p>;
  return (
    <div className="space-y-4">
      {list.map((ex) => (
        <ExerciseCard key={ex.id} ex={ex} showSection={showSection} />
      ))}
    </div>
  );
}
