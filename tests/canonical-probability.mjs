import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const s={window:{},Math,Number,Object,Map,Set,console};vm.createContext(s);
for(const f of ['c2c2-data.js','canonical-aroma-runtime.js','canonical-scoring-overlay.js','lacunar-profile-overlay.js','canonical-probability-model.js'])vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});
const P=s.window.WineBlindCanonicalProbability;assert.ok(P);
for(const variant of ['baseline','discriminant-v2']){const d=P.distribution({},'Rouge',{variant});assert.ok(Math.abs(d.values.reduce((a,x)=>a+x.probability,0)-1)<1e-10);assert.ok(d.top10_probability<1);assert.equal('other_probability' in d,false)}
const p=P.distribution({structure:{Acidité:4.5,Tanins:2,Alcool:3,Corps:2.5,Couleur:2},families:['Fruits rouges'],exacts:['strawberry','cherry']},'Rouge',{variant:'discriminant-v2'});assert.ok(p.top10.some(x=>x.grape==='Pinot Noir'));
for(const grape of ['Saperavi','Duras','Gros Manseng','Moschofilero','Poulsard','Négrette','Romorantin','Trousseau']){const g=s.window.WINE_BLIND_AROMA_CANONICAL.grapes.find(x=>x.grape===grape),descriptors=g.relations.filter(x=>x.kind==='descriptor'),groups=new Set(descriptors.map(x=>x.group));assert.ok(descriptors.length>=8,`${grape}: fewer than 8 descriptors`);assert.ok(groups.size>=4,`${grape}: fewer than 4 aroma groups`)}
console.log('Canonical probability variants: PASS');
