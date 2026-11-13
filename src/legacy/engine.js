/* ============================================================
   MOTOR LEGADO (ADR-0001)
   Código do app anterior à reengenharia, empacotado como módulo.
   Recebe o conteúdo pronto de src/main.ts (content/*.json validado por
   schema) em vez de defini-lo. Cada funcionalidade sai daqui para
   src/features/* na fase 3; não acrescente código novo neste arquivo.
   ============================================================ */
/* eslint-disable */
// @ts-nocheck
const C = globalThis.__CQ_CONTENT;
if (!C) throw new Error("conteúdo não carregado antes do motor");
const { QUESTIONS, FICHAS, LESSONS, DIAGRAMS, EQUIV, EXAMS, DECKS, GUIA, DUELOS } = C;
const CATALOGO = C.catalogo.certs, CATALOG_SYNCED = C.catalogo.synced, METAS = C.catalogo.metas, PROVIDERS = C.catalogo.providers;

/* ============================================================
   GUIA DE SERVIÇOS AWS: saiu do motor (src/features/guia/telas.ts).
   Aqui fica só o contrato: o módulo recebe acesso à rota, navegação,
   render, XP e progresso, e devolve as telas e trata as ações.
   ============================================================ */
const PROG=C.progresso;
if(!PROG) throw new Error("módulo de progresso não carregado antes do motor");
const SIMM=C.simulado;
if(!SIMM) throw new Error("módulo do simulado não carregado antes do motor");
const GUIA_MOD=C.guiaTelas;
if(!GUIA_MOD) throw new Error("módulo do guia não carregado antes do motor");
GUIA_MOD.ligar({
  rota:()=>V, ir:(n,o)=>go(n,o), render:()=>render(), salvar:()=>save(),
  ganharXp:(n,w)=>addXp(n,w), aviso:(m,t)=>toast(m,t),
  lidos:()=>S.guia||(S.guia={}), emSessaoDeEstudo:()=>!!SES,
},{GUIA,DUELOS},typeof C.carregarGuia==="function"?C.carregarGuia:undefined);

/* ============================================================
   MOVIMENTO
   Toda ação re-renderiza a tela por innerHTML. Animação presa a
   estado repetiria a cada clique, então esta camada compara cada
   elemento com [data-k] contra o render anterior da mesma tela e
   só anima o que mudou. Efeitos de uma ação pontual (confirmar
   resposta, virar cartão) chegam pela fila FX e valem um render.
   Com movimento reduzido, nada aqui cria elemento nem conta número.
   ============================================================ */
let FX={};            /* sinais de um render: check, flip, pick (alternativa), yn ("i:v"), nav ("next"|"prev") */
const MEM={};         /* chave da tela -> { chave do nó -> estado } */
const ROTAS=new Set();/* trilhas cuja rota já foi desenhada nesta sessão */
let LAST_XP=null, LAST_PCT=null;

const reduz=()=>{
  try{ return !!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  catch(e){ return false; }
};
/* estados que significam "acabou de ficar disponível ou pronto" */
const ALVO=new Set(["done","now","open","1"]);
const corDe=(el,st)=>{
  if(st==="done"||st==="1") return "var(--go)";
  return el.classList.contains("aw")||el.closest(".aw")?"var(--aw)":"var(--az)";
};
const estado=el=>el.dataset.s!=null?el.dataset.s:(el.dataset.done!=null?el.dataset.done:"");
const chaveTela=()=>V.name==="trilha"?"trilha:"+S.meta:V.name+":"+(V.exam||"");

/* Traça o perímetro do elemento a partir do ponto de chegada, em dois
   braços que se fecham no ponto oposto. Coordenadas em px medidas na hora:
   atributo geométrico com porcentagem não aceita calc() em todo navegador. */
function perimetro(w,h){
  const c=[[1,1],[w-1,1],[w-1,h-1],[1,h-1]];
  const seg=[w-2,h-2,w-2,h-2], L=seg.reduce((a,b)=>a+b,0);
  const ponto=s=>{ s=((s%L)+L)%L; for(let i=0;i<4;i++){ if(s<=seg[i]){ const [x0,y0]=c[i],[x1,y1]=c[(i+1)%4], f=seg[i]?s/seg[i]:0;
    return [x0+(x1-x0)*f,y0+(y1-y0)*f]; } s-=seg[i]; } return c[0]; };
  /* lista de pontos de s0 a s1 (s1>s0), passando pelos cantos no caminho */
  const arco=(s0,s1)=>{
    /* trabalha sempre em posição positiva, senão os cantos antes de zero somem e o braço vira diagonal */
    while(s0<0){ s0+=L; s1+=L; }
    const pts=[ponto(s0)];
    /* posição de cada canto no perímetro, repetida por volta, já em ordem crescente */
    for(let volta=0;volta<3;volta++){ let acc=0;
      for(let i=0;i<4;i++){ acc+=seg[i]; const sc=acc+volta*L; if(sc>s0&&sc<s1) pts.push(ponto(sc)); }
    }
    pts.push(ponto(s1)); return pts;
  };
  return {L,arco};
}
function chegada(el,w,h,P){
  /* onde o pacote encosta: conector acima entra pela borda de cima, ao lado entra pela esquerda */
  const ant=el.previousElementSibling;
  if(ant&&ant.classList.contains("conn")){
    const a=ant.getBoundingClientRect(), b=el.getBoundingClientRect();
    if(a.bottom<=b.top+2) return Math.max(2,Math.min(w-2,a.left+a.width/2-b.left));    /* borda de cima */
    if(a.right<=b.left+2) return P.L-(h/2-1);                                           /* meio da esquerda */
  }
  return 0;                                                                              /* canto superior esquerdo */
}
function traco(el,cor,atraso){
  const r=el.getBoundingClientRect(), w=Math.round(r.width), h=Math.round(r.height);
  if(w<8||h<8) return;
  const P=perimetro(w,h), s0=chegada(el,w,h,P), meio=P.L/2;
  const d=pts=>"M"+pts.map(p=>p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" L");
  const horario=P.arco(s0,s0+meio), anti=P.arco(s0-meio,s0).reverse();
  const NS="http://www.w3.org/2000/svg", svg=document.createElementNS(NS,"svg");
  svg.setAttribute("class","fx-trace"); svg.setAttribute("aria-hidden","true");
  svg.setAttribute("width",w); svg.setAttribute("height",h); svg.setAttribute("viewBox","0 0 "+w+" "+h);
  svg.style.setProperty("--pc",cor); svg.style.setProperty("--d",(atraso|0)+"ms");
  [horario,anti].forEach(pts=>{ const p=document.createElementNS(NS,"path");
    p.setAttribute("d",d(pts)); p.setAttribute("pathLength","1"); svg.appendChild(p); });
  el.classList.add("fx-host"); el.style.setProperty("--d",(atraso|0)+"ms");
  el.appendChild(svg);
  setTimeout(()=>{ svg.remove(); el.classList.remove("fx-host"); el.style.removeProperty("--d"); },(atraso|0)+1500);
}
function pacote(conn,cor,atraso){
  const p=document.createElement("i");
  p.className="fx-pk"; p.setAttribute("aria-hidden","true");
  p.style.setProperty("--pc",cor); p.style.setProperty("--d",(atraso|0)+"ms");
  conn.appendChild(p);
  p.addEventListener("animationend",()=>p.remove());
}
const T_PK=420, T_TR=620, PASSO=130;

/* compara com o render anterior e provisiona o que mudou */
function provisiona(app,pular){
  const k=chaveTela(), antes=MEM[k], agora={};
  const els=[...app.querySelectorAll("[data-k]")];
  els.forEach(el=>{ agora[el.dataset.k]=estado(el); });
  MEM[k]=agora;
  if(!antes||pular) return;
  const mudou=els.filter(el=>{
    const a=antes[el.dataset.k], b=agora[el.dataset.k];
    return a!==undefined&&a!==b&&ALVO.has(b);
  });
  /* se a fronteira inteira mudou, ela fala pelos nós de dentro */
  const final=mudou.filter(el=>!mudou.some(o=>o!==el&&o.contains(el)));
  /* em cadeia: o pacote seguinte só sai quando o nó anterior está quase fechado */
  let relogio=0;
  final.forEach(el=>{
    const st=estado(el), cor=corDe(el,st);
    let d=relogio;
    const ant=el.previousElementSibling;
    if(ant&&ant.classList.contains("conn")){ pacote(ant,cor,d); d+=T_PK-60; }
    traco(el,cor,d);
    relogio=d+Math.round(T_TR*.55);
  });
}

/* trilha: a rota se desenha e o pacote para na etapa atual */
function desenhaRota(app){
  app.querySelectorAll(".flow.vert").forEach(fl=>{
    const filhos=[...fl.children];
    let n=0;
    filhos.forEach(c=>{
      if(c.classList.contains("node")){ c.style.setProperty("--i",n); n++; }
      else if(c.classList.contains("conn")) c.style.setProperty("--i",n);
    });
    fl.classList.add("route-in");
    const nos=filhos.filter(c=>c.classList.contains("node"));
    const conns=filhos.filter(c=>c.classList.contains("conn"));
    let alvo=nos.findIndex(x=>x.dataset.s==="now");
    if(alvo<0) alvo=nos.every(x=>x.dataset.s==="done")?nos.length-1:0;
    const base=nos.length*PASSO+120;
    for(let j=0;j<alvo;j++){
      const de=nos[j];
      pacote(conns[j],de.dataset.s==="done"?"var(--go)":corDe(de,""),base+j*(T_PK-40));
    }
    const fim=base+alvo*(T_PK-40)-40;
    traco(nos[alvo],corDe(nos[alvo],nos[alvo].dataset.s||"now"),Math.max(fim,base-PASSO));
    setTimeout(()=>fl.classList.remove("route-in"),fim+1600);
  });
}

/* XP e meta do dia: contam a partir do valor anterior */
function instrumentos(){
  const inst=[...document.querySelectorAll(".rail-inst .inst")].find(x=>{const kk=x.querySelector(".k");return kk&&kk.textContent==="xp";});
  const v=inst&&inst.querySelector(".v");
  if(v&&LAST_XP!=null&&S.xp>LAST_XP){
    const de=LAST_XP, ate=S.xp, t0=performance.now(), dur=520;
    inst.classList.remove("fx-tick"); void inst.offsetWidth; inst.classList.add("fx-tick");
    const passo=t=>{
      const p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
      if(!v.isConnected) return;
      v.textContent=Math.round(de+(ate-de)*e);
      if(p<1) requestAnimationFrame(passo);
    };
    v.textContent=de; requestAnimationFrame(passo);
  }
  const bar=document.querySelector(".daybar i");
  if(bar){
    const alvo=parseFloat(bar.style.width)||0;
    if(LAST_PCT!=null&&LAST_PCT!==alvo){
      bar.style.width=LAST_PCT+"%"; void bar.offsetWidth; bar.style.width=alvo+"%";
    }
    LAST_PCT=alvo;
  }
  LAST_XP=S.xp;
}

/* escolha e navegação: a classe entra uma vez e sai no fim da animação,
   então um re-render sem mudança não repete nada */
function marcaUmaVez(app,f){
  const liga=(el,cls)=>{ if(!el) return; el.classList.add(cls);
    el.addEventListener("animationend",()=>el.classList.remove(cls),{once:true}); };
  if(f.pick) liga(app.querySelector('.opt[data-k="'+f.pick+'"]'),"fx-pick");
  if(f.yn){ const [i,v]=String(f.yn).split(":"); liga(app.querySelector('[data-act="qyn"][data-i="'+i+'"][data-v="'+v+'"]'),"fx-pick"); }
  if(f.nav==="next"||f.nav==="prev") liga(app.querySelector(".qbox"),"fx-nav-"+f.nav);
  if(f.check){ const v=app.querySelector(".verdict h4"); liga(v,"fx-mark"); }
}
/* chamado ao fim de cada render da tela principal */
function motion(){
  const app=document.getElementById("app"); if(!app) return;
  const f=FX; FX={};
  app.dataset.fx=Object.keys(f).filter(k=>f[k]).join(" ");
  if(reduz()){ provisiona(app,true); LAST_XP=S.xp; return; }
  let rota=false;
  if(V.name==="trilha"&&!ROTAS.has(S.meta)){ ROTAS.add(S.meta); rota=true; }
  provisiona(app,rota);   /* navegar também conta: o que mudou em outra tela aparece ao voltar */
  if(rota) desenhaRota(app);
  marcaUmaVez(app,f);
  if(f.check) app.querySelectorAll('.opt[data-res="ok"],.opt[data-res="miss"],.yn[data-res="ok"],.ord[data-res="ok"],.bucket.ok')
    .forEach((el,i)=>traco(el,"var(--go)",80+i*60));
  instrumentos();
}

/* troca de tela com o código do exame viajando do cartão para o cabeçalho */
function navega(fn,par){
  const ok=par&&typeof document.startViewTransition==="function"&&!reduz();
  if(!ok){ fn(); return; }
  try{ document.startViewTransition(fn); }catch(e){ fn(); }
}

/* ============================================================
   CloudQuest — motor e interface
   Fluxo por domínio: ficha -> aula -> prática -> chefe.
   A prática só abre depois que as fichas do domínio foram lidas.
   ============================================================ */
const MAX_LIVES=5, LIFE_MS=20*60*1000;
const GOALS={1:50,2:100,3:150};
const ACHS=[
  {id:"ficha1",  e:"\u{1F4D6}", t:"Primeira ficha",  d:"Leu uma ficha de estudo até o fim"},
  {id:"domclear",e:"\u{1F9ED}", t:"Domínio limpo",   d:"Leu todas as fichas de um domínio"},
  {id:"aula1",   e:"\u{1F3AC}", t:"Primeira aula",   d:"Assistiu uma aula de 90 segundos"},
  {id:"boss1",   e:"\u{1F3F4}", t:"Mata-chefe",      d:"Venceu uma batalha de domínio"},
  {id:"streak7", e:"\u{1F525}", t:"Semana inteira",  d:"Sete dias seguidos de estudo"},
  {id:"combo10", e:"⚡",    t:"Dez na sequência",d:"Dez acertos seguidos"},
  {id:"q50",     e:"\u{1F4DA}", t:"Cinquenta",       d:"Respondeu 50 questões"},
  {id:"passaz",  e:"\u{1F537}", t:"Azure aprovado",  d:"Passou num simulado do Azure"},
  {id:"passaw",  e:"\u{1F536}", t:"AWS aprovado",    d:"Passou num simulado da AWS"},
  {id:"perfect", e:"\u{1F3AF}", t:"Gabarito",        d:"Acertou um simulado inteiro"},
  {id:"bothclouds",e:"\u{1F500}",t:"Bilíngue",       d:"Estudou fichas das duas nuvens"},
  {id:"allfichas",e:"\u{1F4D1}",t:"Leitura completa",d:"Leu todas as fichas de um exame"},
  {id:"revisao",  e:"\u{1F504}", t:"Em dia",           d:"Zerou a fila de revisão"},
  {id:"cartoes",  e:"\u{1F5C3}", t:"Cem cartões",      d:"Respondeu 100 cartões de memorização"},
  {id:"baralho",  e:"\u{1F5C2}", t:"Triagem perfeita", d:"Acertou um baralho de classificação inteiro"},
  {id:"relampago",e:"\u26A1",    t:"Relâmpago",        d:"20 acertos em um minuto"},
  {id:"desafio",  e:"\u{1F3C1}", t:"Desafiante",       d:"Criou ou aceitou um desafio"}
];

/* ---------- estado ---------- */
const KEY="cloudquest.v2";
const DEF=()=>({v:2,xp:0,todayXp:0,streak:0,lastDay:null,shields:1,lives:MAX_LIVES,livesTs:Date.now(),
  goal:2,concepts:{},seen:{},fichas:{},guia:{},lessons:{},bosses:{},sims:[],ach:{},dates:{},sim:null,cards:{},theme:"auto",decks:{},sprints:[],challenges:[],
  meta:"admin",certs:{},catProv:"all",catGroup:"trilha",
  weekXp:0,weekKey:null,combo:0,bestCombo:0,dailyDone:null,dayKeyCur:null,answered:0,dias:{}});
let S=DEF();

function applyTheme(){
  const r=document.documentElement;
  if(!r||!r.setAttribute) return;
  if(S.theme==="dark"||S.theme==="light") r.setAttribute("data-theme",S.theme);
  else r.removeAttribute("data-theme");
}
/* armazenamento do navegador, ou null quando bloqueado (modo privado restrito, iframe) */
const ARMAZ=(()=>{ try{ return window.localStorage; }catch(e){ return null; } })();
let AVISO_LEITURA=null, ULTIMO_AVISO_COTA=0, PERSIST_PEDIDO=false;
function load(){
  let bruto=null;
  try{ bruto=ARMAZ?ARMAZ.getItem(KEY):null; }catch(e){ bruto=null; }
  const l=PROG.interpretar(bruto);
  if(l.estado) S=Object.assign(DEF(),l.estado);
  else if(l.problema&&bruto){
    /* nunca jogar fora: guarda a cópia antes que o próximo save sobrescreva */
    const k=ARMAZ&&PROG.guardarBackup(ARMAZ,bruto);
    AVISO_LEITURA=k?"Não consegui ler o progresso salvo. Guardei uma cópia: veja Perfil → Dados."
      :"Não consegui ler o progresso salvo nem guardar uma cópia. Exporte o que tiver antes de continuar.";
  }
  rollDay(); rollWeek(); regenLives(); applyTheme();
}
function save(){
  S.upd=Date.now();
  const r=PROG.salvar(ARMAZ,S);
  if(r!=="ok"&&Date.now()-ULTIMO_AVISO_COTA>6e4){
    ULTIMO_AVISO_COTA=Date.now();
    toast(r==="cota"?"Sem espaço para salvar no navegador. Exporte o progresso ou entre na conta.":"Este navegador não deixa salvar. Exporte o progresso para não perder.","no");
  }
  /* pede para o navegador não apagar os dados do site (uma vez, depois que há progresso) */
  if(r==="ok"&&!PERSIST_PEDIDO&&S.xp>0){ PERSIST_PEDIDO=true; PROG.persistir(); }
  if(typeof C.aoSalvar==="function") C.aoSalvar();
}
/* troca o estado inteiro vindo da conta (src/features/conta): não marca edição nova */
function substituirEstado(novo){
  /* estado ruim na nuvem não pode quebrar o app em todos os aparelhos */
  if(!PROG.valido(novo)){ toast("O progresso da conta veio em formato inválido. Mantive o deste aparelho.","no"); return; }
  S=Object.assign(DEF(),novo);
  rollDay(); rollWeek(); regenLives(); applyTheme();
  PROG.salvar(ARMAZ,S);
  render();
}
/* outra aba salvou: junta sem regredir nada (mesma regra da conta) e redesenha */
window.addEventListener("storage",ev=>{
  if(ev.key!==KEY||!ev.newValue) return;
  const l=PROG.interpretar(ev.newValue);
  if(!l.estado) return;
  S=Object.assign(DEF(),PROG.mesclar(S,l.estado));
  rollDay(); rollWeek(); regenLives(); applyTheme();
  /* sessão ou simulado em andamento nesta aba continuam onde estão */
  if(!SES&&!(SIM&&!SIM.done)) render();
});

/* chave local, para a virada do dia seguir o fuso de quem estuda */
function dayKey(d){ d=d||new Date(); const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4); return z.toISOString().slice(0,10); }
function weekKey(){ const d=new Date(); const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);
  z.setUTCDate(z.getUTCDate()-((z.getUTCDay()+6)%7)); return z.toISOString().slice(0,10); }
