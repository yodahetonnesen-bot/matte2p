# apen

## 2.300 @2.3
Ole John kaster øks på blink. Treff i den innerste sirkelen gir 7 poeng, i den ytterste 3 poeng, og bom gir 0 poeng. En dag fikk han 65 poeng. Hvor mange treff på 7 og på 3 poeng kan han ha hatt? Hvor mange løsninger finner du?
::svg w=180 h=180 mw=180 cap="Blink: innerst 7 poeng, ytterst 3 poeng."
<circle class="f3 s3" cx="90" cy="90" r="80" style="stroke-width:2"/><circle class="f1 s1" cx="90" cy="90" r="36" style="stroke-width:2"/><text x="90" y="96" text-anchor="middle">7</text><text x="90" y="36" text-anchor="middle">3</text>
::
>> Vi må løse $7a + 3b = 65$ med hele tall $a, b \ge 0$. Tre løsninger: $a = 2, b = 17$; $\;a = 5, b = 10$; $\;a = 8, b = 3$.
?? $65 - 7a$ må være delelig med 3. Prøv $a = 0, 1, 2, \ldots, 9$.

## 2.301 @2.5
Gitt likningssettene
$$\begin{cases} x + 2y = 3 \\ 4x + 5y = 6 \end{cases} \qquad \begin{cases} 7x + 8y = 9 \\ 10x + 11y = 12 \end{cases} \qquad \begin{cases} 13x + 14y = 15 \\ 16x + 17y = 18 \end{cases}$$
Er det noe mønster i hvordan de er bygd opp? Løs dem og sammenlikn svarene.
>> Hver likning har formen $nx + (n + 1)y = n + 2$: tre tall som følger etter hverandre. Alle likningssettene har løsningen $x = -1$, $y = 2$. Det er ikke tilfeldig: $n\cdot(-1) + (n + 1)\cdot 2 = n + 2$ for alle $n$.

## 2.302 @2.3
Figuren viser noen måter fire frimerker kan henge sammen på (hvert frimerke henger fast i minst ett annet langs en hel side). Finn ut hvor mange forskjellige måter fire frimerker kan henge sammen på.
::svg w=230 h=200 mw=240 cap="Fire av måtene fire frimerker kan henge sammen på."
<rect class="f1 s1" x="10" y="10" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="40" y="10" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="10" y="40" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="40" y="40" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="100" y="10" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="130" y="10" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="160" y="10" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="190" y="10" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="10" y="100" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="10" y="130" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="40" y="130" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="70" y="130" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="130" y="100" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="130" y="130" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="130" y="160" width="28" height="28" rx="2" style="stroke-width:1.5"/>
<rect class="f1 s1" x="160" y="160" width="28" height="28" rx="2" style="stroke-width:1.5"/>
::
> 19 måter

