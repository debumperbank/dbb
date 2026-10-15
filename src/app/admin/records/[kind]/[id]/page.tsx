import Link from "next/link";
import {notFound} from "next/navigation";
import {crmClient} from "@/lib/crm";
import {recordKinds,isRecordKind,validRecordId} from "@/lib/admin-records";
import {RecordEditor} from "@/components/RecordEditor";
import {RecordActions} from "@/components/RecordActions";
export default async function Page({params}:{params:Promise<{kind:string;id:string}>}) {
 const db=await crmClient();const {kind,id}=await params;
 if(!isRecordKind(kind)||!validRecordId(id))notFound();
 const {data,error}=await db.from(kind).select("*").eq("id",id).maybeSingle();
 if(error)throw new Error("Gegevens konden niet worden geladen.");if(!data)notFound();
 const values=Object.fromEntries(Object.keys(recordKinds[kind].fields).map(key=>[key,String(data[key]||"")]));
 return <div className="max-w-3xl"><h1 className="text-3xl mb-4">{recordKinds[kind].label} aanpassen</h1>
 <p className="text-muted mb-6">{data.archived_at?"Dit onderdeel staat in het archief.":"Dit onderdeel staat in het actieve overzicht."}</p>
 {kind==="shop_orders" && <p className="mb-6">Betaalstatus, bedragen en facturen worden door Mollie en Moneybird bepaald en zijn hier niet handmatig te wijzigen. Je kunt de verzendreferentie en een interne notitie aanpassen. Dit verstuurt geen nieuwe mail.</p>}
 {kind==="appointments" && <Link className="underline block mb-6" href={`/admin/appointments/${id}`}>Planning, status en prijzen aanpassen</Link>}
 <RecordEditor kind={kind} id={id} values={values}/><RecordActions kind={kind} id={id} archived={Boolean(data.archived_at)}/>
 <Link href="/admin/archive" className="underline block mt-6">Naar het archief</Link></div>;
}
