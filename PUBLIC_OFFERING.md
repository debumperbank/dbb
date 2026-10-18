# Publiek aanbod — 18 oktober 2026

De huidige versie richt zich op detailing en webshop. Detailing is op afspraak, locatie in overleg; een aanvraag is pas definitief na persoonlijke bevestiging. Er wordt geen vaste werkplek of openingsdatum beloofd.

Mobiele mechaniek, onderhoud/reparaties, voertuigdiagnose en in-/verkoop van auto’s zijn verborgen in navigatie, homepage en sitemap. Directe publieke links krijgen een tijdelijke redirect en noindex. Nieuwe mechaniek- en inkoopaanvragen worden op de server geweigerd; ook de oude werkplaats- en mobiele car wash-endpoints zijn gepauzeerd ten gunste van het huidige detailingformulier. Data, bestaande dossiers, beheer, servicepagina’s en betaalafhandeling blijven bewaard.

De schakelaars staan in src/lib/public-offering.ts. Een wijziging van mobileWorkshop naar true heractiveert de bewaarde mechaniekpagina’s, navigatielinks, servicekaarten, keuzes in het afspraakformulier en bijbehorende serverroutes. vehicleTrading heractiveert op dezelfde manier de autohandel. Dit zijn code-instellingen, geen automatische planning: bewust aanpassen en opnieuw publiceren wanneer de activiteit weer kan worden aangeboden. De historische generieke validator is behouden voor dossiers en toekomstig gebruik. De aanvullende leverancierscatalogus en bestaande pauze op rechtstreeks online betalen blijven behouden. Er is geen leveranciersvoorraadfeed aangesloten.

De oorspronkelijke webshop-first back-uptak blijft ongewijzigd; er is niets naar GitHub of Vercel gepusht.

Het persoonlijke verhaal gebruikt uitsluitend de door de eigenaar gedeelde informatie: kinderen en gezin, meer vrijheid en reizen, een eigen auto en de reeds aanwezige E36 als basis voor de toekomstige Black Hornet. Het aangeleverde beeld wordt als toekomstvisualisatie beschreven; er worden geen kindernamen, leeftijden of verzonnen gezinsportretten gepubliceerd.
