import type { Block } from "@/lib/markup";
import { inlineHtml } from "@/lib/inline";
import { tex } from "@/lib/tex";
import { StaticPlot } from "./plot/static-plot";
import { SignChart } from "./plot/sign-chart";
import { Diagram, SvgFigure } from "./plot/diagram";
import { Widget } from "./widgets/registry";
import { Glyph } from "./site/glyph";

// Hver boks og hvert utbrett merkes med et matematisk tegn, ikke et bilde.
const BOX: Record<string, { label: string; cls: string; g: string }> = {
  regel: { label: "Regel", cls: "box-regel", g: "=" },
  def: { label: "Definisjon", cls: "box-def", g: "≔" },
  tips: { label: "Tips", cls: "box-tips", g: "≈" },
  obs: { label: "Vanlig feil", cls: "box-obs", g: "≠" },
  merk: { label: "Legg merke til", cls: "box-merk", g: "!" },
  husk: { label: "Husk", cls: "box-husk", g: "∑" },
  rettet: { label: "Merknad om fasit", cls: "box-rettet", g: "≟" },
};

const FOLD: Record<string, { label: string; answer: string; g: string }> = {
  bevis: { label: "Bevis", answer: "", g: "∎" },
  diskuter: { label: "Diskuter", answer: "Forslag til svar", g: "?" },
  utforsk: { label: "Utforsk", answer: "Hva du bør finne ut", g: "∃" },
  losning: { label: "Løsningsforslag", answer: "", g: "⇒" },
};

export function Inline({ text, as: Tag = "span", className }: { text: string; as?: "span" | "p" | "div" | "h2" | "h3" | "li"; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: inlineHtml(text) }} />;
}

export function Markup({ blocks, compact = false }: { blocks: Block[]; compact?: boolean }) {
  return (
    <div className={compact ? "markup markup-compact" : "markup"}>
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </div>
  );
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return <Inline as="p" text={b.text} />;
    case "math":
      return <div className="math-block" dangerouslySetInnerHTML={{ __html: tex(b.tex, true) }} />;
    case "h":
      return b.level === 2 ? (
        <h2 id={b.id} className="md-h2" dangerouslySetInnerHTML={{ __html: inlineHtml(b.text) }} />
      ) : (
        <h3 id={b.id} className="md-h3" dangerouslySetInnerHTML={{ __html: inlineHtml(b.text) }} />
      );
    case "ul":
      return (
        <ul className="md-ul">
          {b.items.map((it, i) => (
            <Inline key={i} as="li" text={it} />
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="md-ol" start={b.start}>
          {b.items.map((it, i) => (
            <Inline key={i} as="li" text={it} />
          ))}
        </ol>
      );
    case "code":
      return (
        <pre className="md-code">
          <code>{b.text}</code>
        </pre>
      );
    case "quote":
      return (
        <blockquote className="md-quote">
          <Inline text={b.text} />
        </blockquote>
      );
    case "steps":
      return (
        <ol className="md-steps">
          {b.items.map((it, i) => (
            <li key={i}>
              <span className="md-step-n">{i + 1}</span>
              <Inline text={it} />
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="md-table-wrap">
          <table className="md-table">
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className={b.header && i === 0 ? "md-thead" : undefined}>
                  {r.map((c, j) =>
                    (b.header && i === 0) || j === 0 ? (
                      <th key={j} dangerouslySetInnerHTML={{ __html: inlineHtml(c) }} />
                    ) : (
                      <td key={j} dangerouslySetInnerHTML={{ __html: inlineHtml(c) }} />
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "box": {
      const m = BOX[b.kind] ?? BOX.merk;
      return (
        <aside className={"md-box " + m.cls}>
          <div className="md-box-head">
            <Glyph g={m.g} />
            <span>{b.title ? <Inline text={b.title} /> : m.label}</span>
          </div>
          <Markup blocks={b.body} compact />
        </aside>
      );
    }
    case "eks":
      return (
        <section className="md-eks">
          <div className="md-eks-head">
            <span className="md-eks-tag">Eksempel</span>
            {b.title && <Inline text={b.title} className="md-eks-title" />}
          </div>
          {b.problem.length > 0 && (
            <div className="md-eks-problem">
              <Markup blocks={b.problem} compact />
            </div>
          )}
          {b.solution.length > 0 && (
            <div className="md-eks-solution">
              <div className="md-eks-sol-label">Løsning</div>
              <Markup blocks={b.solution} compact />
            </div>
          )}
        </section>
      );
    case "fold": {
      const m = FOLD[b.kind];
      return (
        <details className={"md-fold md-fold-" + b.kind}>
          <summary>
            <Glyph g={m.g} />
            <span className="md-fold-kind">{m.label}</span>
            {b.title && <Inline text={b.title} className="md-fold-title" />}
          </summary>
          <div className="md-fold-body">
            <Markup blocks={b.body} compact />
            {b.answer.length > 0 && (
              <div className="md-fold-answer">
                {m.answer && <div className="md-fold-answer-label">{m.answer}</div>}
                <Markup blocks={b.answer} compact />
              </div>
            )}
          </div>
        </details>
      );
    }
    case "plot":
      return <StaticPlot spec={b.spec} />;
    case "diagram":
      return <Diagram spec={b.spec} />;
    case "svg":
      return <SvgFigure w={b.w} h={b.h} body={b.body} cap={b.cap} mw={b.mw} />;
    case "fortegn":
      return <SignChart spec={b.spec} />;
    case "widget":
      return <Widget name={b.name} props={b.props} />;
    case "cols":
      return (
        <div className="md-cols" style={{ gridTemplateColumns: `repeat(${b.cols.length}, minmax(0, 1fr))` }}>
          {b.cols.map((c, i) => (
            <div key={i}>
              <Markup blocks={c} compact />
            </div>
          ))}
        </div>
      );
  }
}
