import Link from "next/link";
const services = [
  {
    title: "Onderhoud & reparatie",
    href: "/mobiele-autoservice",
    desc: "Van onderhoud en diagnose tot remmen en reparaties. We bespreken wat veilig op jouw locatie kan.",
  },
  {
    title: "Detailing",
    href: "/detailing",
    desc: "Aandacht voor binnen- en buitenkant. Bespreek reiniging, polijsten en bescherming voor jouw auto.",
  },
  {
    title: "Occasions",
    href: "/occasions",
    desc: "Bekijk de actuele voorraad of bied je eigen auto aan. Persoonlijk contact bij iedere aankoop.",
  },
];
export function StripBar() {
  return (
    <div className="border-y border-white/10 px-6 py-6">
      <p className="max-w-site mx-auto font-mono text-xs tracking-widest text-muted">
        MOBIELE AUTOSERVICE · ONDERHOUD & REPARATIE · DETAILING · OCCASIONS
      </p>
    </div>
  );
}
export function ServiceGrid() {
  return (
    <section id="diensten" className="px-6 py-20 bg-paper text-ink">
      <div className="max-w-site mx-auto">
        <div className="eyebrow">Waar kunnen we je mee helpen?</div>
        <h2 className="text-4xl mt-4 mb-10">Eén aanspreekpunt voor je auto.</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Link
              href={s.href}
              key={s.href}
              className="border border-black/15 p-7 hover:border-orange"
            >
              <span className="font-mono text-orange-deep">0{i + 1}</span>
              <h3 className="text-2xl mt-6">{s.title}</h3>
              <p className="text-muted-dark mt-4 leading-relaxed">{s.desc}</p>
              <span className="inline-block mt-7 text-orange-deep">
                Bekijk de mogelijkheden →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
