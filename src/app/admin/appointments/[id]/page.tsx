import { JobPhotoUpload } from "@/components/JobPhotoUpload";
import { notFound } from "next/navigation";
import { crmClient, type Appointment } from "@/lib/crm";
import { AppointmentEditor } from "@/components/AppointmentEditor";
import { RequestPhotos } from "@/components/RequestPhotos";
import { services } from "@/lib/services";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await crmClient();
  const { data, error } = await db
    .from("appointments")
    .select("*,customers(*),vehicles(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Afspraak laden is mislukt.");
  if (!data) notFound();
  const a = data as unknown as Appointment;
  return (
    <div className="max-w-5xl">
      <div className="eyebrow">Afspraak & werkorder</div>
      <h1 className="text-3xl mt-3 mb-8">
        {a.vehicles.registration} · {a.vehicles.make_model}
      </h1>
      <div className="panel mb-6">
        <h2 className="text-xl">{a.customers.name}</h2>
        <p className="mt-3">
          <a href={`tel:${a.customers.phone}`}>{a.customers.phone}</a> ·{" "}
          <a href={`mailto:${a.customers.email}`}>{a.customers.email}</a>
        </p>
        <p className="mt-4">
          {services[a.service as keyof typeof services]} · Voorkeur{" "}
          {a.requested_date} (
          {
            { morning: "ochtend", afternoon: "middag", flexible: "flexibel" }[
              a.requested_time
            ]
          }
          )
        </p>
        <p className="text-muted mt-3">
          {a.location_type === "mobile" ? "Op locatie: " : "Eerst overleggen: "}
          {a.service_address || "Nog afstemmen"}
        </p>
        <p className="whitespace-pre-wrap mt-5">{a.description}</p>
        <div className="mt-6">
          <RequestPhotos id={id} kind="appointment" />
        </div>
      </div>
      <AppointmentEditor appointment={a} />
      <JobPhotoUpload id={id} />
    </div>
  );
}
