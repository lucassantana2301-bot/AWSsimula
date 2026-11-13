/* testes dos recursos novos: revisão, simulado persistente, teclado,
   data da prova e exportação/importação */
const { JSDOM, VirtualConsole } = require("jsdom");
const fs=require("fs");
const errs=[], js=[];
let antes="{}";
const vc=new VirtualConsole();
vc.on("jsdomError",e=>js.push("JS ERROR: "+e.message));
const html=fs.readFileSync(require("path").join(__dirname,"..","build","test.html"),"utf8");
let origem=0;
function boot(storage){
  // o storage precisa existir ANTES do script rodar, e cada boot usa uma
  // origem própria para não herdar estado do boot anterior
  const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,
    url:"https://ex"+(++origem)+".test/",virtualConsole:vc,
    beforeParse(win){ win.scrollTo=()=>{};
      if(storage) win.localStorage.setItem("cloudquest.v2",storage); }});
  return dom;
}
let dom=boot(null), w=dom.window, d=w.document;
const all=s=>[...d.querySelectorAll(s)];
function click(s,i=0){ const e=all(s)[i]; if(!e) throw new Error("não achei: "+s+" ["+i+"]");
  e.dispatchEvent(new w.MouseEvent("click",{bubbles:true})); return e; }
function key(k){ d.dispatchEvent(new w.KeyboardEvent("keydown",{key:k,bubbles:true,cancelable:true})); }
const txt=()=>d.getElementById("app").textContent.replace(/\s+/g," ");
const has=(s,m)=>{ if(!txt().includes(s)) errs.push("FALHOU: "+(m||"faltou: "+s)); };
const n=s=>all(s).length;
const st=()=>JSON.parse(w.localStorage.getItem("cloudquest.v2")||"{}");
function answer(){
  if(n('[data-act="qyn"]')){ const k=n('[data-act="qyn"][data-v="1"]'); for(let i=0;i<k;i++) click('[data-act="qyn"][data-v="1"]',i); }
  else if(!n('[data-act="qup"]')) click('[data-act="qpick"]');
}
function readAllFichas(){
  let guard=0;
  while(n('[data-act="ficha"][data-done="0"]')&&guard<12){
    click('[data-act="ficha"][data-done="0"]');
    const body=d.getElementById("rbody");
    const fake=(k,v)=>Object.defineProperty(body,k,{value:v,configurable:true,writable:true});
    fake("scrollHeight",4000); fake("clientHeight",800); fake("scrollTop",3200);
    body.dispatchEvent(new w.Event("scroll"));
    click('[data-act="rdone"]'); guard++;
  }
}

