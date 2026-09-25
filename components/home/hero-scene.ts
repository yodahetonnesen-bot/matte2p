/**
 * Tegner forsidens «matematikkfilm» på et canvas. Alt er en ren funksjon av
 * scroll-fremdriften `s` (0–1) og tida `t` – samme `s` gir samme bilde, slik
 * at scrolling fungerer som å spole i en video.
 */

export const STAGES = 4;

const C = {
  bg0: "#090c18",
  bg1: "#161c38",
  grid: "rgba(150,165,255,0.075)",
  axis: "rgba(205,214,255,0.34)",
  ink: "rgba(236,240,255,0.92)",
  muted: "rgba(200,208,240,0.6)",
  indigo: "#8e9bff",
  coral: "#ff7d88",
  green: "#5fe3aa",
  amber: "#ffc56e",
  violet: "#d690ff",
  cyan: "#6fd8ff",
};

export type Camera = { cx: number; cy: number; unit: number };

export type Particle = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; tw: number };

/** Gitterpunkter (heltallige koordinater) – et utvalg av dem tegnes som prikker i planet. */
export function makeParticles(n = 110): Particle[] {
  const out: Particle[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const used = new Set<string>();
  while (out.length < n) {
    const hx = Math.round((rnd() - 0.5) * 22);
    const hy = Math.round((rnd() - 0.5) * 11);
    const key = `${hx},${hy}`;
    if (used.has(key) || used.size > 240) {
      if (used.size > 240) break;
      continue;
    }
    used.add(key);
    out.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, r: 1.3 + rnd() * 0.9, tw: rnd() * Math.PI * 2 });
  }
  return out;
}

/**
 * Fjærfysikk for partiklene: hver partikkel trekkes mot hjemmeposisjonen sin
 * (Hookes lov med demping) og dyttes bort fra pekeren.
 */
