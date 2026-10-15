"use server";
import {crmClient} from "@/lib/crm";
import {validRecordId} from "@/lib/admin-records";
import {validatePhase} from "@/lib/work-phases";
import {revalidatePath} from "next/cache";
export async function saveWorkPhase(id:string,phase:string,answers:unknown,notes:string,revision:number) {
 const db=await crmClient();if(!validRecordId(id))return {error:"Ongeldig dossier."};
 let values;try {values=validatePhase(phase,answers,notes,revision);}catch {return {error:"Controleer de checklist en notities."};}
 const {data,error}=await db.rpc("save_work_phase",{job_id:id,phase_key:phase,new_answers:values.answers,new_notes:values.notes,expected_revision:revision});
 if(error)return {error:"Opslaan mislukt. Mogelijk is deze fase elders gewijzigd. Je invoer blijft staan; herlaad pas nadat je eventuele eigen wijzigingen hebt overgenomen."};
 revalidatePath("/admin","layout");return {ok:true,revision:Number(data)};
}
