// Tester koblingen til admin-sida: hendelser ut, signerte kommandoer inn.
import { test } from "node:test";
import assert from "node:assert/strict";
import { lagOkt, KAKE } from "../lib/okt.mjs";
import { signer, signerteHoder, sjekkSignert, FAGENE } from "../lib/signatur.mjs";
import { FAG } from "../lib/admin.mjs";
const ANNET = FAG === "biologi" ? "geofag" : "biologi";

const HEM = "a".repeat(40), DELT = "d".repeat(40);
process.env.MATTE2P_HEMMELIGHET = HEM;
process.env.ADMIN_DELT_HEMMELIGHET = DELT;
process.env.ADMIN_URL = "https://admin.example";

// Et lager i minnet med det lille av Blobs-APIet koden bruker.
const minne = () => {
  const m = new Map();
  return {
    m,
    get: async (k) => (m.has(k) ? structuredClone(m.get(k)) : null),
    setJSON: async (k, v, o = {}) => { if (o.onlyIfNew && m.has(k)) return { modified: false }; m.set(k, structuredClone(v)); return { modified: true }; },
    delete: async (k) => { m.delete(k); },
    list: async ({ prefix = "" } = {}) => ({ blobs: [...m.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }),
  };
};
const lager = minne();
globalThis.__FY_LAGER__ = lager;

// Fanger det fagsida sender til admin-sida.
const sendt = [];
globalThis.fetch = async (url, init) => { sendt.push({ url, init, kropp: JSON.parse(init.body) }); return new Response("{}"); };
const ctx = () => { const venter = []; return { venter, ip: "10.0.0.1", waitUntil: (p) => venter.push(p) }; };
const ferdig = (c) => Promise.all(c.venter);

const { settAktiv } = await import("../lib/lager.mjs");
const loggInn = (await import("../functions/logg-inn.mjs")).default;
const vakt = (await import("../edge-functions/vakt.mjs")).default;
const admin = (await import("../functions/admin.mjs")).default;
const { rydd } = await import("../functions/rydd.mjs");

const kommando = async (data, { hem = DELT, fag = FAG, tid = Date.now(), nonce } = {}) => {
  const kropp = JSON.stringify(data);
  const hoder = await signerteHoder(hem, "kommando", fag, kropp, tid, nonce);
  return admin(new Request("https://fag.example/api/admin", { method: "POST", headers: hoder, body: kropp }));
};
const innlogget = async (u) => { const sid = "s" + Math.random(); await settAktiv(lager, u, sid); return lagOkt(u, true, HEM, Date.now(), sid); };
const side = (t, sti = "/kapittel1.html", c = ctx()) =>
  vakt(new Request("https://fag.example" + sti, { headers: { cookie: `${KAKE}=${t}`, "user-agent": "Test/1.0" } }), { ...c, next: async () => new Response("inne") });

test("signaturen er lik den admin-sida regner ut (fast testvektor)", async () => {
  assert.equal(await signer("k".repeat(32), "hendelse", "fysikk", 1700000000000, "abcdefgh", '{"a":1}'),
    "9k3k-UCmGTsbnLGxRfO8ub9yDSkMyPWVJuSvQ40LIEM");
});

test("fagkoden matte2p (med siffer) har fast testvektor, lik på admin-sida", async () => {
  assert.equal(FAG, "matte2p");
  assert.equal(await signer("k".repeat(32), "hendelse", "matte2p", 1700000000000, "abcdefgh", '{"a":1}'),
    "MbuPopfUYEY1HoUGutnRycBC8X0LHhx5XeWaDVTmsZo");
  assert.equal(await signer("k".repeat(32), "kommando", "matte2p", 1700000000000, "abcdefgh", '{"handling":"status"}'),
    "IDKk_pqbYv7W_urAgEcgDh23ZEbYdpFip3_legWciZw");
  assert.ok(FAGENE.includes("matte2p"));
  const kropp = '{"x":1}', naa = Date.now();
  assert.ok(await sjekkSignert(DELT, "hendelse", new Headers(await signerteHoder(DELT, "hendelse", "matte2p", kropp, naa)), kropp, naa));
  for (const ugyldig of ["2p", "Matte2p", "matte_2p", "m", "matte2pmatte2p"]) {
    assert.equal(await sjekkSignert(DELT, "hendelse", new Headers(await signerteHoder(DELT, "hendelse", ugyldig, kropp, naa)), kropp, naa), null, ugyldig);
  }
});

test("signaturen avviser feil formål, fag, tid og endret kropp", async () => {
  const kropp = '{"x":1}', naa = Date.now();
  const h = new Headers(await signerteHoder(DELT, "hendelse", FAG, kropp, naa));
  assert.ok(await sjekkSignert(DELT, "hendelse", h, kropp, naa));
  assert.equal(await sjekkSignert(DELT, "kommando", h, kropp, naa), null);
  assert.equal(await sjekkSignert(DELT, "hendelse", h, '{"x":2}', naa), null);
  assert.equal(await sjekkSignert("e".repeat(40), "hendelse", h, kropp, naa), null);
  assert.equal(await sjekkSignert(DELT, "hendelse", h, kropp, naa + 6 * 60e3), null);
  h.set("x-fag", ANNET);
  assert.equal(await sjekkSignert(DELT, "hendelse", h, kropp, naa), null);
});

test("innlogging og feil passord sendes signert til admin-sida i bakgrunnen", async () => {
  sendt.length = 0;
  const c = ctx();
  const r = await loggInn(new Request("https://fag.example/api/logg-inn", { method: "POST",
    headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0 (iPhone)" },
    body: JSON.stringify({ bruker: "elev02", passord: "feil" }) }), c);
  assert.equal(r.status, 401);
  assert.equal(c.venter.length, 1);
  await ferdig(c);
  const { url, init, kropp } = sendt[0];
  assert.equal(url, "https://admin.example/api/hendelse");
  assert.equal(kropp.type, "feil");
  assert.equal(kropp.bruker, "elev02");
  assert.equal(kropp.fag, FAG);
  assert.equal(kropp.ip, "10.0.0.1");
  assert.ok(await sjekkSignert(DELT, "hendelse", new Headers(init.headers), init.body));
});

test("vakta melder sidevisninger og utkasting til admin-sida", async () => {
  sendt.length = 0;
  const a = await innlogget("elev03");
  let c = ctx();
  assert.equal((await side(a, "/kapittel4.html", c)).status, 200);
  await ferdig(c);
  assert.deepEqual([sendt[0].kropp.type, sendt[0].kropp.bruker, sendt[0].kropp.sti], ["side", "elev03", "/kapittel4.html"]);
  c = ctx();
  await side(a, "/bilde.png", c);          // bilder og filer telles ikke
  assert.equal(c.venter.length, 0);

  await innlogget("elev03");               // samme konto på en annen enhet
  sendt.length = 0;
  c = ctx();
  const r = await side(a, "/kapittel4.html", c);
  assert.equal(r.headers.get("location"), "/logg-inn.html?ut=annen");
  await ferdig(c);
  assert.equal(sendt[0].kropp.type, "kastet");
  assert.equal(sendt[0].kropp.bruker, "elev03");
});

test("kommando: logg ut kaster eleven ut med egen melding", async () => {
  const a = await innlogget("elev04");
  assert.equal((await side(a)).status, 200);
  const r = await kommando({ handling: "logg-ut", bruker: "elev04" });
  assert.equal(r.status, 200);
  const s = await side(a);
  assert.equal(s.status, 302);
  assert.equal(s.headers.get("location"), "/logg-inn.html?ut=admin");
});

test("kommando: feil signatur, feil fag, gammel tid og gjentatt nonce avvises", async () => {
  assert.equal((await kommando({ handling: "status" }, { hem: "x".repeat(40) })).status, 401);
  assert.equal((await kommando({ handling: "status" }, { fag: ANNET })).status, 401);
  assert.equal((await kommando({ handling: "status" }, { tid: Date.now() - 10 * 60e3 })).status, 401);
  assert.equal((await kommando({ handling: "status" }, { nonce: "engang-123" })).status, 200);
  assert.equal((await kommando({ handling: "status" }, { nonce: "engang-123" })).status, 409);
  assert.equal((await kommando({ handling: "logg-ut", bruker: "__proto__" })).status, 404);
  assert.equal((await admin(new Request("https://fag.example/api/admin", { method: "POST", body: "{}" }))).status, 401);
});

test("kommando: steng, nytt passord og åpne", async () => {
  const be = (passord) => loggInn(new Request("https://fag.example/api/logg-inn", { method: "POST",
    headers: { "content-type": "application/json" }, body: JSON.stringify({ bruker: "elev06", passord }) }), ctx());
  // Nytt passord: bare hashen sendes fra admin-sida.
  const salt = Buffer.alloc(16, 7);
  const { pbkdf2Sync } = await import("node:crypto");
  const hash = pbkdf2Sync("nytt-passord-1", salt, 600000, 32, "sha256");
  let r = await kommando({ handling: "passord", bruker: "elev06", salt: salt.toString("base64"), hash: hash.toString("base64") });
  assert.equal(r.status, 200);
  assert.equal((await be("nytt-passord-1")).status, 200);
  assert.equal((await be("gammelt")).status, 401);

  r = await kommando({ handling: "steng", bruker: "elev06" });
  assert.equal(r.status, 200);
  r = await be("nytt-passord-1");
  assert.equal(r.status, 403);
  assert.match((await r.json()).feil, /stengt/);
  assert.equal(lager.m.get("okt:elev06").ut, "admin");

  const st = await (await kommando({ handling: "status" })).json();
  const rad = st.brukere.find((b) => b.bruker === "elev06");
  assert.equal(rad.stengt, true);
  assert.equal(rad.okt, null);
  assert.equal(st.brukere.length, 10);

  assert.equal((await kommando({ handling: "apne", bruker: "elev06" })).status, 200);
  assert.equal((await be("nytt-passord-1")).status, 200);
  const st2 = await (await kommando({ handling: "status" })).json();
  assert.ok(st2.brukere.find((b) => b.bruker === "elev06").okt);
});

test("status viser sperrede kontoer og IP-adresser", async () => {
  const naa = Date.now();
  lager.m.set("bruker:elev09", { n: 5, start: naa - 1000 });
  lager.m.set("ip:9.9.9.9", { n: 25, start: naa - 1000 });
  const st = await (await kommando({ handling: "status" })).json();
  assert.ok(st.brukere.find((b) => b.bruker === "elev09").feil.sperretTil > naa);
  assert.deepEqual(st.ipSperrer.map((x) => x.ip), ["9.9.9.9"]);
});

test("nattlig rydding sletter utløpte tellere, økter og nonces", async () => {
  const store = minne();
  const naa = Date.now();
  store.m.set("ip:1.1.1.1", { n: 3, start: naa - 20 * 60e3 });
  store.m.set("ip:2.2.2.2", { n: 3, start: naa - 60e3 });
  store.m.set("nonce:gammel", { t: naa - 2 * 3600e3 });
  store.m.set("okt:elev01", { sid: "x", t: naa - 40 * 864e5, exp: naa - 864e5 });
  store.m.set("okt:elev02", { sid: "y", t: naa, exp: naa + 864e5 });
  store.m.set("konto:elev01", { stengt: true });
  assert.equal(await rydd(store, naa), 3);
  assert.deepEqual([...store.m.keys()].sort(), ["ip:2.2.2.2", "konto:elev01", "okt:elev02"]);
});

test("uten ADMIN_URL sendes ingenting, og innloggingen virker som før", async () => {
  delete process.env.ADMIN_URL;
  sendt.length = 0;
  const c = ctx();
  await loggInn(new Request("https://fag.example/api/logg-inn", { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ bruker: "elev01", passord: "feil" }) }), c);
  await ferdig(c);
  assert.equal(sendt.length, 0);
  process.env.ADMIN_URL = "https://admin.example";
});

