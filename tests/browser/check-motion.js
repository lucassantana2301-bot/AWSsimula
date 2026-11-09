/* Verifica a camada de movimento em Chrome real:
   anima só o que mudou, nada repete sem mudança, some no fim,
   respeita movimento reduzido e não deixa nó invisível. */
const pup=require("puppeteer-core");
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const b=await pup.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
  const falhas=[]; const ok=(c,m)=>{ if(!c) falhas.push(m); };
  const nova=async(reduzido)=>{
    const p=await b.newPage(); const errs=[];
    p.on("pageerror",e=>errs.push(e.message));
    await p.setViewport({width:1200,height:1000});
    if(reduzido) await p.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
    await p.goto("file://"+require("path").join(__dirname,"..","..","dist","index.html"),{waitUntil:"domcontentloaded"});
    await sleep(600);
    return {p,errs};
  };
  /* clica e conta, no mesmo tique, o que o render acabou de criar */
  const clicaConta=(p,sel)=>p.evaluate(s=>{
    document.querySelector(s).click();
    const app=document.getElementById("app");
    return {tr:app.querySelectorAll(".fx-trace").length,pk:app.querySelectorAll(".fx-pk").length,fx:app.dataset.fx||""};
  },sel);

  /* ---------- 1. trilha: rota assinatura ---------- */
  {
    const {p,errs}=await nova(false);
    await p.click('[data-act="cat"]'); await sleep(250);
    await p.click('[data-act="certst"][data-id="az900"][data-v="done"]'); await sleep(200);
    const r=await clicaConta(p,'[data-act="trilha"]');
    const fl=await p.evaluate(()=>[...document.querySelectorAll(".flow.vert")].map(f=>({
      rota:f.classList.contains("route-in"),pk:f.querySelectorAll(".fx-pk").length,tr:f.querySelectorAll(".fx-trace").length})));
    ok(fl.length===2&&fl.every(f=>f.rota),"rota não foi desenhada nas duas nuvens: "+JSON.stringify(fl));
    ok(fl[0].pk===1,"Azure com AZ-900 concluído deveria ter 1 pacote até o AZ-104, teve "+fl[0].pk);
    ok(fl[1].pk===0,"AWS sem nada concluído não deveria ter pacote, teve "+fl[1].pk);
    ok(fl.every(f=>f.tr===1),"cada trilha deveria provisionar só a etapa atual: "+JSON.stringify(fl));

    /* ---------- 2. sem mudança, nada anima ---------- */
    await sleep(2600);
    const parado=await p.evaluate(()=>({
      sobra:document.querySelectorAll(".fx-trace,.fx-pk").length,
      rota:document.querySelectorAll(".route-in").length,
      invis:[...document.querySelectorAll(".flow.vert .node")].filter(n=>+getComputedStyle(n).opacity<.99).length}));
    ok(parado.sobra===0,"efeitos sobraram no DOM depois de terminar: "+parado.sobra);
    ok(parado.rota===0,"classe da rota não foi removida");
    ok(parado.invis===0,"nó ficou invisível depois da rota: "+parado.invis);
    const igual=await clicaConta(p,'[data-act="meta"][data-v="admin"]');
    ok(igual.tr===0&&igual.pk===0,"re-render sem mudança animou algo: "+JSON.stringify(igual));

    /* ---------- 3. marcar etapa: provisiona ela e a próxima, com pacote ---------- */
    const m=await clicaConta(p,'[data-act="certst"][data-id="az104"][data-v="done"]');
    ok(m.tr===2,"concluir AZ-104 deveria traçar ele e o AZ-700, traçou "+m.tr);
    ok(m.pk===2,"deveria haver um pacote chegando em cada nó que mudou, houve "+m.pk);
    /* ---------- 4. trocar de objetivo desenha a rota nova uma vez ---------- */
    const t1=await clicaConta(p,'[data-act="meta"][data-v="seg"]');
    const t2=await (async()=>{ await sleep(2600); return clicaConta(p,'[data-act="meta"][data-v="seg"]'); })();
    ok(t1.tr>=2,"trilha nova não desenhou a rota");
    ok(t2.tr===0&&t2.pk===0,"rota repetiu ao reabrir a mesma trilha: "+JSON.stringify(t2));
    ok(!errs.length,"erro JS na trilha: "+errs[0]);
    await p.close();
  }

  /* ---------- 5. baralho: confirmar resposta ---------- */
  {
    const {p,errs}=await nova(false);
    await p.click('[data-act="review"]'); await sleep(250);
    await p.evaluate(()=>document.querySelector('[data-act="deck-go"]').click()); await sleep(200);
    const xp0=await p.evaluate(()=>S.xp);
    const certo=await p.evaluate(()=>DK.deck.items[DK.ordem[DK.i]].k);
    const r=await clicaConta(p,'[data-act="deck-pick"][data-k="'+certo+'"]');
    ok(r.fx.split(" ").includes("check"),"tela não recebeu o sinal de confirmação");
    ok(r.tr===1,"a categoria certa deveria ser traçada, traços: "+r.tr);
    const anim=await p.evaluate(()=>getComputedStyle(document.querySelector(".verdict")).animationName);
    ok(anim==="fx-open","veredito não abriu com animação: "+anim);
    const tick=await p.evaluate(()=>!!document.querySelector(".inst.fx-tick"));
    ok(tick,"XP não animou no instrumento");
    await sleep(800);
    const xp=await p.evaluate(()=>[...document.querySelectorAll(".rail-inst .inst")].find(x=>x.querySelector(".k").textContent==="xp").querySelector(".v").textContent);
    ok(+xp===xp0+3,"contador de XP terminou em "+xp+", esperado "+(xp0+3));
    /* próximo item não pode herdar o sinal */
    const prox=await clicaConta(p,'[data-act="deck-next"]');
    ok(prox.fx==="","sinal de confirmação vazou para o render seguinte: "+prox.fx);
    ok(!errs.length,"erro JS no baralho: "+errs[0]);
    await p.close();
  }

  /* ---------- 6. cartão vira ---------- */
  {
    const {p,errs}=await nova(false);
    await p.click('[data-act="review"]'); await sleep(250);
    const tem=await p.evaluate(()=>!!document.querySelector('[data-act="cards-go"]'));
    if(tem){
      await p.evaluate(()=>document.querySelector('[data-act="cards-go"]').click()); await sleep(200);
      const r=await clicaConta(p,'[data-act="card-flip"]');
      const nome=await p.evaluate(()=>getComputedStyle(document.querySelector(".card3.back")).animationName);
      ok(r.fx.includes("flip")&&nome==="fx-flip","cartão não virou com animação: "+nome);
    } else falhas.push("não achei a entrada dos cartões na tela Treinar");
    ok(!errs.length,"erro JS nos cartões: "+errs[0]);
    await p.close();
  }

  /* ---------- 7. transição de tela e nomes únicos ---------- */
  {
    const {p,errs}=await nova(false);
    const dup=async()=>p.evaluate(()=>{
      const n=[...document.querySelectorAll("*")].map(e=>getComputedStyle(e).viewTransitionName).filter(v=>v&&v!=="none");
      return n.length-new Set(n).size;
    });
    ok(await dup()===0,"nome de transição duplicado no início");
    await p.click('[data-act="exam"][data-exam="saa"]'); await sleep(700);
    ok(await p.evaluate(()=>V.name==="exam"&&!!document.querySelector("h1")&&document.querySelector("h1").textContent.includes("Solutions")),"transição não levou ao exame");
    ok(await dup()===0,"nome de transição duplicado no exame");
    await p.click('[data-act="home"]'); await sleep(700);
    ok(await p.evaluate(()=>V.name==="home"),"transição de volta falhou");
    ok(!errs.length,"erro JS na transição: "+errs[0]);
    await p.close();
  }

  /* ---------- 8. movimento reduzido ---------- */
  {
    const {p,errs}=await nova(true);
    const r=await clicaConta(p,'[data-act="trilha"]');
    ok(r.tr===0&&r.pk===0,"movimento reduzido ainda criou efeitos: "+JSON.stringify(r));
    const invis=await p.evaluate(()=>[...document.querySelectorAll(".flow.vert .node")].filter(n=>+getComputedStyle(n).opacity<.99).length);
    ok(invis===0,"com movimento reduzido há nó invisível: "+invis);
    ok(!errs.length,"erro JS com movimento reduzido: "+errs[0]);
    await p.close();
  }

  await b.close();
  console.log(falhas.length?"FALHAS DE MOVIMENTO ("+falhas.length+"):\n  "+falhas.join("\n  "):"OK: movimento anima só o que mudou, termina limpo e respeita o modo reduzido");
  process.exit(falhas.length?1:0);
})();
