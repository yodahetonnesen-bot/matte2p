import Link from "next/link";
import type { Metadata } from "next";
import { Sigma } from "lucide-react";
import { CHAPTERS } from "@/lib/chapters";
import { getChapterText } from "@/lib/content";
import { Markup } from "@/components/markup";

export const metadata: Metadata = { title: "Formelsamling" };

export default function FormulasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <header className="mt-8 rounded-[2rem] border border-border bg-card px-6 py-10 sm:px-12">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Sigma className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Formelsamling 2P</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Alle regler og formler fra kapitlene – samlet på én side. Bruk den til repetisjon før prøver og eksamen.</p>
      </header>
      <div className="grid gap-10 pt-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav className="hidden lg:block" aria-label="Kapitler">
          <ul className="sticky top-24 space-y-1 text-sm">
            {CHAPTERS.map((c) => (
              <li key={c.n} style={{ ["--ch-h" as string]: c.hue }}>
                <a href={`#k${c.n}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                  <span className="grid size-6 place-items-center rounded-md bg-chap-soft text-xs font-semibold text-chap-ink">{c.n}</span>
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 space-y-16">
          {CHAPTERS.map((c) => {
            const blocks = getChapterText(c.n, "sammendrag");
            return (
              <section key={c.n} id={`k${c.n}`} className="scroll-mt-24" style={{ ["--ch-h" as string]: c.hue }}>
                <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
                  <h2 className="font-display text-3xl font-semibold tracking-tight">
                    <span className="text-chap">{c.n}</span> {c.title}
                  </h2>
                  <Link href={`/kapittel/${c.n}`} className="text-sm text-chap-ink hover:underline">
                    Til kapitlet →
                  </Link>
                </div>
                <div className="max-w-3xl">{blocks ? <Markup blocks={blocks} /> : <p className="text-muted-foreground">Kommer snart.</p>}</div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
