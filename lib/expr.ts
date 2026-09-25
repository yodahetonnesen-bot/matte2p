// Liten uttrykksparser for funksjonsuttrykk skrevet slik elever skriver dem:
// støtter implisitt multiplikasjon (2x, xe^x, 3(x+1)), desimalkomma (2,5),
// funksjoner uten parentes (ln x, sin 2x) og konstantene e og π.

export type Node =
  | { k: "num"; v: number }
  | { k: "var"; name: string }
  | { k: "neg"; a: Node }
  | { k: "bin"; op: "+" | "-" | "*" | "/" | "^"; a: Node; b: Node }
  | { k: "fn"; name: string; a: Node };

const FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  arcsin: Math.asin,
  arccos: Math.acos,
  arctan: Math.atan,
  ln: Math.log,
  lg: Math.log10,
  log: Math.log10,
  log2: Math.log2,
  exp: Math.exp,
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  floor: Math.floor,
  heltall: Math.floor,
  ceil: Math.ceil,
  sign: Math.sign,
};

const CONSTS: Record<string, number> = { e: Math.E, pi: Math.PI, "π": Math.PI };

// Lengste navn først slik at "asin" matches før "sin", "log2" før "log".
const NAMES = [...Object.keys(FUNCS), "pi"].sort((a, b) => b.length - a.length);

type Tok =
  | { t: "num"; v: number }
  | { t: "id"; v: string }
  | { t: "fn"; v: string }
  | { t: "op"; v: string }
  | { t: "(" }
  | { t: ")" };

export class ExprError extends Error {}

function tokenize(src: string): Tok[] {
  const s = src
    .replace(/[·×⋅∙]/g, "*")
    .replace(/[−–]/g, "-")
    .replace(/÷/g, "/")
    .replace(/√/g, "sqrt")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/\*\*/g, "^")
    .replace(/[[{]/g, "(")
    .replace(/[\]}]/g, ")");
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.,]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9]/.test(s[j])) j++;
      if (j < s.length && (s[j] === "." || s[j] === ",") && /[0-9]/.test(s[j + 1] ?? "")) {
        j++;
        while (j < s.length && /[0-9]/.test(s[j])) j++;
      }
      if (j === i) throw new ExprError(`Uventet tegn «${c}»`);
      out.push({ t: "num", v: parseFloat(s.slice(i, j).replace(",", ".")) });
      i = j;
      continue;
    }
    if (/[a-zA-Zπ]/.test(c)) {
      const rest = s.slice(i);
      const name = NAMES.find((n) => rest.startsWith(n));
      if (name) {
        if (name === "pi") out.push({ t: "id", v: "pi" });
        else out.push({ t: "fn", v: name });
        i += name.length;
      } else {
        out.push({ t: "id", v: c });
        i++;
      }
      continue;
    }
    if ("+-*/^".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
      continue;
    }
    if (c === "(") {
      out.push({ t: "(" });
      i++;
      continue;
    }
    if (c === ")") {
      out.push({ t: ")" });
      i++;
      continue;
    }
    throw new ExprError(`Uventet tegn «${c}»`);
  }
  return out;
}

