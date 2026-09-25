# apen

## 6.300
Finn ut mest mulig om lengder og arealer på figuren (figuren er tegnet på nytt med egne mål).
::svg w=396 h=246 mw=396 cap="∠C = 90°, CD står vinkelrett på AB. AC = 6 og BC = 8."
<polygon class="ln f1" points="48,192 348,192 156,48"/>
<line class="ln2" x1="156" y1="48" x2="156" y2="192"/>
<polyline class="ln2" points="151,54.7 157.7,59.8 162.7,53"/>
<polyline class="ln2" points="164.4,192 164.4,183.6 156,183.6"/>
<text class="m" x="35.3" y="201.5" text-anchor="middle">A</text>
<text class="m" x="361" y="200.8" text-anchor="middle">B</text>
<text class="m" x="152.2" y="40" text-anchor="middle">C</text>
<text class="m" x="156" y="210.5" text-anchor="middle">D</text>
<text class="sm" x="89" y="114.2" text-anchor="middle">6</text>
<text class="sm" x="261.8" y="111" text-anchor="middle">8</text>
::
>> $AB = \sqrt{6^2 + 8^2} = 10$. Arealet av $\triangle ABC$ er $\frac{6 \cdot 8}{2} = 24$. Høyden $CD = \frac{2 \cdot 24}{10} = 4{,}8$. De tre trekantene $ABC$, $ACD$ og $CBD$ er formlike, og $AD = \frac{6^2}{10} = 3{,}6$, $BD = \frac{8^2}{10} = 6{,}4$. Arealene er $\triangle ACD = \frac{3{,}6 \cdot 4{,}8}{2} = 8{,}64$ og $\triangle CBD = \frac{6{,}4 \cdot 4{,}8}{2} = 15{,}36$. Forholdet mellom arealene er $8{,}64 : 15{,}36 = 9 : 16 = 6^2 : 8^2$.

## 6.301
Inngangen til en speiderleir er to tømmerstokker bundet sammen slik at $\triangle ABC$ blir likesidet. $AB = 5{,}0$ m.
::svg w=376 h=304 mw=280 cap="△ABC er likesidet med AB = 5,0 m."
<line class="mut" x1="40" y1="248" x2="336" y2="248"/>
<line class="ln" x1="88" y1="248" x2="206" y2="43.6"/>
<line class="ln" x1="288" y1="248" x2="170" y2="43.6"/>
<line class="hid" x1="88" y1="248" x2="288" y2="248"/>
<text class="m" x="75.3" y="265.7" text-anchor="middle">A</text>
<text class="m" x="300.7" y="265.7" text-anchor="middle">B</text>
<text class="m" x="168" y="79.8" text-anchor="middle">C</text>
<text class="sm" x="188" y="271" text-anchor="middle">5,0 m</text>
::
Kan en stor lastebil kjøre gjennom?
>> Høyden i trekanten er $\sqrt{5{,}0^2 - 2{,}5^2} \approx 4{,}33$ m. En stor lastebil er ca. 4,0 m høy og 2,55 m bred. I høyden 4,0 m er åpningen bare $5{,}0 \cdot \frac{4{,}33 - 4{,}0}{4{,}33} \approx 0{,}38$ m bred. Skal åpningen være 2,55 m bred, er høyden der bare ca. $4{,}33 \cdot \left(1 - \frac{2{,}55}{5{,}0}\right) \approx 2{,}1$ m. En stor lastebil kommer **ikke** gjennom.

## 6.302
Kvadratet $ABCD$ har sider 6,0 cm. I kvadratet er det innskrevet en sirkel, og i sirkelen et nytt kvadrat.
::svg w=307 h=307 mw=220 cap="Kvadratet ABCD har sider 6,0 cm."
<polygon class="ln f4" points="45.6,261.6 261.6,261.6 261.6,45.6 45.6,45.6"/>
<circle class="ln f1" cx="153.6" cy="153.6" r="108"/>
<polygon class="ln f2" points="230,77.2 77.2,77.2 77.2,230 230,230"/>
<text class="m" x="35.4" y="276.8" text-anchor="middle">A</text>
<text class="m" x="271.8" y="276.8" text-anchor="middle">B</text>
<text class="m" x="271.8" y="40.4" text-anchor="middle">C</text>
<text class="m" x="35.4" y="40.4" text-anchor="middle">D</text>
::
Finn ut mest mulig om arealene.
>> Store kvadrat: $36\ \text{cm}^2$. Sirkel ($r = 3$): $9\pi \approx 28{,}3\ \text{cm}^2$. Lite kvadrat (diagonal 6 cm, side $3\sqrt 2$): $18\ \text{cm}^2$. Det lille kvadratet er halvparten av det store. Sirkelen dekker $\frac{\pi}{4} \approx 79\,\%$ av det store kvadratet, og det lille kvadratet dekker $\frac{2}{\pi} \approx 64\,\%$ av sirkelen.

