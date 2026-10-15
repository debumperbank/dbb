import Link from "next/link";
import { crmClient, type Customer } from "@/lib/crm";
import { CrmError } from "@/components/CrmError";
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const params=await searchParams;const q=String(params.q||"").slice(0,100).replace(/[%_\\]/g,"").trim();
  const db = await crmClient();
  let query = db
    .from("customers")
    .select("*")
    .is("merged_into", null)
    .order("created_at", { ascending: false });
  if(q) query=query.ilike("name",`%${q}%`);
  const {data,error}=await query.limit(100);
  if (error) return <CrmError />;
  return (
    <div>
      <h1 className="text-3xl mb-8">Klanten</h1>
      <p className="text-muted mb-6">
        Een klantenfiche verzamelt voertuigen, aanvragen en werkdossiers.
        Koppel een terugkerende klant na controle aan de bestaande fiche.
      </p>
      <Link className="btn btn-primary mb-5" href="/admin/customers/new">Klant toevoegen</Link>
      <form className="flex flex-wrap gap-3 mb-6"><label className="flex-1">Zoeken op klantnaam<input className="field" name="q" defaultValue={q} maxLength={100}/></label><button className="btn btn-ghost">Zoeken</button></form><p className="text-muted text-sm mb-4">Maximaal 100 klanten. Gebruik de zoekfunctie om gericht te zoeken.</p>
      <div className="space-y-3">
        {!data?.length && <p>Nog geen klanten.</p>}
        {(data as unknown as Customer[]).map((c) => (
          <Link
            href={`/admin/customers/${c.id}`}
            key={c.id}
            className="panel block"
          >
            <h2 className="text-xl">{c.name}</h2>
            <p className="text-muted mt-2">
              {c.email} · {c.phone}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
