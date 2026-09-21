import Link from "next/link";
export const metadata = {
  title: "Auto detailing in regio Hulst",
  description:
    "Van een frisse binnenkant tot verzorging van de lak: vertel ons wat je wilt laten aanpakken. We stemmen de behandeling af op de staat van je auto.",
};
export default function Page() {
  return (
    <main className="px-6 py-20">
      <div className="max-w-site mx-auto">
        <div className="eyebrow">Auto detailing in regio Hulst</div>
        <h1 className="text-4xl md:text-6xl max-w-3xl mt-5">
          Aandacht tot in de details.
        </h1>
        <p className="text-muted text-lg leading-relaxed max-w-2xl mt-7">
          Van een frisse binnenkant tot verzorging van de lak: vertel ons wat je
          wilt laten aanpakken. We stemmen de behandeling af op de staat van je
          auto.
        </p>
        <div className="grid md:grid-cols-3 gap-5 my-12">
          <div className="panel text-xl">Interieur- en exterieurreiniging</div>
          <div className="panel text-xl">
            Polijsten en lakverzorging in overleg
          </div>
          <div className="panel text-xl">
            Bescherming en BUMPR-verzorgingsproducten
          </div>
        </div>
        <p className="text-muted max-w-2xl mb-7">
          Voor werk op locatie bespreken we vooraf de ruimte en de benodigde
          voorzieningen. Voeg foto’s toe voor een beter beeld van je auto.
        </p>
        <Link href="/afspraak" className="btn btn-primary">
          Afspraak aanvragen →
        </Link>
      </div>
    </main>
  );
}
