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
::svg w=420 h=60 mw=420 cap="Fem av måtene fire frimerker kan henge sammen på."
<rect class="f1 s1" x="10" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="32" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="54" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="76" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="110" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="132" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="110" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="132" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="180" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="180" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="202" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="224" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="282" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="260" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="282" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="304" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="340" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="362" y="10" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="362" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/><rect class="f1 s1" x="384" y="32" width="20" height="20" rx="2" style="stroke-width:1.5"/>
::
> 19 måter

## 2.303 @2.5
Pakkene A, B og C henger på to balansestenger. Over hver stang står det hvor mange kilogram det henger på hver side. Hvor mye veier hver pakke?
::svg w=420 h=100 mw=420 cap="To balansestenger. Loddene merket 14 og 4 veier 14 kg og 4 kg."
<line class="ln" x1="10" y1="40" x2="190" y2="40"/><line class="ln2" x1="100" y1="8" x2="100" y2="40"/><polygon class="ink" points="94,40 106,40 100,34"/><text x="40" y="30" text-anchor="middle">21 kg</text><text x="160" y="30" text-anchor="middle">21 kg</text><line class="ln2" x1="30" y1="40" x2="30" y2="60"/><rect class="f1 s1" x="14" y="60" width="32" height="28" rx="3" style="stroke-width:1.5"/><text x="30" y="79" text-anchor="middle">A</text><line class="ln2" x1="68" y1="40" x2="68" y2="60"/><rect class="f1 s1" x="52" y="60" width="32" height="28" rx="3" style="stroke-width:1.5"/><text x="68" y="79" text-anchor="middle">B</text><line class="ln2" x1="130" y1="40" x2="130" y2="60"/><rect class="f1 s1" x="114" y="60" width="32" height="28" rx="3" style="stroke-width:1.5"/><text x="130" y="79" text-anchor="middle">C</text><line class="ln2" x1="168" y1="40" x2="168" y2="60"/><rect class="f3 s3" x="152" y="60" width="32" height="28" rx="3" style="stroke-width:1.5"/><text x="168" y="79" text-anchor="middle">14</text><line class="ln" x1="230" y1="40" x2="410" y2="40"/><line class="ln2" x1="320" y1="8" x2="320" y2="40"/><polygon class="ink" points="314,40 326,40 320,34"/><text x="260" y="30" text-anchor="middle">16 kg</text><text x="380" y="30" text-anchor="middle">16 kg</text><line class="ln2" x1="250" y1="40" x2="250" y2="60"/><rect class="f1 s1" x="234" y="60" width="32" height="28" rx="3" style="stroke-width:1.5"/><text x="250" y="79" text-anchor="middle">A</text><line class="ln2" x1="288" y1="40" x2="288" y2="60"/><rect class="f1 s1" x="272" y="60" width="32" height="28" rx="3" style="stroke-width:1.5"/><text x="288" y="79" text-anchor="middle">C</text><line class="ln2" x1="350" y1="40" x2="350" y2="60"/><rect class="f1 s1" x="334" y="60" width="32" height="28" rx="3" style="stroke-width:1.5"/><text x="350" y="79" text-anchor="middle">B</text><line class="ln2" x1="388" y1="40" x2="388" y2="60"/><rect class="f3 s3" x="372" y="60" width="32" height="28" rx="3" style="stroke-width:1.5"/><text x="388" y="79" text-anchor="middle">4</text>
::
> A = 9 kg, B = 12 kg, C = 7 kg
!! Stang 1: $C + 14 = 21$, så $C = 7$, og $A + B = 21$. Stang 2: $A + C = 16$, så $A = 9$ og $B = 12$. Kontroll: $B + 4 = 16$.

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
Oppgaven i boka er et bilde som ikke kan gjengis her. Her er en oppgave i samme ånd:

*Tre søsken er til sammen 45 år. Den eldste er dobbelt så gammel som den yngste, og den mellomste er 3 år eldre enn den yngste. Hvor gamle er de? Hvor mange år går det før summen av alderen deres er 60?*
>> Yngste $x$: $x + (x + 3) + 2x = 45$ gir $x = 10{,}5$ – ikke et helt tall! Hvis den mellomste er 5 år eldre, får vi $4x + 5 = 45$ og $x = 10$: 10, 15 og 20 år. Summen øker med 3 hvert år, så det tar $\frac{60 - 45}{3} = 5$ år.

## 2.308 @2.3
En klasse på 20 elever får numrene 1–20 og skal deles i 6 grupper. Gruppene trenger ikke være like store, men summen av numrene skal være lik i alle gruppene. Hvilke numre kan være på samme gruppe? Er det flere løsninger?
>> Summen av 1–20 er 210, så hver gruppe må ha summen $210 : 6 = 35$. Én løsning: $\{20, 15\}$, $\{19, 16\}$, $\{18, 17\}$, $\{14, 13, 8\}$, $\{12, 11, 10, 2\}$ og $\{9, 7, 6, 5, 4, 3, 1\}$. Det finnes mange andre løsninger, for eksempel kan de to siste byttes ut med $\{12, 11, 9, 3\}$ og $\{10, 7, 6, 5, 4, 2, 1\}$.
