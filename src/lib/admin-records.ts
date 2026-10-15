export const recordKinds = {
 appointments: { label: "Aanvraag / werkdossier", fields: {description: "Werkzaamheden / vraag", work_notes:"Werknotities",admin_notes:"Beheernotitie"} },
 inquiries: {label:"Interesse / bericht",fields:{name:"Naam",email:"E-mail",phone:"Telefoon",message:"Bericht",admin_notes:"Beheernotitie"}},
 car_wash_bookings: {label:"Carwash-aanvraag",fields:{name:"Naam",email:"E-mail",phone:"Telefoon",address:"Adres",notes:"Aanvraagnotities",admin_notes:"Beheernotitie"}},
 workshop_bookings: {label:"Werkplaatsaanvraag",fields:{name:"Naam",email:"E-mail",phone:"Telefoon",notes:"Aanvraagnotities",admin_notes:"Beheernotitie"}},
 trade_ins: {label:"Inkoopaanvraag",fields:{name:"Naam",email:"E-mail",phone:"Telefoon",registration:"Kenteken",condition:"Staat",maintenance:"Onderhoud",damage:"Schade",notes:"Notities",admin_notes:"Beheernotitie"}},
 shop_orders: {label:"Webshopbestelling / betaalmelding",fields:{tracking_reference:"Track & trace",admin_notes:"Beheernotitie"}},
} as const;
export type RecordKind = keyof typeof recordKinds;
export function isRecordKind(value: string): value is RecordKind {return Object.hasOwn(recordKinds,value);}
export function validRecordId(value: string) {return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value);}
export function recordUpdates(kind: RecordKind, form: FormData): Record<string,string | null> {
 const update:Record<string,string|null>={};
 for(const key of Object.keys(recordKinds[kind].fields)) {
  const raw=form.get(key);if(typeof raw!=="string") throw new Error("Controleer de ingevulde velden.");
  const value=raw.trim();const max=key==="email"?254:key==="phone"?40:["name","address","registration","tracking_reference"].includes(key)?200:20000;
  if(value.length>max) throw new Error("Een ingevuld veld is te lang.");
  if(["name","email","address","registration","description"].includes(key) && !value) throw new Error("Vul de verplichte gegevens in.");
  if(key==="email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Vul een geldig e-mailadres in.");
  update[key]=key==="tracking_reference" && !value?null:value;
 }
 return update;
}
