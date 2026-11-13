const { JSDOM, VirtualConsole } = require("jsdom");
const fs=require("fs");
const errs=[], js=[];
const vc=new VirtualConsole();
vc.on("jsdomError",e=>js.push("JS ERROR: "+e.message+"\n"+String(e.stack||"").split("\n").slice(0,4).join("\n")));
const dom=new JSDOM(fs.readFileSync(require("path").join(__dirname,"..","build","test.html"),"utf8"),
  {runScripts:"dangerously",pretendToBeVisual:true,url:"https://ex.test/",virtualConsole:vc});
const w=dom.window, d=w.document; w.scrollTo=()=>{};
const all=s=>[...d.querySelectorAll(s)];
function click(s,i=0){ const e=all(s)[i]; if(!e) throw new Error("não achei: "+s+" ["+i+"]"); 
  e.dispatchEvent(new w.MouseEvent("click",{bubbles:true})); return e; }
const txt=()=>d.getElementById("app").textContent.replace(/\s+/g," ");
const has=(s,m)=>{ if(!txt().includes(s)) errs.push("FALHOU: "+(m||"faltou texto: "+s)); };
const no=(s,m)=>{ if(txt().includes(s)) errs.push("FALHOU: "+(m||"não deveria ter: "+s)); };
const n=s=>all(s).length;
const state=()=>JSON.parse(w.localStorage.getItem("cloudquest.v2")||"{}");
function answer(){ // responde a questão atual, re-consultando após cada clique
  if(n('[data-act="qyn"]')){ const k=n('[data-act="qyn"][data-v="1"]'); for(let i=0;i<k;i++) click('[data-act="qyn"][data-v="1"]',i); }
  else if(!n('[data-act="qup"]')) click('[data-act="qpick"]');
}
function readFicha(sel,i){            // abre, rola até o fim e marca como estudada
  click(sel,i);
  const body=d.getElementById("rbody");
  if(!body) throw new Error("leitor não abriu");
  // jsdom não faz layout: scrollTop não aceita valor, então os três são forçados
  const fake=(k,v)=>Object.defineProperty(body,k,{value:v,configurable:true,writable:true});
  fake("scrollHeight",4000); fake("clientHeight",800); fake("scrollTop",0);
  body.dispatchEvent(new w.Event("scroll"));
  const btn=d.getElementById("rdone");
  if(!btn.disabled) errs.push("FALHOU: botão de concluir já vinha liberado sem rolar a ficha");
  fake("scrollTop",3200); body.dispatchEvent(new w.Event("scroll"));
  const btn2=d.getElementById("rdone");
  if(btn2.disabled) errs.push("FALHOU: botão continuou travado depois de rolar até o fim");
  click('[data-act="rdone"]');
}

