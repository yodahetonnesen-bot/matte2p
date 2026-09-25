import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calculator } from "lucide-react";
import { TOPICS } from "@/lib/drills";
import { CHAPTERS } from "@/lib/chapters";
import { inlineHtml } from "@/lib/inline";
import { Reveal } from "@/components/site/reveal";
import { DrillStat } from "@/components/drill/drill-stat";

export const metadata: Metadata = { title: "Trening med automatisk retting" };

export default function TrainingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <header className="relative mt-8 overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-10 sm:px-12">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-60 [mask-image:linear-gradient(to_left,black,transparent_75%)]" />
        <div className="relative">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Calculator className="size-6" />
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Trening med automatisk retting</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Hver gang du trykker «Ny oppgave» lages en ny variant. Skriv svaret ditt – tall, prosent, kroner eller tall på standardform – så sjekker siden det. Står du
            fast, får du hint og fullstendig løsning.
          </p>
        </div>
      </header>

      {CHAPTERS.map((c) => {
        const topics = TOPICS.filter((t) => t.chapter === c.n);
        if (!topics.length) return null;
        return (
          <section key={c.n} className="mt-12" style={{ ["--ch-h" as string]: c.hue }}>
            <h2 className="flex items-baseline gap-3 font-display text-2xl font-semibold">
              <span className="text-chap">{c.n}</span> {c.title}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t, i) => (
                <Reveal key={t.slug} delay={i * 0.04} className="h-full">
                  <Link
                    href={`/trening/${t.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-chap hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{t.title}</h3>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-chap" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: inlineHtml(t.desc) }} />
                    <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                      <span className="rounded-full bg-chap-soft px-2 py-0.5 font-medium text-chap-ink">Delkapittel {t.sections}</span>
                      <DrillStat slug={t.slug} />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
