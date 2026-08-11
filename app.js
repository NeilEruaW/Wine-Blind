
(() => {
  const D = window.WSET_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  const state = {
    type: "Rouge",
    grape: {acid:"",tannin:"",alcohol:"",body:"",color:"",intensity:"",fruit:"",signature:"",texture:""},
    origin: {climate:"",maturity:"",oak:"",marker:""},
    grapeResults: [],
    originResults: []
  };

  const structureFields = [
    ["acid","Acidité"],["tannin","Tanins"],["alcohol","Alcool"],
    ["body","Corps"],["color","Couleur / intensité"],["intensity","Intensité aromatique"]
  ];
  const markerFields = [
    ["fruit","Famille de fruit",D.options.fruit],
    ["signature","Marqueur signature",D.options.signature],
    ["texture","Texture / élevage",D.options.texture]
  ];
  const originFields = [
    ["climate","Climat perçu",D.options.climate],
    ["maturity","Maturité du fruit",D.options.maturity],
    ["oak","Bois",D.options.oak],
    ["marker","Marqueur dominant",D.options.originMarker]
  ];

  const level = v => ({"F":1,"M-":2,"M":3,"M+":4,"E":5}[v] || 0);
  const compat = d => d<=.01?1:d<=.5?.92:d<=1?.82:d<=1.5?.65:d<=2?.42:d<=2.5?.20:.05;
  const contains = (hay, needle) => (hay || "").toLowerCase().includes((needle || "").toLowerCase());

  function makeSelect(key,label,options,target,disabled=false){
    const wrap=document.createElement("div"); wrap.className="field";
    const lab=document.createElement("label"); lab.textContent=label; lab.htmlFor=target+"-"+key;
    const sel=document.createElement("select"); sel.id=target+"-"+key; sel.dataset.key=key; sel.disabled=disabled;
    (options || D.options.sat).forEach(v=>{
      const o=document.createElement("option"); o.value=v; o.textContent=v || "Non renseigné"; sel.appendChild(o);
    });
    sel.value = target==="origin" ? state.origin[key] : state.grape[key];
    sel.addEventListener("change",()=>{
      if(target==="origin") state.origin[key]=sel.value; else state.grape[key]=sel.value;
      recalc();
    });
    wrap.append(lab,sel); return wrap;
  }

  function renderForms(){
    const s=$("#structureFields"); s.innerHTML="";
    structureFields.forEach(([k,l])=>{
      if(k==="tannin" && state.type==="Blanc") return;
      s.appendChild(makeSelect(k,l,D.options.sat,"grape"));
    });
    const m=$("#markerFields"); m.innerHTML="";
    markerFields.forEach(([k,l,o])=>m.appendChild(makeSelect(k,l,o,"grape")));
    const of=$("#originFields"); of.innerHTML="";
    originFields.forEach(([k,l,o])=>of.appendChild(makeSelect(k,l,o,"origin")));
  }

  function grapeScore(g){
    if(g.type!==state.type) return 0;
    const w=D.weights.grape;
    let num=0, den=0, contradictions=0;
    const structural=[
      ["acid","acid",w.acid,true],["tannin","tannin",w.tannin,state.type==="Rouge"],
      ["alcohol","alcohol",w.alcohol,true],["body","body",w.body,true],
      ["color","color",w.color,true],["intensity","intensity",w.intensity,true]
    ];
    structural.forEach(([sk,gk,weight,enabled],i)=>{
      if(!enabled) return;
      const obs=level(state.grape[sk]); if(!obs) return;
      const cand=Number(g[gk]); if(!Number.isFinite(cand)) return;
      num += weight*5*compat(Math.abs(cand-obs)); den += weight*5;
      if(["acid","tannin","alcohol","body"].includes(sk) && Math.abs(cand-obs)>=2) contradictions++;
    });
    const markers=[
      ["fruit","fruitCompatible",w.fruit,.30],
      ["signature","signaturesCompatible",w.signature,.10],
      ["texture","textureCompatible",w.texture,.30]
    ];
    markers.forEach(([sk,gk,weight,residual])=>{
      const obs=state.grape[sk]; if(!obs) return;
      num += weight*5*(contains(g[gk],obs)?1:residual); den += weight*5;
    });
    if(!den) return 0;
    let score=num/den*100;
    if(contradictions>=4) score*=.65; else if(contradictions===3) score*=.80;
    return score;
  }

  function originFit(o){
    const w=D.weights.origin;
    let num=0,den=0,contradictions=0;
    const structural=[
      ["acid","acid",w.acid],["tannin","tannin",w.tannin],
      ["alcohol","alcohol",w.alcohol],["body","body",w.body],["color","color",w.color]
    ];
    structural.forEach(([sk,ok,weight])=>{
      if(sk==="tannin" && state.type==="Blanc") return;
      const obs=level(state.grape[sk]); if(!obs) return;
      const cand=Number(o[ok]); if(!Number.isFinite(cand)) return;
      num += weight*5*compat(Math.abs(cand-obs)); den += weight*5;
      if(["acid","tannin","alcohol","body"].includes(sk) && Math.abs(cand-obs)>=2) contradictions++;
    });

    const threeLevel = [
      ["climate","climate",w.climate,{"Frais":1,"Tempéré":2,"Chaud":3}],
      ["maturity","maturity",w.maturity,{"Frais":1,"Mûr":2,"Très mûr / séché":3}],
      ["oak","oak",w.oak,{"Faible":1,"Modéré":2,"Marqué":3}]
    ];
    threeLevel.forEach(([sk,ok,weight,map])=>{
      const v=state.origin[sk]; if(!v) return;
      const obs=map[v], cand=Number(o[ok]); if(!obs || !Number.isFinite(cand)) return;
      const d=Math.abs(cand-obs);
      num += weight*5*(d===0?1:d===1?.82:.50); den += weight*5;
    });
    if(state.origin.marker){
      num += w.marker*5*(o.marker===state.origin.marker?1:.35); den += w.marker*5;
    }
    if(!den) return 0;
    let score=num/den*100;
    if(contradictions>=4) score*=.65; else if(contradictions===3) score*=.80;
    return score;
  }

  function recalc(){
    state.grapeResults=D.grapes
      .map(g=>({...g,score:grapeScore(g)}))
      .filter(g=>g.type===state.type && g.score>0)
      .sort((a,b)=>b.score-a.score)
      .slice(0,10);
    const rank=new Map(state.grapeResults.map((g,i)=>[g.name,{rank:i+1,score:g.score}]));
    const ow=D.weights.origin;
    state.originResults=D.origins
      .filter(o=>rank.has(o.grape))
      .map(o=>{
        const prior=rank.get(o.grape);
        const fit=originFit(o);
        return {...o,grapeScore:prior.score,grapeRank:prior.rank,fit,
          score:ow.grapePrior*prior.score + ow.styleFit*fit};
      })
      .sort((a,b)=>b.score-a.score)
      .slice(0,10);
    renderResults(); renderInherited();
  }

  function resultCard(item,i,origin=false){
    const div=document.createElement("div"); div.className="result-card";
    const meta=origin ? (item.diagnostic||"") : (item.keyMarker||"");
    div.innerHTML=`
      <div class="result-top">
        <span class="rank">${i+1}</span>
        <div>
          <div class="result-name">${origin?item.style:item.name}</div>
          ${origin?`<div class="result-origin">${item.grape} · ${item.region}</div>`:""}
        </div>
        <span class="score">${Math.round(item.score)}</span>
      </div>
      <div class="bar"><span style="width:${Math.max(2,Math.min(100,item.score))}%"></span></div>
      <div class="result-meta">${meta}</div>`;
    div.addEventListener("click",()=>origin?showOrigin(item):showGrape(item));
    return div;
  }

  function renderResults(){
    const gr=$("#grapeResults"); gr.innerHTML="";
    if(!state.grapeResults.length) gr.innerHTML='<div class="empty">Renseigne au moins un critère pour lancer le diagnostic.</div>';
    state.grapeResults.forEach((g,i)=>gr.appendChild(resultCard(g,i,false)));
    $("#grapeCount").textContent=state.grapeResults.length?`${state.grapeResults.length} candidats affichés`:"";

    const or=$("#originResults"); or.innerHTML="";
    if(!state.originResults.length) or.innerHTML='<div class="empty">Le Top 10 origine apparaît dès qu’un diagnostic cépage est disponible.</div>';
    state.originResults.forEach((o,i)=>or.appendChild(resultCard(o,i,true)));
  }

  function renderInherited(){
    const el=$("#inheritedSummary"); el.innerHTML="";
    [["Acidité","acid"],["Tanins","tannin"],["Alcool","alcohol"],["Corps","body"],["Couleur","color"]].forEach(([l,k])=>{
      if(k==="tannin" && state.type==="Blanc") return;
      const v=state.grape[k]; if(!v) return;
      const p=document.createElement("span"); p.className="pill"; p.textContent=`${l} · ${v}`; el.appendChild(p);
    });
    if(state.grapeResults[0]){
      const p=document.createElement("span"); p.className="pill"; p.textContent=`Top 1 · ${state.grapeResults[0].name}`; el.appendChild(p);
    }
  }

  function showGrape(g){
    $("#detailType").textContent=`${g.type} · Cépage`;
    $("#detailTitle").textContent=g.name;
    $("#detailBody").innerHTML=`
      <div class="detail-grid">
        ${metric("Acidité",g.acid)}${g.type==="Rouge"?metric("Tanins",g.tannin):""}
        ${metric("Alcool",g.alcohol)}${metric("Corps",g.body)}${metric("Couleur",g.color)}${metric("Intensité",g.intensity)}
      </div>
      ${block("Marqueur clé",g.keyMarker)}
      ${block("À différencier de",g.differentiation)}
      ${block("Contre-indices",g.redFlags)}
      ${block("Arômes / profil",g.primaryAromas)}
      ${block("Régions emblématiques",g.regions)}
      ${block("Styles",g.styles)}
      ${block("Confusions fréquentes",g.confusions)}
    `;
    $("#detailDialog").showModal();
  }

  function showOrigin(o){
    $("#detailType").textContent=`${o.grape} · Origine / style`;
    $("#detailTitle").textContent=o.style;
    $("#detailBody").innerHTML=`
      <div class="detail-grid">
        ${metric("Score combiné",Math.round(o.score))}
        ${metric("Cépage",Math.round(o.grapeScore))}
        ${metric("Style",Math.round(o.fit))}
      </div>
      ${block("Région",o.region)}
      ${block("Pourquoi ça colle",o.diagnostic)}
      ${block("À vérifier",o.differentiation)}
      ${block("Confusions",o.confusions)}
    `;
    $("#detailDialog").showModal();
  }
  const metric=(l,v)=>`<div class="metric"><b>${v??"—"}</b><span>${l}</span></div>`;
  const block=(l,v)=>v?`<div class="detail-block"><b>${l}</b><p>${v}</p></div>`:"";

  function setTab(name){
    $$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
    $$(".screen").forEach(s=>s.classList.toggle("active",s.id===`tab-${name}`));
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function renderReference(filter=""){
    const list=$("#referenceList"); list.innerHTML="";
    const q=filter.trim().toLowerCase();
    D.grapes.filter(g=>!q || g.name.toLowerCase().includes(q) || (g.synonyms||"").toLowerCase().includes(q))
      .slice(0,80).forEach(g=>{
        const row=document.createElement("div"); row.className="ref-row";
        row.innerHTML=`<div><strong>${g.name}</strong><br><small>${g.type}${g.regions?` · ${g.regions.split(";")[0]}`:""}</small></div><span>›</span>`;
        row.addEventListener("click",()=>showGrape(g)); list.appendChild(row);
      });
  }

  $("#typeRed").addEventListener("click",()=>{state.type="Rouge";$("#typeRed").classList.add("active");$("#typeWhite").classList.remove("active");renderForms();recalc()});
  $("#typeWhite").addEventListener("click",()=>{state.type="Blanc";$("#typeWhite").classList.add("active");$("#typeRed").classList.remove("active");state.grape.tannin="";renderForms();recalc()});
  $$(".tab").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.tab)));
  $("#goOrigin").addEventListener("click",()=>setTab("origin"));
  $("#closeDialog").addEventListener("click",()=>$("#detailDialog").close());
  $("#searchGrape").addEventListener("input",e=>renderReference(e.target.value));
  $("#resetAll").addEventListener("click",()=>{
    Object.keys(state.grape).forEach(k=>state.grape[k]="");
    Object.keys(state.origin).forEach(k=>state.origin[k]="");
    state.type="Rouge"; $("#typeRed").classList.add("active"); $("#typeWhite").classList.remove("active");
    renderForms(); recalc(); setTab("grape");
  });

  renderForms(); renderReference(); recalc();
  if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();
