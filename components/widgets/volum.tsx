"use client";

import { useState } from "react";
import { Chips, Readout, Slider, WidgetCard, tnok } from "./ui";

type Shape = "prisme" | "sylinder" | "kule" | "kjegle";

/** Volum og overflate av prisme, sylinder, kule og kjegle – med omregning til liter. */
export function VolumWidget({ props }: { props: Record<string, string> }) {
  const [shape, setShape] = useState<Shape>((props.figur as Shape) ?? "sylinder");
  const [l, setL] = useState(40);
  const [b, setB] = useState(30);
  const [h, setH] = useState(20);
  const [r, setR] = useState(10);
  let V = 0,
    O = 0,
    formula = "",
    ofml = "";
  if (shape === "prisme") {
    V = l * b * h;
    O = 2 * (l * b + l * h + b * h);
    formula = `V = G\\cdot h = ${l}\\cdot ${b}\\cdot ${h}`;
    ofml = `O = 2(lb + lh + bh)`;
  } else if (shape === "sylinder") {
    V = Math.PI * r * r * h;
    O = 2 * Math.PI * r * r + 2 * Math.PI * r * h;
    formula = `V = \\pi r^2 h = \\pi\\cdot ${r}^2\\cdot ${h}`;
    ofml = "O = 2\\pi r^2 + 2\\pi r h";
  } else if (shape === "kule") {
    V = (4 / 3) * Math.PI * r ** 3;
    O = 4 * Math.PI * r * r;
    formula = `V = \\tfrac43\\pi r^3 = \\tfrac43\\pi\\cdot ${r}^3`;
    ofml = "O = 4\\pi r^2";
  } else {
    V = (Math.PI * r * r * h) / 3;
    const s = Math.hypot(r, h);
    O = Math.PI * r * r + Math.PI * r * s;
    formula = `V = \\tfrac13 G h = \\tfrac13\\pi\\cdot ${r}^2\\cdot ${h}`;
    ofml = "O = \\pi r^2 + \\pi r s,\\ s = \\sqrt{r^2 + h^2}";
  }
  // enkel tegning, skalert inn i 260 × 190
  const k = 150 / Math.max(shape === "prisme" ? Math.max(l, b * 0.6 + h) : Math.max(2 * r, h + r * 0.5), 1);
  const draw = () => {
    if (shape === "prisme") {
      const L = l * k * 0.8,
        Hh = h * k * 0.8,
        D = b * k * 0.4;
      const x0 = 130 - (L + D) / 2,
        y0 = 175;
      return (
        <g className="geo">
          <polygon points={`${x0},${y0} ${x0 + L},${y0} ${x0 + L},${y0 - Hh} ${x0},${y0 - Hh}`} fill="var(--plot-1)" fillOpacity={0.12} stroke="var(--plot-ink)" strokeWidth={2} />
          <polygon points={`${x0},${y0 - Hh} ${x0 + D},${y0 - Hh - D} ${x0 + L + D},${y0 - Hh - D} ${x0 + L},${y0 - Hh}`} fill="var(--plot-1)" fillOpacity={0.22} stroke="var(--plot-ink)" strokeWidth={2} />
          <polygon points={`${x0 + L},${y0} ${x0 + L + D},${y0 - D} ${x0 + L + D},${y0 - Hh - D} ${x0 + L},${y0 - Hh}`} fill="var(--plot-1)" fillOpacity={0.3} stroke="var(--plot-ink)" strokeWidth={2} />
          <path d={`M${x0},${y0} L${x0 + D},${y0 - D} L${x0 + L + D},${y0 - D} M${x0 + D},${y0 - D} L${x0 + D},${y0 - Hh - D}`} fill="none" stroke="var(--plot-muted)" strokeDasharray="5 4" strokeWidth={1.4} />
          <text x={x0 + L / 2} y={y0 + 16} textAnchor="middle" className="plot-num">l = {l}</text>
          <text x={x0 - 6} y={y0 - Hh / 2} textAnchor="end" className="plot-num">h = {h}</text>
          <text x={x0 + L + D / 2 + 6} y={y0 - D / 2 + 12} className="plot-num">b = {b}</text>
        </g>
      );
    }
    if (shape === "kule") {
      const R = r * k;
      return (
        <g>
          <circle cx={130} cy={100} r={R} fill="var(--plot-3)" fillOpacity={0.15} stroke="var(--plot-ink)" strokeWidth={2} />
          <ellipse cx={130} cy={100} rx={R} ry={R * 0.28} fill="none" stroke="var(--plot-muted)" strokeDasharray="5 4" strokeWidth={1.4} />
          <line x1={130} y1={100} x2={130 + R} y2={100} stroke="var(--plot-2)" strokeWidth={2} />
          <circle cx={130} cy={100} r={2.5} fill="var(--plot-ink)" />
          <text x={130 + R / 2} y={94} textAnchor="middle" className="plot-num">r = {r}</text>
        </g>
      );
    }
    const R = r * k,
      Hh = h * k;
    const top = 100 - Hh / 2,
      bot = 100 + Hh / 2;
    const ry = Math.max(6, R * 0.28);
    if (shape === "sylinder")
      return (
        <g>
          <path d={`M${130 - R},${top} L${130 - R},${bot} A${R},${ry} 0 0 0 ${130 + R},${bot} L${130 + R},${top}`} fill="var(--plot-6)" fillOpacity={0.14} stroke="var(--plot-ink)" strokeWidth={2} />
          <ellipse cx={130} cy={top} rx={R} ry={ry} fill="var(--plot-6)" fillOpacity={0.25} stroke="var(--plot-ink)" strokeWidth={2} />
          <path d={`M${130 - R},${bot} A${R},${ry} 0 0 1 ${130 + R},${bot}`} fill="none" stroke="var(--plot-muted)" strokeDasharray="5 4" strokeWidth={1.4} />
          <line x1={130} y1={top} x2={130 + R} y2={top} stroke="var(--plot-2)" strokeWidth={2} />
          <text x={130 + R / 2} y={top - 6} textAnchor="middle" className="plot-num">r = {r}</text>
          <text x={130 + R + 6} y={100} className="plot-num">h = {h}</text>
        </g>
      );
    return (
      <g>
        <path d={`M${130 - R},${bot} L130,${top} L${130 + R},${bot} A${R},${ry} 0 0 1 ${130 - R},${bot}`} fill="var(--plot-4)" fillOpacity={0.16} stroke="var(--plot-ink)" strokeWidth={2} />
        <path d={`M${130 - R},${bot} A${R},${ry} 0 0 1 ${130 + R},${bot}`} fill="none" stroke="var(--plot-muted)" strokeDasharray="5 4" strokeWidth={1.4} />
        <line x1={130} y1={top} x2={130} y2={bot} stroke="var(--plot-muted)" strokeDasharray="5 4" strokeWidth={1.4} />
        <line x1={130} y1={bot} x2={130 + R} y2={bot} stroke="var(--plot-2)" strokeWidth={2} />
        <text x={130 + R / 2} y={bot + 16} textAnchor="middle" className="plot-num">r = {r}</text>
        <text x={136} y={100} className="plot-num">h = {h}</text>
      </g>
    );
  };
  return (
    <WidgetCard title="Volum og overflate" hint="Alle mål er i centimeter. 1 L = 1 dm³ = 1000 cm³.">
      <Chips
        value={shape}
        onChange={setShape}
        options={[
          { v: "prisme", label: "Prisme (eske)" },
          { v: "sylinder", label: "Sylinder" },
          { v: "kule", label: "Kule" },
          { v: "kjegle", label: "Kjegle" },
        ]}
      />
      <div className="plot-box mt-3">
        <svg viewBox="0 0 260 200" className="plot-svg mx-auto" style={{ maxHeight: 280 }} role="img" aria-label={"Tegning av " + shape}>
          {draw()}
        </svg>
      </div>
      <div className="mt-4 space-y-2">
        {shape === "prisme" ? (
          <>
            <Slider label="l" value={l} min={1} max={60} step={1} onChange={setL} format={(x) => x + " cm"} />
            <Slider label="b" value={b} min={1} max={60} step={1} onChange={setB} format={(x) => x + " cm"} />
            <Slider label="h" value={h} min={1} max={60} step={1} onChange={setH} format={(x) => x + " cm"} />
          </>
        ) : (
          <>
            <Slider label="r" value={r} min={1} max={30} step={0.5} onChange={setR} format={(x) => String(x).replace(".", ",") + " cm"} />
            {shape !== "kule" && <Slider label="h" value={h} min={1} max={60} step={1} onChange={setH} format={(x) => x + " cm"} />}
          </>
        )}
      </div>
      <Readout
        items={[
          { k: "\\text{Volum}", v: `${formula} \\approx ${tnok(V, 1)}\\ \\text{cm}^3`, color: "var(--plot-1)" },
          { k: "\\text{I liter}", v: `${tnok(V, 1)}\\ \\text{cm}^3 = ${tnok(V / 1000, 3)}\\ \\text{dm}^3 = ${tnok(V / 1000, 3)}\\ \\text{L}` },
          { k: `\\text{Overflate: } ${ofml}`, v: `\\approx ${tnok(O, 1)}\\ \\text{cm}^2 = ${tnok(O / 100, 2)}\\ \\text{dm}^2`, color: "var(--plot-2)" },
        ]}
      />
    </WidgetCard>
  );
}