## 6.303
Helle gikk en skitur på ca. 17 km på 2 timer. På kartet hennes er løypa ca. 34 cm lang (vi har målt for deg). Hvilken målestokk kan kartet ha?
>> $17\ \text{km} = 1\,700\,000\ \text{cm}$, og $\frac{1\,700\,000}{34} = 50\,000$. Kartet har trolig målestokk $1 : 50\,000$, som er vanlig for turkart. Farten 8,5 km/h er rimelig på ski, så tallene henger sammen.

## 6.304
En kvadratisk duk ligger på et rundt bord, og en rund duk ligger på et kvadratisk bord. Hvilken duk dekker størst del av bordet?
::cols
::svg w=240 h=240 mw=180 cap="Kvadratisk duk på rundt bord"
<circle class="ln f4" cx="120" cy="120" r="80"/>
<polygon class="ln f1" points="63.4,176.6 176.6,176.6 176.6,63.4 63.4,63.4"/>
::
||
::svg w=240 h=240 mw=180 cap="Rund duk på kvadratisk bord"
<polygon class="ln f4" points="40,200 200,200 200,40 40,40"/>
<circle class="ln f1" cx="120" cy="120" r="80"/>
::
::
>> La radien være $r$. Kvadratisk duk på rundt bord: duken har diagonal $2r$ og areal $2r^2$, bordet $\pi r^2$. Andel: $\frac{2}{\pi} \approx 64\,\%$. Rund duk på kvadratisk bord (side $2r$): $\frac{\pi r^2}{4r^2} = \frac{\pi}{4} \approx 79\,\%$. Den runde duken dekker størst del.

## 6.305
Undersøk om det er noen sammenheng mellom størrelsene på kvadratene.
::svg w=294 h=294 mw=240 cap="Hvert nytt kvadrat har hjørnene midt på sidene i det forrige."
<polygon class="ln f1" points="35.2,259.2 259.2,259.2 259.2,35.2 35.2,35.2"/>
<polygon class="ln f4" points="147.2,259.2 259.2,147.2 147.2,35.2 35.2,147.2"/>
<polygon class="ln f1" points="203.2,203.2 203.2,91.2 91.2,91.2 91.2,203.2"/>
<polygon class="ln f4" points="203.2,147.2 147.2,91.2 91.2,147.2 147.2,203.2"/>
<polygon class="ln f1" points="175.2,119.2 119.2,119.2 119.2,175.2 175.2,175.2"/>
::
>> Hvert nytt kvadrat har hjørnene midt på sidene i det forrige. Siden blir $\frac{1}{\sqrt 2} \approx 0{,}71$ av den forrige, og arealet halveres hver gang: $64$, $32$, $16$, $8$, $4$ (med ytterste side 8).

