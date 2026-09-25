# repetisjon

## 1
Bruk KPI-tabellen.

| År | 1950 | 2000 | 2010 | 2015 | 2017 | 2019 |
|---|---|---|---|---|---|---|
| KPI | 5,3 | 75,5 | 92,1 | 100 | 105,5 | 110,8 |

a) En genser kostet 449 kr i 2000. Hva hadde den kostet i 2019 hvis prisen fulgte KPI?
> 659 kr
b) Ole kjøpte ei bukse for 899 kr i 2019. Bestefaren betalte 60 kr for ei tilsvarende bukse i 1950. Ole synes det var billig, men bestefar er uenig. Hvem har rett?
> Bestefar har rett. Hans bukse tilsvarer 1254 kr i 2019-kroner.

## 2
Jenny tjente 450 000 kr i 2014, og den nominelle lønna har økt med 2 % per år.

| År | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 |
|---|---|---|---|---|---|---|---|
| KPI | 97,9 | 100 | 103,6 | 105,5 | 108,4 | 110,8 | 112,2 |

a) Sett opp tabellen i et regneark og finn den nominelle lønna hvert år.
> 450 000, 459 000, 468 180, 477 544, 487 094, 496 836 og 506 773 kr
b) Hvilket år hadde Jenny minst kjøpekraft?
> I 2019. Da var reallønna 448 408 kr.
c) Hvor mye måtte hun tjent i 2020 for å ha samme kjøpekraft som i 2014?
> 515 730 kr
?? Formel for lønna: `=B2*1,02`. Reallønn: `=C3*100/B3`.

## 3
KPI var 108,4 i 2018 og 112,2 i 2020. Ulrik tjente 700 000 kr i 2018. Hvor mye måtte han tjent i 2020 for å beholde kjøpekraften?
> 724 539 kr

## 4
Fra 2010 til 2019 steg KPI med 20,3 %. KPI var 92,1 i 2010.
a) Hvor mange prosent steg prisene i gjennomsnitt?
> 20,3 %
b) Finn KPI i 2019.
> 110,8
c) Emilie hadde 215 kr i timelønn i 2010. Finn reallønna i 2010.
> 233,40 kr
d) Fra 2010 til 2019 sank reallønna hennes med 1,2 %. Hvilken timelønn hadde hun i 2019?
> 255,50 kr
!! **d)** Reallønn 2019: $233{,}44\cdot 0{,}988 \approx 230{,}64$ kr. Nominell: $230{,}64\cdot\frac{110{,}8}{100} \approx 255{,}55$ kr, ca. 255,50 kr.

## 5
Maren kjøper en motorsykkel til 82 000 kr. Hun har 30 000 kr og låner resten som annuitetslån over fire år med én termin per år, 3,2 % rente og terminbeløp 14 056 kr. Lag en nedbetalingsplan i regneark.
>> | År | Restlån | Renter | Avdrag | Terminbeløp |
>> |---|---|---|---|---|
>> | 1 | 52 000,00 | 1664,00 | 12 392,00 | 14 056 |
>> | 2 | 39 608,00 | 1267,46 | 12 788,54 | 14 056 |
>> | 3 | 26 819,46 | 858,22 | 13 197,78 | 14 056 |
>> | 4 | 13 621,68 | 435,89 | 13 620,11 | 14 056 |
>>
>> Formler (år 1 i rad 8): renter `=B8*$B$2/100`, avdrag `=E8-C8`, nytt restlån `=B8-D8`. Restlånet etter siste termin blir ca. 1,57 kr fordi terminbeløpet er avrundet.

## 6
Anton trenger 45 000 kr til en ferie. Han setter inn 20 000 kr 1. januar 2020 og 5000 kr ved starten av hvert år etter det. Renta er 0,20 %.
a) Lag et regneark som viser beløpet fram til og med 2025, og oppgi formlene.
>> | År | Start av året |
>> |---|---|
>> | 2020 | 20 000,00 |
>> | 2021 | 25 040,00 |
>> | 2022 | 30 090,08 |
>> | 2023 | 35 150,26 |
>> | 2024 | 40 220,56 |
>> | 2025 | 45 301,00 |
>>
>> Formel: `=B5*(1+$B$2/100)+$B$3`, der B2 er renta og B3 er det årlige innskuddet.
b) Når har Anton råd til å reise?
> I 2025
c) Han vil reise i 2023, men kan ikke spare mer enn 5000 kr i året. Hvor høy måtte renta vært?
> 12,0 %
!! **c)** Vi løser $20\,000\cdot k^3 + 5000(k^2 + k + 1) = 45\,000$ i CAS og får $k \approx 1{,}120$.

## 7
Lag et program i Python der brukeren skriver inn KPI og reallønn, og programmet regner ut nominell lønn.
>> ```python
>> kpi = float(input("KPI: "))
>> reallonn = float(input("Reallønn: "))
>> nominell = reallonn * kpi / 100
>> print("Nominell lønn:", round(nominell), "kr")
>> ```

## 8
Aurora er 17 år. I mars 2020 jobbet hun 33 timer og tjente 5775 kr.
a) Hva var timelønna?
> 175 kr
b) Frikortbeløpet var 55 000 kr. Hvor mange timer kan hun jobbe før hun passerer det?
> 314 timer
c) Hun fikk 30 % prosenttrekk på det som var over 55 000 kr, og tjente 84 000 kr i alt. Hvor mye betalte hun i skatt?
> 8700 kr

## 9
En familie kjøper et hjemmekinoanlegg til 18 600 kr med kredittkort (1,7 % per måned) og betaler ikke avdrag.
a) Hvor mye skylder de etter ett år?
> 22 770 kr
b) Hvor mange prosent har gjelden vokst?
> 22,4 %
c) De fikk redusert skatten med 22 % av rentene. Hvor mye?
> 917 kr
d) Løs likningen $18\,600\cdot 1{,}017^x = 25\,000$ grafisk. Hva forteller svaret?
> $x \approx 17{,}5$. Det går ca. 17,5 måneder før familien skylder 25 000 kr.
::plot x=0,24 y=18000,28000 xs=2 ys=1000 h=240 xl=\text{måneder} yl=\text{kr}
f: 18600*1.017^x | label=18\,600\cdot1{,}017^x | at=6
hy: 25000 | dash
p: 17.54,25000
::
