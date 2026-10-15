import Link from "next/link";
import {crmClient} from "@/lib/crm";
import {recordKinds,isRecordKind} from "@/lib/admin-records";
import {RecordActions} from "@/components/RecordActions";
export default async function Page({searchParams}:{searchParams:Promise<{kind?:string;page?:string}>}) {
 const db=await crmClient();const params=await searchParams;
 const kind=isRecordKind(params.kind||"")?params.kind as keyof typeof recordKinds:"appointments";
 const page=Math.min(1000000,Math.max(1,parseInt(params.page||"1",10)||1));
 const {data,error,count}=await db.from(kind).select("*",{count:"exact"}).not("archived_at","is",null).order("archived_at",{ascending:false}).order("id").range((page-1)*30,page*30-1);
 return <div><h1 className="text-3xl mb-4">Archief</h1><p className="text-muted mb-5">Verwijderde items uit je actieve overzicht. Terugzetten is altijd mogelijk; betalingen en facturen blijven behouden.</p>
 <nav className="flex flex-wrap gap-3 mb-6">{Object.entries(recordKinds).map(([key,v])=><Link key={key} className="underline py-2" href={`/admin/archive?kind=${key}`} aria-current={key===kind?"page":undefined}>{v.label}</Link>)}</nav>
 <h2 className="text-xl mb-4">{recordKinds[kind].label}</h2>
 {error?<p role="alert">Archief laden mislukt. Controleer migratie 013 en de verbinding.</p>:!data?.length?<p>Geen gearchiveerde items op deze pagina.</p>:data.map(row=><article key={String(row.id)} className="panel mb-4"><h3>{String(row.dossier_number || row.name || (row.customer as {name?:string}|null)?.name || "Aanvraag")}</h3><p className="text-muted break-all">{String(row.id)}</p><RecordActions kind={kind} id={String(row.id)} archived/></article>)}
 <nav className="flex gap-6 mt-6">{page>1&&<Link href={`/admin/archive?kind=${kind}&page=${page-1}`}>Vorige</Link>}{page*30<(count||0)&&<Link href={`/admin/archive?kind=${kind}&page=${page+1}`}>Volgende</Link>}</nav></div>;
}