function rollDay(){
  const t=dayKey();
  if(S.dayKeyCur!==t){ S.dayKeyCur=t; S.todayXp=0; }
  if(!S.lastDay||S.lastDay===t) return;
  const diff=Math.round((new Date(t)-new Date(S.lastDay))/864e5);
  if(diff===2&&S.shields>0){ S.shields--; toast("Congelador usado: ofensiva mantida","fl"); }
  else if(diff>1){ S.streak=0; }
}
function rollWeek(){ const w=weekKey(); if(S.weekKey!==w){ S.weekKey=w; S.weekXp=0; } }
function regenLives(){
  if(S.lives>=MAX_LIVES){ S.livesTs=Date.now(); return; }
  const g=Math.floor((Date.now()-S.livesTs)/LIFE_MS);
  if(g>0){ S.lives=Math.min(MAX_LIVES,S.lives+g); S.livesTs=Date.now(); }
}
function addXp(n,why){
  S.xp+=n; S.weekXp+=n; S.todayXp+=n;
  const t=dayKey();
  /* XP por dia, para o calendário de estudo (guarda ~1 ano) */
  if(!S.dias||typeof S.dias!=="object") S.dias={};
  S.dias[t]=(S.dias[t]||0)+n;
  const chaves=Object.keys(S.dias); if(chaves.length>400) chaves.sort().slice(0,chaves.length-400).forEach(k=>delete S.dias[k]);
  if(S.lastDay!==t){
    const diff=S.lastDay?Math.round((new Date(t)-new Date(S.lastDay))/864e5):1;
    S.streak=(!S.lastDay||diff===1)?S.streak+1:1;
    S.lastDay=t;
    if(S.streak>=7) unlock("streak7");
    // um congelador a cada sete dias de ofensiva, até dois guardados
    if(S.streak%7===0&&S.shields<2){ S.shields++; toast("Ganhou um congelador de ofensiva","ok"); }
    toast("Ofensiva de "+S.streak+(S.streak===1?" dia":" dias"),"fl");
  }
  if(why) toast("+"+n+" XP · "+why);
  save();
}
function unlock(id){
  if(S.ach[id]) return;
  S.ach[id]=Date.now();
  const a=ACHS.find(x=>x.id===id);
  if(a) toast(a.e+"  "+a.t,"ok");
  save();
}

/* ---------- repetição espaçada: FSRS-5 (src/features/srs/fsrs.ts) ----------
   nota: 1 errei, 2 acertei com dúvida, 3 acertei. Estado antigo do SM-2
   (ease/intv) é convertido na primeira revisão, sem perder a data. */
const F=C.fsrs;
if(!F) throw new Error("módulo FSRS não carregado antes do motor");
function cs(id){ if(!S.concepts[id]) S.concepts[id]={ease:2.5,reps:0,intv:0,due:0,prof:.3,n:0}; return S.concepts[id]; }
function schedule(id,ok,nota){
  const c=cs(id), agora=Date.now();
  const g=nota||(ok?F.Nota.acertei:F.Nota.errei);
  const antes=(typeof c.s==="number"&&typeof c.last==="number")?{s:c.s,d:c.d,ultima:c.last}:F.deSm2(c);
  const m=F.revisar(antes,g,agora);
  c.s=m.s; c.d=m.d; c.last=m.ultima; c.due=F.proximaRevisao(m); c.intv=F.intervaloDias(m.s); c.n++;
  const k=Math.max(.18,.5-c.n*.04);
  c.prof=Math.min(1,Math.max(0,c.prof+k*((ok?(g===F.Nota.duvida?.7:1):0)-c.prof)));
  save();
}
const isDue=id=>{ const c=S.concepts[id]; return !c||c.due<=Date.now(); };

/* ---------- consultas ---------- */
const ex0=id=>EXAMS.find(e=>e.id===id);
const isAws=id=>ex0(id).provider==="aws";
const prov=id=>PROVIDERS[ex0(id).provider];
const fichasOf=(exam,dom)=>FICHAS.filter(f=>f.exam===exam&&(!dom||f.dom===dom));
const lessonIn=(l,exam)=>l.exam===exam||(l.exam==="both"&&!!(l.doms&&l.doms[exam]));
const lessonDom=(l,exam)=>(l.doms&&l.doms[exam])||l.dom;
const lessonsOf=(exam,dom)=>LESSONS.filter(l=>lessonIn(l,exam)&&(!dom||lessonDom(l,exam)===dom));
const qPool=(exam,dom)=>QUESTIONS.filter(q=>q.exam===exam&&(!dom||q.dom===dom));

/* conteúdo antes da lição: a prática do domínio exige as fichas lidas */
const fichasRead=(exam,dom)=>fichasOf(exam,dom).filter(f=>S.fichas[f.id]).length;
/* Fichas marcadas extra:true são aprofundamento: contam no progresso,
   mas não trancam a prática. Assim, publicar ficha nova nunca tranca de
   volta um domínio que o estudante já tinha liberado. */
const fichasBase=(exam,dom)=>{ const t=fichasOf(exam,dom), b=t.filter(f=>!f.extra); return b.length?b:t; };
const contentDone=(exam,dom)=>{ const t=fichasBase(exam,dom); return t.length>0&&t.every(f=>S.fichas[f.id]); };
const domOpen=(exam,i)=>{ const e=ex0(exam); return i===0||!!S.bosses[exam+":"+e.domains[i-1].id]; };

function domProf(exam,dom){
  const tags=new Set(); qPool(exam,dom).forEach(q=>(q.tags||[]).forEach(t=>tags.add(t)));
  let p=0,k=0; tags.forEach(t=>{ const c=S.concepts[t]; if(c){ p+=c.prof; k++; } });
  return k?p/k:0;
}
function predict(exam){
  const e=ex0(exam); if(!e||!e.domains.length) return null;
  let ws=0,acc=0,obs=0;
  e.domains.forEach(d=>{
    const w=parseFloat(d.w)||25;
    const tags=new Set(); qPool(exam,d.id).forEach(q=>(q.tags||[]).forEach(t=>tags.add(t)));
    let p=0,k=0; tags.forEach(t=>{ const c=S.concepts[t]; if(c){ p+=c.prof; k++; obs+=c.n; } });
    acc+=w*(k?p/k:.3); ws+=w;
  });
  const prof=ws?acc/ws:.3;
  const conf=Math.min(.9,obs/60);
  // com menos de 12 observações a estimativa não significa nada: não inventa número
  return { score:Math.round(300+700*prof), ci:Math.round(150*(1-conf)+25),
           pass:e.pass, conf:Math.round(conf*100), obs, ready:obs>=12 };
}

/* ---------- seleção adaptativa ---------- */
function qScore(q){
  const tags=q.tags||[];
  const prof=tags.length?tags.reduce((a,t)=>a+(S.concepts[t]?S.concepts[t].prof:.3),0)/tags.length:.3;
  const seen=S.seen[q.id];
  const due=tags.some(isDue)?0:.45;
  const rep=seen?Math.min(.5,seen.n*.12):0;
  const was=seen&&seen.ok?.25:0;
  const fit=Math.abs((q.lvl/5)-Math.min(.95,prof+.25));
  return prof*.8+due+rep+was+fit*.6+Math.random()*.18;
}
const pick=(exam,dom,n)=>qPool(exam,dom).slice().sort((a,b)=>qScore(a)-qScore(b)).slice(0,n);
/* Ordem de preferência no sorteio: questão nunca vista, depois a que o
   estudante errou, depois a acertada há mais tempo. Assim simulados seguidos
   não repetem as mesmas questões enquanto houver inéditas no banco. */
function simPriority(qs){
  const tier=q=>{ const s=S.seen[q.id]; return !s?0:s.ok?2:1; };
  const ts=q=>{ const s=S.seen[q.id]; return s&&s.lastTs||0; };
  return shuffle(qs).map((q,i)=>({q,i})).sort((a,b)=>
    tier(a.q)-tier(b.q) || (tier(a.q)===2?ts(a.q)-ts(b.q):0) || a.i-b.i).map(x=>x.q);
}
/* montagem, peso dos domínios e regra da prova completa: src/features/simulado */
const pickSim=(exam,n)=>SIMM.montar(qPool(exam),ex0(exam).domains,n,S.seen);
const fullSpec=exam=>SIMM.especCompleta(ex0(exam));
const fullReady=exam=>SIMM.completaDisponivel(ex0(exam),qPool(exam).length);

/* ---------- cartões de memorização ----------
   Gerados das tabelas "sinal no enunciado -> resposta" das fichas: é o
   material que mais se parece com o que a prova realmente pede. */
const CARDS=(()=>{
  const out=[];
  FICHAS.forEach(f=>f.blocks.forEach((b,bi)=>{
    if(b.t!=="signal") return;
    const rot=b.head||["Sinal no enunciado","Resposta"];
    b.rows.forEach((r,ri)=>out.push({
      id:f.id+":"+bi+":"+ri, q:r[0], a:r[1],
      ql:rot[0], al:rot[1],
      ficha:f.id, titulo:f.title, exam:f.exam, dom:f.dom, concept:f.concept
    }));
  }));
  return out;
})();
function cardState(id){ if(!S.cards[id]) S.cards[id]={n:0,streak:0,due:0}; return S.cards[id]; }
function cardDue(){ return CARDS.filter(c=>{ const st=S.cards[c.id]; return !st||st.due<=Date.now(); }); }
function scheduleCard(id,ok){
  const c=cardState(id);
  c.n++;
  c.streak=ok?c.streak+1:0;
  const dias=!ok?0:[1,2,4,8,16,30][Math.min(c.streak-1,5)];
  c.due=Date.now()+dias*864e5;
  save();
}
function pickCards(n){
  const prof=c=>{ const k=S.concepts[c.concept]; return k?k.prof:.3; };
  return cardDue().slice()
    .sort((a,b)=>(prof(a)-prof(b))+((S.cards[a.id]?S.cards[a.id].n:0)-(S.cards[b.id]?S.cards[b.id].n:0))*.1+(Math.random()-.5)*.4)
    .slice(0,n);
}

/* ---------- fila de revisão (repetição espaçada) ---------- */
/* Um conceito entra na fila quando o intervalo calculado vence. Conceito
   nunca praticado não é "revisão": é conteúdo novo, e fica fora da fila. */
function dueConcepts(exam){
  const out=[];
  Object.keys(S.concepts).forEach(id=>{
    const c=S.concepts[id];
    if(c.n>0 && c.due<=Date.now()){
      const qs=QUESTIONS.filter(q=>(q.tags||[]).includes(id) && (!exam||q.exam===exam));
      if(qs.length) out.push({id,prof:c.prof,due:c.due,n:c.n,qs:qs.length});
    }
  });
  return out.sort((a,b)=>a.prof-b.prof||a.due-b.due);
}
function reviewQuestions(n){
  const due=dueConcepts(null).map(d=>d.id);
  if(!due.length) return [];
  const pool=QUESTIONS.filter(q=>(q.tags||[]).some(t=>due.includes(t)));
  return pool.slice().sort((a,b)=>qScore(a)-qScore(b)).slice(0,n);
}
const daysTo=iso=>{ if(!iso) return null;
  const d=new Date(iso+"T12:00:00"), t=new Date(dayKey()+"T12:00:00");
  return Math.round((d-t)/864e5); };

/* ---------- utilidades ---------- */
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $=s=>document.querySelector(s);
function shuffle(a){ const r=a.slice(); for(let i=r.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [r[i],r[j]]=[r[j],r[i]]; } return r; }
const clock=ms=>{ const s=Math.max(0,Math.round(ms/1000)); return String((s/60)|0).padStart(2,"0")+":"+String(s%60).padStart(2,"0"); };
const pctScore=n=>Math.max(0,Math.min(100,(n-300)/7));
let TQ=[];
function toast(msg,cls){
  const box=$("#toasts"); if(!box) return;
  const el=document.createElement("div");
  el.className="toast"+(cls?" "+cls:""); el.textContent=msg;
  box.appendChild(el); TQ.push(el);
  setTimeout(()=>{ el.style.transition="opacity .25s"; el.style.opacity="0"; setTimeout(()=>el.remove(),250); },2200);
  while(TQ.length>3){ const o=TQ.shift(); if(o) o.remove(); }
}

/* ---------- estado de navegação ---------- */
let V={name:"home"}, SES=null, SIM=null, PL=null, RD=null, CARD=null, DK=null, SP=null, timers=[];
const clearTimers=()=>{ timers.forEach(t=>{clearTimeout(t);clearInterval(t);}); timers=[]; };
function go(name,o){
  clearTimers();
  if(typeof C.aoNavegar==="function") C.aoNavegar(name,o);
  const de=V.name;
  V=Object.assign({name},o||{});
  /* o estado já mudou; só a troca de DOM espera a transição */
  const par=(de==="home"&&name==="exam")||(de==="exam"&&name==="home");
  navega(()=>{ render(); window.scrollTo(0,0); },par);
}

/* ============================================================
   RENDER — gramática de diagrama
   ============================================================ */
function render(){
  regenLives(); rollDay(); rollWeek();
  const app=$("#app");
  if(V.name==="ficha"){ app.innerHTML=viewFicha(); afterFicha(); return; }
  if(V.name==="aula"){  app.innerHTML=viewAula();  afterAula();  return; }
  let body;
  switch(V.name){
    case "exam":    body=viewExam(); break;
    case "review":  body=viewReview(); break;
    case "deck":    body=viewDeck(); break;
    case "sprint":  body=viewSprint(); break;
    case "chall":   body=viewChall(); break;
    case "cards":   body=viewCards(); break;
    case "study":   body=viewStudy(); break;
    case "sim":     body=viewSim(); break;
    case "simres":  body=viewSimRes(); break;
    case "compare": body=viewCompare(); break;
    case "guia": case "serv": case "duelo": case "gq": body=GUIA_MOD.tela(V.name); break;
    case "trilha":  body=viewTrilha(); break;
    case "cat":     body=viewCat(); break;
    case "me":      body=viewMe(); break;
    default:        body=viewHome();
  }
  app.innerHTML=shell(body);
  motion();
  if(V.name==="sim") afterSim();
  if(V.name==="exam") requestAnimationFrame(animateRuler);
  if(V.name==="guia"&&V.gq) GUIA_MOD.filtrar();
}

function shell(body){
  const goal=GOALS[S.goal], pct=Math.min(100,Math.round(S.todayXp/goal*100));
  const tabs=[["home","Exames"],["trilha","Trilha"],["guia","Guia"],["review","Treinar"],["chall","Desafios"],["me","Perfil"]];
  const cur=n=>V.name===n||(n==="home"&&["exam","study","sim","simres"].includes(V.name))||(n==="trilha"&&V.name==="cat")||(n==="guia"&&["serv","duelo","gq"].includes(V.name));
  const due=dueConcepts(null).length;
  const inst=(k,v,cls)=>`<span class="inst ${cls||""}"><span class="k">${k}</span><span class="v">${v}</span></span>`;
  return `
  <a class="skip" href="#main">Pular para o conteúdo</a>
  <header class="rail">
    <button class="rail-brand" data-act="home"><span class="mk" aria-hidden="true"><i></i><i></i></span>CloudQuest</button>
    <nav class="rail-tabs">${tabs.map(([n,t])=>
      `<button data-act="${n}" aria-current="${cur(n)}">${t}${n==="review"&&due?' <b class="badge">'+due+'</b>':""}</button>`).join("")}</nav>
    <div class="rail-inst">
      ${inst("xp",S.xp)}${inst("dias",S.streak,"hot")}${inst("energia",S.lives+"/"+MAX_LIVES,"life")}
    </div>
  </header>
  <div class="daybar" title="Meta do dia: ${S.todayXp} de ${goal} XP"><i style="width:${pct}%"></i></div>
  <div class="canvas" id="main" tabindex="-1">${body}</div>`;
}

/* ---------------- início ---------------- */
function viewHome(){
  const act=EXAMS.filter(e=>e.status==="active");
  const d=daily();
  return `
  <div class="stack-lg">
    <section>
      <h1 class="t-2xl" style="max-width:19ch">Estude pelo guia do exame, não por vídeo solto.</h1>
      <p class="t-md dim" style="margin-top:10px;max-width:62ch">Cada domínio é uma fronteira com quatro etapas ligadas em sequência: ficha, aula, prática e chefe. A prática só abre quando o conteúdo do domínio tiver sido lido.</p>
    </section>

    ${S.sim&&S.sim.end>Date.now()?`<section class="sheet tight" style="border-color:var(--fl)">
      <div class="spread">
        <div><h2 class="t-md">Simulado em andamento</h2>
        <p class="t-sm dim" style="margin-top:2px">${ex0(S.sim.exam).code}, questão ${S.sim.i+1} de ${S.sim.ids.length}. Restam ${clock(S.sim.end-Date.now())}.</p></div>
        <div class="row">
          <button class="btn sm" data-act="simdrop">Descartar</button>
          <button class="btn fill sm" data-act="simresume">Retomar</button>
        </div>
      </div></section>`:""}

    ${(()=>{ const n=dueConcepts(null).length; return n?`<section class="sheet tight" style="border-color:var(--go)">
      <div class="spread">
        <div><h2 class="t-md">Revisão de hoje</h2>
        <p class="t-sm dim" style="margin-top:2px">${n} ${n===1?"conceito está":"conceitos estão"} no ponto de esquecer. Revisar agora fixa por mais tempo.</p></div>
        <button class="btn go sm" data-act="review-go">Revisar ${n}</button>
      </div></section>`:""; })()}

    ${d?`<section class="sheet tight">
      <div class="spread">
        <div><h2 class="t-md">Desafio do dia</h2>
        <p class="t-sm dim" style="margin-top:2px">Um cenário difícil, sorteado. ${S.dailyDone===dayKey()?"Você já fez o de hoje.":"Vale 25 XP."}</p></div>
        <button class="btn ${S.dailyDone===dayKey()?"":"fill"} sm" data-act="daily" ${S.dailyDone===dayKey()?"disabled":""}>
          ${S.dailyDone===dayKey()?"Concluído":"Começar"}</button>
      </div></section>`:""}

    <section>
      <div class="hd"><h2>Em estudo</h2><span class="n">largura de cada bloco = peso do domínio</span></div>
      <div class="exams">${act.map(examCard).join("")}</div>
    </section>

    <section class="sheet">
      <div class="hd"><h2>Para onde isso leva</h2><span class="n">${CATALOGO.length} certificações mapeadas</span></div>
      <p class="t-sm dim" style="max-width:66ch">Certificação isolada vale menos que sequência. A trilha mostra, por objetivo de carreira, qual credencial vem depois desta, o que ela exige e quanto custa, nas duas nuvens.</p>
      <div class="goals" style="margin-top:12px">${METAS.map(m=>
        `<button data-act="meta" data-v="${m.id}" aria-pressed="${S.meta===m.id}"><span class="ic" aria-hidden="true">${m.icone}</span>${esc(m.nome)}</button>`).join("")}</div>
      <div class="row" style="margin-top:14px;gap:8px">
        <button class="btn fill sm" data-act="trilha">Abrir a trilha</button>
        <button class="btn sm" data-act="cat">Ver o catálogo inteiro</button>
      </div>
    </section>

    <section class="stack">
      <div class="note"><b>O catálogo é mantido à mão, revisado em ${CATALOG_SYNCED}.</b> Microsoft e AWS aposentam exames e trocam versões com frequência: em 2026 saíram AZ-204, AZ-500, AI-900, AI-102, DP-100, MS-900 e o ML Specialty da AWS, e entraram credenciais novas de IA. Antes de marcar prova, confirme código, versão, peso de domínio e nota de corte em <a href="https://learn.microsoft.com/credentials/" target="_blank" rel="noopener">learn.microsoft.com/credentials</a> e <a href="https://aws.amazon.com/certification/" target="_blank" rel="noopener">aws.amazon.com/certification</a>.</div>
      <div class="note">As ${QUESTIONS.length} questões e as ${FICHAS.length} fichas são conteúdo original, escrito a partir dos objetivos públicos dos guias de exame. Nada aqui reproduz ou imita questão real de prova. Projeto independente, sem vínculo com a Microsoft ou com a Amazon Web Services.</div>
    </section>
  </div>`;
}
function examCard(e){
  const p=PROVIDERS[e.provider], on=e.status==="active", aw=p.cls==="aw";
  const st={active:"ativo",soon:"no roteiro",beta:"beta",retiring:"sai em breve",retired:"aposentado"}[e.status]||e.status;
  const pr=on?predict(e.id):null;
  const ws=on?e.domains.map(d=>parseFloat(d.w)||25):[];
  return `<button class="exam" data-soon="${on?0:1}" ${on?`data-act="exam" data-exam="${e.id}"`:`data-act="soon"`}>
    <div class="bd ${aw?"aw":""}" data-s="${on?"open":"lock"}">
      <span class="bd-tab" style="view-transition-name:vt-${e.id}"><span class="ix">${e.code}</span><span class="nm">${esc(p.short)}</span></span>
      <span class="bd-w">${st}</span>
      <h3>${esc(e.name)}</h3>
      <p class="t-sm dim">${esc(e.level)}${e.note?". "+esc(e.note):""}</p>
      ${on?`<div class="bands" style="height:52px;margin-top:12px">${e.domains.map((d,i)=>{
        const v=Math.round(domProf(e.id,d.id)*100);
        return `<div class="band ${aw?"aw":""}" style="flex:${ws[i]}" title="${esc(d.name)}: ${d.w}">
          <i style="height:${v}%"></i><span><b class="d">D${i+1}</b><b class="v">${d.w}</b></span></div>`;}).join("")}</div>
      <dl class="facts">
        <dt>Prontidão</dt><dd>${pr.ready?pr.score+" de "+e.scale:"sem dados ainda"}</dd>
        <dt>Corte</dt><dd>${e.pass}</dd>
        <dt>Fichas</dt><dd>${fichasOf(e.id).filter(f=>S.fichas[f.id]).length} de ${fichasOf(e.id).length} lidas</dd>
      </dl>`:""}
    </div>
  </button>`;
}

