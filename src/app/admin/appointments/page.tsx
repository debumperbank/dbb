import Link from "next/link";
import { crmClient, type Appointment, displayDate } from "@/lib/crm";
import { statuses, services } from "@/lib/services";
import { CrmError } from "@/components/CrmError";
export default async function Page() {
  const db = await crmClient();
  const { data, error } = await db
    .from("appointments")
    .select("*,customers(*),vehicles(*)")
    .order("requested_date");
  if (error) return <CrmError />;
  const appointments = data as unknown as Appointment[];
  const pending = appointments.filter((a) =>
    ["new", "contacted"].includes(a.status),
  );
  const planned = appointments
    .filter((a) => ["confirmed", "in_progress"].includes(a.status))
    .sort((a, b) => (a.scheduled_at || "").localeCompare(b.scheduled_at || ""));
  const closed = appointments.filter((a) =>
    ["completed", "cancelled"].includes(a.status),
  );
  return (
    <div>
      <div className="eyebrow">Planning · tijden in Nederland</div>
      <h1 className="text-3xl mt-3 mb-8">Agenda & aanvragen</h1>
      {[
        ["Nog te bevestigen", pending],
        ["Geplande afspraken", planned],
        ["Afgerond & geannuleerd", closed],
      ].map(([title, rows]) => (
        <section key={String(title)} className="mb-10">
          <h2 className="text-xl mb-4">{String(title)}</h2>
          <div className="space-y-3">
            {(rows as Appointment[]).length === 0 && (
              <p className="text-muted">Geen afspraken in dit overzicht.</p>
            )}
            {(rows as Appointment[]).map((a) => (
              <Link
                href={`/admin/appointments/${a.id}`}
                key={a.id}
                className="panel block hover:border-orange"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <strong>
                    {a.vehicles.registration} · {a.vehicles.make_model}
                  </strong>
                  <span className="text-orange">
                    {statuses[a.status as keyof typeof statuses]}
                  </span>
                </div>
                <p className="mt-3">
                  {services[a.service as keyof typeof services]} ·{" "}
                  {a.customers.name}
                </p>
                <p className="text-muted mt-2">
                  {a.scheduled_at
                    ? displayDate(a.scheduled_at)
                    : `Voorkeur: ${a.requested_date}`}{" "}
                  · {a.service_address || "Locatie overleggen"}
                </p>
                {a.scheduled_at && (
                  <p className="text-muted text-sm mt-2">
                    {a.duration_minutes} min werk + {a.travel_minutes} min
                    reistijd vooraf
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
