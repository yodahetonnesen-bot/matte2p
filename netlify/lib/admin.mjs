// Koblingen til admin-sida. Fagsida sender hendelser (innlogging, feil forsøk,
// sidevisninger …) som signerte POST-er til ADMIN_URL/api/hendelse. De sendes i
// bakgrunnen med context.waitUntil, så eleven aldri venter på admin-sida.
// Mangler ADMIN_URL eller ADMIN_DELT_HEMMELIGHET, sendes ingenting, og sida
// virker som før.
import { delt, nyNonce, signerteHoder } from "./signatur.mjs";

export const FAG = "matte2p";

export function adminUrl() {
  const v = globalThis.Netlify?.env?.get?.("ADMIN_URL") ??
    (typeof process !== "undefined" ? process.env.ADMIN_URL : undefined);
  return v && /^https:\/\/[A-Za-z0-9.-]+(:\d+)?\/?$/.test(v) ? v.replace(/\/$/, "") : null;
}

export function klientIp(req, context) {
  return context?.ip || req.headers.get("x-nf-client-connection-ip") || "ukjent";
}
export function nettleser(req) {
  return (req.headers.get("user-agent") || "").slice(0, 300);
}

// hendelse: { type, bruker, … }. Gir løftet tilbake (testene venter på det).
export function sendHendelse(context, hendelse) {
  const url = adminUrl(), hem = delt();
  if (!url || !hem) return Promise.resolve(false);
  const jobb = (async () => {
    const kropp = JSON.stringify({ id: nyNonce(), fag: FAG, t: Date.now(), ...hendelse });
    const res = await fetch(url + "/api/hendelse", {
      method: "POST", body: kropp, headers: await signerteHoder(hem, "hendelse", FAG, kropp),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Admin-sida svarte", res.status);
    return res.ok;
  })().catch((e) => { console.error("Fikk ikke sendt hendelsen til admin-sida:", e.message); return false; });
  if (typeof context?.waitUntil === "function") context.waitUntil(jobb);
  return jobb;
}
