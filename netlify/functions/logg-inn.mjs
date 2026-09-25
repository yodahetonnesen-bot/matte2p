// POST /api/logg-inn. Sjekker brukernavn og passord på serveren og gir en
// signert økt-kake. Det finnes ingen måte å lage nye kontoer på.
import { hemmelighet, lagOkt, nySid, kakeHode, sjekkPassord, tryggSti, KORT, LANG } from "../lib/okt.mjs";
import { butikk, settAktiv, finnKonto } from "../lib/lager.mjs";
import { sperret, feil, riktig, MAKS_BRUKER } from "../lib/grense.mjs";
import { sendHendelse, klientIp, nettleser } from "../lib/admin.mjs";

function svar(req, status, body, hoder = {}) {
  const skjema = !(req.headers.get("content-type") || "").includes("application/json");
  if (skjema) {
    // Vanlig skjema uten JavaScript: send brukeren videre med en gang.
    const til = status === 200 ? body.til : "/logg-inn.html?feil=" + (status === 429 ? "vent" : status === 403 ? "stengt" : "1");
    return new Response(null, { status: 303, headers: { location: til, "cache-control": "no-store", ...hoder } });
  }
  return new Response(JSON.stringify(body), {
    status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...hoder },
  });
}

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Bruk POST.", { status: 405, headers: { allow: "POST" } });

  // Bare skjemaet på vår egen side får logge inn.
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return new Response("Feil opphav.", { status: 403 });

  const hem = hemmelighet();
  if (!hem) {
    console.error("MATTE2P_HEMMELIGHET mangler eller er kortere enn 32 tegn.");
    return svar(req, 503, { feil: "Innloggingen er ikke satt opp ennå." });
  }

  let inn = {};
  try {
    const type = req.headers.get("content-type") || "";
    inn = type.includes("application/json") ? await req.json() : Object.fromEntries(await req.formData());
  } catch { return svar(req, 400, { feil: "Ugyldig forespørsel." }); }

  const skrevet = String(inn.bruker ?? "").trim().toLowerCase().slice(0, 40);
  const passord = String(inn.passord ?? "").slice(0, 200);
  const husk = inn.husk === true || inn.husk === "on" || inn.husk === "1";
  const til = tryggSti(String(inn.til ?? "/"));
  const ip = klientIp(req, context);
  const ua = nettleser(req);
  if (!skrevet || !passord) return svar(req, 400, { feil: "Fyll inn både brukernavn og passord." });

  const store = butikk();
  // Brukernavnet kan være endret fra admin-sida (f.eks. elev03 → ola). Internt, i
  // økta og i tellerne brukes alltid id-en (elev03). Kontoen kan også ha fått nytt
  // passord eller blitt stengt.
  let konto;
  try { konto = await finnKonto(store, skrevet); }
  catch (e) { console.error(e); return svar(req, 503, { feil: "Kunne ikke logge inn akkurat nå. Prøv igjen." }); }
  const bruker = konto?.id ?? skrevet;

  let vent = 0;
  try { vent = await sperret(store, bruker, ip); } catch (e) { console.error(e); }
  if (vent > 0) {
    // Én hendelse per sperre (samme id for alle forsøk mens sperren varer).
    const slutt = Math.round((Date.now() + vent * 1000) / 60000);
    sendHendelse(context, { id: `sperret-${slutt}-${bruker}`.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 64), type: "sperret", bruker, ip, ua, vent });
    return svar(req, 429, { feil: `For mange feil forsøk. Prøv igjen om ${Math.ceil(vent / 60)} min.` },
      { "retry-after": String(vent) });
  }

  if (!(await sjekkPassord(bruker, passord, konto))) {
    let n = 0;
    try { n = await feil(store, bruker, ip); } catch (e) { console.error(e); }
    sendHendelse(context, { type: "feil", bruker, ip, ua, finnes: !!konto, sperret: n >= MAKS_BRUKER });
    return svar(req, 401, { feil: "Feil brukernavn eller passord." });
  }
  if (konto.stengt) {
    sendHendelse(context, { type: "stengt", bruker, ip, ua });
    return svar(req, 403, { feil: "Kontoen er stengt. Snakk med den som driver sida." });
  }

  try { await riktig(store, bruker); } catch (e) { console.error(e); }
  // Den nye økta blir den eneste gyldige: en annen enhet med samme bruker logges ut.
  const sid = nySid();
  try { await settAktiv(store, bruker, sid, Date.now() + (husk ? LANG : KORT) * 1000); }
  catch (e) { console.error(e); return svar(req, 503, { feil: "Kunne ikke logge inn akkurat nå. Prøv igjen." }); }
  const token = await lagOkt(bruker, husk, hem, Date.now(), sid);
  sendHendelse(context, { type: "inn", bruker, ip, ua, husk });
  return svar(req, 200, { til }, { "set-cookie": kakeHode(token, husk) });
};

export const config = { path: "/api/logg-inn" };
