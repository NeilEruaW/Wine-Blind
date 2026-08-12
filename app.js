(()=>{const D=WSET_DATA,T=WSET_TREE,V=window.WSET_V106||{grapeAppellations:{},appellations:[],blends:[]},G=window.WSET_V107||{regions:[],profiles:[],children:[]},G8=window.WSET_V108||{units:[],profiles:[],children:[],specificity:{},rankWeights:[1,.75,.55,.35,.2,.12,.08,.05,.03,.02]},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const S={type:"Rouge",blend:null,g:{acid:"",tannin:"",alcohol:"",body:"",color:"",intensity:"",fruit:"",signature:"",texture:""},o:{climate:"",maturity:"",oak:"",marker:""},gr:[],or:[],tree:{answers:[],current:null,done:false,extended:false,prefillKeys:[]},compare:new Set(),refFilter:"all",refMode:"grapes",refCountry:"all"};
const L={acid:"Acidité",tannin:"Tanins",alcohol:"Alcool",body:"Corps",color:"Couleur",intensity:"Intensité",fruit:"Fruit",signature:"Signature",texture:"Texture"},sat=["F","M-","M","M+","E"],lev=v=>({"F":1,"M-":2,"M":3,"M+":4,"E":5}[v]||0),cmp=d=>d<=.01?1:d<=.5?.92:d<=1?.82:d<=1.5?.65:d<=2?.42:d<=2.5?.2:.05,has=(a,b)=>(a||"").toLowerCase().includes((b||"").toLowerCase());
function wineTheme(){document.body.classList.toggle("wine-white",S.type==="Blanc");document.body.classList.toggle("wine-red",S.type==="Rouge");let m=document.querySelector('meta[name="theme-color"]');if(m)m.content=S.type==="Blanc"?"#9a6b16":"#7c2d3f"}
function satField(k,l){
 let w=document.createElement("div");w.className="sat-field"+(S.g[k]?" is-set":"");
 w.innerHTML=`<div class="sat-head"><div class="sat-label">${l}</div><div class="sat-value">${S.g[k]||"Non renseigné"}</div></div>`;
 let track=document.createElement("div");track.className="sat-continuum";track.setAttribute("role","slider");track.setAttribute("aria-label",l);track.setAttribute("aria-valuemin","1");track.setAttribute("aria-valuemax","5");track.setAttribute("aria-valuetext",S.g[k]||"Non renseigné");
 let buttons=[];
 const magnify=v=>{let idx=sat.indexOf(v);buttons.forEach((b,i)=>{b.classList.toggle("active",i===idx);b.classList.toggle("near",idx>=0&&Math.abs(i-idx)===1);b.classList.toggle("far",idx>=0&&Math.abs(i-idx)>1)})};
 sat.forEach(v=>{let x=document.createElement("button");x.type="button";x.className="sat-point";x.textContent="";x.dataset.value=v;x.setAttribute("aria-label",v);track.append(x);buttons.push(x)});
 magnify(S.g[k]);
 let dragging=false,moved=false,startX=0,startValue="",pending="";
 const paint=v=>{pending=v;magnify(v);w.classList.toggle("is-set",!!v);w.querySelector(".sat-value").textContent=v||"Non renseigné"};
 const fromX=x=>{let r=track.getBoundingClientRect(),p=Math.max(0,Math.min(.999,(x-r.left)/r.width)),i=Math.min(4,Math.floor(p*5));return sat[i]};
 track.addEventListener("pointerdown",e=>{dragging=true;moved=false;startX=e.clientX;startValue=S.g[k];track.setPointerCapture(e.pointerId);paint(fromX(e.clientX));e.preventDefault()});
 track.addEventListener("pointermove",e=>{if(!dragging)return;if(Math.abs(e.clientX-startX)>5)moved=true;paint(fromX(e.clientX));e.preventDefault()});
 track.addEventListener("pointerup",e=>{if(!dragging)return;dragging=false;let chosen=pending;if(!moved&&startValue===chosen)chosen="";S.g[k]=chosen;forms();calc();e.preventDefault()});
 track.addEventListener("pointercancel",()=>{dragging=false;forms()});
 w.append(track);return w
}
function sel(k,l,opts,target){let w=document.createElement("div");w.className="field",a=document.createElement("label"),s=document.createElement("select");a.textContent=l;opts.forEach(v=>{let o=document.createElement("option");o.value=v;o.textContent=v||"Non renseigné";s.append(o)});s.value=S[target][k];s.onchange=()=>{S[target][k]=s.value;calc()};w.append(a,s);return w}
function choiceRail(k,l,opts,target,hint){
 let vals=opts.filter(v=>v!=="");let w=document.createElement("div");w.className="choice-field";
 w.innerHTML=`<div class="sat-head"><div><div class="sat-label">${l}</div><div class="rail-hint">${hint||""}</div></div><div class="sat-value">${S[target][k]||"Non renseigné"}</div></div>`;
 let track=document.createElement("div");track.className="choice-rail";track.style.setProperty("--count",vals.length);
 let pts=[],drag=false,moved=false,startX=0,startValue="",pending="";
 const short=v=>({"Fruits rouges":"Rouges","Fruits noirs":"Noirs","Fruits à pépins":"Pépins","Fruits à noyau":"Noyau","Raisin / muscaté":"Raisin","Bois discret / neutre":"Discret","Fin / soyeux":"Soyeux","Tendu / linéaire":"Tendu","Ferme / structuré":"Ferme","Ample / onctueux":"Ample","Boisé / MLF":"Boisé","Non détecté":"Non dét.","Très mûr / séché":"Très mûr"}[v]||v);
 vals.forEach(v=>{let b=document.createElement("button");b.type="button";b.className="choice-point"+(S[target][k]===v?" active":"");b.dataset.value=v;b.innerHTML=`<span></span><em>${short(v)}</em>`;track.append(b);pts.push(b)});
 const paint=v=>{pending=v;pts.forEach(b=>b.classList.toggle("active",b.dataset.value===v));w.querySelector(".sat-value").textContent=v||"Non renseigné"};
 const fromX=x=>{let r=track.getBoundingClientRect(),p=Math.max(0,Math.min(.999,(x-r.left)/r.width)),i=Math.min(vals.length-1,Math.floor(p*vals.length));return vals[i]};
 track.addEventListener("pointerdown",e=>{drag=true;moved=false;startX=e.clientX;startValue=S[target][k];track.setPointerCapture(e.pointerId);paint(fromX(e.clientX));e.preventDefault()});
 track.addEventListener("pointermove",e=>{if(!drag)return;if(Math.abs(e.clientX-startX)>5)moved=true;paint(fromX(e.clientX));e.preventDefault()});
 track.addEventListener("pointerup",e=>{if(!drag)return;drag=false;let v=pending;if(!moved&&startValue===v)v="";S[target][k]=v;forms();calc();e.preventDefault()});
 track.addEventListener("pointercancel",()=>{drag=false;forms()});
 w.append(track);return w
}
function forms(){let a=$("#structureFields");a.innerHTML="";let last="";[["ŒIL","color","Couleur / intensité"],["NEZ","intensity","Intensité aromatique"],["BOUCHE","acid","Acidité"],["BOUCHE","tannin","Tanins"],["BOUCHE","body","Corps"],["BOUCHE","alcohol","Alcool"]].forEach(x=>{if(x[1]==="tannin"&&S.type==="Blanc")return;if(x[0]!==last){let h=document.createElement("div");h.className="sense-label";let ico=x[0]==="ŒIL"?'<svg viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.7"/></svg>':x[0]==="NEZ"?'<svg viewBox="0 0 24 24"><path d="M13 3c-1 4-1 7 1 10 1.5 2.2.5 4-2 4h-2"/><path d="M9 20c2 1 4 1 6 0"/></svg>':'<svg viewBox="0 0 24 24"><path d="M4 12c2.5 4 5 6 8 6s5.5-2 8-6c-3 1-5.7 1-8 0-2.3 1-5 1-8 0Z"/><path d="M7 11c3-1.8 7-1.8 10 0"/></svg>';h.innerHTML=ico+'<span>'+x[0]+'</span>';a.append(h);last=x[0]}a.append(satField(x[1],x[2]))});let m=$("#markerFields");m.innerHTML="";m.append(choiceRail("fruit","Famille de fruit",D.options.fruit,"g",""));m.append(choiceRail("texture","Texture / élevage",["","Bois discret / neutre","Fin / soyeux","Tendu / linéaire","Ferme / structuré","Ample / onctueux","Boisé / MLF"],"g",""));m.append(sel("signature","Marqueur signature",D.options.signature,"g"));let f=$("#originFields");f.innerHTML="";f.append(choiceRail("climate","Climat perçu",D.options.climate,"o",""));f.append(choiceRail("maturity","Maturité du fruit",D.options.maturity,"o",""));f.append(choiceRail("oak","Bois",D.options.oak,"o",""));f.append(sel("marker","Marqueur dominant",D.options.originMarker,"o"))}
function geval(g){if(g.type!==S.type)return{score:0,reasons:[]};let w=D.weights.grape,n=0,d=0,c=0,r=[];[["acid","acid",w.acid],["tannin","tannin",w.tannin],["alcohol","alcohol",w.alcohol],["body","body",w.body],["color","color",w.color],["intensity","intensity",w.intensity]].forEach(([sk,gk,wt])=>{if(sk==="tannin"&&S.type==="Blanc")return;let o=lev(S.g[sk]);if(!o)return;let q=Number(g[gk]);if(!Number.isFinite(q))return;let z=Math.abs(q-o);n+=wt*5*cmp(z);d+=wt*5;if(z<=.5)r.push({t:L[sk]+" très cohérent",w:0});else if(z>=2){r.push({t:L[sk]+" en tension",w:1});if(["acid","tannin","alcohol","body"].includes(sk))c++}});[["fruit","fruitCompatible",w.fruit,.3],["signature","signaturesCompatible",w.signature,.1],["texture","textureCompatible",w.texture,.3]].forEach(([sk,gk,wt,res])=>{let o=S.g[sk];if(!o)return;let hit=has(g[gk],o);n+=wt*5*(hit?1:res);d+=wt*5;if(hit)r.push({t:L[sk]+" compatible",w:0});else if(sk==="signature")r.push({t:"Signature non typique",w:1})});if(!d)return{score:0,reasons:[]};let s=n/d*100;if(c>=4)s*=.65;else if(c===3)s*=.8;return{score:s,reasons:r}}
function ofit(o){let w=D.weights.origin,n=0,d=0,c=0;[["acid","acid",w.acid],["tannin","tannin",w.tannin],["alcohol","alcohol",w.alcohol],["body","body",w.body],["color","color",w.color]].forEach(([sk,ok,wt])=>{if(sk==="tannin"&&S.type==="Blanc")return;let a=lev(S.g[sk]);if(!a)return;let q=Number(o[ok]);if(!Number.isFinite(q))return;let z=Math.abs(q-a);n+=wt*5*cmp(z);d+=wt*5;if(["acid","tannin","alcohol","body"].includes(sk)&&z>=2)c++});[["climate","climate",w.climate,{"Frais":1,"Tempéré":2,"Chaud":3}],["maturity","maturity",w.maturity,{"Frais":1,"Mûr":2,"Très mûr / séché":3}]].forEach(([sk,ok,wt,map])=>{let v=S.o[sk];if(!v)return;let a=map[v],q=Number(o[ok]);if(!a||!Number.isFinite(q))return;let z=Math.abs(q-a);n+=wt*5*(z===0?1:z===1?.82:.5);d+=wt*5});
 if(S.o.oak){let q=Number(o.oak);if(Number.isFinite(q)){let oc;if(S.o.oak==="Non détecté")oc=q<=1?.85:q===2?.35:.10;else{let a={"Faible":1,"Modéré":2,"Marqué":3}[S.o.oak],z=Math.abs(q-a);oc=z===0?1:z===1?.82:.5}n+=w.oak*5*oc;d+=w.oak*5}};if(S.o.marker){n+=w.marker*5*(o.marker===S.o.marker?1:.35);d+=w.marker*5}if(!d)return 0;let s=n/d*100;if(c>=4)s*=.65;else if(c===3)s*=.8;return s}
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nt=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
function detectBlend(){if(!S.gr.length)return null;let scores=new Map(S.gr.map((g,i)=>[g.name,{s:g.score,r:i+1}])),best=null;(V.blends||[]).filter(b=>b.type===S.type).forEach(b=>{let hits=b.grapes.filter(g=>scores.has(g)),prim=b.primary.filter(g=>scores.has(g));if(hits.length<2||!prim.length)return;let avg=hits.reduce((a,g)=>a+scores.get(g).s,0)/hits.length,coverage=hits.length/Math.min(4,b.grapes.length),primaryBoost=prim.some(g=>scores.get(g).r<=3)?10:0,score=avg*.72+coverage*18+primaryBoost;if(!best||score>best.score)best={...b,score,hits}});return best&&best.score>=62?best:null}

function childCompatibility(a,o){
 let score=0,hay=nt((a.grapes||"")+" "+(a.blend||"")),g=nt(o.grape);
 if(g&&hay.includes(g))score+=55;
 if(a.confidence&&nt(a.confidence).includes("tres"))score+=12;else if(a.confidence)score+=7;
 let lvl=nt(a.level);if(lvl.includes("appellation"))score+=8;if(lvl.includes("igp"))score+=4;
 if(S.blend&&S.blend.grapes.some(x=>hay.includes(nt(x))))score+=10;
 return score
}
function appsForOrigin(o,limit=3){
 return (G8.children||[]).filter(a=>a.unitId===o.unitId&&nt(a.label)!==nt(o.style))
   .map(a=>({...a,_s:childCompatibility(a,o)})).filter(a=>a._s>=42)
   .sort((a,b)=>b._s-a._s||String(a.label).localeCompare(String(b.label),'fr')).slice(0,limit)
}
function groupedChildren(o){
 let arr=(G8.children||[]).filter(a=>a.unitId===o.unitId&&nt(a.label)!==nt(o.style))
   .map(a=>({...a,_s:childCompatibility(a,o)})).filter(a=>a._s>=42)
   .sort((a,b)=>b._s-a._s||String(a.label).localeCompare(String(b.label),'fr'));
 let sub=arr.filter(a=>/région|region|zone|gi/i.test(a.level)&&!/appellation/i.test(a.level));
 let apps=arr.filter(a=>!sub.includes(a));return{subregions:sub,appellations:apps}
}
function blendForOrigin(o){
 if(!S.blend)return null;let hay=nt(o.style+" "+o.mother+" "+o.country),b=nt(S.blend.region+" "+S.blend.country);
 return S.blend.grapes.includes(o.grape)&&(b.split(" ").filter(x=>x.length>4).some(x=>hay.includes(x))||nt(S.blend.country)&&hay.includes(nt(S.blend.country)))?S.blend:null
}
function contextToolsVisibility(){
 let c=$("#contextTools");if(!c)return;
 let visible=!$("#blendInsight").classList.contains("hidden")||!$("#nextCheck").classList.contains("hidden");
 c.classList.toggle("hidden",!visible)
}
function blendRender(){
 let e=$("#blendInsight");if(!e)return;S.blend=detectBlend();
 if(!S.blend){e.classList.add("hidden");e.innerHTML="";contextToolsVisibility();return}
 e.classList.remove("hidden");
 e.innerHTML=`<span class="pill-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4c4 2 6 5 5 9-1 4-4 6-8 7"/><path d="M17 4c-4 2-6 5-5 9 1 4 4 6 8 7"/></svg></span><span><small>Assemblage</small><b>${esc(S.blend.name)}</b></span>`;
 e.onclick=()=>{let top=S.gr.find(g=>S.blend.grapes.includes(g.name));if(top)showG(top)};
 contextToolsVisibility()
}
function calc(){
 S.gr=D.grapes.map(g=>({...g,...geval(g)})).filter(g=>g.type===S.type&&g.score>0).sort((a,b)=>b.score-a.score).slice(0,10);
 S.blend=detectBlend();
 let map=new Map(S.gr.map((g,i)=>[g.name,{score:g.score,rank:i+1,rankWeight:(G8.rankWeights||[])[i]??.02}])),w=D.weights.origin;
 let scored=(G8.profiles||[]).filter(p=>map.has(p.grape)).map(p=>{
   let prior=map.get(p.grape),fit=ofit(p),spec=Number(p.specificity||1),adjustedPrior=prior.score*prior.rankWeight*spec;
   let blendBonus=S.blend&&S.blend.grapes.includes(p.grape)?2.5:0;
   return{...p,grapeScore:prior.score,grapeRank:prior.rank,rankWeight:prior.rankWeight,specificity:spec,adjustedPrior,fit,
     score:Math.min(100,w.grapePrior*adjustedPrior+w.styleFit*fit+blendBonus)}
 });
 let byUnit=new Map();
 scored.forEach(p=>{if(!p.unitId)return;let old=byUnit.get(p.unitId);if(!old||p.score>old.score)byUnit.set(p.unitId,p)});
 S.or=[...byUnit.entries()].map(([unitId,p])=>{
   let u=(G8.units||[]).find(x=>x.id===unitId)||{};
   return{...p,profileStyle:p.style,unitId,originId:unitId,style:u.label||p.unitLabel||p.regionLabel,
     country:u.country||p.country,mother:u.mother||p.mother,subregion:u.subregion||"",
     region:u.country||p.country,regionGrapes:(u.grapes||[]).join?u.grapes.join("; "):u.grapes||"",childCount:(G8.children||[]).filter(a=>a.unitId===unitId).length}
 }).sort((a,b)=>b.score-a.score).slice(0,10);
 results();inherited()
}
function reasons(r){r=(r||[]).slice(0,4);return r.length?`<div class="reason-box"><div class="reason-chips">${r.map(x=>`<span class="reason-chip ${x.w?"warn":""}">${x.t}</span>`).join("")}</div></div>`:""}
function card(x,i,orig){
 let e=document.createElement("div");e.className=`result-card result-rank-${Math.min(i+1,4)} ${!orig&&i===0?"top-candidate":""}`;
 let apps=orig?appsForOrigin(x,3):[],appHtml=orig&&apps.length?`<div class="app-chips">${apps.map(a=>`<span>${esc(a.name)}</span>`).join("")}</div>`:"";
 let compareIcon=!orig?`<button class="compare-icon ${S.compare.has(x.name)?"active":""}" type="button" aria-label="${S.compare.has(x.name)?"Retirer de la comparaison":"Ajouter à la comparaison"}" title="Comparer"><svg viewBox="0 0 24 24"><path d="M7 7h11l-3-3"/><path d="m18 7-3 3"/><path d="M17 17H6l3 3"/><path d="m6 17 3-3"/></svg></button>`:"";
 let gap=!orig&&i===0&&S.gr[1]?Math.max(0,Math.round(x.score-S.gr[1].score)):null;
 let gapHtml=gap!==null?`<span class="score-gap" title="Écart avec le 2e">+${gap}</span>`:"";
 let rankVisual=i<3?`<span class="rank podium podium-${i+1}" aria-label="Rang ${i+1}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v4c0 3-1.8 5-4 5S8 10 8 7V3Z"/><path d="M8 5H5v2c0 2 1.2 3 3.4 3"/><path d="M16 5h3v2c0 2-1.2 3-3.4 3"/><path d="M12 12v4"/><path d="M9 20h6M10 16h4"/></svg><small>${i+1}</small></span>`:`<span class="rank plain-rank">${i+1}</span>`;
 e.innerHTML=`<div class="result-top">${rankVisual}<div class="result-main"><div class="result-name">${orig?x.style:x.name}</div>${orig?`<div class="result-origin">${x.grape} · ${x.country}</div>`:""}</div><div class="score-actions"><span class="score">${Math.round(x.score)}</span>${gapHtml}${compareIcon}</div></div><div class="bar"><span style="width:${Math.max(2,Math.min(100,x.score))}%"></span></div><div class="result-meta">${orig?(x.diagnostic||""):(x.keyMarker||"")}</div>${appHtml}${orig?`<div class="reason-box"><div class="reason-chips"><span class="reason-chip">Cépage ${Math.round(x.grapeScore)} · rang ${x.grapeRank||"—"}</span><span class="reason-chip neutral">Style ${Math.round(x.fit)}</span></div></div>`:reasons(x.reasons)}`;
 e.onclick=()=>orig?showO(x):showG(x);
 if(!orig){let b=e.querySelector(".compare-icon");b.onclick=ev=>{ev.stopPropagation();if(S.compare.has(x.name))S.compare.delete(x.name);else{if(S.compare.size>=3){let first=S.compare.values().next().value;S.compare.delete(first)}S.compare.add(x.name)}results()}}
 return e
}
function diagnosticMeta(){
 let keys=S.type==="Rouge"?["color","intensity","acid","tannin","body","alcohol","fruit","signature","texture"]:["color","intensity","acid","body","alcohol","fruit","signature","texture"];
 let filled=keys.filter(k=>S.g[k]).length,ratio=filled/keys.length;
 let label=ratio>=.78?"Élevée":ratio>=.45?"Moyenne":"Faible";
 $("#diagnosticConfidence").textContent=`Confiance ${label.toLowerCase()} · ${filled}/${keys.length}`;
 $("#diagnosticConfidence").className=`confidence-badge conf-${label.toLowerCase()}`;
 $("#completionBar span").style.width=`${Math.round(ratio*100)}%`;
}
function nextCheck(){
 let e=$("#nextCheck");if(S.gr.length<2){e.classList.add("hidden");e.innerHTML="";contextToolsVisibility();return}
 let top=S.gr.slice(0,4),fields=[["color","Couleur / intensité"],["intensity","Intensité aromatique"],["acid","Acidité"],["tannin","Tanins"],["body","Corps"],["alcohol","Alcool"]];
 let best=null;
 fields.forEach(([k,l])=>{if(k==="tannin"&&S.type==="Blanc")return;let vals=top.map(g=>Number(g[k])).filter(Number.isFinite);if(vals.length<2)return;let spread=Math.max(...vals)-Math.min(...vals),unfilled=!S.g[k];let utility=spread*(unfilled?1.45:.65);if(!best||utility>best.u)best={k,l,u:utility,spread,unfilled}});
 if(!best||best.spread<.6){e.classList.add("hidden");e.innerHTML="";contextToolsVisibility();return}
 e.classList.remove("hidden");
 e.innerHTML=`<span class="pill-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/><path d="M8 11h6"/></svg></span><span><small>À vérifier</small><b>${best.l}</b></span>`;
 e.onclick=()=>{let field=[...document.querySelectorAll(".sat-field")].find(x=>x.querySelector(".sat-label")?.textContent===best.l);field?.scrollIntoView({behavior:"smooth",block:"center"});field?.classList.add("attention");setTimeout(()=>field?.classList.remove("attention"),900)};
 contextToolsVisibility()
}
function compareRender(){
 let panel=$("#comparePanel"),arr=S.gr.filter(g=>S.compare.has(g.name)).slice(0,3);
 if(arr.length<2){panel.classList.add("hidden");panel.innerHTML="";return}
 let fields=[["acid","Acidité"],["tannin","Tanins"],["alcohol","Alcool"],["body","Corps"],["color","Couleur"],["intensity","Intensité"]];
 let rows=fields.filter(([k])=>!(k==="tannin"&&S.type==="Blanc")).map(([k,l])=>`<tr><th>${l}</th>${arr.map(g=>`<td>${g[k]??"—"}</td>`).join("")}</tr>`).join("");
 panel.classList.remove("hidden");
 panel.innerHTML=`<div class="compare-head"><div><b>Comparaison automatique</b><small>${arr.length} candidats sélectionnés</small></div><button id="closeCompare" class="close-mini" aria-label="Fermer">×</button></div><div class="compare-scroll"><table><thead><tr><th></th>${arr.map(g=>`<th>${g.name}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div><p class="compare-tip">Les écarts structurels les plus nets sont les plus discriminants.</p>`;
 $("#closeCompare").onclick=()=>{S.compare.clear();results()}
}
function results(){
 let a=$("#grapeResults");a.innerHTML=S.gr.length?"":'<div class="empty">Renseigne au moins un critère.</div>';
 S.gr.forEach((x,i)=>a.append(card(x,i,0)));
 $("#grapeCount").textContent=S.gr.length?S.gr.length+" candidats":"";
 diagnosticMeta();nextCheck();blendRender();compareRender();
 let b=$("#originResults");b.innerHTML=S.or.length?"":'<div class="empty">Le Top 10 apparaît après le diagnostic cépage.</div>';
 S.or.forEach((x,i)=>b.append(card(x,i,1)))
}
function inherited(){let e=$("#inheritedSummary");e.innerHTML="";[["Acidité","acid"],["Tanins","tannin"],["Alcool","alcohol"],["Corps","body"],["Couleur","color"]].forEach(([l,k])=>{if(k==="tannin"&&S.type==="Blanc"||!S.g[k])return;let p=document.createElement("span");p.className="pill";p.textContent=l+" · "+S.g[k];e.append(p)});if(S.gr[0]){let p=document.createElement("span");p.className="pill";p.textContent="Top 1 · "+S.gr[0].name;e.append(p)}}
const metricLevel=v=>{let n=Number(v);if(!Number.isFinite(n)||n<=0)return 0;return Math.max(1,Math.min(5,Math.round(n)))};
const met=(l,v,colored=false)=>`<div class="metric ${colored?`metric-level-${metricLevel(v)}`:""}"><b>${v??"—"}</b><span>${l}</span></div>`,blk=(l,v)=>v?`<div class="detail-block"><b>${l}</b><p>${v}</p></div>`:"";
function productionHTML(g){
 let groups=g.productionWorld||{},keys=Object.keys(groups);if(!keys.length)return "";
 const countryName=k=>({
   "France":"France","Italie":"Italie","Espagne":"Espagne","Portugal":"Portugal","Allemagne":"Allemagne",
   "Autriche":"Autriche","Europe centrale / orientale":"Europe centrale / orientale","États-Unis":"États-Unis",
   "Canada":"Canada","Argentine":"Argentine","Chili":"Chili","Afrique du Sud":"Afrique du Sud",
   "Australie":"Australie","Nouvelle-Zélande":"Nouvelle-Zélande","Chine / Asie":"Chine / Asie",
   "Autres régions":"Autres régions"
 }[k]||k);
 const parts=keys.map(k=>{
   let vals=(groups[k]||[]).filter(Boolean);
   let country=countryName(k);
   if(!vals.length)return country;
   let cleaned=vals.filter(v=>v.toLowerCase()!==country.toLowerCase() && !["nz","australie","chili","allemagne","argentine","canada","portugal"].includes(v.toLowerCase()));
   return cleaned.length?`${country} (${cleaned.join(", ")})`:country;
 });
 return `<div class="detail-block"><b>Régions de production</b><p class="production-line">${parts.join(", ")}</p></div>`;
}
function appGroupHTML(title,arr){
 if(!arr||!arr.length)return"";
 let shown=arr.slice(0,9),rest=arr.length-shown.length;
 return `<div class="app-subgroup"><span class="app-subtitle">${title}</span><div class="detail-apps">${shown.map(a=>`<span>${esc(a.name)}${a.country?` <em>${esc(a.country)}</em>`:""}</span>`).join("")}</div>${rest>0?`<details class="more-apps"><summary>Voir ${rest} autres</summary><div class="detail-apps">${arr.slice(9).map(a=>`<span>${esc(a.name)}${a.country?` <em>${esc(a.country)}</em>`:""}</span>`).join("")}</div></details>`:""}</div>`;
}
function grapeAppsHTML(g){
 let groups=V.grapeAppellations&&V.grapeAppellations[g.name];if(!groups)return"";
 let mono=groups.mono||[],blend=groups.blend||[];if(!mono.length&&!blend.length)return"";
 return `<div class="detail-block"><b>Appellations & zones clés</b>${appGroupHTML("Monocépage",mono)}${appGroupHTML("Assemblages",blend)}</div>`;
}
function grapeBlendsHTML(g){let arr=(V.blends||[]).filter(b=>b.grapes.includes(g.name)).slice(0,8);if(!arr.length)return"";return`<div class="detail-block"><b>Associations à connaître</b><div class="detail-apps blend-chips">${arr.map(b=>`<span title="${esc(b.logic)}">${esc(b.name)}</span>`).join("")}</div></div>`}
function grapeOriginLinksHTML(g){
 let us=(G8.units||[]).filter(u=>(u.grapes||[]).includes(g.name)).sort((a,b)=>a.country.localeCompare(b.country,"fr")||a.label.localeCompare(b.label,"fr"));
 if(!us.length)return"";
 return `<div class="detail-block"><b>Origines diagnostiques</b><div class="origin-link-list">${us.slice(0,16).map(u=>`<button class="origin-link" data-unit="${u.id}"><span>${esc(u.label)}</span><small>${esc(u.country)}</small></button>`).join("")}</div></div>`
}
function wireOriginLinks(){document.querySelectorAll(".origin-link").forEach(b=>b.onclick=()=>{let u=(G8.units||[]).find(x=>x.id===b.dataset.unit);if(u)showOriginReference(u)})}
function showG(g){let f=favs(),sig=g.keyMarker||g.differentiation||"";$("#detailType").textContent=g.type+" · Cépage";$("#detailTitle").textContent=g.name;$("#detailBody").innerHTML=`<button id="detailFav" class="favorite-detail ${f.has(g.name)?"active":""}">${f.has(g.name)?"♥ À réviser":"♡ Ajouter à réviser"}</button><div class="identity-signature"><span>SIGNATURE AVEUGLE</span><strong>${sig}</strong></div><div class="detail-grid">${met("Acidité",g.acid,true)}${g.type==="Rouge"?met("Tanins",g.tannin,true):""}${met("Alcool",g.alcohol,true)}${met("Corps",g.body,true)}${met("Couleur",g.color,true)}${met("Intensité",g.intensity,true)}</div>${blk("Arômes & marqueurs",g.primaryAromas)}${productionHTML(g)}${grapeAppsHTML(g)}${grapeBlendsHTML(g)}${grapeOriginLinksHTML(g)}${blk("Comment le départager",g.differentiation)}${blk("Contre-indices",g.redFlags)}${blk("Confusions fréquentes",g.confusions)}`;$("#detailFav").onclick=()=>{toggleFav(g.name);showG(g)};$("#detailDialog").showModal();wireOriginLinks()}
function showO(o){
 let groups=groupedChildren(o),b=blendForOrigin(o);
 const childRows=(title,arr)=>!arr.length?"":`<div class="origin-child-group"><span>${title}</span>${arr.slice(0,10).map(a=>`<div><strong>${esc(a.label)}</strong><small>${esc(a.grapes||a.blend)}</small></div>`).join("")}${arr.length>10?`<details><summary>Voir ${arr.length-10} autres</summary>${arr.slice(10).map(a=>`<div><strong>${esc(a.label)}</strong><small>${esc(a.grapes||a.blend)}</small></div>`).join("")}</details>`:""}</div>`;
 let hierarchy=(groups.subregions.length||groups.appellations.length)?`<div class="detail-block"><b>Du général au précis</b><div class="origin-path"><span>${esc(o.country)}</span><i>›</i><span>${esc(o.mother||o.style)}</span>${o.mother&&o.mother!==o.style?`<i>›</i><strong>${esc(o.style)}</strong>`:""}</div>${childRows("Sous-régions / zones",groups.subregions)}${childRows("Appellations / indications",groups.appellations)}</div>`:"";
 $("#detailType").textContent=o.grape+" · Unité diagnostique";$("#detailTitle").textContent=o.style;
 $("#detailBody").innerHTML=`<div class="origin-score-hero"><span>SCORE GLOBAL</span><strong>${Math.round(o.score)}</strong></div><div class="origin-subscores"><div><span>Cépage</span><b>${Math.round(o.grapeScore)}</b></div><div><span>Style</span><b>${Math.round(o.fit)}</b></div></div><div class="reason-box"><div class="reason-chips"><span class="reason-chip">Rang cépage ${o.grapeRank||"—"} · poids ${Math.round((o.rankWeight||0)*100)}%</span><span class="reason-chip neutral">Spécificité ×${Number(o.specificity||1).toFixed(2)}</span></div></div>${blk("Pays",o.country)}${o.mother&&o.mother!==o.style?blk("Région mère",o.mother):""}${b?blk("Assemblage compatible",`${b.name} — ${b.logic}`):""}${hierarchy}${blk("Profil sensoriel retenu",o.profileStyle||o.grape)}${blk("Pourquoi ça colle",o.diagnostic)}${blk("À vérifier",o.differentiation)}${blk("Confusions",o.confusions)}`;
 $("#detailDialog").showModal()
}
function tab(n){$$(".tab").forEach(x=>x.classList.toggle("active",x.dataset.tab===n));$$(".screen").forEach(x=>x.classList.toggle("active",x.id==="tab-"+n));if(n==="history")histRender();if(n==="reference")ref($("#searchGrape").value);scrollTo({top:0,behavior:"smooth"})}
const FK="wineBlindFavoritesV7",favs=()=>{try{return new Set(JSON.parse(localStorage.getItem(FK)||"[]"))}catch{return new Set()}};
function toggleFav(name){let f=favs();f.has(name)?f.delete(name):f.add(name);localStorage.setItem(FK,JSON.stringify([...f]));ref($("#searchGrape").value)}
function grapeSearchText(g){
 let groups=(V.grapeAppellations&&V.grapeAppellations[g.name])||{mono:[],blend:[]};
 let apps=[...(groups.mono||[]),...(groups.blend||[])];
 let blends=(V.blends||[]).filter(b=>b.grapes.includes(g.name));
 return nt([
   g.name,g.synonyms,g.keyMarker,g.primaryAromas,g.regions,g.differentiation,g.redFlags,g.confusions,
   g.fruitCompatible,g.signaturesCompatible,g.textureCompatible,JSON.stringify(g.productionWorld||{}),
   ...apps.flatMap(a=>[a.name,a.country,a.region,a.role,a.status]),
   ...blends.flatMap(b=>[b.name,b.country,b.region,b.logic,b.signature])
 ].join(" "));
}
function searchContext(g,q){
 if(!q)return"";
 let nq=nt(q),groups=(V.grapeAppellations&&V.grapeAppellations[g.name])||{mono:[],blend:[]};
 let am=[...(groups.mono||[]).map(a=>({...a,k:"Monocépage"})),...(groups.blend||[]).map(a=>({...a,k:"Assemblage"}))].find(a=>nt([a.name,a.country,a.region,a.role].join(" ")).includes(nq));
 if(am)return `${am.k} · ${am.name}`;
 let bm=(V.blends||[]).filter(b=>b.grapes.includes(g.name)).find(b=>nt([b.name,b.region,b.logic,b.signature].join(" ")).includes(nq));
 if(bm)return `Association · ${bm.name}`;
 if(nt(g.primaryAromas).includes(nq)||nt(g.keyMarker).includes(nq))return"Arômes / marqueurs";
 if(nt(g.regions).includes(nq)||nt(JSON.stringify(g.productionWorld||{})).includes(nq))return"Région de production";
 return"";
}
const ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
function refLetter(name){
 let x=nt(name).charAt(0).toUpperCase();
 return /[A-Z]/.test(x)?x:"#"
}
function alphaMagnify(active){
 $$("#alphaIndex .alpha-letter").forEach((b,i,arr)=>{
   let ai=arr.findIndex(x=>x.dataset.letter===active),d=ai<0?99:Math.abs(i-ai);
   b.classList.toggle("active",d===0);b.classList.toggle("near",d===1);b.classList.toggle("near2",d===2)
 })
}
function refScrollTarget(el,behavior="auto"){
 if(!el)return;
 let top=window.scrollY+el.getBoundingClientRect().top-82;
 window.scrollTo({top:Math.max(0,top),behavior})
}
function alphaJump(letter){
 let target=[...document.querySelectorAll(`[data-ref-letter="${letter}"]`)][0];
 if(!target)return;
 alphaMagnify(letter);refScrollTarget(target,"auto")
}
function alphaRender(letters){
 let rail=$("#alphaIndex");if(!rail)return;rail.innerHTML="";
 let top=document.createElement("button");top.type="button";top.className="alpha-letter alpha-top";top.textContent="↑";top.setAttribute("aria-label","Revenir au début de la liste");
 top.onclick=e=>{e.stopPropagation();refScrollTarget($("#referenceList"),"auto")};rail.append(top);
 ALPHA.forEach(letter=>{
   let b=document.createElement("button");b.type="button";b.className="alpha-letter"+(letters.has(letter)?"":" disabled");
   b.dataset.letter=letter;b.textContent=letter;b.setAttribute("aria-label","Aller à "+letter);
   if(letters.has(letter))b.onclick=e=>{e.stopPropagation();alphaJump(letter)};
   rail.append(b)
 });
 let pointerId=null,startY=0,dragging=false,lastLetter="";
 const fromY=y=>{
   let buttons=[...rail.querySelectorAll(".alpha-letter[data-letter]")],nearest=null,dist=Infinity;
   buttons.forEach(b=>{let r=b.getBoundingClientRect(),cy=r.top+r.height/2,d=Math.abs(y-cy);if(d<dist){dist=d;nearest=b}});
   return nearest?.dataset.letter||""
 };
 rail.onpointerdown=e=>{
   pointerId=e.pointerId;startY=e.clientY;dragging=false;lastLetter="";
   rail.setPointerCapture?.(e.pointerId);
   // Aucun saut ici : un toucher simple sera traité uniquement par onclick.
 };
 rail.onpointermove=e=>{
   if(pointerId!==e.pointerId)return;
   if(!dragging&&Math.abs(e.clientY-startY)<7)return;
   dragging=true;
   let l=fromY(e.clientY);
   if(l&&l!==lastLetter){
     lastLetter=l;alphaMagnify(l);
     if(letters.has(l)){
       let t=[...document.querySelectorAll(`[data-ref-letter="${l}"]`)][0];
       refScrollTarget(t,"auto")
     }
   }
   e.preventDefault()
 };
 rail.onpointerup=e=>{
   if(pointerId!==e.pointerId)return;
   let wasDragging=dragging;
   pointerId=null;dragging=false;lastLetter="";
   rail.releasePointerCapture?.(e.pointerId);
   setTimeout(()=>alphaMagnify(""),150);
   // Ne pas preventDefault sur un toucher simple : le onclick de la lettre
   // doit pouvoir produire un saut unique et direct.
   if(wasDragging)e.preventDefault()
 };
 rail.onpointercancel=()=>{
   pointerId=null;dragging=false;lastLetter="";alphaMagnify("")
 }
}
function refMetaRender(count,label,mode){
 let e=$("#refMeta");if(!e)return;
 e.innerHTML=`<span>${count} ${label}${count>1?"s":""}</span><div class="ref-legend"><i class="legend-red"></i>Rouge <i class="legend-white"></i>Blanc${mode==="origins"?` <i class="legend-mixed"></i>Mixte`:""}</div>`
}
function grapeTypeByName(name){return D.grapes.find(g=>g.name===name)?.type||""}
function originColourClass(u){
 let types=new Set((originProfiles(u)||[]).map(p=>grapeTypeByName(p.grape)).filter(Boolean));
 if(types.size>1)return"ref-mixed";
 if(types.has("Rouge"))return"ref-red";
 if(types.has("Blanc"))return"ref-white";
 return""
}
function refGrapes(q=""){
 let l=$("#referenceList");l.innerHTML="";let nq=nt(q),f=favs();
 let arr=D.grapes.filter(g=>{
   if(S.refFilter==="Rouge"&&g.type!=="Rouge"||S.refFilter==="Blanc"&&g.type!=="Blanc"||S.refFilter==="fav"&&!f.has(g.name))return false;
   return !nq||grapeSearchText(g).includes(nq)
 }).sort((a,b)=>a.name.localeCompare(b.name,"fr",{sensitivity:"base"}));
 let letters=new Set(arr.map(g=>refLetter(g.name))),last="";
 arr.forEach(g=>{
   let letter=refLetter(g.name);
   if(letter!==last){
     let h=document.createElement("div");h.className="ref-letter-heading";h.dataset.refLetter=letter;h.textContent=letter;l.append(h);last=letter
   }
   let r=document.createElement("div");r.className=`ref-row ${g.type==="Rouge"?"ref-red":"ref-white"}`;let ctx=searchContext(g,q),zones=Object.keys(g.productionWorld||{}).slice(0,3).join(" · ");
   r.innerHTML=`<div><strong>${g.name}</strong><br><small>${ctx||g.type+(zones?" · "+zones:"")}</small></div><div class="ref-actions"><button class="fav-btn ${f.has(g.name)?"active":""}" aria-label="À réviser">${f.has(g.name)?"♥":"♡"}</button><span>›</span></div>`;
   r.onclick=()=>showG(g);r.querySelector(".fav-btn").onclick=e=>{e.stopPropagation();toggleFav(g.name)};l.append(r)
 });
 refMetaRender(arr.length,"cépage","grapes");alphaRender(letters);
}
function originProfiles(u){return (G8.profiles||[]).filter(p=>p.unitId===u.id)}
function originChildren(u){return (G8.children||[]).filter(a=>a.unitId===u.id)}
function originSearchText(u){
 let pp=originProfiles(u),cc=originChildren(u);
 return nt([u.label,u.country,u.mother,(u.grapes||[]).join(" "),
   ...pp.flatMap(p=>[p.grape,p.style,p.diagnostic,p.differentiation,p.confusions,p.marker,p.sourceGeo]),
   ...cc.flatMap(a=>[a.label,a.name,a.country,a.region,a.grapes,a.blend,a.status])
 ].join(" "))
}
function countryRender(){
 let box=$("#originCountryFilters");if(!box)return;
 if(S.refMode!=="origins"){box.classList.add("hidden");box.innerHTML="";return}
 let countries=[...new Set((G8.units||[]).map(u=>u.country).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"fr"));
 box.classList.remove("hidden");box.innerHTML=`<button class="country-chip ${S.refCountry==="all"?"active":""}" data-country="all">Tous</button>`+
 countries.map(c=>`<button class="country-chip ${S.refCountry===c?"active":""}" data-country="${esc(c)}">${esc(c)}</button>`).join("");
 box.querySelectorAll(".country-chip").forEach(b=>b.onclick=()=>{S.refCountry=b.dataset.country;countryRender();ref($("#searchGrape").value)})
}
function showOriginReference(u){
 let pp=originProfiles(u),cc=originChildren(u),grapes=[...new Set(pp.map(p=>p.grape))],best=pp[0]||{},mother=u.mother||u.label;
 let apps=[...new Map(cc.map(a=>[a.label||a.name,a])).values()];
 let profileRows=pp.slice(0,6).map(p=>`<div class="origin-profile-row"><b>${esc(p.grape)}</b><span>${esc(p.diagnostic||p.style||"")}</span></div>`).join("");
 let appRows=apps.length?`<div class="detail-block"><b>Appellations & zones</b><div class="app-pill-list">${apps.slice(0,18).map(a=>`<span class="app-pill">${esc(a.label||a.name)}</span>`).join("")}</div>${apps.length>18?`<small>+ ${apps.length-18} autres zones dans la base</small>`:""}</div>`:"";
 $("#detailType").textContent=`${u.country} · Origine`;$("#detailTitle").textContent=u.label;
 $("#detailBody").innerHTML=`<div class="origin-path"><span>${esc(u.country)}</span>${mother!==u.label?`<i>›</i><span>${esc(mother)}</span>`:""}<i>›</i><strong>${esc(u.label)}</strong></div>
 ${blk("Cépages clés",grapes.join(" · "))}
 ${profileRows?`<div class="detail-block"><b>Profils à l’aveugle</b>${profileRows}</div>`:""}
 ${appRows}
 ${best.differentiation?blk("Clés de différenciation",best.differentiation):""}
 ${best.confusions?blk("À distinguer de",best.confusions):""}`;
 $("#detailDialog").showModal()
}
function refOrigins(q=""){
 let l=$("#referenceList");l.innerHTML="";let nq=nt(q);
 let arr=(G8.units||[]).filter(u=>(S.refCountry==="all"||u.country===S.refCountry)&&(!nq||originSearchText(u).includes(nq)))
   .sort((a,b)=>a.label.localeCompare(b.label,"fr",{sensitivity:"base"})||a.country.localeCompare(b.country,"fr"));
 let lastLetter="",letters=new Set();
 arr.forEach(u=>{
   let letter=refLetter(u.label);letters.add(letter);
   if(letter!==lastLetter){let h=document.createElement("div");h.className="ref-letter-heading";h.dataset.refLetter=letter;h.textContent=letter;l.append(h);lastLetter=letter}
   let r=document.createElement("div");r.className=`ref-row origin-ref-row ${originColourClass(u)}`;
   let pp=originProfiles(u),cc=originChildren(u),gs=(u.grapes||[]).join(" · ");
   let matched=nq?cc.find(a=>nt([a.label,a.name,a.region,a.grapes].join(" ")).includes(nq)):null;
   r.innerHTML=`<div><strong>${esc(u.label)}</strong><br><small>${esc(u.country)}${matched?` · Appellation : ${esc(matched.label||matched.name)}`:""}${gs?` · ${esc(gs)}`:""}${cc.length?` · ${cc.length} zone${cc.length>1?"s":""}`:""}</small></div><div class="ref-actions"><span>›</span></div>`;
   r.onclick=()=>showOriginReference(u);l.append(r)
 });
 refMetaRender(arr.length,"origine","origins");alphaRender(letters)
}
function ref(q=""){
 countryRender();
 if(S.refMode==="origins")refOrigins(q);else refGrapes(q)
}
function quizNew(){
 let pool=D.grapes.filter(g=>g.type===S.type),answer=pool[Math.floor(Math.random()*pool.length)];
 let others=pool.filter(g=>g.name!==answer.name).sort(()=>Math.random()-.5).slice(0,3),choices=[answer,...others].sort(()=>Math.random()-.5);
 let clues=[`Couleur ${answer.color} · Acidité ${answer.acid}${answer.type==="Rouge"?` · Tanins ${answer.tannin}`:""}`,answer.primaryAromas||answer.keyMarker,answer.regions?`Régions typiques : ${answer.regions.split(";").slice(0,2).join(", ")}`:""].filter(Boolean);
 $("#quizClues").innerHTML=clues.map((x,i)=>`<div class="quiz-clue"><b>${i+1}</b><span>${x}</span></div>`).join("");
 $("#quizChoices").innerHTML="";$("#quizFeedback").classList.add("hidden");$("#quizFeedback").innerHTML="";
 choices.forEach(g=>{let b=document.createElement("button");b.className="quiz-choice";b.textContent=g.name;b.onclick=()=>{let ok=g.name===answer.name;$("#quizFeedback").classList.remove("hidden");$("#quizFeedback").innerHTML=`<b>${ok?"✓ Bonne réponse":"✗ "+answer.name}</b><p>${answer.keyMarker||answer.differentiation||""}</p>`;$$(".quiz-choice").forEach(x=>x.disabled=true)};$("#quizChoices").append(b)})
}

const AQ=[
 {id:"colorPale",q:"La couleur est-elle plutôt pâle ?",why:"La profondeur de couleur sépare rapidement les cépages naturellement peu pigmentés des profils plus extraits.",test:g=>g.color<=2.7,yes:{color:"M-"},no:null},
 {id:"colorDeep",q:"La couleur est-elle franchement profonde ?",why:"Une couleur profonde favorise les cépages fortement pigmentés et écarte plusieurs cépages à peau fine.",test:g=>g.color>=4.1,yes:{color:"M+"}},
 {id:"acidHigh",q:"L’acidité est-elle élevée ou très élevée ?",why:"L’acidité est l’un des marqueurs structurels les plus fiables pour séparer les familles de cépages.",test:g=>g.acid>=4,yes:{acid:"M+"},no:{acid:"M"}},
 {id:"acidLow",q:"L’acidité paraît-elle plutôt faible à moyenne ?",why:"Une acidité modérée écarte les cépages naturellement très acides.",test:g=>g.acid<=3,yes:{acid:"M-"}},
 {id:"tanninHigh",q:"Les tanins sont-ils élevés, fermes ou très structurants ?",why:"Pour les rouges, le niveau de tanins est souvent l’un des critères les plus discriminants.",types:["Rouge"],test:g=>g.tannin>=4.2,yes:{tannin:"M+"},no:{tannin:"M"}},
 {id:"tanninLow",q:"Les tanins sont-ils plutôt faibles ou très souples ?",why:"Des tanins faibles orientent vers un groupe beaucoup plus restreint de cépages rouges.",types:["Rouge"],test:g=>g.tannin<=2.7,yes:{tannin:"M-"}},
 {id:"bodyLight",q:"Le corps est-il plutôt léger ?",why:"Le poids en bouche permet de distinguer les cépages fins des profils naturellement plus charnus.",test:g=>g.body<=2.7,yes:{body:"M-"}},
 {id:"bodyFull",q:"Le vin est-il ample ou corsé ?",why:"Un corps élevé rapproche les cépages à forte concentration ou issus de climats plus chauds.",test:g=>g.body>=4.1,yes:{body:"M+"}},
 {id:"alcoholHigh",q:"L’alcool paraît-il élevé ?",why:"L’alcool renseigne à la fois sur le cépage, la maturité et le contexte climatique.",test:g=>g.alcohol>=4.1,yes:{alcohol:"M+"}},
 {id:"alcoholLow",q:"L’alcool paraît-il faible à modéré ?",why:"Un alcool contenu est particulièrement utile pour identifier certains cépages ou styles de climat frais.",test:g=>g.alcohol<=2.8,yes:{alcohol:"M-"}},
 {id:"aromaIntense",q:"L’intensité aromatique est-elle nettement marquée ?",why:"Certains cépages sont naturellement beaucoup plus expressifs que d’autres.",test:g=>g.intensity>=4.2,yes:{intensity:"M+"}},
 {id:"redFruit",q:"Le fruit évoque-t-il surtout les fruits rouges (cerise, fraise, framboise) ?",why:"La couleur du fruit est très utile pour départager les rouges de structure comparable.",types:["Rouge"],test:g=>has(g.fruitCompatible,"Fruits rouges")||has(g.keyMarker,"cerise")||has(g.keyMarker,"fraise")||has(g.keyMarker,"frambo")},
 {id:"blackFruit",q:"Le fruit est-il dominé par des fruits noirs (cassis, mûre, prune noire) ?",why:"Les fruits noirs orientent vers des cépages plus pigmentés ou des maturités plus poussées.",types:["Rouge"],test:g=>has(g.fruitCompatible,"Fruits noirs")||has(g.keyMarker,"cassis")||has(g.keyMarker,"mûre")||has(g.keyMarker,"prune")},
 {id:"citrus",q:"Les agrumes dominent-ils le profil aromatique ?",why:"Chez les blancs, la dominance agrumes/citron permet de séparer plusieurs familles aromatiques.",types:["Blanc"],test:g=>has(g.fruitCompatible,"Agrumes")||has(g.keyMarker,"citron")||has(g.blindMarker,"citron")||has(g.differentiation,"agrum")},
 {id:"stoneFruit",q:"Les fruits à noyau (pêche, abricot) sont-ils marqués ?",why:"Ce marqueur est particulièrement utile parmi les blancs aromatiques et certains blancs méridionaux.",types:["Blanc"],test:g=>has(g.fruitCompatible,"Fruits à noyau")||has(g.keyMarker,"pêche")||has(g.keyMarker,"abricot")||has(g.blindMarker,"abricot")},
 {id:"tropical",q:"Perçoit-on nettement des fruits tropicaux ou exotiques ?",why:"Un caractère tropical peut signaler certains cépages ou un niveau de maturité spécifique.",types:["Blanc"],test:g=>has(g.fruitCompatible,"Tropic")||has(g.keyMarker,"tropical")||has(g.keyMarker,"ananas")||has(g.keyMarker,"mangue")},
 {id:"floral",q:"Le caractère floral est-il net (violette, rose, fleurs blanches) ?",why:"Le floral est un excellent marqueur secondaire lorsque plusieurs candidats structurels restent proches.",test:g=>has(g.signaturesCompatible,"floral")||has(g.keyMarker,"violette")||has(g.keyMarker,"rose")||has(g.keyMarker,"floral")||has(g.blindMarker,"floral")},
 {id:"pyrazine",q:"Perçoit-on un caractère végétal de type poivron, feuille ou pyrazine ?",why:"Les pyrazines sont très discriminantes pour certaines familles bordelaises et quelques cépages apparentés.",test:g=>has(g.signaturesCompatible,"Pyrazine")||has(g.keyMarker,"poivron")||has(g.keyMarker,"végétal")||has(g.blindMarker,"poivron")},
 {id:"pepper",q:"Le poivre noir ou blanc est-il un marqueur évident ?",why:"Le poivre est un marqueur très puissant pour départager plusieurs rouges de structure comparable.",types:["Rouge"],test:g=>has(g.keyMarker,"poivre")||has(g.blindMarker,"poivre")||has(g.signaturesCompatible,"poivre")},
 {id:"licorice",q:"Réglisse, anis ou épices sombres sont-ils marqués ?",why:"Ces notes peuvent aider à départager certains rouges méditerranéens et cépages à forte maturité.",types:["Rouge"],test:g=>has(g.keyMarker,"réglisse")||has(g.blindMarker,"réglisse")||has(g.keyMarker,"anis")},
 {id:"earth",q:"Un caractère terreux, sous-bois ou champignon est-il net ?",why:"Ces marqueurs peuvent aider à distinguer les cépages fins évolutifs des profils dominés par le fruit primaire.",types:["Rouge"],test:g=>has(g.keyMarker,"terre")||has(g.blindMarker,"sous-bois")||has(g.differentiation,"terre")||has(g.keyMarker,"champignon")},
 {id:"tarRose",q:"Rose séchée, goudron ou notes balsamiques sont-ils présents ?",why:"Cette association est particulièrement discriminante parmi les rouges pâles, acides et tanniques.",types:["Rouge"],test:g=>has(g.keyMarker,"goudron")||has(g.blindMarker,"goudron")||has(g.keyMarker,"rose")||has(g.differentiation,"goudron")},
 {id:"petrol",q:"Une note pétrolée / hydrocarbure est-elle perceptible ?",why:"Le caractère TDN/pétrole est très discriminant dans un groupe restreint de cépages blancs.",types:["Blanc"],test:g=>has(g.keyMarker,"pétrol")||has(g.blindMarker,"pétrol")||has(g.differentiation,"pétrol")},
 {id:"greenHerbal",q:"Le profil est-il franchement herbacé ou végétal frais ?",why:"Un caractère herbacé net sépare plusieurs blancs aromatiques de profils plus fruités ou floraux.",types:["Blanc"],test:g=>has(g.keyMarker,"herbac")||has(g.blindMarker,"herbac")||has(g.keyMarker,"herbe")||has(g.signaturesCompatible,"végétal")},
 {id:"thiol",q:"Perçoit-on buis, fruit de la passion ou agrumes très expressifs ?",why:"Les marqueurs thiolés constituent une signature très discriminante de certains blancs.",types:["Blanc"],test:g=>has(g.keyMarker,"buis")||has(g.keyMarker,"passion")||has(g.blindMarker,"passion")||has(g.differentiation,"thiol")},
 {id:"waxHoney",q:"Cire, miel ou lanoline font-ils partie du profil ?",why:"Ces caractères permettent notamment de départager certains blancs à forte acidité et bonne capacité de garde.",types:["Blanc"],test:g=>has(g.keyMarker,"cire")||has(g.keyMarker,"miel")||has(g.blindMarker,"cire")||has(g.differentiation,"lanoline")},
 {id:"almond",q:"Amande, noisette ou légère amertume de finale sont-elles présentes ?",why:"Les notes d’amande et l’amertume finale sont utiles dans plusieurs familles de blancs italiens et méditerranéens.",types:["Blanc"],test:g=>has(g.keyMarker,"amande")||has(g.blindMarker,"amande")||has(g.keyMarker,"noisette")||has(g.differentiation,"amert")},
 {id:"saline",q:"La finale paraît-elle saline, crayeuse ou très minérale ?",why:"La salinité/minéralité peut devenir très discriminante lorsque l’espace des candidats est déjà resserré.",types:["Blanc"],test:g=>has(g.keyMarker,"salin")||has(g.blindMarker,"salin")||has(g.differentiation,"salin")||has(g.keyMarker,"minéral")},
 {id:"aromaticGrape",q:"Le vin est-il très aromatique, floral et épicé plutôt que neutre ?",why:"Cette question sépare les cépages aromatiques de ceux dont le profil repose surtout sur la structure ou la vinification.",types:["Blanc"],test:g=>g.intensity>=4.2&&(has(g.keyMarker,"floral")||has(g.keyMarker,"épice")||has(g.keyMarker,"litchi")||has(g.blindMarker,"floral"))},
 {id:"muscat",q:"Le raisin frais, la fleur d’oranger ou le muscat sont-ils évidents ?",why:"Le caractère muscaté est une signature variétale très spécifique.",types:["Blanc"],test:g=>has(g.name,"Muscat")||has(g.keyMarker,"raisin")||has(g.keyMarker,"fleur d’oranger")||has(g.blindMarker,"muscat")},
 {id:"viognier",q:"Abricot mûr, pêche et floral avec acidité plutôt modérée : est-ce proche du vin ?",why:"Cette combinaison aide à isoler les blancs aromatiques amples mais peu acides.",types:["Blanc"],test:g=>has(g.name,"Viognier")||((g.acid<=3)&&has(g.keyMarker,"abricot"))},
 {id:"oak",q:"Le bois ou les marqueurs d’élevage sont-ils nettement perceptibles ?",why:"L’élevage n’identifie pas seul un cépage mais départage efficacement des styles proches.",test:g=>has(g.textureCompatible,"Boisé")||has(g.secondaryTertiary,"bois")||has(g.differentiation,"bois")},
 {id:"silky",q:"La texture est-elle particulièrement fine ou soyeuse ?",why:"La finesse tannique/texturale aide à séparer les cépages à peau fine des profils plus rustiques.",test:g=>has(g.textureCompatible,"Fin / soyeux")},
 {id:"firm",q:"La texture est-elle ferme, anguleuse ou austère ?",why:"La qualité des tanins est souvent aussi utile que leur quantité.",types:["Rouge"],test:g=>has(g.textureCompatible,"Ferme / structuré")||g.tannin>=4.3},
 {id:"driedFruit",q:"Le fruit évoque-t-il la prune séchée, le raisin sec ou une forte surmaturité ?",why:"Les fruits séchés orientent vers certains styles de passerillage ou des maturités très poussées.",test:g=>has(g.keyMarker,"séché")||has(g.blindMarker,"raisin sec")||has(g.differentiation,"appassimento")},
 {id:"cherryHerb",q:"Cerise acidulée, herbes sèches et acidité élevée dominent-elles ?",why:"Cette combinaison est particulièrement utile pour départager plusieurs rouges italiens.",types:["Rouge"],test:g=>has(g.keyMarker,"cerise")&&(g.acid>=4)&& (has(g.keyMarker,"herb")||has(g.differentiation,"Sangiovese")||has(g.name,"Sangiovese"))},
 {id:"bananaCarbonic",q:"Banane, bonbon ou caractère très fruité de macération carbonique sont-ils perceptibles ?",why:"Ce profil de vinification est très utile dans un petit nombre de familles de rouges légers.",types:["Rouge"],test:g=>has(g.keyMarker,"banane")||has(g.blindMarker,"bonbon")||has(g.differentiation,"carbonique")||has(g.name,"Gamay")},
 {id:"oliveMeat",q:"Olive noire, viande fumée ou caractère savoureux sont-ils présents ?",why:"Ces marqueurs sont très utiles pour distinguer certains profils de Syrah et cépages méditerranéens.",types:["Rouge"],test:g=>has(g.keyMarker,"olive")||has(g.keyMarker,"viande")||has(g.blindMarker,"olive")},
 {id:"plumSoft",q:"Prune mûre et texture ronde/souple dominent-elles ?",why:"Cette combinaison aide à séparer les rouges charnus et souples des profils plus fermes ou acides.",types:["Rouge"],test:g=>has(g.keyMarker,"prune")&&(g.tannin<=3.7||has(g.keyMarker,"souple"))},
 {id:"highAcidHighTanninPale",q:"Le vin combine-t-il couleur relativement pâle, acidité élevée et tanins élevés ?",why:"Cette combinaison structurelle rare concentre fortement le diagnostic.",types:["Rouge"],test:g=>g.color<=3.2&&g.acid>=4&&g.tannin>=4.2},
 {id:"lowTanninHighAcid",q:"Le vin combine-t-il acidité élevée et tanins faibles à modérés ?",why:"Cette structure est très discriminante parmi les rouges légers.",types:["Rouge"],test:g=>g.acid>=4&&g.tannin<=3.1}
];
const TREE_PATCHES={
 redFruit:{fruit:"Fruits rouges"},blackFruit:{fruit:"Fruits noirs"},citrus:{fruit:"Agrumes"},
 stoneFruit:{fruit:"Fruits à noyau"},tropical:{fruit:"Exotique"},
 floral:{signature:"Violette / floral"},pyrazine:{signature:"Pyrazine / poivron / paprika"},
 pepper:{signature:"Poivre noir / olive / viande"},tarRose:{signature:"Rose / goudron"},
 petrol:{signature:"Pétrole"},thiol:{signature:"Thiols / buis / herbe"},
 waxHoney:{signature:"Cire / lanoline"},saline:{signature:"Salin / pierre / silex"},
 muscat:{fruit:"Raisin / muscaté",signature:"Raisin frais / muscaté"},
 viognier:{signature:"Abricot / pêche"},oak:{texture:"Boisé / MLF"},
 silky:{texture:"Fin / soyeux"},firm:{texture:"Ferme / structuré"},
 driedFruit:{signature:"Confiture / raisin sec"},cherryHerb:{signature:"Garrigue / herbes sèches"},
 oliveMeat:{signature:"Poivre noir / olive / viande"},plumSoft:{texture:"Ample / onctueux"},
 aromaticGrape:{intensity:"M+"},highAcidHighTanninPale:{acid:"M+",tannin:"M+",color:"M-"},
 lowTanninHighAcid:{acid:"M+",tannin:"M-"}
};
function treePatch(q,answer){
 if(answer!=="Oui"&&answer!=="Non")return null;
 let base=answer==="Oui"?(q.yes||TREE_PATCHES[q.id]):q.no;
 return base||null
}
function syncTreeToDiagnostic(){
 let owned=new Set(S.tree.prefillKeys||[]);
 owned.forEach(k=>{if(k in S.g)S.g[k]=""});
 let nextOwned=new Set();
 (S.tree.answers||[]).forEach(a=>{
   if(a.a==="Incertain")return;
   let q=AQ.find(x=>x.id===a.qid);if(!q)return;
   let patch=treePatch(q,a.a);if(!patch)return;
   Object.entries(patch).forEach(([k,v])=>{if(k in S.g&&v){S.g[k]=v;nextOwned.add(k)}})
 });
 S.tree.prefillKeys=[...nextOwned];
 forms();calc()
}
function treeDiagnosticCandidates(){
 return D.grapes.map(g=>({...g,...geval(g)})).filter(g=>g.type===S.type&&g.score>0).sort((a,b)=>b.score-a.score)
}
function treeCandidates(){
 let pool=D.grapes.filter(g=>g.type===S.type),answers=S.tree.answers||[];
 return pool.map(g=>{let score=0,used=0;answers.forEach(a=>{if(a.a==="Incertain")return;let q=AQ.find(x=>x.id===a.qid);if(!q)return;let match=!!q.test(g),yes=a.a==="Oui";score+=(match===yes?2:-1.5);used++});return{...g,treeScore:score,used}}).sort((a,b)=>b.treeScore-a.treeScore)
}
function treeProbabilities(){
 let arr=treeCandidates(),max=arr[0]?.treeScore||0,exp=arr.map(g=>Math.exp((g.treeScore-max)/2.2)),sum=exp.reduce((a,b)=>a+b,0)||1;
 return arr.map((g,i)=>({...g,p:exp[i]/sum}))
}
function questionUtility(q,cands){
 if(q.types&&!q.types.includes(S.type))return-1;
 let top=cands.slice(0,18),yes=0,total=0;
 top.forEach(g=>{let w=Math.max(.01,g.p);total+=w;if(q.test(g))yes+=w});
 if(!total)return-1;let p=yes/total;
 return 4*p*(1-p)
}
function nextAdaptiveQuestion(){
 let asked=new Set(S.tree.answers.map(a=>a.qid)),c=treeProbabilities();
 return AQ.filter(q=>!asked.has(q.id)&&(!q.types||q.types.includes(S.type))).map(q=>[q,questionUtility(q,c)]).sort((a,b)=>b[1]-a[1])[0]?.[0]||null
}
function convergenceData(){
 let c=treeProbabilities(),top=c[0]?.p||0,gap=(c[0]?.p||0)-(c[1]?.p||0),n=S.tree.answers.filter(a=>a.a!=="Incertain").length;
 let level=Math.min(1,.15+n*.045+top*.48+gap*.65);
 return{c,top,gap,n,level}
}
function shouldTreeStop(){
 let total=S.tree.answers.length,diag=treeDiagnosticCandidates(),top=diag[0]?.score||0,gap=top-(diag[1]?.score||0);
 if(total>=18)return true;
 if(total<6)return false;
 if(top>=90&&gap>=12)return true;
 if(total>=9&&top>=82&&gap>=8)return true;
 if(total>=13&&top>=75&&gap>=5)return true;
 return false
}
function treeRender(){
 let x=convergenceData(),q=S.tree.current||nextAdaptiveQuestion();S.tree.current=q;
 $("#treeStep").textContent=`${S.tree.answers.length?S.tree.answers.length+" réponses":"Diagnostic guidé"}`;
 $("#treeQuestion").textContent=q?q.q:"";
 $("#treeBack").style.visibility=S.tree.answers.length?"visible":"hidden";
 $("#treeWhy").classList.toggle("hidden",!q);$("#treeWhyText").classList.add("hidden");
 $("#adaptiveCard").classList.toggle("hidden",S.tree.done);
 let bar=$("#treeConvergence");bar.querySelector("i").style.width=Math.round(x.level*100)+"%";
 bar.querySelector("small").textContent=x.level>.72?"Ciblé":x.level>.45?"En convergence":"Large";
 bar.querySelector("span").textContent="Convergence · Diagnostic synchronisé";
 trail()
}
function treeApplyObservation(){syncTreeToDiagnostic()}
function treeAns(answer){
 if(S.tree.done||!S.tree.current)return;
 let q=S.tree.current;S.tree.answers.push({qid:q.id,q:q.q,a:answer});treeApplyObservation();S.tree.current=null;
 if(shouldTreeStop())treeFinish();else treeRender()
}
function back(){
 if(!S.tree.answers.length)return;S.tree.answers.pop();S.tree.done=false;S.tree.current=null;$("#adaptiveResult").classList.add("hidden");syncTreeToDiagnostic();treeRender()
}
function trail(){
 let e=$("#adaptiveHistory");e.innerHTML="";
 S.tree.answers.forEach((x,i)=>{let d=document.createElement("button");d.type="button";d.className="adaptive-history-item";d.innerHTML=`<span>${i+1}</span><div><b>${esc(x.q)}</b><small>${esc(x.a)}</small></div>`;d.onclick=()=>{S.tree.answers=S.tree.answers.slice(0,i);S.tree.done=false;S.tree.current=null;$("#adaptiveResult").classList.add("hidden");syncTreeToDiagnostic();treeRender()};e.append(d)})
}
function treeDiscriminants(cands){
 let top=cands.slice(0,4),fields=[["acid","Acidité"],["tannin","Tanins"],["alcohol","Alcool"],["body","Corps"],["color","Couleur"],["intensity","Intensité"]];
 let out=[];
 fields.forEach(([k,l])=>{if(k==="tannin"&&S.type==="Blanc")return;let vals=top.map(g=>Number(g[k])).filter(Number.isFinite);if(vals.length<2)return;let spread=Math.max(...vals)-Math.min(...vals);if(spread>=.8)out.push({score:spread,text:`${l} : ${top.map(g=>`${g.name} ${Number(g[k]).toFixed(1)}`).join(" · ")}`})});
 top.forEach(g=>{let t=g.differentiation||g.discrimination;if(t)out.push({score:.7,text:`${g.name} : ${t}`})});
 return out.sort((a,b)=>b.score-a.score).slice(0,6)
}
function treeFinish(){
 syncTreeToDiagnostic();S.tree.done=true;S.tree.current=null;
 let top=treeDiagnosticCandidates().slice(0,5),disc=treeDiscriminants(top);
 $("#adaptiveCard").classList.add("hidden");let r=$("#adaptiveResult");r.classList.remove("hidden");
 r.innerHTML=`<div class="training-card adaptive-final"><div class="training-progress"><span>HYPOTHÈSES DU DIAGNOSTIC CÉPAGE</span><button id="treeRestartFinal" class="ghost-btn small">Recommencer</button></div><div class="adaptive-candidates">${top.map((g,i)=>`<button class="adaptive-candidate" data-grape="${esc(g.name)}"><span>${i+1}</span><div><b>${esc(g.name)}</b><small>${esc(g.keyMarker||g.blindMarker||"")}</small></div><strong>${Math.round(g.score)}</strong></button>`).join("")}</div>${disc.length?`<div class="adaptive-discriminants"><b>Pour les départager</b>${disc.map(d=>`<p>${esc(d.text)}</p>`).join("")}</div>`:""}<div class="adaptive-sync-note">Ces candidats sont calculés avec le même scoring que le Top 10 Cépages. Les critères déduits de tes réponses sont déjà pré-renseignés dans le diagnostic.</div><div class="adaptive-final-actions"><button id="treeContinue" class="secondary-btn">Continuer à départager</button><button id="treeToDiagnostic" class="primary-btn">Voir le diagnostic complet</button></div></div>`;
 r.querySelectorAll(".adaptive-candidate").forEach(b=>b.onclick=()=>{let g=D.grapes.find(x=>x.name===b.dataset.grape);if(g)showG(g)});
 $("#treeRestartFinal").onclick=treeRestart;
 $("#treeContinue").onclick=()=>{S.tree.done=false;S.tree.extended=true;S.tree.current=nextAdaptiveQuestion();r.classList.add("hidden");treeRender()};
 $("#treeToDiagnostic").onclick=()=>{syncTreeToDiagnostic();tab("grape")}
 trail()
}
function treeRestart(){
 let owned=new Set(S.tree.prefillKeys||[]);owned.forEach(k=>{if(k in S.g)S.g[k]=""});
 S.tree={answers:[],current:null,done:false,extended:false,prefillKeys:[]};
 $("#adaptiveResult").classList.add("hidden");forms();calc();treeRender()
}
const HK="wineBlindHistoryV2",hist=()=>{try{return JSON.parse(localStorage.getItem(HK)||"[]")}catch{return[]}};
function openSave(){let d=new Date();$("#wineDate").value=d.toISOString().slice(0,10);$("#saveDialog").showModal()}
function save(ev){ev.preventDefault();let g=S.gr[0],o=S.or[0],r={id:Date.now(),date:$("#wineDate").value,name:$("#wineName").value.trim(),vintage:$("#wineVintage").value.trim(),actualGrape:$("#actualGrape").value.trim(),actualOrigin:$("#actualOrigin").value.trim(),notes:$("#wineNotes").value.trim(),type:S.type,observations:{...S.g},originObservations:{...S.o},topGrape:g?g.name:"",topGrapeScore:g?Math.round(g.score):null,top3:S.gr.slice(0,3).map(x=>x.name),topOrigin:o?o.style:""};let h=hist();h.unshift(r);localStorage.setItem(HK,JSON.stringify(h));$("#saveDialog").close();$("#saveForm").reset();tab("history")}
function historyInsights(h){
 let revealed=h.filter(x=>x.actualGrape),conf={},bias={acid:[],tannin:[],alcohol:[],body:[],color:[],intensity:[]};
 revealed.forEach(r=>{
   if(r.topGrape&&r.actualGrape.toLowerCase()!==r.topGrape.toLowerCase()){let k=`${r.actualGrape} ↔ ${r.topGrape}`;conf[k]=(conf[k]||0)+1}
   let truth=D.grapes.find(g=>g.name.toLowerCase()===r.actualGrape.toLowerCase());
   if(truth&&r.observations)Object.keys(bias).forEach(k=>{if(k==="tannin"&&truth.type==="Blanc")return;let a=lev(r.observations[k]),b=Number(truth[k]);if(a&&Number.isFinite(b))bias[k].push(a-b)})
 });
 let topConf=Object.entries(conf).sort((a,b)=>b[1]-a[1]).slice(0,3);
 let bRows=Object.entries(bias).map(([k,v])=>[k,v.length?v.reduce((a,b)=>a+b,0)/v.length:0,v.length]).filter(x=>x[2]>=2).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3);
 let html="";
 if(topConf.length)html+=`<div class="insight-card"><span>CONFUSIONS FRÉQUENTES</span>${topConf.map(([k,n])=>`<p><b>${k}</b><em>${n}×</em></p>`).join("")}</div>`;
 if(bRows.length)html+=`<div class="insight-card"><span>BIAIS DE DÉGUSTATION</span>${bRows.map(([k,d,n])=>`<p><b>${L[k]||k}</b><em>${d>.25?"souvent surestimé":d<-.25?"souvent sous-estimé":"bien calibré"} · ${n} cas</em></p>`).join("")}</div>`;
 if(revealed.length>=3)html+=`<div class="insight-card"><span>PROCHAINE PRIORITÉ</span><p><b>${topConf.length?`Revoir ${topConf[0][0]}`:bRows.length?`Recalibrer ${L[bRows[0][0]]}`:"Multiplier les dégustations révélées"}</b></p></div>`;
 return html||`<div class="insight-empty">Renseigne le cépage réel après révélation : les confusions et biais apparaîtront ici après quelques dégustations.</div>`;
}
function histRender(){
 let h=hist(),k=h.filter(x=>x.actualGrape),a=k.filter(x=>x.actualGrape.toLowerCase()===x.topGrape.toLowerCase()).length,b=k.filter(x=>x.top3.some(g=>g.toLowerCase()===x.actualGrape.toLowerCase())).length;
 let originKnown=h.filter(x=>x.actualOrigin&&x.topOrigin),originHit=originKnown.filter(x=>x.topOrigin.toLowerCase().includes(x.actualOrigin.toLowerCase())||x.actualOrigin.toLowerCase().includes(x.topOrigin.toLowerCase())).length;
 $("#historyStats").innerHTML=`<div class="stat-card"><b>${h.length}</b><span>Dégustations</span></div><div class="stat-card"><b>${k.length?Math.round(a/k.length*100)+"%":"—"}</b><span>Cépage Top 1</span></div><div class="stat-card"><b>${k.length?Math.round(b/k.length*100)+"%":"—"}</b><span>Cépage Top 3</span></div>`;
 $("#historyInsights").innerHTML=historyInsights(h);
 let l=$("#historyList");l.innerHTML=h.length?"":'<div class="empty">Aucune dégustation enregistrée.</div>';
 h.forEach(r=>{let d=document.createElement("div");d.className="history-card";let hit=r.actualGrape&&r.topGrape?r.actualGrape.toLowerCase()===r.topGrape.toLowerCase():null;d.innerHTML=`<div class="history-head"><div><h3>${r.name||"Dégustation sans nom"}${r.vintage?" · "+r.vintage:""}</h3><div class="history-meta">${r.date||""} · ${r.type}${hit===true?" · ✓ Top 1":hit===false?" · à revoir":""}</div></div><button class="delete-btn" data-id="${r.id}">Supprimer</button></div><div class="history-result"><b>Diagnostic :</b> ${r.topGrape||"—"}${r.topGrapeScore?` (${r.topGrapeScore})`:""}${r.topOrigin?" · "+r.topOrigin:""}<br><b>Révélation :</b> ${r.actualGrape||"non renseignée"}${r.actualOrigin?" · "+r.actualOrigin:""}${r.notes?`<br><span class="muted">${r.notes}</span>`:""}</div>`;l.append(d)});
 $$(".delete-btn").forEach(b=>b.onclick=()=>{localStorage.setItem(HK,JSON.stringify(hist().filter(x=>String(x.id)!==b.dataset.id)));histRender()})
}
$("#typeRed").onclick=()=>{S.type="Rouge";S.tree={answers:[],current:null,done:false,extended:false,prefillKeys:[]};$("#typeRed").classList.add("active");$("#typeWhite").classList.remove("active");wineTheme();forms();calc()};$("#typeWhite").onclick=()=>{S.type="Blanc";S.g.tannin="";$("#typeWhite").classList.add("active");$("#typeRed").classList.remove("active");wineTheme();forms();calc()};$$(".tab").forEach(b=>b.onclick=()=>tab(b.dataset.tab));$("#goOrigin").onclick=()=>tab("origin");$("#closeDialog").onclick=()=>$("#detailDialog").close();$("#searchGrape").oninput=e=>ref(e.target.value);$$(".ref-mode-btn").forEach(b=>b.onclick=()=>{S.refMode=b.dataset.refmode;S.refCountry="all";$$(".ref-mode-btn").forEach(x=>x.classList.toggle("active",x===b));ref($("#searchGrape").value)});$$(".filter-chip").forEach(b=>b.onclick=()=>{$$(".filter-chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");S.refFilter=b.dataset.ref;ref($("#searchGrape").value)});$("#modeTree").onclick=()=>{$("#modeTree").classList.add("active");$("#modeQuiz").classList.remove("active");$("#treeMode").classList.remove("hidden");$("#quizMode").classList.add("hidden")};$("#modeQuiz").onclick=()=>{$("#modeQuiz").classList.add("active");$("#modeTree").classList.remove("active");$("#quizMode").classList.remove("hidden");$("#treeMode").classList.add("hidden");quizNew()};$("#newQuiz").onclick=quizNew;$("#treeYes").onclick=()=>treeAns("Oui");$("#treeNo").onclick=()=>treeAns("Non");$("#treeUnsure").onclick=()=>treeAns("Incertain");$("#treeBack").onclick=back;$("#treeRestart").onclick=treeRestart;$("#treeWhy").onclick=()=>{let q=S.tree.current,e=$("#treeWhyText");if(!q)return;e.textContent=q.why||"";e.classList.toggle("hidden")};$("#saveTasting").onclick=openSave;$("#saveTastingOrigin").onclick=openSave;$("#closeSave").onclick=()=>$("#saveDialog").close();$("#saveForm").onsubmit=save;$("#resetAll").onclick=()=>{Object.keys(S.g).forEach(k=>S.g[k]="");Object.keys(S.o).forEach(k=>S.o[k]="");S.type="Rouge";$("#typeRed").classList.add("active");$("#typeWhite").classList.remove("active");wineTheme();forms();calc();tab("grape")};D.grapes.forEach(g=>{let o=document.createElement("option");o.value=g.name;$("#grapeNames").append(o)});wineTheme();forms();ref();treeRender();histRender();calc();if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{})})();