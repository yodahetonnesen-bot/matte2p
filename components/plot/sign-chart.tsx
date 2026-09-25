import type { SignSpec } from "@/lib/markup";
import { tex } from "@/lib/tex";

/**
 * Fortegnslinje. Hver rad har 2n+1 symboler for n bruddpunkter:
 * intervall, punkt, intervall, ... der intervall er + / - / (tom),
 * og punkt er 0 (nullpunkt), x (ikke definert) eller . (ingenting).
 * En rad med etiketten @ tegner formen på grafen med piler (u = opp, d = ned).
 * Heltrukken linje betyr positiv, stiplet betyr negativ.
 */
export function SignChart({ spec }: { spec: SignSpec }) {
  const n = spec.points.length;
  const W = 600;
  const labelW = 120;
  const rowH = 44;
  const top = 34;
  const left = labelW + 18;
  const right = W - 22;
  const H = top + spec.rows.length * rowH + 6;
  const px = (i: number) => left + ((right - left) * (i + 1)) / (n + 1);
  const ivx = (j: number) => {
    const a = j === 0 ? left : px(j - 1);
    const b = j === n ? right : px(j);
    return [a, b] as const;
  };

  return (
    <figure className="plot-figure sign-chart" style={{ maxWidth: W }}>
      <div className="plot-box">
        <svg viewBox={`0 0 ${W} ${H}`} className="plot-svg" role="img" aria-label="Fortegnslinje">
          {spec.points.map((_, i) => (
            <line key={i} x1={px(i)} x2={px(i)} y1={top - 6} y2={H - 4} className="sign-guide" />
          ))}
          {spec.rows.map((row, r) => {
            const y = top + r * rowH + rowH / 2;
            const shape = row.label === "@";
            const els = [];
            for (let j = 0; j <= n; j++) {
              const tok = row.tokens[2 * j] ?? "";
              const [a, b] = ivx(j);
              const pad = 7;
              if (shape) {
                const mid = (a + b) / 2;
                if (tok === "u")
                  els.push(<path key={"i" + j} d={`M${mid - 20},${y + 10} L${mid + 20},${y - 10}`} className="sign-arrow" />);
                else if (tok === "d")
                  els.push(<path key={"i" + j} d={`M${mid - 20},${y - 10} L${mid + 20},${y + 10}`} className="sign-arrow" />);
                else if (tok === "cu" || tok === "cd")
                  els.push(
                    <path
                      key={"i" + j}
                      d={tok === "cu" ? `M${mid - 22},${y - 8} Q${mid},${y + 18} ${mid + 22},${y - 8}` : `M${mid - 22},${y + 8} Q${mid},${y - 18} ${mid + 22},${y + 8}`}
                      className="sign-arrow"
                      fill="none"
                    />,
                  );
                if (tok === "u" || tok === "d") {
                  const up = tok === "u";
                  const ex = mid + 20,
                    ey = up ? y - 10 : y + 10;
                  const ang = Math.atan2(up ? -20 : 20, 40);
                  const h = 9;
                  els.push(
                    <path
                      key={"h" + j}
                      d={`M${ex},${ey} L${ex - h * Math.cos(ang - 0.45)},${ey - h * Math.sin(ang - 0.45)} L${ex - h * Math.cos(ang + 0.45)},${ey - h * Math.sin(ang + 0.45)} Z`}
                      className="sign-arrow-head"
                    />,
                  );
                }
              } else if (tok === "+") els.push(<line key={"i" + j} x1={a + pad} x2={b - pad} y1={y} y2={y} className="sign-pos" />);
              else if (tok === "-") els.push(<line key={"i" + j} x1={a + pad} x2={b - pad} y1={y} y2={y} className="sign-neg" />);
              if (j < n && !shape) {
                const p = row.tokens[2 * j + 1] ?? ".";
                if (p === "0")
                  els.push(
                    <text key={"p" + j} x={px(j)} y={y + 6} textAnchor="middle" className="sign-zero">
                      0
                    </text>,
                  );
                else if (p === "x")
                  els.push(
                    <text key={"p" + j} x={px(j)} y={y + 6} textAnchor="middle" className="sign-undef">
                      ×
                    </text>,
                  );
              }
            }
            return (
              <g key={r}>
                <line x1={8} x2={W - 8} y1={top + r * rowH} y2={top + r * rowH} className="sign-sep" />
                {els}
              </g>
            );
          })}
        </svg>
        {spec.points.map((p, i) => (
          <div
            key={i}
            className="plot-label"
            style={{ left: (px(i) / W) * 100 + "%", top: (16 / H) * 100 + "%", transform: "translate(-50%,-50%)" }}
            dangerouslySetInnerHTML={{ __html: tex(p) }}
          />
        ))}
        {spec.rows.map((row, r) =>
          row.label === "@" ? null : (
            <div
              key={r}
              className="plot-label sign-row-label"
              style={{ left: (12 / W) * 100 + "%", top: ((top + r * rowH + rowH / 2) / H) * 100 + "%", transform: "translate(0,-50%)" }}
              dangerouslySetInnerHTML={{ __html: tex(row.label) }}
            />
          ),
        )}
      </div>
    </figure>
  );
}
