// Bremser gjetting: 5 feil på ett brukernavn eller 20 feil fra én IP-adresse
// i løpet av 15 minutter gir 15 minutter pause. Tellerne ligger i Netlify Blobs.
export const VINDU = 15 * 60 * 1000;
export const MAKS_BRUKER = 5;
export const MAKS_IP = 20;

async function les(store, nokkel, naa) {
  const v = await store.get(nokkel, { type: "json" });
  return v && naa - v.start < VINDU ? v : { n: 0, start: naa };
}

// Gir antall sekunder til neste forsøk, eller 0 hvis det er fritt fram.
export async function sperret(store, bruker, ip, naa = Date.now()) {
  if (!store) return 0;
  const [b, i] = await Promise.all([les(store, "bruker:" + bruker, naa), les(store, "ip:" + ip, naa)]);
  const vent = Math.max(b.n >= MAKS_BRUKER ? b.start + VINDU - naa : 0, i.n >= MAKS_IP ? i.start + VINDU - naa : 0);
  return Math.ceil(vent / 1000);
}

// Gir hvor mange feil brukernavnet nå har i vinduet.
export async function feil(store, bruker, ip, naa = Date.now()) {
  if (!store) return 0;
  let antall = 0;
  for (const k of ["bruker:" + bruker, "ip:" + ip]) {
    const v = await les(store, k, naa);
    await store.setJSON(k, { n: v.n + 1, start: v.start });
    if (k.startsWith("bruker:")) antall = v.n + 1;
  }
  return antall;
}

// Brukes av admin-sida: { n, til } for en teller, eller null hvis den er utløpt.
export async function teller(store, nokkel, naa = Date.now()) {
  const v = await store.get(nokkel, { type: "json" });
  return v && naa - v.start < VINDU ? { n: v.n, til: v.start + VINDU } : null;
}

export async function riktig(store, bruker) {
  if (store) await store.delete("bruker:" + bruker);
}
