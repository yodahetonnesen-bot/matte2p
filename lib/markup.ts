// Parser for innholdsformatet som teori og oppgaver er skrevet i.
// Formatet er markdown-aktig med $...$ for matematikk og ::blokker for
// regelbokser, eksempler, grafer, fortegnslinjer og interaktive widgets.

export type BoxKind = "regel" | "def" | "tips" | "obs" | "merk" | "husk" | "rettet";

export type Block =
  | { t: "p"; text: string }
  | { t: "math"; tex: string }
  | { t: "h"; level: 2 | 3; text: string; id: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[]; start?: number }
  | { t: "table"; rows: string[][]; header: boolean }
  | { t: "box"; kind: BoxKind; title?: string; body: Block[] }
  | { t: "eks"; title?: string; problem: Block[]; solution: Block[] }
  | { t: "fold"; kind: "bevis" | "diskuter" | "utforsk" | "losning"; title?: string; body: Block[]; answer: Block[] }
  | { t: "plot"; spec: PlotSpec }
  | { t: "diagram"; spec: DiagramSpec }
  | { t: "svg"; w: number; h: number; body: string; cap?: string; mw?: number }
  | { t: "fortegn"; spec: SignSpec }
  | { t: "widget"; name: string; props: Record<string, string> }
  | { t: "cols"; cols: Block[][] }
  | { t: "steps"; items: string[] }
  | { t: "quote"; text: string }
  | { t: "code"; text: string };

export type PlotItem =
  | { k: "f"; expr: string; opts: Record<string, string> }
  | { k: "p"; x: number; y: number; opts: Record<string, string> }
  | { k: "v" | "s"; x1: number; y1: number; x2: number; y2: number; opts: Record<string, string> }
  | { k: "poly"; pts: [number, number][]; opts: Record<string, string> }
  | { k: "vx" | "hy"; at: number; opts: Record<string, string> }
  | { k: "txt"; x: number; y: number; text: string; opts: Record<string, string> }
  | { k: "c"; t0: number; t1: number; xe: string; ye: string; opts: Record<string, string> }
  | { k: "area"; f: string; g: string; a: number; b: number; opts: Record<string, string> }
  | { k: "vf"; xe: string; ye: string; opts: Record<string, string> }
  | { k: "ang" | "rett"; a: [number, number]; b: [number, number]; c: [number, number]; opts: Record<string, string> }
  | { k: "pl"; pts: [number, number][]; opts: Record<string, string> };

export type PlotSpec = {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  opts: Record<string, string>;
  items: PlotItem[];
};

/** Statistiske diagrammer: søyle-, sektor-, linje- og histogram og kumulativ frekvens. */
export type DiagramType = "soyle" | "sektor" | "linje" | "histogram" | "kumulativ";
export type DiagramSeries = { name: string; values: (number | null)[]; opts: Record<string, string> };
export type DiagramSpec = {
  type: DiagramType;
  opts: Record<string, string>;
  cats: string[]; // kategorier (søyle/linje) eller x-verdier som tekst
  xs: number[] | null; // tallverdier langs x-aksen (linje med x=tall)
  series: DiagramSeries[];
  slices: { label: string; value: number; opts: Record<string, string> }[];
  bounds: number[]; // intervallgrenser (histogram/kumulativ)
  freq: number[]; // frekvens (eller søylehøyde med «hoyder») per intervall
};

/** Tall skrevet på norsk: «2,5», «12 000», «−3». Tom celle, «-» eller «*» gir null. */
export function parseNo(raw: string): number | null {
  const t = raw.trim().replace(/[\u2009\u202f\u00a0 ]/g, "").replace(/[−–]/g, "-").replace(",", ".");
  if (!t || t === "-" || t === "*") return null;
  const v = Number(t);
  return Number.isFinite(v) ? v : null;
}

/** Hodet til en blokk: nøkkel=verdi, nøkkel="verdi med mellomrom" og frittstående flagg. */
export function parseHeadOpts(head: string): Record<string, string> {
  const o: Record<string, string> = {};
  const re = /(\w+)="([^"]*)"|(\w+)=(\S+)|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(head))) {
    if (m[1]) o[m[1]] = m[2];
    else if (m[3]) o[m[3]] = m[4];
    else if (m[5]) o[m[5]] = "1";
  }
  return o;
}

