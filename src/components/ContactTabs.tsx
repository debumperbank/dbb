import Link from "next/link";
import { ContactForm } from "./ContactForm";
export function ContactTabs() {
  return (
    <div className="max-w-3xl">
      <div className="panel mb-8">
        <h2 className="text-xl">Onderhoud, reparatie of detailing nodig?</h2>
        <p className="text-muted mt-3 mb-5">
          Gebruik het afspraakformulier om je voertuig, locatie en voorkeur door
          te geven.
        </p>
        <Link href="/afspraak" className="btn btn-primary">
          Afspraak aanvragen →
        </Link>
      </div>
      <h2 className="text-xl mb-5">Algemene vraag</h2>
      <ContactForm />
    </div>
  );
}
