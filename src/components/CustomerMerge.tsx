"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { findCustomers,mergeCustomer } from "@/app/admin/customers/actions";
import type { Customer } from "@/lib/crm";
export function CustomerMerge({sourceId,sourceName}:{sourceId:string;sourceName:string}) {
 const router=useRouter();
 const [term,setTerm]=useState("");const [rows,setRows]=useState<Customer[]>([]);
 const [target,setTarget]=useState("");const [confirmed,setConfirmed]=useState(false);
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 async function search(e:React.FormEvent) {
  e.preventDefault();setBusy(true);setTarget("");setConfirmed(false);
  try {const result=await findCustomers(term);setRows(result.customers.filter(c=>c.id!==sourceId));setMessage(result.error || (result.customers.filter(c=>c.id!==sourceId).length ? "Kies de bestaande klantenfiche die je wilt behouden." : "Geen andere klant gevonden. Zoek op naam, e-mail of telefoon."));}
  catch {setMessage("Zoeken is mislukt.");}finally{setBusy(false);}
 }
 async function merge() {
  setBusy(true);
  try {const result=await mergeCustomer(sourceId,target,confirmed);if(result.error)setMessage(result.error);else {router.push(`/admin/customers/${target}`);router.refresh();}}
  catch {setMessage("Koppelen is mislukt.");}finally{setBusy(false);}
 }
 return <details className="panel mt-6"><summary className="cursor-pointer py-2">Terugkerende klant? Koppelen aan bestaande fiche</summary>
  <p className="my-4 text-muted">Controleer of dit dezelfde klant is. Alle aanvragen, dossiers en voertuigen van {sourceName} worden gekoppeld aan de gekozen fiche. De bestaande contactgegevens blijven behouden. De oorspronkelijke aanvraaggegevens blijven opgeslagen.</p>
  <form onSubmit={search} className="flex flex-col sm:flex-row gap-3"><label className="flex-1">Zoek bestaande klant<input className="field" value={term} onChange={e=>setTerm(e.target.value)} minLength={2} maxLength={100} required placeholder="Naam, e-mail of telefoon" /></label><button className="btn btn-primary" disabled={busy}>Zoeken</button></form>
  <div className="space-y-3 mt-4">{rows.map(c=><label key={c.id} className="block border border-neutral-600 p-3 rounded break-words"><input type="radio" name="existing-customer" value={c.id} checked={target===c.id} onChange={()=>{setTarget(c.id);setConfirmed(false);}} /> {c.name} · {c.email} · {c.phone}</label>)}</div>
  {target && <><label className="block my-4"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} /> Ik heb gecontroleerd dat beide fiches dezelfde klant zijn en wil alle aanvragen en voertuigen samenvoegen.</label><button type="button" className="btn btn-primary" disabled={busy || !confirmed} onClick={merge}>Koppelen aan bestaande klant</button></>}
  <p role="status" className="mt-4">{message}</p>
 </details>;
}
