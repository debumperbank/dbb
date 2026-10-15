import "server-only";
import {crmContext,crmClient,type Appointment} from "@/lib/crm";
import {notFound} from "next/navigation";
import {validRecordId} from "@/lib/admin-records";
import {defaultSettings,type WorkshopSettings,type TimeEntry} from "@/lib/workshop";
export async function workshopContext(){const context=await crmContext();const [settings,active]=await Promise.all([context.db.from("workshop_settings").select("default_phase,hourly_rate_cents,reminder_minutes,show_completed").eq("worker_id",context.userId).maybeSingle(),context.db.from("work_time_entries").select("*").eq("worker_id",context.userId).is("ended_at",null).maybeSingle()]);if(settings.error||active.error)throw Error("Werkplaatsapp laden mislukt. Controleer de verbinding en migratie 015.");return {...context,settings:{...defaultSettings,...settings.data} as WorkshopSettings,active:active.data as TimeEntry|null};}
export async function workshopJob(id:string){const db=await crmClient();if(!validRecordId(id))notFound();const {data,error}=await db.from("appointments").select("*,customers(*),vehicles(*)").eq("id",id).maybeSingle();if(error)throw Error("Dossier laden mislukt.");if(!data)notFound();return data as unknown as Appointment;}
