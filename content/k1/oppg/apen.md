# apen

## 1.300 @1.2
Teksten er hentet fra Folkehelseinstituttet (FHI) og gjelder uke 43 i 2020 (forkortet):

> I uke 43 ble det meldt 1686 tilfeller, en 79 % økning fra 941 tilfeller i uke 42. I uke 43 ble 98 041 personer testet, en økning på 10 % fra uka før. Andelen positive blant de testede gikk opp fra 1,05 % i uke 42 til 1,72 % i uke 43. […] Totalt 209 kommuner meldte ingen tilfeller i uke 43, og av de 147 som meldte tilfeller, var det 93 som meldte færre enn 5 tilfeller. […] Der vi har informasjon, ser vi at andelen smittet i utlandet har økt fra 17 % i uke 41 til 25 % i uke 43.

a) Hvor mange meldte koronatilfeller var det i uke 42?
> 941
b) Hvor mange prosent av kommunene hadde ingen meldte tilfeller i uke 43?
> 58,7 %
c) Hvor mange prosent av kommunene som meldte tilfeller, hadde færre enn 5?
> 63,3 %
d) Hvor mange prosentpoeng har andelen smittet i utlandet økt fra uke 41 til uke 43?
> 8 prosentpoeng
e) Lag to spørsmål til teksten, bytt med en medelev og lag løsningsforslag.
>> For eksempel: *Hvor mange ble testet i uke 42?* $\frac{98\,041}{1{,}10} \approx 89\,128$. *Hvor mange prosent økte andelen positive?* $\frac{1{,}72 - 1{,}05}{1{,}05} \approx 64\,\%$.
!! **b)** Det er $209 + 147 = 356$ kommuner: $\frac{209}{356} \approx 58{,}7\,\%$. **c)** $\frac{93}{147} \approx 63{,}3\,\%$.

## 1.301 @1.5
Fjellsjøen er forurenset av et giftstoff. Tabellen viser giftmengden $f(t)$ i mg per tonn vann $t$ uker etter at tiltak ble satt i gang.

| $t$ (uker) | 0 | 10 | 25 | 35 | 45 | 52 |
|---|---|---|---|---|---|---|
| $f(t)$ (mg) | 400 | 351 | 280 | 236 | 210 | 194 |

a) Finn ut mest mulig om hvordan giftmengden utvikler seg, og presenter resultatene for kommunen.
>> Eksponentiell regresjon gir $f(t) \approx 400\cdot 0{,}986^t$. Giftmengden avtar med ca. 1,4 % per uke. Den halveres på ca. 49 uker, og det tar ca. 97 uker (nesten to år) før den er nede i 100 mg. Modellen går aldri helt til null.
::plot x=0,110 y=0,420 xs=10 ys=50 h=260 xl=\text{uker} yl=\text{mg}
f: 400*0.98583^x | label=f
p: 0,400
p: 10,351
p: 25,280
p: 35,236
p: 45,210
p: 52,194
hy: 200 | dash
::
b) Etter 1 år settes det inn nye tiltak, og $g(t) = 194\cdot 0{,}975^t + 20$ er en god modell $t$ uker etter de nye tiltakene. Finn ut mest mulig om utviklingen nå, og presenter resultatene.
>> Nå avtar den *delen som kan fjernes* med 2,5 % per uke, nesten dobbelt så raskt som før. Rett etter tiltaket er giftmengden $g(0) = 214$ mg. Etter et halvt år (26 uker) er den ca. 120 mg, og etter et år ca. 72 mg. Men modellen nærmer seg 20 mg, ikke 0: det vil alltid være rundt 20 mg per tonn igjen. Kommunen bør vite at tiltakene ikke fjerner alt giftstoffet.
::plot x=0,200 y=0,230 xs=20 ys=20 h=240 xl=\text{uker} yl=\text{mg}
f: 194*0.975^x+20 | label=g
hy: 20 | dash
::

