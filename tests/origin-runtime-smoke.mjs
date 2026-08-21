import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=p=>fs.readFileSync(p,'utf8');
const index=read('index.html');
const sw=read('sw.js');
const origin=read('origin-probability-patch.js');

assert.ok(index.includes('<script src="origin-probability-patch.js"></script>'),'origin probability runtime is not loaded');
assert.ok(sw.includes("const CACHE='wine-blind-v11-5-4-origin-calibration-1'"),'active PWA cache is not V11.5.4');
assert.ok(sw.includes("'./origin-probability-patch.js'"),'origin probability runtime is not cached for PWA');
assert.ok(origin.includes('const ORIGIN_TEMPERATURE=3.5'),'calibrated origin temperature missing');
assert.ok(origin.includes('const ORIGIN_CONSENSUS_SCALE=0.005'),'calibrated consensus scale missing');
assert.ok(origin.includes('const ORIGIN_CONSENSUS_CAP=0.5'),'calibrated consensus cap missing');
assert.ok(origin.includes("scope==='france'?s.profiles.filter(r=>isFrenchProfile(r.profile,tax)):s.profiles.slice()"),'France scope is not restricted before normalization');
assert.ok(origin.includes("world=distribution('world',tax),france=distribution('france',tax)"),'World and France distributions are not independently calculated');
assert.ok(origin.includes('WSET_V108.profiles[].unitId -> WSET_V108.units'),'canonical taxonomy source is not exposed');
assert.ok(origin.includes('currentFallbackProfiles'),'taxonomy fallback audit missing');

const sandbox={window:{},console};vm.createContext(sandbox);
vm.runInContext(read('v108.js'),sandbox,{filename:'v108.js'});
vm.runInContext(read('c2c2-data.js'),sandbox,{filename:'c2c2-data.js'});
const V=sandbox.window.WSET_V108,C=sandbox.window.WINE_BLIND_CANDIDATE;
assert.equal(C.profiles.length,203,'C2-C2 profile count changed');
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'").replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
const key=p=>`${norm(p.grape)}::${norm(p.style)}`;
const canonical=new Map(V.profiles.map(p=>[key(p),p]));
const units=new Map(V.units.map(u=>[u.id,u]));
const broken=C.profiles.filter(p=>{const cp=canonical.get(key(p));return !cp?.unitId||!units.has(cp.unitId)});
assert.deepEqual(broken.map(p=>p.profile_id),[],'one or more scored origin profiles lost their canonical unit link');
const france=V.units.filter(u=>u.country==='France');
assert.ok(france.length>0,'canonical French origin universe is empty');
console.log(`Origin V11.5.4 runtime: PASS — ${C.profiles.length} profiles, ${V.units.length} units, ${france.length} French units`);
