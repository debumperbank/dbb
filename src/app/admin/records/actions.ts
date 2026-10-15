"use server";
import { crmClient } from "@/lib/crm";
import { revalidatePath } from "next/cache";
import { isRecordKind,validRecordId,recordUpdates } from "@/lib/admin-records";
export async function archiveRecord(kind:string,id:string,archived:boolean) {
 const db=await crmClient();
 if(!isRecordKind(kind)||!validRecordId(id)||typeof archived!=="boolean")return {error:"Ongeldig onderdeel."};
 const {data,error}=await db.from(kind).update({archived_at:archived?new Date().toISOString():null}).eq("id",id).select("id").single();
 if(error||!data)return {error:error?.message?.includes("Klok eerst uit")?"Klok eerst uit in de werkplaatsapp voordat je deze klus archiveert.":"Wijzigen is mislukt. Controleer de verbinding en migratie 013."};
 revalidatePath("/admin","layout");return {ok:true};
}
export async function editRecord(kind:string,id:string,form:FormData) {
 const db=await crmClient();
 if(!isRecordKind(kind)||!validRecordId(id))return {error:"Ongeldig onderdeel."};
 let values:Record<string,string|null>;
 try {values=recordUpdates(kind,form);}catch(e){return {error:e instanceof Error?e.message:"Controleer de gegevens."};}
 const {data,error}=await db.from(kind).update(values).eq("id",id).select("id").single();
 if(error||!data)return {error:"Opslaan is mislukt."};
 revalidatePath("/admin","layout");return {ok:true};
}