## 1.302 @1.1
Aftenposten hadde 8. august 2019 en sak om uhell med elsparkesykler. Illustrasjonen i boka er basert på denne. Her er tallene fra illustrasjonen:

**Uhell med el-sparkesykler.** I juli ble 149 personer i Oslo skadd etter uhell under bruk av elsparkesykkel. Oslo legevakt har hatt 337 legevaktbesøk etter uhell med slike sykler i perioden april til juli.

::cols
::diagram soyle tittel="Antall skader, april–juli" yl="Antall" verdier h=200 mw=300
kat: april | mai | juni | juli
Skader: 34 | 46 | 107 | 149
::
||
::diagram soyle liggende tittel="Skadegrad" verdier h=140 mw=300
kat: Lettere skader | Moderate skader | Alvorlige skader
Skader: 245 | 71 | 21
::
::

- 22 413 skader av alle typer ble registrert på Oslo legevakt i perioden. 337 av dem (1,5 %) skyldtes uhell med elsparkesykkel.
- Flest menn: 61 % menn og 49 % kvinner (slik står det i illustrasjonen).

(Kilde: Oslo universitetssykehus)

Ta utgangspunkt i illustrasjonen og vis kompetansen din i prosentregning. Lag problemstillinger og vis utregninger.
>> Eksempler: Andelen skader i juli: $\frac{149}{337} \approx 44\,\%$. Økning fra april til juli: $\frac{149 - 34}{34} \approx 338\,\%$. Andel lettere skader: $\frac{245}{337} \approx 73\,\%$, og alvorlige: $\frac{21}{337} \approx 6{,}2\,\%$. Andel av alle skader: $\frac{337}{22\,413} \approx 1{,}5\,\%$. Merk at 61 % menn og 49 % kvinner blir 110 %. Det må være en feil i illustrasjonen, for eksempel skal det trolig stå 39 % kvinner.

## 1.303 @1.2
Ungdata er en stor spørreundersøkelse blant ungdom. Diagrammene nedenfor er tegnet på nytt med tallene fra boka.

::cols
::diagram soyle tittel="Gutter" yl="Prosent" verdier h=220 ymax=60 ys=10 mw=320
kat: 8. trinn | 9. trinn | 10. trinn | Vg1 | Vg2 | Vg3
Gutter: 19 | 26 | 30 | 36 | 42 | 53
::
||
::diagram soyle tittel="Jenter" yl="Prosent" verdier h=220 ymax=60 ys=10 mw=320
kat: 8. trinn | 9. trinn | 10. trinn | Vg1 | Vg2 | Vg3
Jenter: 16 | 26 | 30 | 34 | 42 | 48
::
::
Prosentandel som har skulket skolen siste år, etter kjønn og klassetrinn.

::cols
::diagram linje tittel="Ungdomsskolen" yl="Prosent" verdier h=240 ymin=15 ymax=30 ys=5 mw=320
kat: 2011 | 2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018
Jenter: 23 | 22 | 22 | 21 | 20 | 21 | 22 | 24
Gutter: 22 | 20 | 20 | 20 | 20 | 21 | 23 | 25
::
||
::diagram linje tittel="Videregående" yl="Prosent" verdier h=240 ymin=35 ymax=50 ys=5 mw=320
kat: 2015 | 2016 | 2017 | 2018
Jenter: 46 | 40 | 40 | 41
Gutter: 43 | 40 | 41 | 42
::
::
Prosentandel som har skulket skolen siste år, etter kjønn, skoleslag og tidspunkt.

*«Generelt er det et mindretall av ungdom som skulker skolen. Mens under to av ti har skulket skolen det siste året på 8. trinn, gjelder det om lag halvparten av elevene på Vg3. De fleste som skulker, gjør det fra én til fem ganger. Andelen som har skulket mer enn det, er fire prosent på ungdomstrinnet og ni prosent på videregående. […] Andelen som skulker på ungdomsskolen, har økt en god del – fra rundt 20 prosent i 2015 til rundt 25 prosent i 2018.»*

