const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const vm=require('node:vm');
const path=require('node:path');
function load(file,mocks={}){
 const module={exports:{}};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module,exports:module.exports,require:n=>mocks[n],Response,console:{error(){}},Date});
 return module.exports;
}
const {isAdminUser}=load('lib/admin-access.ts');
for(const [label,user,expected] of [
 ['anonymous',null,false],['other verified user',{email:'visitor@example.com',email_confirmed_at:'2026-01-01'},false],
 ['unverified owner',{email:'debumperbank@gmail.com'},false],['verified owner',{email:'DEBUMPERBANK@GMAIL.COM',email_confirmed_at:'2026-01-01'},true],
 ['forged user metadata',{email:'visitor@example.com',email_confirmed_at:'2026-01-01',user_metadata:{role:'admin'}},false]
])test('admin access: '+label,()=>assert.equal(isAdminUser(user),expected));
for(const route of ['inquiries','car-wash','workshop-bookings']){
 for(const failure of [false,true])test(route+': '+(failure?'mail failure preserves saved request':'reject non-boolean consent'),async()=>{
 let saves=0,notifications=0;
 const {POST}=load(`app/api/${route}/route.ts`,{
 'next/server':{NextResponse:{json:(body,init)=>Response.json(body,init)}},
 '@/lib/supabase/server':{createClient:async()=>({from:()=>({insert:async()=>{saves++;return {error:null}}})})},
 '@/lib/resend':{notifyAdmin:async()=>{notifications++;return false}}
 });
 const response=await POST(new Request('https://example.com',{method:'POST',body:JSON.stringify({name:'Test',email:'test@example.com',address:'Test 1',consent:failure?'on':'false'})}));
 assert.equal(response.status,failure?200:400);assert.equal(saves,failure?1:0);assert.equal(notifications,failure?1:0);
 if(failure)assert.equal((await response.json()).ok,true);
 });
}
