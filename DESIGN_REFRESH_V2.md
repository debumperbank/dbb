# De Bumperbank — homepage refresh v2

Deze versie bouwt verder op de bestaande Next.js-site en behoudt de bestaande formulieren, Supabase-koppelingen, webshoplogica en andere pagina's.

## Aangepast

- Nieuw compact lijnlogo in de header (`public/logo-header.png`), afgeleid van het nieuwe Porsche-front ontwerp.
- Hero dichter bij het gekozen mockup-concept: zwart/geel, servicewagen, honeycomb/racing details en sterkere CTA's.
- Diensten als compacte cards die op desktop visueel over de hero schuiven.
- Navigatie verfijnd en mobiel menu behouden.
- Occasions, BUMPR, Over ons en footer visueel in dezelfde merkstijl gebracht.
- Homepagebreedte op 1480px afgestemd voor een ruimere desktoplook.
- Bestaande backend- en aanvraagfunctionaliteit niet gewijzigd.

## Starten

```bash
npm install
npm run dev
```

## Controle

De bestaande Node-test-suite is uitgevoerd: 64/64 tests geslaagd.
Een volledige Next.js-build kon in de bewerkingsomgeving niet worden uitgevoerd omdat de dependencies daar niet lokaal beschikbaar waren.
