import { crmClient, type TradeIn, euro } from "@/lib/crm";
import { TradeInEditor } from "@/components/TradeInEditor";
import { RequestPhotos } from "@/components/RequestPhotos";
import { CrmError } from "@/components/CrmError";
export default async function Page() {
  const db = await crmClient();
  const { data, error } = await db
    .from("trade_ins")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return <CrmError />;
  return (
    <div>
      <h1 className="text-3xl mb-8">Inkoopaanvragen</h1>
      {!data?.length && (
        <p className="text-muted">Nog geen auto’s aangeboden.</p>
      )}
      <div className="space-y-6">
        {(data as unknown as TradeIn[]).map((t) => (
          <article key={t.id} className="panel">
            <h2 className="text-2xl">
              {t.registration} · {t.mileage_km.toLocaleString("nl-NL")} km
            </h2>
            <p className="my-4">
              {t.name} · <a href={`tel:${t.phone}`}>{t.phone}</a> ·{" "}
              <a href={`mailto:${t.email}`}>{t.email}</a>
            </p>
            <dl className="grid gap-3 mb-5">
              {[
                ["Staat", t.condition],
                ["Onderhoud", t.maintenance],
                ["Schade / gebreken", t.damage],
                ["Vraagprijs", euro(t.asking_price_cents)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-muted text-sm">{label}</dt>
                  <dd className="whitespace-pre-wrap">{value}</dd>
                </div>
              ))}
            </dl>
            <RequestPhotos id={t.id} kind="trade_in" />
            <TradeInEditor id={t.id} status={t.status} notes={t.notes} />
          </article>
        ))}
      </div>
    </div>
  );
}