/* ---------------- trilha de certificações ---------------- */
const cat0=id=>CATALOGO.find(c=>c.id===id);
const meta0=()=>METAS.find(m=>m.id===S.meta)||METAS[0];
const ST_LBL={done:"concluída",doing:"estudando",plan:"planejada"};
/* a que trilhas de carreira uma certificação pertence, derivado de METAS */
const trilhasDe=id=>METAS.filter(m=>m.azure.includes(id)||m.aws.includes(id));
function chipsTrilha(id,clicavel){
  const ts=trilhasDe(id);
  if(!ts.length) return "";
  return `<div class="trs"><span class="lb">trilha</span>${ts.map(m=>
    clicavel
      ? `<button class="tr ${S.meta===m.id?"on":""}" data-act="metago" data-v="${m.id}" title="Abrir a trilha ${esc(m.nome)}"><span class="ic" aria-hidden="true">${m.icone}</span>${esc(m.nome)}</button>`
      : `<span class="tr ${S.meta===m.id?"on":""}"><span class="ic" aria-hidden="true">${m.icone}</span>${esc(m.nome)}</span>`
  ).join("")}</div>`;
}

function coverage(id){
  const c=cat0(id);
  if(!c||!c.conteudo) return null;
  return {
    fichas:FICHAS.filter(f=>f.exam===id).length,
    lidas:FICHAS.filter(f=>f.exam===id&&S.fichas[f.id]).length,
    questoes:QUESTIONS.filter(q=>q.exam===id).length,
    aulas:LESSONS.filter(l=>lessonIn(l,id)).length,
    baralhos:DECKS.filter(d=>d.exam===id).length
  };
}
function segCert(id){
  return `<div class="seg" role="group" aria-label="Situação desta certificação">${
    [["plan","Planejada"],["doing","Estudando"],["done","Concluída"]].map(([v,t])=>
      `<button data-act="certst" data-id="${id}" data-v="${v}" aria-pressed="${S.certs[id]===v}">${t}</button>`).join("")
  }</div>`;
}
function stageNode(id,i,prevIds,aw){
  const c=cat0(id); if(!c) return "";
  const st=S.certs[id]||"";
  const first=prevIds.every(p=>S.certs[p]==="done");
  const s=st==="done"?"done":(st==="doing"||(first&&!st)?"now":"");
  const cv=coverage(id);
  const falta=c.prereq.filter(p=>S.certs[p]!=="done").map(p=>(cat0(p)||{}).code).filter(Boolean);
  return `<div class="node ${aw?"aw":""}" data-k="c:${id}"${s?` data-s="${s}"`:""}>
    <div class="node-h"><span class="gl" aria-hidden="true"></span>
      <span class="mono">${c.code}</span><span class="lv">${esc(c.nivel)}</span>
      <span class="st">${st?ST_LBL[st]:"etapa "+(i+1)}</span></div>
    <div class="node-b">
      <div>
        <div style="font-size:13.5px;font-weight:600;line-height:1.3">${esc(c.nome)}</div>
        <p class="node-p" style="margin-top:4px">${esc(c.foco)}.</p>
      </div>
      <div class="node-meta">${c.horas} h de estudo · ${esc(c.preco)} · validade: ${esc(c.validade)}</div>
      ${chipsTrilha(id,false)}
      ${c.nota?`<p class="t-xs dim2" style="line-height:1.5">${esc(c.nota)}</p>`:""}
      ${falta.length?`<p class="t-xs" style="color:var(--fl);line-height:1.5">Exige ${falta.join(" e ")} em dia antes de valer como credencial.</p>`:""}
      ${cv
        ? `<p class="t-xs" style="color:var(--go);line-height:1.5">Conteúdo aqui dentro: ${cv.fichas} fichas (${cv.lidas} lidas), ${cv.aulas} aulas, ${cv.questoes} questões, ${cv.baralhos} baralhos.</p>`
        : `<p class="t-xs dim2" style="line-height:1.5">Sem conteúdo no CloudQuest ainda. A ficha do catálogo serve para planejar: objetivo, horas, custo e validade.</p>`}
      <div class="row" style="gap:8px;flex-wrap:wrap">
        ${cv?`<button class="btn ${s==="now"?"fill":""} sm" data-act="exam" data-exam="${id}">Estudar o ${c.code}</button>`:""}
        ${segCert(id)}
      </div>
    </div>
  </div>`;
}
function trackBlock(provId,ids){
  const p=PROVIDERS[provId], aw=provId==="aws";
  const done=ids.filter(i=>S.certs[i]==="done").length;
  const doing=ids.filter(i=>S.certs[i]==="doing").length;
  return `<section class="sheet">
    <div class="hd">
      <h2><span class="tag ${aw?"aw":"az"} mono">${p.icon}</span> ${esc(p.name)}</h2>
      <span class="n">${done} de ${ids.length} concluídas</span>
    </div>
    <div class="tbar" style="margin-bottom:14px">
      <i style="flex:${done}"></i><i class="d" style="flex:${doing}"></i><i style="flex:${ids.length-done-doing};background:transparent"></i>
    </div>
    <div class="flow vert">${ids.map((id,i)=>
      (i?`<div class="conn" aria-hidden="true"></div>`:"")+stageNode(id,i,ids.slice(0,i),aw)).join("")}</div>
  </section>`;
}
function viewTrilha(){
  const m=meta0();
  const todas=CATALOGO.filter(c=>c.conteudo).length;
  const marcadas=Object.keys(S.certs).filter(k=>S.certs[k]).length;
  return `
  <div class="stack-lg">
    <section>
      <h1 class="t-2xl" style="max-width:21ch">Uma credencial só vale o que a próxima constrói.</h1>
      <p class="t-md dim" style="margin-top:10px;max-width:64ch">Escolha o objetivo e a trilha mostra a sequência nas duas nuvens, com pré-requisito, horas, custo e validade de cada etapa. O que já tem conteúdo aqui dentro aparece marcado.</p>
    </section>

    <section>
      <div class="hd"><h2>Objetivo de carreira</h2><span class="n">${METAS.length} trilhas</span></div>
      <div class="goals">${METAS.map(x=>
        `<button data-act="meta" data-v="${x.id}" aria-pressed="${S.meta===x.id}"><span class="ic" aria-hidden="true">${x.icone}</span>${esc(x.nome)}</button>`).join("")}</div>
    </section>

    <section class="sheet tight">
      <h2 class="t-md">${esc(m.nome)}</h2>
      <p class="t-sm dim" style="margin-top:6px;max-width:68ch">${esc(m.desc)}</p>
      <p class="t-sm" style="margin-top:10px;max-width:68ch;color:var(--ink2)"><b>Por que nesta ordem:</b> ${esc(m.nota)}</p>
    </section>

    ${trackBlock("azure",m.azure)}
    ${trackBlock("aws",m.aws)}

    <section class="legend">
      <span class="lg"><i class="m done" aria-hidden="true"></i>concluída</span>
      <span class="lg"><i class="m now" aria-hidden="true"></i>etapa atual ou em estudo</span>
      <span class="lg"><i class="m" aria-hidden="true"></i>etapa seguinte</span>
      <span class="lg mono" style="margin-left:auto">${marcadas} marcada${marcadas===1?"":"s"} por você</span>
    </section>

    <section class="stack">
      <div class="row" style="gap:8px">
        <button class="btn sm" data-act="cat">Catálogo completo, ${CATALOGO.length} certificações</button>
        <button class="btn sm" data-act="home">Voltar aos exames</button>
      </div>
      <div class="note"><b>O que é trilha e o que é conteúdo.</b> As ${CATALOGO.length} certificações do catálogo existem para planejar: nenhuma delas é promessa de material. Hoje ${todas} têm fichas, aulas e questões aqui dentro; as outras mostram objetivo, horas, custo e validade para você montar o calendário e estudar na fonte oficial.</div>
      <div class="note">Código, versão, preço e validade mudam sem aviso, e o catálogo foi revisado em ${CATALOG_SYNCED}. Confirme em <a href="https://learn.microsoft.com/credentials/" target="_blank" rel="noopener">learn.microsoft.com/credentials</a> e <a href="https://aws.amazon.com/certification/" target="_blank" rel="noopener">aws.amazon.com/certification</a> antes de pagar inscrição.</div>
    </section>
  </div>`;
}

const NIVEIS=["Fundamentos","Associate","Professional","Especialidade","Expert"];
function catCard(c){
  const aw=c.prov==="aws", cv=coverage(c.id), st=S.certs[c.id]||"";
  return `<div class="catc ${aw?"aw":""}" data-has="${cv?1:0}">
    <div class="spread">
      <span class="cd" style="color:var(--${aw?"aw":"az"})">${c.code}</span>
      <span class="t-xs dim2 mono">${esc(c.nivel)}</span>
    </div>
    <div class="nm">${esc(c.nome)}</div>
    <div class="fo">${esc(c.foco)}.</div>
    <dl>
      <dt>Estudo</dt><dd>${c.horas} h</dd>
      <dt>Inscrição</dt><dd>${esc(c.preco)}</dd>
      <dt>Validade</dt><dd>${esc(c.validade)}</dd>
      ${c.prereq.length?`<dt>Exige</dt><dd>${c.prereq.map(p=>(cat0(p)||{}).code).filter(Boolean).join(", ")}</dd>`:""}
      <dt>No app</dt><dd>${cv?cv.fichas+" fichas, "+cv.questoes+" questões":"só a ficha de planejamento"}</dd>
      ${st?`<dt>Você</dt><dd>${ST_LBL[st]}</dd>`:""}
    </dl>
    ${c.nota?`<p class="t-xs dim2" style="line-height:1.45">${esc(c.nota)}</p>`:""}
    ${chipsTrilha(c.id,true)}
    <div class="row" style="gap:7px;flex-wrap:wrap;margin-top:2px">
      ${cv?`<button class="btn sm" data-act="exam" data-exam="${c.id}">Estudar</button>`:""}
      ${segCert(c.id)}
    </div>
  </div>`;
}
function catSecao(titulo,sub,arr,extra){
  if(!arr.length) return "";
  return `<section>
    <div class="hd"><h2>${titulo}</h2><span class="n">${arr.length} certificaç${arr.length===1?"ão":"ões"}</span></div>
    ${sub?`<p class="t-sm dim" style="margin:-4px 0 12px;max-width:70ch">${sub}</p>`:""}
    ${extra||""}
    <div class="catg">${arr.map(catCard).join("")}</div>
  </section>`;
}
function viewCat(){
  const f=S.catProv==="all"?CATALOGO:CATALOGO.filter(c=>c.prov===S.catProv);
  const porTrilha=S.catGroup==="trilha";
  let secoes;
  if(porTrilha){
    secoes=METAS.map(m=>{
      const ids=m.azure.concat(m.aws);
      const arr=ids.map(id=>f.find(c=>c.id===id)).filter(Boolean);   /* na ordem da trilha */
      const seq=[["azure",m.azure],["aws",m.aws]].map(([k,v])=>{
        const vis=v.filter(id=>f.some(c=>c.id===id));
        return vis.length?`<b class="mono" style="color:var(--${k==="aws"?"aw":"az"})">${PROVIDERS[k].short}</b> ${vis.map(id=>cat0(id).code).join(" \u203A ")}`:"";
      }).filter(Boolean).join(" &nbsp;&nbsp;·&nbsp;&nbsp; ");
      return catSecao(
        `<span aria-hidden="true" style="margin-right:7px">${m.icone}</span>${esc(m.nome)}`,
        esc(m.desc),
        arr,
        `<p class="t-xs dim2 mono" style="margin:-6px 0 12px;line-height:1.7">${seq}</p>`);
    }).join("");
  }else{
    secoes=NIVEIS.map(n=>catSecao(n,"",f.filter(c=>c.nivel===n),"")).join("");
  }
  return `
  <div class="stack-lg">
    <section>
      <button class="btn ghost sm" data-act="trilha">Voltar à trilha</button>
      <h1 class="t-xl" style="margin-top:10px">Catálogo de certificações</h1>
      <p class="t-sm dim" style="margin-top:6px;max-width:68ch">${porTrilha
        ? "Cada seção é uma trilha de carreira, na ordem em que as certificações devem ser feitas. Uma certificação que serve a mais de um objetivo aparece em mais de uma seção, e as etiquetas no cartão dizem quais são."
        : "Agrupado por nível, como os provedores organizam. Para ver qual certificação pertence a qual objetivo de carreira, troque para o agrupamento por trilha."}</p>
    </section>
    <section class="stack">
      <div class="goals">${[["trilha","Por trilha de carreira"],["nivel","Por nível"]].map(([v,t])=>
        `<button data-act="catgroup" data-v="${v}" aria-pressed="${S.catGroup===v}">${t}</button>`).join("")}</div>
      <div class="goals">${[["all","As duas nuvens"],["azure","Microsoft Azure"],["aws","AWS"]].map(([v,t])=>
        `<button data-act="catprov" data-v="${v}" aria-pressed="${S.catProv===v}">${t}</button>`).join("")}
        <span class="t-xs dim2 mono" style="align-self:center;margin-left:4px">${f.length} de ${CATALOGO.length}</span></div>
    </section>
    ${secoes}
    <section class="stack">
      <div class="note">Exames aposentados em 2026 não estão listados: AZ-204, AZ-500, AI-900, AI-102, DP-100, MS-900 e o ML Specialty da AWS saíram, e DP-203 e as especialidades de dados e banco da AWS saíram antes. Onde a versão está em transição, a observação do cartão avisa.</div>
    </section>
  </div>`;
}

/* ---------------- exame ---------------- */
function viewExam(){
  const e=ex0(V.exam), aw=isAws(V.exam), pr=predict(V.exam);
  const ws=e.domains.map(d=>parseFloat(d.w)||25);
  const read=fichasOf(V.exam).filter(f=>S.fichas[f.id]).length, tot=fichasOf(V.exam).length;
  if(read===tot&&tot>0) unlock("allfichas");
  const sims=S.sims.filter(r=>r.exam===V.exam);
  return `
  <div class="stack-lg">
    <section>
      <button class="btn ghost sm" data-act="home">Voltar aos exames</button>
      <div class="row" style="margin-top:10px;gap:8px">
        <span class="tag ${aw?"aw":"az"} mono" style="view-transition-name:vt-${V.exam}">${e.code}</span>
        <h1 class="t-xl">${esc(e.name)}</h1>
      </div>
      <p class="t-sm dim" style="margin-top:5px">${e.realQ} questões em ${e.realMin} minutos na prova real. Corte ${e.pass} de ${e.scale}. Inscrição ${e.price}.</p>
    </section>

    <section class="sheet">
      <div class="hd"><h2>Prontidão estimada</h2>
        <span class="n">${pr.ready?"margem de "+pr.ci+" pontos":"aparece com 12 respostas"}</span></div>
      <div class="dimline ${aw?"aw":""}">
        <div class="dl-track">
          ${pr.ready?`<span class="dl-fill" style="width:${pctScore(pr.score)}%"></span>
          <span class="dl-band" style="left:${pctScore(pr.score-pr.ci)}%;width:${pctScore(pr.score+pr.ci)-pctScore(pr.score-pr.ci)}%"></span>`:""}
          <span class="dl-cut" style="left:${pctScore(pr.pass)}%"><b>corte ${pr.pass}</b></span>
          ${pr.ready?`<span class="dl-val ${pr.score>=pr.pass?"ok":""}" id="dlv" data-to="${pctScore(pr.score)}" style="left:0%">
            <b class="${pr.score>=pr.pass?"ok":""}">${pr.score}</b></span>`:""}
        </div>
        <div class="dl-sc"><span>300</span><span>650</span><span>1000</span></div>
      </div>
      <p class="t-xs dim2" style="margin-top:4px">${pr.ready
        ? "Confiança "+pr.conf+"%. A faixa clara sobre a linha é o intervalo provável."
        : "Você respondeu "+pr.obs+(pr.obs===1?" vez":" vezes")+". A estimativa aparece a partir de 12 respostas e firma por volta de 20."}</p>

      <div style="height:22px"></div>
      <div class="spread" style="margin-bottom:8px">
        <h3 class="t-sm">Peso de cada domínio</h3>
        <span class="t-xs dim2 mono" style="white-space:nowrap">largura = peso</span>
      </div>
      <div class="bands">${e.domains.map((d,i)=>{
        const v=Math.round(domProf(V.exam,d.id)*100), lock=!domOpen(V.exam,i);
        return `<button class="band ${aw?"aw":""}" style="flex:${ws[i]}" data-lock="${lock?1:0}"
          data-act="jump" data-dom="${d.id}" title="${esc(d.name)}: ${d.w} da prova, proficiência ${v}%">
          <i style="height:${v}%"></i><span><b class="d">D${i+1}</b><b class="v">${v}%</b></span></button>`;}).join("")}</div>
      <p class="t-xs dim2" style="margin-top:7px">${read} de ${tot} fichas lidas neste exame</p>
    </section>

    <section class="sheet tight">
      <div class="spread" style="align-items:center">
        <div style="max-width:46ch">
          <h2 class="t-sm">Data da prova</h2>
          <p class="t-xs dim" style="margin-top:2px" id="pace">${paceText(V.exam)}</p>
        </div>
        <input type="date" id="examdate" data-act="noop" aria-label="Data da prova" value="${S.dates[V.exam]||""}"
          style="font:inherit;font-size:13px;padding:6px 9px;border:1px solid var(--rule2);border-radius:2px;background:var(--sheet);color:var(--ink)">
      </div>
    </section>

    <section class="sheet tight">
      <div class="spread">
        <div style="max-width:46ch">
          <h2 class="t-sm">Simulado</h2>
          <p class="t-xs dim" style="margin-top:2px">Curto: ${e.simQ} questões em ${e.simMin} min.${fullReady(V.exam)?` Prova completa: ${fullSpec(V.exam).q} questões em ${fullSpec(V.exam).min} min, como a real.`:""} Na proporção dos domínios, priorizando questões que você ainda não viu. Sem retorno durante a prova.${sims.length?" Último: "+sims[0].score+" pontos"+(sims[0].full?" (completa)":"")+".":""}</p>
        </div>
        <div class="row" style="gap:6px">
          <button class="btn sm" data-act="simstart" data-exam="${V.exam}">Curto</button>
          ${fullReady(V.exam)?`<button class="btn fill sm" data-act="simstart" data-modo="completo" data-exam="${V.exam}">Prova completa</button>`:""}
        </div>
      </div>
      <div class="sim-modos">
        <label class="t-xs dim" for="simdom">Treinar um domínio</label>
        <div class="row" style="gap:6px">
          <select id="simdom" data-act="noop">${e.domains.map(d=>`<option value="${d.id}">${esc(d.name)} (${esc(d.w)})</option>`).join("")}</select>
          <button class="btn sm" data-act="simstart" data-modo="dominio" data-exam="${V.exam}">15 questões</button>
        </div>
        ${(()=>{ const n=SIMM.erros(qPool(V.exam),S.seen).length;
          return n>=3?`<div class="spread" style="margin-top:8px"><span class="t-xs dim">${n} questões que você errou da última vez</span>
          <button class="btn sm" data-act="simstart" data-modo="erros" data-exam="${V.exam}">Refazer erradas (até 20)</button></div>`:""; })()}
      </div>
    </section>
    ${prontidaoHtml(V.exam)}

    <section class="stack">
      <div class="hd"><h2>Trilha</h2><span class="n">${e.domains.length} domínios em sequência</span></div>
      ${e.domains.map((d,i)=>domBlock(d,i,aw)).join("")}
      <div class="legend">
        <span class="lg"><i class="m done"></i>concluído</span>
        <span class="lg"><i class="m now"></i>liberado</span>
        <span class="lg"><i class="m lock"></i>bloqueado</span>
        <span class="lg" style="margin-left:auto">domínio seguinte abre ao vencer o chefe</span>
      </div>
    </section>
  </div>`;
}
function domBlock(d,i,aw){
  const exam=V.exam, open=domOpen(exam,i), bossDone=!!S.bosses[exam+":"+d.id];
  const fs=fichasOf(exam,d.id), ls=lessonsOf(exam,d.id);
  const fr=fs.filter(f=>S.fichas[f.id]).length, lw=ls.filter(l=>S.lessons[l.id]).length;
  const ready=contentDone(exam,d.id), mins=fs.reduce((a,f)=>a+f.mins,0);
  const st=(done,unlocked)=>!unlocked?"lock":done?"done":"now";
  const node=(cls,state,title,meta,inner)=>`<div class="node ${cls} ${aw?"aw":""}" data-k="${d.id}:${title}" data-s="${state}">
      <div class="node-h"><span class="gl"></span>${title}</div>
      <div class="node-b"><span class="node-meta">${meta}</span>${inner}</div></div>`;
  const conn='<span class="conn" aria-hidden="true"></span>';
  const lock=!open;
  return `<article class="bd ${aw?"aw":""}" data-k="dom:${d.id}" data-s="${lock?"lock":bossDone?"done":"open"}" id="d-${d.id}">
    <span class="bd-tab"><span class="ix">D${i+1}</span><span class="nm">${esc(d.name)}</span></span>
    <span class="bd-w">${d.w} da prova</span>
    <div class="flow">
      ${node("wide",st(ready,open),"Conteúdo",fr+"/"+fs.length+" fichas · "+mins+" min",
        lock?`<p class="node-p">Vença o chefe do domínio anterior.</p>`
        :`<div class="lst">${fs.map(f=>`<button class="lst-i" data-k="f:${f.id}" data-done="${S.fichas[f.id]?1:0}" data-act="ficha" data-ficha="${f.id}">
            <span class="bx"></span><span class="nm">${esc(f.title)}${f.extra?` <span class="xt">aprofundamento</span>`:""}</span><span class="tm">${f.mins}m</span></button>`).join("")}</div>`)}
      ${conn}
      ${node("",st(ls.length&&lw===ls.length,open),"Aula",ls.length?lw+"/"+ls.length+" vistas · 90s":"sem aula",
        lock||!ls.length?`<p class="node-p">${lock?"Bloqueado.":"Este domínio não tem aula."}</p>`
        :`<div class="lst">${ls.map(l=>`<button class="lst-i" data-k="l:${l.id}" data-done="${S.lessons[l.id]?1:0}" data-act="aula" data-aula="${l.id}">
            <span class="bx"></span><span class="nm">${esc(l.title)}</span><span class="tm">${l.secs}s</span></button>`).join("")}</div>`)}
      ${conn}
      ${node("",st(domProf(exam,d.id)>.6,open&&ready),"Prática",qPool(exam,d.id).length+" no banco",
        `<p class="node-p">${lock?"Bloqueado.":ready?"Seis questões escolhidas pelo que você ainda erra.":(n=>"Falta ler "+n+" ficha"+(n>1?"s":"")+".")(fichasBase(exam,d.id).filter(f=>!S.fichas[f.id]).length)}</p>
         <button class="btn sm ${aw?"aw":"az"}" ${open&&ready?`data-act="study" data-exam="${exam}" data-dom="${d.id}"`:"disabled"}>Praticar</button>`)}
      ${conn}
      ${node("",st(bossDone,open&&ready),"Chefe",bossDone?"derrotado":"5 questões, cronometrado",
        `<p class="node-p">${lock?"Bloqueado.":bossDone?"Domínio liberado.":ready?"Acerte 4 de 5 para abrir o próximo domínio.":"Leia as fichas antes."}</p>
         <button class="btn sm ${bossDone?"":"go"}" ${open&&ready?`data-act="boss" data-exam="${exam}" data-dom="${d.id}"`:"disabled"}>${bossDone?"Repetir":"Enfrentar"}</button>`)}
    </div>
  </article>`;
}
function paceText(exam){
  const iso=S.dates[exam], d=daysTo(iso);
  if(d===null) return "Defina a data para o app calcular o ritmo necessário.";
  if(d<0) return "A data escolhida já passou. Ajuste para recalcular o ritmo.";
  const fs=fichasOf(exam), falta=fs.filter(f=>!S.fichas[f.id]).length;
  if(d===0) return "É hoje. Boa prova.";
  const porDia=Math.ceil(falta/d);
  return falta
    ? "Faltam "+d+(d===1?" dia":" dias")+" e "+falta+(falta===1?" ficha":" fichas")+": cerca de "+porDia+(porDia===1?" ficha":" fichas")+" por dia, mais prática."
    : "Faltam "+d+(d===1?" dia":" dias")+". Conteúdo lido: use o tempo em simulado e revisão.";
}
function animateRuler(){ const m=document.getElementById("dlv"); if(m) m.style.left=m.dataset.to+"%"; }

