"use client";
import {useEffect,useState} from "react";
import {saveWorkPhase} from "@/app/admin/workflow-actions";
import {workPhases,type WorkPhase,type PhaseRecord,type CheckAnswer} from "@/lib/work-phases";
export function PhaseChecklist({id,phase,initial}:{id:string;phase:WorkPhase;initial?:PhaseRecord}) {
 const [answers,setAnswers]=useState<Record<string,CheckAnswer>>(initial?.answers||{}),[notes,setNotes]=useState(initial?.notes||""),[revision,setRevision]=useState(initial?.revision||0);
 const [dirty,setDirty]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 useEffect(()=>{if(!dirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[dirty]);
 return <form className="space-y-5" onSubmit={async e=>{e.preventDefault();setBusy(true);setMessage("");try {const result=await saveWorkPhase(id,phase,answers,notes,revision);if(result.error)setMessage(result.error);else {setRevision(result.revision!);setDirty(false);setMessage("Checklist opgeslagen.");}}catch {setMessage("Geen verbinding of sessie verlopen. Je invoer is nog niet opgeslagen.");}finally{setBusy(false);}}}>
 <p className="text-sm text-muted">{Object.keys(answers).length} van {Object.keys(workPhases[phase].items).length} ingevuld · {dirty?"Niet opgeslagen":revision?"Opgeslagen":"Nog niet ingevuld"}</p>
 <fieldset disabled={busy} className="space-y-5">
 {Object.entries(workPhases[phase].items).map(([key,label])=><fieldset key={key}><legend className="mb-2">{label}</legend><div className="flex flex-wrap gap-2">{Object.entries({yes:"Ja",no:"Nee",na:"N.v.t."}).map(([value,title])=><label key={value} className={`cursor-pointer min-h-12 flex items-center gap-2 px-4 py-3 rounded border ${answers[key]===value?"border-yellow-400 bg-yellow-400/10":"border-neutral-600"}`}><input type="radio" name={`${phase}-${key}`} value={value} checked={answers[key]===value} onChange={()=>{setAnswers(a=>({...a,[key]:value as CheckAnswer}));setDirty(true);setMessage("");}}/>{title}</label>)}<button type="button" className="underline px-3 min-h-12 text-sm" onClick={()=>{setAnswers(a=>{const next={...a};delete next[key];return next;});setDirty(true);}}>Wissen</button></div></fieldset>)}
 <label className="block">Notities bij deze fase<textarea className="field mt-2" rows={3} maxLength={10000} value={notes} onChange={e=>{setNotes(e.target.value);setDirty(true);setMessage("");}}/></label>
 </fieldset><button disabled={busy||!dirty} className="btn btn-primary disabled:opacity-50">{busy?"Opslaan…":"Checklist opslaan"}</button><p role="status">{message}</p>
 </form>;
}