## 2.303 @2.5
Pakkene A, B og C henger på to balansestenger. Over hver stang står det hvor mange kilogram det henger på hver side av stanga. Hvor mye veier hver pakke?
::svg w=340 h=230 mw=340 cap="To balansestenger med pakkene A, B og C."
<circle cx="80" cy="22" r="14" style="fill:var(--plot-bg);stroke:var(--plot-ink);stroke-width:1.2"/><text x="80" y="27" text-anchor="middle" style="font-weight:600">58</text>
<line class="ln" x1="15" y1="44" x2="145" y2="44"/>
<line class="ln2" x1="80" y1="36" x2="80" y2="44"/>
<line class="ln2" x1="28" y1="44" x2="28" y2="194"/>
<rect x="12" y="52" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="12" y="52" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="28" y="67" text-anchor="middle">A</text>
<rect x="12" y="76" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="12" y="76" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="28" y="91" text-anchor="middle">A</text>
<rect x="12" y="100" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="12" y="100" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="28" y="115" text-anchor="middle">A</text>
<rect x="12" y="124" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="12" y="124" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="28" y="139" text-anchor="middle">B</text>
<rect x="12" y="148" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="12" y="148" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="28" y="163" text-anchor="middle">B</text>
<rect x="12" y="172" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="12" y="172" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="28" y="187" text-anchor="middle">C</text>
<line class="ln2" x1="132" y1="44" x2="132" y2="218"/>
<rect x="116" y="52" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="116" y="52" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="132" y="67" text-anchor="middle">A</text>
<rect x="116" y="76" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="116" y="76" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="132" y="91" text-anchor="middle">A</text>
<rect x="116" y="100" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="116" y="100" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="132" y="115" text-anchor="middle">B</text>
<rect x="116" y="124" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="116" y="124" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="132" y="139" text-anchor="middle">C</text>
<rect x="116" y="148" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="116" y="148" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="132" y="163" text-anchor="middle">C</text>
<rect x="116" y="172" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="116" y="172" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="132" y="187" text-anchor="middle">C</text>
<rect x="116" y="196" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="116" y="196" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="132" y="211" text-anchor="middle">C</text>
<circle cx="260" cy="22" r="14" style="fill:var(--plot-bg);stroke:var(--plot-ink);stroke-width:1.2"/><text x="260" y="27" text-anchor="middle" style="font-weight:600">28</text>
<line class="ln" x1="195" y1="44" x2="325" y2="44"/>
<line class="ln2" x1="260" y1="36" x2="260" y2="44"/>
<line class="ln2" x1="208" y1="44" x2="208" y2="122"/>
<rect x="192" y="52" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="192" y="52" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="208" y="67" text-anchor="middle">A</text>
<rect x="192" y="76" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="192" y="76" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="208" y="91" text-anchor="middle">B</text>
<rect x="192" y="100" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="192" y="100" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="208" y="115" text-anchor="middle">C</text>
<line class="ln2" x1="312" y1="44" x2="312" y2="146"/>
<rect x="296" y="52" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="296" y="52" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="312" y="67" text-anchor="middle">C</text>
<rect x="296" y="76" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="296" y="76" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="312" y="91" text-anchor="middle">C</text>
<rect x="296" y="100" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="296" y="100" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="312" y="115" text-anchor="middle">C</text>
<rect x="296" y="124" width="32" height="20" rx="2" style="fill:var(--plot-bg)"/><rect class="f4" x="296" y="124" width="32" height="20" rx="2" style="stroke:var(--plot-ink);stroke-width:1"/><text x="312" y="139" text-anchor="middle">C</text>
::
> A = 9 kg, B = 12 kg, C = 7 kg
!! Stang 2: $4C = 28$ gir $C = 7$, og $A + B + C = 28$ gir $A + B = 21$. Stang 1: $3A + 2B + C = 58$ gir $3A + 2B = 51$. Med $B = 21 - A$ får vi $3A + 42 - 2A = 51$, altså $A = 9$ og $B = 12$. Kontroll på høyre side av stang 1: $2\cdot 9 + 12 + 4\cdot 7 = 58$.

## 2.304 @2.2
Tre elever har løst likningen $\frac14 x - \frac23 = \frac{1}{12}(x - 4)$.

**Elise:** $\;\frac{12}{4}x - \frac{24}{3} = \frac{12x}{12} - \frac{48}{12}$, så $3x - 8 = x - 4$, $2x = 4$ og $x = 2$.

**Hege:** $\;\frac{3}{12}x - \frac{8}{12} = \frac{x}{12} - \frac{4}{12}$, så $\frac{2}{12}x = \frac{4}{12}$ og $x = 2$.

**Henning:** $\;12\cdot\frac{x}{4} - 2\cdot\frac{12}{3} = \frac{12}{12}(12x - 48)$, så $3x - 8 = 12x - 48$ og $x = \frac{40}{9}$.

