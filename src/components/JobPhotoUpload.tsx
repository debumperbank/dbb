"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {workPhases,type WorkPhase} from "@/lib/work-phases";
import {prepareJobPhoto} from "@/lib/prepare-job-photo";
export function JobPhotoUpload({id,stage}:{id:string;stage:WorkPhase}) {
 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");const router=useRouter();
 async function upload(input:HTMLInputElement) {
  const files=Array.from(input.files||[]);if(!files.length)return;
  if(files.length>10){setMessage("Kies maximaal 10 foto’s tegelijk.");input.value="";return;}
  setBusy(true);let count=0;const failed:string[]=[];
  try {for(const file of files){setMessage(`Foto ${count+failed.length+1} van ${files.length} verwerken…`);try {
   const photo=await prepareJobPhoto(file);const form=new FormData();form.set("appointment_id",id);form.set("stage",stage);form.set("photo",photo);
   const response=await fetch("/api/job-photos",{method:"POST",body:form});const result=await response.json();if(!response.ok)throw Error(result.error||"Upload mislukt.");count++;
  }catch(e){failed.push(`${file.name}: ${e instanceof Error?e.message:"Upload mislukt"}`);}}
  setMessage(`${count} foto(’s) opgeslagen.${failed.length?" Niet opgeslagen: "+failed.join("; "):""}`);if(count)router.refresh();
  }finally {setBusy(false);input.value="";}
 }
 return <div className="border-t border-neutral-700 pt-4 mt-5"><h3 className="font-semibold">Foto’s toevoegen · {workPhases[stage].label}</h3><p className="text-sm text-muted mt-2">Foto’s worden verkleind voor vlot uploaden. Maximaal 10 tegelijk. Uploads vereisen internet.</p><div className="grid sm:grid-cols-2 gap-3 mt-3"><label className="block">Camera<input aria-label={`Camera ${workPhases[stage].label}`} className="field w-full" type="file" accept="image/*" capture="environment" disabled={busy} onChange={e=>void upload(e.currentTarget)}/></label><label className="block">Fotobibliotheek<input aria-label={`Fotobibliotheek ${workPhases[stage].label}`} className="field w-full" type="file" accept="image/*" multiple disabled={busy} onChange={e=>void upload(e.currentTarget)}/></label></div><p role="status" className="text-sm mt-3 break-words">{message}</p></div>;
}
