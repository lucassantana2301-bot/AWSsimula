const pup=require("puppeteer-core");

/* checagens que valem em qualquer tela */
const PER_VIEW=`(()=>{
  const out=[];
  document.querySelectorAll("button").forEach(x=>{
    const nome=(x.textContent||"").trim()||x.getAttribute("aria-label")||x.getAttribute("title");
    if(!nome) out.push("botão sem nome acessível: "+(x.className||x.dataset.act||"?"));
  });
  document.querySelectorAll("input,textarea,select").forEach(x=>{
    const id=x.id, lab=(id&&document.querySelector('label[for="'+id+'"]'))||x.closest("label");
    if(!lab&&!x.getAttribute("aria-label")) out.push("campo sem rótulo: "+(x.id||x.type));
  });
  const h1=document.querySelectorAll("h1").length;
  if(h1!==1) out.push("esperava 1 h1, achei "+h1);
  /* um grupo de botões alternáveis precisa dizer qual está ativo */
  document.querySelectorAll(".goals,.seg").forEach(g=>{
    const bs=[...g.querySelectorAll("button")];
    if(bs.length&&!bs.every(b=>b.hasAttribute("aria-pressed")))
      out.push("grupo alternável sem aria-pressed em todos os botões");
  });
  return out;
})()`;

/* contraste de texto secundário e de botão ativo, sobre o fundo real de cada um */
const CONTRAST=`(()=>{
  /* devolve [r,g,b,a] em 0-255 lendo rgb(), rgba() e color(srgb ... / a) */
  const rgba=c=>{
    const n=(c.match(/[\\d.]+/g)||[0,0,0]).map(Number);
    const esc=/^color\\(/.test(c)?255:1;       /* color(srgb) vem em 0-1 */
    return [n[0]*esc,n[1]*esc,n[2]*esc,n.length>3?n[3]:1];
  };
  const lum=c=>{const [r,g,b]=rgba(c).slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});
    return .2126*r+.7152*g+.0722*b;};
  /* fundo efetivo: compõe camadas translúcidas até achar a primeira opaca */
  const opaco=e=>{
    const pilha=[];
    for(let n=e;n;n=n.parentElement){
      const v=rgba(getComputedStyle(n).backgroundColor);
      if(v[3]===0) continue;
      pilha.push(v);
      if(v[3]>=1) break;
    }
    const base=rgba(getComputedStyle(document.body).backgroundColor);
    if(!pilha.length||pilha[pilha.length-1][3]<1) pilha.push(base);
    let [r,g,b]=pilha[pilha.length-1];
    for(let i=pilha.length-2;i>=0;i--){ const [R,G,B,A]=pilha[i];
      r=R*A+r*(1-A); g=G*A+g*(1-A); b=B*A+b*(1-A); }
    return "rgb("+Math.round(r)+","+Math.round(g)+","+Math.round(b)+")";
  };
  const razao=(fg,bg)=>{const a=lum(fg),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);};
  const out=[];
  const alvos=[...document.querySelectorAll('.dim,.dim2,.node-meta,.node-p,.catc .fo,.catc dd,.catc dt,.legend,.goals button,.seg button,.tbar')];
  alvos.forEach(e=>{
    const txt=(e.textContent||"").trim();
    if(!txt) return;
    const st=getComputedStyle(e);
    const r=razao(st.color,opaco(e));
    const grande=parseFloat(st.fontSize)>=18.66||(parseFloat(st.fontSize)>=14.66&&+st.fontWeight>=700);
    if(r<(grande?3:4.5)) out.push(txt.slice(0,26)+" contraste "+r.toFixed(2)+" (fonte "+st.fontSize+")");
  });
  return [...new Set(out)].slice(0,6);
})()`;

(async()=>{
  const b=await pup.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
  const probs=[];
  for(const [w,h] of [[1240,1000],[390,844]]){
    const p=await b.newPage(); await p.setViewport({width:w,height:h});
    await p.goto("file://"+require("path").join(__dirname,"..","..","dist","index.html"),{waitUntil:"domcontentloaded"});
    await new Promise(r=>setTimeout(r,900));

    /* link de pular, só uma vez */
    if(w===1240){
      const sk=await p.evaluate(()=>{
        const out=[], skip=document.querySelector(".skip");
        if(!skip||!document.querySelector(skip.getAttribute("href"))) out.push("link de pular ausente ou sem destino");
        else{
          if(skip.getBoundingClientRect().x>-100) out.push("link de pular visível sem foco");
          skip.focus();
          if(skip.getBoundingClientRect().x<0) out.push("link de pular não aparece ao receber foco");
          skip.blur();
        }
        if(document.documentElement.lang!=="pt-BR") out.push("lang do documento ausente");
        return out;
      });
      sk.forEach(x=>probs.push(x));
    }

    /* cada tela é uma sequência de cliques a partir da anterior */
    const telas=[[['[data-act="home"]'],"início"],[['[data-act="trilha"]'],"trilha"],[['[data-act="cat"]'],"catálogo"],
      [['[data-act="review"]'],"treinar"],[['[data-act="chall"]'],"desafios"],[['[data-act="me"]'],"perfil"],
      [['[data-act="guia"]'],"guia"],[['[data-act="gserv"][data-id="cloudtrail"]'],"serviço do guia"],
      [['[data-act="guia"]','[data-act="gduelo"][data-id="dl-sg-nacl"]','[data-act="gdu-pick"][data-i="0"][data-k="1"]'],"duelo respondido"],
      [['[data-act="guia"]','[data-act="gq-start"]','[data-act="gq-pick"][data-k="0"]'],"treino do guia"]];
    for(const [cliques,nome] of telas){
      for(const sel of cliques){ await p.click(sel); await new Promise(r=>setTimeout(r,320)); }
      const r1=await p.evaluate(PER_VIEW);
      r1.forEach(x=>probs.push("["+w+"px "+nome+"] "+x));
      for(const tema of ["light","dark"]){
        await p.evaluate(t=>document.documentElement.setAttribute("data-theme",t),tema);
        await new Promise(r=>setTimeout(r,120));
        const r2=await p.evaluate(CONTRAST);
        r2.forEach(x=>probs.push("["+w+"px "+nome+" "+tema+"] "+x));
      }
      await p.evaluate(()=>document.documentElement.removeAttribute("data-theme"));
    }
    await p.close();
  }
  await b.close();
  const u=[...new Set(probs)];
  console.log(u.length?"PROBLEMAS DE ACESSIBILIDADE ("+u.length+"):\n  "+u.join("\n  "):"OK: acessibilidade básica em ordem nas "+10+" telas, 2 larguras e 2 temas");
  process.exit(u.length?1:0);
})();
