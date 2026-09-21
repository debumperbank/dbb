import Link from "next/link";
import { crmClient, type Appointment } from "@/lib/crm";
import { CrmError } from "@/components/CrmError";
import { statuses } from "@/lib/services";
export default async function Page() {
  const db = await crmClient();
  const { data, error } = await db
    .from("appointments")
    .select("*,customers(*),vehicles(*)")
    .in("status", ["confirmed", "in_progress", "completed"])
    .order("scheduled_at", { ascending: false });
  if (error) return <CrmError />;
  return (
    <div>
      <h1 className="text-3xl mb-8">Werkorders</h1>
      <p className="text-muted mb-6">
        Bevestigde afspraken krijgen hier hun werkorder: werkzaamheden, interne
        notities en prijzen.
      </p>
      {!data?.length && <p>Nog geen bevestigde afspraken.</p>}
      {(data as unknown as Appointment[]).map((a) => (
        <Link
          href={`/admin/appointments/${a.id}`}
          key={a.id}
          className="panel block mb-3"
        >
          <h2 className="text-xl">
            {a.vehicles.registration} · {a.customers.name}
          </h2>
          <p className="text-orange mt-3">
            {statuses[a.status as keyof typeof statuses]}
          </p>
          <p className="mt-3">{a.description}</p>
        </Link>
      ))}
    </div>
  );
}
