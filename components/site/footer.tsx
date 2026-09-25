import Link from "next/link";
import { CHAPTERS } from "@/lib/chapters";
import { LogoMark } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_2fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <span className="font-display text-lg font-semibold">2P Matte</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Øvingsside for matematikk 2P: forklaringer, eksempler, interaktive figurer, oppgaver med fasit og automatisk rettet trening. Fremgangen din lagres
            lokalt i nettleseren.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Snarveier: <kbd className="rounded border border-border bg-card px-1 font-mono">⌘K</kbd> eller{" "}
            <kbd className="rounded border border-border bg-card px-1 font-mono">/</kbd> for søk.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {CHAPTERS.map((c) => (
            <div key={c.n}>
              <Link href={`/kapittel/${c.n}`} className="text-sm font-semibold hover:underline">
                {c.n}. {c.title}
              </Link>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link href={`/kapittel/${c.n}/oppgaver/blandet`} className="text-xs text-muted-foreground hover:text-foreground">
                    Blandede oppgaver
                  </Link>
                </li>
                <li>
                  <Link href={`/kapittel/${c.n}/sammendrag`} className="text-xs text-muted-foreground hover:text-foreground">
                    Sammendrag
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
