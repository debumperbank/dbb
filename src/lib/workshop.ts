import {isWorkPhase,legacyPhotoLabels} from "@/lib/work-phases";
export type TimeEntry={id:string;appointment_id:string;phase:string;started_at:string;ended_at:string|null;revision:number;note:string};
export type WorkshopSettings={default_phase:string;hourly_rate_cents:number|null;reminder_minutes:number;show_completed:boolean};
export const defaultSettings:WorkshopSettings={default_phase:"intake",hourly_rate_cents:null,reminder_minutes:120,show_completed:false};
export function secondsWorked(entry:Pick<TimeEntry,"started_at"|"ended_at">,now:number){return Math.max(0,Math.floor(((entry.ended_at?Date.parse(entry.ended_at):now)-Date.parse(entry.started_at))/1000));}
export function timeLabel(seconds:number){const mins=Math.floor(Math.max(0,seconds)/60);return `${Math.floor(mins/60)}u ${String(mins%60).padStart(2,"0")}m`;}
export type PhotoRecord={id:string;appointment_id:string;stage:string;caption:string;rotation:number;marks:{x:number;y:number}[];revision:number;archived_at:string|null;url?:string};
export function photoChanges(value:unknown){
 const p=value as Partial<PhotoRecord>|null;
 if(!p||typeof p.stage!=="string"||!(isWorkPhase(p.stage)||Object.hasOwn(legacyPhotoLabels,p.stage))||typeof p.caption!=="string"||p.caption.length>2000||![0,90,180,270].includes(Number(p.rotation))||typeof p.rotation!=="number"||!Array.isArray(p.marks)||p.marks.length>100)throw Error("Controleer de foto-instellingen.");
 const marks=p.marks.map(m=>{if(!m||!Number.isFinite(m.x)||!Number.isFinite(m.y)||m.x<0||m.x>1||m.y<0||m.y>1)throw Error("Ongeldige schademarkering.");return {x:m.x,y:m.y};});
 return {stage:p.stage,caption:p.caption.trim(),rotation:p.rotation,marks};
}
export function settingsValues(form:FormData):WorkshopSettings {
 const default_phase=String(form.get("default_phase")||""),raw=String(form.get("hourly_rate")||"").trim().replace(",","."),reminder_minutes=Number(form.get("reminder_minutes"));
 if(!isWorkPhase(default_phase)||!Number.isInteger(reminder_minutes)||reminder_minutes<15||reminder_minutes>720||(raw&&(!/^\d+(\.\d{1,2})?$/.test(raw)||Number(raw)>1000)))throw Error("Controleer standaardfase, herinnering (15–720 min) en tarief (maximaal €1.000). ");
 return {default_phase,hourly_rate_cents:raw?Math.round(Number(raw)*100):null,reminder_minutes,show_completed:form.get("show_completed")==="on"};
}
export function correctionValues(start:string,end:string,note:string){const a=Date.parse(start),b=Date.parse(end);if(!Number.isFinite(a)||!Number.isFinite(b)||b<=a||b>Date.now()+5000||b-a>7*86400000||typeof note!=="string"||!note.trim()||note.length>2000)throw Error("Controleer begin- en eindtijd en geef een reden. Maximaal 7 dagen per registratie.");return {started_at:new Date(a).toISOString(),ended_at:new Date(b).toISOString(),note:note.trim()};}
