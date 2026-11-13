const pup=require("./_navegador");
(async()=>{
  const b=await pup.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
  let bad=0;
  for(const [w,h,name] of [[390,844,"celular"],[768,1024,"tablet"],[900,1000,"limite"],[1200,900,"desktop"]]){
    const p=await b.newPage();
    const errs=[]; p.on("pageerror",e=>errs.push(e.message));
    await p.setViewport({width:w,height:h});
    await p.goto(process.env.CQ_URL||"http://localhost:4173/",{waitUntil:"networkidle0"});
    await new Promise(r=>setTimeout(r,700));
    await p.click('[data-act="exam"][data-exam="az900"]');
    await new Promise(r=>setTimeout(r,400));
    /* espera as animações de entrada terminarem: medir no meio delas dá falso alarme */
    await p.evaluate(()=>new Promise(fim=>{
      /* a troca de tela usa View Transitions: enquanto ela roda, uma camada
         cobre a página. Espera três quadros seguidos sem nenhuma animação. */
      let quietos=0, t0=performance.now();
      const passo=()=>{ quietos=document.getAnimations().length?0:quietos+1;
        if(quietos>=3||performance.now()-t0>4000) fim(); else requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }));
    const r=await p.evaluate(()=>{
      const out={clipped:[],tiny:[],overflowX:document.documentElement.scrollWidth>window.innerWidth+1};
      document.querySelectorAll(".node").forEach(n=>{
        const nb=n.querySelector(".node-b");
        if(!nb) return;
        if(n.getBoundingClientRect().height < nb.scrollHeight - 2) out.clipped.push((n.className||"")+" h="+(n.getBoundingClientRect().height|0)+" conteudo="+nb.scrollHeight);
        if(n.getBoundingClientRect().height < 40) out.tiny.push((n.className||"")+" h="+(n.getBoundingClientRect().height|0));
      });
      // todo alvo de toque precisa ter altura usável
      document.querySelectorAll("button:not(:disabled)").forEach(x=>{
        const q=x.getBoundingClientRect();
        if(q.width>0 && q.height>0 && q.height<22) out.tiny.push("botao baixo: "+(x.textContent||"").trim().slice(0,22)+" h="+(q.height|0));
      });
      // o primeiro item de ficha precisa ser clicável de fato
      const f=document.querySelector('[data-act="ficha"]');
      if(f){ const q=f.getBoundingClientRect(); f.scrollIntoView({block:"center"});
        const q2=f.getBoundingClientRect();
        const t=document.elementFromPoint(q2.left+q2.width/2,q2.top+q2.height/2);
        out.hit = t? (t.closest('[data-act="ficha"]')? "ok":"coberto por "+t.tagName+"."+t.className) : "nada";
      }
      return out;
    });
    const ok = !r.clipped.length && !r.tiny.length && !r.overflowX && r.hit==="ok" && !errs.length;
    if(!ok) bad++;
    console.log((ok?"OK  ":"FALHA ")+name+" "+w+"x"+h+
      (r.clipped.length?"\n   cortado: "+r.clipped.join(" | "):"")+
      (r.tiny.length?"\n   pequeno: "+r.tiny.slice(0,4).join(" | "):"")+
      (r.overflowX?"\n   rolagem horizontal":"")+
      (r.hit!=="ok"?"\n   clique na ficha: "+r.hit:"")+
      (errs.length?"\n   erro JS: "+errs[0]:""));

    /* ---- trilha e catálogo: layouts novos, mesmas larguras ---- */
    for(const [act,nome,sel] of [["trilha","trilha",".flow.vert .node"],["cat","catálogo",".catc"]]){
      await p.click('[data-act="'+act+'"]');
      await new Promise(r=>setTimeout(r,350));
      await p.evaluate(()=>new Promise(fim=>{
      /* a troca de tela usa View Transitions: enquanto ela roda, uma camada
         cobre a página. Espera três quadros seguidos sem nenhuma animação. */
      let quietos=0, t0=performance.now();
      const passo=()=>{ quietos=document.getAnimations().length?0:quietos+1;
        if(quietos>=3||performance.now()-t0>4000) fim(); else requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    }));
      const t=await p.evaluate(sel=>{
        const o={clipped:[],tiny:[],overflowX:document.documentElement.scrollWidth>window.innerWidth+1,count:0};
        const caixas=document.querySelectorAll(sel);
        o.count=caixas.length;
        caixas.forEach(n=>{
          const r=n.getBoundingClientRect();
          if(r.height<40) o.tiny.push("caixa baixa h="+(r.height|0));
          if(n.scrollHeight>r.height+2) o.clipped.push("conteudo "+n.scrollHeight+" em caixa de "+(r.height|0));
          if(r.width>window.innerWidth+1) o.clipped.push("caixa mais larga que a tela");
        });
        document.querySelectorAll("button:not(:disabled)").forEach(x=>{
          const q=x.getBoundingClientRect();
          if(q.width>0&&q.height>0&&q.height<22) o.tiny.push("botao baixo: "+(x.textContent||"").trim().slice(0,22)+" h="+(q.height|0));
        });
        /* o controle de situação precisa ser clicável de fato */
        const g=document.querySelector('[data-act="certst"]');
        if(g){ g.scrollIntoView({block:"center"});
          const q=g.getBoundingClientRect();
          const e=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
          o.hit=e?(e.closest('[data-act="certst"]')?"ok":"coberto por "+e.tagName+"."+e.className):"nada";
        } else o.hit="ok";
        return o;
      },sel);
      const tok=!t.clipped.length&&!t.tiny.length&&!t.overflowX&&t.hit==="ok"&&t.count>0&&!errs.length;
      if(!tok) bad++;
      console.log((tok?"OK  ":"FALHA ")+nome+" "+w+"x"+h+" ("+t.count+" caixas)"+
        (t.clipped.length?"\n   cortado: "+t.clipped.slice(0,3).join(" | "):"")+
        (t.tiny.length?"\n   pequeno: "+t.tiny.slice(0,4).join(" | "):"")+
        (t.overflowX?"\n   rolagem horizontal":"")+
        (t.hit!=="ok"?"\n   clique na situação: "+t.hit:"")+
        (!t.count?"\n   nenhuma caixa renderizada":"")+
        (errs.length?"\n   erro JS: "+errs[0]:""));
    }
    await p.close();
  }
  await b.close();
  console.log(bad? "\n*** "+bad+" largura(s) com problema ***" : "\n*** LAYOUT OK EM TODAS AS LARGURAS ***");
  process.exit(bad?1:0);
})();
