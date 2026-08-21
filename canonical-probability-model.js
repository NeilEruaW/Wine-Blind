(()=>{
/* Isolated shadow model. No UI side effect and no public probability flag. */
const C=window.WINE_BLIND_CANDIDATE,A=window.WINE_BLIND_AROMA_CANONICAL;
if(!C?.profiles?.length)return;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const lse=xs=>{const m=Math.max(...xs);return m+Math.log(xs.reduce((s,x)=>s+Math.exp(x-m),0))};
const AXES={Acidite:{source:'Acidité',base:1.5},Tanins:{source:'Tanins',base:1.5},Alcool:{source:'Alcool',base:1.2},Corps:{source:'Corps',base:1.1},Couleur:{source:'Couleur',base:1}};
const PHASE={PRIMARY:1,SECONDARY:.82,TERTIARY:.64,CONTEXTUAL:.55};
const KIND={family:.72,signature:.9,exact:1};
const PREV={1:.38,2:.66,3:.86};
const byGrape=new Map();
for(const p of C.profiles){const rows=byGrape.get(p.grape)||[];rows.push(p);byGrape.set(p.grape,rows)}
const types=new Map((A?.grapes||[]).map(g=>[norm(g.grape),g.type]));
for(const [g,ps] of byGrape)if(!types.has(norm(g)))types.set(norm(g),Number(ps[0].structure?.Tanins?.center)>0?'Rouge':'Blanc');
const eligible=colour=>[...byGrape.keys()].filter(g=>types.get(norm(g))===colour);
const key=(kind,item)=>`${kind==='descriptor'?'exact':kind==='group'?'family':kind}:${norm(item)}`;

function grapeMarkers(grape){
  const out=new Map();
  for(const p of byGrape.get(grape)||[])for(const m of p.markers||[]){
    if(!KIND[m.kind])continue;const k=key(m.kind,m.item),old=out.get(k);
    if(!old||Number(m.typicality||0)>Number(old.typicality||0))out.set(k,{...m,key:k});
  }
  const identity=(A?.grapes||[]).find(g=>norm(g.grape)===norm(grape));
  for(const r of identity?.relations||[]){
    if(!['group','descriptor'].includes(r.kind))continue;
    const kind=r.kind==='group'?'family':'exact',item=r.kind==='group'?r.group:r.label_fr,k=key(kind,item);
    const m={kind,item,key:k,typicality:PREV[r.prevalence]||.38,parent_resolved:r.group,tier:String(r.phase||'').toUpperCase(),source:'canonical-identity'};
    if(!out.has(k)||m.typicality>Number(out.get(k).typicality||0))out.set(k,m);
  }
  return out;
}
const markers=new Map([...byGrape.keys()].map(g=>[g,grapeMarkers(g)]));
function observed(obs={}){
  const rows=[...(obs.families||[]).map(item=>({kind:'family',item})),...(obs.signatures||[]).map(item=>({kind:'signature',item})),...(obs.exacts||[]).map(item=>({kind:'exact',item}))],seen=new Set();
  return rows.map(x=>({...x,key:key(x.kind,x.item)})).filter(x=>x.key.split(':')[1]&&!seen.has(x.key)&&seen.add(x.key));
}
function dfFor(grapes){const df=new Map();for(const g of grapes)for(const k of markers.get(g).keys())df.set(k,(df.get(k)||0)+1);return df}
function phase(m){return PHASE[String(m?.tier||m?.context||'PRIMARY').toUpperCase()]||.72}
function family(m,o){return norm(m?.parent_resolved||m?.parent_rule||m?.item||o.key)}

function aroma(grape,obs,df,N,variant){
  const groups=new Map(),detail=[];
  for(const o of observed(obs)){
    const m=markers.get(grape).get(o.key),freq=df.get(o.key)||0,idf=Math.log((N+1)/(freq+1))/Math.log(N+1),typ=clamp(Number(m?.typicality||.06),.03,.97);
    let w=(KIND[o.kind]||.7)*(.35+.65*idf)*(m?phase(m):.78);
    if(variant==='discriminant-v2')w*=o.kind==='exact'?1.08:o.kind==='family'?.92:1;
    const raw=w*Math.log(typ/.18),f=m?family(m,o):`absent:${o.key}`,rows=groups.get(f)||[];rows.push(raw);groups.set(f,rows);
    detail.push({key:o.key,matched:!!m,df:freq,idf,typicality:typ,weight:w,raw,family:f});
  }
  let log=0;for(const rows of groups.values()){rows.sort((a,b)=>Math.abs(b)-Math.abs(a));rows.forEach((x,i)=>log+=x/Math.sqrt(i+1))}
  return {log,detail};
}
const axisSpecificityCache=new Map();
function axisSpecificity(profile,axis,colour){
  const cacheKey=`${profile.profile_id}|${axis.source}|${colour}`;if(axisSpecificityCache.has(cacheKey))return axisSpecificityCache.get(cacheKey);
  const r=profile.structure?.[axis.source],grapes=eligible(colour);if(!r||!grapes.length)return 0;
  let compatible=0;
  for(const g of grapes)if((byGrape.get(g)||[]).some(p=>{const q=p.structure?.[axis.source];return q&&Number(q.U)>=Number(r.L)&&Number(q.L)<=Number(r.U)}))compatible++;
  const value=Math.log((grapes.length+1)/(compatible+1))/Math.log(grapes.length+1);axisSpecificityCache.set(cacheKey,value);return value;
}
function structure(profile,input={},colour,variant){
  let log=0;const detail=[];
  for(const [raw,value] of Object.entries(input)){
    const name=Object.keys(AXES).find(x=>norm(x)===norm(raw));if(!name||!Number.isFinite(Number(value)))continue;
    const axis=AXES[name],r=profile.structure?.[axis.source];if(!r)continue;
    const discriminant=variant==='discriminant-v2'||variant==='structure-v3',specificity=axisSpecificity(profile,axis,colour),w=axis.base*(discriminant?(.9+.25*specificity):1),half=Math.max(.45,(Number(r.U)-Number(r.L))/2),x=Number(value),outside=x<r.L?r.L-x:x>r.U?x-r.U:0,center=Math.abs(x-Number(r.center))/half;
    const contribution=-w*(outside?(.55+outside*outside/(2*half*half)):.08*center*center);log+=contribution;detail.push({axis:name,x,L:r.L,U:r.U,specificity,weight:w,contribution});
  }
  return {log,detail};
}
function score(grape,obs,df,N,colour,variant){
  const ar=aroma(grape,obs,df,N,variant),styles=(byGrape.get(grape)||[]).map(profile=>({profile,...structure(profile,obs.structure,colour,variant)})),logs=styles.map(x=>x.log),st=logs.length?lse(logs)-Math.log(logs.length):0;
  return {grape,log_likelihood:ar.log+st,aroma_log_likelihood:ar.log,structure_log_likelihood:st,aroma_detail:ar.detail,style_detail:styles};
}
function distribution(obs={},colour,{variant='baseline'}={}){
  const grapes=eligible(colour);if(!grapes.length)return {status:'unavailable',values:[],top10:[]};
  const df=dfFor(grapes),rows=grapes.map(g=>score(g,obs,df,grapes.length,colour,variant)),den=lse(rows.map(x=>x.log_likelihood));
  const values=rows.map(x=>({...x,probability:Math.exp(x.log_likelihood-den)})).sort((a,b)=>b.probability-a.probability||a.grape.localeCompare(b.grape)),top10=values.slice(0,10),mass=top10.reduce((s,x)=>s+x.probability,0);
  return {status:'shadow',variant,colour,values,top10,top10_probability:mass,unshown_probability:1-mass,display_policy:'TOP_10_ONLY_NOT_RENORMALIZED'};
}
window.WineBlindCanonicalProbability=Object.freeze({distribution,eligible,observed,axisSpecificity,markers});
})();