/* ---------------- leitor de ficha ---------------- */
function viewFicha(){
  const f=FICHAS.find(x=>x.id===V.ficha);
  if(!f) return shell("<p>Ficha não encontrada.</p>");
  const done=!!S.fichas[f.id];
  if(!RD||RD.id!==f.id) RD={id:f.id,atEnd:done};
  const e=ex0(f.exam), aw=isAws(f.exam);
  return `<div class="reader">
    <div class="rd-top">
      <button class="btn ghost sm" data-act="rclose">Fechar</button>
      <h2>${esc(f.title)}</h2>
      <button class="btn sm" data-act="print" title="Imprimir ou salvar em PDF">Imprimir</button>
      <span class="tag ${aw?"aw":"az"} mono">${e.code}</span>
    </div>
    <div class="rd-prog"><i id="rprog"></i></div>
    <div class="rd-body" id="rbody">
      <article class="paper">
        <h1>${esc(f.title)}</h1>
        <div class="meta">
          <span class="tag">${esc(e.domains.find(d=>d.id===f.dom).name)}</span>
          <span class="t-xs dim2 mono">${f.mins} min de leitura</span>
        </div>
        <p class="lead">${esc(f.lead)}</p>
        ${f.blocks.map(blockHtml).join("")}
        <div class="bx check">
          <span class="lbl">VOCÊ ESTÁ PRONTO QUANDO CONSEGUIR</span>
          <ul>${f.check.map(c=>`<li>${esc(c)}</li>`).join("")}</ul>
        </div>
        <h3>Fontes oficiais</h3>
        <div class="srcs">${f.src.map(s=>`<a href="${s.u}" target="_blank" rel="noopener">${esc(s.t)}</a>`).join("")}</div>
      </article>
    </div>
    <div class="rd-foot">
      <span class="hint" id="rhint">${done?"Ficha já estudada.":"Role até o fim para liberar."}</span>
      <button class="btn ${done?"":"go"}" id="rdone" data-act="rdone" ${done||!RD.atEnd?"disabled":""}>
        ${done?"Estudada":"Marcar como estudada"}</button>
    </div>
  </div>`;
}
function blockHtml(b){
  switch(b.t){
    case "h": return `<h3>${esc(b.x)}</h3>`;
    case "p": return `<p>${esc(b.x)}</p>`;
    case "ul": return `<ul>${b.x.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>`;
    case "table": case "signal":
      return `<div class="wrap-t"><table><thead><tr>${b.head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    case "trap": return `<div class="bx trap"><span class="lbl">PEGADINHA</span>${esc(b.x)}</div>`;
    case "case": return `<div class="bx case"><span class="lbl">CASO RESOLVIDO</span>
      <p class="q">${esc(b.q)}</p><p class="a">${esc(b.a)}</p></div>`;
    default: return "";
  }
}
/* a ficha pode ser aberta pela trilha ou pela fila de revisão:
   fechar precisa voltar para a tela de origem, e nunca para um exame indefinido */
function closeFicha(fallbackExam){
  const from=V.from, ex=V.exam||fallbackExam;
  RD=null;
  if(from==="review") return go("review");
  if(from==="study"&&SES) return go("study");
  if(ex) return go("exam",{exam:ex});
  return go("home");
}
function afterFicha(){
  const body=document.getElementById("rbody"), prog=document.getElementById("rprog");
  if(!body) return;
  const upd=()=>{
    // o rAF agendado aqui pode disparar depois de fechar a ficha
    if(!RD||V.name!=="ficha") return;
    const max=body.scrollHeight-body.clientHeight;
    const p=max<=8?100:Math.min(100,body.scrollTop/max*100);
    if(prog) prog.style.width=p+"%";
    if(p>=97&&!RD.atEnd){
      RD.atEnd=true;
      const b=document.getElementById("rdone"), h=document.getElementById("rhint");
      if(b&&!S.fichas[RD.id]) b.disabled=false;
      if(h&&!S.fichas[RD.id]) h.textContent="Pode marcar como estudada.";
    }
  };
  body.addEventListener("scroll",upd,{passive:true});
  requestAnimationFrame(upd);
}

/* ---------------- aula ---------------- */
function viewAula(){
  const l=LESSONS.find(x=>x.id===V.aula);
  if(!l) return shell("<p>Aula não encontrada.</p>");
  if(!PL||PL.id!==l.id) PL={id:l.id,i:0,playing:true,speed:1,quiz:0,ans:[]};
  const sl=l.slides[PL.i];
  let stage;
  if(sl.k==="quiz"){
    const q=l.quiz[PL.quiz], given=PL.ans[PL.quiz];
    stage=`<div class="slide enter">
      <div class="kind">EXERCÍCIO ${PL.quiz+1} DE ${l.quiz.length}</div>
      <h2 style="font-size:20px">${esc(q.q)}</h2>
      <div class="lq">${q.a.map((o,i)=>`<button class="opt" ${given!=null?"disabled":""} data-act="lq" data-i="${i}"
        ${given!=null?`data-res="${i===q.c?"ok":i===given?"bad":""}"`:""}>
        <span class="k">${String.fromCharCode(65+i)}</span><span>${esc(o)}</span></button>`).join("")}</div>
      ${given!=null?`<div class="verdict ${given===q.c?"ok":"no"}" style="text-align:left">
        <h4>${given===q.c?"Certo":"Não é essa"}</h4><p class="why">${esc(q.e)}</p></div>`:""}
    </div>`;
  }else{
    stage=`<div class="slide enter">
      <div class="kind">${esc(sl.k).toUpperCase()}</div>
      ${sl.emoji?`<div class="emo" aria-hidden="true">${sl.emoji}</div>`:""}
      <h2>${esc(sl.h)}</h2>
      ${sl.diagram?DIAGRAMS[sl.diagram]:""}
      ${sl.p?`<p style="margin-top:11px">${esc(sl.p)}</p>`:""}
      ${sl.gotcha?`<div class="bx trap" style="margin-top:15px;text-align:left"><span class="lbl">PEGADINHA</span>${esc(sl.gotcha)}</div>`:""}
    </div>`;
  }
  return `<div class="player">
    <div class="pl-segs">${l.slides.map((_,i)=>
      `<i class="${i<PL.i?"seen":i===PL.i&&PL.playing&&sl.k!=="quiz"?"now":""}">${i===PL.i&&PL.playing&&sl.k!=="quiz"?"<span></span>":""}</i>`).join("")}</div>
    <div class="pl-top">
      <button class="btn ghost sm" data-act="aclose">Fechar</button>
      <h2 class="t-sm" style="flex:1;min-width:0">${esc(l.title)}</h2>
      <span class="t-xs dim2 mono">${l.secs}s</span>
    </div>
    <div class="pl-stage">${stage}</div>
    <div class="cc">${esc(sl.gotcha||sl.p||(sl.k==="quiz"?"Escolha uma alternativa para continuar.":""))}</div>
    <div class="pl-ctrl">
      <button class="btn sm" data-act="aprev" ${PL.i===0?"disabled":""}>Anterior</button>
      <button class="btn sm" data-act="aplay">${PL.playing?"Pausar":"Tocar"}</button>
      <button class="btn sm mono" data-act="aspeed">${PL.speed}x</button>
      <span style="flex:1"></span>
      <button class="btn sm fill" data-act="anext">${PL.i===l.slides.length-1?"Concluir":"Avançar"}</button>
    </div>
  </div>`;
}
function afterAula(){
  const l=LESSONS.find(x=>x.id===V.aula), sl=l.slides[PL.i];
  const per=Math.round(l.secs/l.slides.length*1000/PL.speed);
  document.querySelectorAll(".pl-segs i.now span").forEach(s=>{ s.style.animation="fill "+per+"ms linear forwards"; });
  if(PL.playing&&sl.k!=="quiz") timers.push(setTimeout(aNext,per));
}
function aNext(){
  const l=LESSONS.find(x=>x.id===V.aula), sl=l.slides[PL.i];
  if(sl.k==="quiz"&&PL.ans[PL.quiz]!=null&&PL.quiz<l.quiz.length-1){ PL.quiz++; clearTimers(); return render(); }
  if(PL.i<l.slides.length-1){ PL.i++; clearTimers(); return render(); }
  if(!S.lessons[l.id]){ S.lessons[l.id]=true; unlock("aula1"); addXp(15,"aula concluída"); }
  PL=null; V.exam?go("exam",{exam:V.exam}):go("home");
}

/* ---------------- prática e chefe ---------------- */
const initSel=q=>q&&q.type==="order"?q.shufOrder.slice():null;
function startSession(exam,dom,boss){
  let qs;
  if(boss){
    qs=shuffle(qPool(exam,dom).filter(q=>q.lvl>=4)).slice(0,5);
    if(qs.length<5) qs=qs.concat(shuffle(qPool(exam,dom).filter(q=>!qs.includes(q))).slice(0,5-qs.length));
  }else qs=pick(exam,dom,6);
  if(!qs.length){ toast("Ainda não há questões neste domínio","no"); return; }
  SES={exam,dom,boss:!!boss,qs,i:0,sel:initSel(qs[0]),shown:false,right:0,
       deadline:boss?Date.now()+qs.length*70000:null};
  go("study",{exam,dom});
}
function viewStudy(){
  if(!SES) return viewHome();
  const q=SES.qs[SES.i];
  if(!q) return sessionEnd();
  const aw=isAws(SES.exam), left=SES.deadline?SES.deadline-Date.now():null;
  return `<div class="stack">
    <div class="row">
      <button class="btn ghost sm" data-act="exam" data-exam="${SES.exam}">Sair</button>
      <span class="tag ${SES.boss?"fl":""}">${SES.boss?"Chefe do domínio":SES.daily?"Desafio do dia":SES.review?"Revisão":"Prática"}</span>
      <span class="tag mono">${SES.i+1}/${SES.qs.length}</span>
      ${left!=null?`<span class="clock ${left<3e4?"crit":left<6e4?"warn":""}" id="sclock">${clock(left)}</span>`:""}
      <span style="flex:1"></span>
      ${SES.boss?`<span class="tag no mono">energia ${S.lives}</span>`:""}
      ${S.combo>1?`<span class="tag fl mono">${S.combo} seguidas</span>`:""}
    </div>
    <div class="sheet">${qHtml(q,SES.shown,SES.sel)}</div>
    ${SES.shown?verdictHtml(q,SES.sel):`<button class="btn sm ghost duv" data-act="qduv" aria-pressed="${!!SES.duv}" style="align-self:flex-start">${SES.duv?"✓ ":""}Não tenho certeza</button>`}
    <button class="btn wide ${SES.shown?(aw?"aw":"az"):"go"}" data-act="${SES.shown?"qnext":"qcheck"}">
      ${SES.shown?(SES.i===SES.qs.length-1?"Ver resultado":"Próxima questão"):"Confirmar resposta"}</button>
    <p class="t-xs dim2" style="text-align:center">Teclado: 1 a 9 escolhem, D marca dúvida, Enter confirma e avança.</p>
  </div>`;
}
function qHtml(q,shown,sel,risc){
  const e=ex0(q.exam), aw=isAws(q.exam);
  const kind={single:"",multi:"múltipla escolha",yn:"sim ou não",order:"ordenar"}[q.type];
  const head=`<div class="q-h">
    <span class="tag ${aw?"aw":"az"} mono">${e.code}</span>
    <span class="tag">${esc(e.domains.find(d=>d.id===q.dom).name)}</span>
    <span class="tag ${q.lvl>=4?"no":""} mono">nível ${q.lvl}/5</span>
    ${kind?`<span class="tag fl">${kind}</span>`:""}
  </div>`;
  const body=(()=>{
    if(q.type==="single"||q.type==="multi"){
      const p=sel||[];
      const rk=!shown&&Array.isArray(risc)?risc:null;
      return `<div class="opts">${(q.shuf||q.opts).map(o=>{
        const on=p.includes(o.k), x=!!rk&&rk.includes(o.k);
        const res=shown?(q.ans.includes(o.k)?(on?"ok":"miss"):(on?"bad":"")):"";
        const bt=`<button class="opt" data-act="qpick" data-k="${o.k}" ${shown?"disabled":""} data-sel="${on?1:0}"
          aria-pressed="${on}" ${res?`data-res="${res}"`:""} ${x?'data-risc="1"':""}>
          <span class="k">${o.k}</span><span>${esc(o.t)}${x?'<span class="sr-only"> (riscada)</span>':""}</span></button>`;
        return rk?`<div class="opt-w">${bt}<button class="risc" data-act="simrisc" data-k="${o.k}" aria-pressed="${x}"
          aria-label="${x?"Desfazer risco da":"Riscar a"} alternativa ${o.k}" title="${x?"Desfazer risco":"Riscar alternativa"}">✕</button></div>`:bt;}).join("")}</div>
        ${q.type==="multi"?`<p class="t-xs dim2">Marque todas que se aplicam. São ${q.ans.length} corretas.</p>`:""}`;
    }
    if(q.type==="yn"){
      const p=sel||[];
      return `<div class="opts">${q.rows.map((r,i)=>{
        const v=p[i], res=shown?(v===r.a?"ok":"bad"):"";
        return `<div class="yn" ${res?`data-res="${res}"`:""}>
          <div class="tx">${esc(r.t)}${shown?`<p class="yn-e">${v===r.a?"Correto":"Errado"}. ${esc(r.e)}</p>`:""}</div>
          <div class="yn-b">
            <button data-act="qyn" data-i="${i}" data-v="1" aria-pressed="${v===true}" ${shown?"disabled":""}>Sim</button>
            <button data-act="qyn" data-i="${i}" data-v="0" aria-pressed="${v===false}" ${shown?"disabled":""}>Não</button>
          </div></div>`;}).join("")}</div>`;
    }
    const cur=sel||q.shufOrder;
    return `<div class="opts">${cur.map((idx,pos)=>{
      const res=shown?(idx===pos?"ok":"bad"):"";
      return `<div class="ord" ${res?`data-res="${res}"`:""}>
        <span class="pos">${pos+1}</span><span class="tx">${esc(q.items[idx].t)}</span>
        ${shown?"":`<span class="ord-mv">
          <button data-act="qup" data-p="${pos}" ${pos===0?"disabled":""} aria-label="Subir">▲</button>
          <button data-act="qdn" data-p="${pos}" ${pos===cur.length-1?"disabled":""} aria-label="Descer">▼</button></span>`}
      </div>`;}).join("")}</div>
      ${shown?"":`<p class="t-xs dim2">Use as setas para reordenar. A ordem mostrada já conta como resposta.</p>`}`;
  })();
  return `<div class="qbox ${aw?"aw":"az"}">`+head+(q.case?`<div class="q-case">${esc(q.case)}</div>`:"")+`<p class="q-stem" id="q-stem">${esc(q.stem)}</p>`+
    `<div role="group" aria-labelledby="q-stem">`+body+`</div></div>`;
}
const REPORTADAS=new Set();
function verdictHtml(q,sel){
  const ok=grade(q,sel);
  const why=(q.type==="single"||q.type==="multi")
    ? `<p class="why">${esc(q.why.ok)}</p><div class="wrongs">${q.opts.filter(o=>!q.ans.includes(o.k)).map(o=>
        `<div class="wrong"><b>${o.k}</b><span>${esc(q.why[o.k]||"")}</span></div>`).join("")}</div>`
    : `<p class="why">${esc(q.e||"Veja o retorno item a item acima.")}</p>`;
  /* do erro para o estudo: só na sessão, que tem como voltar para a questão */
  let estude="";
  if(V.name==="study"&&SES&&typeof C.citados==="function"){
    const certas=(q.opts||[]).filter(o=>(q.ans||[]).includes(o.k)).map(o=>o.t).join(" ");
    const ids=isAws(q.exam)?C.citados([(q.why&&q.why.ok)||q.e||"",certas,q.stem]):[];
    const ficha=FICHAS.find(f=>f.exam===q.exam&&f.concept&&(q.tags||[]).includes(f.concept));
    const nomes=C.nomesGuia||{};
    if(ids.length||ficha) estude=`<div class="estude"><span class="t-xs dim">Para estudar:</span>
      ${ficha?`<button class="btn sm ghost" data-act="ficha" data-ficha="${ficha.id}" data-exam="${ficha.exam}">Ficha: ${esc(ficha.title)}</button>`:""}
      ${ids.map(id=>`<button class="btn sm ghost" data-act="gserv" data-id="${id}">Guia: ${esc(nomes[id]||id)}</button>`).join("")}</div>`;
  }
  return `<div class="verdict ${ok?"ok":"no"}" role="status" aria-live="polite">
    <h4>${ok?"Correto":"Resposta errada"}</h4>${why}${estude}
    ${q.src?`<p class="t-xs dim2" style="margin:12px 0 5px">Confira na fonte oficial</p>
    <div class="srcs">${q.src.map(s=>`<a href="${s.u}" target="_blank" rel="noopener">${esc(s.t)}</a>`).join("")}</div>`:""}
    ${SIMM.reportar(q.id,REPORTADAS.has(q.id))}
  </div>`;
}
function grade(q,sel){
  if(sel==null) return false;
  if(q.type==="single") return sel.length===1&&q.ans.includes(sel[0]);
  if(q.type==="multi")  return sel.length===q.ans.length&&sel.every(k=>q.ans.includes(k));
  if(q.type==="yn")     return q.rows.every((r,i)=>sel[i]===r.a);
  if(q.type==="order")  return sel.every((v,i)=>v===i);
  return false;
}
function prep(q){
  if((q.type==="single"||q.type==="multi")&&!q.shuf) q.shuf=shuffle(q.opts);
  if(q.type==="order"){ let s; do{ s=shuffle(q.items.map((_,i)=>i)); }while(s.every((v,i)=>v===i)); q.shufOrder=s; }
  return q;
}
function sessionEnd(){
  const n=SES.qs.length, pct=Math.round(SES.right/n*100);
  const need=Math.ceil(n*.8), win=SES.boss?SES.right>=need:null;
  if(SES.boss&&win&&!S.bosses[SES.exam+":"+SES.dom]){
    S.bosses[SES.exam+":"+SES.dom]=true; unlock("boss1"); addXp(50,"chefe derrotado");
  }
  const aw=isAws(SES.exam), exam=SES.exam, dom=SES.dom, boss=SES.boss, right=SES.right, rev=!!SES.review;
  SES=null;
  return `<div class="result enter">
    <p class="t-sm dim">${boss?(win?"Chefe derrotado":"O chefe aguentou"):"Prática concluída"}</p>
    <div class="big ${pct>=80?"ok":pct>=50?"":"no"}">${pct}%</div>
    <p class="t-sm dim">${right} de ${n} corretas</p>
    <p class="t-md" style="margin-top:8px">${boss?(win?"Próximo domínio liberado.":"Você precisa de "+need+" de "+n+" para passar."):rev?"Os conceitos revisados foram reagendados. O que você errou volta amanhã.":"O que você errou volta em 1, 3, 7 e 21 dias."}</p>
    <div class="row" style="justify-content:center;margin-top:14px">
      ${rev?`<button class="btn ${aw?"aw":"az"}" data-act="review-go">Continuar revisando</button>
      <button class="btn" data-act="review">Ver a fila</button>`
      :`<button class="btn ${aw?"aw":"az"}" data-act="${boss?"boss":"study"}" data-exam="${exam}" data-dom="${dom||""}">Tentar de novo</button>
      <button class="btn" data-act="exam" data-exam="${exam}">Voltar à trilha</button>`}
    </div>
  </div>`;
}

/* ---------------- simulado ---------------- */
function saveSim(){
  if(!SIM||SIM.done){ S.sim=null; }
  else{ simClock(); S.sim={exam:SIM.exam,ids:SIM.qs.map(q=>q.id),i:SIM.i,ans:SIM.ans,flags:SIM.flags,end:SIM.end,full:!!SIM.full,t:SIM.t,modo:SIM.modo||"curto",dom:SIM.dom||null,risc:SIM.risc}; }
  save();
}
function restoreSim(){
  const r=S.sim; if(!r) return false;
  if(r.end<=Date.now()){ S.sim=null; save(); return false; }
  const qs=r.ids.map(id=>QUESTIONS.find(q=>q.id===id)).filter(Boolean);
  if(qs.length!==r.ids.length){ S.sim=null; save(); return false; }
  SIM={exam:r.exam,qs,i:r.i,ans:r.ans,flags:r.flags,end:r.end,done:false,full:!!r.full,
    modo:r.modo||(r.full?"completo":"curto"),dom:r.dom||null,review:false,
    risc:Array.isArray(r.risc)&&r.risc.length===qs.length?r.risc:qs.map(()=>[]),
    t:Array.isArray(r.t)&&r.t.length===qs.length?r.t:qs.map(()=>0),cur:r.i,at:Date.now()};
  go("sim",{exam:r.exam});
  return true;
}
/* Tempo por questão: o intervalo desde o último registro vai para a questão
   que estava na tela. Trechos acima de 10 min contam como 10 (aba esquecida). */
function simClock(){
  if(!SIM) return;
  const now=Date.now();
  if(SIM.cur!=null&&SIM.at) SIM.t[SIM.cur]=(SIM.t[SIM.cur]||0)+Math.min(now-SIM.at,6e5);
  SIM.cur=SIM.i; SIM.at=now;
}
function startSim(exam,modo,dom){
  const e=ex0(exam); let qs, min;
  if(modo==="completo"&&fullReady(exam)){ const f=fullSpec(exam); qs=pickSim(exam,f.q); min=f.min; }
  else if(modo==="dominio"){
    if(!e.domains.some(d=>d.id===dom)){ toast("Escolha um domínio","no"); return; }
    qs=SIMM.montarPorDominio(qPool(exam),dom,15,S.seen);
    if(qs.length<5){ toast("Este domínio ainda tem poucas questões","no"); return; }
    min=SIMM.minutos(e.simMin,e.simQ,qs.length);
  }
  else if(modo==="erros"){
    qs=SIMM.montarErros(qPool(exam),S.seen,20);
    if(qs.length<3){ toast("Você precisa ter errado pelo menos 3 questões deste exame","no"); return; }
    min=SIMM.minutos(e.simMin,e.simQ,qs.length);
  }
  else { modo="curto"; qs=pickSim(exam,e.simQ); min=e.simMin; }
  qs=qs.map(prep);
  SIM={exam,qs,i:0,ans:qs.map(initSel),flags:qs.map(()=>false),risc:qs.map(()=>[]),end:Date.now()+min*6e4,done:false,
    full:modo==="completo",modo,dom:modo==="dominio"?dom:null,review:false,t:qs.map(()=>0),cur:0,at:Date.now()};
  saveSim(); go("sim",{exam});
}
function simRotulo(r){
  const e=ex0(r.exam), d=r.dom&&e.domains.find(x=>x.id===r.dom);
  return SIMM.rotulo(r.modo||(r.full?"completo":"curto"),d?d.name:undefined);
}
function viewSim(){
  if(!SIM) return viewHome();
  const e=ex0(SIM.exam), q=SIM.qs[SIM.i], aw=isAws(SIM.exam), left=SIM.end-Date.now();
  if(SIM.review) return SIMM.revisao({codigo:e.code,rotulo:simRotulo(SIM),aws:aw,restanteMs:left,
    respondidas:SIM.ans.map(x=>x!=null),marcadas:SIM.flags.map(Boolean)});
  const feitas=SIM.ans.filter(x=>x!=null).length, pct=Math.round(feitas/SIM.qs.length*100);
  return `<div class="stack">
    <div class="sim-bar ${aw?"aw":"az"}">
      <i class="sim-prog" aria-hidden="true" style="--p:${pct}%"></i>
      <span class="tag ${aw?"aw":"az"} mono" title="${esc(simRotulo(SIM))}">${e.code}${SIM.full?" · completa":SIM.modo==="dominio"?" · domínio":SIM.modo==="erros"?" · erros":""}</span>
      <span class="clock ${left<12e4?"crit":left<3e5?"warn":""}" id="simclock">${clock(left)}</span>
      <span class="tag mono" title="${feitas} respondidas">${SIM.i+1}/${SIM.qs.length}</span>
      <span class="sp"></span>
      <button class="btn sm ${SIM.flags[SIM.i]?"fill":""}" data-act="simflag" aria-pressed="${!!SIM.flags[SIM.i]}">${SIM.flags[SIM.i]?"Marcada":"Marcar"}</button>
      <button class="btn sm" data-act="simreview">Revisar e entregar</button>
    </div>
    <div class="sheet">${qHtml(q,false,SIM.ans[SIM.i],SIM.risc&&SIM.risc[SIM.i])}</div>
    <div class="row">
      <button class="btn" data-act="simprev" ${SIM.i===0?"disabled":""}>Anterior</button>
      <button class="btn ${aw?"aw":"az"}" style="flex:1" data-act="simnext">${SIM.i===SIM.qs.length-1?"Revisar e entregar":"Próxima"}</button>
    </div>
    <div class="qnav ${aw?"aw":"az"}">${SIM.qs.map((_,i)=>`<button data-act="simgo" data-i="${i}" aria-current="${i===SIM.i}"
      data-st="${SIM.flags[i]?"flag":SIM.ans[i]!=null?"ans":""}" aria-label="Questão ${i+1}">${i+1}</button>`).join("")}</div>
    <p class="t-xs dim2">Modo prova: sem retorno agora. Correção e explicações saem na entrega. Teclado: 1 a 9 escolhem, setas navegam, F marca. Use o ✕ ao lado de uma alternativa para riscá-la.</p>
  </div>`;
}
function afterSim(){
  timers.push(setInterval(()=>{
    if(!SIM||SIM.done) return;
    const left=SIM.end-Date.now(), el=document.getElementById("simclock");
    if(el){ el.textContent=clock(left); el.className="clock "+(left<12e4?"crit":left<3e5?"warn":""); }
    if(left<=0){ toast("Tempo esgotado","no"); finishSim(); }
  },1000));
}
let PEND=null;
function twoStep(act,msg){
  if(PEND&&PEND.act===act&&Date.now()-PEND.ts<6000){ PEND=null; return true; }
  PEND={act,ts:Date.now()}; toast(msg,"no"); return false;
}
function finishSim(){
  if(!SIM) return;
  PEND=null; TQ.forEach(el=>el.remove()); TQ=[];   /* "toque de novo" deixou de valer */
  simClock(); SIM.done=true;
  const e=ex0(SIM.exam), byDom={}; let right=0;
  e.domains.forEach(d=>byDom[d.id]={n:0,ok:0});
  SIM.qs.forEach((q,i)=>{
    const ok=grade(q,SIM.ans[i]); if(ok) right++;
    byDom[q.dom].n++; if(ok) byDom[q.dom].ok++;
    /* questão marcada no simulado e acertada = acerto com dúvida na revisão */
    const nota=ok?(SIM.flags&&SIM.flags[i]?F.Nota.duvida:F.Nota.acertei):F.Nota.errei;
    (q.tags||[]).forEach(t=>schedule(t,ok,nota));
    S.seen[q.id]={ok,n:((S.seen[q.id]&&S.seen[q.id].n)||0)+1,lastTs:Date.now()};
    S.answered++;
  });
  const score=SIMM.nota(byDom,e.domains), pass=score>=e.pass, modo=SIM.modo||(SIM.full?"completo":"curto");
  const rec={exam:SIM.exam,score,pass,right,total:SIM.qs.length,byDom,ts:Date.now(),chall:!!SIM.chall,full:!!SIM.full,modo,dom:SIM.dom||null,
    secs:Math.round(SIM.t.reduce((a,b)=>a+b,0)/1000)};
  S.sims.unshift(rec); S.sims=S.sims.slice(0,20);
  if(typeof C.evento==="function") C.evento("simulado_fim",{exam:SIM.exam,score,pass,total:SIM.qs.length,completo:!!SIM.full,modo});
  if(S.answered>=50) unlock("q50");
  if(pass&&SIMM.contaParaProntidao(modo)) unlock(isAws(SIM.exam)?"passaw":"passaz");
  if(right===SIM.qs.length) unlock("perfect");
  addXp(40+right*5,"simulado concluído");
  const qs=SIM.qs, ans=SIM.ans, t=SIM.t, flags=SIM.flags; SIM=null; S.sim=null; save();
  clearTimers(); V={name:"simres",exam:rec.exam,res:rec,qs,ans,t,flags}; render(); window.scrollTo(0,0);
}
/* ---------- prontidão: evolução das notas e quando marcar a prova ----------
   Critérios (o simulado é calibrado acima da prova real):
   1) as duas últimas provas completas (ou simulados, se o exame não tem prova
      completa) com nota pelo menos 30 pontos acima do corte;
   2) todos os domínios com 70% ou mais nas últimas três tentativas;
   3) pelo menos 70% do banco de questões já respondido. */
function prontidao(exam){
  const e=ex0(exam), todas=S.sims.filter(r=>r.exam===exam&&!r.chall&&SIMM.contaParaProntidao(r.modo));
  const temFull=fullReady(exam), base=temFull?todas.filter(r=>r.full):todas;
  const ult2=base.slice(0,2);
  const c1=ult2.length===2&&ult2.every(r=>r.score>=e.pass+30);
  const rec=todas.slice(0,3), ant=todas.slice(3,6);
  const pct=(lst,d)=>{ let ok=0,n=0; lst.forEach(r=>{ const b=r.byDom&&r.byDom[d]; if(b){ ok+=b.ok; n+=b.n; } }); return n?ok/n:null; };
  const doms=e.domains.map(d=>({d,agora:pct(rec,d.id),antes:pct(ant,d.id)}));
  const c2=rec.length>0&&doms.every(x=>x.agora!=null&&x.agora>=.7);
  const pool=qPool(exam), vistas=pool.filter(q=>S.seen[q.id]).length, cob=pool.length?vistas/pool.length:0;
  const c3=cob>=.7;
  const n=[c1,c2,c3].filter(Boolean).length;
  return {e,todas,temFull,c1,c2,c3,n,doms,cob,vistas,total:pool.length};
}
function scoreChartSvg(lst,e){
  /* lst do mais antigo para o mais novo; eixo y de 300 a 1000 */
  const W=360,H=190,L=34,R=12,T=16,B=22, w=W-L-R, h=H-T-B;
  const x=i=>L+(lst.length===1?w/2:i*w/(lst.length-1)), y=v=>T+h*(1-(v-300)/700);
  const ticks=[300,500,700,900].map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" class="ch-grid"/>
    <text x="${L-6}" y="${y(v)+4}" text-anchor="end" class="ch-tx">${v}</text>`).join("");
  const corte=`<line x1="${L}" x2="${W-R}" y1="${y(e.pass)}" y2="${y(e.pass)}" class="ch-ref"/>
    <text x="${L+4}" y="${y(e.pass)-5}" text-anchor="start" class="ch-tx">corte ${e.pass}</text>`;
  const pts=lst.map((r,i)=>[x(i),y(r.score)]);
  const linha=pts.length>1?`<polyline points="${pts.map(p=>p.join(",")).join(" ")}" class="ch-line"/>`:"";
  const dt=r=>new Date(r.ts).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
  const marcas=lst.map((r,i)=>{
    const [cx,cy]=pts[i], lbl=`${r.full?"Prova completa":"Simulado curto"} em ${new Date(r.ts).toLocaleDateString("pt-BR")}: ${r.score} pontos, ${r.right} de ${r.total}`;
    return `<g class="ch-pt" tabindex="0" role="img" aria-label="${esc(lbl)}" data-lbl="${esc(lbl)}">
      <circle cx="${cx}" cy="${cy}" r="12" class="ch-hit"/>
      ${r.full?`<circle cx="${cx}" cy="${cy}" r="5" class="ch-dot"/>`:`<circle cx="${cx}" cy="${cy}" r="4.5" class="ch-dot-o"/>`}</g>`;}).join("");
  const ult=lst[lst.length-1], [ux,uy]=pts[pts.length-1];
  const fim=`<text x="${Math.min(ux,W-R-4)}" y="${uy-12}" text-anchor="${lst.length>1?"end":"middle"}" class="ch-val">${ult.score}</text>`;
  const xs=lst.length>1?[0,lst.length-1]:[0];
  const xl=xs.map(i=>`<text x="${pts[i][0]}" y="${H-6}" text-anchor="${lst.length===1?"middle":i===0?"start":"end"}" class="ch-tx">${dt(lst[i])}</text>`).join("");
  return `<svg viewBox="0 0 ${W} ${H}" class="ch ${isAws(e.id)?"":"az"}" role="group" aria-label="Notas dos simulados ao longo do tempo">${ticks}${corte}${linha}${marcas}${fim}${xl}</svg>`;
}
function prontidaoHtml(exam){
  const p=prontidao(exam), e=p.e;
  if(!p.todas.length) return `<section class="sheet tight"><h2 class="t-sm">Prontidão</h2>
    <p class="t-xs dim" style="margin-top:2px">Faça ${fullReady(exam)?"uma prova completa":"um simulado"} para o app começar a medir quando você está pronto para marcar a prova.</p></section>`;
  const lst=p.todas.slice(0,12).reverse();
  const veredito=p.n===3?["Pronto para marcar","go"]:p.n===2?["Quase lá","fl"]:["Ainda não",""];
  const crit=[[p.c1,p.temFull?"Duas últimas provas completas com 30 pontos acima do corte":"Dois últimos simulados com 30 pontos acima do corte"],
    [p.c2,"Todos os domínios com 70% ou mais nas últimas três tentativas"],
    [p.c3,`Banco respondido: ${p.vistas} de ${p.total} questões (${Math.round(p.cob*100)}%, meta 70%)`]];
  const pp=v=>v==null?"–":Math.round(v*100)+"%";
  return `<section class="sheet">
    <div class="hd"><h2 class="t-md">Prontidão</h2><span class="n">${p.todas.length} tentativa${p.todas.length>1?"s":""}</span></div>
    <div class="pront-top">
      <div><p class="t-xs dim">Veredito</p><p class="pront-v ${veredito[1]}">${veredito[0]}</p><p class="t-xs dim2">${p.n} de 3 critérios</p></div>
      <ul class="pront-c">${crit.map(([ok,t])=>`<li data-ok="${ok?1:0}"><span class="ic" aria-hidden="true">${ok?"✓":"·"}</span><span>${t}<span class="sr-only">${ok?": atingido":": ainda não"}</span></span></li>`).join("")}</ul>
    </div>
    <div class="ch-wrap ${isAws(exam)?"":"az"}">${scoreChartSvg(lst,e)}
      <p class="t-xs dim2 ch-key"><span class="k-full" aria-hidden="true"></span> prova completa <span class="k-short" aria-hidden="true"></span> simulado curto</p>
      <p class="t-xs dim" id="chread" aria-live="polite" style="min-height:1.4em;margin-top:2px">Toque num ponto para ver a nota.</p></div>
    <h3 class="t-sm" style="margin:12px 0 6px">Por domínio <span class="dim2 t-xs">últimas 3 tentativas${p.todas.length>3?", comparadas às 3 anteriores":""}</span></h3>
    <div class="domrows">${p.doms.map(({d,agora,antes})=>{
      const v=agora==null?0:Math.round(agora*100), delta=agora!=null&&antes!=null?Math.round((agora-antes)*100):null;
      return `<div class="domrow"><div class="t"><span>${esc(d.name)}</span>
        <b class="mono">${pp(agora)}${delta!=null?` <span class="dim2 t-xs">${delta>0?"▲ +":delta<0?"▼ ":"= "}${delta} pp</span>`:""}</b></div>
        <div class="meter"><i class="${v>=70?"hi":v>=50?"mid":"lo"}" style="width:${v}%"></i></div></div>`;}).join("")}</div>
    <details style="margin-top:10px"><summary class="t-xs dim">Ver em tabela</summary>
      <table class="t-xs" style="width:100%;margin-top:6px;border-collapse:collapse"><thead><tr><th align="left">Data</th><th align="left">Tipo</th><th align="right">Nota</th><th align="right">Acertos</th></tr></thead>
      <tbody>${p.todas.map(r=>`<tr><td>${new Date(r.ts).toLocaleDateString("pt-BR")}</td><td>${r.full?"Completa":"Curto"}</td><td align="right" class="mono">${r.score}</td><td align="right" class="mono">${r.right}/${r.total}</td></tr>`).join("")}</tbody></table></details>
  </section>`;
}

