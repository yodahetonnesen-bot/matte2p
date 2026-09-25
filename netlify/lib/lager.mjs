// Netlify Blobs: tellerne for feil forsøk, hvilken økt som er den gyldige for
// hver bruker, og kontoene. Testene kan legge inn et eget lager i globalThis.__FY_LAGER__.
//   "okt:<bruker>"    = { sid, t, exp }  den eneste gyldige økta (én enhet per konto)
//                       { sid: null, ut: "admin", t }  logget ut fra admin-sida
//   "konto:<bruker>"  = { salt, hash, stengt, endret, brukernavn }  overstyrer brukere.mjs
//   "alias:<navn>"    = { id }  brukernavnet eleven logger inn med, hvis det er endret
//                       fra admin-sida (id-en, f.eks. elev03, er den samme internt)
//   "bruker:<navn>" og "ip:<ip>" = feiltellere (grense.mjs)
//   "nonce:<n>"       = brukte engangsnøkler for kommandoer fra admin-sida
import { getStore } from "@netlify/blobs";
import { BRUKERE } from "./brukere.mjs";

export function butikk() {
  if (globalThis.__FY_LAGER__) return globalThis.__FY_LAGER__;
  try { return getStore({ name: "innlogging", consistency: "strong" }); }
  catch (e) { console.error("Netlify Blobs er ikke tilgjengelig:", e.message); return null; }
}

// Én enhet per bruker: bare økta med denne id-en slipper inn.
export async function settAktiv(store, bruker, sid, exp) {
  const t = Date.now();
  if (store) await store.setJSON("okt:" + bruker, { sid, t, exp: exp ?? t + 30 * 24 * 3600e3 });
}

// { ok: true } = økta er den nyeste for brukeren. Ellers { ok: false, grunn }, der
// grunn er "admin" (kastet ut fra admin-sida) eller "annen" (ny innlogging et annet sted).
// Uten lager slipper vi inn (feiler åpent), så et Blobs-avbrudd ikke stenger alle
// ute; signaturen er fortsatt sjekket.
export async function aktivStatus(store, bruker, sid) {
  if (!store) return { ok: true };
  try {
    const v = await store.get("okt:" + bruker, { type: "json" });
    if (v && v.sid === sid) return { ok: true };
    return { ok: false, grunn: v?.ut === "admin" ? "admin" : "annen", annen: !!v?.sid };
  } catch (e) {
    console.error("Kunne ikke lese økta:", e.message);
    return { ok: true };
  }
}

export async function erAktiv(store, bruker, sid) {
  return (await aktivStatus(store, bruker, sid)).ok;
}

export async function glemAktiv(store, bruker, sid) {
  if (!store) return;
  const v = await store.get("okt:" + bruker, { type: "json" });
  if (v && v.sid === sid) await store.delete("okt:" + bruker);
}

// Admin-sida kaster ut: alle økter for brukeren blir ugyldige.
export async function kastUt(store, bruker) {
  await store.setJSON("okt:" + bruker, { sid: null, ut: "admin", t: Date.now() });
}

// Kontoen: salt og hash fra Blobs hvis admin-sida har laget nytt passord, ellers
// fra brukere.mjs. null = ukjent brukernavn. Kaster feil hvis Blobs ikke svarer,
// så et stengt eller endret passord aldri faller tilbake til det gamle.
export async function hentKonto(store, bruker) {
  if (!Object.hasOwn(BRUKERE, bruker)) return null;
  const fast = BRUKERE[bruker];
  const v = store ? await store.get("konto:" + bruker, { type: "json" }) : null;
  if (!v) return { salt: fast.salt, hash: fast.hash, stengt: false, endret: null, brukernavn: bruker };
  return { salt: v.salt || fast.salt, hash: v.hash || fast.hash, stengt: !!v.stengt, endret: v.endret ?? null,
    brukernavn: v.brukernavn || bruker };
}

// Finner kontoen for brukernavnet eleven skrev. Gir { id, ...konto } eller null.
// Har kontoen fått nytt brukernavn, virker ikke det gamle (f.eks. elev03) lenger.
export async function finnKonto(store, skrevet) {
  const alias = store ? await store.get("alias:" + skrevet, { type: "json" }) : null;
  const id = alias?.id && Object.hasOwn(BRUKERE, alias.id) ? alias.id : skrevet;
  const konto = await hentKonto(store, id);
  if (!konto || konto.brukernavn !== skrevet) return null;
  return { id, ...konto };
}

export const GYLDIG_BRUKERNAVN = /^[a-z0-9][a-z0-9._-]{1,38}[a-z0-9]$/;

// Gir kontoen id et nytt brukernavn. nytt === id setter det tilbake til det opprinnelige.
// Gir null når det gikk, ellers en feilmelding.
export async function endreBrukernavn(store, id, nytt) {
  if (!GYLDIG_BRUKERNAVN.test(nytt)) return "Brukernavnet må være 3–40 tegn: små bokstaver a–z, tall, punktum, bindestrek eller understrek.";
  const konto = await hentKonto(store, id);
  if (konto.brukernavn === nytt) return null;
  if (nytt !== id) {
    if (Object.hasOwn(BRUKERE, nytt)) return "Brukernavnet er i bruk av en annen konto.";
    const ny = await store.setJSON("alias:" + nytt, { id }, { onlyIfNew: true });
    if (ny && ny.modified === false) {
      const v = await store.get("alias:" + nytt, { type: "json" });
      if (v?.id !== id) return "Brukernavnet er i bruk av en annen konto.";
    }
  }
  if (konto.brukernavn !== id) await store.delete("alias:" + konto.brukernavn);
  await endreKonto(store, id, { brukernavn: nytt === id ? null : nytt });
  return null;
}

export async function endreKonto(store, bruker, endring) {
  const v = (await store.get("konto:" + bruker, { type: "json" })) || {};
  await store.setJSON("konto:" + bruker, { ...v, ...endring });
}
