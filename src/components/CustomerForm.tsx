"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {saveCustomer} from "@/app/admin/intake-actions";
export function CustomerForm({customer}:{customer?:{id:string;name:string;email:string;phone:string}}) {
 const router=useRouter();const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 return <form className="panel space-y-4 max-w-2xl" onSubmit={async e=>{e.preventDefault();const form=new FormData(e.currentTarget);setBusy(true);setMessage("");try{const result=await saveCustomer(customer?.id||null,form);if(result.error)setMessage(result.error);else{setMessage("Klant opgeslagen.");router.push(`/admin/customers/${result.id}`);router.refresh();}}catch{setMessage("Opslaan mislukt. Controleer je verbinding en probeer opnieuw.");}finally{setBusy(false);}}}>
 <h2 className="text-xl">{customer?"Klantgegevens aanpassen":"Nieuwe klant"}</h2>
 <p className="text-muted text-sm">Naam en minimaal één contactmogelijkheid. Bij een bestaande klant worden alle gekoppelde opdrachten bijgewerkt naar deze contactgegevens. De oorspronkelijke aanvraaggegevens blijven bewaard.</p>
 <label className="block">Naam<input className="field" name="name" autoComplete="name" required maxLength={200} defaultValue={customer?.name}/></label>
 <label className="block">E-mail<input className="field" name="email" type="email" autoComplete="email" maxLength={254} defaultValue={customer?.email}/></label>
 <label className="block">Telefoon<input className="field" name="phone" type="tel" autoComplete="tel" maxLength={40} defaultValue={customer?.phone}/></label>
 <button className="btn btn-primary" disabled={busy}>{busy?"Opslaan…":"Klant opslaan"}</button><p role="status">{message}</p>
 </form>;
}
