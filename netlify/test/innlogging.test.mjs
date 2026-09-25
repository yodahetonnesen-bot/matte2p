// Tester innloggingen uten Netlify: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { lagOkt, sjekkOkt, sjekkPassord, tryggSti, lesKake, KAKE } from "../lib/okt.mjs";
import { sperret, feil, riktig, MAKS_BRUKER } from "../lib/grense.mjs";
import { BRUKERE } from "../lib/brukere.mjs";

const HEM = "a".repeat(40);
process.env.MATTE2P_HEMMELIGHET = HEM;
const minne = () => { const m = new Map(); return { m, get: async (k) => m.get(k) ?? null, setJSON: async (k, v) => m.set(k, v), delete: async (k) => m.delete(k) }; };
globalThis.__FY_LAGER__ = minne();
const { settAktiv } = await import("../lib/lager.mjs");
const innlogget = async (u, husk = true) => { const sid = "s" + Math.random(); await settAktiv(globalThis.__FY_LAGER__, u, sid); return lagOkt(u, husk, HEM, Date.now(), sid); };
const loggInn = (await import("../functions/logg-inn.mjs")).default;
const vakt = (await import("../edge-functions/vakt.mjs")).default;

test("nøyaktig ti brukere, og ingen passord i klartekst", () => {
  assert.equal(Object.keys(BRUKERE).length, 10);
  for (const v of Object.values(BRUKERE)) assert.deepEqual(Object.keys(v), ["salt", "hash"]);
});

test("feil passord og ukjent bruker avvises", async () => {
  assert.equal(await sjekkPassord("elev01", "feil-feil-feil"), false);
  assert.equal(await sjekkPassord("finnesikke", "hva-som-helst"), false);
  assert.equal(await sjekkPassord("__proto__", "x"), false);
});

test("økta: gyldig, utløpt, forfalsket og feil hemmelighet", async () => {
  const t = await lagOkt("elev01", false, HEM);
  assert.equal((await sjekkOkt(t, HEM)).u, "elev01");
  assert.equal(await sjekkOkt(t, "b".repeat(40)), null);
  assert.equal(await sjekkOkt(t, HEM, Date.now() + 13 * 3600e3), null);
  const lang = await lagOkt("elev01", true, HEM);
  assert.ok(await sjekkOkt(lang, HEM, Date.now() + 29 * 24 * 3600e3));
  const [data, sig] = t.split(".");
  const falsk = Buffer.from(JSON.stringify({ u: "elev02", iat: 0, exp: 9e9 })).toString("base64url");
  assert.equal(await sjekkOkt(`${falsk}.${sig}`, HEM), null);
  assert.equal(await sjekkOkt(await lagOkt("slettet", true, HEM), HEM), null);
  assert.equal(await sjekkOkt(t, null), null);
  assert.equal(await sjekkOkt("tull", HEM), null);
});

test("bare lokale stier etter innlogging", () => {
  assert.equal(tryggSti("/kapittel/3/#del-b"), "/kapittel/3/#del-b");
  for (const x of ["//ond.no", "https://ond.no", "javascript:alert(1)", "/\\ond.no", "/<script>"]) assert.equal(tryggSti(x), "/");
});

test("vakta: uten økt til innlogging, med økt slipper du inn", async () => {
  const neste = { next: async () => new Response("<h1>hemmelig</h1>", { headers: { "content-type": "text/html" } }) };
  let r = await vakt(new Request("https://x.no/kapittel2.html?a=1"), neste);
  assert.equal(r.status, 302);
  assert.equal(r.headers.get("location"), "/logg-inn.html?til=%2Fkapittel2.html%3Fa%3D1");
  r = await vakt(new Request("https://x.no/"), neste);
  assert.equal(r.status, 302);
  r = await vakt(new Request("https://x.no/bilde.png"), neste);
  assert.equal(r.status, 401);
  const t = await innlogget("elev05");
  r = await vakt(new Request("https://x.no/kapittel2.html", { headers: { cookie: `annet=1; ${KAKE}=${t}` } }), neste);
  assert.equal(r.status, 200);
  assert.equal(await r.text(), "<h1>hemmelig</h1>");
  assert.equal(r.headers.get("cache-control"), "private, no-store");
});

test("vakta slipper ingen inn når hemmeligheten mangler", async () => {
  const t = await innlogget("elev05");
  process.env.MATTE2P_HEMMELIGHET = "";
  const r = await vakt(new Request("https://x.no/", { headers: { cookie: `${KAKE}=${t}` } }), { next: async () => new Response("inne") });
  process.env.MATTE2P_HEMMELIGHET = HEM;
  assert.equal(r.status, 302);
});

test("grensen: fem feil sperrer brukernavnet i 15 minutter", async () => {
  const store = minne();
  const t0 = 1_000_000;
  for (let i = 0; i < MAKS_BRUKER; i++) {
    assert.equal(await sperret(store, "elev01", "1.2.3.4", t0), 0);
    await feil(store, "elev01", "1.2.3.4", t0);
  }
  assert.ok((await sperret(store, "elev01", "1.2.3.4", t0 + 1000)) > 800);
  assert.equal(await sperret(store, "elev01", "1.2.3.4", t0 + 16 * 60e3), 0);
  await riktig(store, "elev01");
  assert.equal(await sperret(store, "elev01", "5.6.7.8", t0), 0);
});

test("kakelesing", () => {
  const req = new Request("https://x.no/", { headers: { cookie: `a=1; ${KAKE}=abc.def; b=2` } });
  assert.equal(lesKake(req), "abc.def");
});

test("én enhet per bruker: ny innlogging kaster ut den gamle", async () => {
  const neste = { next: async () => new Response("inne") };
  const be = (t, sti = "/kapittel1.html") => vakt(new Request("https://x.no" + sti, { headers: { cookie: `${KAKE}=${t}` } }), neste);
  const a = await innlogget("elev07");
  assert.equal((await be(a)).status, 200);
  const b = await innlogget("elev07");                 // samme konto på en annen enhet
  let r = await be(a);
  assert.equal(r.status, 302);
  assert.equal(r.headers.get("location"), "/logg-inn.html?ut=annen");
  assert.match(r.headers.get("set-cookie"), /Max-Age=0/);
  assert.equal((await be(a, "/bilde.png")).status, 401);
  assert.equal((await be(b)).status, 200);             // den nye er inne
  assert.equal((await be(await innlogget("elev08"))).status, 200);   // andre kontoer påvirkes ikke
  assert.equal((await be(b)).status, 200);
});

test("økt uten sid (fra før denne endringen) må logge inn på nytt", async () => {
  const data = Buffer.from(JSON.stringify({ u: "elev01", iat: 0, exp: 9e9 })).toString("base64url");
  assert.equal(await sjekkOkt(`${data}.xx`, HEM), null);
});

test("innloggingen setter den nye økta som den eneste gyldige", async () => {
  const lager = globalThis.__FY_LAGER__;
  lager.m.set("okt:elev01", { sid: "gammel" });
  // feil passord endrer ikke hvem som er inne
  const r = await loggInn(new Request("https://x.no/api/logg-inn", { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ bruker: "elev01", passord: "feil" }) }), { ip: "1.1.1.1" });
  assert.equal(r.status, 401);
  assert.equal(lager.m.get("okt:elev01").sid, "gammel");
});
