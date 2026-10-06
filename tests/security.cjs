const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const ts = require('typescript'); const vm = require('node:vm'); const path = require('node:path');
function load(file, mocks={}) {
 const module={exports:{}};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,require:n=>mocks[n],Request,Response,URL,Uint8Array,Date,Error});
 return module.exports;
}
const sec=load('lib/request-security.ts');
test('blocks cross-origin form before side effects',async()=>{
 const r=await sec.secureRequest(new Request('https://shop.test/api',{method:'POST',headers:{origin:'https://evil.test'},body:'x'}),100);
 assert.equal(r.error.status,403);
});
test('rejects cross-site fetch metadata without origin',async()=>{
 const r=await sec.secureRequest(new Request('https://shop.test/api',{method:'POST',headers:{'sec-fetch-site':'cross-site'},body:'x'}),100);
 assert.equal(r.error.status,403);
});
test('actual body size enforced with false or absent content-length',async()=>{
 for(const headers of [{},{'content-length':'1'}]) {
 const r=await sec.secureRequest(new Request('https://shop.test/api',{method:'POST',headers,body:'x'.repeat(101)}),100);
 assert.equal(r.error.status,413);
 }
});
test('normal same-origin payload preserved',async()=>{
 const r=await sec.secureRequest(new Request('https://shop.test/api',{method:'POST',headers:{origin:'https://shop.test'},body:'{"ok":true}'}),100);
 assert.equal(r.error,null);assert.deepEqual(await r.request.json(),{ok:true});
});
test('Mollie webhook permits server-to-server requests',async()=>{
 const r=await sec.secureRequest(new Request('https://shop.test/api',{method:'POST',body:'id=tr_example'}),1024,false);
 assert.equal(r.error,null);assert.equal(await r.request.text(),'id=tr_example');
});
const {needsAdminMfa}=load('lib/admin-mfa.ts');
for(const [currentLevel,nextLevel,expected] of [['aal1','aal1',false],['aal1','aal2',true],['aal2','aal2',false]]) test(`MFA ${currentLevel}/${nextLevel}`,async()=>{
 assert.equal(await needsAdminMfa({auth:{mfa:{getAuthenticatorAssuranceLevel:async()=>({data:{currentLevel,nextLevel},error:null})}}}),expected);
});
test('MFA fails closed on provider error',async()=>{
 await assert.rejects(needsAdminMfa({auth:{mfa:{getAuthenticatorAssuranceLevel:async()=>({data:null,error:new Error('unavailable')})}}}));
});
for(const [label,user,mfa,allowed] of [
 ['anonymous',null,false,false],['other account',{email:'someone@example.com',email_confirmed_at:'yes'},false,false],
 ['owner missing second factor',{email:'debumperbank@gmail.com',email_confirmed_at:'yes'},true,false],
 ['verified owner',{email:'debumperbank@gmail.com',email_confirmed_at:'yes'},false,true]
]) test('data access guard: '+label,async()=>{
 let privileged=0;
 const {crmClient}=load('lib/crm.ts',{'server-only':{},'@/lib/admin-access':load('lib/admin-access.ts'),'@/lib/admin-mfa':{needsAdminMfa:async()=>mfa},'next/navigation':{redirect:()=>{throw Error('redirect')}},'@/lib/supabase/server':{createClient:async()=>({auth:{getUser:async()=>({data:{user},error:null})}})},'@/lib/supabase/admin':{createAdminClient:()=>{privileged++;return {}}}});
 if(allowed)await crmClient(); else await assert.rejects(crmClient());
 assert.equal(privileged,allowed?1:0);
});
const {validLead}=load('lib/lead-validation.ts');
for(const invalid of [{name:{}},{email:'bad'},{name:'a\r\nBcc: victim@example.com'},{message:'x'.repeat(5001)},{listing_id:'bad'}]) test('lead validation rejects '+Object.keys(invalid)[0],()=>assert.equal(validLead({name:'Test',email:'test@example.com',...invalid}),false));

test('same-origin behind Next reverse proxy uses destination Host',async()=>{
 const r=await sec.secureRequest(new Request('http://localhost:3000/api',{method:'POST',headers:{host:'www.debumperbank.nl',origin:'https://www.debumperbank.nl'},body:'{}'}),100);
 assert.equal(r.error,null);
});
test('untrusted forwarded host cannot bypass origin check',async()=>{
 const r=await sec.secureRequest(new Request('http://localhost:3000/api',{method:'POST',headers:{host:'www.debumperbank.nl','x-forwarded-host':'evil.test',origin:'https://evil.test'},body:'{}'}),100);
 assert.equal(r.error.status,403);
});
