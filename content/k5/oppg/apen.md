# apen

## 5.300
Tveita borettslag har målt støynivået ved boligene nær motorveien:

| Støynivå (dB) | $[30, 50\rangle$ | $[50, 60\rangle$ | $[60, 70\rangle$ | $[70, 80\rangle$ | $[80, 90\rangle$ | $[90, 110\rangle$ |
|---|---|---|---|---|---|---|
| Hus | 45 | 38 | 35 | 25 | 12 | 6 |

a) Lag en presentasjon av målingene for veimyndighetene med utregninger og diagrammer.
>> Gjennomsnitt 60,0 dB (med 6 hus i siste intervall) og histogram:
::diagram histogram xl="Støynivå (dB)" yl="Hus per dB" h=220
grenser: 30 | 50 | 60 | 70 | 80 | 90 | 110
frekvens: 45 | 38 | 35 | 25 | 12 | 6
::
b) Tallet på hus i $[90, 110\rangle$ var for lavt. Alt annet stemmer, og gjennomsnittet skal være 62,3 dB. Hvor mange hus er det i dette intervallet?
> 16 hus
!! Med $n$ hus: $\frac{9510 + 100n}{155 + n} = 62{,}3$ gir $n \approx 16$.
c) Veien blir lagt om hvis minst 30 % av husene har minst 70 dB. Må veien legges om?
> Ja. $\frac{25 + 12 + 16}{171} \approx 31\,\%$, altså over 30 %.

## 5.301
Radarkontroll ved en skole (fartsgrense 40 km/h): 38, 40, 39, 31, 56, 75, 39, 15, 15, 38, 40, 38, 41, 42, 40, 15, 29, 30, 40, 25. Lokalavisen skrev: «Pen kjøring av bilistene. Fartsgrensen ble respektert.» Skriv et leserinnlegg der du er uenig. Bruk sentral- og spredningsmål.
>> Gjennomsnittet er 36,3 km/h, medianen 38,5 km/h og typetallet 40 km/h – det ser pent ut. Men standardavviket er 13,5 km/h og variasjonsbredden 60 km/h. Fire bilister kjørte for fort, én i 75 km/h – nesten dobbelt så fort som tillatt forbi en skole. Gjennomsnittet trekkes ned av tre biler i 15 km/h (trolig kø eller svinging) og skjuler de farlige tilfellene.

## 5.302
Ventetid (min) for 50 kunder i en burgerrestaurant:

2, 3, 9, 2, 5, 11, 4, 7, 6, 4, 5, 6, 7, 6, 3, 1, 3, 6, 8, 3, 10, 5, 5, 4, 3, 8, 4, 2, 6, 6, 4, 2, 8, 10, 4, 4, 6, 3, 7, 9, 7, 3, 9, 4, 6, 12, 6, 5, 6, 5

Bearbeid dataene, lag en problemstilling og presenter resultatene med sentralmål og grafiske framstillinger.
>> Problemstilling: *Venter kundene for lenge?* Gjennomsnitt 5,48 min, median 5 min, typetall 6 min, standardavvik 2,50 min. 10 av 50 kunder (20 %) ventet mer enn 7 min.
::diagram soyle xl="Ventetid (min)" yl="Kunder" verdier h=220
kat: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
Kunder: 1 | 4 | 7 | 8 | 6 | 10 | 4 | 3 | 3 | 2 | 1 | 1
::

## 5.303
Antall kasserte komponenter per dag:

| | Man | Tir | Ons | Tor | Fre |
|---|---|---|---|---|---|
| Maskin A | 26 | 35 | 28 | 35 | 26 |
| Maskin B | 31 | 27 | 32 | 27 | 33 |
| Maskin C | 38 | 28 | 28 | 28 | 28 |

Hvilken maskin har den mest stabile produksjonen? Gi fabrikken råd.
>> Alle har gjennomsnitt 30 kasserte per dag. Standardavvik: A 4,15, B 2,53, C 4,0. Variasjonsbredde: A 9, B 6, C 10. Maskin B er mest stabil. Maskin C er helt stabil fire av fem dager, men hadde én dårlig dag – finner fabrikken årsaken til den, kan C bli best.
::diagram linje yl="Kasserte" h=220
kat: Man | Tir | Ons | Tor | Fre
A: 26 | 35 | 28 | 35 | 26
B: 31 | 27 | 32 | 27 | 33
C: 38 | 28 | 28 | 28 | 28
::
