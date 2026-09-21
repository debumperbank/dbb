import { RequestForm } from "@/components/RequestForm";
export const metadata = { title: "Afspraak aanvragen" };
export default function Page() {
  return (
    <main className="px-5 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="eyebrow">De Bumperbank · Regio Hulst</div>
        <h1 className="text-4xl md:text-5xl mt-4">
          Vertel ons wat je auto nodig heeft.
        </h1>
        <p className="text-muted mt-6 mb-10 leading-relaxed">
          Vraag onderhoud, reparatie of detailing aan. Wij nemen contact op om
          het werk, de locatie en de planning af te stemmen.
        </p>
        <RequestForm kind="appointment" />
      </div>
    </main>
  );
}