## 6.306
Et soverom er 3,55 m langt og 3,50 m bredt. Langs den korteste veggen står fem skuffeseksjoner: tre i midten på 55,0 cm og én på hver side på 90,0 cm. Senga er 2,00 m lang og 1,60 m bred og kan plasseres fritt. Tegn en plantegning i målestokk $1 : 15$.
>> Mål på tegningen: rommet $23{,}7 \times 23{,}3$ cm, seksjonene 6,0 cm og 3,7 cm brede, senga $13{,}3 \times 10{,}7$ cm. Seksjonene er til sammen 3,45 m, så de får plass langs veggen på 3,50 m.
::svg w=422 h=396 mw=380 cap="Plantegning i målestokk 1 : 15 (mål i cm på tegningen)."
<polygon class="ln" points="39.6,351.6 342.9,351.6 342.9,43.9 39.6,43.9"/>
<polygon class="ln2 f4" points="39.6,86.8 117.6,86.8 117.6,43.9 39.6,43.9"/>
<polygon class="ln2 f4" points="117.6,86.8 165.3,86.8 165.3,43.9 117.6,43.9"/>
<polygon class="ln2 f4" points="165.3,86.8 213,86.8 213,43.9 165.3,43.9"/>
<polygon class="ln2 f4" points="213,86.8 260.7,86.8 260.7,43.9 213,43.9"/>
<polygon class="ln2 f4" points="260.7,86.8 338.7,86.8 338.7,43.9 260.7,43.9"/>
<polygon class="ln2 f1" points="78.6,312.6 217.3,312.6 217.3,139.3 78.6,139.3"/>
<text class="sm" x="147.9" y="230.5" text-anchor="middle">seng</text>
<text class="sm" x="147.9" y="250" text-anchor="middle">10,7 × 13,3</text>
<line class="mut" x1="39.6" y1="362" x2="342.9" y2="362"/>
<line class="mut" x1="39.6" y1="360.4" x2="39.6" y2="363.6"/>
<line class="mut" x1="342.9" y1="360.4" x2="342.9" y2="363.6"/>
<text class="sm" x="191.2" y="370.5" text-anchor="middle">23,3 cm</text>
<line class="mut" x1="350.7" y1="351.6" x2="350.7" y2="43.9"/>
<line class="mut" x1="349.1" y1="351.6" x2="352.2" y2="351.6"/>
<line class="mut" x1="349.1" y1="43.9" x2="352.2" y2="43.9"/>
<text class="sm" x="375.6" y="201.7" text-anchor="middle">23,7 cm</text>
::

## 6.307
Nina har 10 m hønsenetting til en innhegning for marsvin. Hvilken form gir størst plass?
>> Kvadrat: side 2,5 m og areal $6{,}25\ \text{m}^2$. Rektangel $2 \times 3$ m: $6\ \text{m}^2$. Sirkel: $r = \frac{10}{2\pi} \approx 1{,}59$ m og areal $\approx 7{,}96\ \text{m}^2$. Sirkelen gir mest plass. Bruker hun en husvegg som en av sidene, kan hun få enda mer: et halvsirkel mot veggen gir $\frac{\pi r^2}{2}$ med $\pi r = 10$, altså ca. $15{,}9\ \text{m}^2$.

## 6.308
En juicekartong skal romme 2,5 L og ha kvadratisk grunnflate. Høyden skal være mellom tre og seks ganger sidekanten. Finn mulige utforminger.
>> Med side $s$ (cm) er $h = \frac{2500}{s^2}$. Kravet $3s \le h \le 6s$ gir $416{,}7 \le s^3 \le 833{,}3$, altså $7{,}5\ \text{cm} \le s \le 9{,}4$ cm. Eksempler: $s = 8$ cm gir $h \approx 39$ cm, og $s = 9$ cm gir $h \approx 31$ cm.

## 6.309
Hvor mange prosent øker volumet og overflatearealet når lengden, bredden og høyden i en kasse alle øker med 10 %?
>> Volumet ganges med $1{,}1^3 = 1{,}331$, altså **33,1 %** økning. Overflaten ganges med $1{,}1^2 = 1{,}21$, altså **21 %** økning. Det gjelder for alle kasser.

## 6.310
En trebit er en terning med sider 5,0 cm. Den dreies til ei kule med størst mulig volum. Er forholdet mellom volumene det samme for andre størrelser?
::svg w=271 h=271 mw=200 cap="Snitt: kula med diameter 5,0 cm inni terningen."
<polygon class="ln f4" points="45.6,225.6 225.6,225.6 225.6,45.6 45.6,45.6"/>
<circle class="ln f1" cx="135.6" cy="135.6" r="90"/>
<text class="sm" x="135.6" y="243.2" text-anchor="middle">5,0 cm</text>
::
>> Kula får diameter 5,0 cm: $V_\text{kule} = \frac{4}{3}\pi \cdot 2{,}5^3 \approx 65{,}4\ \text{cm}^3$, mens $V_\text{terning} = 125\ \text{cm}^3$. Forholdet er $\frac{125}{65{,}4} \approx 1{,}91$. Generelt er det $\frac{s^3}{\frac{4}{3}\pi(s/2)^3} = \frac{6}{\pi}$, altså det samme for alle størrelser.

