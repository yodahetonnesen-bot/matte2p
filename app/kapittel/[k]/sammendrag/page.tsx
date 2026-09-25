import Link from "next/link";
import type { Metadata } from "next";
import { getChapterMeta } from "@/lib/chapters";
import { getChapterText } from "@/lib/content";
import { Markup } from "@/components/markup";
import { ChapterSidebar } from "@/components/site/chapter-nav";

export async function generateMetadata({ params }: PageProps<"/kapittel/[k]/sammendrag">): Promise<Metadata> {
  const { k } = await params;
  return { title: `Sammendrag kapittel ${k}` };
}

export default async function SummaryPage({ params }: PageProps<"/kapittel/[k]/sammendrag">) {
  const { k } = await params;
  const ch = getChapterMeta(Number(k))!;
  const blocks = getChapterText(ch.n, "sammendrag");
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid gap-10 pt-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 pb-8 pr-2">
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
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Sammendrag</h1>
            <p className="mt-3 text-muted-foreground">Alle de viktigste reglene og formlene fra kapitlet. Fin å se over før prøven.</p>
          </header>
          <div className="mx-auto mt-10 max-w-3xl">{blocks ? <Markup blocks={blocks} /> : <p>Kommer snart.</p>}</div>
        </div>
      </div>
    </div>
  );
}
