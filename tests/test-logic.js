const store={};
global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]};
const el=()=>({innerHTML:"",textContent:"",className:"",style:{setProperty(){}},appendChild(){},remove(){},
  querySelectorAll:()=>[],dataset:{},addEventListener(){},scrollHeight:0,clientHeight:0,scrollTop:0});
const root=Object.assign(el(),{setAttribute(k,v){this[k]=v},removeAttribute(k){delete this[k]}});
global.document={addEventListener(){},querySelector:()=>el(),getElementById:()=>null,querySelectorAll:()=>[],createElement:el,documentElement:root};
global.location={href:'https://ex.test/app',hash:''};
global.window={scrollTo(){},addEventListener(){},location:global.location};
global.navigator={};
global.setInterval=()=>0; global.clearInterval=()=>{}; global.setTimeout=()=>0; global.clearTimeout=()=>{};
global.requestAnimationFrame=()=>0;
eval(require("fs").readFileSync(require("path").join(__dirname,"..","build","all.js"),"utf8")+"\n;Object.assign(global,{DECKS,CARDS,buildChall,parseChall,FICHAS,FICHAS_AZ,FICHAS_AWS,QUESTIONS,EXAMS,LESSONS,EQUIV,DIAGRAMS,S,grade,prep,pick,pickSim,predict,schedule,fullSpec,fullReady,cs,domProf,qHtml,verdictHtml,blockHtml,fichasOf,lessonsOf,contentDone,domOpen,ex0,daily,DEF,viewFicha,shell,CATALOGO,METAS,cat0,coverage,viewTrilha,viewCat,NIVEIS,PROVIDERS,pick,qPool,pickSim});");

let f=0; const ok=(c,m)=>{ if(!c){ console.log("FALHOU: "+m); f++; } };
const ACT=EXAMS.filter(e=>e.status==="active");

