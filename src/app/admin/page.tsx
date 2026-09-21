import Link from "next/link";
import { crmClient, type Appointment, euro } from "@/lib/crm";
import { CrmError } from "@/components/CrmError";
export default async function Page() {
  const db = await crmClient();
  const [
    { data, error },
    { count: tradeIns },
    { count: listings },
    { count: legacyWash },
    { count: legacyWorkshop },
    { count: inquiries },
  ] = await Promise.all([
    db.from("appointments").select("*"),
    db
      .from("trade_ins")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    db
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    db
      .from("car_wash_bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    db
      .from("workshop_bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    db
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
  ]);
  if (error) return <CrmError />;
  const rows = data as unknown as Appointment[];
  const dateKey = (date: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Amsterdam",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  const today = dateKey(new Date().toISOString()),
    month = today.slice(0, 7);
  const completed = rows.filter(
    (a) =>
      a.status === "completed" &&
      a.scheduled_at &&
      dateKey(a.scheduled_at).startsWith(month),
  );
  const cards = [
    [
      "Vandaag gepland",
      rows.filter(
        (a) =>
          a.scheduled_at &&
          dateKey(a.scheduled_at) === today &&
          ["confirmed", "in_progress"].includes(a.status),
      ).length,
      "/admin/appointments",
    ],
    [
      "Nieuwe aanvragen",
      rows.filter((a) => a.status === "new").length,
      "/admin/appointments",
    ],
    [
      "In behandeling",
      rows.filter((a) => a.status === "in_progress").length,
      "/admin/work-orders",
    ],
    ["Nieuwe inkoop", tradeIns ?? "—", "/admin/trade-ins"],
    ["Actieve occasions", listings ?? "—", "/admin/listings"],
    [
      "Oude boekingen · nieuw",
      (legacyWash ?? 0) + (legacyWorkshop ?? 0),
      "/admin/bookings",
    ],
    ["Nieuwe interesses", inquiries ?? "—", "/admin/inquiries"],
  ];
  return (
    <div>
      <div className="eyebrow">Bumperbank beheer</div>
      <h1 className="text-3xl mt-3 mb-8">Vandaag & deze maand</h1>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map(([label, value, href]) => (
          <Link
            key={label}
            href={String(href)}
            className="panel hover:border-orange"
          >
            <span className="text-4xl text-orange">{value}</span>
            <h2 className="text-base mt-4">{label}</h2>
          </Link>
        ))}
      </div>
      <div className="panel mt-8">
        <h2 className="text-xl">Afgeronde opdrachten deze maand</h2>
        <p className="mt-4">
          {completed.length} opdrachten ·{" "}
          {euro(
            completed.reduce((sum, a) => sum + (a.final_price_cents ?? 0), 0),
          )}{" "}
          aan vastgelegde eindprijzen
        </p>
        <p className="text-muted mt-3">
          Op basis van de geplande afspraakdatum. Dit is geen factuur- of
          betaaladministratie.{" "}
          {completed.filter((a) => a.final_price_cents === null).length}{" "}
          opdrachten zonder eindprijs.
        </p>
      </div>
    </div>
  );
}
