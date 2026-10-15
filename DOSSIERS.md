# Klanten, aanvragen en werkdossiers

Voer migraties 011_work_dossier_numbers.sql en 012_customer_job_structure.sql uit voordat je deze versie uitrolt. De lokale 011 is aangepast voor nieuwe installaties. Als de eerdere 011 al is uitgevoerd, corrigeert 012 de toekenning voor nieuwe aanvragen; al toegekende nummers blijven behouden en worden niet hergebruikt.

Een aanvraag via het autoserviceformulier maakt een voorlopige klantenfiche, voertuig en aanvraag aan. Een voorkeursdatum of de status nieuw/contact opgenomen geeft geen dossiernummer. Een echte starttijd plus bevestigd/in uitvoering/afgerond geeft één uniek dossiernummer. Verplaatsen, annuleren en opnieuw openen van dezelfde opdracht behouden het nummer. Een nieuwe klus krijgt een nieuwe aanvraag en na inplanning een nieuw nummer.

Werkdossiers zoeken toont alleen genummerde opdrachten. De agenda en klantenfiche tonen ook aanvragen zonder nummer. Kentekenzoeken negeert streepjes en spaties en toont alle bijbehorende dossiers.

Via de klantenfiche kan de beheerder een terugkerende klant opzoeken en na expliciete controle samenvoegen met diens bestaande fiche. De bestaande contactgegevens worden niet overschreven. De oorspronkelijke contactgegevens zijn als snapshot bewaard per aanvraag. Alle opdrachten en voertuigen worden in één transactie gekoppeld. Hetzelfde genormaliseerde kenteken onder de gekozen klant hergebruikt het bestaande voertuig. De bronfiche blijft gearchiveerd; links verwijzen door naar de behouden fiche. Publieke formulieren koppelen nooit zomaar aan bestaande klanten op basis van een onbevestigd e-mailadres of kenteken.

De algemene contact-/interesseformulieren zijn nog niet met deze klantenfiche gekoppeld. Ook kassafuncties, de checklist per werkfase en dossierfacturen plus factuuroverzicht per klant moeten nog worden gebouwd. Bestaande webshopfacturen blijven ongewijzigd.

Controleer na migratie: nieuwe aanvraag zonder nummer; bevestigen met starttijd geeft nummer; wijzigingen behouden nummer; tweede klus met hetzelfde kenteken geeft ander nummer; na gecontroleerde klantkoppeling staan beide klussen onder één fiche. Controleer ook klanten met meerdere voertuigen.

## Beheeracties

Voer ook 013_admin_archive.sql uit. Aanvragen, werkdossiers, interesses, oude boekingen, inkoopaanvragen en webshopbestellingen kunnen via Gegevens aanpassen worden bewerkt en via Verwijderen uit overzicht worden gearchiveerd. Het archief biedt herstel en paginering. Opdrachten blijven met archiefmarkering zichtbaar in de klantenhistorie. Archiveren annuleert niets. Een late betaalbevestiging maakt een gearchiveerde bestelling weer actief. Mailverzendregistraties en Moneybird-exportregistraties blijven intact, zodat archiveren geen dubbele verzending of factuur veroorzaakt. Verstuurde e-mails, Mollie-betalingen en Moneybird-facturen worden niet verwijderd of gewijzigd.

Shopbestellingen: alleen interne notitie en track & trace zijn hier bewerkbaar. Voor financiële correcties gebruik je de provider/creditfactuur; betaalstatus en bedragen zijn niet handmatig overschrijfbaar.
