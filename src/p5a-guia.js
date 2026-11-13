/* ============================================================
   GUIA DE SERVIÇOS AWS — para iniciantes
   O que cada serviço é, com analogia, quando usar e com quem ele
   se confunde. Duelos comparam os parecidos lado a lado. O treino
   "Qual é o serviço?" sai dos próprios dados do guia.
   Dados: GUIA (serviços) e DUELOS, em p4m-guia-dados.js.
   ============================================================ */
const GCATS=[
  ["computacao","Computação"],["conteineres","Contêineres"],["integracao","Integração e serverless"],
  ["armazenamento","Armazenamento"],["banco","Bancos de dados"],["migracao","Migração e transferência"],
  ["rede","Rede e entrega"],["seguranca","Segurança e identidade"],["gestao","Gestão e monitoramento"],
  ["custo","Custo e cobrança"],["dados","Análise de dados"],["ia","IA e machine learning"],["usuario","Usuário final e IoT"]];
const gcatNome=c=>(GCATS.find(x=>x[0]===c)||[c,c])[1];
const gserv=id=>GUIA.find(s=>s.id===id);
const gduelo=id=>DUELOS.find(d=>d.id===id);
const semAcento=t=>String(t||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const glidos=()=>S.guia||(S.guia={});
const gstatus=s=>s.status==="ativo"?"":`<span class="tag no mono" title="${esc(s.statusNota||"")}">${s.status==="fechado"?"fechado para novos clientes":"descontinuado"}</span>`;
const gprovas=p=>(p||[]).map(x=>`<span class="tag aw mono">${x==="clf"?"CLF":"SAA"}</span>`).join(" ");
const duelosDe=id=>DUELOS.filter(d=>d.cols.some(c=>c.id===id));

function viewGuia(){
  const lidos=Object.keys(glidos()).filter(id=>gserv(id)).length;
  const porCat=GCATS.map(([c,n])=>[c,n,GUIA.filter(s=>s.cat===c)]).filter(x=>x[2].length);
  return `<div class="stack-lg">
    <section>
      <h1 class="t-xl">Guia de serviços AWS</h1>
      <p class="t-md dim" style="margin-top:7px;max-width:64ch">O que cada serviço é, explicado do zero, e como não confundir com os parecidos. Comece pelos duelos: eles comparam lado a lado o que a prova mais mistura.</p>
      <div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap">
        <button class="btn fill sm" data-act="gq-start">Treinar: qual é o serviço?</button>
        <span class="t-xs dim2">${lidos} de ${GUIA.length} serviços abertos</span>
      </div>
    </section>

    <section class="stack">
      <div class="hd"><h2>Duelos</h2><span class="n">${DUELOS.length} comparações</span></div>
      <div class="gd-grid">${DUELOS.map(d=>`<button class="gd-card" data-act="gduelo" data-id="${d.id}">
        <span class="t">${esc(d.titulo)}</span>
        <span class="c">${d.cols.map(c=>esc(c.rot)).join(" · ")}</span>
        <span class="p">${gprovas(d.provas)}</span></button>`).join("")}</div>
    </section>

    <section class="stack" id="glista">
      <div class="hd"><h2>Todos os serviços</h2><span class="n" id="gcount">${GUIA.length}</span></div>
      <label class="gs-busca"><span class="sr-only">Buscar serviço</span>
        <input id="gsearch" type="search" autocomplete="off" placeholder="Buscar: fila, cache, backup, S3…" value="${esc(V.gq||"")}"></label>
      <div class="row" role="group" aria-label="Filtrar por prova" style="gap:6px;flex-wrap:wrap">
        ${[["all","Todas as provas"],["clf","Cai no CLF"],["saa","Cai no SAA"]].map(([k,t])=>
          `<button class="btn sm" data-act="gprova" data-p="${k}" aria-pressed="${(V.gp||"all")===k}">${t}</button>`).join("")}
      </div>
      <p class="t-sm dim" id="gvazio" hidden>Nenhum serviço encontrado. Tente outra palavra, como “fila”, “disco” ou “certificado”.</p>
      ${porCat.map(([c,n,lst])=>`<div class="gs-cat" data-cat="${c}">
        <h3 class="t-sm gs-h">${esc(n)}</h3>
        <div class="gs-grid">${lst.map(s=>`<button class="gs-card" data-act="gserv" data-id="${s.id}" data-p="${s.provas.join(" ")}"
          data-q="${esc(semAcento([s.nome,s.uma,s.cat,gcatNome(s.cat),...(s.chave||[])].join(" ")))}">
          <span class="nm">${esc(s.nome)}${glidos()[s.id]?' <span class="dim2" aria-label="já aberto">·</span>':""}</span>
          <span class="um">${esc(s.uma)}</span>
          <span class="pv">${gprovas(s.provas)} ${gstatus(s)}</span></button>`).join("")}</div>
      </div>`).join("")}
    </section>
  </div>`;
}
/* filtro sem re-render: mantém o foco e o texto do campo de busca */
function guiaFiltra(){
  const q=semAcento((document.getElementById("gsearch")||{}).value||"").trim();
  V.gq=q;
  const p=V.gp||"all"; let n=0;
  document.querySelectorAll(".gs-card").forEach(c=>{
    const okq=!q||q.split(/\s+/).every(t=>c.dataset.q.includes(t));
    const okp=p==="all"||c.dataset.p.split(" ").includes(p);
    c.hidden=!(okq&&okp); if(!c.hidden) n++;
  });
  document.querySelectorAll(".gs-cat").forEach(g=>{ g.hidden=![...g.querySelectorAll(".gs-card")].some(c=>!c.hidden); });
  const ct=document.getElementById("gcount"); if(ct) ct.textContent=n;
  const vz=document.getElementById("gvazio"); if(vz) vz.hidden=n>0;
}

function viewServ(){
  const s=gserv(V.id);
  if(!s) return viewGuia();
  if(!glidos()[s.id]){ glidos()[s.id]=Date.now(); save(); }
  const ds=duelosDe(s.id);
  return `<div class="stack-lg">
    <button class="btn ghost sm" data-act="guia" style="align-self:flex-start">← Guia de serviços</button>
    <section>
      <p class="t-xs dim mono">${esc(gcatNome(s.cat))}</p>
      <h1 class="t-xl" style="margin-top:2px">${esc(s.nome)}</h1>
      <p class="t-md" style="margin-top:7px;max-width:64ch">${esc(s.uma)}</p>
      <p style="margin-top:8px">${gprovas(s.provas)} ${gstatus(s)}</p>
      ${s.status!=="ativo"?`<div class="note" style="margin-top:10px"><b>Situação atual.</b> ${esc(s.statusNota)}</div>`:""}
    </section>
    <section class="gs-ana"><p class="t-xs dim">Pense assim</p><p class="t-md">${esc(s.analogia)}</p></section>
    <section class="sheet"><p class="t-md" style="line-height:1.55">${esc(s.explica)}</p>
      <p class="t-sm dim" style="margin-top:10px"><b>Como cobra:</b> ${esc(s.preco)}</p></section>
    <div class="gs-2">
      <section class="sheet"><h2 class="t-sm">Quando usar</h2><ul class="gs-ul">${s.usa.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
      <section class="sheet"><h2 class="t-sm">Quando não usar</h2><ul class="gs-ul no">${s.nao.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
    </div>
    <section class="stack">
      <div class="hd"><h2>Não confunda com</h2></div>
      ${s.confunde.map(c=>{ const o=gserv(c.id); return `<button class="gs-conf" data-act="gserv" data-id="${c.id}">
        <span class="nm">${esc(o?o.nome:c.id)}</span><span class="t-sm">${esc(c.dif)}</span></button>`; }).join("")}
    </section>
    ${ds.length?`<section class="stack"><div class="hd"><h2>Duelos com ${esc(s.nome)}</h2></div>
      <div class="gd-grid">${ds.map(d=>`<button class="gd-card" data-act="gduelo" data-id="${d.id}"><span class="t">${esc(d.titulo)}</span>
        <span class="c">${d.cols.map(c=>esc(c.rot)).join(" · ")}</span></button>`).join("")}</div></section>`:""}
    <section class="sheet tight"><h2 class="t-sm">Sinais no enunciado</h2>
      <p style="margin-top:6px">${s.chave.map(k=>`<span class="tag mono" style="margin:0 4px 4px 0">${esc(k)}</span>`).join("")}</p></section>
    <p class="t-xs dim2">Fontes: ${s.src.map(x=>`<a href="${esc(x.u)}" target="_blank" rel="noopener noreferrer">${esc(x.t)}</a>`).join(" · ")}</p>
  </div>`;
}

function viewDuelo(){
  const d=gduelo(V.id);
  if(!d) return viewGuia();
  const resp=V.dres||{}, n=d.cols.length;
  const certos=d.sinais.filter((x,i)=>resp[i]===x.r).length, feitos=Object.keys(resp).length;
  return `<div class="stack-lg">
    <button class="btn ghost sm" data-act="guia" style="align-self:flex-start">← Guia de serviços</button>
    <section>
      <p class="t-xs dim mono">Duelo · ${esc(gcatNome(d.cat))}</p>
      <h1 class="t-xl" style="margin-top:2px">${esc(d.titulo)}</h1>
      <p class="t-md dim" style="margin-top:7px;max-width:64ch">${esc(d.intro)}</p>
    </section>
    <section class="gdu" style="--n:${n}">
      <div class="gdu-h"><span></span>${d.cols.map(c=>c.id&&gserv(c.id)
        ?`<button class="gdu-col" data-act="gserv" data-id="${c.id}">${esc(c.rot)}</button>`
        :`<span class="gdu-col">${esc(c.rot)}</span>`).join("")}</div>
      ${d.linhas.map(l=>`<div class="gdu-r"><span class="gdu-c">${esc(l.c)}</span>${l.v.map((v,i)=>`<span class="gdu-v" data-col="${esc(d.cols[i].rot)}">${esc(v)}</span>`).join("")}</div>`).join("")}
    </section>
    <section class="gs-ana"><p class="t-xs dim">Pense assim</p><p class="t-md">${esc(d.analogia)}</p></section>
    <section class="stack">
      <div class="hd"><h2>Teste: qual deles?</h2><span class="n">${feitos?certos+" de "+feitos:d.sinais.length+" situações"}</span></div>
      ${d.sinais.map((x,i)=>{ const r=resp[i], ok=r===x.r;
        return `<div class="sheet tight gdu-q" ${r!==undefined?`data-res="${ok?"ok":"no"}"`:""}>
          <p class="t-sm">${esc(x.s)}</p>
          ${r===undefined
            ?`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">${d.cols.map((c,k)=>`<button class="btn sm" data-act="gdu-pick" data-i="${i}" data-k="${k}">${esc(c.rot)}</button>`).join("")}</div>`
            :`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">
               <span class="tag go">✓ ${esc(d.cols[x.r].rot)}</span>${ok?"":`<span class="tag no">✗ sua escolha: ${esc(d.cols[r].rot)}</span>`}</div>`}
        </div>`; }).join("")}
    </section>
    <div class="note"><b>Pegadinha.</b> ${esc(d.pegadinha)}</div>
    <p class="t-xs dim2">Fontes: ${d.src.map(x=>`<a href="${esc(x.u)}" target="_blank" rel="noopener noreferrer">${esc(x.t)}</a>`).join(" · ")}</p>
  </div>`;
}

/* ---------- treino: qual é o serviço? ----------
   Pergunta a partir da frase, da analogia, de um sinal de prova ou de
   um sinal de duelo. Os distratores vêm de "não confunda com" e da
   mesma categoria, para treinar justamente a diferença. */
function gqMonta(n){
  const ativos=GUIA.filter(s=>s.status==="ativo");
  const qs=[];
  const opc=(certo,viz)=>{
    const pool=[...new Set([...(viz||[]),...ativos.filter(o=>o.cat===certo.cat&&o.id!==certo.id).map(o=>o.id),...shuffle(ativos).map(o=>o.id)])]
      .filter(id=>id!==certo.id&&gserv(id));
    return shuffle([certo.id,...pool.slice(0,3)]);
  };
  shuffle(ativos).forEach(s=>{
    const tipo=Math.floor(Math.random()*3);
    const viz=s.confunde.map(c=>c.id);
    if(tipo===0) qs.push({p:"Qual serviço é este?",t:s.uma,certo:s.id,ops:opc(s,viz)});
    else if(tipo===1) qs.push({p:"Qual serviço esta analogia descreve?",t:s.analogia,certo:s.id,ops:opc(s,viz)});
    else qs.push({p:"No enunciado aparece este sinal. Qual serviço ele aponta?",t:"“"+s.chave[0]+"”",certo:s.id,ops:opc(s,viz)});
  });
  DUELOS.forEach(d=>d.sinais.forEach(x=>{ const c=d.cols[x.r];
    qs.push({p:"Duelo "+d.titulo.replace(/\?$/,"")+": qual deles?",t:x.s,rot:d.cols.map(c=>c.rot),certoK:x.r}); }));
  return shuffle(qs).slice(0,n);
}
function viewGQ(){
  const G=V.gq2;
  if(!G) return viewGuia();
  const q=G.list[G.i];
  if(!q){
    const t=G.list.length, ok=G.ok;
    return `<div class="result enter">
      <h1 class="t-sm dim">Qual é o serviço?</h1>
      <div class="big ${ok/t>=.8?"ok":ok/t>=.5?"":"no"}">${ok} de ${t}</div>
      ${G.erros.length?`<p class="t-sm" style="margin-top:8px">Vale abrir estes no guia:</p>
        <div class="lst" style="margin-top:6px;max-width:420px;margin-left:auto;margin-right:auto">${[...new Set(G.erros)].slice(0,4).map(id=>{const s=gserv(id);return s?`<button class="lst-i" data-act="gserv" data-id="${id}"><span class="nm">${esc(s.nome)}</span></button>`:"";}).join("")}</div>`:""}
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn fill" data-act="gq-start">Mais 10</button>
        <button class="btn" data-act="guia">Voltar ao guia</button>
      </div></div>`;
  }
  const rotulos=q.rot?q.rot:q.ops.map(id=>gserv(id).nome);
  const certoIdx=q.rot?q.certoK:q.ops.indexOf(q.certo);
  const r=G.r;
  return `<div class="stack-lg">
    <div class="row"><h1 class="t-md">Qual é o serviço?</h1><span class="t-xs dim mono" style="margin-left:8px">${G.i+1} de ${G.list.length}</span><span style="flex:1"></span><button class="btn ghost sm" data-act="guia">Sair</button></div>
    <section class="sheet">
      <p class="t-xs dim">${esc(q.p)}</p>
      <p class="t-lg" style="margin-top:6px">${esc(q.t)}</p>
      <div class="stack" style="margin-top:12px;gap:8px">${rotulos.map((t,k)=>`<button class="opt" data-act="gq-pick" data-k="${k}" ${r!==undefined?"disabled":""}
        ${r!==undefined&&k===certoIdx?'data-res="ok"':r===k?'data-res="bad"':""}><span class="k">${"ABCD"[k]}</span><span>${esc(t)}</span></button>`).join("")}</div>
      ${r!==undefined?`<div style="margin-top:12px">
        ${!q.rot?(()=>{const s=gserv(q.certo);return `<p class="t-sm"><b>${esc(s.nome)}</b>: ${esc(s.uma)}</p>
          ${r!==certoIdx?(()=>{const e=gserv(q.ops[r]); const c=s.confunde.find(x=>x.id===e.id)||e.confunde.find(x=>x.id===s.id);
            return `<p class="t-sm dim" style="margin-top:6px">${c?esc(c.dif):"<b>"+esc(e.nome)+"</b>: "+esc(e.uma)}</p>`;})():""}`;})()
          :`<p class="t-sm">${r===certoIdx?"Certo.":"A resposta é "+esc(q.rot[certoIdx])+"."}</p>`}
        <button class="btn fill sm" data-act="gq-next" style="margin-top:10px">Próxima</button></div>`:""}
    </section></div>`;
}

/* ações do guia; devolve true se tratou */
function guiaAct(a,b){
  if(a==="guia"){ go("guia"); return true; }
  if(a==="gserv"){ go("serv",{id:b.dataset.id}); return true; }
  if(a==="gduelo"){ go("duelo",{id:b.dataset.id,dres:{}}); return true; }
  if(a==="gprova"){ V.gp=b.dataset.p;
    document.querySelectorAll('[data-act="gprova"]').forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    guiaFiltra(); return true; }
  if(a==="gdu-pick"){ const i=+b.dataset.i;
    if(V.dres[i]===undefined){ V.dres[i]=+b.dataset.k; const d=gduelo(V.id);
      if(V.dres[i]===d.sinais[i].r) addXp(2,"duelo"); render(); }
    return true; }
  if(a==="gq-start"){ go("gq",{gq2:{list:gqMonta(10),i:0,ok:0,erros:[]}}); return true; }
  if(a==="gq-pick"){ const G=V.gq2; if(!G||G.r!==undefined) return true;
    G.r=+b.dataset.k; const q=G.list[G.i];
    const certo=q.rot?q.certoK:q.ops.indexOf(q.certo);
    if(G.r===certo){ G.ok++; addXp(2,"guia"); } else if(!q.rot) G.erros.push(q.certo);
    render(); return true; }
  if(a==="gq-next"){ const G=V.gq2; if(G){ G.i++; delete G.r; render(); window.scrollTo(0,0); } return true; }
  return false;
}