export function parseDiagram(head: string, lines: string[]): DiagramSpec {
  const words = head.trim().split(/\s+/);
  const type = (["soyle", "sektor", "linje", "histogram", "kumulativ"].includes(words[0]) ? words[0] : "soyle") as DiagramType;
  const opts = parseHeadOpts(head.trim().slice(words[0].length));
  const spec: DiagramSpec = { type, opts, cats: [], xs: null, series: [], slices: [], bounds: [], freq: [] };
  for (const line of lines) {
    const l = line.trim();
    if (!l || l.startsWith("#")) continue;
    const ci = l.indexOf(":");
    if (ci < 0) continue;
    const key = l.slice(0, ci).trim();
    const [main, extra = ""] = l.slice(ci + 1).split("||");
    const cells = main.split("|").map((c) => c.trim());
    const o = parseHeadOpts(extra);
    if (key === "kat") spec.cats = cells;
    else if (key === "x") {
      spec.cats = cells;
      spec.xs = cells.map((c) => parseNo(c) ?? NaN);
    } else if (key === "grenser") spec.bounds = cells.map((c) => parseNo(c) ?? NaN);
    else if (key === "frekvens" || key === "hoyder") {
      spec.freq = cells.map((c) => parseNo(c) ?? 0);
      if (key === "hoyder") spec.opts.hoyder = "1";
    } else if (type === "sektor") spec.slices.push({ label: key, value: parseNo(cells[0]) ?? 0, opts: o });
    else spec.series.push({ name: key, values: cells.map(parseNo), opts: o });
  }
  return spec;
}

export type SignSpec = {
  points: string[];
  rows: { label: string; tokens: string[] }[];
};

const SELF_CLOSING = new Set(["widget"]);

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/\$[^$]*\$/g, "")
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseOpts(parts: string[]): Record<string, string> {
  const o: Record<string, string> = {};
  for (const raw of parts) {
    const p = raw.trim();
    if (!p) continue;
    const eq = p.indexOf("=");
    if (eq > 0 && /^[a-z0-9]+$/i.test(p.slice(0, eq))) o[p.slice(0, eq)] = p.slice(eq + 1).trim();
    else o[p] = "1";
  }
  return o;
}

function nums(s: string): number[] {
  return s
    .split(/[,\s]+/)
    .filter(Boolean)
    .map((v) => Number(v));
}

export function parsePlot(head: string, lines: string[]): PlotSpec {
  const opts = parseOpts(head.split(/\s+/));
  const [xmin, xmax] = opts.x ? nums(opts.x) : [-5, 5];
  const [ymin, ymax] = opts.y ? nums(opts.y) : [-5, 5];
  const items: PlotItem[] = [];
  for (const line of lines) {
    const l = line.trim();
    if (!l || l.startsWith("#")) continue;
    const ci = l.indexOf(":");
    if (ci < 0) continue;
    const key = l.slice(0, ci).trim();
    const segs = l.slice(ci + 1).split("|");
    const main = segs[0].trim();
    switch (key) {
      case "f":
        items.push({ k: "f", expr: main, opts: parseOpts(segs.slice(1)) });
        break;
      case "p": {
        const [x, y] = nums(main);
        items.push({ k: "p", x, y, opts: parseOpts(segs.slice(1)) });
        break;
      }
      case "v":
      case "s": {
        const [a, b] = main.split("->");
        const [x1, y1] = nums(a);
        const [x2, y2] = nums(b);
        items.push({ k: key, x1, y1, x2, y2, opts: parseOpts(segs.slice(1)) });
        break;
      }
      case "poly":
        items.push({
          k: "poly",
          pts: main.split(";").map((pt) => nums(pt) as [number, number]),
          opts: parseOpts(segs.slice(1)),
        });
        break;
      case "vx":
      case "hy":
        items.push({ k: key, at: Number(main), opts: parseOpts(segs.slice(1)) });
        break;
      case "txt": {
        const [x, y] = nums(main);
        items.push({ k: "txt", x, y, text: (segs[1] ?? "").trim(), opts: parseOpts(segs.slice(2)) });
        break;
      }
      case "c": {
        const [t0, t1] = nums(main);
        items.push({ k: "c", t0, t1, xe: segs[1].trim(), ye: segs[2].trim(), opts: parseOpts(segs.slice(3)) });
        break;
      }
      case "vf":
        items.push({ k: "vf", xe: main, ye: (segs[1] ?? "0").trim(), opts: parseOpts(segs.slice(2)) });
        break;
      case "ang":
      case "rett": {
        const [a, b, c] = main.split(";").map((pt) => nums(pt) as [number, number]);
        if (a && b && c) items.push({ k: key, a, b, c, opts: parseOpts(segs.slice(1)) });
        break;
      }
      case "pl":
        items.push({ k: "pl", pts: main.split(";").map((pt) => nums(pt) as [number, number]), opts: parseOpts(segs.slice(1)) });
        break;
      case "area": {
        const [a, b] = nums(segs[2] ?? "0,1");
        items.push({ k: "area", f: main, g: (segs[1] ?? "0").trim(), a, b, opts: parseOpts(segs.slice(3)) });
        break;
      }
    }
  }
  return { xmin, xmax, ymin, ymax, opts, items };
}

