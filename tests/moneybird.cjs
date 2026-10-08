const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const ts=require('typescript');
function load(file,mocks={},env={}){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/lib',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,process:{env},Date,AbortSignal,fetch:()=>{throw Error('Unexpected network')},require:n=>n==='server-only'?{}:mocks[n]});return module.exports;}
const api=load('moneybird.ts');
const order={id:'11111111-1111-4111-8111-111111111111',status:'paid',payment_mode:'live',payment_id:'tr_123',paid_at:'2026-10-07T22:30:00Z',customer:{name:'Jan Jansen',email:'jan@example.com',street:'Straat 1',city:'Hulst',postal_code:'4561AA',country:'NL'},items:[{name:'Polish',quantity:2,unit_price_cents:3495}],shipping_cents:0,total_cents:6990};
const invoice={id:'123',administration_id:api.MONEYBIRD_ADMINISTRATION,reference:api.invoiceReference(order),currency:'EUR',total_price_incl_tax:'69.90',state:'draft',sent_at:null,payments:[],total_unpaid:'69.90'};
test('invoice preserves paid gross amount and explicit accounting choices',()=>{const v=api.invoicePayload(order,'42',{tax:'1',ledger:'2',workflow:'3'}).sales_invoice;assert.equal(v.prices_are_incl_tax,true);assert.equal(v.details_attributes.length,1);assert.equal(v.details_attributes[0].price,'34.95');assert.equal(v.details_attributes[0].amount,'2');assert.match(v.payment_conditions,/Niet opnieuw betalen/);});
test('shipping becomes a separate gross invoice line',()=>{const v=api.invoicePayload({...order,shipping_cents:699},'42',{tax:'1',ledger:'2',workflow:'3'}).sales_invoice;assert.equal(v.details_attributes[1].price,'6.99');});
test('missing accounting configuration blocks export',()=>assert.throws(()=>api.moneybirdConfig('NL')));
for(const change of [{currency:'USD'},{total_price_incl_tax:'1.00'},{reference:'other'},{administration_id:'999'}])test('mismatched invoice never sent '+JSON.stringify(change),()=>assert.throws(()=>api.verifyInvoice({...invoice,...change},order)));
function fixture({mode='live',status='paid',existing=null,sendFails=false,createFails=false,paymentFails=false,paymentAcknowledgementLost=false,job:seed=null,enabled=true}={}){
 let job=seed?{order_id:order.id,administration_id:api.MONEYBIRD_ADMINISTRATION,...seed}:null;let remote=existing;const calls=[];
 const db={from:table=>{
  let operation='read',values,states;
  const chain={select(){return this},eq(){return this},in(k,v){states=v;return this},upsert(v){if(!job)job={...v,state:'pending',contact_attempted:false,invoice_attempted:false,send_attempted:false,payment_attempted:false};return Promise.resolve({error:null})},update(v){operation='update';values=v;return this},single(){return this.run()},maybeSingle(){return this.run()},then(resolve,reject){return this.run().then(resolve,reject)},async run(){if(table==='shop_orders')return {data:{...order,payment_mode:mode,status},error:null};if(operation==='update'){if(states&&!states.includes(job.state))return {data:null,error:null};Object.assign(job,values);return {data:{...job},error:null};}return {data:job,error:null}}};return chain;
 }};
 const mb={...api,moneybirdConfig:()=>({tax:'1',ledger:'2',workflow:'3'}),moneybirdRequest:async(p,m='GET',body)=>{
 calls.push([p,m,body]);
 if(p.endsWith('/payments.json')){if(paymentFails)throw new api.MoneybirdError('connection_uncertain');remote={...remote,state:'paid',total_unpaid:'0.0',payments:[body.payment]};if(paymentAcknowledgementLost)throw new api.MoneybirdError('connection_uncertain');return {id:'900'};}
 if(p.startsWith('contacts/customer_id/'))return {id:'42'};
 if(p==='sales_invoices.json'){if(createFails)throw new api.MoneybirdError('connection_uncertain');remote={...invoice};return remote;}
 if(p.endsWith('/send_invoice.json')){if(sendFails)throw new api.MoneybirdError('connection_uncertain');remote={...remote,state:'open',sent_at:'2026-09-24'};return remote;}
 return remote;
 }};
 const mod=load('moneybird-sync.ts',{'@/lib/supabase/admin':{createAdminClient:()=>db},'./moneybird':mb},{MONEYBIRD_ENABLED:enabled?'true':'false'});
 return {run:()=>mod.syncMoneybirdOrder(order.id),calls,get job(){return job}};
}
test('test payments never create an export',async()=>{const f=fixture({mode:'test'});await f.run();assert.equal(f.job,null);assert.equal(f.calls.length,0)});
test('unpaid and disabled integrations never call Moneybird',async()=>{for(const opts of [{status:'open'},{enabled:false}]){const f=fixture(opts);await f.run();assert.equal(f.calls.length,0)}});
test('successful export creates and sends exactly once on repeated callbacks',async()=>{const f=fixture();await f.run();await f.run();assert.equal(f.job.state,'done');assert.equal(f.calls.filter(x=>x[0]==='sales_invoices.json'&&x[1]==='POST').length,1);assert.equal(f.calls.filter(x=>x[1]==='PATCH').length,1)});
test('concurrent callbacks cannot both create invoices',async()=>{const f=fixture();await Promise.allSettled([f.run(),f.run()]);assert.equal(f.calls.filter(x=>x[0]==='sales_invoices.json'&&x[1]==='POST').length,1)});
test('existing invoice by reference is reused',async()=>{const f=fixture({existing:{...invoice}});await f.run();assert.equal(f.calls.filter(x=>x[0]==='sales_invoices.json'&&x[1]==='POST').length,0)});
test('timeout during creation is never blindly retried',async()=>{const f=fixture({createFails:true});await assert.rejects(f.run());await assert.rejects(f.run());assert.equal(f.calls.filter(x=>x[0]==='sales_invoices.json'&&x[1]==='POST').length,1);assert.equal(f.job.state,'error')});
test('timeout sending is never blindly resent',async()=>{const f=fixture({sendFails:true});await assert.rejects(f.run());await assert.rejects(f.run());assert.equal(f.calls.filter(x=>x[1]==='PATCH').length,1)});
test('sent invoice after lost acknowledgement is recovered without sending again',async()=>{const f=fixture({existing:{...invoice,state:'paid',sent_at:'2026-09-24',total_unpaid:'0.0',payments:[{transaction_identifier:'tr_123',price:'69.90'}]},job:{state:'error',invoice_id:'123',send_attempted:true}});await f.run();assert.equal(f.job.state,'done');assert.equal(f.calls.filter(x=>x[1]!=='GET').length,0)});
test('foreign invoice total blocks email',async()=>{const f=fixture({existing:{...invoice,total_price_incl_tax:'1.00'}});await assert.rejects(f.run());assert.equal(f.calls.filter(x=>x[1]==='PATCH').length,0)});

test('selected document style is passed to Moneybird',()=>{const p=api.invoicePayload(order,'42',{tax:'1',ledger:'2',workflow:'3',documentStyle:'4'});assert.equal(p.sales_invoice.document_style_id,'4');});
test('invoice email uses order total and explicitly says already paid',()=>{const m=api.invoiceEmailMessage(order);assert.match(m,/69,90/);assert.match(m,/Je hoeft niets meer te betalen/);assert.match(m,/Jan Jansen/);});

test('records payment once with exact Mollie reference and Dutch payment date',async()=>{const f=fixture();await f.run();await f.run();const payments=f.calls.filter(x=>x[0].endsWith('/payments.json'));assert.equal(payments.length,1);assert.equal(payments[0][2].payment.transaction_identifier,'tr_123');assert.equal(payments[0][2].payment.price,'69.90');assert.equal(payments[0][2].payment.payment_date,'2026-10-08');});
test('uncertain payment is never blindly repeated',async()=>{const f=fixture({paymentFails:true});await assert.rejects(f.run());await assert.rejects(f.run());assert.equal(f.calls.filter(x=>x[0].endsWith('/payments.json')).length,1);assert.equal(f.job.state,'error');});
test('lost payment acknowledgement recovers from remote invoice',async()=>{const f=fixture({paymentAcknowledgementLost:true});await assert.rejects(f.run());await f.run();assert.equal(f.job.state,'done');assert.equal(f.calls.filter(x=>x[0].endsWith('/payments.json')).length,1);});
test('unknown or partial payment blocks duplicate booking',async()=>{for(const p of [{transaction_identifier:'other',price:'69.90'},{transaction_identifier:'tr_123',price:'1.00'}]){const f=fixture({existing:{...invoice,state:'open',sent_at:'2026-10-08',payments:[p]}});await assert.rejects(f.run());assert.equal(f.calls.filter(x=>x[0].endsWith('/payments.json')).length,0);}});
test('malformed payment or missing paid date is rejected',()=>{for(const delta of [{paid_at:null},{paid_at:'invalid'},{payment_mode:'test'},{payment_id:'bad'}])assert.throws(()=>api.molliePaymentPayload({...order,...delta}));});
