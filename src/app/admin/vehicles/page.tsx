import Link from "next/link";
import { crmClient, type Vehicle } from "@/lib/crm";
import { CrmError } from "@/components/CrmError";
export default async function Page() {
  const db = await crmClient();
  const { data, error } = await db
    .from("vehicles")
    .select("*,customers(*)")
    .order("created_at", { ascending: false });
  if (error) return <CrmError />;
  return (
    <div>
      <h1 className="text-3xl mb-8">Voertuigen</h1>
      {!data?.length && <p>Nog geen voertuigen.</p>}
      <div className="space-y-3">
        {(data as unknown as Vehicle[]).map((v) => (
          <Link
            href={`/admin/customers/${v.customer_id}`}
            key={v.id}
            className="panel block"
          >
            <h2 className="text-xl">
              {v.registration} · {v.make_model}
            </h2>
            <p className="mt-3 text-muted">
              {v.customers.name} ·{" "}
              {v.mileage_km === null
                ? "Kilometerstand onbekend"
                : `${v.mileage_km.toLocaleString("nl-NL")} km`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
