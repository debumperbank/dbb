import { RequestForm } from "@/components/RequestForm";
export const metadata = { title: "Auto verkopen" };
export default function Page() {
  return (
    <main className="px-5 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="eyebrow">De Bumperbank · Regio Hulst</div>
        <h1 className="text-4xl md:text-5xl mt-4">
          Je auto verkopen? Begin hier.
        </h1>
        <p className="text-muted mt-6 mb-10 leading-relaxed">
          Vertel ons over je auto, ook als hij schade of gebreken heeft. We
          bekijken je aanvraag en nemen persoonlijk contact op.
        </p>
        <RequestForm kind="trade_in" />
      </div>
    </main>
  );
}
