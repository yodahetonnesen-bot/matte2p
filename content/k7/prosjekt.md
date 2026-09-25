## Finn en modell selv

I dette prosjektet samler dere inn egne data og finner den modellen som beskriver dem best.

### Forslag til forsøk

- **Avkjøling:** Mål temperaturen i en kopp te hvert andre minutt i en halvtime.
- **Pendel:** Heng et lodd i en tråd, og mål tiden for ti svingninger med ulike trådlengder.
- **Sprett:** Slipp en ball fra ulike høyder og mål hvor høyt den spretter opp igjen.
- **Mobilbatteri:** Noter batteriprosenten hvert tiende minutt mens du ser en film.

### Slik gjør dere det

1. Planlegg forsøket og lag en tabell.
2. Gjennomfør målingene nøyaktig. Gjenta gjerne hver måling.
3. Legg dataene inn i GeoGebra, et regneark eller Python, og tegn punktene.
4. Prøv flere modeller og sammenlikn $R^2$.
5. Velg modell og argumenter for valget. Hva skjer i virkeligheten?
6. Bruk modellen til å forutsi en ny verdi, og test forutsigelsen med en ny måling.
7. Presenter resultatene med tabell, graf, modell og en vurdering av hvor godt den passer.

::losning Eksempel: pendelen (tenkte målinger)
| Lengde $L$ (m) | 0,2 | 0,4 | 0,6 | 0,8 | 1,0 | 1,2 |
|---|---|---|---|---|---|---|
| Svingetid $T$ (s) | 0,90 | 1,27 | 1,55 | 1,79 | 2,01 | 2,20 |

Punktene danner en kurve som flater ut, og en rett linje gjennom origo passer dårlig. Potensregresjon gir
$$T(L) = 2{,}01 \cdot L^{0{,}50} \qquad R^2 = 0{,}9999$$
Eksponenten er omtrent $0{,}5$, så svingetiden er proporsjonal med kvadratroten av lengden. Det stemmer med fysikken. Modellen forutsier $T(2{,}0) \approx 2{,}8$ s for en 2 m lang pendel, og det kan vi teste.

::widget regresjon data="0.2,0.90;0.4,1.27;0.6,1.55;0.8,1.79;1.0,2.01;1.2,2.20" modell=potens x="0,2.2" y="0,3.2" xl="lengde (m)" yl="svingetid (s)" pred=2 title="Pendelen: potensmodell"
::