/* --- 1. fichas --- */
const fids=new Set();
for(const x of FICHAS){
  ok(!fids.has(x.id),"ficha duplicada: "+x.id); fids.add(x.id);
  const e=ex0(x.exam);
  ok(!!e,x.id+": exame inexistente");
  ok(e.domains.some(d=>d.id===x.dom),x.id+": domínio "+x.dom+" não existe em "+x.exam);
  ok(x.lead&&x.lead.length>60,x.id+": lead curto");
  ok(x.mins>=3&&x.mins<=10,x.id+": tempo de leitura implausível");
  ok(Array.isArray(x.blocks)&&x.blocks.length>=5,x.id+": poucos blocos");
  ok(Array.isArray(x.check)&&x.check.length>=2,x.id+": checklist curto");
  ok(Array.isArray(x.src)&&x.src.length>=1,x.id+": sem fonte");
  for(const s of x.src) ok(/^https:\/\//.test(s.u),x.id+": fonte sem https: "+s.u);
  ok(x.blocks.some(b=>b.t==="table"),x.id+": sem nenhuma tabela comparativa");
  ok(x.blocks.some(b=>b.t==="trap"),x.id+": sem bloco de pegadinha");
  ok(x.blocks.some(b=>b.t==="case"),x.id+": sem caso resolvido");
  for(const b of x.blocks){
    if(b.t==="table"||b.t==="signal"){
      ok(Array.isArray(b.head)&&b.head.length>=2,x.id+": tabela sem cabeçalho");
      for(const r of b.rows) ok(r.length===b.head.length,
        x.id+": linha com "+r.length+" células para "+b.head.length+" colunas");
      ok(b.rows.length>=2,x.id+": tabela com menos de 2 linhas");
    }
    if(b.t==="p") ok(b.x.length>40,x.id+": parágrafo muito curto");
    if(b.t==="trap") ok(b.x.length>80,x.id+": pegadinha rasa");
    if(b.t==="case") ok(b.q&&b.a&&b.a.length>80,x.id+": caso sem resposta desenvolvida");
  }
}
/* --- 2. cobertura: todo domínio tem ficha E questões --- */
for(const e of ACT) for(const d of e.domains){
  ok(fichasOf(e.id,d.id).length>=1,e.code+" / "+d.name+": domínio sem ficha");
  ok(QUESTIONS.filter(q=>q.exam===e.id&&q.dom===d.id).length>=3,e.code+" / "+d.name+": menos de 3 questões");
}
/* --- 3. o conteúdo trava a prática --- */
S.fichas={};
for(const e of ACT) for(const d of e.domains) ok(contentDone(e.id,d.id)===false,e.code+"/"+d.name+": prática aberta sem ler nada");
const e0=ACT[0], d0=e0.domains[0], fs=fichasOf(e0.id,d0.id);
fs.slice(0,-1).forEach(x=>S.fichas[x.id]=1);
ok(contentDone(e0.id,d0.id)===false,"prática abriu faltando uma ficha");
S.fichas[fs[fs.length-1].id]=1;
ok(contentDone(e0.id,d0.id)===true,"prática não abriu com todas as fichas lidas");
/* --- 3b. ficha de aprofundamento (extra) não tranca a prática --- */
{
  const fake={id:"f-teste-extra",exam:e0.id,dom:d0.id,extra:true,mins:5,title:"t",lead:"",blocks:[],check:[],src:[]};
  FICHAS.push(fake);
  ok(contentDone(e0.id,d0.id)===true,"ficha extra trancou a prática de quem já leu as fichas base");
  delete S.fichas[fs[0].id];
  ok(contentDone(e0.id,d0.id)===false,"faltando ficha base, a prática abriu mesmo com ficha extra presente");
  S.fichas[fs[0].id]=1;
  FICHAS.splice(FICHAS.indexOf(fake),1);
}
/* --- 4. domínio seguinte só abre vencendo o chefe --- */
S.bosses={};
ok(domOpen(e0.id,0)===true,"primeiro domínio deveria começar aberto");
ok(domOpen(e0.id,1)===false,"segundo domínio deveria começar fechado");
S.bosses[e0.id+":"+d0.id]=true;
ok(domOpen(e0.id,1)===true,"segundo domínio não abriu após o chefe");
/* --- 5. ler ficha não mexe na proficiência --- */
const before=domProf(e0.id,d0.id);
ok(before===0,"proficiência deveria ser 0 só com leitura, deu "+before);
/* --- 6. correção dos 4 formatos --- */
QUESTIONS.forEach(prep);
const byType={}; QUESTIONS.forEach(q=>byType[q.type]=q);
for(const [t,q] of Object.entries(byType)){
  const right=t==="yn"?q.rows.map(r=>r.a):t==="order"?q.items.map((_,i)=>i):q.ans;
  ok(grade(q,right)===true,t+": resposta certa marcada como errada");
  const wrong=t==="yn"?q.rows.map(r=>!r.a):t==="order"?q.shufOrder
    :t==="multi"?[q.ans[0]]:[q.opts.find(o=>!q.ans.includes(o.k)).k];
  ok(grade(q,wrong)===false,t+": resposta errada aceita como certa");
  ok(grade(q,null)===false,t+": resposta nula aceita");
}
/* --- 7. simulado --- */
for(const e of ACT){
  const qs=pickSim(e.id,e.simQ);
  ok(qs.length===e.simQ,e.code+": simulado com "+qs.length+" de "+e.simQ);
  ok(new Set(qs.map(q=>q.id)).size===qs.length,e.code+": questão repetida");
  for(const d of e.domains) ok(qs.some(q=>q.dom===d.id),e.code+": domínio "+d.name+" fora do simulado");
}
/* --- 7b. prova completa e sorteio por prioridade --- */
{
  const saa=ex0("saa"), clf=ex0("clf");
  ok(fullReady("saa")&&fullSpec("saa").q===65&&fullSpec("saa").min===130,"SAA: prova completa deveria ser 65 questões em 130 min");
  ok(fullReady("clf")&&fullSpec("clf").q===65,"CLF: prova completa indisponível");
  ok(fullSpec("az900")===null,"AZ-900 tem faixa de questões (40-60): não deveria ter prova completa fixa");
  const full=pickSim("saa",65);
  ok(full.length===65&&new Set(full.map(q=>q.id)).size===65,"prova completa do SAA com tamanho errado ou repetição");
  for(const d of saa.domains){
    const want=Math.round(65*parseFloat(d.w)/100), got=full.filter(q=>q.dom===d.id).length;
    ok(Math.abs(got-want)<=1,"SAA completa: "+d.name+" com "+got+" questões, esperado ~"+want);
  }
  /* sorteio prioriza inéditas: marca metade do banco como vista e acertada */
  const pool=qPool("clf"), antes=JSON.stringify(S.seen);
  pool.slice(0,Math.floor(pool.length/2)).forEach(q=>S.seen[q.id]={ok:true,n:1,lastTs:Date.now()});
  const s2=pickSim("clf",clf.simQ), vistas=s2.filter(q=>S.seen[q.id]).length;
  const ineditas=pool.length-Math.floor(pool.length/2);
  ok(vistas<=Math.max(0,clf.simQ-ineditas)+clf.domains.length,"sorteio usou "+vistas+" questões já vistas havendo "+ineditas+" inéditas");
  S.seen=JSON.parse(antes);
}
/* --- 8. nota prevista --- */
for(const e of ACT){
  const p0=predict(e.id);
  ok(p0.score>=300&&p0.score<=1000,e.code+": nota fora da escala");
  const q=QUESTIONS.find(x=>x.exam===e.id);
  for(let i=0;i<30;i++) q.tags.forEach(t=>schedule(t,true));
  const p1=predict(e.id);
  ok(p1.score>p0.score,e.code+": acertar não elevou a nota prevista");
  ok(p1.ci<=p0.ci,e.code+": margem não estreitou");
}
/* --- 9. HTML sem buracos --- */
for(const x of FICHAS){
  const h=x.blocks.map(blockHtml).join("");
  ok(!/undefined/.test(h),x.id+": blockHtml gerou undefined");
  ok(h.length>400,x.id+": conteúdo renderizado muito curto");
}
for(const q of QUESTIONS){
  const sel=q.type==="yn"?q.rows.map(r=>r.a):q.type==="order"?q.items.map((_,i)=>i):q.ans;
  for(const sh of [false,true]){
    const h=qHtml(q,sh,sh?sel:null);
    ok(!/undefined/.test(h),q.id+": qHtml gerou undefined (shown="+sh+")");
  }
  ok(!/undefined/.test(verdictHtml(q,sel)),q.id+": verdictHtml gerou undefined");
}
/* --- 9c. cartões de memorização --- */
const cards=(typeof CARDS!=="undefined")?CARDS:[];
ok(cards.length>=40,"poucos cartões gerados, achei "+cards.length);
const cid=new Set();
for(const c of cards){
  ok(!cid.has(c.id),"cartão duplicado: "+c.id); cid.add(c.id);
  ok(c.q&&c.q.length>8,c.id+": frente curta demais");
  ok(c.a&&c.a.length>2,c.id+": verso vazio");
  ok(!!FICHAS.find(f=>f.id===c.ficha),c.id+": ficha de origem inexistente");
  ok(c.q!==c.a,c.id+": frente igual ao verso");
}
// todo exame ativo contribui com cartões
for(const e of ACT) ok(cards.some(c=>c.exam===e.id),e.code+": sem nenhum cartão");

/* --- 9d. baralhos de classificação --- */
const decks=(typeof DECKS!=="undefined")?DECKS:[];
ok(decks.length>=5,"poucos baralhos");
const did=new Set();
for(const d of decks){
  ok(!did.has(d.id),"baralho duplicado: "+d.id); did.add(d.id);
  ok(!!ex0(d.exam),d.id+": exame inexistente");
  ok(ex0(d.exam).domains.some(x=>x.id===d.dom),d.id+": domínio inexistente");
  ok(d.buckets.length>=2&&d.buckets.length<=4,d.id+": número de categorias fora de 2 a 4");
  ok(d.items.length>=8,d.id+": menos de 8 itens");
  ok(d.prompt&&d.prompt.length>20,d.id+": enunciado curto");
  const ks=new Set(d.buckets.map(b=>b.k));
  const usados=new Set();
  const textos=new Set();
  for(const i of d.items){
    ok(ks.has(i.k),d.id+": item com categoria inválida: "+i.t);
    ok(i.e&&i.e.length>=12,d.id+": explicação curta em "+i.t);
    ok(!textos.has(i.t),d.id+": item repetido: "+i.t); textos.add(i.t);
    usados.add(i.k);
  }
  for(const b of d.buckets) ok(usados.has(b.k),d.id+": categoria sem nenhum item: "+b.label);
  // nenhuma categoria pode concentrar quase tudo, senão dá para chutar
  const maior=Math.max(...d.buckets.map(b=>d.items.filter(i=>i.k===b.k).length));
  ok(maior<=d.items.length*0.75,d.id+": uma categoria concentra "+maior+" de "+d.items.length+" itens");
}
/* --- 9e. desafios compartilháveis --- */
if(typeof buildChall==="function"){
  for(const e of ACT){
    const c=buildChall(e.id,10,15);
    ok(c.qs.length===10,e.code+": desafio com "+c.qs.length+" questões");
    ok(/#c=/.test(c.link),e.code+": link de desafio malformado");
    const volta=parseChall("#"+c.link.split("#")[1]);
    ok(!!volta,e.code+": link de desafio não volta a ser lido");
    if(volta){
      ok(volta.exam===e.id,e.code+": exame errado ao reler o link");
      ok(volta.mins===15,e.code+": tempo errado ao reler o link");
      ok(volta.qs.length===10,e.code+": questões perdidas ao reler o link");
      ok(volta.qs.map(q=>q.id).join()===c.qs.map(q=>q.id).join(),e.code+": ordem das questões mudou");
      ok(volta.faltando===0,e.code+": link reportou questões faltando");
    }
  }
  ok(parseChall("#c=inexistente~10~az-d1-01")===null,"link com exame inválido deveria ser recusado");
  ok(parseChall("#c=az900~10~naoexiste.naoexiste2")===null,"link sem questões válidas deveria ser recusado");
  ok(parseChall("")===null,"endereço sem desafio deveria ser recusado");
  const parcial=parseChall("#c=az900~10~"+QUESTIONS.filter(q=>q.exam==="az900").slice(0,4).map(q=>q.id).join(".")+".naoexiste");
  ok(parcial&&parcial.faltando===1,"link com questão removida deveria contar a que faltou");
}
/* --- 10b. acervo suficiente para chefe e simulado em todo domínio --- */
for(const e of ACT){
  const sim=pickSim(e.id,e.simQ);
  ok(sim.length===e.simQ,e.code+": simulado devolveu "+sim.length+" de "+e.simQ);
  ok(new Set(sim.map(q=>q.id)).size===sim.length,e.code+": simulado com questão repetida");
  for(const d of e.domains){
    ok(sim.some(q=>q.dom===d.id),e.code+": simulado sem nenhuma questão de "+d.id);
    ok(pick(e.id,d.id,6).length>=5,e.code+"/"+d.id+": chefe com menos de 5 questões ("+qPool(e.id,d.id).length+" no acervo)");
    ok(fichasOf(e.id,d.id).length>=1,e.code+"/"+d.id+": domínio sem ficha, a prática nunca abriria");
    ok(lessonsOf(e.id,d.id).length>=1,e.code+"/"+d.id+": domínio sem aula");
  }
}

/* --- 11. catálogo de certificações --- */
const cids=new Set();
for(const c of CATALOGO){
  ok(!cids.has(c.id),"certificação duplicada no catálogo: "+c.id); cids.add(c.id);
  ok(c.prov==="azure"||c.prov==="aws",c.id+": provedor desconhecido");
  ok(!!PROVIDERS[c.prov],c.id+": provedor sem entrada em PROVIDERS");
  ok(/^[A-Z]{2,3}-[A-Z0-9]+$/.test(c.code),c.id+": código fora do padrão: "+c.code);
  ok(NIVEIS.includes(c.nivel),c.id+": nível não listado: "+c.nivel);
  ok(c.foco&&c.foco.length>20,c.id+": foco curto");
  ok(/^\d+ a \d+$/.test(c.horas),c.id+": horas fora do formato");
  ok(/^USD \d+$/.test(c.preco),c.id+": preço fora do formato");
  ok(c.validade&&c.validade.length>4,c.id+": validade ausente");
  ok(Array.isArray(c.prereq),c.id+": prereq não é lista");
  for(const pr of c.prereq){
    ok(cids.has(pr)||CATALOGO.some(x=>x.id===pr),c.id+": pré-requisito inexistente: "+pr);
    ok(pr!==c.id,c.id+": pré-requisito aponta para si mesmo");
  }
  ok(typeof c.conteudo==="boolean",c.id+": campo conteudo ausente");
  /* a promessa de conteúdo tem de ser verdadeira */
  if(c.conteudo){
    ok(!!ex0(c.id),c.id+": marcado com conteúdo mas não está em EXAMS");
    ok(FICHAS.some(x=>x.exam===c.id),c.id+": marcado com conteúdo mas sem ficha");
    ok(QUESTIONS.some(q=>q.exam===c.id),c.id+": marcado com conteúdo mas sem questão");
  }else{
    ok(!ex0(c.id)||ex0(c.id).status!=="active",c.id+": ativo em EXAMS mas marcado sem conteúdo");
  }
}
/* todo exame ativo precisa existir no catálogo, para a trilha não ter buraco */
for(const e of ACT) ok(cids.has(e.id),e.code+": exame ativo fora do catálogo");

/* sem ciclo de pré-requisitos */
(function(){
  const seen={};
  const walk=(id,path)=>{
    if(path.includes(id)){ ok(false,"ciclo de pré-requisitos: "+path.concat(id).join(" -> ")); return; }
    const c=cat0(id); if(!c) return;
    for(const pr of c.prereq) walk(pr,path.concat(id));
    seen[id]=1;
  };
  for(const c of CATALOGO) walk(c.id,[]);
  ok(Object.keys(seen).length===CATALOGO.length,"certificação inalcançável na travessia de pré-requisitos");
})();

/* --- 11b. nenhuma certificação órfã, e a trilha de cada uma é derivável --- */
for(const c of CATALOGO){
  const ts=METAS.filter(m=>m.azure.includes(c.id)||m.aws.includes(c.id));
  ok(ts.length>=1,c.code+": não pertence a nenhuma trilha de carreira");
  for(const m of ts){
    const lado=c.prov==="azure"?m.azure:m.aws;
    ok(lado.includes(c.id),c.code+": aparece na trilha "+m.id+" do provedor errado");
  }
}

/* --- 12. trilhas por objetivo --- */
const mids=new Set();
for(const m of METAS){
  ok(!mids.has(m.id),"trilha duplicada: "+m.id); mids.add(m.id);
  ok(m.nome&&m.nome.length>5,m.id+": nome curto");
  ok(m.desc&&m.desc.length>60,m.id+": descrição curta");
  ok(m.nota&&m.nota.length>60,m.id+": falta o porquê da ordem");
  for(const k of ["azure","aws"]){
    const ids=m[k];
    ok(Array.isArray(ids)&&ids.length>=3,m.id+"/"+k+": trilha com menos de 3 etapas");
    ok(new Set(ids).size===ids.length,m.id+"/"+k+": etapa repetida");
    for(const id of ids){
      const c=cat0(id);
      ok(!!c,m.id+"/"+k+": etapa inexistente no catálogo: "+id);
      if(c) ok(c.prov===(k==="azure"?"azure":"aws"),m.id+"/"+k+": etapa de outro provedor: "+id);
    }
    /* a sequência tem de subir de nível, nunca descer */
    const lv=ids.map(id=>NIVEIS.indexOf(cat0(id).nivel));
    for(let i=1;i<lv.length;i++) ok(lv[i]>=lv[i-1],m.id+"/"+k+": etapa "+(i+1)+" desce de nível");
    /* pré-requisito de uma etapa precisa estar antes dela na mesma trilha, se estiver nela */
    ids.forEach((id,i)=>{ for(const pr of cat0(id).prereq){
      const j=ids.indexOf(pr);
      ok(j===-1||j<i,m.id+"/"+k+": "+id+" vem antes do seu pré-requisito "+pr);
    }});
    /* toda trilha começa em Fundamentos */
    ok(NIVEIS.indexOf(cat0(ids[0]).nivel)===0,m.id+"/"+k+": não começa em Fundamentos");
    /* toda trilha tem pelo menos uma etapa com conteúdo real */
    ok(ids.some(id=>cat0(id).conteudo),m.id+"/"+k+": nenhuma etapa com conteúdo no app");
  }
}

/* --- 13. cobertura declarada é a real --- */
for(const c of CATALOGO){
  const cv=coverage(c.id);
  if(!c.conteudo){ ok(cv===null,c.id+": coverage devolveu dados para exame sem conteúdo"); continue; }
  ok(cv&&cv.fichas===FICHAS.filter(x=>x.exam===c.id).length,c.id+": contagem de fichas divergente");
  ok(cv.questoes===QUESTIONS.filter(q=>q.exam===c.id).length,c.id+": contagem de questões divergente");
  ok(cv.lidas<=cv.fichas,c.id+": lidas maior que o total");
  ok(cv.aulas>=1,c.id+": sem aula");
}

/* --- 14. a trilha e o catálogo renderizam --- */
for(const m of METAS){
  S.meta=m.id;
  const h=viewTrilha();
  ok(h.includes(m.nome),m.id+": nome da meta ausente na trilha");
  for(const id of m.azure.concat(m.aws)) ok(h.includes(cat0(id).code),m.id+": etapa "+id+" não renderizou");
  ok(!/undefined|NaN|\[object/.test(h),m.id+": trilha com valor indefinido no HTML");
}
S.meta="admin";
for(const pv of ["all","azure","aws"]){
  S.catProv=pv;
  const h=viewCat();
  const esperados=pv==="all"?CATALOGO:CATALOGO.filter(c=>c.prov===pv);
  for(const c of esperados) ok(h.includes(c.code),"catálogo "+pv+": falta "+c.code);
  if(pv!=="all") for(const c of CATALOGO.filter(c=>c.prov!==pv)) ok(!h.includes(">"+c.code+"<"),"catálogo "+pv+": vazou "+c.code);
  ok(!/undefined|NaN|\[object/.test(h),"catálogo "+pv+": valor indefinido no HTML");
}
S.catProv="all";
/* marcar etapa como concluída muda o estado do nó e a barra */
S.certs={};
const semMarca=viewTrilha();
S.certs["az900"]="done";
const comMarca=viewTrilha();
ok(semMarca!==comMarca,"marcar certificação não alterou a trilha");
ok(comMarca.includes("concluída"),"estado concluída não apareceu");
S.certs={};

/* --- 10. conteúdo sem HTML injetado --- */
ok(!/<script|onerror=/i.test(JSON.stringify(FICHAS)),"ficha com HTML suspeito");

const mins=FICHAS.reduce((a,x)=>a+x.mins,0);
const words=JSON.stringify(FICHAS).split(/\s+/).length;
console.log("Baralhos: "+decks.length+" ("+decks.reduce((a,d)=>a+d.items.length,0)+" itens)");
console.log("Cartões: "+cards.length);
console.log("Fichas: "+FICHAS.length+" ("+mins+" min de leitura, ~"+words+" palavras)");
console.log("Questões: "+QUESTIONS.length+" | Aulas: "+LESSONS.length+" | Equivalências: "+EQUIV.length);
console.log("Catálogo: "+CATALOGO.length+" certificações ("+CATALOGO.filter(c=>c.conteudo).length+" com conteúdo) | Trilhas: "+METAS.length);
for(const e of ACT) console.log("  "+e.code+": "+e.domains.map(d=>
  d.name+" ["+fichasOf(e.id,d.id).length+"f/"+QUESTIONS.filter(q=>q.exam===e.id&&q.dom===d.id).length+"q]").join(", "));
console.log(f?"\n*** "+f+" FALHA(S) ***":"\n*** LÓGICA E CONTEÚDO: OK ***");
process.exit(f?1:0);
