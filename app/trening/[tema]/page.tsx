import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { TOPICS, getTopic } from "@/lib/drills";
import { getChapterMeta } from "@/lib/chapters";
import { DrillRunner } from "@/components/drill/drill";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ tema: t.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/trening/[tema]">): Promise<Metadata> {
  const { tema } = await params;
  return { title: `Trening: ${getTopic(tema)?.title ?? ""}` };
}

export default async function DrillPage({ params }: PageProps<"/trening/[tema]">) {
  const { tema } = await params;
  const topic = getTopic(tema);
  if (!topic) notFound();
  const ch = getChapterMeta(topic.chapter)!;
  const others = TOPICS.filter((t) => t.slug !== topic.slug);
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6" style={{ ["--ch-h" as string]: ch.hue }}>
      <div className="mt-8">
        <Link href="/trening" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Alle treningstemaer
        </Link>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-chap-ink">
          Kapittel {ch.n} · delkapittel {topic.sections}
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight">{topic.title}</h1>
      </div>
      <div className="mt-8">
        <DrillRunner slug={topic.slug} />
      </div>
      <div className="mt-14">
        <p className="mb-3 text-sm font-semibold text-muted-foreground">Andre temaer</p>
        <div className="flex flex-wrap gap-2">
          {others.map((t) => (
            <Link key={t.slug} href={`/trening/${t.slug}`} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition hover:bg-muted">
              {t.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
