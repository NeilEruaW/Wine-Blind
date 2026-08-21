(()=>{
/* Wine Blind V11.5.2 — probabilistic origin Top 10.
   Fine regional profiles remain the scoring units; display candidates are aggregated
   geographically before scope-specific probability normalization. */
const $=s=>document.querySelector(s);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'").trim();
const ORIGIN_TEMPERATURE=12;
const GEO_RULES=[
  {
    label:'Rhône Nord',
    country:'France',
    match:/\b(rhone nord|northern rhone|cote[- ]?rotie|cornas|(?:crozes[- ]?)?hermitage|saint[- ]?joseph|condrieu|chateau[- ]?grillet)\b/
  }
];
function isFrench(p){return /(^|,\s*)France(\s*,|$)/i.test(p?.geography||'')||GEO_RULES.some(r=>r.country==='France'&&r.match.test(norm(`${p?.style||''} ${p?.geography||''}`)))}
function fineLabel(p){return String(p?.style||p?.geography||p?.grape||'').trim()}
function geoGroup(p){
  const text=norm(`${p?.style||''} ${p?.geography||''}`);
  const rule=GEO_RULES.find(r=>r.match.test(text));
  const label=rule?.label||fineLabel(p);
  return {key:norm(label),label,country:rule?.country||(isFrench(p)?'France':'')};
}
function adequacy(r){
  const aromaMass=(r?.ar?.Dg||0)+(r?.ar?.De||0),available=(aromaMass?3.2:0)+(r?.st?.k||0);
  return available?Math.max(0,Math.min(100,((3.2*(r.A||0)+(r.S_eff||0)+(r.C||0))/available)*100)):0;
}
function aggregateGroups(rows){
  const groups=new Map();
  rows.forEach(r=>{
    const g=geoGroup(r.profile),score=adequacy(r),item={...r,_originScore:score,_fineLabel:fineLabel(r.profile)};
    if(!g.label)return;
    let bucket=groups.get(g.key);
    if(!bucket){bucket={...g,candidates:[]};groups.set(g.key,bucket)}
    bucket.candidates.push(item);
  });
  return [...groups.values()].map(g=>{
    const sorted=g.candidates.slice().sort((a,b)=>b._originScore-a._originScore),best=sorted[0];
    const sameGrape=sorted.filter(x=>norm(x.profile?.grape)===norm(best.profile?.grape));
    const support=sameGrape.slice(1,3).reduce((sum,x)=>sum+Math.max(0,x._originScore-50)*0.03,0);
    const consensusBonus=Math.min(3,support);
    return {...g,best,score:Math.min(100,best._originScore+consensusBonus),consensusBonus};
  });
}
function distribution(scope){
  const s=window.__C2_LAST;
  if(!s?.profiles?.length)return [];
  const eligible=scope==='france'?s.profiles.filter(r=>isFrench(r.profile)):s.profiles.slice();
  const groups=aggregateGroups(eligible);
  if(!groups.length)return [];
  const max=Math.max(...groups.map(g=>g.score));
  const weights=groups.map(g=>Math.exp((g.score-max)/ORIGIN_TEMPERATURE));
  const total=weights.reduce((a,b)=>a+b,0)||1;
  return groups.map((g,i)=>({...g,probability:weights[i]/total})).sort((a,b)=>b.probability-a.probability);
}
function pct(p){const x=p*100;return x<10?x.toFixed(1).replace('.',',')+' %':Math.round(x)+' %'}
function rankVisual(i){return i<3?`<span class="rank podium podium-${i+1}" aria-label="Rang ${i+1}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v4c0 3-1.8 5-4 5S8 10 8 7V3Z"/><path d="M8 5H5v2c0 2 1.2 3 3.4 3"/><path d="M16 5h3v2c0 2-1.2 3-3.4 3"/><path d="M12 12v4"/><path d="M9 20h6M10 16h4"/></svg><small>${i+1}</small></span>`:`<span class="rank plain-rank">${i+1}</span>`}
function openBest(g){
  const p=g.best?.profile;if(!p)return;
  const gp=(window.WSET_V108?.profiles||[]).find(x=>x.grape===p.grape&&norm(x.style)===norm(p.style));
  if(gp&&window.WineBlindReference?.openOrigin)return window.WineBlindReference.openOrigin(gp.unitId,p.grape);
  window.WineBlindReference?.openGrape?.(p.grape);
}
function card(g,i){
  const el=document.createElement('div');el.className=`result-card result-rank-${Math.min(i+1,4)} c2-result-card c2-origin-card ${i===0?'is-primary':''}`;el.tabIndex=0;el.setAttribute('role','button');
  const fine=g.best?._fineLabel||'',grape=g.best?.profile?.grape||'',sub=[grape,fine&&norm(fine)!==norm(g.label)?fine:''].filter(Boolean).join(' · '),bar=Math.max(0,Math.min(100,g.probability*100));
  el.innerHTML=`<div class="result-top">${rankVisual(i)}<div><div class="result-name">${g.label}</div><div class="c2-origin-sub">${sub}</div></div><span class="score" title="Probabilité relative dans le périmètre sélectionné">${pct(g.probability)}</span></div><div class="bar"><span style="width:${bar}%"></span></div>`;
  const open=e=>{e?.preventDefault?.();e?.stopPropagation?.();openBest(g)};el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(e)}});return el;
}
function currentScope(){return $('#originScopeSelector [data-origin-scope].active')?.dataset.originScope||window.__WINE_BLIND_ORIGIN_SCOPE||'world'}
function render(){
  const box=$('#originResults'),s=window.__C2_LAST;if(!box||!s?.profiles?.length)return;
  const scope=currentScope(),world=distribution('world'),france=distribution('france'),arr=scope==='france'?france:world;
  window.__WINE_BLIND_ORIGIN_DISTRIBUTIONS={world,france,scope};
  box.replaceChildren(...(arr.length?arr.slice(0,10).map(card):[Object.assign(document.createElement('div'),{className:'empty',textContent:scope==='france'?'Aucune origine française ne correspond aux repères saisis.':'Aucune origine ne correspond aux repères saisis.'})]));
}
function schedule(delay=230){clearTimeout(schedule.t);schedule.t=setTimeout(render,delay)}
$('#originScopeSelector')?.querySelectorAll('[data-origin-scope]').forEach(b=>b.addEventListener('click',()=>schedule(0)));
document.addEventListener('wineblind:diagnostic-input',()=>schedule(240));
['#typeRed','#typeWhite','#resetAll'].forEach(sel=>$(sel)?.addEventListener('click',()=>schedule(240)));
document.querySelector('[data-tab="origin"]')?.addEventListener('click',()=>schedule(0));
schedule(260);
})();