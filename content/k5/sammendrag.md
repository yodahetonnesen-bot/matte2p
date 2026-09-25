## Sentralmål

::def Typetall
Typetallet er den observasjonsverdien som forekommer flest ganger. Et datasett kan ha flere typetall.
::

::def Gjennomsnitt
$$g = \frac{\text{summen av alle observasjonsverdiene}}{N} = \frac{x_1\cdot f_1 + x_2\cdot f_2 + \ldots + x_n\cdot f_n}{N}$$
::

::def Median
Medianen er verdien til observasjonen i midten når materialet er sortert.

- $N$ oddetall: observasjon nummer $\frac{N + 1}{2}$.
- $N$ partall: gjennomsnittet av observasjon nummer $\frac{N}{2}$ og $\frac{N}{2} + 1$.
::

::cols
::diagram soyle xl="Verdi" yl="Frekvens" verdier h=180 tittel="Symmetrisk: g ≈ median"
kat: 1 | 2 | 3 | 4 | 5
f: 1 | 3 | 5 | 3 | 1
::
||
::diagram soyle xl="Verdi" yl="Frekvens" verdier h=180 tittel="Skjevt: g > median"
kat: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
f: 6 | 5 | 3 | 2 | 1 | 1 | 0 | 1
::
::

::tips Hvilket sentralmål?
Har datasettet ekstreme verdier eller er skjevt (lønn, boligpriser), gir **medianen** best bilde. Er det symmetrisk, bruker vi **gjennomsnittet**. **Typetallet** er nyttig for kategorier (skostørrelse, favorittfarge).
::

## Spredningsmål

::def Variasjonsbredde
Variasjonsbredden er differansen mellom den største og den minste observasjonsverdien.
::

::def Standardavvik
$$\sigma = \sqrt{\frac{(x_1 - g)^2\cdot f_1 + (x_2 - g)^2\cdot f_2 + \ldots + (x_n - g)^2\cdot f_n}{N}}$$
Standardavviket er et slags gjennomsnittlig avstand fra gjennomsnittet. Lite standardavvik betyr at dataene ligger tett rundt gjennomsnittet.
::

::merk Legger vi til eller trekker fra det samme tallet
på alle verdiene, endres sentralmålene like mye, mens spredningsmålene er uendret. Ganger vi alle verdiene med et tall, ganges alle målene med det samme tallet.
::

## Digitale verktøy

| | Regneark | Python (`statistics`) |
|---|---|---|
| Gjennomsnitt | `=GJENNOMSNITT(A2:A21)` | `mean(liste)` |
| Median | `=MEDIAN(A2:A21)` | `median(liste)` |
| Typetall | `=MODUS(A2:A21)` | `mode(liste)` |
| Standardavvik | `=STDAV.P(A2:A21)` | `pstdev(liste)` |

## Gruppert materiale

::regel Sentralmål i gruppert materiale
Vi forutsetter at observasjonsverdiene er **jevnt fordelt** i hvert intervall.

- Gjennomsnitt: bruk midtpunktet $m = \frac{a + b}{2}$ i hvert intervall, $g \approx \frac{\sum m\cdot f}{N}$.
- Median: finn intervallet der observasjon nummer $\frac{N}{2}$ ligger, og regn deg fram lineært – eller les av der den kumulative kurven når 50 %.
::
