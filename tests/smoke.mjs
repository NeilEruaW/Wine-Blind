import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const index=read('index.html');
const app=read('app.js');
const css=read('styles.css');
const overlay=read('v11-reset.css');
const patch=read('v11-reset-patch.js');
const sw=read('sw.js');

for(const asset of ['styles.css','v11-reset.css','data.js','v106.js','v107.js','v108.js','tree.js','app.js','c2c2-data.js','c2c2-engine.js','v11-reset-patch.js']) assert.ok(index.includes(asset),`index missing ${asset}`);
for(const feature of ['data-tab="grape"','data-tab="origin"','data-tab="tree"','data-tab="quiz"','data-tab="reference"','id="historyList"']) assert.ok(index.includes(feature),`historical UI missing ${feature}`);
assert.ok(app.length>500000,'historical app.js unexpectedly small');
for(const feature of ['WINE_LEXICON','trainingHubStats','refOrigins','wineBlindHistoryV2']) assert.ok(app.includes(feature),`historical app feature missing ${feature}`);
for(const feature of ['.sat-continuum','.training-grid','.alpha-index','.aroma-group']) assert.ok(css.includes(feature),`historical CSS feature missing ${feature}`);
for(const feature of ['openProfile','openGrapeAggregate','saveC2','Top 10 origines','C2-C2','interactionAffectsDiagnostic']) assert.ok(patch.includes(feature),`V11.0.4 patch feature missing ${feature}`);
assert.ok(sw.includes('wine-blind-v11-0-4-mobile-1'),'wrong service-worker cache namespace');

// Mobile navigation / interaction regression guards.
assert.ok(overlay.includes('repeat(var(--sat-count),minmax(0,1fr))'),'SAT continuum does not use its real point count');
assert.ok(overlay.includes('left:calc(50% / var(--sat-count))'),'SAT left edge is not aligned to first point');
assert.ok(overlay.includes('right:calc(50% / var(--sat-count))'),'SAT right edge is not aligned to last point');
assert.ok(overlay.includes('touch-action:manipulation'),'touch targets are not hardened for iOS Safari');
assert.ok(!patch.includes("document.addEventListener('click',e=>{const ref="),'legacy global capture click listener still present');
assert.ok(!patch.includes("document.addEventListener('pointerup',schedule,true)"),'legacy global capture pointer listener still present');
assert.ok(patch.includes("document.addEventListener('click',e=>{if(interactionAffectsDiagnostic(e.target))schedule()},false)"),'diagnostic recompute is not scoped to diagnostic inputs');
assert.ok(patch.includes("document.addEventListener('pointerup',e=>{if(e.target.closest?.('#structureFields .sat-continuum,#markerFields .choice-rail'))schedule()},false)"),'rail recompute must happen after target pointer handler');
assert.ok(patch.includes("Aucun repère saisi"),'misleading confidence badge was not replaced');
assert.ok(patch.includes('metric-level-${level(r.center)}'),'C2-C2 reference metrics are not using legacy progressive color classes');
assert.ok(patch.includes('window.__C2_LAST=null'),'reset/no-signal state does not clear cached C2 result');
assert.ok(app.includes('Convergence · Arbre autonome'),'tree is not presented as standalone');
assert.ok(app.includes('window.WineBlindTree={restart:treeRestart}'),'tree lifecycle bridge is missing');
assert.ok(app.includes('function tab(n){$$(\".tab\").forEach'),'main navigation does not iterate over all tabs');
assert.ok(patch.includes('wireTreeLifecycle'),'red/white/reset actions do not rebuild the tree lifecycle');
assert.ok(!app.includes('syncTreeToDiagnostic'),'legacy Tree → Diagnostic coupling is still active');
assert.ok(!app.includes('treeDiagnosticCandidates'),'tree still depends on the legacy Diagnostic ranking');

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
console.log('Wine Blind V11.0.4 mobile stability smoke test: PASS');