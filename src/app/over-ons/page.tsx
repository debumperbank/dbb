import { OurStory } from "@/components/OurStory";
export const metadata = { title: "Over De Bumperbank" };
export default function Page() {
  return (
    <main>
      <h1 className="sr-only">Over ons</h1>
      <OurStory />
    </main>
  );
}
