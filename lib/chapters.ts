export type SectionMeta = { id: string; slug: string; title: string; short?: string };
export type ChapterMeta = {
  n: number;
  title: string;
  tagline: string;
  hue: number; // brukes til aksentfarge (oklch)
  icon: string;
  goals: string[];
  sections: SectionMeta[];
  extra?: boolean; // tilleggskapittel laget for siden (ikke fra læreboka)
};

const s = (id: string, title: string, short?: string): SectionMeta => ({ id, slug: id.replace(".", "-"), title, short });

export const CHAPTERS: ChapterMeta[] = [
  {
    n: 1,
    title: "Prosent",
    tagline: "Prosent, prosentpoeng og vekstfaktor – og hvordan en fast prosentvis endring gir eksponentiell vekst.",
    hue: 262,
    icon: "Percent",
    goals: ["forklare og bruke prosent, prosentpoeng og vekstfaktor til modellering av praktiske situasjoner med digitale verktøy"],
    sections: [
      s("1.1", "Prosentregning"),
      s("1.2", "Prosentpoeng"),
      s("1.3", "Vekstfaktor"),
      s("1.4", "Eksponentiell vekst"),
      s("1.5", "Eksponentiell regresjon", "Regresjon"),
    ],
  },
  {
    n: 2,
    title: "Likninger og ulikheter",
    tagline: "Løs likninger ved regning, grafisk og digitalt – og still opp likninger, likningssett og ulikheter fra tekst.",
    hue: 200,
    icon: "Equal",
    goals: ["utforske strategier for å løse likninger, likningssystemer og ulikheter og argumentere for tenkemåtene sine"],
    sections: [
      s("2.1", "Likninger"),
      s("2.2", "Løse likninger ved regning", "Ved regning"),
      s("2.3", "Uoppstilte likninger", "Tekstoppgaver"),
      s("2.4", "Grafisk løsning av likninger", "Grafisk løsning"),
      s("2.5", "Likningssett"),
      s("2.6", "Ulikheter"),
    ],
  },
  {
    n: 3,
    title: "Økonomi",
    tagline: "Prisindeks og KPI, kroneverdi og reallønn, brutto- og nettolønn, sparing, lån og kredittkort.",
    hue: 150,
    icon: "ChartLine",
    goals: [
      "utforske og forklare sammenhenger mellom prisindeks, kroneverdi, reallønn, nominell lønn og brutto- og nettoinntekt",
      "vurdere valg knyttet til personlig økonomi og reflektere over konsekvenser av å ta opp lån og å bruke kredittkort",
    ],
    sections: [
      s("3.1", "Prisindekser"),
      s("3.2", "Konsumprisindeks", "KPI"),
      s("3.3", "Kroneverdi og reallønn", "Kroneverdi og reallønn"),
      s("3.4", "Bruttolønn og nettolønn", "Lønn og skatt"),
      s("3.5", "Sparing"),
      s("3.6", "Lån"),
      s("3.7", "Kredittkort"),
      s("3.8", "Økonomiske valg"),
    ],
  },
  {
    n: 4,
    title: "Statistikk – analyse og presentasjon",
    tagline: "Les og lag tabeller, søyle-, sektor- og linjediagrammer og histogrammer – og se hvordan diagrammer kan lure deg.",
    hue: 45,
    icon: "ChartColumn",
    goals: ["analysere og presentere funn i datasett fra lokalsamfunn og media"],
    sections: [
      s("4.1", "Lese tabeller og diagrammer", "Lese diagrammer"),
      s("4.2", "Lage søylediagrammer", "Søylediagram"),
      s("4.3", "Lage sektordiagrammer", "Sektordiagram"),
      s("4.4", "Lage linjediagrammer", "Linjediagram"),
      s("4.5", "Forsterke informasjon"),
      s("4.6", "Lage histogrammer", "Histogram"),
    ],
  },
  {
    n: 5,
    title: "Sentralmål og spredningsmål",
    tagline: "Gjennomsnitt, median og typetall, variasjonsbredde og standardavvik – og hvilket mål som passer når.",
    hue: 330,
    icon: "BellCurve",
    goals: ["bruke og vurdere valg av formålstjenlige sentralmål og spredningsmål for statistisk datamateriale"],
    sections: [
      s("5.1", "Gjennomsnitt og typetall", "Gjennomsnitt og typetall"),
      s("5.2", "Median"),
      s("5.3", "Median i frekvenstabell", "Kumulativ frekvens"),
      s("5.4", "Variasjonsbredde og standardavvik", "Standardavvik"),
      s("5.5", "Vurdering av sentralmål og spredningsmål", "Velge riktig mål"),
      s("5.6", "Sentralmål i gruppert materiale", "Gruppert materiale"),
    ],
  },
  {
    n: 6,
    title: "Geometri",
    tagline: "Formlikhet, Pytagoras, målestokk, areal og omkrets, og volum og overflate av prismer, sylindre og kuler.",
    hue: 18,
    icon: "TriangleRight",
    goals: ["utforske og forklare hvordan formlikhet, målestokk og egenskaper ved geometriske figurer kan brukes i beregninger og praktisk arbeid"],
    sections: [
      s("6.1", "Vinkler i formlike figurer", "Vinkler og formlikhet"),
      s("6.2", "Lengder i formlike figurer", "Lengder og formlikhet"),
      s("6.3", "Pytagorassetningen", "Pytagoras"),
      s("6.4", "Målestokk"),
      s("6.5", "Areal og omkrets"),
      s("6.6", "Prisme og sylinder"),
      s("6.7", "Kule"),
    ],
  },
  {
    n: 7,
    title: "Tall, funksjoner og modeller",
    tagline: "Tillegg laget for denne siden: standardform, stigningstall, proporsjonalitet og regresjon med flere modeller.",
    hue: 285,
    icon: "ChartLine",
    extra: true,
    goals: [
      "regne med tall på standardform og bruke dem i praktiske situasjoner",
      "modellere situasjoner knyttet til reelle datasett, presentere resultatene og argumentere for at modellene er gyldige",
    ],
    sections: [
      s("7.1", "Tall på standardform", "Standardform"),
      s("7.2", "Lineære funksjoner og stigningstall", "Stigningstall"),
      s("7.3", "Proporsjonale og omvendt proporsjonale størrelser", "Proporsjonalitet"),
      s("7.4", "Regresjon og modellvalg", "Regresjon"),
    ],
  },
];

export function getChapterMeta(n: number) {
  return CHAPTERS.find((c) => c.n === n);
}

export function findSection(slug: string) {
  for (const c of CHAPTERS) {
    const i = c.sections.findIndex((s) => s.slug === slug);
    if (i >= 0) return { chapter: c, section: c.sections[i], index: i };
  }
  return null;
}

export function chapterColor(hue: number, l = 0.58, c = 0.17) {
  return `oklch(${l} ${c} ${hue})`;
}
