## Babylonske likninger

De eldste matematiske tekstene vi kjenner, ble skrevet med kileskrift på leirtavler i Mesopotamia for omkring 4000 år siden, der Irak ligger i dag. Babylonierne regnet på astronomi, økonomi og jordareal. De hadde ikke formler og symboler slik vi har, men de hadde **oppskrifter** – algoritmer – for å løse praktiske problemer. Tallet 0 og negative tall var ikke i bruk før omkring år 600.

Babylonierne kunne finne sidene i et rektangel når de kjente **arealet** $A$ og **omkretsen** $O$. Med dagens skrivemåte løste de likningssettet
$$\begin{cases} O = 2x + 2y \\ A = x\cdot y \end{cases}$$

::svg w=260 h=140 mw=260 cap="Et rektangel med sider x og y."
<rect class="f1 s1" x="30" y="20" width="200" height="90" style="stroke-width:2"/>
<text class="m" x="130" y="130" text-anchor="middle">x</text>
<text class="m" x="244" y="70">y</text>
::

::regel Babyloniernes framgangsmåte
1. Regn ut en fjerdedel av omkretsen.
2. Gang resultatet med seg selv.
3. Trekk fra arealet.
4. Finn kvadratroten.
5. Legg til resultatet fra steg 1. Da har du den ene sidelengden.
6. Del arealet på svaret fra steg 5. Da har du den andre sidelengden.
::

### Oppgave 1
Et rektangulært jordstykke har areal 72 m² og omkrets 36 m. Bruk babyloniernes metode til å finne sidelengdene, og kontroller grafisk og med CAS.

::losning Løsningsforslag
$36 : 4 = 9$, $\;9\cdot 9 = 81$, $\;81 - 72 = 9$, $\;\sqrt9 = 3$, $\;9 + 3 = 12$ og $72 : 12 = 6$. Sidene er **12 m og 6 m**. Kontroll: $2\cdot 12 + 2\cdot 6 = 36$ og $12\cdot 6 = 72$.

::plot x=0,20 y=0,20 xs=2 ys=2 h=280 eq
f: 18-x | label=2x+2y=36 | at=16
f: 72/x | label=xy=72 | at=4.2 | dom=3.7,20
p: 6,12
p: 12,6
::
::

### Oppgave 2
Finn sidelengdene i et rektangel med areal 6760 m² og omkrets 364 m. Sett prøve.

::losning Løsningsforslag
$364 : 4 = 91$, $\;91^2 = 8281$, $\;8281 - 6760 = 1521$, $\;\sqrt{1521} = 39$, $\;91 + 39 = 130$ og $6760 : 130 = 52$. Sidene er **130 m og 52 m**.
::

### Oppgave 3
Lag et Python-program der du skriver inn $A$ og $O$, og programmet bruker babyloniernes metode til å regne ut sidelengdene.

::losning Løsningsforslag
```python
from math import sqrt

A = float(input("Areal: "))
O = float(input("Omkrets: "))
steg1 = O / 4
steg2 = steg1 * steg1
steg3 = steg2 - A
if steg3 < 0:
    print("Det fins ikke noe slikt rektangel.")
else:
    x = steg1 + sqrt(steg3)
    y = A / x
    print("Sidene er", x, "og", y)
```
Hvis $\left(\frac{O}{4}\right)^2 < A$, fins det ingen løsning: da er arealet for stort i forhold til omkretsen.
::

### Oppgave 4
Løs likningssettet $2x + 2y = 40$ og $x\cdot y = 51$ med babyloniernes metode, og kontroller.

::losning Løsningsforslag
$O = 40$ og $A = 51$: $\;10$, $\;100$, $\;49$, $\;7$, $\;17$ og $51 : 17 = 3$. Løsningen er $x = 17$, $y = 3$ (eller omvendt). Kontroll: $34 + 6 = 40$ og $17\cdot 3 = 51$.
::

### Oppgave 5
a) Bruk innsettingsmetoden til å vise at likningssettet kan skrives $O = 2x + 2\cdot\dfrac{A}{x}$.

b) Bruk babyloniernes metode til å løse likningene $12 = 2x + 2\cdot\dfrac{8}{x}$, $\;40 = 2x + \dfrac{168}{x}\;$ og $\;2x + \dfrac{54}{x} = 24$. Sett prøve.

c) Vis at likningssettet kan skrives $x^2 - \dfrac{O}{2}\cdot x + A = 0$. En likning med $x^2$ kalles en **andregradslikning**.

d) Bruk metoden til å løse $x^2 - 8x + 7 = 0$. Kontroller grafisk og i CAS.

::losning Løsningsforslag
**a)** Fra $A = xy$ får vi $y = \frac{A}{x}$. Innsatt: $O = 2x + 2\cdot\frac{A}{x}$.

**b)** $O = 12$, $A = 8$: $3, 9, 1, 1, 4$ og $8 : 4 = 2$. Løsninger $x = 4$ eller $x = 2$.
$O = 40$, $A = 84$: $10, 100, 16, 4, 14$ og $84 : 14 = 6$. Løsninger $x = 14$ eller $x = 6$.
$O = 24$, $A = 27$: $6, 36, 9, 3, 9$ og $27 : 9 = 3$. Løsninger $x = 9$ eller $x = 3$.

**c)** Gang $O = 2x + \frac{2A}{x}$ med $x$: $Ox = 2x^2 + 2A$. Del på 2 og ordne: $x^2 - \frac{O}{2}x + A = 0$.

**d)** Sammenlikn: $\frac{O}{2} = 8$ gir $O = 16$, og $A = 7$. Metoden: $4, 16, 9, 3, 7$ og $7 : 7 = 1$. Løsningene er $x = 7$ og $x = 1$.

::plot x=-1,9 y=-10,10 xs=1 ys=2 h=260
f: x^2-8*x+7 | label=x^2-8x+7 | at=8.3
p: 1,0
p: 7,0
::
::
