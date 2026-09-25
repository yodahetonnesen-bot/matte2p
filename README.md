# Matematikk 2P – interaktiv øvingsside

En øvingsnettside for Matematikk 2P (vg2): forklaringer til hvert tema, alle oppgavene i boka med fasit, interaktive figurer, treningsmodus med automatisk retting og en graftegner med regresjon.

## Innhold

| Kapittel | Tema |
|---|---|
| 1 | Prosent: prosentpoeng, vekstfaktor, prosentvis endring over flere perioder, eksponentielle modeller |
| 2 | Likninger og ulikheter: lineære likninger, formler, likningssett, ulikheter, grafisk løsning |
| 3 | Økonomi: indeks og KPI, kroneverdi og reallønn, lønn og skatt, sparing, lån og budsjett |
| 4 | Statistikk – analyse og presentasjon: frekvens, søyle-, linje- og sektordiagram, histogram, kumulativ frekvens |
| 5 | Sentralmål og spredningsmål: gjennomsnitt, median, typetall, variasjonsbredde, kvartiler, standardavvik |
| 6 | Geometri: formlikhet, målestokk, Pytagoras, areal, overflate og volum |
| 7 | Ekstra: tall på standardform, proporsjonalitet, funksjoner og modeller |

- **Teori** for alle delkapitler, med regelbokser, eksempler med løsning, vanlige feil og «Utforsk».
- **Oppgaver med fasit**: teoridelen, repetisjon, Øv mer, blandede og åpne oppgaver. Hint og løsningsforslag der det hjelper.
- **Figurer tegnet på nytt**: grafer, tabeller, søyle-, sektor- og linjediagram, histogram og kumulativ frekvens.
- **Interaktive figurer**: prosent og vekstfaktor, renteregning, lån, sparing, KPI og reallønn, regresjon, sentralmål, histogram, sektordiagram, formlikhet, Pytagoras, volum, standardform, stigningstall og grafisk løsning av likninger.
- **Trening**: uendelig mange genererte oppgaver med automatisk retting (prosent, vekstfaktor, rente, prosentpoeng, standardform, likninger, stigningstall, eksponentielle modeller, gjennomsnitt, median, typetall, standardavvik m.m.).
- **Graftegner** med skjæringspunkter og regresjon (lineær, eksponentiell, potens og andregrads).
- **Formelsamling**, **søk** (Ctrl/⌘ + K) og **fremgang** som lagres i nettleseren.

## Kom i gang

```bash
npm install
npm test         # testene for innlogging og admin-koblingen
npm run dev      # http://localhost:3000
npm run build    # statisk bygg av alle sider til mappen out/
```

## Publisere på Netlify

Sida **må publiseres fra Git**, ikke som zip eller dra-og-slipp. Innloggingen kjører som Netlify-funksjoner (`netlify/functions/`) og en edge-funksjon (`netlify/edge-functions/vakt.mjs`), og de blir bare satt opp når Netlify bygger fra repoet. En opplastet `out/`-mappe ville vært helt åpen for alle.

1. Netlify → **Add new site → Import an existing project** → GitHub → velg `matte2p` og grenen du vil publisere.
2. Byggeinnstillingene står i `netlify.toml` (`npm run build`, publiser `out/`). Du trenger ikke fylle inn noe selv.
3. Legg inn miljøvariablene under (Site configuration → Environment variables), og deploy på nytt.

| Miljøvariabel | Hva |
|---|---|
| `MATTE2P_HEMMELIGHET` | Minst 32 tilfeldige tegn. Signerer innloggingsøktene. Uten den slipper ingen inn. Bytter du den, blir alle logget ut. |
| `ADMIN_URL` | Adressen til admin-sida, f.eks. `https://min-admin.netlify.app` (uten `/` på slutten). |
| `ADMIN_DELT_HEMMELIGHET` | Den samme delte hemmeligheten som admin-sida og de andre fagsidene bruker. |

På **admin-sida** setter du `MATTE2P_URL` til adressen til 2P-sida og deployer admin-sida på nytt.

Tilfeldige tegn: `python3 -c "import secrets; print(secrets.token_urlsafe(48))"`.

## Struktur

