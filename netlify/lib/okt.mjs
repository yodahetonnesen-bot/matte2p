// Økta: en signert informasjonskapsel (HMAC-SHA256) som bare serveren kan lage.
// Den er HttpOnly, så JavaScript på sida kan verken lese eller stjele den.
import { BRUKERE, ITERASJONER } from "./brukere.mjs";

export const KAKE = "__Host-2p_okt";
export const KORT = 12 * 3600;          // uten «forbli pålogget»: 12 timer
export const LANG = 30 * 24 * 3600;     // med «forbli pålogget»: 30 dager

const enc = new TextEncoder();

function b64u(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fraB64(s) {
  const t = s.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(t + "===".slice((t.length + 3) % 4)), (c) => c.charCodeAt(0));
}

export function hemmelighet() {
  const v = globalThis.Netlify?.env?.get?.("MATTE2P_HEMMELIGHET") ??
    (typeof process !== "undefined" ? process.env.MATTE2P_HEMMELIGHET : undefined);
  // Uten en lang nok hemmelighet slipper ingen inn (feiler lukket).
  return v && v.length >= 32 ? v : null;
}

async function hmacNokkel(hem) {
  return crypto.subtle.importKey("raw", enc.encode(hem), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export function nySid() {
  return b64u(crypto.getRandomValues(new Uint8Array(16)));
}

export async function lagOkt(bruker, husk, hem, naa = Date.now(), sid = nySid()) {
  const iat = Math.floor(naa / 1000);
  const data = b64u(enc.encode(JSON.stringify({ u: bruker, sid, iat, exp: iat + (husk ? LANG : KORT) })));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", await hmacNokkel(hem), enc.encode(data)));
  return `${data}.${b64u(sig)}`;
}

export async function sjekkOkt(token, hem, naa = Date.now()) {
  if (!token || !hem || token.length > 1000) return null;
  const [data, sig, ekstra] = token.split(".");
  if (!data || !sig || ekstra !== undefined) return null;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacNokkel(hem), fraB64(sig), enc.encode(data));
    if (!ok) return null;
    const p = JSON.parse(new TextDecoder().decode(fraB64(data)));
    if (typeof p.exp !== "number" || p.exp * 1000 <= naa) return null;
    if (typeof p.sid !== "string" || !p.sid) return null;   // gamle økter uten id må logge inn på nytt
    if (!Object.hasOwn(BRUKERE, p.u)) return null;   // fjernet bruker = utlogget
    return p;
  } catch {
    return null;
  }
}

export function lesKake(req, navn = KAKE) {
  const h = req.headers.get("cookie") || "";
  for (const del of h.split(";")) {
    const i = del.indexOf("=");
    if (i > 0 && del.slice(0, i).trim() === navn) return del.slice(i + 1).trim();
  }
  return null;
}

export function kakeHode(token, husk) {
  return `${KAKE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax` + (husk ? `; Max-Age=${LANG}` : "");
}
export const slettKake = `${KAKE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

// Bare lokale stier som /kapittel3.html#del-b, aldri //andre.no eller javascript:
export function tryggSti(til) {
  return typeof til === "string" && til.length < 300 && /^\/(?![\/\\])[A-Za-z0-9._~\-\/#?=&%]*$/.test(til) ? til : "/";
}

// Et fast salt for ukjente brukernavn, så svaret tar like lang tid uansett.
const TOM = { salt: "AAAAAAAAAAAAAAAAAAAAAA==", hash: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" };

// konto = { salt, hash } fra hentKonto (lager.mjs); null = ukjent bruker.
// Uten konto brukes brukere.mjs direkte.
export async function sjekkPassord(bruker, passord, konto) {
  if (konto === undefined) konto = Object.hasOwn(BRUKERE, bruker) ? BRUKERE[bruker] : null;
  const finnes = !!konto;
  const rad = finnes ? konto : TOM;
  const nokkel = await crypto.subtle.importKey("raw", enc.encode(passord), "PBKDF2", false, ["deriveBits"]);
  const bits = new Uint8Array(await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fraB64(rad.salt), iterations: ITERASJONER }, nokkel, 256));
  const fasit = fraB64(rad.hash);
  let diff = bits.length ^ fasit.length;
  for (let i = 0; i < bits.length; i++) diff |= bits[i] ^ (fasit[i] ?? 0);
  return finnes && diff === 0;
}
