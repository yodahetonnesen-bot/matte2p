# repetisjon

## 1
Onkel Ole noterte kaffekopper de siste 13 dagene: 6, 8, 7, 5, 3, 6, 7, 8, 3, 9, 4, 5, 7.
a) Hvor mange kopper drakk han til sammen?
> 78 kopper
b) Finn variasjonsbredden.
> 6 kopper
c) Finn gjennomsnittet per dag.
> 6 kopper
d) Finn typetallet.
> 7 kopper
e) Finn medianen.
> 6 kopper
f) Hvor mye må han drikke de tre neste dagene for at gjennomsnittet for 16 dager skal bli 5,5 kopper og typetallet 3?
> Én dag 4 kopper og to dager 3 kopper
!! **f)** Totalt $16\cdot 5{,}5 = 88$ kopper, altså $88 - 78 = 10$ de tre dagene. Nå er 7 typetall (3 ganger) og 3 forekommer 2 ganger. Med to dager til på 3 kopper forekommer 3 fire ganger. Den siste dagen blir $10 - 6 = 4$ kopper.

## 2
Feil funnet ved bilkontroll:

| Antall feil | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Antall biler | 18 | 23 | 11 | 15 | 13 | 10 |

a) Finn typetallet.
> 1 feil
b) Bruk Python til å finne gjennomsnittet og medianen.
> Gjennomsnitt 2,13, median 2,0
c) Lag et regneark og finn gjennomsnittet.
> 2,13

## 3
20 elever oppga antall datamaskiner hjemme: 2, 4, 1, 5, 3, 6, 4, 1, 3, 2, 4, 1, 6, 4, 2, 3, 4, 4, 5, 2. Finn gjennomsnittet, medianen, typetallet og standardavviket.
> Gjennomsnitt 3,3, median 3,5, typetall 4, standardavvik 1,52

## 4
Anna Plaske noterte hvor langt hun svømte (km):

| Km | $[4; 4{,}5\rangle$ | $[4{,}5; 5\rangle$ | $[5; 5{,}5\rangle$ | $[5{,}5; 6\rangle$ | $[6; 6{,}5\rangle$ | $[6{,}5; 7\rangle$ | $[7; 8\rangle$ |
|---|---|---|---|---|---|---|---|
| Frekvens | 2 | 6 | 5 | 6 | 12 | 6 | 3 |

a) Hvor mange økter har hun hatt?
> 40 treningsøkter
b) Finn gjennomsnittet i det grupperte materialet (én desimal).
> 5,9 km
c) Hvorfor er det usikkerhet i verdien?
> Vi antar at øktene fordeler seg jevnt om midtpunktet i hvert intervall.
d) Finn medianen grafisk og ved regning.
> ca. 6,1 km
e) Linda svømte 38 km på 6 økter. Hvor langt svømte hun den neste økta når gjennomsnittet ble 6,5 km?
> 7,5 km
!! **d)** 19 økter er kortere enn 6 km. Medianøkta er ca. nr. 20,5, altså nr. 1,5 av de 12 i $[6; 6{,}5\rangle$: $6 + 1{,}5\cdot\frac{0{,}5}{12} \approx 6{,}06$ km. (Med nr. 20 får vi 6,04 km.)
::diagram kumulativ median xl="Km" h=220
grenser: 4 | 4,5 | 5 | 5,5 | 6 | 6,5 | 7 | 8
frekvens: 2 | 6 | 5 | 6 | 12 | 6 | 3
::

## 5
Turlaget Fjelltrim arrangerer «Topp 7» med 200 deltakere. Diagrammet viser hvor mange fjelltopper deltakerne har besøkt (tall laget for denne siden). Lag et regneark som finner gjennomsnittet og standardavviket.
::diagram soyle xl="Antall fjelltopper" yl="Deltakere" verdier h=220
kat: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
Deltakere: 12 | 18 | 24 | 30 | 38 | 34 | 26 | 18
::
>> Gjennomsnitt 3,8 topper, standardavvik ca. 1,96 topper.
>>
>> | $x$ | $f$ | $x\cdot f$ | $(x - g)^2\cdot f$ |
>> |---|---|---|---|
>> | kolonne A | kolonne B | `=A2*B2` | `=(A2-$F$2)^2*B2` |
>>
>> Gjennomsnitt i F2: `=SUMMER(C2:C9)/SUMMER(B2:B9)`. Standardavvik: `=ROT(SUMMER(D2:D9)/SUMMER(B2:B9))`.

## 6
Fødselsvekter (g) for de 15 første barna i Lillevik: 3750, 2900, 3200, 3450, 2750, 4250, 3500, 3770, 4100, 4480, 3550, 3500, 3800, 3290, 3180. I Storevik: 3720, 2790, 3150, 3850, 3000, 4850, 3200, 3790, 4120, 4980, 2750, 2800, 4820, 3950, 2750.
a) Finn gjennomsnittet og standardavviket, og kommenter.
> Lillevik: 3565 g og 463 g. Storevik: 3635 g og 771 g
!! Barna i Storevik veide litt mer i snitt, men vektene varierer mye mer.
b) Vurder påstanden: «Datamaterialet med høyest gjennomsnitt har alltid høyest standardavvik.»
> Påstanden er feil.
c) Vurder påstanden: «Datamaterialet med høyest gjennomsnitt har alltid høyest median.»
> Påstanden er feil.
!! **b)** Moteksempel: $\{10, 10, 10\}$ har høyere gjennomsnitt enn $\{1, 5, 9\}$, men standardavvik 0. **c)** Moteksempel: $\{1, 1, 10\}$ har gjennomsnitt 4 og median 1, mens $\{3, 3, 3\}$ har gjennomsnitt 3 og median 3.
