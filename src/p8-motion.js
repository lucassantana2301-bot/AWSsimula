/* ============================================================
   MOVIMENTO
   Toda ação re-renderiza a tela por innerHTML. Animação presa a
   estado repetiria a cada clique, então esta camada compara cada
   elemento com [data-k] contra o render anterior da mesma tela e
   só anima o que mudou. Efeitos de uma ação pontual (confirmar
   resposta, virar cartão) chegam pela fila FX e valem um render.
   Com movimento reduzido, nada aqui cria elemento nem conta número.
   ============================================================ */
let FX={};            /* sinais de um render: check, flip */
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
