import {crmClient} from "@/lib/crm";
import {WorkshopPhoto} from "@/components/WorkshopPhoto";
import type {PhotoRecord} from "@/lib/workshop";
export async function WorkshopPhotos({id,phase,archived=false}:{id:string;phase?:string;archived?:boolean}){
 const db=await crmClient();let query=db.from("request_photos").select("id,appointment_id,stage,storage_path,caption,rotation,marks,revision,archived_at").eq("appointment_id",id).order("created_at",{ascending:false});
 if(phase)query=query.eq("stage",phase);query=archived?query.not("archived_at","is",null):query.is("archived_at",null);
 const {data,error}=await query;if(error)return <p role="alert">Foto’s laden mislukt. Controleer de verbinding en migratie 015.</p>;
 const photos=await Promise.all((data||[]).map(async p=>{const {data:signed}=await db.storage.from("request-photos").createSignedUrl(String(p.storage_path),600);return {...p,url:signed?.signedUrl} as unknown as PhotoRecord;}));
 return photos.length?<div className="grid gap-5 md:grid-cols-2">{photos.map(p=><WorkshopPhoto key={`${p.id}-${p.revision}`} photo={p}/>)}</div>:<p className="panel">Geen {archived?"verwijderde ":""}foto’s gevonden.</p>;
}