class Parser {
  private i = 0;
  constructor(private toks: Tok[]) {}
  private peek() {
    return this.toks[this.i];
  }
  private next() {
    return this.toks[this.i++];
  }
  parse(): Node {
    if (this.toks.length === 0) throw new ExprError("Tomt uttrykk");
    const n = this.sum();
    if (this.i < this.toks.length) throw new ExprError("Klarte ikke å lese hele uttrykket");
    return n;
  }
  private sum(): Node {
    let a = this.product();
    for (;;) {
      const t = this.peek();
      if (t && t.t === "op" && (t.v === "+" || t.v === "-")) {
        this.next();
        a = { k: "bin", op: t.v, a, b: this.product() };
      } else return a;
    }
  }
  private startsAtom(t: Tok | undefined) {
    return !!t && (t.t === "num" || t.t === "id" || t.t === "fn" || t.t === "(");
  }
  private product(): Node {
    let a = this.unary();
    for (;;) {
      const t = this.peek();
      if (t && t.t === "op" && (t.v === "*" || t.v === "/")) {
        this.next();
        a = { k: "bin", op: t.v, a, b: this.unary() };
      } else if (this.startsAtom(t)) {
        // implisitt multiplikasjon
        a = { k: "bin", op: "*", a, b: this.power() };
      } else return a;
    }
  }
  private unary(): Node {
    const t = this.peek();
    if (t && t.t === "op" && (t.v === "-" || t.v === "+")) {
      this.next();
      const a = this.unary();
      return t.v === "-" ? { k: "neg", a } : a;
    }
    return this.power();
  }
  private power(): Node {
    const base = this.atom();
    const t = this.peek();
    if (t && t.t === "op" && t.v === "^") {
      this.next();
      // høyreassosiativ, og tillater minus i eksponenten: e^-x
      return { k: "bin", op: "^", a: base, b: this.unary() };
    }
    return base;
  }
  private atom(): Node {
    const t = this.next();
    if (!t) throw new ExprError("Uttrykket slutter for tidlig");
    if (t.t === "num") return { k: "num", v: t.v };
    if (t.t === "id") {
      if (t.v in CONSTS) return { k: "num", v: CONSTS[t.v] };
      return { k: "var", name: t.v };
    }
    if (t.t === "fn") {
      // ln(x) eller ln x  (ln x^2 = ln(x^2), som i læreboka)
      const nt = this.peek();
      if (nt && nt.t === "(") {
        this.next();
        const a = this.sum();
        this.expect(")");
        // sin(x)^2 tolkes som (sin x)^2
        return { k: "fn", name: t.v, a };
      }
      return { k: "fn", name: t.v, a: this.power() };
    }
    if (t.t === "(") {
      const a = this.sum();
      this.expect(")");
      return a;
    }
    throw new ExprError("Uventet operator");
  }
  private expect(c: ")") {
    const t = this.next();
    if (!t || t.t !== c) throw new ExprError("Mangler høyreparentes");
  }
}

export function parse(src: string): Node {
  return new Parser(tokenize(src)).parse();
}

export function evaluate(n: Node, vars: Record<string, number>): number {
  switch (n.k) {
    case "num":
      return n.v;
    case "var": {
      const v = vars[n.name];
      if (v === undefined) throw new ExprError(`Ukjent variabel «${n.name}»`);
      return v;
    }
    case "neg":
      return -evaluate(n.a, vars);
    case "fn":
      return FUNCS[n.name](evaluate(n.a, vars));
    case "bin": {
      const a = evaluate(n.a, vars);
      const b = evaluate(n.b, vars);
      switch (n.op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return a / b;
        case "^":
          return pow(a, b);
      }
    }
  }
}

// Reell potens: tillater (-8)^(1/3) = -2 når eksponenten er en brøk med odde nevner.
function pow(a: number, b: number) {
  if (a >= 0 || Number.isInteger(b)) return Math.pow(a, b);
  for (const q of [3, 5, 7, 9]) {
    const p = b * q;
    if (Math.abs(p - Math.round(p)) < 1e-9) {
      const r = Math.pow(-a, b);
      return Math.round(p) % 2 === 0 ? r : -r;
    }
  }
  return NaN;
}

export function variables(n: Node, acc = new Set<string>()): Set<string> {
  if (n.k === "var") acc.add(n.name);
  else if (n.k === "neg" || n.k === "fn") variables(n.a, acc);
  else if (n.k === "bin") {
    variables(n.a, acc);
    variables(n.b, acc);
  }
  return acc;
}

/** Lager en funksjon av én variabel. Ukjent/ugyldig uttrykk gir NaN overalt. */
export function fn1(src: string, v = "x", extra: Record<string, number> = {}) {
  const node = parse(src);
  return (x: number) => {
    try {
      return evaluate(node, { ...extra, [v]: x });
    } catch {
      return NaN;
    }
  };
}

export function tryFn1(src: string, v = "x", extra: Record<string, number> = {}) {
  try {
    return fn1(src, v, extra);
  } catch {
    return null;
  }
}

/** Numerisk derivert (sentraldifferanse). */
export function deriv(f: (x: number) => number, h = 1e-5) {
  return (x: number) => (f(x + h) - f(x - h)) / (2 * h);
}

/**
 * Sjekker om to uttrykk er like ved å sammenlikne dem i mange tilfeldige punkter.
 * Punkter der ett av uttrykkene ikke er definert, hoppes over.
 */
