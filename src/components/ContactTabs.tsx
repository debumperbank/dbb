import { EXAMPLE_MODE } from "@/lib/public-offering";
import Link from "next/link";
import { ContactForm } from "./ContactForm";
export function ContactTabs({product = ""}: {product?: string}) {
  return (
    <div className="max-w-3xl">
      {!EXAMPLE_MODE && <div className="panel mb-8">
        <h2 className="text-xl">Detailing voor jouw auto?</h2>
        <p className="text-muted mt-3 mb-5">
          Vraag een behandeling aan. We bespreken jouw wensen en de planning;
          de locatie stemmen we samen af.
        </p>
        <Link href="/afspraak" className="btn btn-primary">
          Afspraak aanvragen →
        </Link>
      </div>}
      <h2 className="text-xl mb-5">Algemene vraag</h2>
      <ContactForm product={EXAMPLE_MODE ? "" : product} />
    </div>
  );
}
