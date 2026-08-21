import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const sandbox={window:{},Math,Number,Object,Map,Set,console};vm.createContext(sandbox);
for(const f of ['c2c2-data.js','c2c2-engine.js','v108.js'])vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
const E=sandbox.window.WineBlindEngine,V=sandbox.window.WSET_V108;
assert.ok(E?.profiles?.length,'C2-C2 profiles missing');assert.ok(V?.profiles?.length,'canonical origin profiles missing');assert.ok(V?.units?.length,'canonical origin units missing');
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'").replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
const pkey=p=>`${norm(p?.grape)}::${norm(p?.style)}`;
const unitById=new Map(V.units.map(u=>[u.id,u])),canonByKey=new Map(V.profiles.map(p=>[pkey(p),p]));
const mapped=E.profiles.map(p=>({p,cp:canonByKey.get(pkey(p))}));
const missing=mapped.filter(x=>!x.cp?.unitId||!unitById.has(x.cp.unitId));
assert.equal(missing.length,0,`unmapped C2-C2 profiles: ${missing.map(x=>x.p.profile_id).join(', ')}`);

function obsFor(profile,mode='full'){
  const markers=(profile.markers||[]).map(m=>({m,kind:String(m.marker_id||'').split(':')[0],item:String(m.marker_id||'').slice(String(m.marker_id||'').indexOf(':')+1)})).filter(x=>['family','signature','exact'].includes(x.kind)&&x.item);
  const ranked=markers.slice().sort((a,b)=>(b.m.capacity||0)-(a.m.capacity||0));
  let keep=ranked;
  if(mode==='partial')keep=ranked.slice(0,Math.min(6,ranked.length));
  if(mode==='structure')keep=[];
  return {structure:Object.fromEntries(Object.entries(profile.structure||{}).map(([k,r])=>[k,r.center])),families:keep.filter(x=>x.kind==='family').map(x=>x.item),signatures:keep.filter(x=>x.kind==='signature').map(x=>x.item),exacts:keep.filter(x=>x.kind==='exact').map(x=>x.item),coherenceTokens:[]};
}
function adequacy(r){const aromaMass=(r?.ar?.Dg||0)+(r?.ar?.De||0),available=(aromaMass?3.2:0)+(r?.st?.k||0);return available?Math.max(0,Math.min(100,((3.2*(r.A||0)+(r.S_eff||0)+(r.C||0))/available)*100)):0}
function originOf(profile){const cp=canonByKey.get(pkey(profile)),u=cp&&unitById.get(cp.unitId);return u?{id:u.id,label:u.label,country:u.country}:null}
function aggregate(rows,bonusScale,bonusCap){const groups=new Map();for(const r of rows){const o=originOf(r.profile);if(!o)continue;const item={...r,score:adequacy(r)};let g=groups.get(o.id);if(!g){g={...o,items:[]};groups.set(o.id,g)}g.items.push(item)}return [...groups.values()].map(g=>{const sorted=g.items.sort((a,b)=>b.score-a.score),best=sorted[0],same=sorted.filter(x=>norm(x.profile.grape)===norm(best.profile.grape)),support=same.slice(1,3).reduce((s,x)=>s+Math.max(0,x.score-50)*bonusScale,0),bonus=Math.min(bonusCap,support);return {...g,score:Math.min(100,best.score+bonus),bonus}})}
function distribution(rows,T,bonusScale,bonusCap){const gs=aggregate(rows,bonusScale,bonusCap),mx=Math.max(...gs.map(g=>g.score)),ws=gs.map(g=>Math.exp((g.score-mx)/T)),tot=ws.reduce((a,b)=>a+b,0)||1;return gs.map((g,i)=>({...g,p:ws[i]/tot})).sort((a,b)=>b.p-a.p)}
function percentile(a,q){if(!a.length)return 0;const s=a.slice().sort((x,y)=>x-y),i=(s.length-1)*q,lo=Math.floor(i),hi=Math.ceil(i);return lo===hi?s[lo]:s[lo]+(s[hi]-s[lo])*(i-lo)}
function evaluate(params,mode){const rows=[];for(const target of E.profiles){const expected=originOf(target),scores=E.score(obsFor(target,mode)).profiles,d=distribution(scores,params.T,params.scale,params.cap),idx=d.findIndex(x=>x.id===expected.id),hit=d[idx],p1=d[0]?.p||0,p2=d[1]?.p||0;rows.push({target,expected,rank:idx+1,p:hit?.p||0,p1,gap:p1-p2,top:d[0]})}const top1=rows.filter(x=>x.rank===1).length/rows.length,top3=rows.filter(x=>x.rank<=3).length/rows.length,top10=rows.filter(x=>x.rank<=10).length/rows.length,expectedP=rows.map(x=>x.p),winnerP=rows.map(x=>x.p1),gaps=rows.filter(x=>x.rank===1).map(x=>x.gap);return {mode,top1,top3,top10,medianExpected:percentile(expectedP,.5),p10Expected:percentile(expectedP,.1),medianWinner:percentile(winnerP,.5),p90Winner:percentile(winnerP,.9),medianGap:percentile(gaps,.5),rows}}
const grid=[];for(const T of [6,8,10,12,14,16,18])for(const scale of [0,.01,.02,.03,.04])for(const cap of [0,1,2,3]){if(scale===0&&cap!==0)continue;if(scale>0&&cap===0)continue;const params={T,scale,cap},full=evaluate(params,'full'),partial=evaluate(params,'partial');const score=4*partial.top1+2*partial.top3+partial.top10+2*full.top1+full.top3-Math.abs(partial.medianWinner-.28)-Math.max(0,partial.p90Winner-.65)*2;grid.push({params,full,partial,score})}
grid.sort((a,b)=>b.score-a.score);console.log('ORIGIN_CALIBRATION_TOP');for(const x of grid.slice(0,12))console.log(JSON.stringify({params:x.params,score:+x.score.toFixed(4),full:{top1:+x.full.top1.toFixed(3),top3:+x.full.top3.toFixed(3),top10:+x.full.top10.toFixed(3),medianExpected:+x.full.medianExpected.toFixed(3),medianWinner:+x.full.medianWinner.toFixed(3),medianGap:+x.full.medianGap.toFixed(3)},partial:{top1:+x.partial.top1.toFixed(3),top3:+x.partial.top3.toFixed(3),top10:+x.partial.top10.toFixed(3),medianExpected:+x.partial.medianExpected.toFixed(3),medianWinner:+x.partial.medianWinner.toFixed(3),p90Winner:+x.partial.p90Winner.toFixed(3),medianGap:+x.partial.medianGap.toFixed(3)}}));
const best=grid[0];assert.ok(best.full.top10>=.95,'perfect identities should almost always retain expected origin in Top 10');assert.ok(best.partial.top10>=.80,'partial identities should retain expected origin in Top 10');
const hard=best.partial.rows.filter(x=>x.rank>1).sort((a,b)=>a.rank-b.rank).slice(0,20).map(x=>({grape:x.target.grape,style:x.target.style,expected:x.expected.label,rank:x.rank,p:+x.p.toFixed(3),winner:x.top?.label,winnerP:+(x.p1||0).toFixed(3)}));console.log('ORIGIN_CALIBRATION_HARD_CASES');console.log(JSON.stringify(hard));
console.log('ORIGIN_CALIBRATION_BEST='+JSON.stringify(best.params));