test("/api/side: klientnavigering i appen telles som sidevisning", async () => {
  const side = (await import("../functions/side.mjs")).default;
  const t = await innlogget("elev05");
  const be = (body, hoder = {}) => side(new Request("https://fag.example/api/side", { method: "POST",
    headers: { cookie: `${KAKE}=${t}`, "content-type": "application/json", ...hoder }, body: JSON.stringify(body) }), c);
  sendt.length = 0;
  let c = ctx();
  assert.equal((await be({ sti: "/kapittel/3" })).status, 204);
  await ferdig(c);
  assert.deepEqual([sendt[0].kropp.type, sendt[0].kropp.bruker, sendt[0].kropp.sti], ["side", "elev05", "/kapittel/3/"]);
  c = ctx();
  assert.equal((await be({ sti: "//ond.no" })).status, 400);
  assert.equal((await be({ sti: "/x" }, { origin: "https://ond.no" })).status, 403);
  const uten = await side(new Request("https://fag.example/api/side", { method: "POST", body: '{"sti":"/"}' }), ctx());
  assert.equal(uten.status, 401);
});

test("kommando: nytt brukernavn – det nye virker, det gamle ikke, og økta beholdes", async () => {
  const be = (bruker, passord) => loggInn(new Request("https://fag.example/api/logg-inn", { method: "POST",
    headers: { "content-type": "application/json" }, body: JSON.stringify({ bruker, passord }) }), ctx());
  const salt = Buffer.alloc(16, 3);
  const { pbkdf2Sync } = await import("node:crypto");
  const hash = pbkdf2Sync("pw-elev08", salt, 600000, 32, "sha256");
  await kommando({ handling: "passord", bruker: "elev08", salt: salt.toString("base64"), hash: hash.toString("base64") });
  assert.equal((await be("elev08", "pw-elev08")).status, 200);
  const t = await innlogget("elev08");
  assert.equal((await side(t)).status, 200);

  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev08", nytt: "Ola.N" })).status, 200);
  assert.equal((await side(t)).status, 200);                           // innlogget elev er fortsatt inne
  assert.equal((await be("ola.n", "pw-elev08")).status, 200);
  assert.equal((await be("OLA.N", "pw-elev08")).status, 200);          // store bokstaver godtas som før
  assert.equal((await be("elev08", "pw-elev08")).status, 401);         // det gamle virker ikke lenger
  assert.equal(lager.m.get("okt:elev08").sid !== null, true);   // økta er ikke kastet ut
  const st = await (await kommando({ handling: "status" })).json();
  assert.equal(st.brukere.find((b) => b.bruker === "elev08").brukernavn, "ola.n");

  // Opptatt, ugyldig og andre kontoers id-er avvises.
  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev09", nytt: "ola.n" })).status, 409);
  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev09", nytt: "elev01" })).status, 409);
  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev09", nytt: "a" })).status, 409);
  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev09", nytt: "ola nordmann" })).status, 409);
  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev09", nytt: "__proto__x" })).status, 409);

  // Bytte igjen frigjør det forrige, og tilbake til id-en virker.
  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev08", nytt: "kari" })).status, 200);
  assert.equal((await be("ola.n", "pw-elev08")).status, 401);
  assert.equal((await be("kari", "pw-elev08")).status, 200);
  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev09", nytt: "ola.n" })).status, 200);
  assert.equal((await kommando({ handling: "brukernavn", bruker: "elev08", nytt: "elev08" })).status, 200);
  assert.equal((await be("elev08", "pw-elev08")).status, 200);
  assert.equal((await be("kari", "pw-elev08")).status, 401);
  assert.equal(lager.m.has("alias:kari"), false);
});