## 6.311
Sigurd har en komfyr som er 60 cm bred. En gryte er $\frac{3}{4}$ full av saus. Hvor mange kjøttboller kan det være plass til?
>> Antakelser: gryta har diameter 26 cm og høyde 12 cm (passer på en plate på en 60 cm bred komfyr). Volum: $\pi \cdot 13^2 \cdot 12 \approx 6371\ \text{cm}^3$. Tre firedeler er fylt, og saus og kjøttboller deler plassen. Setter vi at kjøttbollene tar halvparten av det fylte volumet, har vi $\approx 2400\ \text{cm}^3$. En kjøttbolle med diameter 4 cm har volum $\approx 33{,}5\ \text{cm}^3$. Det gir ca. 70 kjøttboller.

## 6.312
Ei kule, ei kjegle og en sylinder har samme radius $r$. Sylinderen og kjegla har høyde $r$.
::cols
::svg w=176 h=176 mw=140 cap="Kule"
<circle class="ln f1" cx="88" cy="88" r="48"/>
<line class="ln2" x1="88" y1="88" x2="136" y2="88"/>
<text class="m" x="112" y="81" text-anchor="middle">r</text>
::
||
::svg w=176 h=144 mw=140 cap="Kjegle, h = r"
<polygon class="ln f1" points="40,96 136,96 88,48"/>
<line class="hid" x1="88" y1="96" x2="88" y2="48"/>
<text class="m" x="112" y="115" text-anchor="middle">r</text>
::
||
::svg w=176 h=144 mw=140 cap="Sylinder, h = r"
<polygon class="ln f1" points="40,96 40.3,97.3 41,98.5 42.3,99.7 44.1,100.9 46.4,102 49.2,103.1 52.3,104 55.9,104.9 59.8,105.7 64,106.4 68.5,107 73.2,107.4 78,107.7 83,107.9 88,108 93,107.9 98,107.7 102.8,107.4 107.5,107 112,106.4 116.2,105.7 120.1,104.9 123.7,104 126.8,103.1 129.6,102 131.9,100.9 133.7,99.7 135,98.5 135.7,97.3 136,96 136,48 136,48 135.7,49.3 135,50.5 133.7,51.7 131.9,52.9 129.6,54 126.8,55.1 123.7,56 120.1,56.9 116.2,57.7 112,58.4 107.5,59 102.8,59.4 98,59.7 93,59.9 88,60 83,59.9 78,59.7 73.2,59.4 68.5,59 64,58.4 59.8,57.7 55.9,56.9 52.3,56 49.2,55.1 46.4,54 44.1,52.9 42.3,51.7 41,50.5 40.3,49.3 40,48"/>
<polygon class="ln f1" points="136,48 135.7,46.7 135,45.5 133.7,44.3 131.9,43.1 129.6,42 126.8,40.9 123.7,40 120.1,39.1 116.2,38.3 112,37.6 107.5,37 102.8,36.6 98,36.3 93,36.1 88,36 83,36.1 78,36.3 73.2,36.6 68.5,37 64,37.6 59.8,38.3 55.9,39.1 52.3,40 49.2,40.9 46.4,42 44.1,43.1 42.3,44.3 41,45.5 40.3,46.7 40,48 40.3,49.3 41,50.5 42.3,51.7 44.1,52.9 46.4,54 49.2,55.1 52.3,56 55.9,56.9 59.8,57.7 64,58.4 68.5,59 73.2,59.4 78,59.7 83,59.9 88,60 93,59.9 98,59.7 102.8,59.4 107.5,59 112,58.4 116.2,57.7 120.1,56.9 123.7,56 126.8,55.1 129.6,54 131.9,52.9 133.7,51.7 135,50.5 135.7,49.3 136,48"/>
<polyline class="hid" points="136,96 135.7,94.7 135,93.5 133.7,92.3 131.9,91.1 129.6,90 126.8,88.9 123.7,88 120.1,87.1 116.2,86.3 112,85.6 107.5,85 102.8,84.6 98,84.3 93,84.1 88,84 83,84.1 78,84.3 73.2,84.6 68.5,85 64,85.6 59.8,86.3 55.9,87.1 52.3,88 49.2,88.9 46.4,90 44.1,91.1 42.3,92.3 41,93.5 40.3,94.7 40,96"/>
<text class="m" x="112" y="33" text-anchor="middle">r</text>
::
::
Er det noen sammenheng mellom volumene?
>> $V_\text{sylinder} = \pi r^3$, $V_\text{kjegle} = \frac{1}{3}\pi r^3$ og $V_\text{kule} = \frac{4}{3}\pi r^3$. Forholdet er $1 : 3 : 4$ (kjegle : sylinder : kule), og kula har like stort volum som sylinderen og kjegla til sammen.