Vurder løsningene, finn eventuelle feil og forklar hvordan elevene har tenkt.
>> **Elise** ganger alle ledd med 12 og får riktig svar. **Hege** skriver alle brøkene med fellesnevner 12 og sammenlikner tellerne – også riktig. **Henning** ganger høyre side med 12 to ganger: både brøken $\frac{1}{12}$ blir $\frac{12}{12}$, og leddene i parentesen ganges med 12. Høyre side skulle blitt $x - 4$. Riktig svar er $x = 2$.

## 2.305 @2.2
En elev har løst $34 - 3x = 6x + 10 + 3x$ slik:
$$\begin{aligned} 34 - 34 - 3x &= 6x + 10 + 3x - 34 \\ 3x &= 9x - 24 \\ -6x &= -24 \\ x &= 4 \end{aligned}$$
Vurder løsningen.
>> Eleven trekker fra 34 på begge sider, men skriver $3x$ i stedet for $-3x$ på venstre side. Riktig: $-3x = 9x - 24$, $-12x = -24$ og $x = 2$. Prøve: v.s. $= 34 - 6 = 28$ og h.s. $= 12 + 10 + 6 = 28$. Svaret $x = 4$ er feil.

## 2.306 @2.3
Sofia bruker ett minutt på en strekning når rullebåndet står stille. Når båndet går, bruker hun to minutter hvis hun står stille på det. Hvor lang tid bruker hun hvis hun går på båndet mens det går?
> 40 s
!! Hun går strekningen $s$ med farten $\frac{s}{1}$ per minutt, og båndet har farten $\frac{s}{2}$ per minutt. Sammen: $\frac{3s}{2}$ per minutt, så tida blir $\frac{2}{3}$ min = 40 s.

## 2.307 @2.3
Fem ungdommer snakker sammen:

- **Aleksander:** Jeg er yngst.
- **Dorthea:** Jeg er eldst.
- **Ayda:** Dorthea er 6 år eldre enn Aleksander.
- **Maiken:** Ingen av oss fem er like gamle.
- **Anders:** Til sammen er vi 87 år. Hvor gamle kan hver av oss være?

>> Kall alderen til Aleksander $x$. Da er Dorthea $x + 6$. De tre andre er eldre enn $x$, yngre enn $x + 6$ og alle ulike, så de er $x + 1$ til $x + 5$. Summen blir mellom $5x + 6 + 6 = 5x + 12$ og $5x + 6 + 12 = 5x + 18$. Den skal være 87, så $5x + 12 \le 87 \le 5x + 18$, som gir $x = 14$ eller $x = 15$.
>>
>> - $x = 15$: Aleksander 15 og Dorthea 21. De tre andre har sum $87 - 36 = 51$ med ulike aldre fra 16 til 20. Det går bare med 16, 17 og 18.
>> - $x = 14$: Aleksander 14 og Dorthea 20. De tre andre har sum $87 - 34 = 53$ med ulike aldre fra 15 til 19. Det går bare med 16, 18 og 19.
>>
>> Det er altså to løsninger: 14, 16, 18, 19 og 20 år, eller 15, 16, 17, 18 og 21 år. Vi vet ikke hvem av Ayda, Maiken og Anders som har hvilken alder.

## 2.308 @2.3
En klasse på 20 elever får numrene 1–20 og skal deles i 6 grupper. Gruppene trenger ikke være like store, men summen av numrene skal være lik i alle gruppene. Hvilke numre kan være på samme gruppe? Er det flere løsninger?
>> Summen av 1–20 er 210, så hver gruppe må ha summen $210 : 6 = 35$. Én løsning: $\{20, 15\}$, $\{19, 16\}$, $\{18, 17\}$, $\{14, 13, 8\}$, $\{12, 11, 10, 2\}$ og $\{9, 7, 6, 5, 4, 3, 1\}$. Det finnes mange andre løsninger, for eksempel kan de to siste byttes ut med $\{12, 11, 9, 3\}$ og $\{10, 7, 6, 5, 4, 2, 1\}$.
