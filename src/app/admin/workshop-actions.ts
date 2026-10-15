"use server";
import {crmContext} from "@/lib/crm";
import {isWorkPhase} from "@/lib/work-phases";
import {validRecordId} from "@/lib/admin-records";
import {photoChanges,settingsValues,correctionValues} from "@/lib/workshop";
import {revalidatePath} from "next/cache";
function refresh(){revalidatePath("/admin","layout");}
export async function clockTime(job:string,phase:string,action:"start"|"stop",entry:string) {
 const {db,userId}=await crmContext();if(!validRecordId(entry)||!validRecordId(job)||!isWorkPhase(phase)||!["start","stop"].includes(action))return {error:"Ongeldige timer."};
 const {data,error}=await db.rpc("clock_work",{p_worker:userId,p_job:job,p_phase:phase,p_action:action,p_entry:entry});
 if(error)return {error:"Timer wijzigen mislukt. Stop eerst een eventueel lopende timer en controleer of dit dossier bevestigd of in behandeling is."};
 refresh();return {ok:true,id:String(data)};
}
export async function correctTime(entry:string,revision:number,start:string,end:string,note:string) {
 const {db,userId}=await crmContext();if(!validRecordId(entry)||!Number.isInteger(revision)||revision<1)return {error:"Ongeldige registratie."};
 let values;try{values=correctionValues(start,end,note);}catch(e){return {error:(e as Error).message};}
 const {error}=await db.rpc("correct_work_time",{p_worker:userId,p_entry:entry,p_revision:revision,p_start:values.started_at,p_end:values.ended_at,p_reason:values.note});
 if(error)return {error:"Correctie mislukt. Controleer overlap met andere werkuren, stop een lopende timer en herlaad als iemand deze registratie al wijzigde."};
 refresh();return {ok:true};
}
export async function saveWorkshopSettings(form:FormData) {
 const {db,userId}=await crmContext();let values;try{values=settingsValues(form);}catch(e){return {error:(e as Error).message};}
 const {error}=await db.from("workshop_settings").upsert({worker_id:userId,...values},{onConflict:"worker_id"});if(error)return {error:"Instellingen opslaan mislukt."};refresh();return {ok:true};
}
export async function changePhoto(job:string,id:string,revision:number,action:"edit"|"archive"|"restore",input:unknown) {
 const {db}=await crmContext();if(!validRecordId(job)||!validRecordId(id)||!Number.isInteger(revision)||revision<1||!["edit","archive","restore"].includes(action))return {error:"Ongeldige foto."};
 let values;try{values=action==="edit"?photoChanges(input):{archived_at:action==="archive"?new Date().toISOString():null};}catch(e){return {error:(e as Error).message};}
 const {data,error}=await db.from("request_photos").update({...values,revision:revision+1}).eq("id",id).eq("appointment_id",job).eq("revision",revision).select("id").maybeSingle();
 if(error||!data)return {error:"Foto wijzigen mislukt of elders gewijzigd. Herlaad en probeer opnieuw."};refresh();return {ok:true};
}
