# repetisjon

## 1
a) Finn den prosentvise økningen eller nedgangen når vekstfaktoren er 1,03 – 1,15 – 0,97 – 1,003 – 0,14 – 2.
> 3 % økning, 15 % økning, 3 % nedgang, 0,3 % økning, 86 % nedgang, 100 % økning
b) Finn vekstfaktoren ved 5 % økning, 0,9 % økning, 150 % økning, 7 % nedgang, 38 % nedgang og 0,5 % nedgang.
> 1,05 – 1,009 – 2,5 – 0,93 – 0,62 – 0,995

## 2
a) Du får 20 % rabatt på ei bukse som kostet 900 kr. Hva betaler du?
> 720 kr
b) Du kjøper ei bukse på salg til 525 kr etter 30 % rabatt. Hva kostet buksa før salget?
> 750 kr
!! **b)** $\frac{525}{0{,}70} = 750$ kr.

## 3
Et politisk parti øker oppslutningen fra 20 % til 26 %.
a) Finn økningen i prosentpoeng og i prosent.
> 6 prosentpoeng, som er 30 %
b) Et annet parti øker oppslutningen med 3 prosentpoeng. Det er en økning på 15 %. Hvor stor oppslutning har partiet etter framgangen?
> 23 %
!! **b)** 3 prosentpoeng er 15 % av den gamle oppslutningen: $\frac{3}{0{,}15} = 20\,\%$. Ny oppslutning $20 + 3 = 23\,\%$.

## 4
Innbyggertallet i en by vokser med 10 000 per år. I en annen by vokser det med 0,5 % per år. Hvilken by får flest innbyggere på lang sikt hvis utviklingen fortsetter?
> Byen med prosentvis vekst
?? Den ene veksten er lineær, den andre eksponentiell.

## 5
En familie brukte 20 000 kWh strøm i 2018. I 2019 var forbruket 3 % høyere.
a) Bruk vekstfaktoren og finn strømforbruket i 2019.
> 20 600 kWh
b) Familien reduserte forbruket med 3 % fra 2019 til 2020. Hvor stort var forbruket i 2020?
> 19 982 kWh

## 6
Zara kjøpte aksjer for 10 000 kr. De første to årene steg verdien med 17 % per år, men det neste året sank den med 5 %. Hvilke påstander stemmer?

- A: Verdien er $10\,000\cdot 1{,}17^2\cdot 0{,}95$
- B: Verdien er $10\,000\cdot 1{,}17^2 : 1{,}05$
- C: Verdien er $10\,000\cdot 0{,}17^2\cdot 0{,}05$
- D: Verdien har steget med 29 % på de tre årene.
> Bare påstand A
!! $1{,}17^2\cdot 0{,}95 \approx 1{,}30$, altså 30 % økning, ikke 29 %. B deler på 1,05, som ikke er det samme som å gange med 0,95.

## 7
a) Are kjøpte et hus til 3,2 millioner kroner i 2020. Anta at verdien stiger med 5 % per år fra 2015 til 2025. Hvor mye er huset verdt i 2024?
> 3,9 millioner kroner
b) Hvor mye var huset verdt i 2017?
> 2,8 millioner kroner
c) Ida kjøpte et hus i 2015 til 2,7 millioner kroner. De første tre årene steg verdien med 7 % per år, de neste to sank den med 2 % per år. Hva var huset verdt i 2020?
> 3,2 millioner kroner
!! **a)** $3{,}2\cdot 1{,}05^4 \approx 3{,}89$. **b)** $3{,}2\cdot 1{,}05^{-3} \approx 2{,}76$. **c)** $2{,}7\cdot 1{,}07^3\cdot 0{,}98^2 \approx 3{,}18$.

## 8
Tabellen viser folketallet i Norge i januar noen år.

| Årstall | 2004 | 2007 | 2010 | 2013 | 2015 | 2020 |
|---|---|---|---|---|---|---|
| Befolkning (tusen) | 4577 | 4681 | 4858 | 5051 | 5166 | 5368 |

a) Hvor mange bodde i Norge i januar 2020?
> 5 368 000
b) Finn en eksponentialfunksjon som viser folketallet $x$ år etter 2000.
> $f(x) = 4381\cdot 1{,}011^x$ (i tusen)
c) Hvor stor har den årlige veksten vært?
> 1,1 %
d) Hvor mange vil bo i Norge i januar 2050 hvis utviklingen fortsetter?
> 7,4 millioner
e) I januar 1940 var folketallet 3,0 millioner. Hvordan stemmer det med modellen?
> Modellen gir for lite (2,3 millioner)
f) Hvorfor kan vi ikke bruke modellen til å forutsi folketallet om mange hundre år?
>> Eksponentiell vekst gir et folketall som vokser uten grense. Plass, ressurser, fødselstall og innvandring endrer seg, så veksten vil ikke holde seg på 1,1 % i hundrevis av år.
?? Bruk $x = 4, 7, 10, 13, 15, 20$. 1940 svarer til $x = -60$.

## 9
Kaffe-Lars heller varm kaffe på en termos. Tabellen viser temperaturen $T(x)$ i °C $x$ timer etter at kaffen ble fylt på.

| $x$ (timer) | 4 | 6 | 8 | 10 | 16 |
|---|---|---|---|---|---|
| $T(x)$ (°C) | 76,0 | 68,2 | 61,2 | 55,1 | 40,1 |

a) Finn ved regresjon den eksponentialfunksjonen $T$ som passer best.
> $T(x) = 93{,}9\cdot 0{,}948^x$
b) Tegn grafen til funksjonen.
>> Se grafen.
::plot x=0,20 y=0,100 xs=2 ys=10 h=260 xl=\text{timer} yl=°\text{C}
f: 93.87*0.94817^x | label=T
p: 4,76
p: 6,68.2
p: 8,61.2
p: 10,55.1
p: 16,40.1
hy: 50 | dash
::
c) Hvor mye minker temperaturen i prosent per time?
> 5,2 %
d) Hva var temperaturen da Lars helte kaffen på termosen?
> 93,9 °C
e) Lars drikker ikke kaffen når den er under 50 °C. Hvor lenge er kaffen drikkbar?
> I knapt 12 timer
!! **e)** $T(x) = 50$ gir $x \approx 11{,}8$ timer.

## 10
En rapport fra World Economic Forum anslo 150 millioner tonn plastsøppel i verdenshavene i 2016. En mulig modell sier at mengden øker med 5 % per år.
a) Finn vekstfaktoren og sett opp et uttrykk for mengden plast $x$ år etter 2016.
> $f(x) = 150\cdot 1{,}05^x$ (millioner tonn)
b) Tegn grafen digitalt.
>> Se grafen.
::plot x=0,40 y=0,1100 xs=5 ys=100 h=260 xl=\text{år_etter_2016} yl=\text{mill._tonn}
f: 150*1.05^x | label=f
hy: 812 | dash | label=812
::
c) Rapporten anslår at det finnes 812 millioner tonn fisk i havet. Når passerer plasten fiskemengden ifølge modellen?
> I løpet av 2050
d) Vurder hvor realistiske slike beregninger er.
>> Modellen forutsetter 5 % vekst hvert år i over 30 år. Både tallet for plast og tallet for fisk er grove anslag, og tiltak mot forsøpling (eller økt forbruk) kan endre veksten mye. Beregningen viser et alvorlig scenario, men ikke en sikker prognose.
!! **c)** $150\cdot 1{,}05^x = 812$ gir $x \approx 34{,}6$, altså i løpet av 2050.
