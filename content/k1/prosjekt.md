## Mordgåten

Du er kriminaletterforsker. Et lik er funnet i en kjeller, og du må anslå drapstidspunktet. Til det bruker du **Newtons avkjølingslov**.

### Fra varmt til kaldt

Varme går alltid fra et sted med høy temperatur til et sted med lavere temperatur. Hvor fort noe avkjøles, avhenger av overflaten, materialet og – viktigst for oss – **temperaturforskjellen** mellom gjenstanden og omgivelsene.

::def Newtons avkjølingslov
Hvor fort temperaturen til en gjenstand synker, er proporsjonal med temperaturforskjellen mellom gjenstanden og omgivelsene. Temperaturen etter tida $t$ er
$$T(t) = \Delta T\cdot k^t + T_0$$
der $\Delta T$ er temperaturforskjellen ved start, $k$ er avkjølingsfaktoren og $T_0$ er temperaturen i omgivelsene.
::

Legg merke til at det er **forskjellen** $T(t) - T_0$ som avtar eksponentielt. Temperaturen selv nærmer seg romtemperaturen $T_0$, men går aldri under den.

::plot x=0,120 y=0,100 xs=10 ys=10 h=260 xl=\text{min} yl=°\text{C}
f: 78*0.97^x+22 | label=T(t)=78\cdot0{,}97^t+22 | at=60
hy: 22 | dash
::

### Oppgave 1 – kokende vann

a) Tegn et koordinatsystem med tid langs førsteaksen og temperatur langs andreaksen. Skisser hvordan du tror temperaturen utvikler seg når et beger med kokende vann settes til avkjøling.

b) Kok vann, sett det til avkjøling og mål temperaturen hvert minutt. Før målingene inn i en tabell.

c) Finn en funksjon på formen $T(x) = a\cdot k^x + c$ som passer med målingene. Tips: sett $c$ lik romtemperaturen, trekk $c$ fra alle målingene og gjør eksponentiell regresjon på differansene. Stemmer modellen med Newtons avkjølingslov?

d) Hvordan ville funksjonen sett ut om vannet ble avkjølt i et kjøleskap?

::widget regresjon data="0,78;2,73.4;4,69.1;6,65;8,61.1;10,57.5;15,49.6;20,42.7" modell=eksponentiell xl="minutter" yl="T − 22 (°C)" title="Eksempel: differansen mellom vanntemperaturen og romtemperaturen (22 °C)"

### Oppgave 2 – løs mordgåten

Liket ble funnet i en kjeller der temperaturen er 15 °C. Et levende menneske har ca. 37 °C.

- Kl. 17:00 ble kroppstemperaturen målt til 29 °C.
- Kl. 18:00 var den sunket til 25 °C.

Politiet har fire mistenkte (personene er oppdiktet):

| Mistenkt | Alibi |
|---|---|
| Gartneren | på jobb sammen med kolleger fra 14:00 til 17:00 |
| Nabokona | i butikken fra 15:15 til 16:15 (kvittering og videoovervåking) |
| Kokken | på restaurant med tre vitner fra 13:00 til 15:00, deretter alene hjemme |
| Nevøen | på trening fra 15:00 til 17:30 |

Anslå drapstidspunktet, og avslør morderen.

::losning Løsningsforslag
Temperaturforskjellen til kjelleren var $29 - 15 = 14$ grader kl. 17 og $25 - 15 = 10$ grader kl. 18. På én time ble forskjellen ganget med
$$k = \frac{10}{14} \approx 0{,}714$$
Ved dødsfallet var forskjellen $37 - 15 = 22$ grader. La $t$ være antall timer *før* kl. 17. Da er
$$22\cdot\left(\frac{10}{14}\right)^{t} = 14$$
Denne likningen løser vi i CAS (eller grafisk), og får $t \approx 1{,}34$ timer $\approx 1$ t 20 min.

Drapet skjedde altså omtrent **kl. 15:40**. Gartneren, nabokona og nevøen har alibi for dette tidspunktet. **Kokken** var alene hjemme etter kl. 15:00 og er den eneste uten alibi.

Modellen er en forenkling: klær, kroppsstørrelse og luftfuktighet påvirker $k$, så drapstidspunktet er et anslag med usikkerhet.
::
