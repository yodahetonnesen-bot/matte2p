// Generatorer for treningsoppgaver i 2P med automatisk retting.
// Hver generator lager en ny, tilfeldig oppgave med fasit og løsningsforslag.
import { KPI } from "./kpi";

export type Answer =
  | { type: "num"; value: number; tol?: number; rel?: boolean; show: string }
  | { type: "expr"; expr: string; v?: string; lo?: number; hi?: number; show: string; strip?: string }
  | { type: "set"; values: number[]; tol?: number; show: string }
  | { type: "vec"; value: [number, number]; tol?: number; show: string }
  | { type: "pair"; labels: [string, string]; value: [number, number]; tol?: number; show: string }
  | { type: "choice"; options: string[]; correct: number; show: string }
  | { type: "sf"; value: number; show: string }; // tall på standardform a·10^n

export type Drill = { q: string; answer: Answer; solution: string; hint?: string };

export type Topic = {
  slug: string;
  title: string;
  chapter: number;
  sections: string;
  desc: string;
  gen: (level: number) => Drill;
};

// ---------- hjelpefunksjoner ----------
const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];
const nz = (a: number, b: number) => {
  let x = 0;
  while (x === 0) x = ri(a, b);
  return x;
};
const round = (x: number, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

/** Norsk tall i TeX: tynt mellomrom som tusenskille (fra 10 000) og {,} som desimalkomma. */
function tn(x: number, d = 2): string {
  const r = round(x, d);
  const neg = r < 0;
  let [i, f] = String(Math.abs(r)).split(".");
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
  return (neg ? "-" : "") + i + (f ? "{,}" + f : "");
}
/** Norsk tall i vanlig tekst. */
function nn(x: number, d = 2): string {
  const r = round(x, d);
  let [i, f] = String(Math.abs(r)).split(".");
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (r < 0 ? "−" : "") + i + (f ? "," + f : "");
}
const par = (x: number) => (x < 0 ? `(${tn(x)})` : tn(x));
const sgnTerm = (x: number, v = "") => (x < 0 ? `- ${tn(-x)}${v}` : `+ ${tn(x)}${v}`);
/** «3x», «x», «-x», «-2x» */
const kx = (k: number, v = "x") => (k === 1 ? v : k === -1 ? `-${v}` : `${tn(k)}${v}`);
function side(k: number, m: number) {
  if (k === 0) return tn(m);
  return m === 0 ? kx(k) : `${kx(k)} ${sgnTerm(m)}`;
}

// ===========================================================================
// Kapittel 1 – Prosent
// ===========================================================================

function prosentAv(level: number): Drill {
  if (level === 1) {
    const [p, B] = pick<[number, number]>([
      [10, pick([80, 150, 250, 320, 460, 1800])],
      [20, pick([150, 250, 320, 450, 800])],
      [50, pick([180, 400, 750, 1250])],
      [25, pick([120, 320, 600, 1000])],
      [75, pick([120, 320, 400, 800])],
      [5, pick([120, 300, 480, 900])],
      [1, pick([350, 800, 1200, 2500])],
      [15, pick([200, 320, 600, 1000])],
    ]);
    const val = (p * B) / 100;
    const way =
      p === 50
        ? `50 % er halvparten, så vi deler på 2: $${tn(B)} : 2 = ${tn(val)}$.`
        : p === 25
          ? `25 % er en firedel, så vi deler på 4: $${tn(B)} : 4 = ${tn(val)}$.`
          : p === 75
            ? `75 % er tre firedeler: $${tn(B)} : 4 = ${tn(B / 4)}$, og $3\\cdot ${tn(B / 4)} = ${tn(val)}$.`
            : p === 10
              ? `10 % er en tidel, så vi deler på 10: $${tn(B)} : 10 = ${tn(val)}$.`
              : p === 20
                ? `10 % er $${tn(B / 10)}$, så 20 % er det dobbelte: $2\\cdot ${tn(B / 10)} = ${tn(val)}$.`
                : p === 5
                  ? `10 % er $${tn(B / 10)}$, og 5 % er halvparten: $${tn(val)}$.`
                  : p === 15
                    ? `10 % er $${tn(B / 10)}$ og 5 % er $${tn(B / 20)}$. Til sammen $${tn(val)}$.`
                    : `1 % er $${tn(B)} : 100 = ${tn(val)}$.`;
    return {
      q: `Regn ut uten hjelpemidler: **${p} % av ${nn(B)} kr**`,
      answer: { type: "num", value: val, tol: 0.001, show: `$${tn(val)}$ kr` },
      solution: way,
      hint: "Bruk kjente brøker: 50 % = en halv, 25 % = en firedel, 10 % = en tidel, 1 % = en hundredel.",
    };
  }
  const p = pick([2.25, 3, 13, 22.4, 1.9, 103, 0.4, 7.5, 36, 12.5, 4.8, 1.579]);
  const B = pick([432, 1530, 3995, 6430, 9582, 4250, 5500, 23500, 235000, 875, 12900]);
  const val = (p * B) / 100;
  return {
    q: `Regn ut ${nn(p, 3)} % av ${nn(B)} kr. Rund av til hele øre (to desimaler).`,
    answer: { type: "num", value: round(val, 2), tol: 0.011, show: `$${tn(val, 2)}$ kr` },
    solution: `$$${tn(p, 3)}\\,\\%\\ \\text{av}\\ ${tn(B)} = \\frac{${tn(p, 3)}}{100}\\cdot ${tn(B)} = ${tn(p / 100, 5)}\\cdot ${tn(B)} = ${tn(val, 2)}$$`,
    hint: "$p\\,\\%$ av et tall $= \\dfrac{p}{100}\\cdot$ tallet.",
  };
}

function finnProsenten(level: number): Drill {
  if (level === 1) {
    const [del, hele, ctx] = pick<[number, number, string]>([
      [18, 30, "I en klasse med 30 elever stemte 18 på Naomi. Hvor mange prosent stemte på Naomi?"],
      [1200, 4800, "Et par ski som kostet 4800 kr, settes ned med 1200 kr. Hvor mange prosent er prisen satt ned med?"],
      [15, 60, "På en prøve er det 60 poeng. Kari fikk 15 poeng. Hvor mange prosent av poengene fikk hun?"],
      [9, 36, "Av 36 elever sykler 9 til skolen. Hvor mange prosent sykler?"],
      [45, 300, "300 personer ble spurt, og 45 svarte «ja». Hvor mange prosent svarte ja?"],
      [140, 200, "Et tog har 200 seter, og 140 er opptatt. Hvor mange prosent av setene er opptatt?"],
      [7, 20, "Av 20 kamper vant laget 7. Hvor mange prosent av kampene vant de?"],
      [60, 480, "Av 480 kr brukte Ola 60 kr på brus. Hvor mange prosent av pengene brukte han på brus?"],
    ]);
    const p = (del / hele) * 100;
    return {
      q: ctx,
      answer: { type: "num", value: p, tol: 0.01, show: `$${tn(p, 1)}\\,\\%$` },
      solution: `Andelen er $\\dfrac{${tn(del)}}{${tn(hele)}}$. Vi gjør om til hundredeler eller ganger med 100 %: $$\\frac{${tn(del)}}{${tn(hele)}}\\cdot 100\\,\\% = ${tn(p, 1)}\\,\\%$$`,
      hint: "Prosenten = $\\dfrac{\\text{delen}}{\\text{det hele}}\\cdot 100\\,\\%$.",
    };
  }
  const hele = pick([3500, 4800, 5900, 2450, 780, 12500, 64000]);
  const del = round(hele * (ri(15, 480) / 1000), 0);
  const p = (del / hele) * 100;
  const ctx = pick([
    `Jenny satte ${nn(hele)} kr i et fond og fikk ${nn(del)} kr i utbytte. Hvor mange prosent tilsvarer utbyttet?`,
    `En vare som kostet ${nn(hele)} kr, ble satt ned med ${nn(del)} kr. Hvor mange prosent ble den satt ned med?`,
    `Et budsjett er på ${nn(hele)} kr. ${nn(del)} kr går til reise. Hvor mange prosent av budsjettet er det?`,
  ]);
  return {
    q: `${ctx} Gi svaret med én desimal.`,
    answer: { type: "num", value: round(p, 1), tol: 0.051, show: `$${tn(p, 1)}\\,\\%$` },
    solution: `$$\\frac{${tn(del)}}{${tn(hele)}}\\cdot 100\\,\\% \\approx ${tn(p, 1)}\\,\\%$$ Vi skriver ikke prosenttegnet når vi regner på kalkulatoren eller i CAS.`,
    hint: "Del delen på det hele, og gang med 100.",
  };
}

function finnDetHele(level: number): Drill {
  if (level === 1) {
    const [p, del, ctx, unit] = pick<[number, number, string, string]>([
      [25, 15, "På en prøve må du ha 25 % riktig for å bestå. 25 % tilsvarer 15 poeng. Hvor mange poeng er det mulig å få?", "poeng"],
      [8, 10, "Sykefraværet i en bedrift er 8 %. Det tilsvarer 10 personer. Hvor mange arbeider i bedriften?", "personer"],
      [20, 7.5, "Teodor jobber 7,5 timer i uka. Det er 20 % av full stilling. Hvor mange timer er en full arbeidsuke?", "timer"],
      [40, 300, "Tove fikk 40 % avslag på en jakke. Avslaget var 300 kr. Hva kostet jakka før salget?", "kr"],
      [15, 30, "15 % av elevene på et trinn går på yrkesfag. Det er 30 elever. Hvor mange elever er det på trinnet?", "elever"],
      [60, 24, "60 % av billettene er solgt. Det er 24 billetter. Hvor mange billetter er det til sammen?", "billetter"],
    ]);
    const hele = (del / p) * 100;
    return {
      q: ctx,
      answer: { type: "num", value: hele, tol: 0.01, show: `$${tn(hele)}$ ${unit}` },
      solution: `Vi går veien om 1 %: $1\\,\\%$ er $\\dfrac{${tn(del)}}{${p}}$, så $100\\,\\%$ er $$\\frac{${tn(del)}}{${p}}\\cdot 100 = ${tn(hele)}$$`,
      hint: "Del på prosenten for å finne 1 %, og gang med 100.",
    };
  }
  const hele = ri(120, 900);
  const p = pick([87, 38.7, 81.7, 62.5, 12.4, 93.2, 4.5]);
  const del = round((hele * p) / 100, 0);
  const val = (del / p) * 100;
  return {
    q: `${nn(p, 1)} % av elevene på en skole stemte ved skolevalget. Det var ${nn(del)} elever. Omtrent hvor mange elever går på skolen? Rund av til et helt tall.`,
    answer: { type: "num", value: Math.round(val), tol: 1.01, show: `ca. $${tn(Math.round(val), 0)}$ elever` },
    solution: `$$\\frac{${tn(del)}}{${tn(p, 1)}}\\cdot 100 \\approx ${tn(val, 1)}$$ Skolen har omtrent ${nn(Math.round(val), 0)} elever.`,
    hint: "Det hele $= \\dfrac{\\text{delen}}{p}\\cdot 100$.",
  };
}

function prosentpoeng(level: number): Drill {
  const a = level === 1 ? pick([4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40]) : pick([1, 1.25, 2.5, 3.2, 6.5, 7.9, 12.5, 16.2, 28]);
  let b = a;
  while (b === a || b <= 0) b = level === 1 ? pick([3, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 35, 36, 45]) : round(a + pick([-1, -0.5, -0.25, 0.25, 0.5, 1, 1.4, 2, -3]), 2);
  const pp = round(b - a, 2);
  const pct = ((b - a) / a) * 100;
  const kind = ri(0, 1);
  const ctx = pick(["Oppslutningen om et parti", "Andelen som sykler til skolen", "Renta på et lån", "Andelen elever med fravær"]);
  if (kind === 0) {
    return {
      q: `${ctx} endrer seg fra ${nn(a)} % til ${nn(b)} %. Hvor mange **prosentpoeng** er endringen? (Bruk minus for nedgang.)`,
      answer: { type: "num", value: pp, tol: 0.001, show: `$${tn(pp)}$ prosentpoeng` },
      solution: `Endringen i prosentpoeng er differansen mellom prosenttallene: $$${tn(b)} - ${tn(a)} = ${tn(pp)}$$`,
      hint: "Prosentpoeng = forskjellen mellom to prosenttall.",
    };
  }
  return {
    q: `${ctx} endrer seg fra ${nn(a)} % til ${nn(b)} %. Hvor mange **prosent** er endringen? Gi svaret med én desimal (minus for nedgang).`,
    answer: { type: "num", value: round(pct, 1), tol: 0.051, show: `$${tn(pct, 1)}\\,\\%$` },
    solution: `Endringen er $${tn(pp)}$ prosentpoeng. Vi sammenlikner med utgangsverdien $${tn(a)}\\,\\%$: $$\\frac{${tn(pp)}}{${tn(a)}}\\cdot 100\\,\\% \\approx ${tn(pct, 1)}\\,\\%$$`,
    hint: "Endring i prosent = $\\dfrac{\\text{endringen}}{\\text{opprinnelig verdi}}\\cdot 100\\,\\%$.",
  };
}

function vekstfaktor(level: number): Drill {
  const kind = ri(0, 2);
  const p = level === 1 ? pick([5, 10, 12, 15, 20, 25, 30, 40, 50, 3, 85, 200]) : pick([1.5, 0.75, 5.5, 7.5, 1.25, 36.5, 2.4, 0.9, 150, 0.5]);
  if (kind === 0 || kind === 1) {
    const up = kind === 0;
    const k = up ? 1 + p / 100 : 1 - p / 100;
    if (!up && p >= 100) return vekstfaktor(level);
    return {
      q: `Finn vekstfaktoren når en størrelse ${up ? "øker" : "minker"} med ${nn(p)} %.`,
      answer: { type: "num", value: k, tol: 1e-9, show: `$${tn(k, 5)}$` },
      solution: `$$${up ? "1 + " : "1 - "}\\frac{${tn(p)}}{100} = 1 ${up ? "+" : "-"} ${tn(p / 100, 5)} = ${tn(k, 5)}$$`,
      hint: up ? "Vekstfaktoren ved $p\\,\\%$ økning er $1 + \\dfrac{p}{100}$." : "Vekstfaktoren ved $p\\,\\%$ nedgang er $1 - \\dfrac{p}{100}$.",
    };
  }
  const k = pick(level === 1 ? [1.25, 1.15, 0.72, 0.88, 1.05, 0.95, 2, 0.6, 1.3] : [1.0205, 0.985, 0.9275, 2.15, 1.125, 0.14, 1.003, 0.97]);
  const ch = round((k - 1) * 100, 3);
  return {
    q: `Vekstfaktoren er $${tn(k, 4)}$. Hva er den prosentvise endringen? Skriv minus for nedgang.`,
    answer: { type: "num", value: ch, tol: 0.001, show: `$${ch > 0 ? "+" : ""}${tn(ch, 3)}\\,\\%$ (${ch > 0 ? "økning" : "nedgang"})` },
    solution: `$${tn(k, 4)}\\cdot 100\\,\\% = ${tn(k * 100, 2)}\\,\\%$. Sammenliknet med 100 % er dette en ${ch > 0 ? "økning" : "nedgang"} på $${tn(Math.abs(ch), 3)}\\,\\%$.`,
    hint: "Er vekstfaktoren større enn 1, er det økning. Er den mellom 0 og 1, er det nedgang.",
  };
}

function nyVerdi(level: number): Drill {
  const kind = ri(0, 2);
  if (kind === 0) {
    const [B, p, up, ctx] = pick<[number, number, boolean, string]>([
      [30, 20, false, "En kanelbolle koster 30 kr. Prisen settes ned med 20 %."],
      [400, 20, true, "Et treningsabonnement koster 400 kr. Prisen settes opp med 20 %."],
      [220, 10, true, "En kafé selger 220 boller om dagen. Salget øker med 10 %."],
      [5900, 15, false, "En spillkonsoll koster 5900 kr og settes ned med 15 %."],
      [650, 8, true, "Et månedskort koster 650 kr og settes opp med 8 %."],
      [1250, 35, false, "En sykkelhjelm koster 1250 kr og settes ned med 35 %."],
    ]);
    const k = up ? 1 + p / 100 : 1 - p / 100;
    const v = B * k;
    return {
      q: `${ctx} Finn den nye verdien.`,
      answer: { type: "num", value: v, tol: 0.011, show: `$${tn(v)}$` },
      solution: `Vekstfaktoren er $${tn(k, 4)}$. $$\\text{ny verdi} = ${tn(B)}\\cdot ${tn(k, 4)} = ${tn(v)}$$`,
      hint: "Ny verdi = opprinnelig verdi · vekstfaktor.",
    };
  }
  if (kind === 1) {
    const [ny, p, up, ctx] = pick<[number, number, boolean, string]>([
      [455, 35, false, "En vare er satt ned med 35 %. Den nye prisen er 455 kr. Hva kostet varen før?"],
      [4.5, 40, true, "Katten Båtsmann veier 4,5 kg. Vekten har økt med 40 % siden året før. Hva veide han året før?"],
      [525, 30, false, "Etter 30 % rabatt koster ei bukse 525 kr. Hva kostet den før rabatten?"],
      [184, 15, true, "Timelønna er 184 kr etter en økning på 15 %. Hva var timelønna før?"],
      [7600, 5, false, "Folketallet i en kommune har sunket med 5 % til 7600. Hva var folketallet før?"],
      [2430, 8, true, "Ei jakke har gått opp 8 % i pris til 2430 kr. Hva kostet den før?"],
    ]);
    const k = up ? 1 + p / 100 : 1 - p / 100;
    const v = ny / k;
    return {
      q: ctx,
      answer: { type: "num", value: v, tol: 0.011, show: `$${tn(v)}$` },
      solution: `Vekstfaktoren er $${tn(k, 4)}$. $$\\text{opprinnelig verdi} = \\frac{\\text{ny verdi}}{\\text{vekstfaktor}} = \\frac{${tn(ny)}}{${tn(k, 4)}} = ${tn(v)}$$`,
      hint: "Opprinnelig verdi = ny verdi : vekstfaktor. Ikke trekk fra prosenten av den nye verdien!",
    };
  }
  const [a, b] = level === 1 ? pick<[number, number]>([[160, 184], [400, 480], [60, 54], [5900, 4500], [8000, 7600], [7600, 7980], [250, 300]]) : [ri(200, 900), 0];
  const B2 = level === 1 ? b : round(a * (1 + pick([-0.27, -0.12, 0.035, 0.18, 0.42, -0.064])), 0);
  const k = B2 / a;
  const ch = (k - 1) * 100;
  return {
    q: `En størrelse endrer seg fra ${nn(a)} til ${nn(B2)}. Hvor mange prosent er endringen? Gi svaret med én desimal (minus for nedgang).`,
    answer: { type: "num", value: round(ch, 1), tol: 0.051, show: `$${tn(ch, 1)}\\,\\%$` },
    solution: `$$\\text{vekstfaktor} = \\frac{\\text{ny verdi}}{\\text{opprinnelig verdi}} = \\frac{${tn(B2)}}{${tn(a)}} \\approx ${tn(k, 4)}$$ Det gir en ${ch >= 0 ? "økning" : "nedgang"} på ${nn(Math.abs(ch), 1)} %.`,
    hint: "Finn vekstfaktoren først: ny verdi delt på opprinnelig verdi.",
  };
}

function eksponentiell(level: number): Drill {
  const kind = level === 1 ? ri(0, 2) : ri(0, 3);
  const B = pick([5000, 15000, 800, 50, 12, 2.1, 30000, 4.6]);
  const p = pick([2, 5, 7, 10, 12, 20, 1.5, 50]);
  const up = kind === 1 ? Math.random() < 0.5 : B < 100 ? Math.random() < 0.5 : Math.random() < 0.6;
  const k = up ? 1 + p / 100 : 1 - p / 100;
  const n = ri(2, 12);
  if (kind === 0) {
    const v = B * k ** n;
    return {
      q: `En størrelse er ${nn(B)} og ${up ? "øker" : "minker"} med ${nn(p)} % per år. Hva er størrelsen etter ${n} år? Gi svaret med to desimaler.`,
      answer: { type: "num", value: round(v, 2), rel: true, tol: 0.0005, show: `$${tn(v, 2)}$` },
      solution: `Vekstfaktoren er $${tn(k, 3)}$. $$${tn(B)}\\cdot ${tn(k, 3)}^{${n}} \\approx ${tn(v, 2)}$$`,
      hint: "Verdien etter $n$ perioder er opprinnelig verdi $\\cdot$ vekstfaktor$^n$.",
    };
  }
  if (kind === 1) {
    const v = B * k ** -n;
    return {
      q: `I dag er en størrelse ${nn(B)}. Den har ${up ? "økt" : "minket"} med ${nn(p)} % hvert år. Hva var størrelsen for ${n} år siden? Gi svaret med to desimaler.`,
      answer: { type: "num", value: round(v, 2), rel: true, tol: 0.0005, show: `$${tn(v, 2)}$` },
      solution: `Vi regner bakover i tid med negativ eksponent: $$${tn(B)}\\cdot ${tn(k, 3)}^{-${n}} \\approx ${tn(v, 2)}$$`,
      hint: "Bruk $n = -${n}$ i formelen, eller del på vekstfaktoren ${n} ganger.",
    };
  }
  if (kind === 2) {
    const tot = (k ** n - 1) * 100;
    return {
      q: `En pris ${up ? "øker" : "synker"} med ${nn(p)} % hvert år i ${n} år. Hvor mange prosent har prisen ${up ? "økt" : "sunket"} med til sammen? Gi svaret med én desimal.`,
      answer: { type: "num", value: round(Math.abs(tot), 1), tol: 0.051, show: `$${tn(Math.abs(tot), 1)}\\,\\%$` },
      solution: `Samlet vekstfaktor: $$${tn(k, 3)}^{${n}} \\approx ${tn(k ** n, 4)}$$ Det er en ${up ? "økning" : "nedgang"} på ${nn(Math.abs(tot), 1)} %. Legg merke til at svaret ikke er $${n}\\cdot ${tn(p)}\\,\\% = ${tn(n * p)}\\,\\%$.`,
      hint: "Opphøy vekstfaktoren i antall år, og gjør om til prosentvis endring.",
    };
  }
  // hvor lang tid før et mål nås
  const kk = 1 + pick([2, 3, 5, 8, 10, 15, 20]) / 100;
  const factor = pick([1.5, 2, 3]);
  let t = 0;
  while (kk ** t < factor) t++;
  return {
    q: `Et beløp vokser med ${nn((kk - 1) * 100)} % per år. Hvor mange hele år tar det før beløpet er minst ${nn(factor, 1)} ganger så stort?`,
    answer: { type: "num", value: t, tol: 0, show: `$${t}$ år` },
    solution: `Vi prøver oss fram (eller løser $${tn(kk, 2)}^x = ${tn(factor, 1)}$ i CAS): $${tn(kk, 2)}^{${t - 1}} \\approx ${tn(kk ** (t - 1), 3)}$ og $${tn(kk, 2)}^{${t}} \\approx ${tn(kk ** t, 3)}$. Etter ${t} år er beløpet minst ${nn(factor, 1)} ganger så stort.`,
    hint: "Regn ut vekstfaktoren opphøyd i 1, 2, 3, … til du passerer målet.",
  };
}

// ===========================================================================
// Kapittel 2 – Likninger og ulikheter
// ===========================================================================

function likning(level: number): Drill {
  const x = nz(-9, 9);
  if (level === 1) {
    let a = nz(-6, 9),
      c = nz(-6, 9);
    while (a === c) c = nz(-6, 9);
    const b = ri(-12, 12);
    const d = a * x + b - c * x;
    return {
      q: `Løs likningen $$${side(a, b)} = ${side(c, d)}$$`,
      answer: { type: "num", value: x, show: `$x = ${x}$` },
      solution: `Samle $x$-leddene på venstre side og tallene på høyre side (bytt fortegn når et ledd flyttes): $$${kx(a)} ${sgnTerm(-c, "x")} = ${tn(d)} ${sgnTerm(-b)}$$ $$${kx(a - c)} = ${tn(d - b)}$$ $$x = \\frac{${tn(d - b)}}{${tn(a - c)}} = ${x}$$ Prøve: V.S. $= ${tn(a * x + b)}$ og H.S. $= ${tn(c * x + d)}$.`,
      hint: "Flytt ledd over likhetstegnet og skift fortegn. Del til slutt på tallet foran $x$.",
    };
  }
  const kind = ri(0, 1);
  if (kind === 0) {
    // a(x + b) - c = d(x - e)
    const a = nz(2, 5),
      b = ri(-5, 5),
      e = ri(-5, 5);
    let d = nz(1, 6);
    while (d === a) d = nz(1, 6);
    const c = a * (x + b) - d * (x - e);
    return {
      q: `Løs likningen $$${a}(x ${sgnTerm(b)}) ${sgnTerm(-c)} = ${d === 1 ? "" : d}(x ${sgnTerm(-e)})$$`,
      answer: { type: "num", value: x, show: `$x = ${x}$` },
      solution: `Løs opp parentesene: $$${kx(a)} ${sgnTerm(a * b)} ${sgnTerm(-c)} = ${kx(d)} ${sgnTerm(-d * e)}$$ $$${kx(a - d)} = ${tn(-d * e - a * b + c)}$$ $$x = ${x}$$`,
      hint: "Løs opp parentesene først, og samle så leddene.",
    };
  }
  // x/p + q = x/r + s med heltallig løsning
  const [p, r] = pick<[number, number]>([
    [2, 3],
    [3, 4],
    [2, 5],
    [4, 6],
    [3, 6],
  ]);
  const X = x * p * r;
  const q = ri(-6, 6);
  const s = X / p + q - X / r;
  const L = (p * r) / gcd(p, r);
  return {
    q: `Løs likningen $$\\frac{x}{${p}} ${sgnTerm(q)} = \\frac{x}{${r}} ${sgnTerm(s)}$$`,
    answer: { type: "num", value: X, show: `$x = ${X}$` },
    solution: `Gang alle ledd med fellesnevneren ${L}: $$${L / p}x ${sgnTerm(L * q)} = ${L / r}x ${sgnTerm(L * s)}$$ $$${L / p - L / r}x = ${tn(L * s - L * q)}$$ $$x = ${X}$$`,
    hint: "Gang med fellesnevneren til brøkene, så forsvinner brøkene.",
  };
}
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function likningssett(level: number): Drill {
  const x = nz(-6, 6),
    y = nz(-6, 6);
  let a1 = nz(-4, 5),
    b1 = nz(-4, 5),
    a2 = nz(-4, 5),
    b2 = nz(-4, 5);
  if (level === 1) {
    a1 = 1;
    b1 = pick([1, -1, 2]);
  }
  while (a1 * b2 - a2 * b1 === 0) b2 = nz(-4, 5);
  const c1 = a1 * x + b1 * y,
    c2 = a2 * x + b2 * y;
  const e1 = `${kx(a1)} ${b1 < 0 ? "-" : "+"} ${Math.abs(b1) === 1 ? "" : Math.abs(b1)}y = ${c1}`;
  const e2 = `${kx(a2)} ${b2 < 0 ? "-" : "+"} ${Math.abs(b2) === 1 ? "" : Math.abs(b2)}y = ${c2}`;
  return {
    q: `Løs likningssettet $$\\begin{aligned} ${e1} \\\\ ${e2} \\end{aligned}$$ Skriv $x$ og $y$.`,
    answer: { type: "pair", labels: ["x =", "y ="], value: [x, y], show: `$x = ${x}$ og $y = ${y}$` },
    solution:
      a1 === 1
        ? `Innsettingsmetoden: fra første likning er $x = ${tn(c1)} ${sgnTerm(-b1, "y")}$. Sett inn i den andre: $$${a2}(${tn(c1)} ${sgnTerm(-b1, "y")}) ${b2 < 0 ? "-" : "+"} ${Math.abs(b2)}y = ${c2}$$ Det gir $y = ${y}$, og da er $x = ${tn(c1)} ${sgnTerm(-b1 * y)} = ${x}$.`
        : `Addisjonsmetoden: gang første likning med $${tn(a2)}$ og andre med $${tn(-a1)}$, og legg sammen, så forsvinner $x$: $$(${a2 * b1} ${sgnTerm(-a1 * b2)})y = ${a2 * c1 - a1 * c2}$$ Det gir $y = ${y}$. Sett inn i en av likningene: $x = ${x}$.`,
    hint: "Bruk innsettingsmetoden eller addisjonsmetoden. Sett prøve i begge likningene til slutt.",
  };
}

function ulikhet(level: number): Drill {
  const t = nz(-6, 6);
  let a = nz(-6, 6),
    c = nz(-6, 6);
  while (a === c) c = nz(-6, 6);
  const b = ri(-10, 10);
  const d = (a - c) * t + b;
  const op = pick(["<", ">", "\\leq", "\\geq"]);
  const flip = a - c < 0;
  const flipOp: Record<string, string> = { "<": ">", ">": "<", "\\leq": "\\geq", "\\geq": "\\leq" };
  const res = flip ? flipOp[op] : op;
  const opTxt = (o: string) => o.replace("\\leq", "≤").replace("\\geq", "≥");
  const correct = `x ${opTxt(res)} ${t}`;
  const wrong = [`x ${opTxt(flipOp[res])} ${t}`, `x ${opTxt(res)} ${-t}`, `x ${opTxt(flipOp[res])} ${-t}`];
  const options = [correct, ...wrong].sort(() => Math.random() - 0.5);
  void level;
  return {
    q: `Løs ulikheten $$${side(a, b)} ${op} ${side(c, d)}$$`,
    answer: { type: "choice", options, correct: options.indexOf(correct), show: `$x ${res} ${t}$` },
    solution: `Samle leddene: $$${kx(a - c)} ${op} ${tn(d - b)}$$ Vi deler på $${tn(a - c)}$.${flip ? " Tallet er negativt, så vi **snur ulikhetstegnet**." : ""} $$x ${res} ${t}$$`,
    hint: "Løs som en likning, men snu ulikhetstegnet hvis du ganger eller deler med et negativt tall.",
  };
}

function tekstoppgave(level: number): Drill {
  const kind = ri(0, 3);
  if (kind === 0) {
    const small = ri(3, 40),
      diff = ri(2, 30);
    const S = 2 * small + diff;
    return {
      q: `Summen av to tall er ${S}, og differansen mellom dem er ${diff}. Hva er det **største** tallet?`,
      answer: { type: "num", value: small + diff, show: `$${small + diff}$ (tallene er ${small} og ${small + diff})` },
      solution: `La det minste tallet være $x$. Da er det største $x + ${diff}$: $$x + (x + ${diff}) = ${S}$$ $$2x = ${S - diff} \\Rightarrow x = ${small}$$ Det største tallet er $${small} + ${diff} = ${small + diff}$.`,
      hint: "Kall det minste tallet $x$ og uttrykk det største ved hjelp av $x$.",
    };
  }
  if (kind === 1) {
    const x = ri(4, 15),
      k = pick([2, 3, 4]),
      m = ri(5, 20);
    const tot = x + (x + m) + k * x;
    return {
      q: `Tre elever stilte til valg. Guri fikk ${m} stemmer mer enn Sveinung, og Abid fikk ${k === 2 ? "dobbelt" : k === 3 ? "tre ganger" : "fire ganger"} så mange som Sveinung. Til sammen fikk de ${tot} stemmer. Hvor mange stemmer fikk Sveinung?`,
      answer: { type: "num", value: x, show: `$${x}$ stemmer` },
      solution: `La Sveinungs stemmer være $x$: $$x + (x + ${m}) + ${k}x = ${tot}$$ $$${k + 2}x = ${tot - m} \\Rightarrow x = ${x}$$`,
      hint: "La $x$ være stemmene til den som de andre sammenliknes med.",
    };
  }
  if (kind === 2) {
    const s1 = pick([300, 250, 360, 270]),
      p1 = pick([5, 4, 2, 3.8]);
    const p2 = p1 + pick([10, 6, 8, 1.8]);
    const km = pick([12, 15, 20, 24, 30, 50]);
    const s2 = round(s1 + p1 * km - p2 * km, 2);
    if (s2 <= 0) return tekstoppgave(level);
    return {
      q: `Tilbud A koster ${nn(s1)} kr i fastpris og ${nn(p1)} kr per km. Tilbud B koster ${nn(s2)} kr i fastpris og ${nn(p2)} kr per km. Hvor mange kilometer må turen være for at tilbudene skal koste like mye?`,
      answer: { type: "num", value: km, tol: 0.01, show: `$${km}$ km` },
      solution: `$$${tn(p1)}x + ${tn(s1)} = ${tn(p2)}x + ${tn(s2)}$$ $$${tn(s1 - s2)} = ${tn(p2 - p1)}x \\Rightarrow x = ${km}$$ Grafisk: $x$-koordinaten til skjæringspunktet mellom linjene.`,
      hint: "Sett opp et uttrykk for prisen for hvert tilbud, og sett dem like hverandre.",
    };
  }
  const g = ri(8, 20);
  const age = 3 * g;
  const other = age - 4;
  const tot = g + age + other;
  return {
    q: `Lise og Henrik er foreldrene til Grete. Til sammen er de ${tot} år. Lise er 4 år yngre enn Henrik, og Henrik er akkurat tre ganger så gammel som Grete. Hvor gammel er Grete?`,
    answer: { type: "num", value: g, show: `$${g}$ år` },
    solution: `La Grete være $x$ år. Da er Henrik $3x$ og Lise $3x - 4$: $$x + 3x + (3x - 4) = ${tot}$$ $$7x = ${tot + 4} \\Rightarrow x = ${g}$$`,
    hint: "La $x$ være alderen til den yngste, og uttrykk de andre med $x$.",
  };
}

// ===========================================================================
// Kapittel 3 – Økonomi
// ===========================================================================

const years = Object.keys(KPI).map(Number).filter((y) => y >= 2000);

function indeks(level: number): Drill {
  const kind = ri(0, 2);
  if (kind === 0) {
    let y1 = pick(years),
      y2 = pick(years);
    while (y1 === y2) y2 = pick(years);
    const pris = pick([449, 899, 1250, 3500, 60, 15.7, 250, 12900]);
    const v = (pris / KPI[y1]) * KPI[y2];
    return {
      q: `En vare kostet ${nn(pris)} kr i ${y1}. Hva ville den kostet i ${y2} hvis prisen fulgte konsumprisindeksen? KPI var ${nn(KPI[y1], 1)} i ${y1} og ${nn(KPI[y2], 1)} i ${y2}. Gi svaret med to desimaler.`,
      answer: { type: "num", value: round(v, 2), tol: 0.011, show: `$${tn(v, 2)}$ kr` },
      solution: `Pris og indeks er proporsjonale: $$\\frac{x}{${tn(KPI[y2], 1)}} = \\frac{${tn(pris)}}{${tn(KPI[y1], 1)}} \\Rightarrow x = \\frac{${tn(pris)}\\cdot ${tn(KPI[y2], 1)}}{${tn(KPI[y1], 1)}} \\approx ${tn(v, 2)}$$`,
      hint: "$\\dfrac{\\text{pris}}{\\text{indeks}}$ er den samme for begge årene.",
    };
  }
  if (kind === 1) {
    const p0 = pick([15.7, 2414, 55122, 125, 13.96, 463799]);
    const p1 = round(p0 * (1 + pick([0.108, -0.281, 0.063, 0.12, 0.059, 0.108])), p0 < 100 ? 2 : 0);
    const ind = (p1 / p0) * 100;
    return {
      q: `En vare kostet ${nn(p0)} kr i basisåret 2015 og ${nn(p1)} kr i 2020. Finn prisindeksen for varen i 2020 (2015 = 100). Gi svaret med én desimal.`,
      answer: { type: "num", value: round(ind, 1), tol: 0.051, show: `$${tn(ind, 1)}$` },
      solution: `$$\\frac{x}{${tn(p1)}} = \\frac{100}{${tn(p0)}} \\Rightarrow x = \\frac{100\\cdot ${tn(p1)}}{${tn(p0)}} \\approx ${tn(ind, 1)}$$`,
      hint: "I basisåret er indeksen 100.",
    };
  }
  let i1 = pick([75.5, 93.9, 92.1, 97.9, 88.0, 108.4]),
    i2 = pick([103.6, 110.8, 112.2, 105.5, 108.4]);
  if (i1 === i2) i1 = 93.9;
  const ch = (i2 / i1 - 1) * 100;
  void level;
  return {
    q: `KPI steg fra ${nn(i1, 1)} til ${nn(i2, 1)}. Hvor mange prosent steg prisnivået? Gi svaret med én desimal.`,
    answer: { type: "num", value: round(ch, 1), tol: 0.051, show: `$${tn(ch, 1)}\\,\\%$` },
    solution: `$$\\text{vekstfaktor} = \\frac{${tn(i2, 1)}}{${tn(i1, 1)}} \\approx ${tn(i2 / i1, 4)}$$ Prisnivået steg med ${nn(ch, 1)} %. (Det er feil å regne $${tn(i2, 1)} - ${tn(i1, 1)}$ – det gir endringen i indekspoeng, ikke i prosent.)`,
    hint: "Del den nye indeksen på den gamle for å finne vekstfaktoren.",
  };
}

function kroneverdi(level: number): Drill {
  const kind = ri(0, 2);
  const y = pick(years.filter((q) => q !== 2015));
  if (kind === 0) {
    const kv = 100 / KPI[y];
    return {
      q: `KPI var ${nn(KPI[y], 1)} i ${y}. Finn kroneverdien i ${y} med fire desimaler.`,
      answer: { type: "num", value: round(kv, 4), tol: 0.00011, show: `$${tn(kv, 4)}$` },
      solution: `$$\\text{kroneverdien} = \\frac{100}{\\text{KPI}} = \\frac{100}{${tn(KPI[y], 1)}} \\approx ${tn(kv, 4)}$$`,
      hint: "Kroneverdi = 100 / KPI.",
    };
  }
  const lonn = pick([405000, 420000, 470500, 520000, 584000, 350000, 610000]);
  if (kind === 1) {
    const real = (lonn * 100) / KPI[y];
    return {
      q: `Nominell lønn i ${y} var ${nn(lonn)} kr, og KPI var ${nn(KPI[y], 1)}. Finn reallønna (i 2015-kroner). Rund av til hele kroner.`,
      answer: { type: "num", value: Math.round(real), tol: 60, show: `ca. $${tn(Math.round(real), 0)}$ kr` },
      solution: `$$\\text{reallønn} = \\text{nominell lønn}\\cdot\\frac{100}{\\text{KPI}} = ${tn(lonn)}\\cdot\\frac{100}{${tn(KPI[y], 1)}} \\approx ${tn(real, 0)}\\ \\text{kr}$$ (Regner du med avrundet kroneverdi, kan svaret avvike litt.)`,
      hint: "Reallønn = nominell lønn · kroneverdi.",
    };
  }
  let y2 = pick(years);
  while (y2 === y) y2 = pick(years);
  const v = (lonn / KPI[y]) * KPI[y2];
  void level;
  return {
    q: `Petter tjente ${nn(lonn)} kr i ${y}. Hvor mye måtte han tjene i ${y2} for å ha samme kjøpekraft? KPI: ${nn(KPI[y], 1)} (${y}) og ${nn(KPI[y2], 1)} (${y2}). Rund av til hele kroner.`,
    answer: { type: "num", value: Math.round(v), tol: 60, show: `ca. $${tn(Math.round(v), 0)}$ kr` },
    solution: `Samme reallønn betyr at lønn/KPI er den samme: $$x = ${tn(lonn)}\\cdot\\frac{${tn(KPI[y2], 1)}}{${tn(KPI[y], 1)}} \\approx ${tn(v, 0)}\\ \\text{kr}$$`,
    hint: "Lønna må endre seg med samme vekstfaktor som KPI.",
  };
}

function renteDrill(level: number): Drill {
  const kind = level === 1 ? ri(0, 1) : ri(0, 3);
  if (kind === 0) {
    const B = pick([10000, 40000, 5000, 20000, 100000, 60000]);
    const p = pick([0.25, 1, 1.5, 2, 2.8, 0.4, 3.5]);
    const n = ri(2, 20);
    const v = B * (1 + p / 100) ** n;
    return {
      q: `${nn(B)} kr settes i banken til ${nn(p)} % rente per år. Hvor mye står det på kontoen etter ${n} år? Rund av til hele kroner.`,
      answer: { type: "num", value: Math.round(v), tol: 1.01, show: `$${tn(Math.round(v), 0)}$ kr` },
      solution: `$$${tn(B)}\\cdot ${tn(1 + p / 100, 4)}^{${n}} \\approx ${tn(v, 2)}\\ \\text{kr}$$`,
      hint: "Beløpet etter $n$ år er $B\\cdot k^n$.",
    };
  }
  if (kind === 1) {
    const B = pick([5500, 235000, 12000, 80000]);
    const p = pick([2.25, 1.579, 3, 4.5, 1.2]);
    const r = (B * p) / 100;
    return {
      q: `Hvor mange kroner i rente gir ${nn(B)} kr med ${nn(p, 3)} % rente i ett år? Svar med to desimaler.`,
      answer: { type: "num", value: round(r, 2), tol: 0.011, show: `$${tn(r, 2)}$ kr` },
      solution: `$$\\frac{${tn(p, 3)}}{100}\\cdot ${tn(B)} = ${tn(r, 2)}\\ \\text{kr}$$`,
      hint: "Renta er $p\\,\\%$ av beløpet.",
    };
  }
  if (kind === 2) {
    const pm = pick([1.2, 1.5, 1.7, 1.8, 2, 2.4, 0.7, 1.3, 1.75]);
    const a = ((1 + pm / 100) ** 12 - 1) * 100;
    return {
      q: `Et kredittkort har ${nn(pm)} % rente per måned. Hvor stor er den årlige renta? Gi svaret med to desimaler.`,
      answer: { type: "num", value: round(a, 2), tol: 0.011, show: `$${tn(a, 2)}\\,\\%$` },
      solution: `Årlig vekstfaktor: $$${tn(1 + pm / 100, 4)}^{12} \\approx ${tn((1 + pm / 100) ** 12, 4)}$$ Den årlige renta er ${nn(a, 2)} % – mye mer enn $12\\cdot ${tn(pm)}\\,\\% = ${tn(12 * pm)}\\,\\%$.`,
      hint: "Opphøy den månedlige vekstfaktoren i 12.",
    };
  }
  const B = pick([10000, 12900, 20000, 49000, 18600]);
  const pm = pick([1.5, 1.8, 2, 1.2, 1.7]);
  const m = pick([6, 12, 24, 36]);
  const v = B * (1 + pm / 100) ** m;
  return {
    q: `Frida handler for ${nn(B)} kr på kredittkort med ${nn(pm)} % rente per måned og betaler ikke noe tilbake. Hvor mye skylder hun etter ${m} måneder? Rund av til hele kroner.`,
    answer: { type: "num", value: Math.round(v), tol: 1.01, show: `$${tn(Math.round(v), 0)}$ kr` },
    solution: `$$${tn(B)}\\cdot ${tn(1 + pm / 100, 3)}^{${m}} \\approx ${tn(v, 2)}\\ \\text{kr}$$`,
    hint: "Samme formel som for sparing, men med månedlig vekstfaktor og antall måneder.",
  };
}

function lanDrill(level: number): Drill {
  const kind = ri(0, 3);
  const L = pick([60000, 100000, 500000, 800000, 1500000, 250000, 320000]);
  const n = pick([2, 3, 4, 5, 10, 20]);
  const p = pick([2.5, 3, 4, 3.5, 5, 1.4]);
  const r = p / 100;
  if (kind === 0) {
    return {
      q: `Et serielån på ${nn(L)} kr skal betales ned på ${n} år med én termin per år. Hvor stort er hvert avdrag?`,
      answer: { type: "num", value: L / n, tol: 0.5, show: `$${tn(L / n, 0)}$ kr` },
      solution: `I et serielån er alle avdragene like store: $$\\text{avdrag} = \\frac{\\text{lånesummen}}{\\text{antall terminer}} = \\frac{${tn(L)}}{${n}} = ${tn(L / n, 0)}\\ \\text{kr}$$`,
      hint: "Serielån: like store avdrag.",
    };
  }
  if (kind === 1) {
    const t = ri(1, Math.min(n, 5));
    const rest = L - (t - 1) * (L / n);
    const tb = L / n + rest * r;
    return {
      q: `Et serielån på ${nn(L)} kr betales ned på ${n} år med én termin per år, og renta er ${nn(p)} % per år. Hva er terminbeløpet i termin nr. ${t}? Rund av til hele kroner.`,
      answer: { type: "num", value: Math.round(tb), tol: 1.01, show: `$${tn(Math.round(tb), 0)}$ kr` },
      solution: `Avdrag: $${tn(L / n, 0)}$ kr. Restlån før termin ${t}: $${tn(rest, 0)}$ kr. Renter: $${tn(rest, 0)}\\cdot ${tn(r, 4)} = ${tn(rest * r, 0)}$ kr. $$\\text{terminbeløp} = \\text{avdrag} + \\text{renter} = ${tn(L / n, 0)} + ${tn(rest * r, 0)} = ${tn(tb, 0)}\\ \\text{kr}$$`,
      hint: "Rentene regnes av restlånet. Terminbeløp = avdrag + renter.",
    };
  }
  const A = (L * r) / (1 - (1 + r) ** -n);
  if (kind === 2) {
    const av = A - L * r;
    return {
      q: `Et annuitetslån på ${nn(L)} kr har ${nn(p)} % rente per år og terminbeløp ${nn(Math.round(A))} kr (én termin per år). Hvor stort er avdraget i første termin? Rund av til hele kroner.`,
      answer: { type: "num", value: Math.round(Math.round(A) - L * r), tol: 1.01, show: `$${tn(Math.round(Math.round(A) - L * r), 0)}$ kr` },
      solution: `Renter første år: $${tn(L)}\\cdot ${tn(r, 4)} = ${tn(L * r, 0)}$ kr. $$\\text{avdrag} = \\text{terminbeløp} - \\text{renter} = ${tn(Math.round(A), 0)} - ${tn(L * r, 0)} = ${tn(Math.round(A) - L * r, 0)}\\ \\text{kr}$$`,
      hint: "Avdrag = terminbeløp − renter.",
    };
  }
  const At = Math.round(A);
  void level;
  return {
    q: `Et annuitetslån på ${nn(L)} kr betales med ${n} like terminbeløp på ${nn(At)} kr. Hvor mye betaler man til sammen i renter?`,
    answer: { type: "num", value: n * At - L, tol: 1.01, show: `$${tn(n * At - L, 0)}$ kr` },
    solution: `Til sammen betales $${n}\\cdot ${tn(At, 0)} = ${tn(n * At, 0)}$ kr. Summen av avdragene er lånesummen, så rentene er $$${tn(n * At, 0)} - ${tn(L)} = ${tn(n * At - L, 0)}\\ \\text{kr}$$`,
    hint: "Summen av alle avdragene er lik lånesummen.",
  };
}

function lonnDrill(level: number): Drill {
  const kind = ri(0, 2);
  if (kind === 0) {
    const b = pick([28500, 36000, 26500, 42350, 31000]);
    const p = pick([22, 27, 28, 30, 32, 35]);
    const trekk = Math.floor((b * p) / 100);
    return {
      q: `Bruttolønna er ${nn(b)} kr, og skattetrekket er ${p} % (prosentkort, rundes ned til hele kroner). Hva er nettolønna?`,
      answer: { type: "num", value: b - trekk, tol: 1.01, show: `$${tn(b - trekk, 0)}$ kr` },
      solution: `Skattetrekk: $${p}\\,\\%$ av $${tn(b)} = ${tn((b * p) / 100, 2)} \\approx ${tn(trekk, 0)}$ kr. $$\\text{nettolønn} = ${tn(b)} - ${tn(trekk, 0)} = ${tn(b - trekk, 0)}\\ \\text{kr}$$`,
      hint: "Nettolønn = bruttolønn − skattetrekk.",
    };
  }
  if (kind === 1) {
    const t = pick([150, 160, 180, 200, 210]);
    const till = pick([20, 25, 40, 50, 100]);
    const h = ri(3, 10);
    const fast = pick([24000, 27000, 30450, 28000]);
    const ov = t * (1 + till / 100) * h;
    return {
      q: `Kari har ${nn(fast)} kr i fast månedslønn og ${t} kr i timelønn. En måned jobber hun ${h} timer overtid med ${till} % tillegg. Hva blir bruttolønna?`,
      answer: { type: "num", value: fast + ov, tol: 0.5, show: `$${tn(fast + ov, 0)}$ kr` },
      solution: `Overtidsbetaling per time: $${t}\\cdot ${tn(1 + till / 100, 2)} = ${tn(t * (1 + till / 100))}$ kr. For ${h} timer: $${tn(ov)}$ kr. $$\\text{bruttolønn} = ${tn(fast)} + ${tn(ov)} = ${tn(fast + ov)}\\ \\text{kr}$$`,
      hint: "Overtidstillegget regnes av timelønna.",
    };
  }
  const inn = pick([123792, 84000, 348012, 250000]);
  const fri = pick([68792, 55000, 60000]);
  const p = pick([28, 30, 22]);
  const sk = ((inn - fri) * p) / 100;
  void level;
  return {
    q: `Du tjente ${nn(inn)} kr og skal betale ${p} % skatt av den delen av inntekten som er over ${nn(fri)} kr. Hvor mye skatt skal du betale?`,
    answer: { type: "num", value: round(sk, 2), tol: 0.5, show: `$${tn(sk, 2)}$ kr` },
    solution: `Delen over grensen: $${tn(inn)} - ${tn(fri)} = ${tn(inn - fri)}$ kr. $$${p}\\,\\%\\ \\text{av}\\ ${tn(inn - fri)} = ${tn(sk, 2)}\\ \\text{kr}$$`,
    hint: "Finn først hvor mye som er over grensen.",
  };
}

// ===========================================================================
// Kapittel 4 – Statistikk
// ===========================================================================

function sektorgrader(level: number): Drill {
  const tot = pick([180, 240, 300, 60, 120, 1200, 450]);
  const a = level === 1 ? tot * pick([0.5, 0.25, 1 / 3, 1 / 6, 0.75, 1 / 12, 0.1]) : ri(3, tot - 3);
  const deg = (a / tot) * 360;
  return {
    q: `I en undersøkelse svarte ${nn(tot)} personer, og ${nn(a, 0)} av dem valgte buss. Hvor mange grader skal sektoren for buss ha i et sektordiagram? Gi svaret med én desimal.`,
    answer: { type: "num", value: round(deg, 1), tol: 0.051, show: `$${tn(deg, 1)}^\\circ$` },
    solution: `$$\\frac{${tn(a, 0)}}{${tn(tot)}}\\cdot 360^\\circ \\approx ${tn(deg, 1)}^\\circ$$`,
    hint: "Hele sirkelen er $360^\\circ$. Gang andelen med 360.",
  };
}

function histogramDrill(level: number): Drill {
  const a = pick([150, 40, 0, 20, 5, 160]);
  const w = pick([5, 10, 15, 20, 25]);
  const f = ri(4, 60);
  if (level === 1 || Math.random() < 0.5) {
    const h = f / w;
    return {
      q: `Intervallet $[${a}, ${a + w}\\rangle$ har frekvensen ${f}. Hvor høy skal søyla være i et histogram? Gi svaret med to desimaler.`,
      answer: { type: "num", value: round(h, 2), tol: 0.0051, show: `$${tn(h, 2)}$` },
      solution: `$$\\text{søylehøyde} = \\frac{\\text{frekvens}}{\\text{intervallbredde}} = \\frac{${f}}{${w}} \\approx ${tn(h, 2)}$$`,
      hint: "Del frekvensen på bredden av intervallet.",
    };
  }
  const h = pick([0.8, 1.2, 2.4, 3.6, 4.2, 5.6]);
  return {
    q: `I et histogram er søyla over intervallet $[${a}, ${a + w}\\rangle$ ${nn(h, 1)} høy. Hvor mange observasjoner er i intervallet?`,
    answer: { type: "num", value: h * w, tol: 0.01, show: `$${tn(h * w, 1)}$` },
    solution: `Frekvensen er arealet av søyla: $$${tn(h, 1)}\\cdot ${w} = ${tn(h * w, 1)}$$`,
    hint: "Frekvens = søylehøyde · intervallbredde.",
  };
}

// ===========================================================================
// Kapittel 5 – Sentralmål og spredningsmål
// ===========================================================================

function dataList(n: number, lo: number, hi: number) {
  return Array.from({ length: n }, () => ri(lo, hi));
}
function median(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

function gjennomsnitt(level: number): Drill {
  if (level === 1) {
    const xs = dataList(ri(6, 10), 0, 9);
    const sum = xs.reduce((a, b) => a + b, 0);
    const m = sum / xs.length;
    return {
      q: `Finn gjennomsnittet av tallene $${xs.join(",\\ ")}$. Gi svaret med to desimaler.`,
      answer: { type: "num", value: round(m, 2), tol: 0.0051, show: `$${tn(m, 2)}$` },
      solution: `$$\\bar x = \\frac{${xs.join(" + ")}}{${xs.length}} = \\frac{${sum}}{${xs.length}} \\approx ${tn(m, 2)}$$`,
      hint: "Summen av alle observasjonene delt på antall observasjoner.",
    };
  }
  const vals = [0, 1, 2, 3, 4, 5];
  const f = vals.map(() => ri(0, 9));
  if (!f.some((x) => x > 0)) f[2] = 3;
  const N = f.reduce((a, b) => a + b, 0);
  const sum = vals.reduce((a, v, i) => a + v * f[i], 0);
  const m = sum / N;
  return {
    q: `Tabellen viser hvor mange feil som ble funnet på noen biler. Finn gjennomsnittet med to desimaler.\n\n| Antall feil | ${vals.join(" | ")} |\n|---|${vals.map(() => "---").join("|")}|\n| Antall biler | ${f.join(" | ")} |`,
    answer: { type: "num", value: round(m, 2), tol: 0.0051, show: `$${tn(m, 2)}$` },
    solution: `$$\\bar x = \\frac{${vals.map((v, i) => `${v}\\cdot ${f[i]}`).join(" + ")}}{${N}} = \\frac{${sum}}{${N}} \\approx ${tn(m, 2)}$$`,
    hint: "Gang hver verdi med frekvensen, summer, og del på summen av frekvensene.",
  };
}

function medianDrill(level: number): Drill {
  if (level === 1) {
    const xs = dataList(pick([7, 8, 9, 10, 11, 12]), 0, 20);
    const s = [...xs].sort((a, b) => a - b);
    const n = xs.length;
    const m = median(xs);
    return {
      q: `Finn medianen av tallene $${xs.join(",\\ ")}$.`,
      answer: { type: "num", value: m, show: `$${tn(m, 1)}$` },
      solution: `Sorter: $${s.join(",\\ ")}$. Det er ${n} tall. ${n % 2 ? `Medianen er tall nummer $\\frac{${n}+1}{2} = ${(n + 1) / 2}$, altså $${m}$.` : `Medianen er gjennomsnittet av tall nummer ${n / 2} og ${n / 2 + 1}: $\\frac{${s[n / 2 - 1]} + ${s[n / 2]}}{2} = ${tn(m, 1)}$.`}`,
      hint: "Sorter tallene først. Er antallet et partall, tar du gjennomsnittet av de to i midten.",
    };
  }
  const vals = [1, 2, 3, 4, 5, 6];
  const f = vals.map(() => ri(0, 9));
  f[ri(1, 4)] += 5;
  const N = f.reduce((a, b) => a + b, 0);
  const all: number[] = [];
  vals.forEach((v, i) => {
    for (let k = 0; k < f[i]; k++) all.push(v);
  });
  const m = median(all);
  let acc = 0;
  const cum = f.map((x) => (acc += x));
  return {
    q: `Tabellen viser karakterene på en prøve. Finn medianen.\n\n| Karakter | ${vals.join(" | ")} |\n|---|${vals.map(() => "---").join("|")}|\n| Antall | ${f.join(" | ")} |`,
    answer: { type: "num", value: m, show: `$${tn(m, 1)}$` },
    solution: `Kumulativ frekvens: $${cum.join(",\\ ")}$. $N = ${N}$, så medianen er ${N % 2 ? `observasjon nummer $\\frac{${N}+1}{2} = ${(N + 1) / 2}$` : `gjennomsnittet av observasjon nummer ${N / 2} og ${N / 2 + 1}`}. Les av i den kumulative frekvensen: medianen er $${tn(m, 1)}$.`,
    hint: "Lag kolonnen med kumulativ frekvens, og finn hvilken karakter observasjonen i midten har.",
  };
}

function typetallDrill(level: number): Drill {
  const kind = ri(0, 1);
  const xs = dataList(ri(8, 12), 1, 9);
  if (kind === 0) {
    const counts = new Map<number, number>();
    xs.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
    const top = Math.max(...counts.values());
    const modes = [...counts.entries()].filter(([, c]) => c === top).map(([x]) => x);
    if (modes.length !== 1 || top < 2) return typetallDrill(level);
    return {
      q: `Finn typetallet til observasjonene $${xs.join(",\\ ")}$.`,
      answer: { type: "num", value: modes[0], show: `$${modes[0]}$` },
      solution: `Typetallet er verdien som forekommer flest ganger. $${modes[0]}$ forekommer ${top} ganger, oftere enn noen annen verdi.`,
      hint: "Tell hvor mange ganger hver verdi forekommer.",
    };
  }
  const mx = Math.max(...xs),
    mn = Math.min(...xs);
  return {
    q: `Finn variasjonsbredden til observasjonene $${xs.join(",\\ ")}$.`,
    answer: { type: "num", value: mx - mn, show: `$${mx - mn}$` },
    solution: `Variasjonsbredden er største minus minste verdi: $${mx} - ${mn} = ${mx - mn}$.`,
    hint: "Største verdi minus minste verdi.",
  };
}

function standardavvik(level: number): Drill {
  const n = level === 1 ? 5 : ri(6, 8);
  const xs = dataList(n, level === 1 ? 1 : 20, level === 1 ? 9 : 40);
  const m = xs.reduce((a, b) => a + b, 0) / n;
  const ss = xs.reduce((a, x) => a + (x - m) ** 2, 0);
  const sd = Math.sqrt(ss / n);
  return {
    q: `Finn standardavviket til observasjonene $${xs.join(",\\ ")}$ (del på $N$, som STDAV.P i regneark). Gi svaret med to desimaler.`,
    answer: { type: "num", value: round(sd, 2), tol: 0.0101, show: `$\\sigma \\approx ${tn(sd, 2)}$` },
    solution: `Gjennomsnittet er $\\bar x = ${tn(m, 3)}$. $$\\sigma = \\sqrt{\\frac{${xs.map((x) => `(${x} - ${tn(m, 2)})^2`).join(" + ")}}{${n}}} = \\sqrt{\\frac{${tn(ss, 3)}}{${n}}} \\approx ${tn(sd, 2)}$$`,
    hint: "Finn gjennomsnittet, kvadrer avvikene, ta gjennomsnittet av dem (variansen) og til slutt kvadratroten.",
  };
}

// ===========================================================================
// Kapittel 6 – Geometri
// ===========================================================================

function pytagorasDrill(level: number): Drill {
  const kind = ri(0, 1);
  const [a, b] = level === 1 ? pick<[number, number]>([[3, 4], [5, 12], [6, 8], [8, 15], [9, 12], [7, 24], [12, 16]]) : [round(ri(10, 90) / 10, 1), round(ri(10, 90) / 10, 1)];
  const c = Math.hypot(a, b);
  if (kind === 0) {
    return {
      q: `Katetene i en rettvinklet trekant er ${nn(a)} cm og ${nn(b)} cm. Hvor lang er hypotenusen? Gi svaret med én desimal.`,
      answer: { type: "num", value: round(c, 1), tol: 0.051, show: `$${tn(c, 2)}$ cm` },
      solution: `$$c^2 = ${tn(a)}^2 + ${tn(b)}^2 = ${tn(a * a)} + ${tn(b * b)} = ${tn(a * a + b * b)}$$ $$c = \\sqrt{${tn(a * a + b * b)}} \\approx ${tn(c, 2)}$$`,
      hint: "$c^2 = a^2 + b^2$, der $c$ er hypotenusen (den lengste siden).",
    };
  }
  const H = level === 1 ? Math.round(c) : round(c + ri(1, 20) / 10, 1);
  const k = Math.sqrt(H * H - a * a);
  return {
    q: `En stige som er ${nn(H)} m lang, står inntil en vegg. Foten av stigen er ${nn(a)} m fra veggen. Hvor høyt opp når stigen? Gi svaret med to desimaler.`,
    answer: { type: "num", value: round(k, 2), tol: 0.011, show: `$${tn(k, 2)}$ m` },
    solution: `Stigen er hypotenusen: $$x^2 + ${tn(a)}^2 = ${tn(H)}^2 \\Rightarrow x^2 = ${tn(H * H)} - ${tn(a * a)} = ${tn(H * H - a * a)}$$ $$x = \\sqrt{${tn(H * H - a * a)}} \\approx ${tn(k, 2)}$$`,
    hint: "Hypotenusen er den lengste siden. Trekk fra kvadratet av den kjente kateten.",
  };
}

function arealDrill(level: number): Drill {
  const kind = ri(0, 4);
  const a = ri(3, 15),
    b = ri(2, 12),
    h = ri(2, 10);
  if (kind === 0)
    return {
      q: `Finn arealet av en trekant med grunnlinje ${a} cm og høyde ${h} cm.`,
      answer: { type: "num", value: (a * h) / 2, tol: 0.001, show: `$${tn((a * h) / 2)}$ cm²` },
      solution: `$$A = \\frac{g\\cdot h}{2} = \\frac{${a}\\cdot ${h}}{2} = ${tn((a * h) / 2)}\\ \\text{cm}^2$$`,
      hint: "$A = \\dfrac{g\\cdot h}{2}$",
    };
  if (kind === 1)
    return {
      q: `Et trapes har parallelle sider ${a} cm og ${b} cm, og høyden er ${h} cm. Finn arealet.`,
      answer: { type: "num", value: ((a + b) * h) / 2, tol: 0.001, show: `$${tn(((a + b) * h) / 2)}$ cm²` },
      solution: `$$A = \\frac{(a + b)\\cdot h}{2} = \\frac{(${a} + ${b})\\cdot ${h}}{2} = ${tn(((a + b) * h) / 2)}\\ \\text{cm}^2$$`,
      hint: "$A = \\dfrac{(a+b)\\cdot h}{2}$",
    };
  const r = level === 1 ? ri(2, 12) : round(ri(15, 120) / 10, 1);
  if (kind === 2)
    return {
      q: `Finn arealet av en sirkel med radius ${nn(r)} cm. Gi svaret med én desimal.`,
      answer: { type: "num", value: round(Math.PI * r * r, 1), tol: 0.051, show: `$${tn(Math.PI * r * r, 1)}$ cm²` },
      solution: `$$A = \\pi r^2 = \\pi\\cdot ${tn(r)}^2 \\approx ${tn(Math.PI * r * r, 1)}\\ \\text{cm}^2$$`,
      hint: "$A = \\pi r^2$. Bruk $\\pi$-knappen, ikke 3,14.",
    };
  if (kind === 3)
    return {
      q: `Finn omkretsen av en sirkel med diameter ${nn(2 * r)} cm. Gi svaret med én desimal.`,
      answer: { type: "num", value: round(2 * Math.PI * r, 1), tol: 0.051, show: `$${tn(2 * Math.PI * r, 1)}$ cm` },
      solution: `Radien er $${tn(r)}$ cm. $$O = 2\\pi r = 2\\pi\\cdot ${tn(r)} \\approx ${tn(2 * Math.PI * r, 1)}\\ \\text{cm}$$`,
      hint: "Radien er halve diameteren. $O = 2\\pi r$.",
    };
  return {
    q: `Et rektangel er ${a} cm langt og ${b} cm bredt. Finn omkretsen.`,
    answer: { type: "num", value: 2 * (a + b), tol: 0.001, show: `$${2 * (a + b)}$ cm` },
    solution: `Omkretsen er summen av sidene: $${a} + ${b} + ${a} + ${b} = ${2 * (a + b)}$ cm.`,
    hint: "Legg sammen alle sidene.",
  };
}

function volumDrill(level: number): Drill {
  const kind = ri(0, 2);
  if (kind === 0) {
    const [l, b, h] = [ri(2, 9), ri(2, 9), ri(2, 9)];
    return {
      q: `Ei eske (rett prisme) er ${l} dm lang, ${b} dm bred og ${h} dm høy. Hvor mange liter rommer den?`,
      answer: { type: "num", value: l * b * h, tol: 0.001, show: `$${l * b * h}$ L` },
      solution: `$$V = l\\cdot b\\cdot h = ${l}\\cdot ${b}\\cdot ${h} = ${l * b * h}\\ \\text{dm}^3 = ${l * b * h}\\ \\text{L}$$`,
      hint: "$1\\ \\text{dm}^3 = 1\\ \\text{L}$",
    };
  }
  if (kind === 1) {
    const r = level === 1 ? ri(2, 10) : round(ri(15, 90) / 10, 1);
    const h = ri(5, 30);
    const V = Math.PI * r * r * h;
    return {
      q: `En sylinder har radius ${nn(r)} cm og høyde ${h} cm. Hvor mange liter rommer den? Gi svaret med to desimaler.`,
      answer: { type: "num", value: round(V / 1000, 2), tol: 0.0051, show: `$${tn(V / 1000, 2)}$ L` },
      solution: `$$V = \\pi r^2 h = \\pi\\cdot ${tn(r)}^2\\cdot ${h} \\approx ${tn(V, 1)}\\ \\text{cm}^3 = ${tn(V / 1000, 2)}\\ \\text{dm}^3 = ${tn(V / 1000, 2)}\\ \\text{L}$$`,
      hint: "$V = \\pi r^2 h$. Del på 1000 for å gå fra cm³ til liter.",
    };
  }
  const r = level === 1 ? ri(2, 10) : round(ri(15, 120) / 10, 1);
  const V = (4 / 3) * Math.PI * r ** 3;
  return {
    q: `Ei kule har radius ${nn(r)} cm. Finn volumet i cm³ med én desimal.`,
    answer: { type: "num", value: round(V, 1), tol: 0.051, show: `$${tn(V, 1)}$ cm³` },
    solution: `$$V = \\frac43\\pi r^3 = \\frac43\\pi\\cdot ${tn(r)}^3 \\approx ${tn(V, 1)}\\ \\text{cm}^3$$`,
    hint: "$V = \\dfrac43\\pi r^3$",
  };
}

function malestokkDrill(level: number): Drill {
  const M = pick([10000, 12500, 20000, 25000, 50000, 100000, 200000]);
  const kind = ri(0, 1);
  if (kind === 0) {
    const cm = level === 1 ? ri(1, 20) : round(ri(10, 200) / 10, 1);
    const km = (cm * M) / 100000;
    return {
      q: `Et kart har målestokk 1 : ${nn(M)}. Avstanden på kartet er ${nn(cm)} cm. Hvor langt er det i virkeligheten, målt i km?`,
      answer: { type: "num", value: round(km, 4), tol: 0.0001, show: `$${tn(km, 3)}$ km` },
      solution: `$$${tn(cm)}\\ \\text{cm}\\cdot ${tn(M)} = ${tn(cm * M)}\\ \\text{cm} = ${tn(km, 3)}\\ \\text{km}$$ (1 km = 100 000 cm.)`,
      hint: "Gang med målestokktallet og gjør om fra cm til km (del på 100 000).",
    };
  }
  const km = pick([1, 1.2, 2.1, 4.5, 10, 18, 0.5]);
  const cm = (km * 100000) / M;
  return {
    q: `Et kart har målestokk 1 : ${nn(M)}. Hvor mange centimeter på kartet svarer ${nn(km)} km i terrenget til?`,
    answer: { type: "num", value: round(cm, 2), tol: 0.011, show: `$${tn(cm, 2)}$ cm` },
    solution: `$${tn(km)}\\ \\text{km} = ${tn(km * 100000)}\\ \\text{cm}$. $$\\frac{${tn(km * 100000)}}{${tn(M)}} = ${tn(cm, 2)}\\ \\text{cm}$$`,
    hint: "Gjør om til centimeter og del på målestokktallet.",
  };
}

function enheterDrill(level: number): Drill {
  const kind = ri(0, 5);
  const x = level === 1 ? pick([2, 3.5, 12, 0.5, 250, 4500]) : pick([1.25, 0.012, 376.5, 12200, 0.02, 23.5]);
  const unit = (u: string) => (u.includes("^") ? `\\text{${u.split("^")[0]}}^{${u.split("^")[1]}}` : `\\text{${u}}`);
  const T: [string, string, number, string][] = [
    ["m^2", "cm^2", 10000, "4 plasser mot høyre (1 m² = 100 dm² = 10 000 cm²)"],
    ["cm^2", "dm^2", 0.01, "2 plasser mot venstre (100 cm² = 1 dm²)"],
    ["dm^3", "L", 1, "ingen plasser, for 1 dm³ = 1 L"],
    ["m^3", "L", 1000, "3 plasser mot høyre (1 m³ = 1000 dm³ = 1000 L)"],
    ["cm^3", "L", 0.001, "3 plasser mot venstre (1000 cm³ = 1 L)"],
    ["dL", "L", 0.1, "1 plass mot venstre (10 dL = 1 L)"],
  ];
  const [from, to, f, how] = T[kind];
  const v = x * f;
  return {
    q: `Gjør om $${tn(x, 4)}\\ ${unit(from)}$ til $${unit(to)}$.`,
    answer: { type: "num", value: v, rel: true, tol: 1e-9, show: `$${tn(v, 6)}\\ ${unit(to)}$` },
    solution: `Kommaet flyttes ${how}: $$${tn(x, 4)}\\ ${unit(from)} = ${tn(v, 6)}\\ ${unit(to)}$$`,
    hint: "Areal: 100 mellom hver enhet (cm² → dm² → m²). Volum: 1000 mellom hver enhet. 1 L = 1 dm³.",
  };
}

function formlikhetDrill(level: number): Drill {
  const k = level === 1 ? pick([2, 3, 0.5, 1.5, 2.5]) : pick([1.2, 0.8, 2.25, 1.75, 0.6]);
  const AB = pick([4, 6, 8, 10, 15]),
    AC = pick([3, 5, 7, 9, 12]);
  const DE = AB * k,
    DF = AC * k;
  return {
    q: `$\\triangle ABC$ og $\\triangle DEF$ er formlike, med $AB$ samsvarende med $DE$ og $AC$ med $DF$. $AB = ${tn(AB)}$ cm, $DE = ${tn(DE)}$ cm og $AC = ${tn(AC)}$ cm. Finn $DF$.`,
    answer: { type: "num", value: DF, tol: 0.001, show: `$DF = ${tn(DF)}$ cm` },
    solution: `Forholdet mellom samsvarende sider: $$\\frac{DE}{AB} = \\frac{${tn(DE)}}{${tn(AB)}} = ${tn(k)}$$ $$DF = ${tn(k)}\\cdot ${tn(AC)} = ${tn(DF)}\\ \\text{cm}$$`,
    hint: "I formlike figurer er forholdet mellom samsvarende sider det samme.",
  };
}

// ===========================================================================
// Kapittel 7 – Tall, funksjoner og modeller
// ===========================================================================

function standardformDrill(level: number): Drill {
  const kind = level === 1 ? 0 : ri(0, 1);
  if (kind === 0) {
    const m = pick([1.5, 2.3, 4.56, 6.371, 7.9, 3, 9.46, 1.08, 2.99792]);
    const e = pick([3, 4, 5, 6, 8, 9, -2, -3, -4, -6]);
    const v = m * 10 ** e;
    const plain = e >= 0 ? nn(v, 0) : nn(v, -e + 5);
    return {
      q: `Skriv tallet på standardform: **${plain}**`,
      answer: { type: "sf", value: v, show: `$${tn(m, 5)}\\cdot 10^{${e}}$` },
      solution: `Flytt kommaet slik at det står ett siffer (ikke null) foran det. Det må flyttes ${Math.abs(e)} plasser mot ${e > 0 ? "venstre" : "høyre"}, så eksponenten blir $${e}$: $$${tn(m, 5)}\\cdot 10^{${e}}$$`,
      hint: "Skriv svaret som f.eks. `6,371*10^6` eller `2,5·10^-3`.",
    };
  }
  const a = pick([2, 3, 4, 1.5, 6]),
    b = pick([3, 5, 2, 8, 4]);
  const e1 = pick([3, 4, 5, 6]),
    e2 = pick([2, 3, -2, 5]);
  const v = a * 10 ** e1 * (b * 10 ** e2);
  let m = a * b,
    e = e1 + e2;
  while (m >= 10) {
    m /= 10;
    e++;
  }
  return {
    q: `Regn ut og skriv svaret på standardform: $$(${tn(a)}\\cdot 10^{${e1}})\\cdot(${tn(b)}\\cdot 10^{${e2}})$$`,
    answer: { type: "sf", value: v, show: `$${tn(m, 4)}\\cdot 10^{${e}}$` },
    solution: `Gang tallene for seg og tierpotensene for seg: $${tn(a)}\\cdot ${tn(b)} = ${tn(a * b)}$ og $10^{${e1}}\\cdot 10^{${e2}} = 10^{${e1 + e2}}$. $$${tn(a * b)}\\cdot 10^{${e1 + e2}} = ${tn(m, 4)}\\cdot 10^{${e}}$$`,
    hint: "$10^m\\cdot 10^n = 10^{m+n}$. Tallet foran må være mellom 1 og 10.",
  };
}

function stigningstallDrill(level: number): Drill {
  const kind = ri(0, 1);
  const x1 = ri(-5, 4),
    y1 = ri(-6, 6);
  let x2 = ri(-4, 6);
  while (x2 === x1) x2 = ri(-4, 6);
  const a = level === 1 ? nz(-4, 4) : pick([0.5, -0.5, 1.5, -2.5, 0.25, 3]);
  const y2 = y1 + a * (x2 - x1);
  const b = y1 - a * x1;
  if (kind === 0)
    return {
      q: `Ei rett linje går gjennom punktene $(${x1}, ${y1})$ og $(${x2}, ${tn(y2)})$. Finn stigningstallet $a$.`,
      answer: { type: "num", value: a, tol: 1e-9, show: `$a = ${tn(a)}$` },
      solution: `$$a = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${tn(y2)} - ${par(y1)}}{${x2} - ${par(x1)}} = \\frac{${tn(y2 - y1)}}{${x2 - x1}} = ${tn(a)}$$`,
      hint: "$a = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{y_2 - y_1}{x_2 - x_1}$",
    };
  return {
    q: `Ei rett linje har stigningstall $${tn(a)}$ og går gjennom punktet $(${x1}, ${y1})$. Finn konstantleddet $b$ i $y = ax + b$.`,
    answer: { type: "num", value: b, tol: 1e-9, show: `$b = ${tn(b)}$, så $y = ${tn(a)}x ${sgnTerm(b)}$` },
    solution: `Sett inn punktet i $y = ${tn(a)}x + b$: $$${y1} = ${tn(a)}\\cdot ${par(x1)} + b \\Rightarrow b = ${y1} - ${par(a * x1)} = ${tn(b)}$$`,
    hint: "Sett koordinatene til punktet inn i $y = ax + b$ og løs for $b$.",
  };
}

function eksponentiellModell(level: number): Drill {
  const a = pick([300, 1400, 170, 50, 900000, 8, 145]);
  const k = pick([1.043, 0.88, 1.29, 0.96, 0.775, 1.33, 1.105, 0.93]);
  const kind = ri(0, 2);
  const f = `${tn(a)}\\cdot ${tn(k, 3)}^x`;
  if (kind === 0) {
    const ch = (k - 1) * 100;
    return {
      q: `En modell er gitt ved $f(x) = ${f}$. Hvor mange prosent øker eller minker størrelsen per enhet av $x$? Skriv minus for nedgang.`,
      answer: { type: "num", value: round(ch, 2), tol: 0.001, show: `$${tn(ch, 1)}\\,\\%$ (${ch > 0 ? "økning" : "nedgang"})` },
      solution: `Vekstfaktoren er $k = ${tn(k, 3)}$. $${tn(k, 3)}\\cdot 100\\,\\% = ${tn(k * 100, 1)}\\,\\%$, altså en ${ch > 0 ? "økning" : "nedgang"} på $${tn(Math.abs(ch), 1)}\\,\\%$.`,
      hint: "I $f(x) = a\\cdot k^x$ er $k$ vekstfaktoren.",
    };
  }
  if (kind === 1) {
    const x = ri(2, 15);
    const v = a * k ** x;
    return {
      q: `En modell er gitt ved $f(x) = ${f}$. Regn ut $f(${x})$ med én desimal.`,
      answer: { type: "num", value: round(v, 1), rel: true, tol: 0.0005, show: `$f(${x}) \\approx ${tn(v, 1)}$` },
      solution: `$$f(${x}) = ${tn(a)}\\cdot ${tn(k, 3)}^{${x}} \\approx ${tn(v, 1)}$$`,
      hint: "Sett inn for $x$.",
    };
  }
  void level;
  return {
    q: `En modell er gitt ved $f(x) = ${f}$. Hva er verdien når $x = 0$?`,
    answer: { type: "num", value: a, show: `$${tn(a)}$` },
    solution: `$k^0 = 1$, så $f(0) = ${tn(a)}\\cdot 1 = ${tn(a)}$. Tallet $a$ er startverdien.`,
    hint: "Alle tall opphøyd i 0 er 1.",
  };
}

export const TOPICS: Topic[] = [
  { slug: "prosent-av", title: "Prosent av et tall", chapter: 1, sections: "1.1", desc: "Hoderegning med 10 %, 25 %, 50 % – og kalkulator for resten.", gen: prosentAv },
  { slug: "finn-prosenten", title: "Hvor mange prosent?", chapter: 1, sections: "1.1", desc: "Finn prosenten når du kjenner delen og det hele.", gen: finnProsenten },
  { slug: "finn-det-hele", title: "Finn det hele (100 %)", chapter: 1, sections: "1.1", desc: "Veien om 1 % når du kjenner prosentdelen.", gen: finnDetHele },
  { slug: "prosentpoeng", title: "Prosentpoeng og prosent", chapter: 1, sections: "1.2", desc: "Skill mellom endring i prosentpoeng og i prosent.", gen: prosentpoeng },
  { slug: "vekstfaktor", title: "Vekstfaktor", chapter: 1, sections: "1.3", desc: "Fra prosent til vekstfaktor – og tilbake.", gen: vekstfaktor },
  { slug: "ny-verdi", title: "Ny og opprinnelig verdi", chapter: 1, sections: "1.3", desc: "Ny verdi = opprinnelig verdi · vekstfaktor.", gen: nyVerdi },
  { slug: "eksponentiell-vekst", title: "Eksponentiell vekst", chapter: 1, sections: "1.4", desc: "Verdien etter n perioder, bakover i tid og samlet endring.", gen: eksponentiell },
  { slug: "eksponentielle-modeller", title: "Eksponentielle modeller", chapter: 1, sections: "1.5", desc: "Tolk $a$ og $k$ i $f(x) = a\\cdot k^x$.", gen: eksponentiellModell },
  { slug: "likninger", title: "Likninger", chapter: 2, sections: "2.1–2.2", desc: "Førstegradslikninger, også med parenteser og brøker.", gen: likning },
  { slug: "tekstoppgaver", title: "Uoppstilte likninger", chapter: 2, sections: "2.3–2.4", desc: "Sett opp likningen selv fra en tekst.", gen: tekstoppgave },
  { slug: "likningssett", title: "Likningssett", chapter: 2, sections: "2.5", desc: "To likninger med to ukjente.", gen: likningssett },
  { slug: "ulikheter", title: "Ulikheter", chapter: 2, sections: "2.6", desc: "Husk å snu tegnet når du deler på et negativt tall.", gen: ulikhet },
  { slug: "indeks", title: "Prisindeks og KPI", chapter: 3, sections: "3.1–3.2", desc: "Regn om priser og finn prosentvis endring i prisnivå.", gen: indeks },
  { slug: "kroneverdi", title: "Kroneverdi og reallønn", chapter: 3, sections: "3.3", desc: "Kroneverdi = 100/KPI og reallønn = lønn · kroneverdi.", gen: kroneverdi },
  { slug: "lonn-og-skatt", title: "Lønn og skatt", chapter: 3, sections: "3.4", desc: "Overtid, brutto- og nettolønn.", gen: lonnDrill },
  { slug: "rente", title: "Rente og sparing", chapter: 3, sections: "3.5, 3.7", desc: "Renters rente og årlig rente på kredittkort.", gen: renteDrill },
  { slug: "lan", title: "Serielån og annuitetslån", chapter: 3, sections: "3.6", desc: "Avdrag, renter og terminbeløp.", gen: lanDrill },
  { slug: "sektordiagram", title: "Sektordiagram", chapter: 4, sections: "4.3", desc: "Regn ut vinkelen til en sektor.", gen: sektorgrader },
  { slug: "histogram", title: "Histogram", chapter: 4, sections: "4.6", desc: "Søylehøyde = frekvens / intervallbredde.", gen: histogramDrill },
  { slug: "gjennomsnitt", title: "Gjennomsnitt", chapter: 5, sections: "5.1", desc: "Fra liste og fra frekvenstabell.", gen: gjennomsnitt },
  { slug: "median", title: "Median", chapter: 5, sections: "5.2–5.3", desc: "Fra liste og med kumulativ frekvens.", gen: medianDrill },
  { slug: "typetall", title: "Typetall og variasjonsbredde", chapter: 5, sections: "5.1, 5.4", desc: "Den vanligste verdien og største minus minste.", gen: typetallDrill },
  { slug: "standardavvik", title: "Standardavvik", chapter: 5, sections: "5.4", desc: "Regn ut σ steg for steg.", gen: standardavvik },
  { slug: "formlikhet", title: "Formlikhet", chapter: 6, sections: "6.1–6.2", desc: "Finn ukjente sider med forholdet mellom samsvarende sider.", gen: formlikhetDrill },
  { slug: "pytagoras", title: "Pytagorassetningen", chapter: 6, sections: "6.3", desc: "Hypotenus og kateter.", gen: pytagorasDrill },
  { slug: "malestokk", title: "Målestokk", chapter: 6, sections: "6.4", desc: "Fra kart til virkelighet og tilbake.", gen: malestokkDrill },
  { slug: "areal", title: "Areal og omkrets", chapter: 6, sections: "6.5", desc: "Trekant, trapes, rektangel og sirkel.", gen: arealDrill },
  { slug: "enheter", title: "Enheter for areal og volum", chapter: 6, sections: "6.5–6.6", desc: "cm², dm², m², cm³, dm³, liter.", gen: enheterDrill },
  { slug: "volum", title: "Volum", chapter: 6, sections: "6.6–6.7", desc: "Prisme, sylinder og kule – også i liter.", gen: volumDrill },
  { slug: "standardform", title: "Standardform", chapter: 7, sections: "7.1", desc: "Skriv tall som $a\\cdot 10^n$ og regn med dem.", gen: standardformDrill },
  { slug: "stigningstall", title: "Stigningstall", chapter: 7, sections: "7.2", desc: "Stigningstall og konstantledd for rette linjer.", gen: stigningstallDrill },
];

export function getTopic(slug: string) {
  return TOPICS.find((t) => t.slug === slug);
}