function parseSign(head: string, lines: string[]): SignSpec {
  const points = head.trim() ? head.split("|").map((s) => s.trim()) : [];
  const rows = lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.lastIndexOf(":");
      return { label: l.slice(0, i).trim(), tokens: l.slice(i + 1).trim().split(/\s+/) };
    });
  return { points, rows };
}

function splitOn(lines: string[], sep: string): [string[], string[]] {
  let depth = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (l.startsWith("::") && l.length > 2) {
      const name = l.slice(2).split(/\s+/)[0];
      if (!SELF_CLOSING.has(name)) depth++;
    } else if (l === "::") depth--;
    else if (depth === 0 && l === sep) return [lines.slice(0, i), lines.slice(i + 1)];
  }
  return [lines, []];
}

export function parseMarkup(src: string): Block[] {
  const lines = src.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) {
      blocks.push({ t: "p", text: para.join(" ").trim() });
      para = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      flush();
      i++;
      continue;
    }

    // ::blokk
    if (line.startsWith("::") && line.length > 2) {
      flush();
      const m = line.slice(2).match(/^(\S+)\s*(.*)$/)!;
      const name = m[1];
      const rest = m[2];
      if (SELF_CLOSING.has(name)) {
        const [wname, ...wrest] = rest.split(/\s+/);
        const props: Record<string, string> = {};
        const re = /(\w+)="([^"]*)"|(\w+)=(\S+)/g;
        let mm: RegExpExecArray | null;
        const joined = wrest.join(" ");
        while ((mm = re.exec(joined))) props[mm[1] ?? mm[3]] = mm[2] ?? mm[4];
        blocks.push({ t: "widget", name: wname, props });
        i++;
        continue;
      }
      // samle innhold til matchende ::
      let depth = 1;
      const inner: string[] = [];
      i++;
      while (i < lines.length) {
        const l = lines[i].trim();
        if (l.startsWith("::") && l.length > 2) {
          const n2 = l.slice(2).split(/\s+/)[0];
          if (!SELF_CLOSING.has(n2)) depth++;
        } else if (l === "::") {
          depth--;
          if (depth === 0) break;
        }
        inner.push(lines[i]);
        i++;
      }
      i++; // hopp over avsluttende ::
      blocks.push(makeBlock(name, rest, inner));
      continue;
    }

    // $$ vist matematikk $$
    if (line.startsWith("$$")) {
      flush();
      let tex = line.slice(2);
      if (tex.trimEnd().endsWith("$$") && tex.trim().length > 0) {
        blocks.push({ t: "math", tex: tex.trimEnd().slice(0, -2).trim() });
        i++;
        continue;
      }
      i++;
      while (i < lines.length && !lines[i].trim().endsWith("$$")) {
        tex += "\n" + lines[i];
        i++;
      }
      if (i < lines.length) tex += "\n" + lines[i].trim().slice(0, -2);
      blocks.push({ t: "math", tex: tex.trim() });
      i++;
      continue;
    }

    // overskrifter
    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      flush();
      blocks.push({ t: "h", level: h[1].length as 2 | 3, text: h[2], id: slugify(h[2]) });
      i++;
      continue;
    }

    // tabeller
    if (line.startsWith("|")) {
      flush();
      const rows: string[][] = [];
      let header = false;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const l = lines[i].trim();
        const cells = l.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
        if (cells.every((c) => /^:?-{2,}:?$/.test(c))) header = true;
        else rows.push(cells);
        i++;
      }
      blocks.push({ t: "table", rows, header });
      continue;
    }

    // kodeblokk
    if (line.startsWith("```")) {
      flush();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ t: "code", text: code.join("\n") });
      continue;
    }

    // sitat / nøkkelspørsmål
    if (/^>\s/.test(line)) {
      flush();
      const q: string[] = [];
      while (i < lines.length && /^>\s/.test(lines[i].trim())) {
        q.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ t: "quote", text: q.join(" ") });
      continue;
    }

    // lister
    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line) || /^>>\s/.test(line)) {
      flush();
      const ordered = /^\d+\.\s+/.test(line);
      const steps = /^>>\s/.test(line);
      const items: string[] = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        const mm = steps ? l.match(/^>>\s+(.*)$/) : ordered ? l.match(/^\d+\.\s+(.*)$/) : l.match(/^[-*]\s+(.*)$/);
        if (mm) {
          items.push(mm[1]);
          i++;
        } else if (l && items.length && /^\s{2,}/.test(lines[i]) && !l.startsWith("::")) {
          items[items.length - 1] += " " + l;
          i++;
        } else break;
      }
      if (steps) blocks.push({ t: "steps", items });
      else if (ordered) {
        // en nummerert liste som fortsetter etter en formel eller figur, beholder nummereringen
        const start = Number(line.match(/^(\d+)\./)![1]);
        blocks.push({ t: "ol", items, ...(start !== 1 ? { start } : {}) });
      } else blocks.push({ t: "ul", items });
      continue;
    }

    para.push(line);
    i++;
  }
  flush();
  return blocks;
}

