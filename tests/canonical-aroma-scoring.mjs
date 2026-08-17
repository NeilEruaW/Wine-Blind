import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const boot=withOverlay=>{
  const sandbox={window:{},console};vm.createContext(sandbox);
  vm.runInContext(read('canonical-aroma-runtime.js'),sandbox,{filename:'canonical-aroma-runtime.js'});
  vm.runInContext(read('c2c2-data.js'),sandbox,{filename:'c2c2-data.js'});
  if(withOverlay)vm.runInContext(read('canonical-scoring-overlay.js'),sandbox,{filename:'canonical-scoring-overlay.js'});
  vm.runInContext(read('c2c2-engine.js'),sandbox,{filename:'c2c2-engine.js'});
  return sandbox.window;
};
const base=boot(false),promoted=boot(true),A=promoted.WINE_BLIND_AROMA_CANONICAL;
const empty={structure:{},families:[],signatures:[],exacts:[],coherenceTokens:[]};
const emptyBase=base.WineBlindEngine.score(empty),emptyPromoted=promoted.WineBlindEngine.score(empty);
assert.equal(JSON.stringify(emptyPromoted.grapes.map(x=>[x.profile.grape,x.I])),JSON.stringify(emptyBase.grapes.map(x=>[x.profile.grape,x.I])),'absence of an approved aroma changed a grape score');

const exactMap=A.policy.exact_normalization;
for(const r of A.approved_relations){
  const exact=exactMap[r.label_fr],obs={...empty,exacts:[exact]};
  const result=promoted.WineBlindEngine.score(obs).grapes.find(x=>x.profile.grape===r.grape);
  assert.ok(result,`approved grape missing from scoring population: ${r.grape}`);
  assert.ok(result.A>0,`${r.grape} receives no positive aroma contribution for ${r.label_fr}`);
  const markers=promoted.WineBlindEngine.byGrape[r.grape].flatMap(p=>p.markers).filter(m=>m.marker_id===`exact:${exact}`);
  assert.ok(markers.length>0,`approved marker not materialized: ${r.grape} / ${r.label_fr}`);
  assert.ok(markers.every(m=>m.absence_is_negative===false||!m.approved_proposal_id),`absence guard missing: ${r.grape} / ${r.label_fr}`);
}
assert.equal(promoted.WINE_BLIND_CANDIDATE.canonical_aroma_overlay.relations,18);
assert.equal(promoted.WINE_BLIND_CANDIDATE.canonical_aroma_overlay.mode,'POSITIVE_ONLY');
console.log('Canonical aroma promotion and positive-only C2-C2 scoring: PASS (18/18)');
