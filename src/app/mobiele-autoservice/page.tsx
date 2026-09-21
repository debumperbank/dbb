import Link from "next/link";
export const metadata = {
  title: "Mobiele autoservice in regio Hulst",
  description:
    "Geen rit naar de garage voor ieder klusje. Vertel ons wat er met je auto aan de hand is en waar hij staat. We beoordelen vooraf of het werk op die plek uitvoerbaar is.",
};
export default function Page() {
  return (
    <main className="px-6 py-20">
      <div className="max-w-site mx-auto">
        <div className="eyebrow">Mobiele autoservice in regio Hulst</div>
        <h1 className="text-4xl md:text-6xl max-w-3xl mt-5">
          Onderhoud en reparatie op jouw locatie.
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl mt-7">
          Geen rit naar de garage voor ieder klusje. Vertel ons wat er met je
          auto aan de hand is en waar hij staat. We beoordelen vooraf of het
          werk op die plek uitvoerbaar is.
        </p>
        <div className="grid md:grid-cols-3 gap-5 my-12">
          <div className="panel text-xl">Onderhoud en controles</div>
          <div className="panel text-xl">Diagnose bij storingen</div>
          <div className="panel text-xl">
            Remmen, banden en reparaties in overleg
          </div>
        </div>
        <p className="text-muted max-w-2xl mb-7">
          Vermeld bij je aanvraag of er een vlakke, veilige werkplek beschikbaar
          is. We stemmen werkzaamheden, bereikbaarheid en planning met je af.
        </p>
        <Link href="/afspraak" className="btn btn-primary">
          Afspraak aanvragen →
        </Link>
      </div>
    </main>
  );
}
