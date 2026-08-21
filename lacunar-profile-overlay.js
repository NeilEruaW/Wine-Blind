(()=>{
/* Reviewed multi-source enrichment for eight previously lacunar profiles. */
const C=window.WINE_BLIND_CANDIDATE,A=window.WINE_BLIND_AROMA_CANONICAL;if(!C||!A)return;
const structures={
  'Saperavi':{'Acidité':[4,4.5,5],'Tanins':[4,5,5],'Alcool':[3.5,4,5],'Corps':[4,5,5],'Couleur':[5,5,5]},
  'Duras':{'Acidité':[3,4,4.5],'Tanins':[2.5,4,4.5],'Alcool':[3.5,4,4.5],'Corps':[2.5,3.5,4],'Couleur':[3,4,4.5]},
  'Gros Manseng':{'Acidité':[4.5,5,5],'Tanins':[0,0,0],'Alcool':[3,4.8,5],'Corps':[3,4,4.5],'Couleur':[2,3,4]},
  'Moschofilero':{'Acidité':[4.5,5,5],'Tanins':[0,0,0],'Alcool':[2,3,3.5],'Corps':[1.5,2.5,3],'Couleur':[1,2,2.5]},
  'Poulsard':{'Acidité':[4,5,5],'Tanins':[1,1,2.5],'Alcool':[2.5,3,3.5],'Corps':[1.5,2,2.5],'Couleur':[1,1,2.5]},
  'Négrette':{'Acidité':[2,3.5,3.5],'Tanins':[1.5,3,3],'Alcool':[3.5,4,4.5],'Corps':[2.5,3,4],'Couleur':[3.5,3.5,5]},
  'Romorantin':{'Acidité':[4.5,5,5],'Tanins':[0,0,0],'Alcool':[2.5,3,4],'Corps':[2.5,3,4],'Couleur':[2,3,4]},
  'Trousseau':{'Acidité':[3.5,4.5,5],'Tanins':[2,2.5,4],'Alcool':[3,3.2,4],'Corps':[2,2.5,4],'Couleur':[2.5,3.5,4.5]}
};
for(const p of C.profiles){const spec=structures[p.grape];if(!spec)continue;for(const [axis,[L,center,U]] of Object.entries(spec)){const old=p.structure[axis];if(!old)continue;Object.assign(old,{L,center,U,provenance:`${old.provenance||'C2-C2'} + multi-source lacunar review 2026`})}}
const identityAxis={'Acidité':'acid','Tanins':'tannin','Alcool':'alcohol','Corps':'body','Couleur':'color'};
for(const g of window.WSET_DATA?.grapes||[]){const spec=structures[g.name];if(!spec)continue;for(const [axis,[min,typical,max]] of Object.entries(spec)){const key=identityAxis[axis],old=g.structureProfile?.[key];if(!old)continue;Object.assign(old,{min,typical,max,confidence:'revue multi-source',sourceCoverage:'A'});g[key]=typical}g.intensity=g.structureProfile?.intensity?.typical??g.intensity}
const additions={
  'Saperavi':[['primary','Fruits noirs','Mûre',3],['primary','Fruits noirs','Cassis',2],['primary','Fruits noirs','Prune noire',2],['primary','Fruits noirs','Cerise noire',2],['primary','Fruits rouges','Cerise rouge',1],['primary','Floral','Violette',2],['primary','Épices fortes','Réglisse',2],['tertiary','Vieillissement en bouteille – rouge','Tabac',1],['tertiary','Vieillissement en bouteille – rouge','Terre',1],['tertiary','Vieillissement en bouteille – rouge','Cuir',1]],
  'Duras':[['primary','Fruits rouges','Groseille rouge',2],['primary','Fruits rouges','Cerise rouge',2],['primary','Fruits rouges','Framboise',1],['primary','Fruits noirs','Cassis',2],['primary','Fruits noirs','Mûre',1],['primary','Épices fortes','Poivre noir',3],['primary','Épices fortes','Réglisse',1],['primary','Floral','Violette',1]],
  'Gros Manseng':[['primary','Agrumes','Citron',2],['primary','Agrumes','Pamplemousse',2],['primary','Fruits exotiques','Mangue',2],['primary','Fruits exotiques','Ananas',2],['primary','Fruits exotiques','Fruit de la passion',2],['primary','Fruits à noyau','Pêche',2],['primary','Fruits à noyau','Abricot',2],['primary','Fruits verts','Poire',1],['primary','Fruits verts','Coing',1],['primary','Floral','Chèvrefeuille',1],['primary','Floral','Acacia',1],['tertiary','Vieillissement en bouteille – blanc','Miel',1]],
  'Moschofilero':[['primary','Floral','Rose',3],['primary','Floral','Violette',2],['primary','Agrumes','Citron',2],['primary','Agrumes','Citron vert',1],['primary','Fruits verts','Pomme',2],['primary','Fruits verts','Poire',1],['primary','Fruits verts','Coing',1],['primary','Fruits à noyau','Pêche',1],['primary','Fruits exotiques','Litchi',2]],
  'Poulsard':[['primary','Fruits rouges','Fraise',3],['primary','Fruits rouges','Groseille rouge',3],['primary','Fruits rouges','Framboise',2],['primary','Fruits rouges','Cerise rouge',2],['primary','Fruits rouges','Canneberge',2],['primary','Floral','Rose',1],['primary','Floral','Violette',1],['primary','Épices fortes','Poivre blanc',1],['tertiary','Vieillissement en bouteille – rouge','Terre',1],['tertiary','Vieillissement en bouteille – rouge','Sous-bois',1]],
  'Négrette':[['primary','Floral','Violette',3],['primary','Floral','Rose',1],['primary','Fruits rouges','Framboise',2],['primary','Fruits rouges','Fraise',1],['primary','Fruits noirs','Cassis',2],['primary','Fruits noirs','Mûre',2],['primary','Épices fortes','Réglisse',3],['primary','Épices fortes','Poivre noir',1],['tertiary','Vieillissement en bouteille – rouge','Cuir',1]],
  'Romorantin':[['primary','Fruits verts','Pomme',3],['primary','Fruits verts','Poire',2],['primary','Fruits verts','Coing',2],['primary','Agrumes','Citron',2],['primary','Floral','Acacia',2],['primary','Floral','Chèvrefeuille',1],['primary','Fruits à noyau','Pêche',1],['primary','Fruits à noyau','Abricot',1],['tertiary','Vieillissement en bouteille – blanc','Miel',2],['tertiary','Vieillissement en bouteille – blanc','Fruits à coque',1]],
  'Trousseau':[['primary','Fruits rouges','Cerise rouge',3],['primary','Fruits rouges','Fraise',2],['primary','Fruits rouges','Framboise',2],['primary','Fruits rouges','Canneberge',1],['primary','Épices fortes','Poivre noir',2],['primary','Épices fortes','Poivre blanc',2],['primary','Floral','Violette',1],['tertiary','Vieillissement en bouteille – rouge','Terre',1],['tertiary','Vieillissement en bouteille – rouge','Cuir',1],['tertiary','Vieillissement en bouteille – rouge','Sous-bois',1]]
};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
for(const [grape,rows] of Object.entries(additions)){
  const g=A.grapes.find(x=>x.grape===grape);if(!g)continue;
  for(const [phase,group,label_fr,prevalence] of rows){
    let r=g.relations.find(x=>x.kind==='descriptor'&&x.phase===phase&&norm(x.label_fr)===norm(label_fr));
    if(r){r.prevalence=Math.max(Number(r.prevalence)||1,prevalence);r.status='MULTI_SOURCE_REVIEWED';continue}
    g.relations.push({phase,kind:'descriptor',group,label_fr,prevalence,status:'MULTI_SOURCE_REVIEWED',current_scoring_eligible:true,sources:['WSET_MATRIX','INSTITUTIONAL_VARIETAL_SOURCE','ENCYCLOPEDIC_CROSSCHECK']});
  }
  const groupKeys=new Set(g.relations.filter(x=>x.kind==='descriptor').map(x=>`${x.phase}|${x.group}`));
  for(const k of groupKeys){const [phase,group]=k.split('|');if(g.relations.some(x=>x.kind==='group'&&x.phase===phase&&x.group===group))continue;const prevalence=Math.max(...g.relations.filter(x=>x.kind==='descriptor'&&x.phase===phase&&x.group===group).map(x=>x.prevalence));g.relations.push({phase,kind:'group',group,label_fr:group,prevalence,status:'MULTI_SOURCE_REVIEWED',current_scoring_eligible:true,sources:['MULTI_SOURCE_LACUNAR_REVIEW_2026']})}
}
A.lacunar_profile_overlay={status:'APPLIED',version:'1.0.0',grapes:Object.keys(additions),minimum_descriptor_target:8,method:'institutional source + specialist/encyclopedic cross-check',sources:[
  'https://plantgrape.fr/en/varieties/fruit-varieties/91',
  'https://www.vindefrance.com/cepages-de-france/duras',
  'https://plantgrape.fr/en/varieties/fruit-varieties/124',
  'https://winesofgreece.org/varieties/moschofilero/',
  'https://www.plantgrape.fr/en/varieties/fruit-varieties/226',
  'https://www.vindefrance.com/wines/grape-varieties-of-france/negrette',
  'https://www.vinsdeloire.fr/en/grape-varieties/romorantin',
  'https://www.maisondesvinsdecheverny.fr/en/aoc-cour-cheverny-2/',
  'https://www.plantgrape.fr/en/varieties/fruit-varieties/191',
  'https://plantgrape.fr/en/varieties/fruit-varieties/277'
]};
})();
