import { EXAMPLE_MODE } from "@/lib/public-offering";
import Link from "next/link";
export const metadata = {
  title: "Auto detailing in regio Hulst",
  description:
    EXAMPLE_MODE ? "Een indruk van onze plannen voor auto detailing. De website is in opbouw; afspraken maken is nog niet mogelijk." : "Van een frisse binnenkant tot verzorging van de lak: vertel ons wat je wilt laten aanpakken. We stemmen de behandeling af op de staat van je auto.",
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
          {EXAMPLE_MODE ? "We laten je graag kennismaken met onze plannen voor auto detailing. Hieronder zie je welke richting we voor ogen hebben. Dit is voorlopig een presentatie; je kunt nog geen behandeling aanvragen." : "Van een frisse binnenkant tot verzorging van de lak: vertel ons wat je wilt laten aanpakken. We stemmen de behandeling af op de staat van je auto."}
        </p>
        <div className="grid md:grid-cols-3 gap-5 my-12">
          <div className="panel text-xl">Interieur- en exterieurreiniging</div>
          <div className="panel text-xl">
            Polijsten en lakverzorging in overleg
          </div>
          <div className="panel text-xl">
            Lakbescherming in overleg
          </div>
        </div>
        <p className="text-muted max-w-2xl mb-7">
          {EXAMPLE_MODE ? "De Bumperbank is in opbouw. Afspraken maken is momenteel niet mogelijk." : "Detailing op afspraak, locatie in overleg. We spreken vooraf af welke behandeling bij je auto past, waar die kan plaatsvinden en wat de kosten zijn. Foto’s helpen ons om je aanvraag te beoordelen."}
        </p>
        {!EXAMPLE_MODE && <Link href="/afspraak" className="btn btn-primary">
          Afspraak aanvragen →
        </Link>}
      </div>
    </main>
  );
}
