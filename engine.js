
(function(global){
'use strict';
const AXIS_MAP={acidite:'Acidité',tanins:'Tanins',alcool:'Alcool',corps:'Corps',couleur:'Couleur'};
const AXIS_W={'Acidité':1.5,'Tanins':1.5,'Alcool':1.2,'Corps':1.1,'Couleur':1.0};
const FULL_W=6.3, KERNEL=.82, AROMA_MULT=3.2;
const WOOD=new Set(['vanilla','toast','coffee','chocolate','fumé','cèdre','vanille','café','chocolat']);
const MLF=new Set(['butter','crème','lactique','yaourt','beurre']);
const RIPE=new Set(['confituré','fruits séchés','raisin sec','figue','fruit cuit']);
const FRESH=new Set(['pomme verte','lemon','lime','grapefruit','citron','citron vert','pamplemousse','grass','herbe','feuillu','poivron vert']);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function structScore(profile,input){let num=0,den=0,obs=0;for(const [ik,pk] of Object.entries(AXIS_MAP)){const x=input.structure?.[ik];if(x==null)continue;const ref=profile.structure[pk];if(!ref)continue;const w=AXIS_W[pk];const d=Math.max(ref.L-x,0,x-ref.U);const sim=Math.pow(KERNEL,d);num+=w*sim;den+=w;obs+=w;}const S=den?num/den:0;const kappa=obs/FULL_W;return {S,kappa,S_eff:S*kappa};}
function aromaScore(profile,input,opts={}){const fam=new Set(input.families||[]),sig=new Set(input.signatures||[]),ex=new Set(input.exacts||[]);const generic=[];const exact=[];const markerByItem=new Map(profile.markers.map(m=>[m.kind+':'+m.item,m]));
 const observedParents=new Set(); for(const item of ex){for(const m of profile.markers){if(m.kind==='exact'&&m.item===item&&m.parent_resolved)observedParents.add(m.parent_resolved)}}
 let Dg=0,Graw=0; for(const item of fam){let residual=observedParents.has(item)?.35:1;Dg+=1*residual;const m=markerByItem.get('family:'+item);if(m)Graw+=m.capacity*residual} for(const item of sig){let residual=observedParents.has(item)?.35:1;Dg+=1.25*residual;const m=markerByItem.get('signature:'+item);if(m)Graw+=m.capacity*residual}
 const Rg=opts.forceR1?1:(profile.R_generic??1); const G=Rg*Graw;
 let exactObserved=[...ex]; let E=0,De=0;if(!opts.genericOnly){let matched=[];for(const item of exactObserved){const m=markerByItem.get('exact:'+item);if(m){const cap=opts.oldExact?(m.capacity_C2_C1_audit??m.capacity*4/3):m.capacity;matched.push(cap)}}matched.sort((a,b)=>b-a);matched.forEach((e,i)=>{E+=opts.oldExact?e:e/Math.sqrt(i+1)});if(opts.oldExact){De=exactObserved.length*2}else{De=exactObserved.reduce((s,_,i)=>s+1.5/Math.sqrt(i+1),0)}}
 const D=Dg+De; return {A:D?clamp((G+E)/D,0,1):0,G,E,D,Rg,exactCount:exactObserved.length};}
 function coherence(profile,input,st,ar){let C=0,rules=[];const ex=new Set([...(input.exacts||[]),...(input.coherence||[])]);const sumCap=(set)=>{let s=0;for(const m of profile.markers){if(m.kind==='exact'&&set.has(m.item)&&ex.has(m.item))s+=m.capacity}return s};
  const woodEv=sumCap(WOOD);if(woodEv>=1&&profile.native_wood>=1){C+=.02*Math.min(1,woodEv);rules.push('C2-C1+')}
  const mlfEv=sumCap(MLF);if(mlfEv>=1&&profile.explicit_MLF){C+=.02*Math.min(1,mlfEv);rules.push('C2-C2+')}
  const vals=input.structure||{};const enough=Object.values(vals).filter(v=>v!=null).length>=2 && st.kappa>=.25;
  if(enough){const ripe=[...RIPE].filter(x=>ex.has(x));if(ripe.length){const ev=Math.min(1,ripe.length*.6);const freshLight=[vals.acidite>=4,vals.alcool<=2.5,vals.corps<=2.5].filter(Boolean).length;const ripeFull=[vals.acidite<=3,vals.alcool>=4,vals.corps>=4].filter(Boolean).length;if(freshLight>=2){C-=.04*ev;rules.push('C2-C3-')}else if(ripeFull>=2){C+=.02*ev;rules.push('C2-C3+')}}
   const fresh=[...FRESH].filter(x=>ex.has(x));if(fresh.length){const ev=Math.min(1,fresh.length*.6);const ripeFull=[vals.acidite<=2.5,vals.alcool>=4,vals.corps>=4].filter(Boolean).length;const freshLight=[vals.acidite>=4,vals.alcool<=3,vals.corps<=3].filter(Boolean).length;if(ripeFull>=2){C-=.04*ev;rules.push('C2-C4-')}else if(freshLight>=2){C+=.02*ev;rules.push('C2-C4+')}}}
  return {C:clamp(C,-.08,.04),rules};}
 function scoreProfile(profile,input,opts={}){const st=structScore(profile,input);const ar=aromaScore(profile,input,opts);const co=opts.noCoherence?{C:0,rules:[]}:coherence(profile,input,st,ar);return {...st,...ar,...co,I:AROMA_MULT*ar.A+st.S_eff+co.C};}
 function rank(model,input,opts={}){const best=new Map();for(const p of model.profiles){const s=scoreProfile(p,input,opts);const prev=best.get(p.grape);if(!prev||s.I>prev.score.I||(s.I===prev.score.I&&s.S_eff>prev.score.S_eff))best.set(p.grape,{grape:p.grape,profile:p,score:s})}return [...best.values()].sort((a,b)=>b.score.I-a.score.I||b.score.S_eff-a.score.S_eff||a.grape.localeCompare(b.grape));}
 global.WineBlindEngine={rank,scoreProfile,structScore,aromaScore,coherence};
})(window);