try{
  /* ---------- aba de revisão ---------- */
  click('[data-act="review"]');
  has("Treinar","aba de treino não abriu");
  has("A fila começa depois da primeira prática","estado vazio da revisão errado");
  if(n('[data-act="review-go"]')) errs.push("FALHOU: ofereceu revisão sem nada vencido");

  /* ---------- gera erros para alimentar a fila ---------- */
  click('[data-act="home"]');
  click('[data-act="onb-pular"]');                 /* primeira visita: pula as boas-vindas */
  click('[data-act="exam"][data-exam="az900"]');
  readAllFichas();
  if(!n('[data-act="study"]')) throw new Error("prática não liberou após ler as fichas");
  click('[data-act="study"]');
  let guard=0;
  while(guard<20){
    if(n('[data-act="qcheck"]')){ answer(); click('[data-act="qcheck"]'); }
    if(n('[data-act="qnext"]')) click('[data-act="qnext"]'); else break;
    guard++;
  }
  const conceitos=Object.keys(st().concepts||{}).length;
  if(!conceitos) errs.push("FALHOU: nenhuma proficiência registrada após a prática");

  /* ---------- fila de revisão fica disponível ---------- */
  // força vencimento, como se os dias tivessem passado
  const raw=st(); Object.keys(raw.concepts).forEach(k=>raw.concepts[k].due=Date.now()-1000);
  w.localStorage.setItem("cloudquest.v2",JSON.stringify(raw));
  dom=boot(JSON.stringify(raw)); w=dom.window; d=w.document; w.scrollTo=()=>{};
  click('[data-act="review"]');
  if(!n('[data-act="review-go"]')) errs.push("FALHOU: fila de revisão vazia mesmo com conceitos vencidos");
  has("conceitos vencidos","não mostrou a contagem de vencidos");
  if(!n(".rail-tabs .badge")) errs.push("FALHOU: aba Revisar sem selo de pendência");
  // abrir uma ficha pela fila e fechar deve voltar para a fila, não quebrar
  if(n('[data-act="ficha"]')){
    click('[data-act="ficha"]');
    if(!d.getElementById("rbody")) errs.push("FALHOU: ficha não abriu a partir da revisão");
    click('[data-act="rclose"]');
    has("conceitos vencidos","fechar a ficha vinda da revisão não voltou para a fila");
  }
  click('[data-act="review-go"]');
  has("Revisão","sessão de revisão não abriu");
  if(!n('[data-act="qcheck"]')) errs.push("FALHOU: revisão abriu sem questão");

  /* ---------- teclado ---------- */
  if(n('[data-act="qpick"]')){
    key("2");
    if(!n('[data-act="qpick"][data-sel="1"]')) errs.push("FALHOU: tecla numérica não selecionou alternativa");
    key("Enter");
    if(!n(".verdict")) errs.push("FALHOU: Enter não confirmou a resposta");
    key("Enter");
    if(n(".verdict")&&n('[data-act="qnext"]')) errs.push("FALHOU: Enter não avançou para a próxima");
  }

  /* ---------- cartões de memorização ---------- */
  dom=boot(null); w=dom.window; d=w.document; w.scrollTo=()=>{};
  click('[data-act="review"]');
  has("Cartões de memorização","sem seção de cartões");
  if(!n('[data-act="cards-go"]:not(:disabled)')) errs.push("FALHOU: cartões indisponíveis num estado novo");
  click('[data-act="cards-go"]');
  if(!n(".card3")) errs.push("FALHOU: cartão não abriu");
  has("SINAL NO ENUNCIADO","cartão não abriu pela frente");
  if(n('[data-act="card-ok"]')) errs.push("FALHOU: mostrou os botões de acerto antes de virar");
  const frente=d.querySelector(".card3 .face").textContent;
  click('[data-act="card-flip"]');
  has("RESPOSTA","cartão não virou");
  const verso=d.querySelector(".card3 .face").textContent;
  if(frente===verso) errs.push("FALHOU: verso igual à frente");
  if(!n('[data-act="card-ok"]')) errs.push("FALHOU: sem botão de acertei depois de virar");
  click('[data-act="card-ok"]');
  if(!Object.keys(st().cards||{}).length) errs.push("FALHOU: resposta do cartão não foi salva");
  // errar deve reagendar para hoje
  click('[data-act="card-flip"]'); click('[data-act="card-no"]');
  const ids=Object.keys(st().cards);
  const errado=st().cards[ids[1]];
  if(errado&&errado.due>Date.now()+1000) errs.push("FALHOU: cartão errado não volta no mesmo dia");
  // teclado
  key(" ");
  if(!n('[data-act="card-ok"]')) errs.push("FALHOU: espaço não virou o cartão");
  key("2");
  if(Object.keys(st().cards).length<3) errs.push("FALHOU: tecla 2 não registrou acerto");
  // percorre até o fim
  let g2=0;
  while(n(".card3")&&g2<30){ if(!n('[data-act="card-ok"]')) click('[data-act="card-flip"]'); else click('[data-act="card-ok"]'); g2++; }
  has("Cartões concluídos","sessão de cartões não terminou");

  /* ---------- baralho de classificação ---------- */
  dom=boot(null); w=dom.window; d=w.document; w.scrollTo=()=>{};
  click('[data-act="review"]');
  has("Baralhos de classificação","sem seção de baralhos");
  if(n(".deckcard")<5) errs.push("FALHOU: poucos baralhos listados");
  click('[data-act="deck-go"]');
  has("CLASSIFIQUE","baralho não abriu");
  if(n(".bucket")<2) errs.push("FALHOU: baralho sem categorias");
  if(n(".verdict")) errs.push("FALHOU: mostrou o veredito antes de classificar");
  click('[data-act="deck-pick"]');
  if(!n(".verdict")) errs.push("FALHOU: classificar não deu retorno");
  if(!n('.bucket.ok')) errs.push("FALHOU: não destacou a categoria correta");
  if(n('[data-act="deck-pick"]:not(:disabled)')) errs.push("FALHOU: dá para classificar duas vezes");
  click('[data-act="deck-next"]');
  if(n(".verdict")) errs.push("FALHOU: veredito ficou na tela do item seguinte");
  // percorre até o fim
  let gd=0;
  while(n(".bucket")&&gd<90){ click('[data-act="deck-pick"]'); click('[data-act="deck-next"]'); gd++; }
  has("Repetir embaralhado","baralho não terminou");
  if(!Object.keys(st().decks||{}).length) errs.push("FALHOU: resultado do baralho não foi salvo");

  /* ---------- relâmpago ---------- */
  click('[data-act="review"]');
  has("Relâmpago","sem seção de relâmpago");
  click('[data-act="sprint-go"]');
  if(n('[data-act="sprint-pick"]')!==3) errs.push("FALHOU: relâmpago deveria ter 3 alternativas, tem "+n('[data-act="sprint-pick"]'));
  const alts=[...d.querySelectorAll('[data-act="sprint-pick"]')].map(x=>x.textContent.replace(/^\d/,"").trim());
  if(new Set(alts).size!==3) errs.push("FALHOU: alternativas do relâmpago repetidas");
  click('[data-act="sprint-pick"]');
  if(!n('.opt[data-res="ok"]')) errs.push("FALHOU: relâmpago não marcou a alternativa correta");

  /* ---------- desafios compartilháveis ---------- */
  dom=boot(null); w=dom.window; d=w.document; w.scrollTo=()=>{};
  click('[data-act="chall"]');
  has("Desafios","aba de desafios não abriu");
  has("Criar um desafio","sem formulário de criação");
  d.getElementById("ch-n").value="5";
  d.getElementById("ch-m").value="10";
  click('[data-act="chall-make"]');
  const link=d.getElementById("ch-link");
  if(!link||!/#c=/.test(link.value)) errs.push("FALHOU: link do desafio não foi gerado");
  else{
    const partes=link.value.split("#c=")[1].split("~");
    if(partes[1]!=="10") errs.push("FALHOU: tempo errado no link");
    if(partes[2].split(".").length!==5) errs.push("FALHOU: número de questões errado no link");
  }
  if(!st().challenges||!st().challenges.length) errs.push("FALHOU: desafio não ficou no histórico");
  // aceitar o próprio desafio
  click('[data-act="chall-try"]');
  if(!d.querySelector(".sim-bar")) errs.push("FALHOU: desafio não iniciou o simulado");
  if(n(".qnav button")!==5) errs.push("FALHOU: desafio abriu com número errado de questões");
  // abrir o app já com um desafio no endereço
  const hash=link?("#c="+link.value.split("#c=")[1]):"";
  if(hash){
    const dom2=new (require("jsdom").JSDOM)(html,{runScripts:"dangerously",pretendToBeVisual:true,
      url:"https://ex99.test/"+hash,virtualConsole:vc,beforeParse(win){win.scrollTo=()=>{};}});
    const w2=dom2.window, d2=w2.document;
    const txt2=d2.getElementById("app").textContent.replace(/\s+/g," ");
    if(!txt2.includes("Você recebeu um desafio")) errs.push("FALHOU: link de desafio não é reconhecido ao abrir o app");
  }

  /* ---------- tema manual ---------- */
  click('[data-act="me"]');
  has("Aparência","sem escolha de tema");
  click('[data-act="theme"][data-v="dark"]');
  if(d.documentElement.getAttribute("data-theme")!=="dark") errs.push("FALHOU: tema escuro não aplicado");
  if(st().theme!=="dark") errs.push("FALHOU: tema não salvo");
  click('[data-act="theme"][data-v="auto"]');
  if(d.documentElement.hasAttribute("data-theme")) errs.push("FALHOU: tema automático não removeu o atributo");

  /* ---------- simulado: tamanho e persistência ---------- */
  dom=boot(null); w=dom.window; d=w.document; w.scrollTo=()=>{};
  click('[data-act="onb-pular"]');
  click('[data-act="exam"][data-exam="clf"]');
  click('[data-act="simstart"]');
  const nq=n(".qnav button");
  if(nq!==30) errs.push("FALHOU: esperava 30 questões no simulado do CLF-C02, achei "+nq);
  answer(); click('[data-act="simnext"]'); answer();
  const salvo=st().sim;
  if(!salvo) errs.push("FALHOU: simulado em andamento não foi salvo");
  else{
    if(salvo.ids.length!==30) errs.push("FALHOU: simulado salvo com número errado de questões");
    if(salvo.i!==1) errs.push("FALHOU: posição do simulado não foi salva");
  }
  // simula fechar e reabrir a aba
  const snap=w.localStorage.getItem("cloudquest.v2");
  dom=boot(snap); w=dom.window; d=w.document; w.scrollTo=()=>{};
  has("Simulado em andamento","não ofereceu retomar o simulado");
  click('[data-act="simresume"]');
  if(!d.querySelector(".sim-bar")) errs.push("FALHOU: não retomou o simulado");
  const pos=[...d.querySelectorAll(".qnav button")].findIndex(b=>b.getAttribute("aria-current")==="true");
  if(pos!==1) errs.push("FALHOU: retomou na questão errada ("+pos+")");
  if(!n('.qnav button[data-st="ans"]')) errs.push("FALHOU: respostas anteriores não voltaram");
  // descartar: sai do simulado pelo trilho superior
  click('.rail-tabs [data-act="home"]');
  if(n('[data-act="simdrop"]')){ click('[data-act="simdrop"]');
    if(st().sim) errs.push("FALHOU: descartar não limpou o simulado"); }

  /* ---------- data da prova ---------- */
  dom=boot(null); w=dom.window; d=w.document; w.scrollTo=()=>{};
  click('[data-act="onb-pular"]');
  click('[data-act="exam"][data-exam="az900"]');
  has("Defina a data","sem texto inicial de data da prova");
  const inp=d.getElementById("examdate");
  if(!inp) errs.push("FALHOU: campo de data da prova ausente");
  else{
    /* data local, como o app calcula; em UTC o teste quebrava entre 21h e 0h no Brasil */
    const alvo=new Date(Date.now()+20*864e5);
    const dd=new Date(alvo.getTime()-alvo.getTimezoneOffset()*6e4).toISOString().slice(0,10);
    inp.value=dd; inp.dispatchEvent(new w.Event("change",{bubbles:true}));
    if(st().dates.az900!==dd) errs.push("FALHOU: data da prova não foi salva");
    const pace=d.getElementById("pace").textContent;
    if(!/Faltam 20 dias/.test(pace)) errs.push("FALHOU: ritmo não calculado: "+pace);
    if(!/ficha/.test(pace)) errs.push("FALHOU: ritmo não menciona fichas por dia: "+pace);
    // data no passado
    inp.value="2020-01-01"; inp.dispatchEvent(new w.Event("change",{bubbles:true}));
    if(!/já passou/.test(d.getElementById("pace").textContent)) errs.push("FALHOU: data passada não avisada");
  }

  /* ---------- exportar e importar ---------- */
  click('[data-act="me"]');
  has("Exportar para arquivo","sem botão de exportar");
  has("Copiar progresso","sem alternativa de cópia");
  if(!d.getElementById("jsonbox")) errs.push("FALHOU: sem campo de texto para a cópia manual");
  // sem capacidade de download e sem área de transferência, precisa sobrar o texto
  w.navigator.clipboard=undefined;
  Object.defineProperty(w.URL,"createObjectURL",{value:()=>{throw new Error("indisponível")},configurable:true});
  click('[data-act="export"]');
  antes=JSON.stringify(st());
}catch(e){ errs.push("EXCEÇÃO: "+e.message+"\n"+String(e.stack).split("\n").slice(0,3).join("\n")); }

/* fase 2: confere a exportação antes que qualquer re-render apague a caixa */
setTimeout(()=>{
  try{
    const box=w.document.getElementById("jsonbox");
    if(box&&box.style.display!=="block") errs.push("FALHOU: sem download nem área de transferência, o JSON não foi exibido para cópia");
    if(box&&!/\"v\": *2/.test(box.value||"")) errs.push("FALHOU: texto de exportação não contém o progresso");
    // fase 3: importação
    const d2=w.document;
    const fi=d2.getElementById("impfile");
    if(!fi) errs.push("FALHOU: campo de importação ausente");
    else{
      const mod=JSON.parse(antes); mod.xp=4321;
      const blob=new w.Blob([JSON.stringify(mod)],{type:"application/json"});
      Object.defineProperty(fi,"files",{value:[blob],configurable:true});
      fi.dispatchEvent(new w.Event("change",{bubbles:true}));
    }
  }catch(e){ errs.push("EXCEÇÃO fase 2: "+e.message); }
  setTimeout(()=>{
    try{
      /* a importação mostra uma prévia e só troca o progresso depois de confirmar */
      const ok=w.document.querySelector('[data-act="imp-ok"]');
      if(!ok) errs.push("FALHOU: importação não mostrou a confirmação");
      else ok.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
      const s=JSON.parse(w.localStorage.getItem("cloudquest.v2")||"{}");
      if(s.xp!==4321) errs.push("FALHOU: importação não aplicou o estado do arquivo (xp="+s.xp+")");
    }catch(e){ errs.push("FALHOU: estado ilegível após importar"); }
    errs.push(...js);
    if(errs.length){ console.log(errs.join("\n")); console.log("\n*** "+errs.length+" PROBLEMA(S) ***"); process.exit(1); }
    console.log("*** RECURSOS NOVOS: OK ***"); process.exit(0);
  },600);
},400);
