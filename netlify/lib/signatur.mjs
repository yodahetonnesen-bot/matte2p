// Signerte meldinger mellom fagsidene og admin-sida (HMAC-SHA256 med den delte
// hemmeligheten ADMIN_DELT_HEMMELIGHET). Fila er lik i alle seks repoene.
//   formål "hendelse": fagside → admin (/api/hendelse), f.eks. en innlogging
//   formål "kommando": admin → fagside (/api/admin), f.eks. «logg ut elev03»
// Signaturen dekker formål, fag, tid, nonce og hele kroppen, så en melding kan
// ikke flyttes til et annet formål eller fag, og gamle meldinger avvises.
export const VINDU = 5 * 60 * 1000;
export const FAGENE = ["fysikk", "biologi", "geofag", "matte", "matte2p"];
// Fagkoden: små bokstaver a–z og sifre, starter med en bokstav (f.eks. matte2p).
export const GYLDIG_FAG = /^[a-z][a-z0-9]{1,11}$/;

const enc = new TextEncoder();

function b64u(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fraB64u(s) {
  const t = s.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(t + "===".slice((t.length + 3) % 4)), (c) => c.charCodeAt(0));
}

export function delt() {
  const v = globalThis.Netlify?.env?.get?.("ADMIN_DELT_HEMMELIGHET") ??
    (typeof process !== "undefined" ? process.env.ADMIN_DELT_HEMMELIGHET : undefined);
  return v && v.length >= 32 ? v : null;
}

export function nyNonce() {
  return b64u(crypto.getRandomValues(new Uint8Array(16)));
}

function tekst(formal, fag, tid, nonce, kropp) {
  return `${formal}\n${fag}\n${tid}\n${nonce}\n${kropp}`;
}
async function nokkel(hem) {
  return crypto.subtle.importKey("raw", enc.encode(hem), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signer(hem, formal, fag, tid, nonce, kropp) {
  const sig = await crypto.subtle.sign("HMAC", await nokkel(hem), enc.encode(tekst(formal, fag, tid, nonce, kropp)));
  return b64u(new Uint8Array(sig));
}

// Hodene som følger med en signert POST.
export async function signerteHoder(hem, formal, fag, kropp, naa = Date.now(), nonce = nyNonce()) {
  return {
    "content-type": "application/json",
    "x-fag": fag, "x-tid": String(naa), "x-nonce": nonce,
    "x-signatur": await signer(hem, formal, fag, naa, nonce, kropp),
  };
}

// Sjekker en mottatt melding. Gir { fag, nonce, tid } eller null.
export async function sjekkSignert(hem, formal, headers, kropp, naa = Date.now()) {
  if (!hem) return null;
  const fag = headers.get("x-fag") || "", nonce = headers.get("x-nonce") || "";
  const tid = Number(headers.get("x-tid")), sig = headers.get("x-signatur") || "";
  if (!GYLDIG_FAG.test(fag) || !/^[A-Za-z0-9_-]{8,64}$/.test(nonce)) return null;
  if (!Number.isFinite(tid) || Math.abs(naa - tid) > VINDU) return null;
  if (!/^[A-Za-z0-9_-]{43}$/.test(sig)) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await nokkel(hem), fraB64u(sig), enc.encode(tekst(formal, fag, tid, nonce, kropp)));
    return ok ? { fag, nonce, tid } : null;
  } catch {
    return null;
  }
}
