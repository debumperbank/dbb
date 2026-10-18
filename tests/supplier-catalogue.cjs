const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const vm=require('node:vm');
function load(file){
 const module={exports:{}};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,require:name=>load(path.resolve(path.dirname(file),name+'.ts')),URLSearchParams});
 return module.exports;
}
const shop=load(path.resolve(__dirname,'../src/lib/supplier-shop.ts'));
const items=shop.buildSupplierItems();
test('catalogue has unique real supplier references and prices only for verified DRIFT articles',()=>{
 assert.equal(items.length,409);
 assert.equal(new Set(items.map(p=>p.slug)).size,items.length);
 for(const item of items){assert.match(item.source,/^https:\/\//);if(item.brand!=='DRIFT')assert.equal(item.priceQuote,undefined);else assert.ok(shop.itemPriceCents(item)>0);}
});
test('shared filters combine brand, category, search and ordering',()=>{
 const filters=shop.readShopFilters({merk:'gecko',categorie:'polish pads',q:'pad',sort:'name'});
 const selected=shop.filterSupplierItems(items,filters);
 assert.ok(selected.length>0);
 for(const item of selected){assert.equal(item.brand,'GECKO');assert.equal(item.category,'Polijstpads');}
 const url=new URL(shop.shopFilterUrl(filters),'https://example.com');
 assert.equal(JSON.stringify(shop.readShopFilters(Object.fromEntries(url.searchParams))),JSON.stringify(filters));
});
test('existing sale products are not duplicated by supplier name or slug',()=>{
 const item=items.find(p=>p.brand==='DRIFT');
 assert.equal(shop.buildSupplierItems([{slug:item.slug,name:'Existing'}]).length,408);
 assert.equal(shop.buildSupplierItems([{slug:'another-slug',brand:item.brand,name:item.name.replace(/^DRIFT /,'')}]).length,408);
});
test('DRIFT autoshampoo variants retain confirmed retail prices including VAT',()=>{
 const item=items.find(p=>p.name==='DRIFT Autoshampoo');
 assert.ok(item);assert.equal(item.priceQuote.includesVat,true);
 assert.ok(item.priceQuote.variants.some(v=>v.priceCents===1295));
 assert.ok(item.priceQuote.variants.some(v=>v.priceCents===1795));
});
test('price sorting places unpriced enquiries after known prices in both directions',()=>{
 for(const sort of ['price_asc','price_desc']){
 const sorted=shop.filterSupplierItems(items,shop.readShopFilters({sort}));
 const firstUnknown=sorted.findIndex(item=>shop.itemPriceCents(item)===null);
 assert.ok(firstUnknown>0);assert.ok(sorted.slice(firstUnknown).every(item=>shop.itemPriceCents(item)===null));
 }
});