| Mappe | Innhold |
|---|---|
| `content/k{n}/` | Teori (`1-1.md` …), `intro.md`, `sammendrag.md`, `prosjekt.md` |
| `content/k{n}/oppg/` | Oppgaver per kategori |
| `lib/chapters.ts` | Kapitler og delkapitler |
| `lib/markup.ts` | Parser for innholdsformatet |
| `lib/drills.ts` | Generatorer for treningsoppgaver |
| `lib/regression.ts`, `lib/kpi.ts` | Regresjon og KPI-tabell |
| `components/widgets/` | Interaktive figurer |
| `components/plot/` | Koordinatsystem, grafer og diagrammer |
| `netlify/` | Innlogging, admin-koblingen og testene |

### Innholdsformat

Teori skrives i en markdown-variant med `$…$`/`$$…$$` for matematikk og blokker som

```
::regel Tittel          ::eks Oppgavetekst       ::plot x=-3,3 y=-2,4
…                       ---                      f: 2*x + 1 | label=f
::                      løsning                  p: 1,3
                        ::                       ::
```

Diagrammer:

```
::diagram soyle tittel="Karakterer" xl=Karakter yl="Antall"
kat: 1 | 2 | 3 | 4 | 5 | 6
2P: 2 | 5 | 8 | 7 | 4 | 1
::

::diagram histogram xl="Høyde (cm)"
grenser: 150 | 160 | 170 | 180
frekvens: 4 | 9 | 5
::
```

Andre typer: `sektor`, `linje`, `kumulativ`. Geometrifigurer skrives som `::svg`.

Oppgaver:

```
# teori
## 1.12 @1.1
Regn ut.
a) 25 % av 480 kr
> 120 kr            ← fasit fra boka
>> 120 kr           ← svar laget for denne sida (boka har ikke fasit)
?? hint
!! løsningsforslag
```

Der fasiten i boka er feil, står riktig svar med en kort merknad (`::rettet`).

## Opphavsrett

Oppgavetekstene og fasitsvarene er hentet fra læreboka i Matematikk 2P og er bare ment for privat øving i en lukket gruppe. **Ikke publiser sida offentlig uten tillatelse fra forlaget.** Teoriforklaringene, løsningsforslagene, svarene merket «eget svar», figurene og de interaktive verktøyene er laget for denne sida.

## Innlogging

Sida er låst med den samme innloggingen som de andre fagsidene. Ti kontoer (`elev01`–`elev10`) kan logge inn, med egne passord for denne sida, og det går ikke an å lage egne kontoer. Passordene står ingen steder i repoet.

Sjekken skjer på serveren, ikke i nettleseren:

- `netlify/edge-functions/vakt.mjs` står foran alle sidene. Uten gyldig økt sendes du til `logg-inn.html`, og ingen side blir sendt ut.
- `netlify/functions/logg-inn.mjs` sjekker passordet mot PBKDF2-SHA256-hasher (600 000 runder, eget salt per bruker) i `netlify/lib/brukere.mjs`.
- Økta er en signert kake (HMAC-SHA256) som er `HttpOnly`, `Secure` og `SameSite=Lax`. «Forbli pålogget» holder deg inne i 30 dager, ellers 12 timer.
- Fem feil på ett brukernavn, eller tjue fra én IP-adresse, gir 15 minutter pause (Netlify Blobs).
- **Én enhet per konto.** Logger noen inn med et brukernavn som allerede er i bruk, blir den forrige enheten logget ut med beskjed om hvorfor.

**Admin-sida:** innlogginger, feil forsøk, utkastinger og sidevisninger sendes til den felles admin-sida (repoet `yodahetonnesen-bot/Admin`) med fagkoden `matte2p`. Derfra kan du logge ut en elev, stenge eller åpne en konto, lage nytt passord og endre brukernavnet (f.eks. `elev03` → `ola`). Passord og stenging fra admin-sida lagres i Netlify Blobs og går foran `brukere.mjs`, som bare er startverdien.

**Nytt passord uten admin-sida:** `python3 netlify/nytt-passord.py elev03` skriver ut et nytt passord og en linje som erstatter den gamle i `brukere.mjs`.

`netlify/lib/signatur.mjs` skal være lik i admin-repoet og alle fagrepoene.
