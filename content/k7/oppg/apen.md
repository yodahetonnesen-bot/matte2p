# apen

## 7.300
Finn statistikk over noe som endrer seg over tid, for eksempel folketallet i kommunen din, prisen på en vare eller antall elbiler i Norge (for eksempel fra SSB). Tilpass minst to modeller, velg den beste og bruk den til å anslå en verdi fem år fram. Hvor sikker er du på svaret?
>> Et godt svar viser dataene i tabell og graf, sammenlikner minst to modeller med $R^2$ og med en vurdering av hva som skjer i virkeligheten, og diskuterer usikkerheten ved å bruke modellen utenfor dataene.

## 7.301
Et mobilabonnement koster 199 kr per måned med fri data. Et annet koster 49 kr per måned pluss 10 kr per GB. Undersøk når hvert abonnement lønner seg, og vis det med grafer.
>> $A(x) = 199$ og $B(x) = 10x + 49$. De koster like mye når $10x + 49 = 199$, altså ved 15 GB. Bruker du mindre enn 15 GB per måned, lønner abonnement B seg. Bruker du mer, lønner A seg.
::plot x=0,25 y=0,320 xs=5 ys=50 h=260 xl=\text{GB} yl=\text{kr}
f: 199 | label=A | at=22
f: 10*x+49 | label=B | at=22
p: 15,199 | label=(15,\,199)
::

## 7.302
Hvor mange sandkorn er det på en strand? Gjør antakelser om lengde, bredde og dybde av stranda og om størrelsen på et sandkorn, og svar på standardform.
>> Eksempel: stranda er 500 m lang, 40 m bred og 2 m dyp, altså $4 \cdot 10^4\ \text{m}^3$. Et sandkorn har volum ca. $(0{,}5\ \text{mm})^3 \approx 1{,}25 \cdot 10^{-10}\ \text{m}^3$, og sanden fyller ca. 60 % av volumet. Antall: $\frac{0{,}6 \cdot 4 \cdot 10^4}{1{,}25 \cdot 10^{-10}} \approx 2 \cdot 10^{14}$ sandkorn.
