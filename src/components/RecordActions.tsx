"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {archiveRecord} from "@/app/admin/records/actions";
import type {RecordKind} from "@/lib/admin-records";
export function RecordActions({kind,id,archived=false}:{kind:RecordKind;id:string;archived?:boolean}) {
 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");const router=useRouter();
 async function change() {
  if(!window.confirm(archived?"Dit onderdeel terugzetten in het actieve overzicht?":"Uit het actieve overzicht verwijderen en bewaren in het archief? Dit annuleert geen afspraak, betaling of factuur en verwijdert geen verstuurde e-mail."))return;
  setBusy(true);setMessage("");
  try {const result=await archiveRecord(kind,id,!archived);if(result.error)setMessage(result.error);else {setMessage(archived?"Teruggezet.":"Verplaatst naar het archief.");router.refresh();}}
  catch {setMessage("Wijzigen is mislukt.");}finally{setBusy(false);}
 }
 return <div className="mt-4"><div className="flex flex-wrap gap-3"><Link className="btn btn-ghost" href={`/admin/records/${kind}/${id}`}>Gegevens aanpassen</Link><button type="button" disabled={busy} onClick={change} className="btn btn-ghost disabled:opacity-50">{busy?"Bezig…":archived?"Terugzetten":"Verwijderen uit overzicht"}</button></div><p role="status" className="text-sm mt-2">{message}</p></div>;
}
