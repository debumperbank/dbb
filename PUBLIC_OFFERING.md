# Website als presentatie — 20 oktober 2026

De Bumperbank staat voorlopig in opbouw. De landingpage vermeldt expliciet dat producten bestellen, betalen en afspraken maken niet mogelijk is. Publieke teksten, navigatie, footer en metadata presenteren de plannen zonder boekings- of verkoopaanbod. Er staat geen persoonlijke of medische reden op de website.

`EXAMPLE_MODE = true` in `src/lib/public-offering.ts` verbergt de productcatalogus, BUMPR en afspraakpagina met alle onderliggende winkel- en boekingsroutes. Rechtstreekse links krijgen een tijdelijke redirect en noindex. De sitemap bevat deze routes niet. Nieuwe afspraakaanvragen, ook via een oud formulier, krijgen HTTP 503 vóór gegevensopslag, foto-upload of e-mail. De bestaande serverblokkade voor checkout (`SHOP_OPEN = false`) blijft actief. Mechaniek en autohandel blijven gepauzeerd.

De catalogus, prijzen, formulieren, gegevens, beheermogelijkheden en historische dossiers blijven bewaard. Bestaande bestelstatussen met toegangstoken en betaalwebhooks blijven beschikbaar voor de correcte verwerking van bestaande transacties; er is geen mogelijkheid om nieuwe betalingen te starten. De statuspagina toont tijdens de pauze geen bedrag of uitnodiging om opnieuw af te rekenen.

Opnieuw starten gebeurt alleen na een nieuwe keuze van de eigenaar en publicatie via Git/GitHub/Vercel. Zet dan bewust de gewenste instellingen en bijbehorende teksten terug. Het uitschakelen van EXAMPLE_MODE maakt het bewaarde aanbod weer zichtbaar, maar opent de checkout niet: SHOP_OPEN blijft een afzonderlijke instelling. Er is geen automatische herstart.

Validatie: 178 tests geslaagd; productiebuild inclusief lint- en typecontrole geslaagd. De lokale productiepreview is gecontroleerd op de melding, prijzen en links, afgeschermde routes en de 503-blokkade voor afrekenen en afspraakaanvragen.
