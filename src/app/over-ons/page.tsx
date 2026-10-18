import { OurStory } from "@/components/OurStory";
export const metadata = { title: "Ons verhaal | De Bumperbank", description: "De mensen achter De Bumperbank: autopassie, onze kinderen en de wens voor meer vrijheid, reizen en tijd samen. Ontdek ons verhaal en het toekomstplan Black Hornet." };
export default function Page() {
  return (
    <main>
      <h1 className="sr-only">Over ons</h1>
      <OurStory full />
    </main>
  );
}