Avgjør om påstandene stemmer.
a) Om lag 50 % av elevene på Vg3 har skulket det siste året.
> Sann
b) 52 % av jentene på Vg3 har ikke skulket skolen.
> Sann
c) 13 % av elevene har skulket mer enn fem ganger.
> Usann
d) Fra 2015 til 2018 økte antallet elever som har skulket på ungdomsskolen, med om lag 5 %.
> Usann
e) Fra 2015 til 2018 var det en nedgang på om lag 5 prosentpoeng blant jenter som har skulket på videregående.
> Sann
f) Flere gutter enn jenter skulket skolen i 2018.
> Sann
g) Andelen gutter som skulker, har økt med 34 prosentpoeng fra 8. trinn til Vg3.
> Sann
h) Mer enn 20 % av elevene på 8. trinn har skulket minst én gang.
> Usann
!! **c)** Det er 4 % på ungdomstrinnet og 9 % på videregående – ikke 4 + 9. **d)** Fra 20 % til 25 % er 5 *prosentpoeng*, som er en økning på 25 %. **g)** $52 - 18 = 34$ prosentpoeng.

## 1.304 @1.5
Tabellen viser folketallet i to kommuner.

| Årstall | 2016 | 2017 | 2018 | 2019 | 2020 |
|---|---|---|---|---|---|
| Kommune A | 12 000 | 12 251 | 12 498 | 12 756 | 12 995 |
| Kommune B | 15 000 | 14 550 | 14 102 | 13 681 | 13 279 |

Sammenlikn befolkningsutviklingen i de to kommunene.
>> Forholdet mellom to naboår er nesten konstant: ca. 1,020 i A og ca. 0,970 i B. Eksponentiell regresjon ($x$ = år etter 2016) gir $A(x) \approx 12\,006\cdot 1{,}020^x$ (2,0 % vekst per år) og $B(x) \approx 14\,998\cdot 0{,}970^x$ (3,0 % nedgang per år). Fortsetter utviklingen, har A flest innbyggere etter ca. 4,4 år, altså i løpet av 2020–2021. Differensene er også nesten like (ca. +250 og −430 per år), så lineære modeller passer omtrent like godt over så kort tid – men de gir ulike prognoser på lang sikt.
::plot x=0,10 y=8000,16000 xs=1 ys=1000 h=260 xl=\text{år_etter_2016} yl=\text{innbyggere}
f: 12006*1.02017^x | label=A
f: 14998*0.96993^x | label=B
p: 0,12000
p: 1,12251
p: 2,12498
p: 3,12756
p: 4,12995
p: 0,15000
p: 1,14550
p: 2,14102
p: 3,13681
p: 4,13279
::

## 1.305 @1.4
Folketallet i en by øker med 0,8 % per år.
a) Hvor lang tid tar det før folketallet er dobbelt så stort?
> ca. 87 år
b) Er det noen sammenheng mellom vekstfaktoren og doblingstida? Undersøk for ulike vekstfaktorer.
>> | Vekst per år | 1 % | 2 % | 5 % | 7 % | 10 % |
>> |---|---|---|---|---|---|
>> | Doblingstid | 69,7 år | 35,0 år | 14,2 år | 10,2 år | 7,3 år |
>>
>> Prosenten ganget med doblingstida er omtrent 70. Doblingstida er uavhengig av startverdien.
c) Utforsk hvor lang tid det tar å halvere folketallet hvis det synker. Undersøk for ulike vekstfaktorer.
>> | Nedgang per år | 1 % | 2 % | 5 % | 10 % |
>> |---|---|---|---|---|
>> | Halveringstid | 69,0 år | 34,3 år | 13,5 år | 6,6 år |
>>
>> Også her er prosent · halveringstid omtrent 70 (litt mindre for store prosenter).
