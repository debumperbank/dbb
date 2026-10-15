"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createJob} from "@/app/admin/intake-actions";
import {services} from "@/lib/services";
export function NewJobForm({customerId,vehicles}:{customerId:string;vehicles:{id:string;registration:string;make_model:string}[]}) {
 const router=useRouter();const [vehicle,setVehicle]=useState(vehicles[0]?.id||""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 return <form className="panel space-y-4 max-w-2xl" onSubmit={async e=>{e.preventDefault();const form=new FormData(e.currentTarget);setBusy(true);setMessage("");try{const result=await createJob(customerId,form);if(result.error)setMessage(result.error);else{router.push(`/admin/appointments/${result.id}`);router.refresh();}}catch{setMessage("Opslaan mislukt. Controleer je verbinding.");}finally{setBusy(false);}}}>
 <h2 className="text-xl">Nieuwe klus voor deze klant</h2><p className="text-muted">Je maakt eerst een aanvraag. Vul daarna de starttijd in en bevestig de afspraak om een eigen dossiernummer te krijgen.</p>
 <label className="block">Voertuig<select name="vehicle_id" className="field" value={vehicle} onChange={e=>setVehicle(e.target.value)}>{vehicles.map(v=><option key={v.id} value={v.id}>{v.registration} · {v.make_model}</option>)}<option value="">Nieuw voertuig</option></select></label>
 {!vehicle&&<><label className="block">Kenteken / nummerplaat<input name="registration" className="field" required maxLength={30} autoCapitalize="characters"/></label><label className="block">Merk en model<input name="make_model" className="field" required maxLength={200}/></label></>}
 <label className="block">Werkzaamheden<select name="service" className="field">{Object.entries(services).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
 <label className="block">Omschrijving<textarea name="description" className="field" required maxLength={20000} rows={4}/></label>
 <button className="btn btn-primary" disabled={busy}>{busy?"Opslaan…":"Aanvraag aanmaken"}</button><p role="status">{message}</p>
 </form>;
}
