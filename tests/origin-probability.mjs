import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const s={window:{},console};vm.createContext(s);
for(const f of ['data.js','c2c2-data.js','canonical-aroma-runtime.js','canonical-scoring-overlay.js','lacunar-profile-overlay.js','canonical-profile-runtime.js','canonical-probability-model.js','origin-probability-model.js'])vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});
const O=s.window.WineBlindOriginProbability;assert.ok(O,'origin probability model missing');
const obs={structure:{Acidité:4,Tanins:2,Alcool:3,Corps:2,Couleur:2},families:['Fruits rouges'],signatures:['Floral'],exacts:['strawberry','cherry']};
for(const colour of ['Rouge','Blanc'])for(const scope of ['world','france']){const d=O.distribution(obs,colour,{scope});assert.equal(d.status,'probabilistic');assert.ok(Math.abs(d.values.reduce((a,x)=>a+x.probability,0)-1)<1e-10);assert.ok(d.top10_probability<=1);assert.equal(d.display_policy,'TOP_10_ONLY_NOT_RENORMALIZED');assert.equal('other_probability' in d,false);if(scope==='france')assert.ok(d.values.every(x=>O.isFrance(x.profile)))}
const exact={structure:{Acidité:3.5,Tanins:5,Alcool:5,Corps:5,Couleur:5},families:['Fruits noirs'],signatures:['Végétal / herbacé','Bois marqué'],exacts:['graphite','blueberry','poivron vert']};
const napa=O.distribution(exact,'Rouge',{scope:'world'});assert.ok(napa.top10.some(x=>x.profile.style==='Napa Valley Cabernet'),'near-exact Napa profile absent from Top 10');
console.log('Hierarchical origin probability: PASS');
