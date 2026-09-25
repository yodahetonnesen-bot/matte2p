# repetisjon

## 1
Hvilke av likningene har løsningen $x = 2$?

- A: $4x - 5 = 2x - 1$
- B: $7x - 18 = -2(x + 18)$
- C: $2x + \frac32 = \frac{4x + 25}{6}$
> A og C
!! Med $x = 2$: A gir $3 = 3$. B gir $-4$ og $-40$. C gir $\frac{11}{2}$ og $\frac{33}{6} = \frac{11}{2}$.

## 2
En elev har løst en likning slik, men har gjort en feil:
$$\begin{aligned} 6x - 4 &= -6(x + 4) \\ 6x - 4 &= -6x - 4 \\ 12x &= 0 \\ x &= 0 \end{aligned}$$
Finn feilen, og løs likningen riktig.
> Feilen er i multiplikasjonen med parentesen: $-6(x + 4) = -6x - 24$. Løsningen er $x = -\frac53$.

## 3
Løs likningene ved regning. Kontroller i CAS.
a) $5x - 9 = -x + 3$
> $x = 2$
b) $\frac{x}{6} + \frac14 = \frac13 - \left(\frac34 - \frac{x}{3}\right)$
> $x = 4$

## 4
Løs likningen både ved regning og digitalt: $4x^2 - 10 = 54$
> $x = -4$ eller $x = 4$

## 5
Lise og Henrik er foreldrene til Grete. Til sammen er familien 108 år. Lise er fire år yngre enn Henrik, og Henrik er tre ganger så gammel som Grete. Hvor gamle er de?
> Lise 44 år, Henrik 48 år og Grete 16 år

## 6
Undersøk om likningen er riktig løst, og kommenter feilene.
$$\begin{aligned} \frac{2x}{3} + \frac12 &= \frac16 - 2 \\ 4x + 3 &= 1 - 2 \\ 4x &= -4 \\ x &= -1 \end{aligned}$$
Lag en riktig løsning.
> Løsningen er ikke riktig. Eleven har glemt å gange $-2$ med 6; det skal bli $-12$. Riktig løsning er $x = -\frac72$.
!! $4x + 3 = 1 - 12$ gir $4x = -14$ og $x = -\frac72$.

## 7
Kaia får to tilbud. Tilbud 1: 700 kr i fast månedslønn og 50 kr per plenklipp. Tilbud 2: 500 kr i fast lønn og 100 kr per plenklipp.
a) Sett opp et uttrykk for hvert tilbud.
> Tilbud 1: $y = 50x + 700$. Tilbud 2: $y = 100x + 500$
b) Tegn grafene og gi Kaia råd.
> Kaia bør velge tilbud 1 hvis hun klipper plenen mindre enn 4 ganger i måneden.
::plot x=0,8 y=0,1400 xs=1 ys=200 h=260 xl=\text{ganger} yl=\text{kr}
f: 50*x+700 | label=\text{Tilbud 1} | at=1 | pos=nw
f: 100*x+500 | label=\text{Tilbud 2} | at=7
p: 4,900 | label=(4,\ 900)
::

## 8
Løs likningssettet med innsettingsmetoden og addisjonsmetoden. Kontroller i CAS.
$$\begin{cases} 3x - 4y = 18 \\ x + 2y = -4 \end{cases}$$
> $x = 2$ og $y = -3$

## 9
2 skruer og 6 muttere veier 70 g. 3 skruer og 4 muttere veier 80 g.
a) Hvor mye veier én skrue og én mutter?
> Skrue: 20 g, mutter: 5 g
b) Endre opplysningene slik at det ikke er mulig å bestemme vektene.
> For eksempel: «4 skruer og 12 muttere veier 140 g» i stedet for den andre opplysningen.
?? Hvis den ene likningen bare er den andre ganget med et tall, har du egentlig bare én opplysning.

## 10
Figuren viser grafene til $f(x) = 2x - 8$ og $g(x) = -3x + 2$.
::plot x=-2,6 y=-10,8 xs=1 ys=2 h=280
f: 2*x-8 | label=f | at=5.5
f: -3*x+2 | label=g | at=-1.5
p: 2,-4
vx: 2 | dash
::
a) Bruk figuren til å løse ulikheten $2x - 8 < -3x + 2$.
> $x < 2$
b) Løs ulikheten ved regning og i CAS.
> $x < 2$

## 11
Løs ulikheten ved regning, og kontroller i CAS: $\frac32 x > 1 + 2\left(x - \frac13\right)$
> $x < -\frac23$

## 12
Løs likningen $x^2 + 2x - 8 = 2x - 4$ grafisk.
> $x = -2$, $x = 2$
::plot x=-5,4 y=-10,8 xs=1 ys=2 h=280
f: x^2+2*x-8 | label=y=x^2+2x-8 | at=-4.6
f: 2*x-4 | label=y=2x-4 | at=3.5
p: -2,-8
p: 2,0
::

## 13
Bestefar forteller at da han la gavene i hauger på 2, 3, 4, 5, 6 eller 7, ble det aldri noen til overs. Hvor mange gaver hadde han minst delt ut?
> 420 julegaver
?? Antallet må være delelig med alle tallene 2–7. Finn minste felles multiplum.
!! $4 = 2^2$, $6 = 2\cdot 3$. Minste felles multiplum av 2, 3, 4, 5, 6 og 7 er $2^2\cdot 3\cdot 5\cdot 7 = 420$.
