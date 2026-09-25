import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { glyphIcon } from "@/components/site/glyph";

const ListOrdered = glyphIcon("∑");
const Layers = glyphIcon("∪");
const Compass = glyphIcon("∞");
const NotebookText = glyphIcon("≡");
import { CHAPTERS, getChapterMeta } from "@/lib/chapters";
import { countByCategory, exercisesFor, getChapterText } from "@/lib/content";
import { CHAPTER_ICONS } from "@/components/site/icons";
import { Markup } from "@/components/markup";
import { SectionProgress } from "@/components/site/chapter-nav";
import { Reveal } from "@/components/site/reveal";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ k: String(c.n) }));
}

export async function generateMetadata({ params }: PageProps<"/kapittel/[k]">): Promise<Metadata> {
  const { k } = await params;
  const ch = getChapterMeta(Number(k))!;
  return { title: `Kapittel ${ch.n}: ${ch.title}` };
}

export default async function ChapterPage({ params }: PageProps<"/kapittel/[k]">) {
  const { k } = await params;
  const ch = getChapterMeta(Number(k))!;
  const Icon = CHAPTER_ICONS[ch.icon];
  const counts = countByCategory(ch.n);
  const intro = getChapterText(ch.n, "intro");
  const project = getChapterText(ch.n, "prosjekt");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <header className="relative mt-8 overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-10 sm:px-12 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-grid-paper opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]" />
        <div className="pointer-events-none absolute -right-20 -top-28 size-96 rounded-full bg-chap opacity-20 blur-3xl" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-chap text-white shadow-lg shadow-[color-mix(in_oklch,var(--chap)_35%,transparent)] dark:text-background">
                <Icon className="size-6" />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-chap-ink">Kapittel {ch.n}{ch.extra ? " · tillegg laget for siden" : ""}</span>
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{ch.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{ch.tagline}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-4 backdrop-blur md:w-80">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mål for opplæringen
            </p>
            <ul className="space-y-1.5 text-sm">
              {ch.goals.map((g) => (
                <li key={g} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-chap" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      {intro && (
        <div className="mx-auto mt-10 max-w-3xl">
          <Markup blocks={intro} />
        </div>
      )}

      <h2 className="mt-14 font-display text-2xl font-semibold tracking-tight">Delkapitler</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ch.sections.map((s, i) => {
          const ids = [...exercisesFor(ch.n, { section: s.id, cat: "teori" }), ...exercisesFor(ch.n, { section: s.id, cat: "ovmer" })].map((e) => e.id);
          return (
            <Reveal key={s.id} delay={i * 0.04}>
              <Link
                href={`/kapittel/${ch.n}/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-0.5 hover:border-chap hover:shadow-lg hover:shadow-[color-mix(in_oklch,var(--chap)_12%,transparent)]"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-3xl font-semibold text-chap">{s.id}</span>
                  <ArrowRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-chap" />
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{s.title}</h3>
                <div className="mt-auto pt-5">
                  <SectionProgress ids={ids} />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <h2 className="mt-14 font-display text-2xl font-semibold tracking-tight">Oppgavesamlinger</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "repetisjon", title: "Repetisjonsoppgaver", desc: "Eksamensliknende oppgaver fra hele kapitlet.", n: counts.repetisjon, Icon: ListOrdered },
          { href: "blandet", title: "Blandede oppgaver", desc: "Oppgaver som blander flere temaer – også flervalg og feilsøk.", n: counts.blandet, Icon: Layers },
          { href: "apen", title: "Åpne oppgaver", desc: "Større, utforskende problemer uten fasit-svar.", n: counts.apen, Icon: Compass },
          { href: "../sammendrag", title: "Sammendrag", desc: "Alle regler og formler fra kapitlet samlet.", n: null, Icon: NotebookText },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href.startsWith("..") ? `/kapittel/${ch.n}/sammendrag` : `/kapittel/${ch.n}/oppgaver/${c.href}`}
            className="group rounded-2xl border border-border bg-card p-5 transition hover:border-chap"
          >
            <c.Icon className="size-5 text-chap" />
            <h3 className="mt-3 font-semibold">{c.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            {c.n !== null && <p className="mt-3 text-xs font-medium text-chap-ink">{c.n} oppgaver</p>}
          </Link>
        ))}
      </div>

      {project && (
        <section className="mx-auto mt-16 max-w-3xl">
          <Markup blocks={project} />
        </section>
      )}
    </div>
  );
}
