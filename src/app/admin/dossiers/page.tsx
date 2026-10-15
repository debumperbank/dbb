import Link from "next/link";
import { crmClient, type Appointment } from "@/lib/crm";
import { statuses } from "@/lib/services";
import { normalizeRegistration, normalizeDossierNumber } from "@/lib/dossiers";

export default async function Page({ searchParams }: {
  searchParams: Promise<{ plate?: string; number?: string; page?: string }>;
}) {
  const db = await crmClient();
  const params = await searchParams;
  const plate = typeof params.plate === "string" ? params.plate.slice(0, 40) : "";
  const number = typeof params.number === "string" ? params.number.slice(0, 40) : "";
  const normalizedPlate = normalizeRegistration(plate);
  const normalizedNumber = normalizeDossierNumber(number);
  const invalid = (plate.trim() && !normalizedPlate) || (number.trim() && !normalizedNumber);
  const page = Math.min(1000000, Math.max(1, Number.parseInt(params.page || "1", 10) || 1));
  const pageSize = 30;
  let query = db.from("appointments")
    .select("*,customers(*),vehicles!inner(*)", { count: "exact" })
    .not("dossier_number", "is", null).is("archived_at", null)
    .order("created_at", { ascending: false }).order("id")
    .range((page - 1) * pageSize, page * pageSize - 1);
  if (normalizedPlate) query = query.like("vehicles.registration_search", `%${normalizedPlate}%`);
  if (normalizedNumber) query = query.eq("dossier_number", normalizedNumber);
  const result = invalid ? { data: [], count: 0, error: null } : await query;
  const rows = (result.data || []) as unknown as Appointment[];
  function pageUrl(next: number) {
    return `/admin/dossiers?${new URLSearchParams({ plate, number, page: String(next) })}`;
  }
  return <div className="max-w-5xl">
    <h1 className="text-3xl mb-4">Werkdossiers</h1>
    <p className="text-muted mb-6">Een ingeplande klus krijgt een eigen vast dossiernummer. Nieuwe aanvragen staan in de agenda. Zoek op kenteken (nummerplaat), ook zonder spaties of streepjes. Alle statussen worden meegenomen.</p>
    <Link href="/admin/customers" className="btn btn-ghost mb-5">Nieuwe klus via klantenfiche</Link>
    <form action="/admin/dossiers" method="get" className="panel grid gap-4 sm:grid-cols-2 mb-6">
      <label className="block">Kenteken / nummerplaat
        <input name="plate" defaultValue={plate} maxLength={40} placeholder="Bijvoorbeeld AB-123-C" className="mt-2 w-full min-h-12 rounded border border-neutral-600 bg-bg px-3 py-3" />
      </label>
      <label className="block">Dossiernummer
        <input name="number" defaultValue={number} maxLength={40} placeholder="Bijvoorbeeld DBB-000001 of 1" className="mt-2 w-full min-h-12 rounded border border-neutral-600 bg-bg px-3 py-3" />
      </label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button className="rounded bg-yellow-400 text-black font-semibold px-6 py-3" type="submit">Zoeken</button>
        <Link href="/admin/dossiers" className="underline py-3">Alles tonen</Link>
      </div>
    </form>
    {invalid ? <p role="alert">Vul een geldig kenteken of dossiernummer in.</p> : result.error ?
      <p role="alert">Dossiers kunnen niet worden geladen. Controleer de databaseverbinding en of migratie 011 en 012 is uitgevoerd.</p> : <>
      <p className="text-muted mb-4">{result.count ?? 0} dossier(s) gevonden</p>
      {!rows.length && <p>Geen dossiers op deze pagina. Pas je zoekopdracht aan of toon alle dossiers.</p>}
      {rows.map(a => <Link key={a.id} href={`/admin/appointments/${a.id}`} className="panel block mb-3 hover:border-orange">
        <p className="font-mono text-orange">{a.dossier_number}</p>
        <h2 className="text-xl mt-2">{a.vehicles.registration} · {a.vehicles.make_model}</h2>
        <p className="mt-2">{a.customers.name} · {statuses[a.status as keyof typeof statuses]}</p>
        <p className="text-muted mt-2 break-words">{a.description}</p>
      </Link>)}
      <nav aria-label="Dossierpagina’s" className="flex gap-6 mt-6">
        {page > 1 && <Link href={pageUrl(page - 1)} className="underline py-3">Vorige</Link>}
        {page * pageSize < (result.count || 0) && <Link href={pageUrl(page + 1)} className="underline py-3">Volgende</Link>}
      </nav>
    </>}
  </div>;
}
