import { CHAPTERS } from "@/lib/chapters";
import { getExercises, getTheory } from "@/lib/content";
import { CATEGORY_LABEL } from "@/lib/markup";
import type { Block } from "@/lib/markup";

export const dynamic = "force-static";

function text(blocks: Block[] | null): string {
  if (!blocks) return "";
  const out: string[] = [];
  const walk = (bs: Block[]) => {
    for (const b of bs) {
      if (b.t === "p" || b.t === "h") out.push(b.text);
      else if (b.t === "box") {
        if (b.title) out.push(b.title);
        walk(b.body);
      } else if (b.t === "eks") {
        if (b.title) out.push(b.title);
      } else if (b.t === "ul" || b.t === "ol") out.push(...b.items);
    }
  };
  walk(blocks);
  return out
    .join(" ")
    .replace(/\$[^$]*\$/g, " ")
    .replace(/[*`]/g, "")
    .slice(0, 1500);
}

export function GET() {
  const items = [];
  items.push(
    { kind: "side", title: "Trening", sub: "Autogenererte oppgaver med automatisk retting", href: "/trening", text: "drill øving quiz" },
    { kind: "side", title: "Formelsamling", sub: "Alle sammendrag samlet", href: "/formler", text: "formler regler sammendrag" },
    { kind: "side", title: "Graftegner", sub: "Tegn grafer, finn skjæringspunkter og lag regresjonsmodeller", href: "/graftegner", text: "graf geogebra plot funksjon regresjon skjæring" },
    { kind: "side", title: "Min fremgang", sub: "Løste oppgaver og oppgaver du vil øve mer på", href: "/fremgang", text: "fremgang progresjon" },
  );
  for (const c of CHAPTERS) {
    items.push({ kind: "seksjon", title: `Kapittel ${c.n}: ${c.title}`, sub: c.tagline, href: `/kapittel/${c.n}`, text: c.tagline, hue: c.hue });
    for (const s of c.sections) {
      items.push({
        kind: "seksjon",
        title: `${s.id} ${s.title}`,
        sub: `Kapittel ${c.n} · ${c.title}`,
        href: `/kapittel/${c.n}/${s.slug}`,
        text: text(getTheory(s.slug)),
        hue: c.hue,
      });
    }
    items.push({ kind: "seksjon", title: `Sammendrag kapittel ${c.n}`, sub: c.title, href: `/kapittel/${c.n}/sammendrag`, text: "sammendrag formler", hue: c.hue });
    for (const e of getExercises(c.n)) {
      const onSection = (e.cat === "teori" || e.cat === "ovmer") && e.section;
      const href = onSection
        ? `/kapittel/${c.n}/${e.section!.replace(".", "-")}#oppg-${e.id}`
        : `/kapittel/${c.n}/oppgaver/${e.cat}#oppg-${e.id}`;
      items.push({
        kind: "oppgave",
        title: e.cat === "repetisjon" ? `Repetisjon ${e.num} (kap. ${c.n})` : `Oppgave ${e.num}`,
        sub: `${CATEGORY_LABEL[e.cat]}${e.section ? " · " + e.section : ""} — ${e.search.replace(/\$[^$]*\$/g, "…").slice(0, 90)}`,
        href,
        text: e.search.replace(/\$[^$]*\$/g, " "),
        hue: c.hue,
      });
    }
  }
  return Response.json(items);
}
