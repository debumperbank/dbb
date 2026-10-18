import { PUBLIC_OFFERING } from "@/lib/public-offering";
import { RequestForm } from "@/components/RequestForm";
export const metadata = { title: PUBLIC_OFFERING.mobileWorkshop ? "Afspraak aanvragen | De Bumperbank" : "Detailing op afspraak | De Bumperbank", description: "Vraag een detailingbehandeling aan. Op afspraak, locatie in overleg. We bevestigen de behandeling en planning persoonlijk." };
export default function Page() {
  return (
    <main className="px-5 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="eyebrow">De Bumperbank · Regio Hulst</div>
        <h1 className="text-4xl md:text-5xl mt-4">
          {PUBLIC_OFFERING.mobileWorkshop ? "Vertel ons wat je auto nodig heeft." : "Vraag jouw detailingbehandeling aan."}
        </h1>
        <p className="text-muted mt-6 mb-10 leading-relaxed">
          {PUBLIC_OFFERING.mobileWorkshop ? "Vraag onderhoud, reparatie of detailing aan. We bespreken de werkzaamheden, locatie en planning voordat we de afspraak bevestigen." : "Detailing op afspraak, locatie in overleg. Vertel ons wat je wilt laten verzorgen. We bespreken de behandeling, locatie en planning voordat we de afspraak bevestigen."}
        </p>
        <RequestForm kind="appointment" />
      </div>
    </main>
  );
}
