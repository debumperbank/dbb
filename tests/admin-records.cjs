const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const ts=require('typescript');
function load(file,mocks={}){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,Date,FormData,require:n=>mocks[n]});return module.exports;}
const lib=load('src/lib/admin-records.ts');const id='11111111-1111-4111-8111-111111111111';
function fixture(denied=false,missing=false) {
 const writes=[];let authenticated=0;
 const db={from(table){
  const query={
   update(values){writes.push({table,values});return query;},
   eq(key,value){assert.equal(key,'id');assert.equal(value,id);return query;},
   select(){return query;},
   single:async()=>({data:missing?null:{id},error:null})
  };return query;
 }};
 const actions=load('src/app/admin/records/actions.ts',{
  '@/lib/admin-records':lib,
  'next/cache':{revalidatePath(){}},
  '@/lib/crm':{crmClient:async()=>{authenticated++;if(denied)throw Error('Unauthorized');return db;}}
 });
 return {actions,writes,auth:()=>authenticated};
}
test('archive and restore change only archived_at on an authorized record',async()=>{const f=fixture();assert.equal((await f.actions.archiveRecord('shop_orders',id,true)).ok,true);assert.deepEqual(Object.keys(f.writes[0].values),['archived_at']);assert.ok(Date.parse(f.writes[0].values.archived_at));await f.actions.archiveRecord('shop_orders',id,false);assert.equal(f.writes[1].values.archived_at,null);assert.equal(f.auth(),2);});
test('arbitrary tables, invalid IDs and nonboolean archive flags are rejected',async()=>{const f=fixture();for(const args of [['customers',id,true],['__proto__',id,true],['shop_orders','invalid',true],['shop_orders',id,'false']])assert.ok((await f.actions.archiveRecord(...args)).error);assert.equal(f.writes.length,0);});
test('authorization blocks both edits and archive before database writes',async()=>{const f=fixture(true);await assert.rejects(f.actions.archiveRecord('shop_orders',id,true));await assert.rejects(f.actions.editRecord('shop_orders',id,new FormData()));assert.equal(f.writes.length,0);});
test('order edits cannot alter payment amounts, status or customer data',async()=>{const f=fixture();const form=new FormData();for(const [key,value] of Object.entries({tracking_reference:' DHL123 ',admin_notes:' Test ',status:'paid',total_cents:'0',customer:'malicious',archived_at:'x'}))form.set(key,value);assert.equal((await f.actions.editRecord('shop_orders',id,form)).ok,true);assert.deepEqual(JSON.parse(JSON.stringify(f.writes[0].values)),{tracking_reference:'DHL123',admin_notes:'Test'});});
test('missing record and invalid email return errors',async()=>{assert.ok((await fixture(false,true).actions.archiveRecord('inquiries',id,true)).error);const f=fixture();const form=new FormData();for(const key of Object.keys(lib.recordKinds.inquiries.fields))form.set(key,key==='name'?'Test':key==='email'?'bad-email':'');assert.ok((await f.actions.editRecord('inquiries',id,form)).error);assert.equal(f.writes.length,0);});
test('oversized input is rejected and empty tracking is cleared',()=>{const form=new FormData();form.set('tracking_reference','');form.set('admin_notes','');assert.equal(lib.recordUpdates('shop_orders',form).tracking_reference,null);form.set('admin_notes','x'.repeat(20001));assert.throws(()=>lib.recordUpdates('shop_orders',form));});