export function stepParticles(ps: Particle[], dt: number, pointer: { x: number; y: number } | null, drift: number) {
  const k = 18,
    damp = 5.2,
    R = 1.9;
  for (const p of ps) {
    const hx = p.hx + Math.sin(drift * 0.35 + p.tw) * 0.04;
    const hy = p.hy + Math.cos(drift * 0.3 + p.tw * 1.3) * 0.04;
    let ax = k * (hx - p.x) - damp * p.vx;
    let ay = k * (hy - p.y) - damp * p.vy;
    if (pointer) {
      const dx = p.x - pointer.x,
        dy = p.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        const f = (1 - d / R) * 140;
        ax += (dx / d) * f;
        ay += (dy / d) * f;
      }
    }
    p.vx += ax * dt;
    p.vy += ay * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x: number) => {
  const u = clamp(x);
  return u * u * (3 - 2 * u);
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

/** Vekt (0–1) for scene i ved fremdrift s: myk inn- og uttoning med et platå. */
export function stageWeight(i: number, s: number) {
  const k = s * (STAGES - 1);
  return smooth(1.35 - Math.abs(k - i) * 1.35);
}
/** Lokal fremdrift (0–1) innenfor scene i. */
function local(i: number, s: number) {
  return clamp(s * (STAGES - 1) - i + 0.5);
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  dpr: number,
  cam: Camera,
  s: number,
  t: number,
  particles: Particle[],
) {
  const X = (x: number) => cam.cx + x * cam.unit;
  const Y = (y: number) => cam.cy - y * cam.unit;
  const u = cam.unit;
  const lw = (px: number) => px * dpr * clamp(u / (40 * dpr), 0.75, 1.6);

  // bakgrunn
  const g = ctx.createRadialGradient(cam.cx, cam.cy - u * 1.5, u * 0.5, cam.cx, cam.cy, Math.max(W, H) * 0.8);
  g.addColorStop(0, C.bg1);
  g.addColorStop(1, C.bg0);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // synlig område i verdenskoordinater
  const x0 = (0 - cam.cx) / u,
    x1 = (W - cam.cx) / u;
  const y0 = (cam.cy - H) / u,
    y1 = cam.cy / u;

  // rutenett
  ctx.lineWidth = Math.max(1, dpr);
  ctx.strokeStyle = C.grid;
  ctx.beginPath();
  for (let gx = Math.ceil(x0); gx <= x1; gx++) {
    ctx.moveTo(X(gx), 0);
    ctx.lineTo(X(gx), H);
  }
  for (let gy = Math.ceil(y0); gy <= y1; gy++) {
    ctx.moveTo(0, Y(gy));
    ctx.lineTo(W, Y(gy));
  }
  ctx.stroke();

  // partikler
  for (const p of particles) {
    const a = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.3 + p.tw));
    ctx.fillStyle = `rgba(190,200,255,${a})`;
    ctx.beginPath();
    ctx.arc(X(p.x), Y(p.y), p.r * dpr, 0, Math.PI * 2);
    ctx.fill();
  }

  // akser
  ctx.strokeStyle = C.axis;
  ctx.lineWidth = lw(1.4);
  ctx.beginPath();
  ctx.moveTo(0, Y(0));
  ctx.lineTo(W, Y(0));
  ctx.moveTo(X(0), 0);
  ctx.lineTo(X(0), H);
  ctx.stroke();

  const curve = (f: (x: number) => number, a: number, b: number, color: string, width: number, alpha: number, glow = true) => {
    if (alpha <= 0.001 || b <= a) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lw(width);
    ctx.lineJoin = ctx.lineCap = "round";
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 18 * dpr;
    }
    ctx.beginPath();
    const n = 220;
    let pen = false;
    for (let i = 0; i <= n; i++) {
      const x = a + ((b - a) * i) / n;
      const y = f(x);
      if (!Number.isFinite(y) || y > y1 + 2 || y < y0 - 2) {
        pen = false;
        continue;
      }
      if (pen) ctx.lineTo(X(x), Y(y));
      else ctx.moveTo(X(x), Y(y));
      pen = true;
    }
    ctx.stroke();
    ctx.restore();
  };
  const seg = (ax: number, ay: number, bx: number, by: number, color: string, width: number, alpha: number, dash?: number[]) => {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lw(width);
    ctx.lineCap = "round";
    if (dash) ctx.setLineDash(dash.map((d) => d * dpr));
    ctx.beginPath();
    ctx.moveTo(X(ax), Y(ay));
    ctx.lineTo(X(bx), Y(by));
    ctx.stroke();
    ctx.restore();
  };
  const arrow = (ax: number, ay: number, bx: number, by: number, color: string, alpha: number) => {
    if (alpha <= 0.001) return;
    const L = Math.hypot(bx - ax, by - ay);
    if (L < 1e-3) return;
    const ux = (bx - ax) / L,
      uy = (by - ay) / L;
    const h = Math.min(0.32, L * 0.4);
    seg(ax, ay, bx - ux * h * 0.7, by - uy * h * 0.7, color, 3, alpha);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12 * dpr;
    ctx.beginPath();
    ctx.moveTo(X(bx), Y(by));
    ctx.lineTo(X(bx - ux * h - uy * h * 0.45), Y(by - uy * h + ux * h * 0.45));
    ctx.lineTo(X(bx - ux * h + uy * h * 0.45), Y(by - uy * h - ux * h * 0.45));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  const dot = (x: number, y: number, color: string, alpha: number, r = 5, halo = true) => {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (halo) {
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * (0.18 + 0.08 * Math.sin(t * 3));
      ctx.beginPath();
      ctx.arc(X(x), Y(y), r * 3.2 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha;
    }
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14 * dpr;
    ctx.beginPath();
    ctx.arc(X(x), Y(y), r * dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  const label = (text: string, x: number, y: number, color: string, alpha: number, align: CanvasTextAlign = "left") => {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = `${Math.round(13 * dpr * clamp(u / (40 * dpr), 0.85, 1.5))}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = align;
    ctx.fillText(text, X(x), Y(y));
    ctx.restore();
  };

  // ---------- scene 0: rett linje – stigningstallet som et trappetrinn som glir langs linja
  const w0 = stageWeight(0, s);
  if (w0 > 0.001) {
    const lt = local(0, s);
    const m = 0.6,
      b = -1.2;
    const f = (x: number) => m * x + b;
    const reveal = lerp(0.3, 1, smooth(w0 * 1.3));
    curve(f, x0, x0 + (x1 - x0) * reveal, C.indigo, 3.4, w0);
    const a = lerp(-3.6, 2.2, lt) + 0.35 * Math.sin(t * 0.6);
    const run = 2;
    // trappetrinn: Δx = 2 bortover, Δy = 2·0,6 = 1,2 opp
    seg(a, f(a), a + run, f(a), C.amber, 2.6, w0);
    seg(a + run, f(a), a + run, f(a + run), C.coral, 2.6, w0);
    dot(a, f(a), C.ink, w0, 4.5, false);
    dot(a + run, f(a + run), C.ink, w0, 4.5, false);
    dot(0, b, C.green, w0, 5);
    label("Δx = 2", a + run / 2, f(a) - 0.45, C.amber, w0, "center");
    label("Δy = 1,2", a + run + 0.25, (f(a) + f(a + run)) / 2, C.coral, w0);
    label("b = −1,2", 0.25, b - 0.35, C.green, w0 * 0.9);
    label("a = Δy/Δx = 0,6", a - 0.2, f(a) + 0.75, C.ink, w0, "right");
  }

  // ---------- scene 1: eksponentiell vekst – søyler som ganges med vekstfaktoren
  const w1 = stageWeight(1, s);
  if (w1 > 0.001) {
    const lt = local(1, s);
    const k = 1.45,
      a0 = 0.45,
      xs0 = -4;
    const g = (x: number) => a0 * Math.pow(k, x - xs0);
    const n = Math.floor(lerp(1, 9.2, smooth(lt * 1.15)));
    ctx.save();
    for (let i = 0; i < n; i++) {
      const x = xs0 + i;
      const h = g(x) - 0.0;
      ctx.globalAlpha = w1 * 0.3;
      ctx.fillStyle = C.green;
      ctx.fillRect(X(x - 0.32), Y(Math.min(h, y1 + 1)), 0.64 * u, Y(0) - Y(Math.min(h, y1 + 1)));
    }
    ctx.restore();
    curve(g, xs0, Math.min(x1, xs0 + Math.max(0.2, n - 1)), C.green, 3.2, w1);
    for (let i = 0; i < n; i++) dot(xs0 + i, g(xs0 + i), C.green, w1, 4, i === n - 1);
    for (let i = 1; i < Math.min(n, 7); i++) {
      const xa = xs0 + i - 1,
        xb = xs0 + i;
      label("·1,45", (xa + xb) / 2, Math.max(g(xa), g(xb)) + 0.45, C.muted, w1 * 0.85, "center");
    }
    label("B · 1,45ⁿ", xs0 + n - 1 + 0.3, g(xs0 + n - 1) - 0.1, C.ink, w1);
  }

  // ---------- scene 2: histogram – søyler med ulik bredde, arealet er frekvensen
  const w2 = stageWeight(2, s);
  if (w2 > 0.001) {
    const lt = local(2, s);
    const bins: [number, number, number][] = [
      [-4, -2, 1.1],
      [-2, -1, 2.0],
      [-1, 0, 3.3],
      [0, 1, 3.7],
      [1, 2, 2.6],
      [2, 4, 1.0],
    ];
    bins.forEach(([p, q, h], i) => {
      const grow = smooth(clamp(lt * 2.2 - i * 0.18));
      const hh = h * grow;
      ctx.save();
      ctx.globalAlpha = w2 * 0.55;
      ctx.fillStyle = i % 2 ? C.amber : "#ffb347";
      ctx.fillRect(X(p), Y(hh), (q - p) * u, Y(0) - Y(hh));
      ctx.globalAlpha = w2;
      ctx.strokeStyle = C.amber;
      ctx.lineWidth = lw(2);
      ctx.strokeRect(X(p), Y(hh), (q - p) * u, Y(0) - Y(hh));
      ctx.restore();
      if (grow > 0.9) label(String(Math.round(h * (q - p) * 10)), (p + q) / 2, hh + 0.25, C.ink, w2 * (grow - 0.9) * 10, "center");
    });
    label("søylehøyde = frekvens / bredde", -4, 4.1 < y1 ? 3.9 : y1 - 0.5, C.ink, w2);
  }

  // ---------- scene 3: gjennomsnitt og median på en tallinje
  const w3 = stageWeight(3, s);
  if (w3 > 0.001) {
    const lt = local(3, s);
    const data = [-3, -1, 0, 0, 1, 1, 1, 2, 4, 5];
    const mean = data.reduce((p, q) => p + q, 0) / data.length;
    const sorted = [...data].sort((p, q) => p - q);
    const med = (sorted[4] + sorted[5]) / 2;
    const seen = new Map<number, number>();
    data.forEach((x, i) => {
      const kk = seen.get(x) ?? 0;
      seen.set(x, kk + 1);
      const land = smooth(clamp(lt * 2.4 - i * 0.12));
      const yy = lerp(4.2, 0.35 + kk * 0.62, land);
      dot(x, yy, C.cyan, w3, 5.5, false);
    });
    const show = smooth(clamp(lt * 2.4 - 1.3));
    // balansepunkt (trekant) under gjennomsnittet
    ctx.save();
    ctx.globalAlpha = w3 * show;
    ctx.fillStyle = C.coral;
    ctx.beginPath();
    ctx.moveTo(X(mean), Y(-0.08));
    ctx.lineTo(X(mean - 0.28), Y(-0.6));
    ctx.lineTo(X(mean + 0.28), Y(-0.6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    seg(med, -0.1, med, 3.2, C.green, 2.2, w3 * show, [6, 5]);
    label(`gjennomsnitt = ${mean.toFixed(1).replace(".", ",")}`, mean + 0.35, -1.05, C.coral, w3 * show);
    label(`median = ${String(med).replace(".", ",")}`, med - 0.2, 3.45, C.green, w3 * show, "right");
  }

  // vignett
  const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
  v.addColorStop(0, "rgba(5,7,16,0)");
  v.addColorStop(1, "rgba(5,7,16,0.55)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}
