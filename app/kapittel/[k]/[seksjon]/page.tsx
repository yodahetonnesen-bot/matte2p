import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Glyph } from "@/components/site/glyph";
import { CHAPTERS, getChapterMeta } from "@/lib/chapters";
import { exercisesFor, getTheory, headingsOf } from "@/lib/content";
import { Markup } from "@/components/markup";
import { inlineHtml } from "@/lib/inline";
import { ExerciseList } from "@/components/exercise/exercise-card";
import { ChapterSidebar, ReadToggle, RememberVisit, SectionProgress } from "@/components/site/chapter-nav";

export function generateStaticParams() {
  return CHAPTERS.flatMap((c) => c.sections.map((s) => ({ k: String(c.n), seksjon: s.slug })));
}
export const dynamicParams = false;

async function resolve(params: Promise<{ k: string; seksjon: string }>) {
  const { k, seksjon } = await params;
  const ch = getChapterMeta(Number(k));
  const idx = ch?.sections.findIndex((s) => s.slug === seksjon) ?? -1;
  if (!ch || idx < 0) notFound();
  return { ch, sec: ch.sections[idx], idx };
}

export async function generateMetadata({ params }: PageProps<"/kapittel/[k]/[seksjon]">): Promise<Metadata> {
  const { sec } = await resolve(params);
  return { title: `${sec.id} ${sec.title}` };
}

export default async function SectionPage({ params }: PageProps<"/kapittel/[k]/[seksjon]">) {
  const { ch, sec, idx } = await resolve(params);
  const theory = getTheory(sec.slug);
  const teori = exercisesFor(ch.n, { section: sec.id, cat: "teori" });
  const ovmer = exercisesFor(ch.n, { section: sec.id, cat: "ovmer" });
  const heads = headingsOf(theory);

  const prev = idx > 0 ? ch.sections[idx - 1] : null;
  const next = idx < ch.sections.length - 1 ? ch.sections[idx + 1] : null;
  const nextCh = !next ? CHAPTERS.find((c) => c.n === ch.n + 1) : null;
  const href = `/kapittel/${ch.n}/${sec.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <RememberVisit href={href} title={`${sec.id} ${sec.title}`} />
      <div className="grid gap-10 pt-8 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_200px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 pr-2">
            <ChapterSidebar ch={ch} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* hero */}
          <header className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-8 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute inset-0 bg-dots opacity-60 [mask-image:linear-gradient(to_left,black,transparent_70%)]" />
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-chap opacity-[0.13] blur-3xl" />
            <nav className="relative flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground" aria-label="Brødsmuler">
              <Link href="/" className="hover:text-foreground">
                Forside
              </Link>
              <span>/</span>
              <Link href={`/kapittel/${ch.n}`} className="hover:text-foreground">
                Kapittel {ch.n}
              </Link>
              <span>/</span>
              <span className="text-foreground">{sec.id}</span>
            </nav>
            <div className="relative mt-4 flex items-start gap-4">
              <span className="font-display text-5xl font-semibold leading-none text-chap sm:text-6xl">{sec.id}</span>
              <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{sec.title}</h1>
            </div>
            <div className="relative mt-6 flex flex-wrap items-center gap-3">
              <a href="#teori" className="inline-flex items-center gap-2 rounded-full bg-chap px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 dark:text-background">
                <Glyph g="≔" /> Les teorien
              </a>
              <a href="#oppgaver" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted">
                <Glyph g="?" /> Oppgaver ({teori.length + ovmer.length})
              </a>
              <div className="ml-auto">
                <SectionProgress ids={[...teori, ...ovmer].map((e) => e.id)} />
              </div>
            </div>
          </header>

          <article id="teori" className="mx-auto mt-10 max-w-3xl scroll-mt-24">
            {theory ? (
              <Markup blocks={theory} />
            ) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-muted-foreground">Teorien for dette delkapitlet kommer snart.</p>
            )}
            <div className="mt-10 flex justify-center">
              <ReadToggle id={sec.id} />
            </div>
          </article>

          <section id="oppgaver" className="mx-auto mt-16 max-w-3xl scroll-mt-24">
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-3">
              <h2 className="font-display text-3xl font-semibold tracking-tight">Oppgaver</h2>
              <span className="text-sm text-muted-foreground">Prøv selv før du ser på fasit!</span>
            </div>
            {teori.length > 0 && (
              <div id="teoridel" className="scroll-mt-24">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-chap-ink">Fra teoridelen</h3>
                <ExerciseList list={teori} />
              </div>
            )}
            {ovmer.length > 0 && (
              <div id="ov-mer" className="mt-12 scroll-mt-24">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-chap-ink">Øv mer</h3>
                <ExerciseList list={ovmer} />
              </div>
            )}
            {teori.length + ovmer.length === 0 && <p className="text-muted-foreground">Oppgavene for dette delkapitlet kommer snart.</p>}
          </section>

          <nav className="mx-auto mt-16 grid max-w-3xl gap-3 sm:grid-cols-2" aria-label="Neste og forrige">
            {prev ? (
              <Link href={`/kapittel/${ch.n}/${prev.slug}`} className="group rounded-2xl border border-border bg-card p-4 transition hover:border-chap">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" /> Forrige
                </span>
                <span className="mt-1 block font-medium">
                  {prev.id} {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/kapittel/${ch.n}/${next.slug}`} className="group rounded-2xl border border-border bg-card p-4 text-right transition hover:border-chap">
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  Neste <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 block font-medium">
                  {next.id} {next.title}
                </span>
              </Link>
            ) : (
              <Link href={`/kapittel/${ch.n}/oppgaver/repetisjon`} className="group rounded-2xl border border-border bg-card p-4 text-right transition hover:border-chap">
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  Avslutt kapitlet <ArrowRight className="size-3.5" />
                </span>
                <span className="mt-1 block font-medium">Repetisjonsoppgaver{nextCh ? ` – så kapittel ${nextCh.n}` : ""}</span>
              </Link>
            )}
          </nav>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24 text-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">På denne siden</p>
            <ul className="space-y-1.5 border-l border-border">
              {heads.map((h) => (
                <li key={h.id}>
                  <a href={"#" + h.id} className="-ml-px block border-l border-transparent pl-3 text-muted-foreground transition hover:border-chap hover:text-foreground">
                    <span dangerouslySetInnerHTML={{ __html: inlineHtml(h.text) }} />
                  </a>
                </li>
              ))}
              <li>
                <a href="#oppgaver" className="-ml-px block border-l border-transparent pl-3 font-medium text-chap-ink transition hover:border-chap">
                  Oppgaver
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