/* Diagnóstico depois da entrega: ritmo e o que estudar a seguir. */
function simDiagHtml(r,e){
  const qs=V.qs||[], ans=V.ans||[], t=V.t||[];
  const n=qs.length; if(!n) return "";
  const gasto=t.reduce((a,b)=>a+b,0)/1000, orc=(r.full&&fullSpec(r.exam)?fullSpec(r.exam).min:e.simMin)*60/n;
  const media=gasto/n;
  const lentas=qs.map((q,i)=>({i,s:(t[i]||0)/1000})).filter(x=>x.s>orc*2).sort((a,b)=>b.s-a.s).slice(0,3);
  /* fichas: soma os erros por conceito e aponta a ficha de cada um */
  const erros={};
  qs.forEach((q,i)=>{ if(!grade(q,ans[i])) (q.tags||[]).forEach(c=>erros[c]=(erros[c]||0)+1); });
  const fichas=[]; const vistas=new Set();
  Object.entries(erros).sort((a,b)=>b[1]-a[1]).forEach(([c,k])=>{
    const f=FICHAS.find(x=>x.concept===c&&x.exam===r.exam)||FICHAS.find(x=>x.concept===c);
    if(f&&!vistas.has(f.id)&&fichas.length<3){ vistas.add(f.id); fichas.push({f,k}); }
  });
  const ritmo=gasto?(media<=orc?"Dentro do tempo":"Acima do tempo"):null;
  return `<section class="sheet">
    <div class="hd"><h2 class="t-md">Diagnóstico</h2><span class="n">o que fazer agora</span></div>
    ${ritmo?`<p class="t-sm"><b>${ritmo}.</b> Média de ${clock(media*1000)} por questão, para um orçamento de ${clock(orc*1000)}.${lentas.length?` As mais demoradas foram a ${lentas.map(x=>x.i+1).join(", a ")}: nelas vale reler a explicação mesmo se acertou.`:""}</p>`:""}
    ${fichas.length?`<p class="t-sm" style="margin-top:9px">Seus erros se concentram nestes temas. Leia a ficha antes do próximo simulado:</p>
      <div class="lst" style="margin-top:7px">${fichas.map(({f,k})=>`<button class="lst-i" data-act="ficha" data-ficha="${f.id}" data-exam="${f.exam}">
        <span class="nm">${esc(f.title)}</span><span class="tm">${k} erro${k>1?"s":""}</span></button>`).join("")}</div>`
      :`<p class="t-sm" style="margin-top:9px">Nenhum erro concentrado num tema. Siga com a revisão espaçada.</p>`}
  </section>`;
}
function viewSimRes(){
  const r=V.res; if(!r) return viewHome();
  const e=ex0(r.exam), aw=isAws(r.exam);
  return `<div class="stack-lg">
    <div class="result enter">
      <p class="t-xs dim2">${esc(simRotulo(r))}</p>
      <p class="t-sm dim">Nota na escala de ${e.scale}, corte ${e.pass}</p>
      <div class="big ${r.pass?"ok":"no"}">${r.score}</div>
      <p class="t-lg" style="color:${r.pass?"var(--go)":"var(--no)"}">${r.pass?"Aprovado no simulado":"Reprovado no simulado"}</p>
      <p class="t-sm dim">${r.right} de ${r.total} questões corretas</p>
    </div>
    <p class="t-xs dim2" style="text-align:center">Este simulado é calibrado acima da prova real. Reprovar aqui no começo é esperado.</p>
    ${simDiagHtml(r,e)}

    <section class="sheet">
      <div class="hd"><h2 class="t-md">Desempenho por domínio</h2><span class="n">ponderado pelo peso oficial</span></div>
      <div class="domrows">${e.domains.map(d=>{
        const b=r.byDom[d.id], v=b.n?Math.round(b.ok/b.n*100):0;
        return `<div class="domrow"><div class="t"><span>${esc(d.name)} <span class="dim2 mono">${d.w}</span></span>
          <b style="color:${v>=70?"var(--go)":v>=50?"var(--fl)":"var(--no)"}">${b.ok}/${b.n}</b></div>
          <div class="meter"><i class="${v>=70?"hi":v>=50?"mid":"lo"}" style="width:${v}%"></i></div></div>`;}).join("")}</div>
    </section>

    <section class="stack">
      <div class="hd"><h2>Gabarito comentado</h2><span class="n">${r.total} questões</span></div>
      <div class="row" role="group" aria-label="Filtrar o gabarito" style="gap:6px">
        ${[["all","Todas",r.total],["no","Que errei",r.total-r.right],["flag","Marcadas",(V.flags||[]).filter(Boolean).length]]
          .map(([f,l,n],k)=>`<button class="btn sm" data-act="simfilter" data-f="${f}" aria-pressed="${k===0}">${l} <span class="mono dim2">${n}</span></button>`).join("")}
      </div>
      <div id="gabarito" class="gab" data-f="all">
      ${V.qs.map((q,i)=>{
        const ok=grade(q,V.ans[i]), sec=V.t?Math.round((V.t[i]||0)/1000):null, fl=!!(V.flags&&V.flags[i]);
        return `<div class="sheet gab-i" data-ok="${ok?1:0}" data-flag="${fl?1:0}" style="border-left:3px solid ${ok?"var(--go)":"var(--no)"}">
          <div class="row" style="margin-bottom:9px"><span class="tag ${ok?"go":"no"} mono">${i+1}</span>
          <span class="t-sm ${ok?"":"dim"}">${ok?"Você acertou":"Você errou"}</span>
          ${fl?'<span class="tag mono">marcada</span>':""}<span style="flex:1"></span>
          ${sec!=null?`<span class="t-xs mono dim2" title="Tempo nesta questão">${clock(sec*1000)}</span>`:""}</div>
          ${qHtml(q,true,V.ans[i])}${verdictHtml(q,V.ans[i])}</div>`;}).join("")}
      </div>
    </section>

    <div class="row" style="justify-content:center">
      <button class="btn fill" data-act="share-result">Baixar cartão do resultado</button>
      ${typeof C.compartilharResultado==="function"?`<button class="btn" data-act="share-linkedin">Compartilhar no LinkedIn</button>`:""}
      <button class="btn ${aw?"aw":"az"}" data-act="simstart" data-exam="${r.exam}">Novo simulado</button>
      <button class="btn" data-act="exam" data-exam="${r.exam}">Voltar à trilha</button>
    </div>
  </div>`;
}

