import Link from "next/link";
import { crmClient } from "@/lib/crm";
import { moneybirdConfig, moneybirdRequest, MoneybirdError } from "@/lib/moneybird";

export default async function Page() {
  const db = await crmClient(); // Owner account and MFA before any provider access.
  const checks: {name: string; detail: string; ok: boolean}[] = [];
  const results = await Promise.all([
    db.from("moneybird_exports").select("order_id,payment_attempted").limit(0),
    db.from("shop_order_emails").select("order_id,kind,state").limit(0),
  ]);
  checks.push({name: "Opslag voor facturen en mails", ok: results.every(r => !r.error), detail: results.every(r => !r.error) ? "Beschikbaar" : "Databasemigratie controleren"});
  try {
    const nl = moneybirdConfig("NL"), be = moneybirdConfig("BE");
    type RecordInfo = {id: string; active?: boolean; percentage?: string; tax_rate_type?: string};
    const [taxes, ledger, workflow, styles] = await Promise.all([
      moneybirdRequest<RecordInfo[]>("tax_rates.json?per_page=100&filter=tax_rate_type:sales_invoice,active:true"),
      moneybirdRequest<RecordInfo>(`ledger_accounts/${nl.ledger}.json`),
      moneybirdRequest<RecordInfo>(`workflows/${nl.workflow}.json`),
      moneybirdRequest<RecordInfo[]>("document_styles.json"),
    ]);
    const selectedTaxes = [nl.tax, be.tax].map(id => taxes?.find(t => String(t.id) === id));
    const checksForMoneybird = [
      {name: "Moneybird-btw-codes", ok: selectedTaxes.every(t => t && t.active && t.tax_rate_type === "sales_invoice" && Number(t.percentage) === 21)},
      {name: "Moneybird-omzetrekening", ok: String(ledger?.id) === nl.ledger},
      {name: "Moneybird-factuurworkflow", ok: String(workflow?.id) === nl.workflow && workflow?.active === true},
      {name: "Moneybird-factuurhuisstijl", ok: Boolean(styles?.some(s => String(s.id) === nl.documentStyle))},
    ];
    checks.push(...checksForMoneybird.map(c => ({...c, detail: c.ok ? "Gevonden en bereikbaar via de productiesleutel" : "Instelling ontbreekt of wijkt af van de gekozen inrichting"})));

  } catch (error) {
    checks.push({name: "Moneybird-verbinding en factuurinstellingen", ok: false, detail: error instanceof MoneybirdError ? `Controle nodig (${error.code})` : "Controle niet beschikbaar"});
  }
  const mailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_FROM_EMAIL && process.env.SHOP_CUSTOMER_INFORMATION?.trim());
  checks.push({name: "Klantmails", ok: mailConfigured && process.env.CUSTOMER_EMAILS_ENABLED === "true", detail: mailConfigured ? (process.env.CUSTOMER_EMAILS_ENABLED === "true" ? "Ingeschakeld; ontvangst nog controleren met een echte bestelling" : "Nog niet ingeschakeld") : "Afzender, sleutel of aankoopinformatie ontbreekt"});
  try {
    const response = await fetch("https://api.resend.com/domains", {headers: {Authorization: `Bearer ${process.env.RESEND_API_KEY}`}, cache: "no-store", signal: AbortSignal.timeout(10000), redirect: "error"});
    const body = response.ok ? await response.json() : null;
    const domain = body?.data?.find((d: {name: string}) => d.name === "debumperbank.nl");
    const ok = domain?.status === "verified";
    checks.push({name: "Resend-afzenderdomein", ok, detail: ok ? "debumperbank.nl is geverifieerd via de productiesleutel" : response.status === 401 || response.status === 403 ? "Domeinstatus niet leesbaar met deze sleutel; controleer de bevoegdheden in Resend" : "Verificatie niet bevestigd"});
  } catch { checks.push({name: "Resend-afzenderdomein", ok: false, detail: "Providercontrole tijdelijk niet beschikbaar"}); }
  const live = process.env.MOLLIE_API_KEY?.startsWith("live_");
  checks.push({name: "Mollie-modus", ok: Boolean(live), detail: live ? "Live-sleutel ingesteld; betaling zelf niet getest" : "Testsleutel of geen sleutel: geen echte klantfacturen"});
  checks.push({name: "Automatische facturatie", ok: process.env.MONEYBIRD_ENABLED === "true", detail: process.env.MONEYBIRD_ENABLED === "true" ? "Ingeschakeld voor betaalde live-orders" : "Nog niet ingeschakeld"});
  return <div><div className="eyebrow">Beheer</div><h1 className="text-3xl mt-3 mb-6">Mail- en factuurkoppelingen</h1>
    <p className="text-muted mb-6">Deze controle leest alleen instellingen. Er wordt geen betaling, factuur of e-mail aangemaakt. Een geslaagde verbinding bewijst nog geen aflevering bij de klant of verwerking van een Mollie-uitbetaling.</p>
    <div className="space-y-4">{checks.map(c => <article className="panel" key={c.name}><h2 className="text-xl">{c.name}</h2><p className="mt-2">{c.ok ? "✓" : "Controle nodig:"} {c.detail}</p></article>)}</div>
    <Link href="/admin/orders" className="btn btn-ghost mt-6">Naar bestellingen</Link></div>;
}
