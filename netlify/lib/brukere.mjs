// De ti kontoene som kan logge inn. Det finnes ingen registrering: bare disse.
// Passordene står ingen steder, bare PBKDF2-SHA256-hashen med et eget salt per
// bruker. Nytt passord eller ny bruker: lag hashen med netlify/nytt-passord.py.
// Matematikk 2P har egne passord, ulike fra de andre fagsidene.
export const ITERASJONER = 600000;

export const BRUKERE = {
  elev01: { salt: "gvP7cnA80QdGqMNtuMyg3w==", hash: "L0FCIu42E0zwCF3LXgf99A4j/BCYkIY+2M+wKooLVag=" },
  elev02: { salt: "PkDEreFvMESraVkkmr0OvA==", hash: "Lz/hSfD4aL8o6VpJbi6KA14/FRvNeJsIpK9yNdHgzts=" },
  elev03: { salt: "kuLG0SPpvlMO5sPKjviiEA==", hash: "4WGoVdqyLOuan5StvQM9uQI5aMGg5aQweBmOur5XI/U=" },
  elev04: { salt: "fNan8C1qGm2V1BuK6R2E+w==", hash: "eGH4sqi4upUlzw4bltA23AOhf3oo8F+wUtMW61snr3Q=" },
  elev05: { salt: "gVkvdaOY4XD+XohzoC3JrA==", hash: "RrHoI3iXwogRvQhNGh5X+ZKAGNZwq/NdfHpnuC7Q4RU=" },
  elev06: { salt: "nrboH/0RcSSY2kYgtitMZA==", hash: "xuZoIBuI9hIs3Quix6/oBhRKreEs7EjNEuAV0t2zZIk=" },
  elev07: { salt: "/gfrKoEsdqFjnplBRsJQbw==", hash: "UT5eZGcjAN9idaXL6GCK0xh3tDh0kBjkhWpJ1ci3AWc=" },
  elev08: { salt: "Ri+v81DmpEfvdbYX0W1UAg==", hash: "fwmrBhPkBH9raVEhs7jHkb2EcYxd0t921jZRxSN3apw=" },
  elev09: { salt: "Z/u4zC5T5aiib3n0NFadxQ==", hash: "eXE4m0HLvYoyEseyaWoxXAho/k4PIx5Ah4Rk7GkakkQ=" },
  elev10: { salt: "tQ2lJUU6MFfKWUam4g0ffw==", hash: "500w7zOdFqwZ+6KxlVRwHAmONnlTAJjhwi2zK4icP5Q=" },
};