/* ---------------- revisão ---------------- */
function filaHtml(){
  const due=dueConcepts(null);
  const fichaDe=id=>FICHAS.find(f=>f.concept===id);
  const total=Object.keys(S.concepts).filter(k=>S.concepts[k].n>0).length;
  if(due.length) return `<section class="sheet">
      <div class="spread" style="margin-bottom:12px">
        <div><h2 class="t-md">${due.length} ${due.length===1?"conceito vencido":"conceitos vencidos"}</h2>
        <p class="t-xs dim2" style="margin-top:2px">Sessão de até 8 questões, misturando os dois exames</p></div>
        <button class="btn go" data-act="review-go">Revisar agora</button>
      </div>
      <div class="domrows">${due.slice(0,10).map(d=>{
        const f=fichaDe(d.id), v=Math.round(d.prof*100);
        return `<div class="domrow"><div class="t">
          <span>${esc(f?f.title:d.id)} ${f?`<span class="dim2 mono">${ex0(f.exam).code}</span>`:""}</span>
          <b style="color:${v>=70?"var(--go)":v>=40?"var(--fl)":"var(--no)"}">${v}%</b></div>
          <div class="meter"><i class="${v>=70?"hi":v>=40?"mid":"lo"}" style="width:${v}%"></i></div>
          ${f?`<div style="margin-top:5px"><button class="btn sm ghost" data-act="ficha" data-ficha="${f.id}" data-exam="${f.exam}">reler a ficha</button></div>`:""}
        </div>`;}).join("")}</div>
      ${due.length>10?`<p class="t-xs dim2" style="margin-top:10px">e mais ${due.length-10}.</p>`:""}
    </section>`;
  return `<section class="sheet">
      <h2 class="t-md">${total?"Fila de revisão vazia.":"A fila começa depois da primeira prática."}</h2>
      <p class="t-sm dim" style="margin-top:6px">${total
        ? "Nada vencido hoje. Volte amanhã, ou avance no conteúdo novo pela trilha."
        : "Leia as fichas de um domínio e responda a prática: o que você errar entra nesta fila automaticamente."}</p>
      <div style="margin-top:12px"><button class="btn" data-act="home">Ir para a trilha</button></div>
    </section>`;
}
function viewReview(){
  const FILA=filaHtml();
  const due=dueConcepts(null);
  const fichaDe=id=>FICHAS.find(f=>f.concept===id);
  const total=Object.keys(S.concepts).filter(k=>S.concepts[k].n>0).length;
  if(!due.length&&total>=8) unlock("revisao");
  const naFila=new Set(due.map(x=>x.id));
  const fracos=Object.keys(S.concepts).filter(k=>S.concepts[k].n>0&&!naFila.has(k))
    .map(k=>({id:k,...S.concepts[k]})).sort((a,b)=>a.prof-b.prof).slice(0,6);
  return `<div class="stack-lg">
    <section>
      <h1 class="t-xl">Treinar</h1>
      <p class="t-md dim" style="margin-top:7px;max-width:64ch">Cinco formas de praticar fora da trilha: a fila do que venceu hoje, um minuto de relâmpago, baralhos de triagem, cartões de memorização e o mapa entre as duas nuvens.</p>
    </section>

${due.length?FILA:""}
    <section class="sheet">
      <div class="spread" style="margin-bottom:6px">
        <div style="max-width:48ch"><h2 class="t-md">Relâmpago</h2>
        <p class="t-xs dim" style="margin-top:2px">Sessenta segundos, três alternativas por vez. Mede o que já virou reflexo.${S.sprints.length?" Seu recorde: "+Math.max.apply(null,S.sprints.map(x=>x.ok))+" acertos.":""}</p></div>
        <button class="btn fill" data-act="sprint-go">Começar</button>
      </div>
    </section>

    <section class="sheet">
      <div class="hd"><h2 class="t-md">Baralhos de classificação</h2><span class="n">${DECKS.length} baralhos · ${DECKS.reduce((a,d)=>a+d.items.length,0)} itens</span></div>
      <p class="t-sm dim" style="margin-bottom:11px">Cada item vai para uma categoria. É a decisão que a prova pede o tempo todo: em qual caixa isto se encaixa.</p>
      <div class="decks">${DECKS.map(d=>{
        const r=S.decks[d.id], aw=isAws(d.exam);
        return `<button class="deckcard" data-act="deck-go" data-deck="${d.id}">
          <span class="tag ${aw?"aw":"az"} mono">${ex0(d.exam).code}</span>
          <b>${esc(d.title)}</b>
          <span class="t-xs dim2">${d.items.length} itens · ${d.buckets.length} categorias</span>
          <span class="t-xs ${r?"":"dim2"}">${r?"melhor: "+r.melhor+"/"+r.total:"ainda não jogado"}</span>
        </button>`;}).join("")}</div>
    </section>

    <section class="sheet">
      <div class="spread">
        <div style="max-width:48ch"><h2 class="t-md">Mapa Azure e AWS</h2>
        <p class="t-xs dim" style="margin-top:2px">${EQUIV.length} equivalências entre as duas nuvens, com a nota de onde elas divergem.</p></div>
        <button class="btn" data-act="compare">Abrir</button>
      </div>
    </section>

    <section class="sheet">
      <div class="spread" style="margin-bottom:6px">
        <div style="max-width:48ch"><h2 class="t-md">Cartões de memorização</h2>
        <p class="t-xs dim" style="margin-top:2px">${CARDS.length} cartões tirados das tabelas de sinal das fichas: você lê a pista do enunciado e diz qual é a resposta. ${cardDue().length} ${cardDue().length===1?"vencido":"vencidos"} agora.</p></div>
        <button class="btn ${cardDue().length?"fill":""}" data-act="cards-go" ${cardDue().length?"":"disabled"}>Treinar</button>
      </div>
      <p class="t-xs dim2">Respondidos: ${Object.keys(S.cards).length} de ${CARDS.length}.</p>
    </section>

${due.length?"":FILA}
    ${fracos.length?`<section class="sheet">
      <div class="hd"><h2 class="t-md">Mais fracos, ainda não vencidos</h2><span class="n">voltam nos próximos dias</span></div>
      <div class="domrows">${fracos.map(f=>{
        const fi=fichaDe(f.id), v=Math.round(f.prof*100);
        return `<div class="domrow"><div class="t"><span>${esc(fi?fi.title:f.id)}</span>
          <b style="color:${v>=70?"var(--go)":v>=40?"var(--fl)":"var(--no)"}">${v}%</b></div>
          <div class="meter"><i class="${v>=70?"hi":v>=40?"mid":"lo"}" style="width:${v}%"></i></div></div>`;}).join("")}</div>
    </section>`:""}
  </div>`;
}

/* ---------------- cartões ---------------- */
function startCards(){
  const cs=pickCards(10);
  if(!cs.length){ toast("Nenhum cartão vencido agora","no"); return; }
  CARD={list:cs,i:0,flip:false,ok:0};
  go("cards");
}
function viewCards(){
  if(!CARD) return viewReview();
  const c=CARD.list[CARD.i];
  if(!c){
    const t=CARD.list.length, ok=CARD.ok; CARD=null;
    return `<div class="result enter">
      <p class="t-sm dim">Cartões concluídos</p>
      <div class="big ${ok/t>=.8?"ok":ok/t>=.5?"":"no"}">${Math.round(ok/t*100)}%</div>
      <p class="t-sm dim">${ok} de ${t} corretos</p>
      <p class="t-md" style="margin-top:8px">Acertou: volta em 1, 2, 4, 8, 16 e 30 dias. Errou: volta hoje mesmo.</p>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn fill" data-act="cards-go">Mais 10 cartões</button>
        <button class="btn" data-act="review">Voltar à revisão</button>
      </div></div>`;
  }
  const f=FICHAS.find(x=>x.id===c.ficha), aw=isAws(c.exam);
  return `<div class="stack">
    <div class="cardbar">
      <button class="btn ghost sm" data-act="review">Sair</button>
      <span class="tag ${aw?"aw":"az"} mono">${ex0(c.exam).code}</span>
      <span class="tag mono">${CARD.i+1}/${CARD.list.length}</span>
      <div class="cardprog"><i style="width:${Math.round(CARD.i/CARD.list.length*100)}%"></i></div>
    </div>
    <div class="card3 ${CARD.flip?"back":""} enter" ${CARD.flip?"":'data-act="card-flip" role="button" tabindex="0"'}>
      <span class="side">${esc((CARD.flip?c.al:c.ql).toUpperCase())}</span>
      <p class="face">${esc(CARD.flip?c.a:c.q)}</p>
      <span class="src">${esc(c.titulo)}</span>
    </div>
    ${CARD.flip
      ? `<div class="row"><button class="btn" style="flex:1" data-act="card-no">Errei</button>
         <button class="btn go" style="flex:1" data-act="card-ok">Acertei</button></div>
         <p class="t-xs dim2" style="text-align:center">Teclado: 1 errei, 2 acertei.</p>`
      : `<button class="btn fill wide" data-act="card-flip">Mostrar resposta</button>
         <p class="t-xs dim2" style="text-align:center">Teclado: espaço vira o cartão.</p>`}
  </div>`;
}


/* ---------------- baralho de classificação ---------------- */
function startDeck(id){
  const d=DECKS.find(x=>x.id===id); if(!d) return;
  DK={deck:d,ordem:shuffle(d.items.map((_,i)=>i)),i:0,ok:0,resp:null};
  go("deck");
}
function viewDeck(){
  if(!DK) return viewReview();
  const d=DK.deck, idx=DK.ordem[DK.i], it=d.items[idx], aw=isAws(d.exam);
  if(!it){
    const t=DK.ordem.length, ok=DK.ok, id=d.id, titulo=d.title;
    S.decks[id]={n:(S.decks[id]?S.decks[id].n:0)+1,melhor:Math.max(S.decks[id]?S.decks[id].melhor||0:0,ok),total:t,ts:Date.now()};
    if(ok===t) unlock("baralho");
    addXp(ok*3,"baralho concluído"); save(); DK=null;
    return `<div class="result enter">
      <p class="t-sm dim">${esc(titulo)}</p>
      <div class="big ${ok/t>=.8?"ok":ok/t>=.5?"":"no"}">${ok}/${t}</div>
      <p class="t-md" style="margin-top:8px">${ok===t?"Triagem perfeita.":"Os itens que você errou entraram na revisão do conceito."}</p>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn fill" data-act="deck-go" data-deck="${id}">Repetir embaralhado</button>
        <button class="btn" data-act="review">Voltar</button>
      </div></div>`;
  }
  const r=DK.resp;
  return `<div class="stack">
    <div class="cardbar">
      <button class="btn ghost sm" data-act="review">Sair</button>
      <span class="tag ${aw?"aw":"az"} mono">${ex0(d.exam).code}</span>
      <span class="tag mono">${DK.i+1}/${DK.ordem.length}</span>
      <div class="cardprog"><i style="width:${Math.round(DK.i/DK.ordem.length*100)}%"></i></div>
    </div>
    <p class="t-sm dim">${esc(d.prompt)}</p>
    <div class="card3 enter" style="min-height:150px">
      <span class="side">CLASSIFIQUE</span>
      <p class="face">${esc(it.t)}</p>
    </div>
    <div class="buckets">${d.buckets.map(b=>{
      let st="";
      if(r){ st = b.k===it.k ? "ok" : (b.k===r?"bad":""); }
      return `<button class="bucket ${st}" ${r?"disabled":""} data-act="deck-pick" data-k="${b.k}">${esc(b.label)}</button>`;}).join("")}</div>
    ${r?`<div class="verdict ${r===it.k?"ok":"no"}" role="status" aria-live="polite">
      <h4>${r===it.k?"Certo":"Era "+esc(d.buckets.find(b=>b.k===it.k).label)}</h4>
      <p class="why">${esc(it.e)}</p></div>
      <button class="btn wide ${aw?"aw":"az"}" data-act="deck-next">${DK.i===DK.ordem.length-1?"Ver resultado":"Próximo item"}</button>`
    :`<p class="t-xs dim2" style="text-align:center">Teclado: 1 a ${d.buckets.length} escolhem a categoria.</p>`}
  </div>`;
}

/* ---------------- relâmpago: 60 segundos ---------------- */
function startSprint(){
  const base=CARDS.slice();
  if(base.length<6){ toast("Cartões insuficientes","no"); return; }
  SP={fim:Date.now()+60000,i:0,ok:0,erro:0,lista:shuffle(base),opts:null,resp:null};
  sprintOpts();
  go("sprint");
}
function sprintOpts(){
  const c=SP.lista[SP.i % SP.lista.length];
  const mesmo=CARDS.filter(x=>x.ficha===c.ficha&&x.a!==c.a);
  const outros=CARDS.filter(x=>x.exam===c.exam&&x.a!==c.a);
  const pool=shuffle(mesmo.length>=2?mesmo:outros);
  const vistos=new Set([c.a]); const alt=[];
  for(const x of pool){ if(!vistos.has(x.a)){ vistos.add(x.a); alt.push(x.a); } if(alt.length===2) break; }
  while(alt.length<2){ const x=CARDS[(Math.random()*CARDS.length)|0]; if(!vistos.has(x.a)){ vistos.add(x.a); alt.push(x.a); } }
  SP.opts=shuffle([c.a].concat(alt));
}
function viewSprint(){
  if(!SP) return viewReview();
  const resta=SP.fim-Date.now();
  if(resta<=0){
    const ok=SP.ok, err=SP.erro;
    S.sprints.unshift({ok,err,ts:Date.now()}); S.sprints=S.sprints.slice(0,20);
    if(ok>=20) unlock("relampago");
    addXp(ok*2,"relâmpago"); save();
    const melhor=Math.max(...S.sprints.map(x=>x.ok));
    SP=null;
    return `<div class="result enter">
      <p class="t-sm dim">Relâmpago, 60 segundos</p>
      <div class="big ${ok>=20?"ok":ok>=12?"":"no"}">${ok}</div>
      <p class="t-sm dim">${ok} ${ok===1?"acerto":"acertos"}, ${err} ${err===1?"erro":"erros"}. Seu recorde: ${melhor}.</p>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn fill" data-act="sprint-go">De novo</button>
        <button class="btn" data-act="review">Voltar</button>
      </div></div>`;
  }
  const c=SP.lista[SP.i % SP.lista.length];
  return `<div class="stack">
    <div class="cardbar">
      <button class="btn ghost sm" data-act="review">Sair</button>
      <span class="clock ${resta<15000?"crit":resta<30000?"warn":""}" id="spclock">${clock(resta)}</span>
      <span class="tag go mono">${SP.ok} certos</span>
      ${SP.erro?`<span class="tag no mono">${SP.erro} erros</span>`:""}
    </div>
    <div class="card3 enter" style="min-height:130px">
      <span class="side">${esc((c.ql||"Sinal").toUpperCase())}</span>
      <p class="face" style="font-size:17px">${esc(c.q)}</p>
    </div>
    <div class="opts">${SP.opts.map((o,i)=>{
      let st="";
      if(SP.resp!=null){ st = o===c.a?"ok":(i===SP.resp?"bad":""); }
      return `<button class="opt" ${SP.resp!=null?"disabled":""} ${st?`data-res="${st}"`:""} data-act="sprint-pick" data-i="${i}">
        <span class="k">${i+1}</span><span>${esc(o)}</span></button>`;}).join("")}</div>
    <p class="t-xs dim2" style="text-align:center">Teclado: 1, 2 e 3. Erro não tira tempo, só não pontua.</p>
  </div>`;
}

