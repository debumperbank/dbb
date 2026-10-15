"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {editRecord} from "@/app/admin/records/actions";
import {recordKinds,type RecordKind} from "@/lib/admin-records";
export function RecordEditor({kind,id,values}:{kind:RecordKind;id:string;values:Record<string,string>}) {
 const router=useRouter();const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function save(e:React.FormEvent<HTMLFormElement>) {
  e.preventDefault();const form=new FormData(e.currentTarget);setBusy(true);
  try {const result=await editRecord(kind,id,form);setMessage(result.error||"Opgeslagen. Eerder verstuurde berichten zijn niet gewijzigd.");if(!result.error)router.refresh();}
  catch {setMessage("Opslaan is mislukt.");}finally{setBusy(false);}
 }
 return <form onSubmit={save} className="panel space-y-5">{Object.entries(recordKinds[kind].fields).map(([key,label])=><label className="block" key={key}>{label}<textarea name={key} className="field" rows={["name","email","phone","registration","tracking_reference"].includes(key)?1:4} defaultValue={values[key]||""} /></label>)}<button className="btn btn-primary" disabled={busy}>{busy?"Opslaan…":"Wijzigingen opslaan"}</button><p role="status">{message}</p></form>;
}
