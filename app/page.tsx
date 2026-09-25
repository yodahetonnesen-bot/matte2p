import Link from "next/link";
import { ArrowRight, ArrowUpRight, Calculator, ChartSpline, CheckCheck, Sigma } from "lucide-react";
import { Glyph } from "@/components/site/glyph";
import { TOOL_COUNT } from "@/lib/tools";
import { CHAPTERS } from "@/lib/chapters";
import { getAllExercises, getExercises } from "@/lib/content";
import { tex } from "@/lib/tex";
import { ChapterProgressRing, ContinueCard } from "@/components/home/client-bits";
import { ScrollHero, type HeroStage } from "@/components/home/scroll-hero";
import { CountUp, Magnetic, Parallax, ScrollLine, ScrollScale, TiltCard } from "@/components/home/fx";
import { CHAPTER_ICONS } from "@/components/site/icons";

const STAGES: HeroStage[] = [
  { tag: "Rette linjer · Stigningstall", title: "Hvor mye øker y når x øker med 1?", formula: tex("a = \\frac{\\Delta y}{\\Delta x},\\qquad y = ax + b") },
  { tag: "Kapittel 1 · Eksponentiell vekst", title: "Samme prosent hver gang – ganger med vekstfaktoren", formula: tex("B\\cdot k^{n},\\qquad k = 1 + \\frac{p}{100}") },
  { tag: "Kapittel 4 · Histogram", title: "Arealet av søyla er frekvensen", formula: tex("\\text{søylehøyde} = \\frac{\\text{frekvens}}{\\text{intervallbredde}}") },
  { tag: "Kapittel 5 · Sentralmål", title: "Gjennomsnittet er balansepunktet, medianen står i midten", formula: tex("\\bar x = \\frac{x_1 + x_2 + \\dots + x_N}{N}") },
];

const FLOATING = [
  { f: "\\text{ny verdi} = \\text{gammel}\\cdot k", cls: "left-[4%] top-[18%]", speed: 0.5 },
  { f: "c^2 = a^2 + b^2", cls: "right-[6%] top-[12%]", speed: -0.35 },
  { f: "\\text{reallønn} = \\text{lønn}\\cdot\\frac{100}{\\text{KPI}}", cls: "left-[10%] bottom-[14%]", speed: -0.6 },
  { f: "V = \\pi r^2 h", cls: "right-[10%] bottom-[20%]", speed: 0.4 },
];