function makeBlock(name: string, rest: string, inner: string[]): Block {
  switch (name) {
    case "plot":
      return { t: "plot", spec: parsePlot(rest, inner) };
    case "diagram":
      return { t: "diagram", spec: parseDiagram(rest, inner) };
    case "svg": {
      const o = parseHeadOpts(rest);
      return { t: "svg", w: Number(o.w ?? 400), h: Number(o.h ?? 240), body: inner.join("\n"), cap: o.cap, mw: o.mw ? Number(o.mw) : undefined };
    }
    case "fortegn":
      return { t: "fortegn", spec: parseSign(rest, inner) };
    case "eks": {
      const [a, b] = splitOn(inner, "---");
      return { t: "eks", title: rest || undefined, problem: parseMarkup(a.join("\n")), solution: parseMarkup(b.join("\n")) };
    }
    case "bevis":
    case "diskuter":
    case "utforsk":
    case "losning": {
      const [a, b] = splitOn(inner, "---");
      return { t: "fold", kind: name, title: rest || undefined, body: parseMarkup(a.join("\n")), answer: parseMarkup(b.join("\n")) };
    }
    case "cols": {
      const cols: string[][] = [[]];
      let depth = 0;
      for (const l of inner) {
        const tl = l.trim();
        if (tl.startsWith("::") && tl.length > 2) depth++;
        else if (tl === "::") depth--;
        if (depth === 0 && tl === "||") cols.push([]);
        else cols[cols.length - 1].push(l);
      }
      return { t: "cols", cols: cols.map((c) => parseMarkup(c.join("\n"))) };
    }
    default:
      return {
        t: "box",
        kind: (["regel", "def", "tips", "obs", "merk", "husk", "rettet"].includes(name) ? name : "merk") as BoxKind,
        title: rest || undefined,
        body: parseMarkup(inner.join("\n")),
      };
  }
}

// ---------------------------------------------------------------------------
// Oppgaver
// ---------------------------------------------------------------------------

export type Category = "teori" | "repetisjon" | "ovmer" | "blandet" | "apen";

export const CATEGORY_LABEL: Record<Category, string> = {
  teori: "Teoridel",
  repetisjon: "Repetisjon",
  ovmer: "Øv mer",
  blandet: "Blandede oppgaver",
  apen: "Åpne oppgaver",
};

export type Part = { label: string; body: Block[]; answer: Block[]; own?: boolean };

export type Exercise = {
  id: string; // unik, f.eks. "1.42" eller "R1.3" (repetisjonsoppgave 3 i kapittel 1)
  num: string; // visningsnummer
  chapter: number;
  cat: Category;
  section?: string; // "1.4"
  intro: Block[];
  parts: Part[];
  answer: Block[];
  own?: boolean; // svar laget av nettsiden (ikke fra bokas fasit)
  hint: Block[];
  solution: Block[];
  search: string;
};

