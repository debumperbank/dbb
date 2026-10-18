import { OurStory } from "@/components/OurStory";
export const metadata = { title: "Ons verhaal | De Bumperbank", description: "Maak kennis met het gezin achter De Bumperbank. Over autopassie, een eigen garage als droom en de keuze voor meer vrijheid en tijd samen." };
export default function Page() {
  return <main><h1 className="sr-only">Het gezin achter De Bumperbank</h1><OurStory full /></main>;
}
