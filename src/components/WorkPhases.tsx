import {crmClient} from "@/lib/crm";
import {workPhases,type WorkPhase,type PhaseRecord} from "@/lib/work-phases";
import {PhaseChecklist} from "@/components/PhaseChecklist";
import {JobPhotoUpload} from "@/components/JobPhotoUpload";
import Link from "next/link";
export async function WorkPhases({id}:{id:string}) {
 const db=await crmClient();const {data,error}=await db.from("work_phase_checks").select("phase,answers,notes,revision").eq("appointment_id",id);
 if(error)return <p role="alert">Werkfasen konden niet worden geladen.</p>;
 return <section className="mt-8"><h2 className="text-2xl mb-3">Werkfasen, checklist & foto’s</h2><Link className="btn btn-primary mb-5" href={`/admin/werkplaats/${id}`}>Open in werkplaatsapp</Link><Link className="btn btn-ghost mb-5 ml-2" href={`/admin/werkplaats/${id}/fotos`}>Alle foto’s bekijken en bewerken</Link>{(Object.keys(workPhases) as WorkPhase[]).map((phase,index)=><details key={phase} className="panel mb-3"><summary className="cursor-pointer py-3 text-xl font-semibold">{index+1}. {workPhases[phase].label}</summary><div className="pt-4"><PhaseChecklist id={id} phase={phase} initial={(data||[]).find(c=>c.phase===phase) as PhaseRecord|undefined}/><Link className="underline block py-4" href={`/admin/werkplaats/${id}/${phase}`}>Foto’s en tijdregistratie in deze fase →</Link><JobPhotoUpload id={id} stage={phase}/></div></details>)}</section>;
}