export function equivalent(
  a: string,
  b: string,
  opts: { v?: string; lo?: number; hi?: number; tol?: number } = {},
): boolean {
  const { v = "x", lo = -4, hi = 4, tol = 1e-6 } = opts;
  let fa: (x: number) => number, fb: (x: number) => number;
  try {
    fa = fn1(a, v);
    fb = fn1(b, v);
    const va = variables(parse(a));
    va.delete(v);
    if (va.size) return false;
  } catch {
    return false;
  }
  let checked = 0;
  for (let i = 0; i < 60 && checked < 14; i++) {
    const x = lo + ((hi - lo) * (i * 0.6180339887 + 0.1234)) % (hi - lo);
    const ya = fa(x);
    const yb = fb(x);
    if (!Number.isFinite(ya) || !Number.isFinite(yb)) {
      if (Number.isFinite(ya) !== Number.isFinite(yb) && Math.abs(ya) < 1e6 && Math.abs(yb) < 1e6) {
        // definert for det ene, men ikke det andre – tell ikke med
      }
      continue;
    }
    const scale = Math.max(1, Math.abs(ya), Math.abs(yb));
    if (Math.abs(ya - yb) > tol * scale) return false;
    checked++;
  }
  return checked >= 4;
}

/** Leser et tall skrevet med komma eller punktum, brøk, √ eller enkle uttrykk som 2/3, ln 5, e^2. */
export function parseNumber(src: string): number | null {
  const s = src.trim();
  if (!s) return null;
  try {
    const node = parse(s);
    if (variables(node).size) return null;
    const v = evaluate(node, {});
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

const TEXFN: Record<string, string> = {
  ln: "\\ln",
  lg: "\\lg",
  log: "\\lg",
  sin: "\\sin",
  cos: "\\cos",
  tan: "\\tan",
  exp: "\\exp",
};

function prec(n: Node): number {
  if (n.k === "bin") return n.op === "+" || n.op === "-" ? 1 : n.op === "*" || n.op === "/" ? 2 : 4;
  if (n.k === "neg") return 1.5;
  return 5;
}

/** Gjør et uttrykk om til TeX (brukes til forhåndsvisning av det eleven skriver). */
export function toTex(n: Node): string {
  const wrap = (c: Node, p: number) => (prec(c) < p ? `\\left(${toTex(c)}\\right)` : toTex(c));
  switch (n.k) {
    case "num": {
      if (Math.abs(n.v - Math.PI) < 1e-12) return "\\pi";
      if (Math.abs(n.v - Math.E) < 1e-12) return "e";
      return String(n.v).replace(".", "{,}");
    }
    case "var":
      return n.name;
    case "neg":
      return "-" + wrap(n.a, 2);
    case "fn":
      if (n.name === "sqrt") return `\\sqrt{${toTex(n.a)}}`;
      if (n.name === "cbrt") return `\\sqrt[3]{${toTex(n.a)}}`;
      if (n.name === "abs") return `\\left|${toTex(n.a)}\\right|`;
      if (n.name === "exp") return `e^{${toTex(n.a)}}`;
      return `${TEXFN[n.name] ?? `\\operatorname{${n.name}}`}\\left(${toTex(n.a)}\\right)`;
    case "bin":
      switch (n.op) {
        case "+":
          return `${toTex(n.a)} + ${toTex(n.b)}`;
        case "-":
          return `${toTex(n.a)} - ${wrap(n.b, 2)}`;
        case "*": {
          const a = wrap(n.a, 2);
          const b = wrap(n.b, 2);
          const needDot = n.b.k === "num" || (n.b.k === "bin" && n.b.op === "^" && n.b.a.k === "num") || n.b.k === "neg";
          return needDot ? `${a}\\cdot ${b}` : `${a}\\,${b}`;
        }
        case "/":
          return `\\frac{${toTex(n.a)}}{${toTex(n.b)}}`;
        case "^":
          return `${n.a.k === "fn" && n.a.name !== "sqrt" ? `\\left(${toTex(n.a)}\\right)` : wrap(n.a, 5)}^{${toTex(n.b)}}`;
      }
  }
}

export function formatNum(x: number, digits = 3): string {
  if (!Number.isFinite(x)) return "–";
  if (Math.abs(x) < 1e-12) return "0";
  const r = Number(x.toFixed(digits));
  return String(r).replace(".", ",").replace("-", "−");
}
