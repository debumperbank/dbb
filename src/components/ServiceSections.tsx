import Link from "next/link";

const services = [
  { title: "Mobiele autoservice", href: "/mobiele-autoservice", desc: "Onderhoud & reparaties op locatie", icon: "wrench" },
  { title: "Werkplaats", href: "/werkplaats", desc: "Kleine en grotere herstellingen", icon: "gear" },
  { title: "Detailing", href: "/detailing", desc: "Interieur & exterieur in topconditie", icon: "sparkle" },
  { title: "BUMPR", href: "/bumpr", desc: "Professionele verzorgingsproducten", icon: "bottle" },
  { title: "Occasions", href: "/occasions", desc: "Betrouwbare auto's met zekerheid", icon: "car" },
  { title: "Auto verkopen", href: "/auto-verkopen", desc: "Snel en gemakkelijk je auto verkopen", icon: "tag" },
];

function ServiceIcon({ icon }: { icon: string }) {
  const cls = "h-7 w-7";
  if (icon === "wrench") {
    return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.5 6.5a4.5 4.5 0 0 0-6 5.8L3 17.8 6.2 21l5.5-5.5a4.5 4.5 0 0 0 5.8-6l-2.7 2.7-3-3 2.7-2.7Z" /></svg>;
  }
  if (icon === "gear") {
    return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2M12 19.2v2M21.2 12h-2M4.8 12h-2M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4M18.5 18.5l-1.4-1.4M6.9 6.9 5.5 5.5"/><circle cx="12" cy="12" r="7.2"/></svg>;
  }
  if (icon === "sparkle") {
    return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m12 2 1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2ZM19 14l.8 2.4L22 17l-2.2.7L19 20l-.8-2.3L16 17l2.2-.6L19 14ZM5 13l.7 2.1L8 16l-2.3.7L5 19l-.7-2.3L2 16l2.3-.9L5 13Z"/></svg>;
  }
  if (icon === "bottle") {
    return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 3h6v3l2 2.2V21H7V8.2L9 6V3Z"/><path d="M9 11h6M10 3h4"/></svg>;
  }
  if (icon === "car") {
    return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 15 1.8-5.3A2.5 2.5 0 0 1 9.2 8h5.6a2.5 2.5 0 0 1 2.4 1.7L19 15"/><path d="M4 15h16v4H4v-4ZM6 19v2M18 19v2"/><circle cx="7.5" cy="16.8" r=".8" fill="currentColor"/><circle cx="16.5" cy="16.8" r=".8" fill="currentColor"/></svg>;
  }
  return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h9l7 7-8 8-8-8V5Z"/><circle cx="9" cy="10" r="1.2"/></svg>;
}

export function ServiceGrid() {
  return (
    <section id="diensten" className="service-rail relative z-20 scroll-mt-32 px-4 pb-5 md:px-8 lg:-mt-[86px] lg:pb-7">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-3 flex items-center justify-between gap-5 px-1 lg:px-0">
          <div className="eyebrow"><span className="dot" /> Alles voor je auto</div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-paper/35 md:block">Kies een dienst →</span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => (
            <Link
              href={service.href}
              key={service.href}
              className="service-tile group relative min-h-[178px] overflow-hidden rounded-[8px] border border-orange/25 bg-[#0d0f11]/95 p-5 shadow-[0_18px_55px_rgba(0,0,0,.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-orange/75 hover:bg-[#131519]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/65 to-transparent opacity-70" />
              <div className="absolute -right-10 -top-10 h-28 w-28 rotate-45 border border-orange/10" />
              <div className="text-orange"><ServiceIcon icon={service.icon} /></div>
              <h3 className="mt-6 text-[15px] font-semibold uppercase tracking-[-0.02em]">{service.title}</h3>
              <p className="mt-2 max-w-[22ch] text-[12px] leading-relaxed text-muted">{service.desc}</p>
              <span className="absolute bottom-4 right-4 text-lg text-orange transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StripBar() {
  return (
    <div className="brand-strip border-y border-white/10 bg-[#08090a] px-5 py-4 md:px-8">
      <div className="mx-auto flex max-w-[1480px] flex-wrap justify-center gap-x-10 gap-y-3 text-[9.5px] font-mono uppercase tracking-[0.23em] text-muted sm:justify-between sm:text-[10px]">
        {["Kwaliteit", "Betrouwbaarheid", "Persoonlijke service", "Regio Hulst"].map((s) => (
          <span key={s} className="flex items-center gap-3">
            <span className="h-1 w-1 rotate-45 bg-orange" />
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
