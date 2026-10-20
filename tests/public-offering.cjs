const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');const vm=require('node:vm');
function load(file){const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:m,exports:m.exports,require:name=>load(name.startsWith('@/')?path.resolve(__dirname,'../src',name.slice(2)+'.ts'):path.resolve(path.dirname(file),name+'.ts')),process:{env:{}},FormData});return m.exports;}
const offering=load(path.resolve(__dirname,'../src/lib/public-offering.ts'));
test('presentation mode hides all product and appointment routes, preserving information and existing records',()=>{
  for(const p of [...offering.HIDDEN_OFFERING_PATHS, '/webshop','/webshop/product','/bumpr','/bumpr/mandje','/bumpr/afrekenen','/afspraak','/afspraak/new']) assert.equal(offering.isHiddenOfferingPath(p),true,p);
  for(const p of ['/','/detailing','/contact','/over-ons','/admin/werkplaats','/admin/listings','/bumpr/bestelling/123','/werkplaats-extra']) assert.equal(offering.isHiddenOfferingPath(p),false,p);
  for(const [,url] of offering.publicNavigationLinks()) assert.equal(offering.isHiddenOfferingPath(url),false,url);
});
test('all appointment payloads including cached and incomplete requests are paused',()=>{
  for(const service of ['detailing','onderhoud','']) {const f=new FormData();f.set('kind','appointment');f.set('service',service);f.set('location_type','discuss');assert.equal(offering.isPausedPublicRequest(f),true);assert.equal(offering.isPublicDetailingRequest(f),false);}
});
test('sitemap includes information pages but no product or appointment routes',async()=>{const {default:sitemap}=load(path.resolve(__dirname,'../src/app/sitemap.ts'));const urls=(await sitemap()).map(row=>new URL(row.url).pathname);assert.ok(urls.includes('/detailing'));for(const url of urls)assert.equal(offering.isHiddenOfferingPath(url),false,url);});
test('mechanical switch alone cannot reenable appointments during presentation mode',()=>{try{offering.PUBLIC_OFFERING.mobileWorkshop=true;const f=new FormData();f.set('kind','appointment');f.set('service','onderhoud');f.set('location_type','discuss');assert.equal(offering.isPausedPublicRequest(f),true);}finally{offering.PUBLIC_OFFERING.mobileWorkshop=false;}});
