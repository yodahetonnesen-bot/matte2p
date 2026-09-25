// POST /api/side { sti }: appen melder sidebytter som skjer uten ny sidelasting
// (Next.js-navigering), så admin-sida ser hvilke kapitler eleven åpner. Vakta
// teller vanlige sidelastinger; dette tar resten. Krever gyldig økt.
import { hemmelighet, lesKake, sjekkOkt } from "../lib/okt.mjs";
import { butikk, aktivStatus } from "../lib/lager.mjs";
import { sendHendelse } from "../lib/admin.mjs";

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Bruk POST.", { status: 405, headers: { allow: "POST" } });
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return new Response("Feil opphav.", { status: 403 });
  const okt = await sjekkOkt(lesKake(req), hemmelighet());
  if (!okt || !(await aktivStatus(butikk(), okt.u, okt.sid)).ok) return new Response(null, { status: 401 });

  let sti = "";
  try { sti = String((await req.json()).sti ?? ""); } catch { /* tom */ }
  if (!/^\/[A-Za-z0-9._~\-\/]{0,199}$/.test(sti) || sti.startsWith("//")) return new Response(null, { status: 400 });
  // Samme form som vakta ser: /kapittel/3/ (trailingSlash i next.config.ts).
  if (!sti.endsWith("/") && !sti.split("/").pop().includes(".")) sti += "/";
  sendHendelse(context, { type: "side", bruker: okt.u, sti });
  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
};

export const config = { path: "/api/side" };
