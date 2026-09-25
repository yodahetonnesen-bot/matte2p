// POST /api/admin: kommandoer fra admin-sida. Hver kommando må være signert med
// ADMIN_DELT_HEMMELIGHET, være under fem minutter gammel og ha en nonce som ikke
// er brukt før (så en kommando ikke kan spilles av på nytt). Uten hemmeligheten
// avvises alt.
//   { handling: "status" }                         hvem er inne, stengt, sperret
//   { handling: "logg-ut", bruker }                kaster ut brukeren på alle enheter
//   { handling: "steng", bruker }                  stenger kontoen og kaster ut
//   { handling: "apne", bruker }                   åpner kontoen og fjerner sperren
//   { handling: "passord", bruker, salt, hash }    nytt passord (bare hashen sendes)
//   { handling: "brukernavn", bruker, nytt }       nytt brukernavn å logge inn med
import { BRUKERE } from "../lib/brukere.mjs";
import { butikk, hentKonto, endreKonto, kastUt, endreBrukernavn } from "../lib/lager.mjs";
import { teller, MAKS_BRUKER, MAKS_IP } from "../lib/grense.mjs";
import { delt, sjekkSignert } from "../lib/signatur.mjs";
import { FAG } from "../lib/admin.mjs";

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

async function status(store) {
  const naa = Date.now();
  const brukere = await Promise.all(Object.keys(BRUKERE).map(async (bruker) => {
    const [konto, okt, feil] = await Promise.all([
      hentKonto(store, bruker), store.get("okt:" + bruker, { type: "json" }), teller(store, "bruker:" + bruker, naa),
    ]);
    const inne = okt?.sid && (okt.exp ?? okt.t + 30 * 24 * 3600e3) > naa;
    return {
      bruker, brukernavn: konto.brukernavn, stengt: konto.stengt, passordEndret: konto.endret,
      okt: inne ? { t: okt.t, exp: okt.exp ?? null } : null,
      feil: feil ? { n: feil.n, sperretTil: feil.n >= MAKS_BRUKER ? feil.til : null } : null,
    };
  }));
  const ipSperrer = [];
  const { blobs } = await store.list({ prefix: "ip:" });
  for (const { key } of blobs) {
    const v = await teller(store, key, naa);
    if (v && v.n >= MAKS_IP) ipSperrer.push({ ip: key.slice(3), til: v.til });
  }
  return { fag: FAG, naa, brukere, ipSperrer };
}

export default async (req) => {
  if (req.method !== "POST") return new Response("Bruk POST.", { status: 405, headers: { allow: "POST" } });
  const hem = delt();
  if (!hem) return json(503, { feil: "ADMIN_DELT_HEMMELIGHET mangler på fagsida." });
  const kropp = await req.text();
  if (kropp.length > 4000) return json(413, { feil: "For stor." });
  const sign = await sjekkSignert(hem, "kommando", req.headers, kropp);
  if (!sign || sign.fag !== FAG) return json(401, { feil: "Ugyldig signatur." });

  const store = butikk();
  if (!store) return json(503, { feil: "Netlify Blobs er ikke tilgjengelig." });
  // Engangsnøkkel: samme kommando kan ikke brukes to ganger.
  const ny = await store.setJSON("nonce:" + sign.nonce, { t: Date.now() }, { onlyIfNew: true });
  if (ny && ny.modified === false) return json(409, { feil: "Kommandoen er allerede brukt." });

  let inn;
  try { inn = JSON.parse(kropp); } catch { return json(400, { feil: "Ugyldig JSON." }); }
  const { handling, bruker } = inn;
  if (handling === "status") return json(200, await status(store));

  if (typeof bruker !== "string" || !Object.hasOwn(BRUKERE, bruker)) return json(404, { feil: "Ukjent bruker." });
  const naa = Date.now();
  if (handling === "logg-ut") {
    await kastUt(store, bruker);
  } else if (handling === "steng") {
    await endreKonto(store, bruker, { stengt: true });
    await kastUt(store, bruker);
  } else if (handling === "apne") {
    await endreKonto(store, bruker, { stengt: false });
    await store.delete("bruker:" + bruker);
  } else if (handling === "passord") {
    const b64 = /^[A-Za-z0-9+/]{22}==$|^[A-Za-z0-9+/]{43}=$/;
    if (!b64.test(inn.salt ?? "") || !b64.test(inn.hash ?? "")) return json(400, { feil: "Ugyldig salt eller hash." });
    await endreKonto(store, bruker, { salt: inn.salt, hash: inn.hash, endret: naa });
    await kastUt(store, bruker);
    await store.delete("bruker:" + bruker);
  } else if (handling === "brukernavn") {
    const feil = await endreBrukernavn(store, bruker, String(inn.nytt ?? "").trim().toLowerCase());
    if (feil) return json(409, { feil });
  } else {
    return json(400, { feil: "Ukjent handling." });
  }
  return json(200, { ok: true, fag: FAG, bruker, handling });
};

export const config = { path: "/api/admin" };
