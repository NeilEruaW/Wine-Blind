(()=>{
/* Single grape-level structure source: the identity directory. Regional C2-C2
   profiles remain untouched and are reserved for origin ranking. */
const D=window.WSET_DATA,A=window.WINE_BLIND_AROMA_CANONICAL;if(!D?.grapes?.length)return;
const axisMap={'Acidité':'acid','Tanins':'tannin','Alcool':'alcohol','Corps':'body','Couleur':'color'};
const structureFor=g=>Object.fromEntries(Object.entries(axisMap).map(([axis,key])=>{const r=g.structureProfile?.[key],center=Number(r?.typical??g[key]??0),L=Number(r?.min??center),U=Number(r?.max??center);return[axis,{center,L,U,provenance:'WSET_DATA.structureProfile',sourceCoverage:r?.sourceCoverage||g.sourceCoverage||null}]}));
const relationsFor=name=>(A?.grapes||[]).find(x=>x.grape===name)?.relations||[];
const profiles=D.grapes.map((g,index)=>({profile_id:`canonical:${index+1}`,profile_kind:'CANONICAL_GRAPE',grape:g.name,type:g.type,style:'Profil canonique',geography:'',structure:structureFor(g),relations:relationsFor(g.name),source:'WSET_DATA'}));
window.WineBlindCanonicalProfiles=Object.freeze({version:'1.0.0',profiles,byGrape:new Map(profiles.map(p=>[p.grape,p])),source:'WSET_DATA.grapes.structureProfile'});
})();
