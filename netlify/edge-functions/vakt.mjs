// Vakta står foran hele nettstedet. Uten gyldig økt får du ikke en eneste
// side: HTML-sider sender deg til innloggingen, alt annet får 401.
// Hver side som åpnes, meldes til admin-sida i bakgrunnen (bare brukernavn og sti).
import { hemmelighet, lesKake, sjekkOkt, slettKake } from "../lib/okt.mjs";
import { butikk, aktivStatus } from "../lib/lager.mjs";
import { sendHendelse, klientIp, nettleser } from "../lib/admin.mjs";

export default async (req, context) => {
  const url = new URL(req.url);
  const okt = await sjekkOkt(lesKake(req), hemmelighet());
  const side = req.method === "GET" &&
    (url.pathname === "/" || url.pathname.endsWith(".html") || !url.pathname.split("/").pop().includes("."));
  // Noen har logget inn med samme brukernavn på en annen enhet, eller admin-sida
  // har logget brukeren ut: denne økta er ute.
  const status = okt ? await aktivStatus(butikk(), okt.u, okt.sid) : null;
  if (okt && !status.ok) {
    if (status.grunn === "annen" && status.annen) {
      // Samme id for alle forespørslene fra den utkastede økta, så det blir én hendelse.
      sendHendelse(context, { id: "kastet-" + okt.sid, type: "kastet", bruker: okt.u, ip: klientIp(req, context), ua: nettleser(req) });
    }
    const hoder = { "set-cookie": slettKake, "cache-control": "no-store" };
    return side
      ? new Response(null, { status: 302, headers: { ...hoder, location: "/logg-inn.html?ut=" + status.grunn } })
      : new Response("Du er logget ut.", { status: 401, headers: hoder });
  }
  if (okt) {
    const res = await context.next();
    const ut = new Response(res.body, res);
    // Innholdet er personlig: ingen delt mellomlagring, og ingen visning etter utlogging.
    ut.headers.set("cache-control", "private, no-store");
    if (side && res.status < 400) sendHendelse(context, { type: "side", bruker: okt.u, sti: url.pathname.slice(0, 200) });
    return ut;
  }
  if (side) {
    const til = encodeURIComponent(url.pathname + url.search);
    return new Response(null, { status: 302, headers: { location: `/logg-inn.html?til=${til}`, "cache-control": "no-store" } });
  }
  return new Response("Du må logge inn.", { status: 401, headers: { "cache-control": "no-store" } });
};

export const config = {
  path: "/*",
  excludedPath: ["/logg-inn.html", "/api/*"],
};