try{
  /* ---------- início ---------- */
  has("Estude pelo guia do exame","home não renderizou");
  has("AZ-900"); has("CLF-C02"); has("AZ-104");
  if(n(".exam")<3) errs.push("FALHOU: poucos cartões de exame");
  if(n(".exam .band")<3) errs.push("FALHOU: cartão sem blocos de domínio");
  has("catálogo é mantido à mão","faltou o aviso de catálogo");
  has("Para onde isso leva","faltou a chamada da trilha na home");

  /* ---------- trilha de certificações ---------- */
  click('[data-act="trilha"]');
  has("Objetivo de carreira","trilha não renderizou");
  has("AZ-104","trilha sem a etapa de associate do Azure");
  if(n(".flow.vert")<2) errs.push("FALHOU: trilha sem os dois provedores");
  if(n('[data-act="certst"]')<6) errs.push("FALHOU: trilha sem controle de situação");
  const metas=n('[data-act="meta"]');
  if(metas<7) errs.push("FALHOU: menos de 7 objetivos de carreira");
  click('[data-act="meta"]',3);                      /* segurança */
  has("Segurança em nuvem","troca de objetivo não refletiu");
  if(!state().meta) errs.push("FALHOU: objetivo escolhido não persistiu");
  /* marcar uma etapa como concluída */
  click('[data-act="certst"][data-v="done"]');
  if(!Object.values(state().certs||{}).includes("done")) errs.push("FALHOU: marca de concluída não persistiu");
  has("concluída","estado concluída não apareceu na trilha");
  click('[data-act="certst"][data-v="done"]');        /* clicar de novo desmarca */
  if(Object.values(state().certs||{}).includes("done")) errs.push("FALHOU: segundo clique não desmarcou");
  click('[data-act="meta"]',0);

  /* ---------- catálogo completo ---------- */
  click('[data-act="cat"]');
  has("Catálogo de certificações","catálogo não renderizou");
  /* padrão: agrupado por trilha, uma seção por objetivo */
  if(n(".catc")<25) errs.push("FALHOU: catálogo com poucas certificações: "+n(".catc"));
  if(n(".trs .tr")<25) errs.push("FALHOU: cartões sem etiqueta de trilha");
  const todas=n(".catc");
  click('[data-act="catprov"]',2);                   /* só AWS */
  if(n(".catc")>=todas) errs.push("FALHOU: filtro de provedor não reduziu a lista");
  no("AZ-900","filtro de AWS deixou passar exame do Azure");
  click('[data-act="catprov"]',0);
  if(n(".catc")!==todas) errs.push("FALHOU: voltar para as duas nuvens não restaurou a lista");
  /* alternar para agrupamento por nível: cada certificação aparece uma vez só */
  click('[data-act="catgroup"]',1);
  has("Agrupado por nível","alternador de agrupamento não mudou a tela");
  if(n(".catc")!==29) errs.push("FALHOU: por nível deveria listar 29 cartões, listou "+n(".catc"));
  click('[data-act="catgroup"]',0);
  if(n(".catc")!==todas) errs.push("FALHOU: voltar para por trilha não restaurou o agrupamento");
  /* clicar na etiqueta leva para a trilha correspondente */
  click('.trs button.tr');
  has("Objetivo de carreira","etiqueta de trilha não abriu a trilha");
  click('[data-act="cat"]');
  click('[data-act="home"]');
  has("Estude pelo guia do exame","não voltou para a home");
  has("conteúdo original","faltou o aviso de conteúdo original");
  has("sem vínculo com a Microsoft","faltou o aviso de independência");

  /* ---------- exame: régua e faixas ---------- */
  click('[data-act="exam"][data-exam="az900"]');
  has("Prontidão estimada","linha de cota não apareceu");
  has("Peso de cada domínio","faixas não apareceram");
  if(n(".canvas .bands .band")!==3) errs.push("FALHOU: esperava 3 blocos de peso no AZ-900, achei "+n(".canvas .bands .band"));
  if(n(".dl-cut")!==1) errs.push("FALHOU: linha de cota sem marca de corte");
  if(n("article.bd")!==3) errs.push("FALHOU: esperava 3 fronteiras de domínio, achei "+n("article.bd"));
  if(n("article.bd .conn")!==9) errs.push("FALHOU: conectores faltando entre as etapas, achei "+n("article.bd .conn"));
  if(!n(".legend")) errs.push("FALHOU: diagrama sem legenda");
  // largura das faixas = peso declarado
  const flexes=all(".canvas .bands .band").map(b=>b.style.flex);
  if(!flexes.every(x=>parseFloat(x)>0)) errs.push("FALHOU: faixa sem largura proporcional ao peso");
  // domínios 2 e 3 começam travados
  if(n('article.bd[data-s="lock"]')!==2) errs.push("FALHOU: domínios seguintes deveriam começar travados");

  /* ---------- o conteúdo trava a prática ---------- */
  const praticaDisabled=all('[data-act="study"]').length;
  if(praticaDisabled>0) errs.push("FALHOU: botão Praticar habilitado antes de ler as fichas");
  has("Falta ler","não avisou quantas fichas faltam");
  if(!n('.node[data-s="lock"]')) errs.push("FALHOU: nenhum nó marcado como bloqueado");

  /* ---------- ler as fichas do domínio 1 ---------- */
  const nFichas=n('[data-act="ficha"]');
  if(nFichas<2) errs.push("FALHOU: domínio 1 com menos de 2 fichas");
  for(let i=0;i<nFichas;i++){
    readFicha('[data-act="ficha"][data-done="0"]',0);   // sempre a próxima ainda não estudada
    if(!txt().includes("Trilha")) errs.push("FALHOU: não voltou à trilha após marcar a ficha");
  }
  // reabrir uma ficha já estudada não deve creditar XP de novo
  const xpAntes=state().xp;
  click('[data-act="ficha"][data-done="1"]');
  if(!d.getElementById("rdone").disabled) errs.push("FALHOU: ficha já estudada pode ser marcada de novo");
  click('[data-act="rclose"]');
  if(state().xp!==xpAntes) errs.push("FALHOU: reler ficha creditou XP de novo");
  const st=state();
  if(Object.keys(st.fichas||{}).length!==nFichas) errs.push("FALHOU: fichas lidas não persistiram");
  if(!st.ach||!st.ach.ficha1) errs.push("FALHOU: conquista de primeira ficha não liberou");
  if(!st.ach.domclear) errs.push("FALHOU: conquista de domínio limpo não liberou");
  if(st.xp<20*nFichas) errs.push("FALHOU: XP de leitura não creditado");

  /* ---------- agora a prática abre ---------- */
  if(!n('[data-act="study"]')) errs.push("FALHOU: prática continuou travada com todas as fichas lidas");
  if(d.querySelector("#d-d1").textContent.includes("Falta ler")) errs.push("FALHOU: domínio 1 ainda avisa bloqueio depois de ler tudo");

  /* ---------- aula ---------- */
  click('[data-act="aula"]');
  if(!d.querySelector(".player")) errs.push("FALHOU: aula não abriu");
  const slides=n(".pl-segs i");
  for(let i=0;i<slides-1;i++) click('[data-act="anext"]');
  has("EXERCÍCIO 1 DE","não chegou no exercício da aula");
  click('[data-act="lq"]',0);
  if(!n(".verdict")) errs.push("FALHOU: exercício da aula sem retorno");
  click('[data-act="anext"]');
  has("EXERCÍCIO 2 DE","não avançou para o segundo exercício");
  click('[data-act="lq"]',0);
  click('[data-act="anext"]');
  has("Trilha","não voltou à trilha ao concluir a aula");
  if(!state().lessons||!Object.keys(state().lessons).length) errs.push("FALHOU: aula não ficou marcada como vista");

  /* ---------- prática ---------- */
  click('[data-act="study"]');
  has("Prática","sessão não abriu");
  no("Correto","mostrou o gabarito antes de confirmar");
  click('[data-act="qcheck"]');  // sem responder, em questão de escolha
  let guard=0;
  while(!n('[data-act="qnext"]')&&guard<10){ answer(); click('[data-act="qcheck"]'); guard++; }
  if(!n(".verdict")) errs.push("FALHOU: não apareceu o veredito");
  has("Confira na fonte oficial","veredito sem link de fonte");
  guard=0;
  while(n('[data-act="qnext"]')&&guard<20){
    click('[data-act="qnext"]'); guard++;
    if(n('[data-act="qcheck"]')){ answer(); click('[data-act="qcheck"]'); }
  }
  has("Prática concluída","sessão não terminou");
  has("volta em 1, 3, 7 e 21 dias","não explicou a repetição espaçada");

  /* ---------- chefe ---------- */
  click('[data-act="exam"]');
  click('[data-act="boss"]');
  has("Chefe do domínio","chefe não abriu");
  if(!d.getElementById("sclock")) errs.push("FALHOU: chefe sem cronômetro");
  guard=0;
  while(guard<30){
    if(n('[data-act="qcheck"]')){ answer(); click('[data-act="qcheck"]'); }
    if(n('[data-act="qnext"]')) click('[data-act="qnext"]'); else break;
    guard++;
  }
  if(!txt().includes("Chefe derrotado")&&!txt().includes("O chefe aguentou")) errs.push("FALHOU: chefe não encerrou");

  /* ---------- simulado ---------- */
  click('[data-act="exam"]');
  // o simulado é iniciado pelo cartão do exame? não: botão dedicado não existe mais na trilha, usar ação direta
  if(!n('[data-act="simstart"]')) errs.push("FALHOU: sem botão de simulado na página do exame");
  click('[data-act="simstart"]');
  if(!d.querySelector(".sim-bar")) errs.push("FALHOU: simulado não abriu");
  has("Modo prova","faltou o aviso de modo prova");
  if(n(".verdict")) errs.push("FALHOU: simulado mostrou gabarito durante a prova");
  const nq=n(".qnav button");
  if(nq!==24) errs.push("FALHOU: esperava 24 questões no simulado do AZ-900, achei "+nq);
  /* riscar alternativa: marca e desfaz, sem mexer na resposta */
  /* acha uma questão de alternativas (o sorteio pode começar por sim/não ou ordenar) */
  for(let i=0;i<nq&&!n('[data-act="simrisc"]');i++) click('[data-act="simgo"][data-i="'+i+'"]');
  if(n('[data-act="simrisc"]')){
    click('[data-act="simrisc"]');
    if(!n('.opt[data-risc="1"]')) errs.push("FALHOU: riscar não marcou a alternativa");
    click('[data-act="simrisc"]');
    if(n('.opt[data-risc="1"]')) errs.push("FALHOU: riscar não desfez");
  } else errs.push("FALHOU: simulado sem botão de riscar alternativa");
  click('[data-act="simgo"][data-i="0"]');
  for(let i=0;i<nq-1;i++){ answer(); click('[data-act="simnext"]'); }
  /* a última fica em branco: a revisão tem que mostrar e não pode entregar sozinha */
  click('[data-act="simnext"]');
  has("Revisão antes da entrega","a última questão não abriu a revisão");
  has("em branco","revisão sem contagem de em branco");
  if(n(".verdict")) errs.push("FALHOU: revisão mostrou gabarito");
  /* volta pela grade (a última pode ser "ordenar", que já nasce respondida) */
  click('.qnav [data-act="simgo"][data-i="'+(nq-1)+'"]');
  if(!d.querySelector('[data-act="simreview"]')) errs.push("FALHOU: atalho da revisão não voltou para a questão");
  answer(); click('[data-act="simreview"]');
  has("Revisão antes da entrega","botão Revisar e entregar não abriu a revisão");
  click('[data-act="simfinish"]');
  has("Nota na escala","não chegou no resultado");
  if(!n('[data-act="qreport"]')) errs.push("FALHOU: gabarito sem opção de reportar questão");
  has("Desempenho por domínio","resultado sem relatório por domínio");
  has("Gabarito comentado","resultado sem gabarito");
  const m=txt().match(/corte 700 (\d{3,4})/);
  if(!m) errs.push("FALHOU: nota não localizada no resultado");
  else { const v=+m[1]; if(v<300||v>1000) errs.push("FALHOU: nota fora da escala: "+v); }
  if(n(".verdict")<12) errs.push("FALHOU: gabarito sem comentário em todas as questões");
  if(!state().sims||!state().sims.length) errs.push("FALHOU: simulado não ficou no histórico");

  /* ---------- comparativo e progresso ---------- */
  click('.rail-tabs [data-act="review"]');     // o mapa agora vive no hub Treinar
  has("Mapa Azure e AWS","hub de treino sem o mapa de equivalências");
  click('[data-act="compare"]');
  has("O mesmo conceito nas duas nuvens","comparativo não abriu");
  if(n(".eq")<25) errs.push("FALHOU: poucas equivalências");
  click('[data-act="me"]');
  has("Seu progresso","perfil não abriu");
  has("Fichas estudadas","progresso sem contagem de fichas");
  has("Conquistas");
  has("Últimos simulados","simulado fora do histórico");
  has("O progresso fica neste navegador","faltou aviso de privacidade");
  click('[data-act="goal"]',2);
  if(state().goal!==3) errs.push("FALHOU: meta diária não salvou");
  click('[data-act="reset"]');
  if((state().xp||0)===0) errs.push("FALHOU: reset apagou no primeiro toque");
  click('[data-act="reset"]');
  if(state().xp!==0) errs.push("FALHOU: reset não funcionou no segundo toque");
  /* item 1 da auditoria: apagar guarda cópia de segurança */
  const copias=()=>Object.keys(w.localStorage).filter(k=>k.startsWith("cloudquest.backup."));
  if(copias().length<1) errs.push("FALHOU: apagar o progresso não guardou cópia");
  has("Estude pelo guia do exame","não voltou ao início após o reset");
  click('[data-act="exam"][data-exam="clf"]');
  has("Cloud Practitioner","trilha da AWS não abriu");
  if(n(".canvas .bands .band")!==4) errs.push("FALHOU: esperava 4 faixas no CLF-C02");
  if(n('[data-act="study"]')) errs.push("FALHOU: prática da AWS aberta sem ler fichas");
}catch(e){ errs.push("EXCEÇÃO: "+e.message+"\n"+String(e.stack).split("\n").slice(0,3).join("\n")); }

