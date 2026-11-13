const pup=require("./_navegador");
(async()=>{
  const b=await pup.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
  const p=await b.newPage(); await p.setViewport({width:1240,height:1000});
  await p.goto(process.env.CQ_URL||"http://localhost:4173/",{waitUntil:"networkidle0"});
  await new Promise(r=>setTimeout(r,700));
  await p.click('[data-act="exam"][data-exam="clf"]');
  await new Promise(r=>setTimeout(r,400));
  const r=await p.evaluate(()=>{
    const bs=[...document.querySelectorAll(".canvas > div > section .bands .band")];
    const ws=bs.map(x=>x.getBoundingClientRect().width);
    const declared=bs.map(x=>parseFloat(x.style.flex));
    const tw=ws.reduce((a,c)=>a+c,0), td=declared.reduce((a,c)=>a+c,0);
    return bs.map((_,i)=>({declarado:+(declared[i]/td*100).toFixed(1), renderizado:+(ws[i]/tw*100).toFixed(1)}));
  });
  let bad=0;
  r.forEach(x=>{ const d=Math.abs(x.declarado-x.renderizado); if(d>1.5){bad++; console.log("FALHA: peso "+x.declarado+"% renderizou como "+x.renderizado+"%");} });
  console.log(bad?"":"OK: largura dos blocos bate com o peso declarado  "+JSON.stringify(r));
  await b.close(); process.exit(bad?1:0);
})();