export function parseExercises(src: string, chapter: number): Exercise[] {
  const out: Exercise[] = [];
  let cat: Category = "teori";
  const lines = src.replace(/\r/g, "").split("\n");

  type Cur = {
    num: string;
    section?: string;
    intro: string[];
    parts: { label: string; body: string[]; answer: string[]; own?: boolean }[];
    answer: string[];
    own?: boolean;
    hint: string[];
    solution: string[];
    mode: "intro" | "part" | "partanswer" | "answer" | "hint" | "solution";
  };
  let cur: Cur | null = null;

  const finish = () => {
    if (!cur) return;
    const c = cur;
    const id = cat === "repetisjon" ? `R${chapter}.${c.num}` : c.num;
    const plain = [...c.intro, ...c.parts.flatMap((p) => p.body)].join(" ");
    out.push({
      id,
      num: c.num,
      chapter,
      cat,
      section: c.section,
      intro: parseMarkup(c.intro.join("\n")),
      parts: c.parts.map((p) => ({
        label: p.label,
        body: parseMarkup(p.body.join("\n")),
        answer: parseMarkup(p.answer.join("\n")),
        own: p.own,
      })),
      answer: parseMarkup(c.answer.join("\n")),
      own: c.own,
      hint: parseMarkup(c.hint.join("\n")),
      solution: parseMarkup(c.solution.join("\n")),
      search: plain.replace(/\s+/g, " ").slice(0, 220),
    });
    cur = null;
  };

  let depth = 0; // inne i ::blokk – ikke tolk markører
  let fence = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("```")) fence = !fence;
    else if (fence) {
      pushCont(raw);
      continue;
    }

    if (depth === 0) {
      const catM = line.match(/^#\s+(teori|repetisjon|ovmer|blandet|apen)\s*$/);
      if (catM) {
        finish();
        cat = catM[1] as Category;
        continue;
      }
      const exM = line.match(/^##\s+(\S+)(?:\s+@(\S+))?\s*$/);
      if (exM) {
        finish();
        cur = { num: exM[1], section: exM[2], intro: [], parts: [], answer: [], hint: [], solution: [], mode: "intro" };
        continue;
      }
    }
    if (!cur) continue;
    const c: Cur = cur;

    if (depth === 0) {
      const partM = line.match(/^([a-z])\)\s*(.*)$/);
      if (partM) {
        c.parts.push({ label: partM[1], body: partM[2] ? [partM[2]] : [], answer: [] });
        c.mode = "part";
        continue;
      }
      const ansM = raw.match(/^(>>?)(?:\s(.*))?$/);
      if (ansM) {
        const own = ansM[1] === ">>";
        const text = ansM[2] ?? "";
        const p = c.parts[c.parts.length - 1];
        if (p && (c.mode === "part" || c.mode === "partanswer")) {
          p.answer.push(text);
          if (own) p.own = true;
          c.mode = "partanswer";
        } else {
          c.answer.push(text);
          if (own) c.own = true;
          c.mode = "answer";
        }
        trackDepth(text);
        continue;
      }
      if (line.startsWith("??")) {
        c.mode = "hint";
        c.hint.push(line.slice(2).trim());
        continue;
      }
      if (line.startsWith("!!")) {
        c.mode = "solution";
        c.solution.push(line.slice(2).trim());
        continue;
      }
    }

    trackDepth(line);
    pushCont(raw);
  }
  finish();
  return out;

  function pushCont(raw: string) {
    const c = cur;
    if (!c) return;
    switch (c.mode) {
      case "intro":
        c.intro.push(raw);
        break;
      case "part":
        c.parts[c.parts.length - 1].body.push(raw);
        break;
      case "answer":
        // linjer rett etter et svar (f.eks. en ::plot) hører til svaret
        c.answer.push(raw);
        break;
      case "partanswer":
        c.parts[c.parts.length - 1].answer.push(raw);
        break;
      case "hint":
        c.hint.push(raw);
        break;
      case "solution":
        c.solution.push(raw);
        break;
    }
  }

  function trackDepth(l: string) {
    const t = l.trim();
    if (t.startsWith("::") && t.length > 2) {
      const n = t.slice(2).split(/\s+/)[0];
      if (!SELF_CLOSING.has(n)) depth++;
    } else if (t === "::") depth = Math.max(0, depth - 1);
  }
}