/* ---------------- desafios compartilháveis ---------------- */
/* O link carrega os ids das questões: quem abrir recebe exatamente o
   mesmo conjunto, sem precisar de servidor nem de conta. */
function challLink(exam,ids,mins){
  const base=location.href.split("#")[0];
  return base+"#c="+exam+"~"+mins+"~"+ids.join(".");
}
function parseChall(h){
  const m=/^#c=([a-z0-9]+)~(\d+)~(.+)$/i.exec(h||"");
  if(!m) return null;
  const exam=m[1], mins=Math.min(180,Math.max(1,parseInt(m[2],10)||20));
  const ids=m[3].split(".").filter(Boolean);
  if(!ex0(exam)) return null;
  const qs=ids.map(id=>QUESTIONS.find(q=>q.id===id)).filter(Boolean);
  if(qs.length<3) return null;
  return {exam,mins,qs,faltando:ids.length-qs.length};
}
function buildChall(exam,n,mins){
  const qs=pickSim(exam,n);
  return {exam,mins,qs,link:challLink(exam,qs.map(q=>q.id),mins)};
}
function startChall(c){
  const qs=c.qs.map(prep);
  SIM={exam:c.exam,qs,i:0,ans:qs.map(initSel),flags:qs.map(()=>false),
       end:Date.now()+c.mins*6e4,done:false,chall:true};
  saveSim(); unlock("desafio"); go("sim",{exam:c.exam});
}
function viewChall(){
  const rec=parseChall(V.hash||"");
  const meus=S.challenges.slice(0,5);
  return `<div class="stack-lg">
    <section>
      <h1 class="t-xl">Desafios</h1>
      <p class="t-md dim" style="margin-top:7px;max-width:62ch">Monte um conjunto de questões e compartilhe o link. Quem abrir recebe exatamente as mesmas questões, no mesmo tempo. Não precisa de conta nem de servidor: o desafio viaja dentro do endereço.</p>
    </section>

    ${rec?`<section class="sheet" style="border-color:var(--fl)">
      <h2 class="t-md">Você recebeu um desafio</h2>
      <p class="t-sm dim" style="margin-top:4px">${ex0(rec.exam).code} · ${rec.qs.length} questões · ${rec.mins} minutos${rec.faltando?" · "+rec.faltando+" questão(ões) do link não existe(m) mais neste banco":""}</p>
      <div style="margin-top:12px"><button class="btn go" data-act="chall-start">Aceitar e começar</button></div>
    </section>`:""}

    <section class="sheet">
      <h2 class="t-md" style="margin-bottom:10px">Criar um desafio</h2>
      <div class="grid2">
        <label class="fld"><span>Exame</span>
          <select id="ch-exam">${EXAMS.filter(e=>e.status==="active").map(e=>
            `<option value="${e.id}">${e.code} — ${esc(e.name)}</option>`).join("")}</select></label>
        <label class="fld"><span>Questões</span>
          <select id="ch-n">${[5,10,15,20,25,30].map(n=>`<option value="${n}"${n===10?" selected":""}>${n}</option>`).join("")}</select></label>
        <label class="fld"><span>Minutos</span>
          <select id="ch-m">${[5,10,15,20,30,45].map(n=>`<option value="${n}"${n===15?" selected":""}>${n}</option>`).join("")}</select></label>
      </div>
      <div class="row" style="margin-top:12px">
        <button class="btn fill" data-act="chall-make">Gerar link</button>
      </div>
      <div id="ch-out"></div>
    </section>

    ${meus.length?`<section class="sheet">
      <h2 class="t-md" style="margin-bottom:10px">Seus últimos desafios</h2>
      ${meus.map(c=>`<div class="spread" style="padding:7px 0;border-bottom:1px solid var(--rule)">
        <span class="t-sm"><b class="mono">${ex0(c.exam).code}</b> <span class="dim2">${c.n} questões · ${c.mins} min · ${new Date(c.ts).toLocaleDateString("pt-BR")}</span></span>
        <button class="btn sm" data-act="chall-copy" data-link="${esc(c.link)}">Copiar link</button></div>`).join("")}
    </section>`:""}

    <div class="note">O link leva os identificadores das questões, nada sobre você. Se o banco for atualizado e alguma questão sair, o desafio avisa quantas faltaram e segue com as demais.</div>
  </div>`;
}

/* ---------------- comparativo ---------------- */
function viewCompare(){
  if(C.comparar.leuAsDuasNuvens(FICHAS,S.fichas)) unlock("bothclouds");
  return C.comparar.tela(EQUIV);
}

/* ---------------- progresso ---------------- */
let IMPORT_PENDENTE=null;
function previaImport(){
  if(!IMPORT_PENDENTE) return "";
  const r=IMPORT_PENDENTE.resumo, d=r.atualizado?new Date(r.atualizado).toLocaleString("pt-BR"):"data desconhecida";
  return `<section class="sheet imp-previa" role="alertdialog" aria-labelledby="imp-h" aria-describedby="imp-d">
    <h2 class="t-md" id="imp-h">Substituir o progresso deste aparelho?</h2>
    <p class="t-sm" id="imp-d" style="margin-top:6px">O arquivo tem <b>${r.xp} XP</b>, <b>${r.simulados}</b> simulado${r.simulados===1?"":"s"} e <b>${r.questoes}</b> questões vistas, salvo em ${esc(d)}.
      Agora você tem ${S.xp} XP. O progresso atual fica guardado como cópia de segurança.</p>
    <div class="row" style="margin-top:10px"><button class="btn" data-act="imp-no">Cancelar</button><button class="btn fill" data-act="imp-ok">Substituir</button></div>
  </section>`;
}
function viewMe(){
  const goal=GOALS[S.goal], last=S.sims.slice(0,5);
  const fr=FICHAS.filter(f=>S.fichas[f.id]).length;
  return `<div class="stack-lg">
    ${previaImport()}
    <section><h1 class="t-xl">Seu progresso</h1></section>
    ${typeof C.blocoCalendario==="function"?C.blocoCalendario(S.dias||{},GOALS[S.goal]||100):""}
    ${typeof C.blocoConta==="function"?C.blocoConta():""}

    <section class="sheet">
      ${[["XP acumulado",S.xp],["Ofensiva",S.streak+(S.streak===1?" dia":" dias")],
         ["Congeladores",S.shields],["XP desta semana",S.weekXp],
         ["Questões respondidas",S.answered],["Melhor sequência",S.bestCombo],
         ["Fichas estudadas",fr+" de "+FICHAS.length],
         ["Cartões respondidos",(S.answeredCards||0)+" de "+CARDS.length],
         ["Aulas vistas",Object.keys(S.lessons).length+" de "+LESSONS.length]]
        .map(([k,v])=>`<div class="spread" style="padding:6px 0;border-bottom:1px solid var(--rule)">
          <span class="t-sm dim">${k}</span><b class="mono t-sm">${v}</b></div>`).join("")}
    </section>

    <section class="sheet">
      <h2 class="t-md" style="margin-bottom:9px">Aparência</h2>
      <div class="row">${[["auto","Seguir o sistema"],["light","Claro"],["dark","Escuro"]].map(([v,t])=>
        `<button class="btn sm ${S.theme===v?"fill":""}" data-act="theme" data-v="${v}" aria-pressed="${S.theme===v}">${t}</button>`).join("")}</div>
    </section>

    <section class="sheet">
      <h2 class="t-md" style="margin-bottom:9px">Meta diária</h2>
      <div class="row">${[[1,"Leve",50],[2,"Normal",100],[3,"Intenso",150]].map(([v,t,x])=>
        `<button class="btn sm ${S.goal===v?"fill":""}" data-act="goal" data-v="${v}">${t} · ${x} XP</button>`).join("")}</div>
      <p class="t-xs dim2" style="margin-top:8px">Hoje: ${S.todayXp} de ${goal} XP.</p>
    </section>

    <section class="sheet">
      <h2 class="t-md" style="margin-bottom:10px">Conquistas</h2>
      <div class="achs">${ACHS.map(a=>`<div class="ach" data-on="${S.ach[a.id]?1:0}">
        <div class="e" aria-hidden="true">${a.e}</div><div class="t">${esc(a.t)}</div><div class="d">${esc(a.d)}</div></div>`).join("")}</div>
    </section>

    ${last.length?`<section class="sheet">
      <h2 class="t-md" style="margin-bottom:10px">Últimos simulados</h2>
      ${last.map(r=>`<div class="spread" style="padding:7px 0;border-bottom:1px solid var(--rule)">
        <span class="t-sm"><b class="mono">${ex0(r.exam).code}</b>${r.full?' <span class="tag mono">completa</span>':""} <span class="dim2">${new Date(r.ts).toLocaleDateString("pt-BR")}</span></span>
        <span class="tag ${r.pass?"go":"no"} mono">${r.score}</span></div>`).join("")}
    </section>`:""}

    <section class="sheet">
      <h2 class="t-md" style="margin-bottom:7px">Dados</h2>
      <p class="t-sm dim">O progresso fica neste navegador. Ele só vai para a nuvem se você entrar na conta. As estatísticas anônimas estão explicadas em Privacidade.</p>
      ${(()=>{ const n=ARMAZ?PROG.backups(ARMAZ).length:0;
        return n?`<div class="spread" style="margin-top:9px"><span class="t-xs dim">${n} cópia${n>1?"s":""} de segurança guardada${n>1?"s":""} (a mais recente primeiro)</span>
          <button class="btn sm" data-act="backup-baixar">Baixar a mais recente</button></div>`:""; })()}
      <div class="row" style="margin-top:11px">
        <button class="btn sm" data-act="export">Exportar para arquivo</button>
        <button class="btn sm" data-act="copy">Copiar progresso</button>
        <button class="btn sm" data-act="import">Importar de arquivo</button>
        <button class="btn sm" data-act="reset">Apagar meu progresso</button>
      </div>
      <input type="file" id="impfile" accept="application/json,.json" aria-label="Arquivo de progresso" style="display:none">
      <textarea id="jsonbox" readonly spellcheck="false" aria-label="Progresso em JSON para copiar" style="display:none;width:100%;height:120px;margin-top:10px;
        font:12px/1.4 var(--fm);padding:9px;border:1px solid var(--rule2);border-radius:2px;
        background:var(--sheet2);color:var(--ink);resize:vertical"></textarea>
      <p class="t-xs dim2" style="margin-top:9px">Limpar os dados do navegador apaga o progresso. Exporte de vez em quando se quiser guardá-lo.</p>
    </section>
  </div>`;
}

/* ---------------- exportar progresso ----------------
   No visualizador de artefato um link de download não faz nada: o arquivo
   precisa passar pela capacidade "downloads". Fora dele, o link comum serve.
   Se nenhum caminho funcionar, mostra o texto para copiar à mão. */
function progressJson(){ return JSON.stringify(S,null,1); }
async function exportProgress(){
  const nome="cloudquest-progresso-"+dayKey()+".json", dados=progressJson();
  try{
    if(window.claude&&typeof window.claude.use==="function"){
      const dl=await window.claude.use("downloads");
      if(dl&&typeof dl.save==="function"){
        await dl.save({filename:nome,data:dados});
        toast("Arquivo salvo","ok"); return;
      }
    }
  }catch(err){ /* o visitante pode recusar: cai no próximo caminho */ }
  try{
    const url=URL.createObjectURL(new Blob([dados],{type:"application/json"}));
    const link=document.createElement("a");
    link.href=url; link.download=nome; link.rel="noopener";
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    toast("Download iniciado","ok"); return;
  }catch(err){ /* segue para a cópia manual */ }
  showJson(dados);
}
async function copyProgress(){
  const dados=progressJson();
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){
      await navigator.clipboard.writeText(dados);
      toast("Progresso copiado","ok"); return;
    }
  }catch(err){ /* sem permissão de área de transferência */ }
  showJson(dados);
}
function showJson(dados){
  const box=document.getElementById("jsonbox");
  if(!box) return toast("Não consegui exportar aqui","no");
  box.style.display="block";
  box.value=dados;
  box.focus(); box.select();
  toast("Copie o texto selecionado","fl");
}

/* ---------------- copiar e compartilhar ---------------- */
async function copiar(texto,msgOk){
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){
      await navigator.clipboard.writeText(texto);
      toast(msgOk||"Copiado","ok"); return true;
    }
  }catch(err){ /* sem permissão: cai para a seleção manual */ }
  const box=document.getElementById("ch-link")||document.getElementById("jsonbox");
  if(box){ box.style.display="block"; box.value=texto; box.focus(); box.select();
    toast("Copie o texto selecionado","fl"); return false; }
  toast("Não consegui copiar aqui","no"); return false;
}
/* cartão de resultado em PNG, para postar */
function resultCanvas(r){
  const e=ex0(r.exam), W=1200, H=630;
  const cv=document.createElement("canvas"); cv.width=W; cv.height=H;
  const x=cv.getContext("2d"); if(!x) return null;
  const esc1=getComputedStyle(document.documentElement);
  const tinta="#101720", papel="#FFFFFF", linha="#C8D0DA";
  x.fillStyle=papel; x.fillRect(0,0,W,H);
  x.strokeStyle=linha; x.lineWidth=2;
  for(let i=40;i<W;i+=26){ for(let j=40;j<H;j+=26){ x.fillStyle="#DCE3EB"; x.fillRect(i,j,2,2); } }
  x.fillStyle=papel; x.fillRect(56,56,W-112,H-112);
  x.strokeStyle=tinta; x.lineWidth=3; x.strokeRect(56,56,W-112,H-112);
  const F=(p,w)=>w+" "+p+"px Archivo, system-ui, sans-serif";
  x.fillStyle=tinta; x.font=F(30,"600"); x.fillText("CloudQuest", 96, 126);
  x.fillStyle="#44505F"; x.font=F(26,"400");
  x.fillText(e.code+" · simulado de "+r.total+" questões", 96, 170);
  x.fillStyle=r.pass?"#0A6346":"#A3122C"; x.font=F(168,"600");
  x.fillText(String(r.score), 96, 350);
  x.fillStyle=tinta; x.font=F(34,"600");
  x.fillText(r.pass?"Aprovado no simulado":"Ainda não passei", 96, 412);
  x.fillStyle="#44505F"; x.font=F(26,"400");
  x.fillText(r.right+" de "+r.total+" corretas · corte "+e.pass+" de "+e.scale, 96, 456);
  // barras por domínio
  let y=520; const bw=(W-192)/e.domains.length-16;
  e.domains.forEach((d,i)=>{
    const b=r.byDom[d.id], v=b&&b.n?b.ok/b.n:0;
    const px=96+i*(bw+16);
    x.fillStyle="#E6EAEF"; x.fillRect(px,y,bw,14);
    x.fillStyle="#0A58B8"; x.fillRect(px,y,Math.round(bw*v),14);
    x.fillStyle="#44505F"; x.font=F(19,"500");
    x.fillText("D"+(i+1)+" "+Math.round(v*100)+"%", px, y+42);
  });
  return cv;
}
async function shareResult(){
  const r=V.res; if(!r) return;
  const e=ex0(r.exam);
  const txt="CloudQuest · "+e.code+": "+r.score+" de "+e.scale+" ("+r.right+"/"+r.total+"), corte "+e.pass+".";
  const cv=resultCanvas(r);
  if(!cv){ copiar(txt,"Resultado copiado"); return; }
  const dados=cv.toDataURL("image/png");
  const nome="cloudquest-"+e.code.toLowerCase()+"-"+r.score+".png";
  try{
    if(window.claude&&typeof window.claude.use==="function"){
      const dl=await window.claude.use("downloads");
      if(dl&&typeof dl.save==="function"){ await dl.save({filename:nome,data:dados}); toast("Cartão salvo","ok"); return; }
    }
  }catch(err){ /* recusado: cai para o link comum */ }
  try{
    const link=document.createElement("a"); link.href=dados; link.download=nome;
    document.body.appendChild(link); link.click(); link.remove();
    toast("Cartão baixado","ok"); return;
  }catch(err){ /* último recurso */ }
  copiar(txt,"Resultado copiado");
}

/* ---------------- desafio do dia ---------------- */
function daily(){
  const pool=QUESTIONS.filter(q=>q.lvl>=4);
  return pool.length?pool[parseInt(dayKey().replace(/-/g,""),10)%pool.length]:null;
}

/* ============================================================
   EVENTOS
   ============================================================ */
