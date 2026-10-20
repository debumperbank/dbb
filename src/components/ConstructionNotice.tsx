import { EXAMPLE_MODE } from "@/lib/public-offering";
export function ConstructionNotice() {
  if (!EXAMPLE_MODE) return null;
  return <aside aria-label="Website in opbouw" className="border-b border-orange/30 bg-orange/10 px-5 py-5 text-center">
    <p className="font-semibold text-orange">Onze website is nog in opbouw.</p>
    <p className="mx-auto mt-2 max-w-3xl text-sm leading-6 text-paper/85">Je bekijkt voorlopig een presentatie van onze plannen. Producten bestellen, betalen en afspraken maken is momenteel niet mogelijk.</p>
  </aside>;
}
