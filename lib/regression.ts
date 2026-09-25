// Regresjon slik GeoGebra gjør det: minste kvadraters metode. Eksponentiell og
// potensmodell tilpasses på logaritmisk skala (ln y mot x, og ln y mot ln x),
// som gir de samme tallene som i læreboka, f.eks. f(x) = 300 · 1,043^x.

export type ModelKind = "lineaer" | "eksponentiell" | "potens" | "andregrad";

export const MODEL_LABEL: Record<ModelKind, string> = {
  lineaer: "Lineær",
  eksponentiell: "Eksponentiell",
  potens: "Potens",
  andregrad: "Andregrad",
};

export type Fit = {
  kind: ModelKind;
  f: (x: number) => number;
  params: number[]; // lineær [a, b], eksp. [a, k], potens [a, b], andregrad [a, b, c]
  r2: number;
  ok: boolean;
  msg?: string;
};

function linfit(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0,
    sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  const a = sxx ? sxy / sxx : 0;
  return { a, b: my - a * mx };
}

function rsq(xs: number[], ys: number[], f: (x: number) => number) {
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let sse = 0,
    sst = 0;
  for (let i = 0; i < xs.length; i++) {
    sse += (ys[i] - f(xs[i])) ** 2;
    sst += (ys[i] - my) ** 2;
  }
  return sst ? 1 - sse / sst : 1;
}

function solve3(A: number[][], v: number[]): number[] | null {
  const M = A.map((r, i) => [...r, v[i]]);
  for (let c = 0; c < 3; c++) {
    let p = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return null;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 3; r++) {
      if (r === c) continue;
      const k = M[r][c] / M[c][c];
      for (let j = c; j < 4; j++) M[r][j] -= k * M[c][j];
    }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
}

export function fitModel(kind: ModelKind, pts: [number, number][]): Fit {
  const bad = (msg: string): Fit => ({ kind, f: () => NaN, params: [], r2: NaN, ok: false, msg });
  const xs = pts.map((p) => p[0]),
    ys = pts.map((p) => p[1]);
  if (pts.length < (kind === "andregrad" ? 3 : 2)) return bad("For få punkter.");
  if (kind === "lineaer") {
    const { a, b } = linfit(xs, ys);
    const f = (x: number) => a * x + b;
    return { kind, f, params: [a, b], r2: rsq(xs, ys, f), ok: true };
  }
  if (kind === "eksponentiell") {
    if (ys.some((y) => y <= 0)) return bad("Eksponentiell modell krever at alle y-verdiene er positive.");
    const { a: lk, b: la } = linfit(xs, ys.map(Math.log));
    const a = Math.exp(la),
      k = Math.exp(lk);
    const f = (x: number) => a * Math.pow(k, x);
    return { kind, f, params: [a, k], r2: rsq(xs, ys, f), ok: true };
  }
  if (kind === "potens") {
    if (ys.some((y) => y <= 0) || xs.some((x) => x <= 0)) return bad("Potensmodell krever at alle x- og y-verdiene er positive.");
    const { a: b, b: la } = linfit(xs.map(Math.log), ys.map(Math.log));
    const a = Math.exp(la);
    const f = (x: number) => a * Math.pow(x, b);
    return { kind, f, params: [a, b], r2: rsq(xs, ys, f), ok: true };
  }
  // andregrad: y = ax² + bx + c
  let s0 = 0,
    s1 = 0,
    s2 = 0,
    s3 = 0,
    s4 = 0,
    t0 = 0,
    t1 = 0,
    t2 = 0;
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i],
      y = ys[i];
    s0 += 1;
    s1 += x;
    s2 += x * x;
    s3 += x ** 3;
    s4 += x ** 4;
    t0 += y;
    t1 += x * y;
    t2 += x * x * y;
  }
  const sol = solve3(
    [
      [s4, s3, s2],
      [s3, s2, s1],
      [s2, s1, s0],
    ],
    [t2, t1, t0],
  );
  if (!sol) return bad("Klarte ikke å tilpasse en andregradsfunksjon.");
  const [a, b, c] = sol;
  const f = (x: number) => a * x * x + b * x + c;
  return { kind, f, params: [a, b, c], r2: rsq(xs, ys, f), ok: true };
}

/** Tall med norsk desimalkomma for bruk i TeX, med d desimaler (uten unødvendige nuller). */
export function texNum(x: number, d = 3): string {
  if (!Number.isFinite(x)) return "?";
  let s = x.toFixed(d);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  if (s === "-0") s = "0";
  return s.replace(".", "{,}");
}

/** Signifikante siffer, f.eks. 300,1 eller 1,043 */
export function sig(x: number, n = 4): number {
  if (!Number.isFinite(x) || x === 0) return x;
  return Number(x.toPrecision(n));
}

export function modelTex(fit: Fit, name = "f"): string {
  if (!fit.ok) return "";
  const p = fit.params;
  const num = (v: number, d: number) => texNum(v, d);
  const plus = (v: number, d: number) => (v < 0 ? ` - ${num(-v, d)}` : ` + ${num(v, d)}`);
  switch (fit.kind) {
    case "lineaer":
      return `${name}(x) = ${num(p[0], 3)}x${plus(p[1], 2)}`;
    case "eksponentiell": {
      const kd = Math.abs(p[1] - 1) < 0.01 ? 4 : 3;
      return `${name}(x) = ${num(p[0], p[0] >= 100 ? 0 : 2)}\\cdot ${num(p[1], kd)}^{x}`;
    }
    case "potens":
      return `${name}(x) = ${num(p[0], 3)}\\cdot x^{${num(p[1], 3)}}`;
    case "andregrad":
      return `${name}(x) = ${num(p[0], 4)}x^2${plus(p[1], 3)}x${plus(p[2], 2)}`;
  }
}