document.addEventListener("click",ev=>{
  const b=ev.target.closest("[data-act]"); if(!b||b.disabled) return;
  const a=b.dataset.act;

  if(a==="home")    return go("home");
  if(a==="compare") return go("compare");
  if(GUIA_MOD.acao(a,b)) return;
  if(a==="me")      return go("me");
  if(a==="exam")    return go("exam",{exam:b.dataset.exam||V.exam});
  if(a==="soon")    return toast("Ainda não liberado nesta versão","no");
  if(a==="trilha")  return go("trilha");
  if(a==="cat")     return go("cat");
  if(a==="meta"){   S.meta=b.dataset.v; save(); return render(); }
  if(a==="catprov"){S.catProv=b.dataset.v; save(); return render(); }
  if(a==="catgroup"){S.catGroup=b.dataset.v; save(); return render(); }
  if(a==="metago"){ S.meta=b.dataset.v; save(); return go("trilha"); }
  if(a==="certst"){
    const id=b.dataset.id, v=b.dataset.v;
    S.certs[id]=S.certs[id]===v?"":v;   /* clique no mesmo valor desmarca */
    if(!S.certs[id]) delete S.certs[id];
    save(); return render();
  }
  if(a==="jump"){
    const el=document.getElementById("d-"+b.dataset.dom);
    if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
    return;
  }

  /* ficha */
  if(a==="ficha"){ RD=null; return go("ficha",{ficha:b.dataset.ficha,exam:b.dataset.exam||V.exam,from:V.name}); }
  if(a==="rclose") return closeFicha();
  if(a==="rdone"){
    const f=FICHAS.find(x=>x.id===RD.id);
    if(!S.fichas[f.id]){
      S.fichas[f.id]=Date.now();
      unlock("ficha1");
      addXp(20,"ficha estudada");
      if(contentDone(f.exam,f.dom)) unlock("domclear");
    }
    return closeFicha(f.exam);
  }

  /* aula */
  if(a==="aula"){ PL=null; return go("aula",{aula:b.dataset.aula,exam:V.exam,from:V.name}); }
  if(a==="aclose"){ PL=null; return V.exam?go("exam",{exam:V.exam}):go("home"); }
  if(a==="anext")  return aNext();
  if(a==="aprev"){ if(PL.i>0){ PL.i--; PL.quiz=0; } clearTimers(); return render(); }
  if(a==="aplay"){ PL.playing=!PL.playing; clearTimers(); return render(); }
  if(a==="aspeed"){ PL.speed=PL.speed===1?1.5:PL.speed===1.5?2:1; clearTimers(); return render(); }
  if(a==="lq"){
    const l=LESSONS.find(x=>x.id===V.aula), q=l.quiz[PL.quiz], i=+b.dataset.i;
    if(PL.ans[PL.quiz]!=null) return;
    PL.ans[PL.quiz]=i;
    if(l.concept) schedule(l.concept,i===q.c);
    if(i===q.c) addXp(5,"exercício da aula");
    clearTimers(); return render();
  }

  /* prática */
  if(a==="study") return startSession(b.dataset.exam||V.exam,b.dataset.dom||null,false);
  if(a==="boss")  return startSession(b.dataset.exam||V.exam,b.dataset.dom,true);
  if(a==="daily"){
    const q=prep(daily());
    SES={exam:q.exam,dom:q.dom,boss:false,daily:true,qs:[q],i:0,sel:initSel(q),shown:false,right:0};
    return go("study",{exam:q.exam});
  }
  if(a==="qpick"){
    const q=SES?SES.qs[SES.i]:SIM.qs[SIM.i];
    const cur=(SES?SES.sel:SIM.ans[SIM.i])||[], k=b.dataset.k;
    const next=q.type==="single"?[k]:(cur.includes(k)?cur.filter(x=>x!==k):cur.concat([k]));
    if(SES) SES.sel=next; else { SIM.ans[SIM.i]=next; saveSim(); }
    if(next.includes(k)) FX.pick=k;
    return render();
  }
  if(a==="qyn"){
    const q=SES?SES.qs[SES.i]:SIM.qs[SIM.i];
    const cur=((SES?SES.sel:SIM.ans[SIM.i])||q.rows.map(()=>undefined)).slice();
    cur[+b.dataset.i]=b.dataset.v==="1";
    FX.yn=b.dataset.i+":"+b.dataset.v;
    if(SES) SES.sel=cur; else { SIM.ans[SIM.i]=cur; saveSim(); }
    return render();
  }
  if(a==="qup"||a==="qdn"){
    const q=SES?SES.qs[SES.i]:SIM.qs[SIM.i];
    const cur=((SES?SES.sel:SIM.ans[SIM.i])||q.shufOrder).slice();
    const p=+b.dataset.p, t=a==="qup"?p-1:p+1;
    if(t<0||t>=cur.length) return;
    [cur[p],cur[t]]=[cur[t],cur[p]];
    if(SES) SES.sel=cur; else { SIM.ans[SIM.i]=cur; saveSim(); }
    return render();
  }
  if(a==="qcheck"){
    const q=SES.qs[SES.i];
    if(SES.sel==null||(q.type!=="yn"&&SES.sel.length===0)) return toast("Escolha uma resposta","no");
    if(q.type==="yn"&&SES.sel.some(v=>v===undefined)) return toast("Responda todos os itens","no");
    const ok=grade(q,SES.sel);
    SES.shown=true; FX.check=true;
    if(ok){
      SES.right++; S.combo++; S.bestCombo=Math.max(S.bestCombo,S.combo);
      if(S.combo>=10) unlock("combo10");
      addXp(10+q.lvl*2,"acerto");
      if(SES.daily) addXp(25,"desafio do dia");
    }else{
      S.combo=0;
      if(SES.boss){ S.lives=Math.max(0,S.lives-1); if(!S.lives) toast("Energia zerada: uma volta a cada 20 min","no"); }
      addXp(2,"tentativa");
    }
    if(SES.daily) S.dailyDone=dayKey();
    /* acerto com dúvida volta antes: chute certo não é conhecimento */
    const nota=ok?(SES.duv?F.Nota.duvida:F.Nota.acertei):F.Nota.errei;
    (q.tags||[]).forEach(t=>schedule(t,ok,nota));
    S.seen[q.id]={ok,n:((S.seen[q.id]&&S.seen[q.id].n)||0)+1,lastTs:Date.now()};
    S.answered++; if(S.answered>=50) unlock("q50");
    save(); return render();
  }
  if(a==="qduv"){ if(SES&&!SES.shown){ SES.duv=!SES.duv; render(); } return; }
  if(a==="qnext"){ FX.nav="next"; SES.i++; SES.sel=initSel(SES.qs[SES.i]); SES.shown=false; SES.duv=false; clearTimers(); return render(); }

  /* simulado */
  if(a==="simstart"){
    if(((SIM&&!SIM.done)||S.sim)&&!twoStep("simstart","Há um simulado em andamento. Toque de novo para descartá-lo e começar outro.")) return;
    const modo=b.dataset.modo||(b.dataset.full==="1"?"completo":"curto");
    const sel=document.getElementById("simdom");
    return startSim(b.dataset.exam||V.exam,modo,modo==="dominio"&&sel?sel.value:undefined);
  }
  if(a==="simfilter"){
    const box=document.getElementById("gabarito"); if(!box) return;
    box.dataset.f=b.dataset.f;
    document.querySelectorAll('[data-act="simfilter"]').forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    return;
  }
  if(a==="simnext"){ if(SIM.i<SIM.qs.length-1){ SIM.i++; FX.nav="next"; } else SIM.review=true; saveSim(); render(); window.scrollTo(0,0); return; }
  if(a==="simreview"){ SIM.review=true; saveSim(); render(); window.scrollTo(0,0); return; }
  if(a==="simback"){ SIM.review=false; render(); return; }
  if(a==="simrisc"){
    const r=SIM.risc[SIM.i]||(SIM.risc[SIM.i]=[]), k=b.dataset.k, at=r.indexOf(k);
    if(at>=0) r.splice(at,1); else r.push(k);
    saveSim(); render();
    const nb=document.querySelector('[data-act="simrisc"][data-k="'+k+'"]'); if(nb) nb.focus();
    return;
  }
  if(a==="simprev"){ if(SIM.i>0){ SIM.i--; FX.nav="prev"; saveSim(); render(); } return; }
  if(a==="simgo"){ const i=+b.dataset.i; if(Number.isInteger(i)&&i>=0&&i<SIM.qs.length){ if(!SIM.review&&i!==SIM.i) FX.nav=i>SIM.i?"next":"prev"; SIM.i=i; SIM.review=false; saveSim(); render(); window.scrollTo(0,0); } return; }
  if(a==="qreport"){
    const id=b.dataset.q, m=b.dataset.m;
    if(!id||!SIMM.motivoValido(m)||REPORTADAS.has(id)) return;
    const foi=typeof C.evento==="function"&&C.evento("questao_reportada",{questao:id,motivo:m});
    if(!foi){ toast("Não deu para enviar: o envio de estatísticas está desligado ou bloqueado pelo navegador","no"); return; }
    REPORTADAS.add(id); toast("Obrigado! Vamos revisar esta questão.");
    const box=b.closest(".reportar"); if(box) box.outerHTML=SIMM.reportar(id,true);
    return;
  }
  if(a==="simflag"){ SIM.flags[SIM.i]=!SIM.flags[SIM.i]; saveSim(); return render(); }
  if(a==="simfinish"){
    const miss=SIM.ans.filter(x=>x==null).length;
    if(miss&&!twoStep("simfinish",miss+" sem resposta. Toque em Entregar agora de novo para confirmar.")) return;
    return finishSim();
  }

  /* progresso */
  if(a==="goal"){ S.goal=+b.dataset.v; save(); return render(); }
  if(a==="review"||a==="review-tab") return go("review");
  if(a==="review-go"){
    const qs=reviewQuestions(8);
    if(!qs.length) return toast("Nada vencido para revisar","no");
    SES={exam:qs[0].exam,dom:null,boss:false,review:true,qs,i:0,sel:initSel(qs[0]),shown:false,right:0,deadline:null};
    return go("study",{exam:qs[0].exam});
  }
  if(a==="export"){ exportProgress(); return; }
  if(a==="copy"){ copyProgress(); return; }
  if(a==="import"){ const f=document.getElementById("impfile"); if(f) f.click(); return; }
  if(a==="simresume"){ if(!restoreSim()) toast("O simulado expirou","no"); return; }
  if(a==="simdrop"){ S.sim=null; save(); toast("Simulado descartado"); return render(); }
  if(a==="print"){ try{ window.print(); }catch(err){ toast("Impressão indisponível aqui","no"); } return; }
  if(a==="cards-go") return startCards();
  if(a==="deck-go") return startDeck(b.dataset.deck);
  if(a==="deck-pick"){
    const d=DK.deck, it=d.items[DK.ordem[DK.i]];
    if(DK.resp) return;
    DK.resp=b.dataset.k; FX.check=true;
    const ok=DK.resp===it.k;
    if(ok){ DK.ok++; addXp(3,"classificação"); }
    if(d.concept) schedule(d.concept,ok);
    save(); return render();
  }
  if(a==="deck-next"){ DK.i++; DK.resp=null; return render(); }
  if(a==="sprint-go") return startSprint();
  if(a==="sprint-pick"){
    if(SP.resp!=null) return;
    const c=SP.lista[SP.i%SP.lista.length], i=+b.dataset.i, ok=SP.opts[i]===c.a;
    SP.resp=i; FX.check=true;
    if(ok) SP.ok++; else SP.erro++;
    if(c.concept) schedule(c.concept,ok);
    render();
    timers.push(setTimeout(()=>{ if(!SP) return; SP.i++; SP.resp=null; sprintOpts(); render(); }, ok?260:900));
    return;
  }
  if(a==="chall") return go("chall",{hash:location.hash});
  if(a==="chall-start"){
    const c=parseChall(V.hash||location.hash);
    if(!c) return toast("Desafio inválido","no");
    return startChall(c);
  }
  if(a==="chall-make"){
    const ex=document.getElementById("ch-exam").value;
    const n=+document.getElementById("ch-n").value;
    const m=+document.getElementById("ch-m").value;
    const c=buildChall(ex,n,m);
    S.challenges.unshift({exam:ex,n:c.qs.length,mins:m,link:c.link,ts:Date.now()});
    S.challenges=S.challenges.slice(0,10);
    unlock("desafio"); save();
    const out=document.getElementById("ch-out");
    if(out) out.innerHTML=`<div class="bx case" style="margin-top:13px"><span class="lbl">LINK DO DESAFIO</span>
      <textarea id="ch-link" readonly spellcheck="false" aria-label="Link do desafio">${esc(c.link)}</textarea>
      <div class="row" style="margin-top:9px">
        <button class="btn sm fill" data-act="chall-copy" data-link="${esc(c.link)}">Copiar link</button>
        <button class="btn sm" data-act="chall-try" data-link="${esc(c.link)}">Fazer eu mesmo</button>
      </div></div>`;
    return;
  }
  if(a==="chall-copy"){ copiar(b.dataset.link,"Link copiado"); return; }
  if(a==="chall-try"){
    const c=parseChall("#"+String(b.dataset.link).split("#")[1]);
    if(!c) return toast("Link inválido","no");
    return startChall(c);
  }
  if(a==="share-result"){ shareResult(); return; }
  if(a==="share-linkedin"){ const r=V.res; if(r&&typeof C.compartilharResultado==="function") C.compartilharResultado({exam:r.exam,score:r.score,pass:r.pass,data:dayKey(new Date(r.ts||Date.now()))}); return; }
  if(a==="card-flip"){ CARD.flip=true; FX.flip=true; return render(); }
  if(a==="card-ok"||a==="card-no"){
    const c=CARD.list[CARD.i], ok=a==="card-ok";
    scheduleCard(c.id,ok);
    if(ok){ CARD.ok++; addXp(3,"cartão"); }
    if(c.concept) schedule(c.concept,ok);
    S.answeredCards=(S.answeredCards||0)+1;
    if(S.answeredCards>=100) unlock("cartoes");
    CARD.i++; CARD.flip=false; save(); return render();
  }
  if(a==="theme"){
    S.theme=b.dataset.v; save(); applyTheme(); return render();
  }
  if(a==="noop") return;
  if(a==="reset"){
    if(!twoStep("reset","Isso apaga o progresso deste aparelho. Toque de novo para confirmar (uma cópia fica guardada).")) return;
    if(ARMAZ) PROG.guardarBackup(ARMAZ,JSON.stringify(S));
    try{ ARMAZ&&ARMAZ.removeItem(KEY); }catch(e){}
    S=DEF(); save(); toast("Progresso apagado. Uma cópia ficou em Perfil → Dados."); return go("home");
  }
  if(a==="imp-ok"){
    if(!IMPORT_PENDENTE) return;
    if(ARMAZ) PROG.guardarBackup(ARMAZ,JSON.stringify(S));
    S=Object.assign(DEF(),IMPORT_PENDENTE.estado); IMPORT_PENDENTE=null;
    rollDay(); rollWeek(); regenLives(); applyTheme();
    save(); toast("Progresso importado. O anterior ficou guardado como cópia.","ok"); return go("me");
  }
  if(a==="imp-no"){ IMPORT_PENDENTE=null; toast("Importação cancelada"); return render(); }
  if(a==="backup-baixar"){
    const k=ARMAZ&&PROG.backups(ARMAZ)[0], bruto=k&&ARMAZ.getItem(k);
    if(!bruto) return toast("Nenhuma cópia guardada","no");
    const url=URL.createObjectURL(new Blob([bruto],{type:"application/json"}));
    const el=document.createElement("a"); el.href=url; el.download="cloudquest-copia-"+k.slice(-13)+".json";
    document.body.appendChild(el); el.click(); el.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    return;
  }
});

/* campos que mudam por "change", não por clique */
document.addEventListener("input",ev=>{ if(ev.target&&ev.target.id==="gsearch") GUIA_MOD.filtrar(); });
document.addEventListener("change",ev=>{
  const t=ev.target;
  if(t&&t.id==="examdate"){
    const v=t.value;
    if(v) S.dates[V.exam]=v; else delete S.dates[V.exam];
    save();
    const p=document.getElementById("pace");
    if(p) p.textContent=paceText(V.exam);
    return;
  }
  if(t&&t.id==="impfile"&&t.files&&t.files[0]){
    const arq=t.files[0];
    t.value="";   /* sem isso, escolher o mesmo arquivo de novo não dispara "change" */
    if(arq.size>PROG.LIMITE_IMPORT) return toast("Arquivo grande demais para ser um progresso do CloudQuest","no");
    const fr=new FileReader();
    fr.onload=()=>{
      const r=PROG.lerImportacao(String(fr.result));
      if(!r.ok) return toast(r.erro,"no");
      /* nada é trocado ainda: a prévia pede confirmação */
      IMPORT_PENDENTE=r; go("me"); window.scrollTo(0,0);
    };
    fr.onerror=()=>toast("Não consegui ler esse arquivo","no");
    fr.readAsText(arq);
  }
});

/* ---------- teclado ----------
   Responder com o teclado é o que torna o estudo rápido no computador. */
function pickIndex(i){
  const q=SES?SES.qs[SES.i]:(SIM?SIM.qs[SIM.i]:null);
  if(!q||(q.type!=="single"&&q.type!=="multi")) return false;
  const list=q.shuf||q.opts;
  if(i>=list.length) return false;
  const k=list[i].k, cur=(SES?SES.sel:SIM.ans[SIM.i])||[];
  const next=q.type==="single"?[k]:(cur.includes(k)?cur.filter(x=>x!==k):cur.concat([k]));
  if(SES) SES.sel=next; else { SIM.ans[SIM.i]=next; saveSim(); }
  if(next.includes(k)) FX.pick=k;
  render(); return true;
}
const chRead=ev=>{ const g=ev.target&&ev.target.closest&&ev.target.closest(".ch-pt"), out=document.getElementById("chread");
  if(g&&out) out.textContent=g.dataset.lbl; };
document.addEventListener("pointerover",chRead);
document.addEventListener("focusin",chRead);
document.addEventListener("keydown",ev=>{
  const t=ev.target;
  if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)) return;
  if(ev.metaKey||ev.ctrlKey||ev.altKey) return;
  const k=ev.key;
  if(V.name==="ficha"){ if(k==="Escape"){ ev.preventDefault(); closeFicha(); } return; }
  if(V.name==="aula"){
    if(k==="Escape"){ ev.preventDefault(); PL=null; go("exam",{exam:V.exam}); }
    else if(k===" "){ ev.preventDefault(); PL.playing=!PL.playing; clearTimers(); render(); }
    else if(k==="ArrowRight"){ ev.preventDefault(); aNext(); }
    return;
  }
  if(V.name==="deck"&&DK){
    const d=DK.deck;
    if(!DK.resp&&/^[1-9]$/.test(k)&&+k<=d.buckets.length){ ev.preventDefault();
      const b=document.querySelector('[data-act="deck-pick"][data-k="'+d.buckets[+k-1].k+'"]');
      if(b) b.dispatchEvent(new MouseEvent("click",{bubbles:true})); return; }
    if(DK.resp&&(k==="Enter"||k===" ")){ ev.preventDefault();
      const b=document.querySelector('[data-act="deck-next"]');
      if(b) b.dispatchEvent(new MouseEvent("click",{bubbles:true})); }
    return;
  }
  if(V.name==="sprint"&&SP){
    if(SP.resp==null&&/^[1-3]$/.test(k)){ ev.preventDefault();
      const b=document.querySelector('[data-act="sprint-pick"][data-i="'+(+k-1)+'"]');
      if(b) b.dispatchEvent(new MouseEvent("click",{bubbles:true})); }
    return;
  }
  if(V.name==="cards"&&CARD){
    if(!CARD.flip&&(k===" "||k==="Enter")){ ev.preventDefault(); CARD.flip=true; render(); return; }
    if(CARD.flip&&(k==="1"||k==="2")){ ev.preventDefault();
      const b=document.querySelector(k==="1"?'[data-act="card-no"]':'[data-act="card-ok"]');
      if(b) b.dispatchEvent(new MouseEvent("click",{bubbles:true})); }
    return;
  }
  if(V.name==="study"&&SES){
    if(/^[1-9]$/.test(k)&&!SES.shown){ if(pickIndex(+k-1)) ev.preventDefault(); return; }
    if((k==="d"||k==="D")&&!SES.shown){ ev.preventDefault(); SES.duv=!SES.duv; render(); return; }
    if(k==="Enter"){
      ev.preventDefault();
      const btn=document.querySelector('[data-act="qcheck"],[data-act="qnext"]');
      if(btn) btn.dispatchEvent(new MouseEvent("click",{bubbles:true}));
    }
    return;
  }
  if(V.name==="sim"&&SIM){
    /* Enter num botão focado (riscar, marcar) é clique, não "próxima" */
    if(k==="Enter"&&t&&t.tagName==="BUTTON") return;
    if(SIM.review){ if(k==="Escape"){ ev.preventDefault(); SIM.review=false; render(); } return; }
    if(/^[1-9]$/.test(k)){ if(pickIndex(+k-1)) ev.preventDefault(); return; }
    if(k==="ArrowRight"||k==="Enter"){ ev.preventDefault();
      if(SIM.i<SIM.qs.length-1){ SIM.i++; FX.nav="next"; } else SIM.review=true; saveSim(); render(); return; }
    if(k==="ArrowLeft"){ ev.preventDefault(); if(SIM.i>0){ SIM.i--; FX.nav="prev"; saveSim(); render(); } return; }
    if(k==="f"||k==="F"){ ev.preventDefault(); SIM.flags[SIM.i]=!SIM.flags[SIM.i]; saveSim(); render(); }
    return;
  }
});

/* cronômetro do relâmpago */
setInterval(()=>{
  if(V.name!=="sprint"||!SP) return;
  const el=document.getElementById("spclock");
  const resta=SP.fim-Date.now();
  if(resta<=0){ render(); return; }
  if(el){ el.textContent=clock(resta); el.className="clock "+(resta<15000?"crit":resta<30000?"warn":""); }
},250);

/* cronômetro do chefe */
setInterval(()=>{
  if(V.name!=="study"||!SES||!SES.deadline) return;
  const el=document.getElementById("sclock"); if(!el) return;
  const left=SES.deadline-Date.now();
  el.textContent=clock(left);
  el.className="clock "+(left<3e4?"crit":left<6e4?"warn":"");
  if(left<=0){ toast("Tempo do chefe esgotado","no"); SES.i=SES.qs.length; render(); }
},1000);

QUESTIONS.forEach(prep);
load();
/* um link de desafio abre direto na tela de desafios */
if(parseChall(location.hash)) V={name:"chall",hash:location.hash};
render();
if(AVISO_LEITURA) setTimeout(()=>toast(AVISO_LEITURA,"no"),400);
window.addEventListener("hashchange",()=>{ if(parseChall(location.hash)) go("chall",{hash:location.hash}); });

/* Contrato com os módulos tipados (src/main.ts): estado, troca de estado
   vinda da conta, render e aviso. Some na fase 3, quando o estado sair daqui. */
globalThis.__CQ_MOTOR = {
  estado: () => S,
  substituir: substituirEstado,
  render: () => render(),
  toast: (m, t) => toast(m, t),
  tela: () => V.name,
};

/* Gancho de inspeção para testes de navegador (só com ?cq-test na URL).
   Expõe leitura do estado interno sem voltar a poluir o escopo global. */
try {
  if (typeof location !== "undefined" && /[?&]cq-test\b/.test(location.search || "")) {
    globalThis.__CQ_TEST = { get S() { return S; }, get V() { return V; }, set V(v) { V = v; }, get DK() { return DK; }, resultCanvas };
  }
} catch (e) { /* ambiente sem location: nada a expor */ }
