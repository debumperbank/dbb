import Link from "next/link";
const services = [
  {
    title: "Onderhoud & reparatie",
    href: "/mobiele-autoservice",
    desc: "Van onderhoud en diagnose tot remmen en reparaties. We bespreken wat veilig op jouw locatie kan.",
    tag: "De garage komt naar je toe",
  },
  {
    title: "Detailing",
    href: "/detailing",
    desc: "Een frisse binnenkant en aandacht voor je lak. Van reiniging tot polijsten en bescherming.",
    tag: "Aandacht tot in de details",
  },
  {
    title: "Occasions",
    href: "/occasions",
    desc: "Bekijk onze actuele voorraad of bied je eigen auto aan. Persoonlijk contact bij iedere stap.",
    tag: "Een volgende stap voor je auto",
  },
];
export function StripBar() {
  return (
    <div className="border-y border-white/10 bg-bg-soft px-5 md:px-8 py-5">
      <div className="max-w-site mx-auto flex flex-wrap justify-between gap-x-8 gap-y-3 text-[10px] sm:text-xs font-mono tracking-widest text-muted">
        {[
          "MOBIELE AUTOSERVICE",
          "ONDERHOUD & REPARATIE",
          "DETAILING",
          "OCCASIONS",
        ].map((s) => (
          <span key={s} className="flex items-center gap-3">
            <span className="w-1 h-1 bg-orange" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
export function ServiceGrid() {
  return (
    <section id="diensten" className="px-5 md:px-8 py-16 md:py-24 scroll-mt-36">
      <div className="max-w-site mx-auto">
        <div className="eyebrow">Waar kunnen we je mee helpen?</div>
        <h2 className="text-3xl md:text-5xl mt-4 mb-9 max-w-2xl">
          Eén aanspreekpunt.
          <br />
          <span className="text-muted">Alles voor je auto.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <Link
              href={s.href}
              key={s.href}
              className="group panel flex flex-col hover:border-orange/70 transition-colors !p-7"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-orange">0{i + 1}</span>
                <span className="text-orange text-2xl group-hover:translate-x-1 transition-transform">
                  ↗
                </span>
              </div>
              <h3 className="text-2xl mt-10">{s.title}</h3>
              <p className="text-muted mt-4 leading-relaxed">{s.desc}</p>
              <p className="text-xs font-mono mt-auto pt-8 text-orange">
                {s.tag}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
