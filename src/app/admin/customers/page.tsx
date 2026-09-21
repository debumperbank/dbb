import Link from "next/link";
import { crmClient, type Customer } from "@/lib/crm";
import { CrmError } from "@/components/CrmError";
export default async function Page() {
  const db = await crmClient();
  const { data, error } = await db
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return <CrmError />;
  return (
    <div>
      <h1 className="text-3xl mb-8">Klanten</h1>
      <p className="text-muted mb-6">
        Iedere aanvraag heeft een eigen klantdossier. Ingestuurde gegevens
        worden niet automatisch samengevoegd.
      </p>
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