/* ---------- auditoria de QA: importação com prévia, abas e leitura segura ---------- */
const espera=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  try{
    click('[data-act="me"]');
    const antes=state().xp||0;
    const inp=d.getElementById("impfile");
    const escolhe=conteudo=>{
      const arquivo=new w.File([conteudo],"progresso.json",{type:"application/json"});
      Object.defineProperty(inp,"files",{value:[arquivo],configurable:true});
      inp.dispatchEvent(new w.Event("change",{bubbles:true}));
    };
    /* arquivo inválido: recusado, nada muda */
    escolhe(JSON.stringify({v:2,xp:"<img src=x onerror=alert(1)>"}));
    await espera(50);
    if(n(".imp-previa")) errs.push("FALHOU: arquivo inválido abriu a prévia");
    if((state().xp||0)!==antes) errs.push("FALHOU: arquivo inválido mudou o progresso");
    /* arquivo válido: prévia primeiro, nada trocado ainda */
    escolhe(JSON.stringify({v:2,xp:777,sims:[],seen:{"az-d1-01":{ok:true}}}));
    await espera(50);
    if(!n(".imp-previa")) errs.push("FALHOU: importação não mostrou a prévia");
    has("777 XP","prévia sem o XP do arquivo");
    if((state().xp||0)!==antes) errs.push("FALHOU: importação trocou o progresso antes de confirmar");
    if(inp.value!=="") errs.push("FALHOU: o campo de arquivo não foi limpo");
    const copiasAntes=Object.keys(w.localStorage).filter(k=>k.startsWith("cloudquest.backup.")).length;
    click('[data-act="imp-ok"]');
    if(state().xp!==777) errs.push("FALHOU: confirmar não importou");
    const copiasDepois=Object.keys(w.localStorage).filter(k=>k.startsWith("cloudquest.backup.")).length;
    if(copiasDepois<=Math.min(copiasAntes,2)) errs.push("FALHOU: importar não guardou cópia do progresso anterior");
    if(n(".imp-previa")) errs.push("FALHOU: prévia continuou na tela");
    /* outra aba salvou: junta sem regredir (xp maior vence) */
    const outra={...state(),xp:900,upd:Date.now()+1000};
    w.dispatchEvent(new w.StorageEvent("storage",{key:"cloudquest.v2",newValue:JSON.stringify(outra)}));
    click('[data-act="goal"]',1);   /* qualquer ação que salva */
    if(state().xp<900) errs.push("FALHOU: progresso da outra aba se perdeu ("+state().xp+")");
  }catch(e){ errs.push("EXCEÇÃO (QA): "+e.message+"\n"+String(e.stack).split("\n").slice(0,3).join("\n")); }
  errs.push(...js);
  if(errs.length){ console.log(errs.join("\n")); console.log("\n*** "+errs.length+" PROBLEMA(S) ***"); process.exit(1); }
  console.log("*** FLUXOS: OK ***"); process.exit(0);
})();
