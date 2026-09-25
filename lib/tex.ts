import katex from "katex";

const MACROS: Record<string, string> = {
  "\\R": "\\mathbb{R}",
  "\\N": "\\mathbb{N}",
  "\\Z": "\\mathbb{Z}",
  "\\Q": "\\mathbb{Q}",
  "\\ov": "\\overrightarrow{#1}",
  "\\vv": "\\vec{#1}",
  "\\abs": "\\left|#1\\right|",
  "\\len": "\\left|\\overrightarrow{#1}\\right|",
  "\\ang": "\\langle",
  "\\rang": "\\rangle",
  "\\ra": "\\rightarrow",
  "\\la": "\\leftarrow",
  "\\dx": "\\Delta x",
  "\\u": "\\underline{\\underline{#1}}",
  "\\grad": "^\\circ",
  "\\boks": "\\;\\boxed{\\phantom{\\Leftrightarrow}}\\;",
};

const cache = new Map<string, string>();

/** Desimalkomma mellom sifre gjøres om til {,} slik at det ikke får mellomrom etter seg. */
export function fixComma(src: string) {
  return src.replace(/(\d),(?=\d)/g, "$1{,}");
}

export function tex(src: string, display = false): string {
  const key = (display ? "D" : "I") + src;
  const hit = cache.get(key);
  if (hit) return hit;
  let html: string;
  try {
    html = katex.renderToString(fixComma(src), {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
      macros: { ...MACROS },
      output: "html",
    });
  } catch {
    html = `<code>${src}</code>`;
  }
  if (cache.size > 5000) cache.clear();
  cache.set(key, html);
  return html;
}
