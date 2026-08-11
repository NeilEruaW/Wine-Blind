(()=>{const D=WSET_DATA,T=WSET_TREE,V=window.WSET_V106||{grapeAppellations:{},appellations:[],blends:[]},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const S={type:"Rouge",blend:null,g:{acid:"",tannin:"",alcohol:"",body:"",color:"",intensity:"",fruit:"",signature:"",texture:""},o:{climate:"",maturity:"",oak:"",marker:""},gr:[],or:[],tree:{cur:"1",stack:[]},compare:new Set(),refFilter:"all"};
const L={acid:"Acidité",tannin:"Tanins",alcohol:"Alcool",body:"Corps",color:"Couleur",intensity:"Intensité",fruit:"Fruit",signature:"Signature",texture:"Texture"},sat=["F","M-","M","M+","E"],lev=v=>({"F":1,"M-":2,"M":3,"M+":4,"E":5}[v]||0),cmp=d=>d<=.01?1:d<=.5?.92:d<=1?.82:d<=1.5?.65:d<=2?.42:d<=2.5?.2:.05,has=(a,b)=>(a||"").toLowerCase().includes((b||"").toLowerCase());
function satField(k,l){
 let w=document.createElement("div");w.className="sat-field";
 w.innerHTML=`<div class="sat-head"><div class="sat-label">${l}</div><div class="sat-value">${S.g[k]||"Non renseigné"}</div></div>`;
 let track=document.createElement("div");track.className="sat-continuum";track.setAttribute("role","slider");track.setAttribute("aria-label",l);track.setAttribute("aria-valuemin","1");track.setAttribute("aria-valuemax","5");track.setAttribute("aria-valuetext",S.g[k]||"Non renseigné");
 let buttons=[];
 sat.forEach(v=>{let x=document.createElement("button");x.type="button";x.className="sat-point"+(S.g[k]===v?" active":"");x.textContent=v;x.dataset.value=v;track.append(x);buttons.push(x)});
 let dragging=false,moved=false,startX=0,startValue="",pending="";
 const paint=v=>{pending=v;buttons.forEach(b=>b.classList.toggle("active",b.dataset.value===v));w.querySelector(".sat-value").textContent=v||"Non renseigné"};
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
function forms(){let a=$("#structureFields");a.innerHTML="";let last="";[["ŒIL","color","Couleur / intensité"],["NEZ","intensity","Intensité aromatique"],["BOUCHE","acid","Acidité"],["BOUCHE","tannin","Tanins"],["BOUCHE","body","Corps"],["BOUCHE","alcohol","Alcool"]].forEach(x=>{if(x[1]==="tannin"&&S.type==="Blanc")return;if(x[0]!==last){let h=document.createElement("div");h.className="sense-label";h.textContent=x[0];a.append(h);last=x[0]}a.append(satField(x[1],x[2]))});let m=$("#markerFields");m.innerHTML="";m.append(choiceRail("fruit","Famille de fruit",D.options.fruit,"g","Repères aromatiques — glisser ou toucher"));m.append(sel("signature","Marqueur signature",D.options.signature,"g"));m.append(choiceRail("texture","Texture / élevage",["","Bois discret / neutre","Fin / soyeux","Tendu / linéaire","Ferme / structuré","Ample / onctueux","Boisé / MLF"],"g","Du plus discret au plus marqué"));let f=$("#originFields");f.innerHTML="";f.append(choiceRail("climate","Climat perçu",D.options.climate,"o","Frais → chaud"));f.append(choiceRail("maturity","Maturité du fruit",D.options.maturity,"o","Frais → très mûr / séché"));f.append(choiceRail("oak","Bois",D.options.oak,"o","Non détecté → marqué"));f.append(sel("marker","Marqueur dominant",D.options.originMarker,"o"))}
function geval(g){if(g.type!==S.type)return{score:0,reasons:[]};let w=D.weights.grape,n=0,d=0,c=0,r=[];[["acid","acid",w.acid],["tannin","tannin",w.tannin],["alcohol","alcohol",w.alcohol],["body","body",w.body],["color","color",w.color],["intensity","intensity",w.intensity]].forEach(([sk,gk,wt])=>{if(sk==="tannin"&&S.type==="Blanc")return;let o=lev(S.g[sk]);if(!o)return;let q=Number(g[gk]);if(!Number.isFinite(q))return;let z=Math.abs(q-o);n+=wt*5*cmp(z);d+=wt*5;if(z<=.5)r.push({t:L[sk]+" très cohérent",w:0});else if(z>=2){r.push({t:L[sk]+" en tension",w:1});if(["acid","tannin","alcohol","body"].includes(sk))c++}});[["fruit","fruitCompatible",w.fruit,.3],["signature","signaturesCompatible",w.signature,.1],["texture","textureCompatible",w.texture,.3]].forEach(([sk,gk,wt,res])=>{let o=S.g[sk];if(!o)return;let hit=has(g[gk],o);n+=wt*5*(hit?1:res);d+=wt*5;if(hit)r.push({t:L[sk]+" compatible",w:0});else if(sk==="signature")r.push({t:"Signature non typique",w:1})});if(!d)return{score:0,reasons:[]};let s=n/d*100;if(c>=4)s*=.65;else if(c===3)s*=.8;return{score:s,reasons:r}}
function ofit(o){let w=D.weights.origin,n=0,d=0,c=0;[["acid","acid",w.acid],["tannin","tannin",w.tannin],["alcohol","alcohol",w.alcohol],["body","body",w.body],["color","color",w.color]].forEach(([sk,ok,wt])=>{if(sk==="tannin"&&S.type==="Blanc")return;let a=lev(S.g[sk]);if(!a)return;let q=Number(o[ok]);if(!Number.isFinite(q))return;let z=Math.abs(q-a);n+=wt*5*cmp(z);d+=wt*5;if(["acid","tannin","alcohol","body"].includes(sk)&&z>=2)c++});[["climate","climate",w.climate,{"Frais":1,"Tempéré":2,"Chaud":3}],["maturity","maturity",w.maturity,{"Frais":1,"Mûr":2,"Très mûr / séché":3}]].forEach(([sk,ok,wt,map])=>{let v=S.o[sk];if(!v)return;let a=map[v],q=Number(o[ok]);if(!a||!Number.isFinite(q))return;let z=Math.abs(q-a);n+=wt*5*(z===0?1:z===1?.82:.5);d+=wt*5});
 if(S.o.oak){let q=Number(o.oak);if(Number.isFinite(q)){let oc;if(S.o.oak==="Non détecté")oc=q<=1?.85:q===2?.35:.10;else{let a={"Faible":1,"Modéré":2,"Marqué":3}[S.o.oak],z=Math.abs(q-a);oc=z===0?1:z===1?.82:.5}n+=w.oak*5*oc;d+=w.oak*5}};if(S.o.marker){n+=w.marker*5*(o.marker===S.o.marker?1:.35);d+=w.marker*5}if(!d)return 0;let s=n/d*100;if(c>=4)s*=.65;else if(c===3)s*=.8;return s}
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nt=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
function detectBlend(){if(!S.gr.length)return null;let scores=new Map(S.gr.map((g,i)=>[g.name,{s:g.score,r:i+1}])),best=null;(V.blends||[]).filter(b=>b.type===S.type).forEach(b=>{let hits=b.grapes.filter(g=>scores.has(g)),prim=b.primary.filter(g=>scores.has(g));if(hits.length<2||!prim.length)return;let avg=hits.reduce((a,g)=>a+scores.get(g).s,0)/hits.length,coverage=hits.length/Math.min(4,b.grapes.length),primaryBoost=prim.some(g=>scores.get(g).r<=3)?10:0,score=avg*.72+coverage*18+primaryBoost;if(!best||score>best.score)best={...b,score,hits}});return best&&best.score>=62?best:null}

const GEO={
 "rhone sud":{country:"france",include:["chateauneuf du pape","gigondas","vacqueyras","lirac","tavel","cotes du rhone","cotes du rhone villages","beaumes de venise","rasteau","cairanne","vinsobres","laudun"],exclude:["cote rotie","condrieu","cornas","hermitage","crozes hermitage","saint joseph"]},
 "rhone nord":{country:"france",include:["cote rotie","condrieu","cornas","hermitage","crozes hermitage","saint joseph","saint peray"],exclude:["chateauneuf","gigondas","vacqueyras","tavel"]},
 "rhone":{country:"france",include:["cotes du rhone","chateauneuf","gigondas","vacqueyras","lirac","tavel","cote rotie","condrieu","cornas","hermitage","crozes hermitage","saint joseph","saint peray"]},
 "sud ouest":{country:"france",include:["cahors","madiran","jurancon","bergerac","monbazillac","gaillac","fronton","irouleguy","pacherenc","saint mont","cotes de gascogne","comte tolosan"]},
 "provence":{country:"france",include:["bandol","cotes de provence","coteaux d aix","coteaux varois","palette","bellet","var","maures","mont caume","alpilles"]},
 "bordeaux":{country:"france",include:["bordeaux","medoc","haut medoc","pauillac","margaux","saint estephe","saint julien","pessac leognan","graves","saint emilion","pomerol","sauternes","barsac","entre deux mers"]},
 "bourgogne":{country:"france",include:["bourgogne","chablis","gevrey","vougeot","vosne","nuits saint georges","aloxe corton","beaune","pommard","volnay","meursault","puligny","chassagne","rully","mercurey","givry","montagny","macon","pouilly fuisse","saint veran","bouzeron","saint bris"]},
 "loire":{country:"france",include:["muscadet","anjou","savennieres","saumur","vouvray","touraine","bourgueil","chinon","sancerre","pouilly fume","menetou salon","coteaux du layon","val de loire"]},
 "alsace":{country:"france",include:["alsace"]},
 "champagne":{country:"france",include:["champagne"]},
 "catalogne":{country:"espagne",include:["priorat","penedes","catalunya","cava"]},
 "castilla y leon":{country:"espagne",include:["ribera del duero","rueda","toro","bierzo","castilla y leon"]},
 "venetie":{country:"italie",include:["valpolicella","amarone","recioto","soave","prosecco","veneto","delle venezie","conegliano"]},
 "toscane":{country:"italie",include:["chianti","brunello","montalcino","vino nobile","bolgheri","toscana"]},
 "piemonte":{country:"italie",include:["barolo","barbaresco","barbera d asti","dolcetto d alba","gavi","gattinara","ghemme"]},
 "campanie":{country:"italie",include:["taurasi","fiano di avellino","greco di tufo"]},
 "sicile":{country:"italie",include:["sicilia","terre siciliane","etna"]},
 "mendoza":{country:"argentine",include:["mendoza","lujan de cuyo","uco valley","maipu"]},
 "salta":{country:"argentine",include:["salta","cafayate"]},
 "californie":{country:"etats unis",include:["california","napa","oakville","rutherford","stags leap","sonoma","russian river","carneros","paso robles","santa barbara","monterey","lodi","mendocino","santa cruz"]},
 "columbia valley":{country:"etats unis",include:["columbia valley","yakima valley"]},
 "oregon":{country:"etats unis",include:["willamette valley"]},
 "maipo valley":{country:"chili",include:["maipo valley"]},
 "central valley":{country:"chili",include:["central valley","cachapoal","colchagua","curico","maule","rapel"]},
 "barossa valley":{country:"australie",include:["barossa valley"]},
 "mclaren vale":{country:"australie",include:["mclaren vale"]},
 "south australia":{country:"australie",include:["barossa","eden valley","clare valley","adelaide hills","mclaren vale","coonawarra","south australia"]},
 "western australia":{country:"australie",include:["margaret river","great southern","western australia"]},
 "victoria":{country:"australie",include:["yarra valley","mornington","geelong","heathcote","goulburn","victoria"]},
 "new south wales":{country:"australie",include:["hunter valley","riverina","new south wales"]},
 "western cape":{country:"afrique du sud",include:["western cape","stellenbosch","paarl","swartland","constantia","walker bay","hemel en aarde","elgin","robertson","worcester","durbanville"]},
 "marlborough":{country:"nouvelle zelande",include:["marlborough"]},
 "hawke s bay":{country:"nouvelle zelande",include:["hawke s bay"]},
 "central otago":{country:"nouvelle zelande",include:["central otago"]},
 "martinborough":{country:"nouvelle zelande",include:["martinborough","wairarapa"]},
 "mosel":{country:"allemagne",include:["mosel","bernkastel","wehlen","piesport"]},
 "rheingau":{country:"allemagne",include:["rheingau","rudesheim","johannisberg"]},
 "pfalz":{country:"allemagne",include:["pfalz","forst","deidesheim"]},
 "tokaj":{country:"hongrie",include:["tokaj"]},
 "santorin":{country:"grece",include:["santorini"]},
 "naoussa":{country:"grece",include:["naoussa"]},
 "nemea":{country:"grece",include:["nemea"]}
};
function geoRule(o){
 let r=nt(o.region),s=nt(o.style),hay=r+" "+s,keys=Object.keys(GEO).sort((a,b)=>b.length-a.length);
 return keys.map(k=>[k,GEO[k]]).find(([k])=>hay.includes(k))?.[1]||null
}
function countryCompatible(a,o,rule){
 if(rule&&rule.country)return nt(a.country).includes(rule.country)||rule.country.includes(nt(a.country));
 let r=nt(o.region);
 const countries=["france","italie","espagne","portugal","allemagne","autriche","hongrie","grece","argentine","chili","australie","canada","uruguay","chine","afrique du sud","nouvelle zelande"];
 let c=countries.find(x=>r.includes(x)); if(!c&&r.includes("usa"))c="etats unis";
 return !c||nt(a.country).includes(c)||c.includes(nt(a.country))
}
function appInMotherRegion(a,o){
 let rule=geoRule(o),hay=nt([a.name,a.region,a.country].join(" "));
 if(!countryCompatible(a,o,rule))return false;
 if(rule){
   if((rule.exclude||[]).some(x=>hay.includes(x)))return false;
   return (rule.include||[]).some(x=>hay.includes(x))
 }
 let rn=nt(o.region),tokens=rn.split(" ").filter(x=>x.length>4&&!["france","italie","espagne","australie","argentine","chili"].includes(x));
 return !tokens.length||tokens.some(t=>hay.includes(t))
}
function appScore(a,o){
 let score=0,gn=nt(o.grape),an=nt(a.grapes),hay=nt([a.name,a.region].join(" "));
 if(an.includes(gn)||gn.includes(an))score+=48;
 if(nt(o.style).includes(nt(a.name))||nt(a.name).includes(nt(o.style)))score+=26;
 if(a.wset)score+=12;
 if((a.confidence||"").toLowerCase().includes("très"))score+=9;else if(a.confidence)score+=5;
 let rn=nt(o.region),matches=rn.split(" ").filter(x=>x.length>4&&hay.includes(x)).length;score+=Math.min(15,matches*5);
 return score
}
function appsForOrigin(o,limit=3){
 return(V.appellations||[]).filter(a=>appInMotherRegion(a,o)).map(a=>({...a,_s:appScore(a,o)})).filter(a=>a._s>=45)
 .sort((a,b)=>b._s-a._s||Number(!!b.wset)-Number(!!a.wset))
 .filter((a,i,arr)=>arr.findIndex(x=>nt(x.name)===nt(a.name)&&nt(x.country)===nt(a.country))===i).slice(0,limit)
}
function blendForOrigin(o){
 if(!S.blend)return null;
 let b=S.blend,oh=nt(o.region+" "+o.style),bh=nt(b.country+" "+b.region),sameCountry=!b.country||oh.includes(nt(b.country))||nt(o.region).includes(nt(b.country));
 let rule=geoRule(o);
 if(rule&&b.country&&nt(b.country)!==rule.country)return null;
 let regionHit=nt(b.region).split(" ").filter(x=>x.length>4).some(t=>oh.includes(t))||nt(o.style).includes(nt(b.region));
 let grapeHit=b.grapes.includes(o.grape);
 return grapeHit&&(regionHit||sameCountry&&(!rule||appInMotherRegion({country:b.country,region:b.region,name:b.region},o)))?b:null
}
function blendRender(){let e=$("#blendInsight");if(!e)return;S.blend=detectBlend();if(!S.blend){e.classList.add("hidden");e.innerHTML="";return}e.classList.remove("hidden");e.innerHTML=`<div><span>ASSEMBLAGE COMPATIBLE</span><b>${esc(S.blend.name)}</b><small>${esc(S.blend.hits.join(" + "))}</small></div><div class="blend-score">${Math.round(S.blend.score)}</div>`}
function calc(){S.gr=D.grapes.map(g=>({...g,...geval(g)})).filter(g=>g.type===S.type&&g.score>0).sort((a,b)=>b.score-a.score).slice(0,10);S.blend=detectBlend();let map=new Map(S.gr.map((g,i)=>[g.name,{score:g.score,rank:i+1}])),w=D.weights.origin;S.or=D.origins.filter(o=>map.has(o.grape)).map(o=>{let p=map.get(o.grape),fit=ofit(o),blendBonus=S.blend&&S.blend.grapes.includes(o.grape)&&nt(o.region+" "+o.style).split(" ").some(t=>t.length>4&&nt(S.blend.region+" "+S.blend.country).includes(t))?5:0;return{...o,grapeScore:p.score,fit,score:Math.min(100,w.grapePrior*p.score+w.styleFit*fit+blendBonus)}}).sort((a,b)=>b.score-a.score).slice(0,10);results();inherited()}
function reasons(r){r=(r||[]).slice(0,4);return r.length?`<div class="reason-box"><div class="reason-chips">${r.map(x=>`<span class="reason-chip ${x.w?"warn":""}">${x.t}</span>`).join("")}</div></div>`:""}
function card(x,i,orig){let e=document.createElement("div");e.className="result-card";let apps=orig?appsForOrigin(x,3):[],appHtml=orig&&apps.length?`<div class="app-chips">${apps.map(a=>`<span>${esc(a.name)}</span>`).join("")}</div>`:"";e.innerHTML=`<div class="result-top"><span class="rank">${i+1}</span><div><div class="result-name">${orig?x.style:x.name}</div>${orig?`<div class="result-origin">${x.grape} · ${x.region}</div>`:""}</div><span class="score">${Math.round(x.score)}</span></div><div class="bar"><span style="width:${Math.max(2,Math.min(100,x.score))}%"></span></div><div class="result-meta">${orig?(x.diagnostic||""):(x.keyMarker||"")}</div>${appHtml}${orig?`<div class="reason-box"><div class="reason-chips"><span class="reason-chip">Cépage ${Math.round(x.grapeScore)}</span><span class="reason-chip neutral">Style ${Math.round(x.fit)}</span></div></div>`:reasons(x.reasons)}`;e.onclick=()=>orig?showO(x):showG(x);return e}
function diagnosticMeta(){
 let keys=S.type==="Rouge"?["color","intensity","acid","tannin","body","alcohol","fruit","signature","texture"]:["color","intensity","acid","body","alcohol","fruit","signature","texture"];
 let filled=keys.filter(k=>S.g[k]).length,ratio=filled/keys.length;
 let label=ratio>=.78?"Élevée":ratio>=.45?"Moyenne":"Faible";
 $("#diagnosticConfidence").textContent=`Confiance ${label.toLowerCase()} · ${filled}/${keys.length}`;
 $("#diagnosticConfidence").className=`confidence-badge conf-${label.toLowerCase()}`;
 $("#completionBar span").style.width=`${Math.round(ratio*100)}%`;
}
function nextCheck(){
 let e=$("#nextCheck");if(S.gr.length<2){e.classList.add("hidden");return}
 let top=S.gr.slice(0,4),fields=[["color","Couleur / intensité"],["intensity","Intensité aromatique"],["acid","Acidité"],["tannin","Tanins"],["body","Corps"],["alcohol","Alcool"]];
 let best=null;
 fields.forEach(([k,l])=>{if(k==="tannin"&&S.type==="Blanc")return;let vals=top.map(g=>Number(g[k])).filter(Number.isFinite);if(vals.length<2)return;let spread=Math.max(...vals)-Math.min(...vals),unfilled=!S.g[k];let utility=spread*(unfilled?1.45:.65);if(!best||utility>best.u)best={k,l,u:utility,spread,unfilled}});
 if(!best||best.spread<.6){e.classList.add("hidden");return}
 e.classList.remove("hidden");e.innerHTML=`<b>🔎 À vérifier maintenant</b><span>${best.l} — c’est actuellement l’un des critères qui sépare le mieux les premiers candidats${best.unfilled?" et il n’est pas encore renseigné":""}.</span>`;
}
function compareRender(){
 let panel=$("#comparePanel"),btn=$("#compareBtn"),arr=S.gr.filter(g=>S.compare.has(g.name)).slice(0,3);
 btn.classList.toggle("hidden",arr.length<2);btn.textContent=arr.length>=2?`Comparer ${arr.length} candidats`:"Comparer";
 if(arr.length<2){panel.classList.add("hidden");panel.innerHTML="";return}
 if(panel.classList.contains("hidden"))return;
 let fields=[["acid","Acidité"],["tannin","Tanins"],["alcohol","Alcool"],["body","Corps"],["color","Couleur"],["intensity","Intensité"]];
 let rows=fields.filter(([k])=>!(k==="tannin"&&S.type==="Blanc")).map(([k,l])=>`<tr><th>${l}</th>${arr.map(g=>`<td>${g[k]??"—"}</td>`).join("")}</tr>`).join("");
 panel.innerHTML=`<div class="compare-head"><b>Comparaison</b><button id="closeCompare" class="close-mini">×</button></div><div class="compare-scroll"><table><thead><tr><th></th>${arr.map(g=>`<th>${g.name}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div><p class="compare-tip">Vérifie en priorité les lignes où les niveaux diffèrent nettement : elles ont le meilleur pouvoir discriminant.</p>`;
 $("#closeCompare").onclick=()=>panel.classList.add("hidden");
}
function results(){blendRender();let a=$("#grapeResults");a.innerHTML=S.gr.length?"":'<div class="empty">Renseigne au moins un critère.</div>';S.gr.forEach((x,i)=>{let wrap=document.createElement("div");wrap.className="candidate-wrap";let c=card(x,i,0);wrap.append(c);let b=document.createElement("button");b.className="compare-toggle"+(S.compare.has(x.name)?" active":"");b.textContent=S.compare.has(x.name)?"✓ Comparer":"+ Comparer";b.onclick=e=>{e.stopPropagation();if(S.compare.has(x.name))S.compare.delete(x.name);else if(S.compare.size<3)S.compare.add(x.name);results()};wrap.append(b);a.append(wrap)});$("#grapeCount").textContent=S.gr.length?S.gr.length+" candidats":"";diagnosticMeta();nextCheck();compareRender();let b=$("#originResults");b.innerHTML=S.or.length?"":'<div class="empty">Le Top 10 apparaît après le diagnostic cépage.</div>';S.or.forEach((x,i)=>b.append(card(x,i,1)))}
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
function showG(g){let f=favs(),sig=g.keyMarker||g.differentiation||"";$("#detailType").textContent=g.type+" · Cépage";$("#detailTitle").textContent=g.name;$("#detailBody").innerHTML=`<button id="detailFav" class="favorite-detail ${f.has(g.name)?"active":""}">${f.has(g.name)?"♥ À réviser":"♡ Ajouter à réviser"}</button><div class="identity-signature"><span>SIGNATURE AVEUGLE</span><strong>${sig}</strong></div><div class="detail-grid">${met("Acidité",g.acid,true)}${g.type==="Rouge"?met("Tanins",g.tannin,true):""}${met("Alcool",g.alcohol,true)}${met("Corps",g.body,true)}${met("Couleur",g.color,true)}${met("Intensité",g.intensity,true)}</div>${blk("Arômes & marqueurs",g.primaryAromas)}${productionHTML(g)}${grapeAppsHTML(g)}${grapeBlendsHTML(g)}${blk("Comment le départager",g.differentiation)}${blk("Contre-indices",g.redFlags)}${blk("Confusions fréquentes",g.confusions)}`;$("#detailFav").onclick=()=>{toggleFav(g.name);showG(g)};$("#detailDialog").showModal()}
function showO(o){let apps=appsForOrigin(o,8),b=blendForOrigin(o),appBlock=apps.length?`<div class="detail-block"><b>Appellations de cette région</b><div class="origin-app-list">${apps.map(a=>`<div><strong>${esc(a.name)}</strong><span>${esc(a.country)}${a.region?" · "+esc(a.region):""}</span><small>${esc(a.blend||a.grapes)}</small></div>`).join("")}</div></div>`:"";$("#detailType").textContent=o.grape+" · Origine";$("#detailTitle").textContent=o.style;$("#detailBody").innerHTML=`<div class="origin-score-hero"><span>SCORE GLOBAL</span><strong>${Math.round(o.score)}</strong></div><div class="origin-subscores"><div><span>Cépage</span><b>${Math.round(o.grapeScore)}</b></div><div><span>Style</span><b>${Math.round(o.fit)}</b></div></div>${b?blk("Assemblage compatible",`${b.name} — ${b.logic}`):""}${blk("Région",o.region)}${appBlock}${blk("Pourquoi ça colle",o.diagnostic)}${blk("À vérifier",o.differentiation)}${blk("Confusions",o.confusions)}`;$("#detailDialog").showModal()}
function tab(n){$$(".tab").forEach(x=>x.classList.toggle("active",x.dataset.tab===n));$$(".screen").forEach(x=>x.classList.toggle("active",x.id==="tab-"+n));if(n==="history")histRender();scrollTo({top:0,behavior:"smooth"})}
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
function ref(q=""){
 let l=$("#referenceList");l.innerHTML="";let nq=nt(q),f=favs();
 D.grapes.filter(g=>{
   if(S.refFilter==="Rouge"&&g.type!=="Rouge"||S.refFilter==="Blanc"&&g.type!=="Blanc"||S.refFilter==="fav"&&!f.has(g.name))return false;
   return !nq||grapeSearchText(g).includes(nq)
 }).slice(0,100).forEach(g=>{
   let r=document.createElement("div");r.className="ref-row";let ctx=searchContext(g,q),zones=Object.keys(g.productionWorld||{}).slice(0,3).join(" · ");
   r.innerHTML=`<div><strong>${g.name}</strong><br><small>${ctx||g.type+(zones?" · "+zones:"")}</small></div><div class="ref-actions"><button class="fav-btn ${f.has(g.name)?"active":""}" aria-label="À réviser">${f.has(g.name)?"♥":"♡"}</button><span>›</span></div>`;
   r.onclick=()=>showG(g);r.querySelector(".fav-btn").onclick=e=>{e.stopPropagation();toggleFav(g.name)};l.append(r)
 })
}function quizNew(){
 let pool=D.grapes.filter(g=>g.type===S.type),answer=pool[Math.floor(Math.random()*pool.length)];
 let others=pool.filter(g=>g.name!==answer.name).sort(()=>Math.random()-.5).slice(0,3),choices=[answer,...others].sort(()=>Math.random()-.5);
 let clues=[`Couleur ${answer.color} · Acidité ${answer.acid}${answer.type==="Rouge"?` · Tanins ${answer.tannin}`:""}`,answer.primaryAromas||answer.keyMarker,answer.regions?`Régions typiques : ${answer.regions.split(";").slice(0,2).join(", ")}`:""].filter(Boolean);
 $("#quizClues").innerHTML=clues.map((x,i)=>`<div class="quiz-clue"><b>${i+1}</b><span>${x}</span></div>`).join("");
 $("#quizChoices").innerHTML="";$("#quizFeedback").classList.add("hidden");$("#quizFeedback").innerHTML="";
 choices.forEach(g=>{let b=document.createElement("button");b.className="quiz-choice";b.textContent=g.name;b.onclick=()=>{let ok=g.name===answer.name;$("#quizFeedback").classList.remove("hidden");$("#quizFeedback").innerHTML=`<b>${ok?"✓ Bonne réponse":"✗ "+answer.name}</b><p>${answer.keyMarker||answer.differentiation||""}</p>`;$$(".quiz-choice").forEach(x=>x.disabled=true)};$("#quizChoices").append(b)})
}
function treeRender(){let n=T[S.tree.cur];$("#treeStep").textContent="Étape "+n.id;$("#treeQuestion").textContent=n.q;$("#treeTip").textContent=n.tip;$("#treeOrientation").classList.add("hidden");$("#treeBack").style.visibility=S.tree.stack.length?"visible":"hidden"}
function treeAns(y){let n=T[S.tree.cur],txt=y?n.yesText:n.noText,nx=y?n.yesNext:n.noNext;S.tree.stack.push({id:n.id,a:y?"Oui":"Non",text:txt});$("#treeOrientation").textContent=txt;$("#treeOrientation").classList.remove("hidden");trail();setTimeout(()=>{if(nx==="BACK")back();else if(nx==="ORIGIN")tab("origin");else if(nx==="GRAPE")tab("grape");else if(T[nx]){S.tree.cur=nx;treeRender();trail()}},650)}
function back(){let x=S.tree.stack.pop();if(x)S.tree.cur=x.id;treeRender();trail()}function trail(){let e=$("#treeTrail");e.innerHTML="";S.tree.stack.slice(-6).forEach(x=>{let d=document.createElement("div");d.className="trail-item";d.innerHTML=`<b>${x.id} · ${x.a}</b> — ${x.text}`;e.append(d)})}
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
$("#typeRed").onclick=()=>{S.type="Rouge";$("#typeRed").classList.add("active");$("#typeWhite").classList.remove("active");forms();calc()};$("#typeWhite").onclick=()=>{S.type="Blanc";S.g.tannin="";$("#typeWhite").classList.add("active");$("#typeRed").classList.remove("active");forms();calc()};$$(".tab").forEach(b=>b.onclick=()=>tab(b.dataset.tab));$("#goOrigin").onclick=()=>tab("origin");$("#closeDialog").onclick=()=>$("#detailDialog").close();$("#searchGrape").oninput=e=>ref(e.target.value);$$(".filter-chip").forEach(b=>b.onclick=()=>{$$(".filter-chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");S.refFilter=b.dataset.ref;ref($("#searchGrape").value)});$("#modeTree").onclick=()=>{$("#modeTree").classList.add("active");$("#modeQuiz").classList.remove("active");$("#treeMode").classList.remove("hidden");$("#quizMode").classList.add("hidden")};$("#modeQuiz").onclick=()=>{$("#modeQuiz").classList.add("active");$("#modeTree").classList.remove("active");$("#quizMode").classList.remove("hidden");$("#treeMode").classList.add("hidden");quizNew()};$("#newQuiz").onclick=quizNew;$("#treeYes").onclick=()=>treeAns(1);$("#treeNo").onclick=()=>treeAns(0);$("#treeBack").onclick=back;$("#treeRestart").onclick=()=>{S.tree={cur:"1",stack:[]};treeRender();trail()};$("#compareBtn").onclick=()=>{$("#comparePanel").classList.remove("hidden");compareRender()};$("#saveTasting").onclick=openSave;$("#saveTastingOrigin").onclick=openSave;$("#closeSave").onclick=()=>$("#saveDialog").close();$("#saveForm").onsubmit=save;$("#resetAll").onclick=()=>{Object.keys(S.g).forEach(k=>S.g[k]="");Object.keys(S.o).forEach(k=>S.o[k]="");S.type="Rouge";forms();calc();tab("grape")};D.grapes.forEach(g=>{let o=document.createElement("option");o.value=g.name;$("#grapeNames").append(o)});forms();ref();treeRender();histRender();calc();if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{})})();