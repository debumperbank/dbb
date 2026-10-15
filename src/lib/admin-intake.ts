import {validRecordId} from "@/lib/admin-records";
import {services} from "@/lib/services";
export function customerValues(form:FormData) {
 const name=String(form.get("name")||"").trim(),email=String(form.get("email")||"").trim().toLowerCase(),phone=String(form.get("phone")||"").trim();
 if(!name||name.length>200||email.length>254||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))||phone.length>40||(!phone&&!email))throw Error("Vul een naam en minimaal een geldig e-mailadres of telefoonnummer in.");
 return {name,email,phone};
}
export function jobValues(customerId:string,form:FormData) {
 const vehicle_id=String(form.get("vehicle_id")||"");const registration=String(form.get("registration")||"").trim().toUpperCase(),make_model=String(form.get("make_model")||"").trim(),service=String(form.get("service")||""),description=String(form.get("description")||"").trim();
 if(!validRecordId(customerId)||(vehicle_id&&!validRecordId(vehicle_id))||!Object.hasOwn(services,service)||!description||description.length>20000||(!vehicle_id&&(!/^[A-Z0-9 -]{1,30}$/.test(registration)||!/[A-Z0-9]/.test(registration)||!make_model||make_model.length>200)))throw Error("Controleer voertuig, werkzaamheden en omschrijving.");
 return {customer_id:customerId,vehicle_id,registration,make_model,service,description};
}
