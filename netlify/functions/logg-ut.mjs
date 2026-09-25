// /api/logg-ut: sletter økt-kaka og sender deg til innloggingen.
import { slettKake, lesKake, sjekkOkt, hemmelighet } from "../lib/okt.mjs";
import { butikk, glemAktiv } from "../lib/lager.mjs";
import { sendHendelse, klientIp, nettleser } from "../lib/admin.mjs";

export default async (req, context) => {
  const okt = await sjekkOkt(lesKake(req), hemmelighet());
  if (okt) {
    try { await glemAktiv(butikk(), okt.u, okt.sid); } catch (e) { console.error(e); }
    sendHendelse(context, { type: "ut", bruker: okt.u, ip: klientIp(req, context), ua: nettleser(req) });
  }
  return new Response(null, {
    status: 303,
    headers: { location: "/logg-inn.html?ut=1", "set-cookie": slettKake, "cache-control": "no-store" },
  });
};

export const config = { path: "/api/logg-ut" };
