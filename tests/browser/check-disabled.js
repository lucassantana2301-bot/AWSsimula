const pup=require("puppeteer-core");
(async()=>{
  const b=await pup.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
  const p=await b.newPage(); await p.setViewport({width:1240,height:1000});
  await p.goto(process.env.CQ_URL||"http://localhost:4173/",{waitUntil:"networkidle0"});
  await new Promise(r=>setTimeout(r,700));
  await p.click('[data-act="exam"][data-exam="az900"]');
  await new Promise(r=>setTimeout(r,400));
  const r=await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll("button:disabled").forEach(x=>{
      const c=getComputedStyle(x);
      // um botão bloqueado não pode ter fundo saturado
      const m=c.backgroundColor.match(/\d+/g);
      if(m){ const [R,G,B]=m.map(Number); const mx=Math.max(R,G,B), mn=Math.min(R,G,B);
        if(mx-mn>40) out.push((x.textContent||"").trim().slice(0,18)+" -> "+c.backgroundColor); }
    });
    return out;
  });
  console.log(r.length? "FALHA: botão bloqueado com cor de ação:\n  "+r.join("\n  ") : "OK: todo botão bloqueado tem aparência neutra");
  await b.close(); process.exit(r.length?1:0);
})();
