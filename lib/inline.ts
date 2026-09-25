import { tex } from "./tex";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatText(s: string) {
  let h = esc(s).replace(/&amp;nbsp;/g, "&nbsp;");
  h = h.replace(/`([^`]+)`/g, "<code>$1</code>");
  h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  h = h.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
  h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
    const ext = /^https?:/.test(href);
    return `<a href="${href}"${ext ? ' target="_blank" rel="noreferrer"' : ""}>${t}</a>`;
  });
  h = h.replace(/ -- /g, " – ");
  return h;
}

/** Gjør om en tekstlinje med $matte$ og enkel markdown til HTML. */
export function inlineHtml(text: string): string {
  let out = "";
  let i = 0;
  let buf = "";
  while (i < text.length) {
    const c = text[i];
    // `kode` tas med uendret, slik at $ i regnearkformler (=B$5) ikke blir matte
    if (c === "`") {
      const end = text.indexOf("`", i + 1);
      if (end > i) {
        buf += text.slice(i, end + 1);
        i = end + 1;
        continue;
      }
    }
    if (c === "\\" && text[i + 1] === "$") {
      buf += "$";
      i += 2;
      continue;
    }
    if (c === "$") {
      const display = text[i + 1] === "$";
      const open = display ? 2 : 1;
      let j = i + open;
      while (j < text.length && !(text[j] === "$" && text[j - 1] !== "\\")) j++;
      if (j >= text.length) {
        buf += c;
        i++;
        continue;
      }
      out += formatText(buf);
      buf = "";
      const src = text.slice(i + open, j);
      out += display ? `<span class="math-display">${tex(src, true)}</span>` : tex(src);
      i = j + (display ? 2 : 1);
      continue;
    }
    buf += c;
    i++;
  }
  out += formatText(buf);
  return out;
}

export function plainText(text: string) {
  return text.replace(/\$[^$]*\$/g, "…").replace(/[*`]/g, "");
}
