import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const index=read('index.html');
const app=read('app.js');
const css=read('styles.css');
const patch=read('v11-reset-patch.js');
const sw=read('sw.js');

for(const asset of ['styles.css','v11-reset.css','data.js','v106.js','v107.js','v108.js','tree.js','app.js','c2c2-data.js','c2c2-engine.js','v11-reset-patch.js']) assert.ok(index.includes(asset),`index missing ${asset}`);
for(const feature of ['data-tab="grape"','data-tab="origin"','data-tab="tree"','data-tab="quiz"','data-tab="reference"','id="historyList"']) assert.ok(index.includes(feature),`historical UI missing ${feature}`);
assert.ok(app.length>500000,'historical app.js unexpectedly small');
for(const feature of ['WINE_LEXICON','trainingHubStats','refOrigins','wineBlindHistoryV2']) assert.ok(app.includes(feature),`historical app feature missing ${feature}`);
for(const feature of ['.sat-continuum','.training-grid','.alpha-index','.aroma-group']) assert.ok(css.includes(feature),`historical CSS feature missing ${feature}`);
for(const feature of ['openProfile','openGrapeAggregate','saveC2','Top 10 origines','C2-C2']) assert.ok(patch.includes(feature),`V11 patch feature missing ${feature}`);
assert.ok(sw.includes('wine-blind-v11-reset-c2c2-1'),'wrong service-worker cache namespace');

const sandbox={window:{},console};
vm.createContext(sandbox);
vm.runInContext(read('c2c2-data.js'),sandbox,{filename:'c2c2-data.js'});
const C=sandbox.window.WINE_BLIND_CANDIDATE;
assert.equal(C.candidate_id,'Wine-Blind-vNext-C2-C2');
assert.equal(C.profiles.length,203);
assert.equal(new Set(C.profiles.map(p=>p.grape)).size,85);
assert.equal(C.marker_dictionary.length,77);
assert.equal(C.marker_dictionary.filter(m=>m.kind==='exact').length,63);
vm.runInContext(read('c2c2-engine.js'),sandbox,{filename:'c2c2-engine.js'});
const E=sandbox.window.WineBlindEngine;
assert.ok(E&&typeof E.score==='function','engine did not initialize');
const obs={structure:{'Acidité':4,'Tanins':4,'Alcool':4,'Corps':4,'Couleur':4},families:['Fruits noirs'],signatures:['Épicé / poivré'],exacts:['cassis','graphite'],coherenceTokens:[]};
const scored=E.score(obs);
assert.equal(scored.grapes.length,85);
assert.equal(scored.profiles.length,203);
assert.ok(scored.grapes.every(x=>Number.isFinite(x.I)&&Number.isFinite(x.A)&&Number.isFinite(x.S_eff)&&Number.isFinite(x.C)),'non-finite score');
assert.ok(scored.grapes[0].I>=scored.grapes.at(-1).I,'ranking not sorted');
console.log('Wine Blind V11.0.3 RESET smoke test: PASS');
