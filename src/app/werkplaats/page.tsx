import Link from "next/link";
export const metadata = {
  title: "Onderhoud & reparatie",
  description:
    "Een storing, slijtage of onderhoudsvraag? Beschrijf de klachten en voeg waar mogelijk foto’s toe. We bespreken wat er nodig is en welke locatie daarvoor geschikt is.",
};
export default function Page() {
  return (
    <main className="px-6 py-20">
      <div className="max-w-site mx-auto">
        <div className="eyebrow">Onderhoud & reparatie</div>
        <h1 className="text-4xl md:text-6xl max-w-3xl mt-5">
          Het juiste werk, op de juiste plek.
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl mt-7">
          Een storing, slijtage of onderhoudsvraag? Beschrijf de klachten en
          voeg waar mogelijk foto’s toe. We bespreken wat er nodig is en welke
          locatie daarvoor geschikt is.
        </p>
        <div className="grid md:grid-cols-3 gap-5 my-12">
          <div className="panel text-xl">
            Onderhoud op basis van je voertuig
          </div>
          <div className="panel text-xl">
            Onderzoek van klachten en storingen
          </div>
          <div className="panel text-xl">
            Overleg over werk dat niet mobiel kan
          </div>
        </div>
        <p className="text-muted max-w-2xl mb-7">
          Een aanvraag is nog geen bevestigde afspraak. Je krijgt eerst
          persoonlijk bericht over de mogelijkheden en de planning.
        </p>
        <Link href="/afspraak" className="btn btn-primary">
          Afspraak aanvragen →
        </Link>
      </div>
    </main>
  );
}
