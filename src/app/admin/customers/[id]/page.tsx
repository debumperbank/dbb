import Link from "next/link";
import { notFound } from "next/navigation";
import { crmClient, type Customer, type Appointment } from "@/lib/crm";
import { statuses } from "@/lib/services";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await crmClient();
  const [
    { data: customer, error },
    { data: appointments, error: appointmentsError },
  ] = await Promise.all([
    db.from("customers").select("*").eq("id", id).maybeSingle(),
    db
      .from("appointments")
      .select("*,vehicles(*)")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (error || appointmentsError)
    throw new Error("Klantdossier laden is mislukt.");
  if (!customer) notFound();
  const c = customer as unknown as Customer;
  return (
    <div>
      <h1 className="text-3xl mb-5">{c.name}</h1>
      <p>
        <a href={`mailto:${c.email}`}>{c.email}</a> ·{" "}
        <a href={`tel:${c.phone}`}>{c.phone}</a>
      </p>
      <h2 className="text-xl mt-10 mb-5">Voertuigen & werkzaamheden</h2>
      {(appointments as unknown as Appointment[]).map((a) => (
        <Link
          key={a.id}
          href={`/admin/appointments/${a.id}`}
          className="panel block mb-4"
        >
          {a.vehicles.registration} · {a.vehicles.make_model}
          <p className="mt-3 text-muted">
            {a.requested_date} · {statuses[a.status as keyof typeof statuses]}
          </p>
          <p className="mt-3">{a.description}</p>
        </Link>
      ))}
    </div>
  );
}
