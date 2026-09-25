import { notFound } from "next/navigation";
import { CHAPTERS, getChapterMeta } from "@/lib/chapters";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ k: String(c.n) }));
}

export const dynamicParams = false;

export default async function ChapterLayout({ children, params }: LayoutProps<"/kapittel/[k]">) {
  const { k } = await params;
  const ch = getChapterMeta(Number(k));
  if (!ch) notFound();
  return <div style={{ ["--ch-h" as string]: ch.hue }}>{children}</div>;
}
