import type { Metadata } from "next";
import { CHAPTERS } from "@/lib/chapters";
import { getExercises } from "@/lib/content";
import { ProgressDashboard } from "@/components/site/progress-dashboard";

export const metadata: Metadata = { title: "Min fremgang" };

export default function ProgressPage() {
  const chapters = CHAPTERS.map((c) => ({
    n: c.n,
    title: c.title,
    hue: c.hue,
    sections: c.sections.map((s) => s.id),
    ex: getExercises(c.n).map((e) => ({
      id: e.id,
      title: e.cat === "repetisjon" ? `Repetisjon ${e.num}` : `Oppgave ${e.num}`,
      href:
        (e.cat === "teori" || e.cat === "ovmer") && e.section
          ? `/kapittel/${c.n}/${e.section.replace(".", "-")}#oppg-${e.id}`
          : `/kapittel/${c.n}/oppgaver/${e.cat}#oppg-${e.id}`,
    })),
  }));
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Min fremgang</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Fremgangen lagres bare i denne nettleseren. Marker oppgaver med «Fikk det til» eller «Må øve mer» for å følge med.</p>
      <ProgressDashboard chapters={chapters} />
    </div>
  );
}
