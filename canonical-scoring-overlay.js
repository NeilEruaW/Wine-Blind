(()=>{
const C=window.WINE_BLIND_CANDIDATE,A=window.WINE_BLIND_AROMA_CANONICAL;
if(!C||!A?.approved_relations?.length)return;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases=C.engine.observation_extraction.C2_exact_aliases;
const exactMap=A.policy.exact_normalization||{},strength=A.policy.prevalence_match_strength||{};
const rows=A.approved_relations.map(r=>({...r,exact:exactMap[r.label_fr]||norm(r.label_fr)}));
for(const r of rows){aliases[r.exact]=[...new Set([...(aliases[r.exact]||[]),r.label_fr,r.source_label].filter(Boolean))]}
const grapeDf=new Map();
for(const r of rows){const set=grapeDf.get(r.exact)||new Set();set.add(r.grape);grapeDf.set(r.exact,set)}
for(const [exact,set] of grapeDf){
 if(!C.marker_dictionary.some(m=>m.kind==='exact'&&m.item===exact))C.marker_dictionary.push({marker_id:`exact:${exact}`,kind:'exact',item:exact,df:set.size,sources:['CANONICAL_APPROVED_V1']})
}
for(const p of C.profiles){
 for(const r of rows.filter(x=>x.grape===p.grape)){
  if(p.markers.some(m=>m.marker_id===`exact:${r.exact}`))continue;
  const df=grapeDf.get(r.exact)?.size||1,s=Math.log((C.population.grapes+1)/(df+1))/Math.log(C.population.grapes+1),phi=.35+.65*s;
  const typicality={1:.3,2:.6,3:.9}[r.prevalence]||Number(strength[r.prevalence]||.3);
  p.markers.push({marker_id:`exact:${r.exact}`,kind:'exact',item:r.exact,typicality,context:r.phase==='tertiary'?'TERTIARY_OPTIONAL':'CORE',parent_rule:r.group,parent_resolved:null,df,specificity_s:s,phi,capacity:typicality*phi*1.5,included_in_Mp:r.phase!=='tertiary',sources:['CANONICAL_APPROVED_V1'],tier:r.phase.toUpperCase(),approved_proposal_id:r.proposal_id,absence_is_negative:false});
 }
}
C.population.canonical_markers=C.marker_dictionary.length;
C.population.canonical_exacts=C.marker_dictionary.filter(m=>m.kind==='exact').length;
C.canonical_aroma_overlay={status:'APPLIED',relations:rows.length,mode:'POSITIVE_ONLY',absence_is_negative:false};
})();
