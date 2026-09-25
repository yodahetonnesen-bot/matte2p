import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CHAPTERS, getChapterMeta } from "@/lib/chapters";
import { exercisesFor } from "@/lib/content";
import { CATEGORY_LABEL, type Category } from "@/lib/markup";
import { ExerciseList } from "@/components/exercise/exercise-card";
import { ChapterSidebar, SectionProgress } from "@/components/site/chapter-nav";

const CATS: Category[] = ["teori", "repetisjon", "ovmer", "blandet", "apen"];

const DESC: Record<Category, string> = {
  teori: "Alle oppgavene fra teoridelen samlet på ett sted.",
  repetisjon: "Repetisjonsoppgaver fra hele kapitlet – fin eksamenstrening.",
  ovmer: "Ekstra mengdetrening på de grunnleggende regneteknikkene.",
  blandet:
    "Oppgaver som blander stoff fra flere delkapitler. Merket med delkapitlet du bør ha lest før du løser dem. Noen er flervalg, og noen ber deg vurdere andres løsninger.",
  apen: "Større og mer utforskende oppgaver. Her må du ofte lage egne problemstillinger, programmere eller modellere. Mange har ikke én fasit – diskuter gjerne med andre.",
};

export function generateStaticParams() {
  return CHAPTERS.flatMap((c) => CATS.map((kat) => ({ k: String(c.n), kat })));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/kapittel/[k]/oppgaver/[kat]">): Promise<Metadata> {
  const { k, kat } = await params;
  return { title: `${CATEGORY_LABEL[kat as Category]} – kapittel ${k}` };
}

export default async function CategoryPage({ params }: PageProps<"/kapittel/[k]/oppgaver/[kat]">) {
  const { k, kat } = await params;
  const ch = getChapterMeta(Number(k));
  if (!ch || !CATS.includes(kat as Category)) notFound();
  const cat = kat as Category;
  const list = exercisesFor(ch.n, { cat });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid gap-10 pt-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 pr-2">
            <ChapterSidebar ch={ch} />
          </div>
        </aside>
        <div className="min-w-0">
          <header className="rounded-3xl border border-border bg-card px-6 py-8 sm:px-10">
            <p className="text-sm text-muted-foreground">
              <Link href={`/kapittel/${ch.n}`} className="hover:text-foreground">
                Kapittel {ch.n} · {ch.title}
              </Link>
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{CATEGORY_LABEL[cat]}</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">{DESC[cat]}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {CATS.map((c) => (
                <Link
                  key={c}
                  href={`/kapittel/${ch.n}/oppgaver/${c}`}
                  className={
                    "rounded-full border px-3 py-1 text-sm transition " +
                    (c === cat ? "border-transparent bg-chap text-white dark:text-background" : "border-border hover:bg-muted")
                  }
                >
                  {CATEGORY_LABEL[c]}
                </Link>
              ))}
              <div className="ml-auto">
                <SectionProgress ids={list.map((e) => e.id)} />
              </div>
            </div>
          </header>
          <div className="mx-auto mt-10 max-w-3xl">
            <ExerciseList list={list} showSection />
          </div>
        </div>
      </div>
    </div>
  );
}
