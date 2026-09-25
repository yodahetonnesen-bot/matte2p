// Numeriske hjelpefunksjoner: nullpunkter, ekstremalpunkter og pene tall.

export function roots(f: (x: number) => number, a: number, b: number, n = 2400): number[] {
  const out: number[] = [];
  let x0 = a;
  let y0 = f(x0);
  for (let i = 1; i <= n; i++) {
    const x1 = a + ((b - a) * i) / n;
    const y1 = f(x1);
    if (Number.isFinite(y0) && Number.isFinite(y1)) {
      if (y0 === 0) out.push(x0);
      else if (y0 * y1 < 0) {
        // unngå falske nullpunkter ved asymptoter (stort hopp)
        const r = bisect(f, x0, x1);
        if (r !== null && Math.abs(f(r)) < 1e-6 * Math.max(1, Math.abs(y0), Math.abs(y1))) out.push(r);
      }
    }
    x0 = x1;
    y0 = y1;
  }
  return dedupe(out);
}

/** Nullpunkter der funksjonen berører 0 uten å skifte fortegn (lokalt minimum av |f| som er ~0). */
export function touchRoots(f: (x: number) => number, a: number, b: number, n = 2400): number[] {
  const out: number[] = [];
  const h = (b - a) / n;
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    const l = Math.abs(f(x - h)),
      m = Math.abs(f(x)),
      r = Math.abs(f(x + h));
    if (m <= l && m <= r && m < 1e-4) {
      const s1 = Math.sign(f(x - 5 * h)),
        s2 = Math.sign(f(x + 5 * h));
      if (s1 === s2 && s1 !== 0) out.push(refineMin((t) => Math.abs(f(t)), x - h, x + h));
    }
  }
  return dedupe(out);
}

function refineMin(g: (x: number) => number, a: number, b: number) {
  for (let i = 0; i < 60; i++) {
    const m1 = a + (b - a) / 3,
      m2 = b - (b - a) / 3;
    if (g(m1) < g(m2)) b = m2;
    else a = m1;
  }
  return (a + b) / 2;
}

function bisect(f: (x: number) => number, a: number, b: number): number | null {
  let fa = f(a);
  for (let i = 0; i < 80; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (!Number.isFinite(fm)) return null;
    if (fm === 0) return m;
    if (fa * fm < 0) b = m;
    else {
      a = m;
      fa = fm;
    }
  }
  return (a + b) / 2;
}

function dedupe(xs: number[]) {
  const s = xs.sort((p, q) => p - q);
  const out: number[] = [];
  for (const x of s) if (!out.length || Math.abs(x - out[out.length - 1]) > 1e-5) out.push(snap(x));
  return out;
}

/** Runder av til «pene» verdier når det er svært nær (heltall, halve, tredjedeler …). */
export function snap(x: number) {
  for (const d of [1, 2, 3, 4, 5, 6, 8, 10]) {
    const r = Math.round(x * d) / d;
    if (Math.abs(r - x) < 1e-7) return r;
  }
  return x;
}

/** Gjør et tall om til TeX, som brøk hvis mulig. */
export function niceTex(x: number, digits = 3): string {
  if (!Number.isFinite(x)) return "\\text{–}";
  if (Math.abs(x) < 1e-10) return "0";
  const sgn = x < 0 ? "-" : "";
  const ax = Math.abs(x);
  for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]) {
    const nmr = Math.round(ax * d);
    if (Math.abs(nmr / d - ax) < 1e-8 && nmr < 1000) {
      return d === 1 ? `${sgn}${nmr}` : `${sgn}\\tfrac{${nmr}}{${d}}`;
    }
  }
  // √-former
  for (const k of [2, 3, 5, 6, 7]) {
    const c = ax / Math.sqrt(k);
    for (const d of [1, 2, 3, 4]) {
      const nmr = Math.round(c * d);
      if (nmr > 0 && Math.abs(nmr / d - c) < 1e-8) {
        const coef = nmr === 1 ? "" : String(nmr);
        return d === 1 ? `${sgn}${coef}\\sqrt{${k}}` : `${sgn}\\tfrac{${coef}\\sqrt{${k}}}{${d}}`;
      }
    }
  }
  return sgn + Number(ax.toFixed(digits)).toString().replace(".", "{,}");
}
