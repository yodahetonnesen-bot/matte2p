// Rydder i Netlify Blobs hver natt: utløpte feiltellere (de eneste stedene
// fagsida lagrer IP-adresser), utløpte økter og brukte engangsnøkler.
import { butikk } from "../lib/lager.mjs";
import { VINDU } from "../lib/grense.mjs";

export async function rydd(store, naa = Date.now()) {
  let slettet = 0;
  const { blobs } = await store.list();
  for (const { key } of blobs) {
    const v = await store.get(key, { type: "json" }).catch(() => null);
    let gammel = false;
    if (key.startsWith("ip:") || key.startsWith("bruker:")) gammel = !v || naa - v.start >= VINDU;
    else if (key.startsWith("nonce:")) gammel = !v || naa - v.t > 3600e3;
    else if (key.startsWith("okt:")) gammel = !v || (v.sid ? (v.exp ?? v.t + 30 * 24 * 3600e3) < naa : naa - v.t > 31 * 24 * 3600e3);
    if (gammel) { await store.delete(key); slettet++; }
  }
  return slettet;
}

export default async () => {
  const store = butikk();
  if (store) console.log("Rydding: slettet", await rydd(store), "oppføringer.");
};

export const config = { schedule: "@daily" };