export default function Home() {
  const total = getAllExercises().length;
  const sections = CHAPTERS.reduce((a, c) => a + c.sections.length, 0);

  return (
    <div className="overflow-x-clip">
      {/* HERO – scroll-styrt canvas-film */}
      <ScrollHero stages={STAGES}>
        <p data-depth="1.6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Glyph g="%" className="text-primary" /> Hele 2P-pensumet · {CHAPTERS.length} kapitler · {total} oppgaver med fasit
          </span>
        </p>
        <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.6rem]">
          <span data-depth="1.25" className="block">
            2P-matte, forklart
          </span>
          <span data-depth="0.9" className="block">
            så du <span className="text-shimmer italic">forstår</span> det.
          </span>
        </h1>
        <p data-depth="0.6" className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Tydelige forklaringer, gjennomregnede eksempler, grafer du kan dra i, alle oppgavene med fasit – og trening som retter svarene dine automatisk.
        </p>
        <div data-depth="0.35" className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Link href="/kapittel/1/1-1" className="btn-primary">
              Start med kapittel 1 <ArrowRight className="size-4" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Link href="/trening" className="btn-ghost">
              <Calculator className="size-4" /> Tren med auto-retting
            </Link>
          </Magnetic>
        </div>
        <div data-depth="0.2">
          <ContinueCard />
        </div>
      </ScrollHero>

      {/* TALL */}
      <section className="relative border-y border-border bg-card/60">
        <ScrollScale from={0.96} y={24} className="mx-auto grid max-w-7xl grid-cols-2 divide-border px-4 py-10 sm:px-6 md:grid-cols-4 md:divide-x">
          {[
            { n: CHAPTERS.length, l: "kapitler" },
            { n: sections, l: "delkapitler med teori" },
            { n: total, l: "oppgaver med fasit" },
            { n: TOOL_COUNT, l: "interaktive verktøy" },
          ].map((s) => (
            <div key={s.l} data-fx className="py-2 text-center">
              <CountUp value={s.n} className="font-display text-5xl font-semibold tabular-nums tracking-tight" />
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </ScrollScale>
      </section>

      {/* KAPITLER */}
      <section className="relative mx-auto max-w-7xl px-4 pt-28 sm:px-6">
        <Parallax speed={0.35} className="pointer-events-none absolute -top-6 right-2 select-none">
          <span aria-hidden className="font-display text-[11rem] font-semibold leading-none text-primary opacity-[0.06] sm:text-[16rem]">
            2P
          </span>
        </Parallax>
        <ScrollScale from={0.97} y={30}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Pensum</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Velg et kapittel</h2>
            </div>
            <p className="max-w-md text-muted-foreground">Hvert delkapittel har forklaring, eksempler, regelbokser og oppgaver. Fremgangen din lagres automatisk.</p>
          </div>
        </ScrollScale>
        <ScrollScale className="mt-12 grid gap-5 [perspective:1400px] md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {CHAPTERS.map((c) => {
            const Icon = CHAPTER_ICONS[c.icon];
            const ids = getExercises(c.n).map((e) => e.id);
            return (
              <div key={c.n} data-fx className="h-full">
                <TiltCard className="h-full rounded-3xl" style={{ ["--ch-h" as string]: c.hue }}>
                  <Link
                    href={`/kapittel/${c.n}`}
                    className="lift-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chap"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-chap opacity-10 blur-2xl transition duration-500 group-hover:opacity-25" />
                    <span className="pointer-events-none absolute right-5 top-2 font-display text-[6.5rem] font-semibold leading-none text-chap opacity-[0.08] transition duration-500 group-hover:opacity-[0.16]">
                      {c.n}
                    </span>
                    <span className="relative grid size-12 place-items-center rounded-2xl bg-chap-soft text-chap-ink transition duration-300 group-hover:scale-110 group-hover:bg-chap group-hover:text-white dark:group-hover:text-background">
                      <Icon className="size-6" />
                    </span>
                    <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-chap-ink">Kapittel {c.n}{c.extra ? " · tillegg" : ""}</p>
                    <h3 className="relative mt-1 font-display text-2xl font-semibold leading-tight tracking-tight">{c.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{c.tagline}</p>
                    <div className="relative mt-4 flex flex-wrap gap-1.5">
                      {c.sections.slice(0, 5).map((s) => (
                        <span key={s.id} className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground">
                          {s.short ?? s.title}
                        </span>
                      ))}
                      {c.sections.length > 5 && <span className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground">+{c.sections.length - 5}</span>}
                    </div>
                    <div className="relative mt-auto flex items-center justify-between pt-6">
                      <ChapterProgressRing ids={ids} sections={c.sections.map((s) => s.id)} />
                      <span className="grid size-9 place-items-center rounded-full border border-border transition duration-300 group-hover:border-chap group-hover:bg-chap group-hover:text-white dark:group-hover:text-background">
                        <ArrowUpRight className="size-4 transition duration-300 group-hover:rotate-45" />
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </div>
            );
          })}
        </ScrollScale>
      </section>

      {/* METODE – tidslinje som tegnes mens du scroller */}
      <section className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ScrollScale from={0.97} y={30}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Metode</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Slik får du mest ut av siden</h2>
              <p className="mt-4 max-w-md text-muted-foreground">Fire steg som gjentar seg for hvert tema. Følg dem, så bygger du forståelse – ikke bare pugg.</p>
            </ScrollScale>
          </div>
          <div className="relative pl-10">
            <div aria-hidden className="absolute bottom-4 left-[0.95rem] top-4 w-px bg-border" />
            <ScrollLine className="absolute bottom-4 left-[0.95rem] top-4 w-px bg-gradient-to-b from-primary via-primary to-transparent" />
            <ScrollScale className="space-y-5" from={0.95} y={40} stagger={0.18}>
              {[
                { g: "≔", t: "Les teorien", d: "Hvert tema forklares steg for steg, med regelbokser, gjennomregnede eksempler og tips om vanlige feil." },
                { g: "⇄", t: "Utforsk med figurene", d: "Dra i glidere og punkter – se hvordan vekstfaktorer, diagrammer, sentralmål og formlike figurer endrer seg." },
                { g: "?", t: "Løs oppgaver", d: "Prøv selv med blyant, kalkulator eller regneark. Åpne fasit for hver deloppgave når du er ferdig." },
                { g: "∑", t: "Marker og repeter", d: "Merk «Fikk det til» eller «Må øve mer» – og tren på de svake punktene med automatisk rettede oppgaver." },
              ].map((s, i) => (
                <div key={s.t} data-fx className="relative">
                  <span className="absolute -left-10 top-6 grid size-8 place-items-center rounded-full border border-border bg-background font-display text-sm font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="lift-card flex gap-5 rounded-3xl border border-border bg-card p-6">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-xl font-bold text-primary [font-family:KaTeX_Main,serif]">
                      {s.g}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{s.t}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollScale>
          </div>
        </div>
      </section>

      {/* VERKTØY – bento */}
      <section className="mx-auto max-w-7xl px-4 pt-32 sm:px-6">
        <ScrollScale from={0.97} y={30}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Verktøy</p>
          <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Alt du trenger for å øve</h2>
        </ScrollScale>
        <ScrollScale className="mt-12 grid gap-5 [perspective:1400px] lg:grid-cols-3 lg:grid-rows-2" stagger={0.1}>
          {[
            {
              href: "/trening",
              Icon: Calculator,
              t: "Trening med auto-retting",
              d: "Uendelig mange nye oppgaver: prosent, vekstfaktor, rente og lån, KPI, likninger, statistikk og geometri. Skriv svaret – siden sjekker det.",
              hue: 295,
              big: true,
              demo: tex("12\\,\\%\\ \\text{av}\\ 640\\ \\text{kr} = \\;?"),
            },
            {
              href: "/graftegner",
              Icon: ChartSpline,
              t: "Graftegner",
              d: "Grafer, skjæringspunkter, grafisk løsning av likninger og regresjon på punkter.",
              hue: 200,
            },
            { href: "/formler", Icon: Sigma, t: "Formelsamling", d: "Alle regler og formler fra hele 2P på én side.", hue: 45 },
          ].map((t) => (
            <div key={t.href} data-fx className={t.big ? "lg:col-span-2 lg:row-span-2" : ""}>
              <TiltCard className="h-full rounded-3xl" tilt={t.big ? 4 : 7} style={{ ["--ch-h" as string]: t.hue }}>
                <Link
                  href={t.href}
                  className="lift-card group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-chap-soft to-card p-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chap"
                >
                  <t.Icon className="size-7 text-chap transition duration-300 group-hover:scale-110" />
                  <h3 className={"mt-5 font-display font-semibold tracking-tight " + (t.big ? "text-3xl sm:text-4xl" : "text-2xl")}>{t.t}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{t.d}</p>
                  {t.demo && (
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {["Prosent", "Vekstfaktor", "Rente og lån", "Likninger", "Statistikk", "Geometri"].map((x) => (
                        <span key={x} className="rounded-full border border-border bg-card/70 px-2.5 py-1 text-xs text-muted-foreground">
                          {x}
                        </span>
                      ))}
                    </div>
                  )}
                  {t.demo && (
                    <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card/80 p-5 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="text-lg" dangerouslySetInnerHTML={{ __html: t.demo }} />
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-muted-foreground">76,8 kr</span>
                        <span className="grid size-8 place-items-center rounded-full bg-[oklch(0.72_0.15_150)] text-white">
                          <CheckCheck className="size-4" />
                        </span>
                      </div>
                    </div>
                  )}
                  {t.demo && (
                    <div className="mt-3 grid gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="text-lg" dangerouslySetInnerHTML={{ __html: tex("\\text{vekstfaktor ved } 35\\,\\%\\text{ nedgang} = \\;?") }} />
                      <span className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-sm text-muted-foreground">0,65</span>
                    </div>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1 pt-8 text-sm font-medium text-chap-ink">
                    Åpne <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </TiltCard>
            </div>
          ))}
        </ScrollScale>
      </section>

      {/* AVSLUTNING – parallakse-formler */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6">
        <ScrollScale from={0.92} y={50}>
          <div className="relative overflow-hidden rounded-[2.25rem] bg-[#0b0f1f] px-6 py-24 text-center text-white shadow-[0_40px_120px_-40px_oklch(0.3_0.15_275/0.6)] sm:px-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_0%,oklch(0.45_0.2_280/0.55),transparent)]" />
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgb(150_165_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(150_165_255/0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
            {FLOATING.map((f) => (
              <Parallax key={f.f} speed={f.speed} className={"pointer-events-none absolute hidden md:block " + f.cls}>
                <span className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 backdrop-blur [&_.katex]:text-white/80" dangerouslySetInnerHTML={{ __html: tex(f.f) }} />
              </Parallax>
            ))}
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">Klar for første oppgave?</h2>
              <p className="mx-auto mt-5 max-w-lg text-white/70">Start med prosent og vekstfaktor, eller hopp rett til temaet du trenger mest.</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Magnetic>
                  <Link href="/kapittel/1/1-1" className="btn-primary !bg-white !text-[#0b0f1f]">
                    Start nå <ArrowRight className="size-4" />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <Link href="/formler" className="btn-ghost !border-white/15 !bg-white/5 text-white hover:!bg-white/10">
                    <Sigma className="size-4" /> Se formelsamlingen
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </ScrollScale>
      </section>
    </div>
  );
}
