import "server-only";
import fs from "node:fs";
import path from "node:path";
import { parseExercises, parseMarkup, type Block, type Category, type Exercise } from "./markup";
import { CHAPTERS } from "./chapters";

const ROOT = path.join(process.cwd(), "content");

function read(rel: string): string | null {
  const p = path.join(ROOT, rel);
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

const theoryCache = new Map<string, Block[] | null>();
export function getTheory(slug: string): Block[] | null {
  if (theoryCache.has(slug)) return theoryCache.get(slug)!;
  const n = slug.split("-")[0];
  const src = read(`k${n}/${slug}.md`);
  const blocks = src ? parseMarkup(src) : null;
  theoryCache.set(slug, blocks);
  return blocks;
}

export function getChapterText(n: number, name: "sammendrag" | "intro" | "prosjekt"): Block[] | null {
  const src = read(`k${n}/${name}.md`);
  return src ? parseMarkup(src) : null;
}

const exCache = new Map<number, Exercise[]>();
export function getExercises(n: number): Exercise[] {
  const hit = exCache.get(n);
  if (hit) return hit;
  const list: Exercise[] = [];
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(path.join(ROOT, `k${n}`, "oppg"))
      .filter((f) => f.endsWith(".md"))
      .map((f) => `k${n}/oppg/${f}`);
  } catch {
    files = [];
  }
  for (const f of [`k${n}/oppgaver.md`, `k${n}/ovmer.md`, ...files]) {
    const src = read(f);
    if (src) list.push(...parseExercises(src, n));
  }
  const key = (e: Exercise) => e.num.split(".").map((x) => parseInt(x, 10) || 0);
  list.sort((a, b) => {
    const c = CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat);
    if (c) return c;
    const ka = key(a),
      kb = key(b);
    for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
      const d = (ka[i] ?? 0) - (kb[i] ?? 0);
      if (d) return d;
    }
    return 0;
  });
  exCache.set(n, list);
  return list;
}

const CAT_ORDER: Category[] = ["teori", "repetisjon", "ovmer", "blandet", "apen"];

export function getAllExercises(): Exercise[] {
  return CHAPTERS.flatMap((c) => getExercises(c.n));
}

export function exercisesFor(n: number, opts: { section?: string; cat?: Category }) {
  return getExercises(n).filter((e) => (!opts.section || e.section === opts.section) && (!opts.cat || e.cat === opts.cat));
}

export function countByCategory(n: number) {
  const out: Record<Category, number> = { teori: 0, repetisjon: 0, ovmer: 0, blandet: 0, apen: 0 };
  for (const e of getExercises(n)) out[e.cat]++;
  return out;
}

export function headingsOf(blocks: Block[] | null) {
  return (blocks ?? []).filter((b): b is Extract<Block, { t: "h" }> => b.t === "h" && b.level === 2);
}
