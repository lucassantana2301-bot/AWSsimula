/* Serve dist/ com os cabeçalhos declarados em vercel.json e navega por
   todas as telas em Chrome real. Qualquer violação de CSP ou erro de JS
   falha: uma política restritiva demais deixaria a página em branco em
   produção sem quebrar build nenhum. */
const http=require("http"), fs=require("fs"), path=require("path");
const pup=require("puppeteer-core");
const ROOT=path.join(__dirname,"..","..");
const cfg=JSON.parse(fs.readFileSync(path.join(ROOT,"vercel.json"),"utf8"));
const cab=Object.fromEntries(cfg.headers.find(h=>h.source==="/(.*)").headers.map(h=>[h.key,h.value]));
const DIST=path.join(ROOT,"dist");
const TIPOS={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".map":"application/json",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".webmanifest":"application/manifest+json"};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* serve dist/ inteiro com os cabeçalhos do vercel.json, como em produção */
const srv=http.createServer((req,res)=>{
  const rel=decodeURIComponent((req.url||"/").split("?")[0]);
  let arq=path.normalize(path.join(DIST,rel==="/"?"index.html":rel));
  if(!arq.startsWith(DIST)||!fs.existsSync(arq)||fs.statSync(arq).isDirectory()) arq=path.join(DIST,"index.html");
  res.writeHead(200,Object.assign({"Content-Type":TIPOS[path.extname(arq)]||"application/octet-stream"},cab));
  res.end(fs.readFileSync(arq));
});
srv.listen(0,"127.0.0.1",async()=>{
  const url="http://127.0.0.1:"+srv.address().port+"/";
  const b=await pup.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
  const p=await b.newPage(); const prob=[];
  p.on("pageerror",e=>prob.push("erro JS: "+e.message));
  p.on("console",m=>{ if(/Content Security Policy|Refused to/i.test(m.text())) prob.push("console: "+m.text().slice(0,160)); });
  await p.evaluateOnNewDocument(()=>{
    document.addEventListener("securitypolicyviolation",e=>{
      (window.__csp=window.__csp||[]).push(e.violatedDirective+" bloqueou "+(e.blockedURI||"inline"));
    });
  });
  await p.setViewport({width:1200,height:1000});
  const resp=await p.goto(url,{waitUntil:"domcontentloaded"}); await sleep(700);
  const csp=resp.headers()["content-security-policy"]||"";
  if(!/default-src 'none'/.test(csp)) prob.push("servidor de teste não aplicou a CSP do vercel.json");
  const telas=["trilha","cat","review","chall","me","home"];
  for(const t of telas){ await p.click('[data-act="'+t+'"]'); await sleep(300); }
  await p.click('[data-act="exam"][data-exam="saa"]'); await sleep(600);
  /* fonte embutida precisa ter carregado de fato */
  const fontes=await p.evaluate(async()=>{ await document.fonts.ready; return [...document.fonts].filter(f=>f.status==="loaded").map(f=>f.family); });
  if(!fontes.length) prob.push("nenhuma fonte embutida carregou sob a CSP");
  /* exportar progresso usa blob: no download */
  await p.click('[data-act="me"]'); await sleep(300);
  await p.evaluate(()=>{ const x=document.querySelector('[data-act="export"]'); if(x) x.click(); }); await sleep(300);
  /* guia: fetch() do JSON sob demanda (connect-src) e player do vídeo (frame-src) */
  await p.click('[data-act="guia"]'); await sleep(900);
  await p.click('[data-act="gserv"][data-id="s3"]'); await sleep(400);
  if(!(await p.$("button[data-gv-play]"))) prob.push("serviço s3 sem vídeo sob a CSP");
  else { await p.click("button[data-gv-play]"); await sleep(500);
    if(!(await p.$('.gv-frame iframe[src^="https://www.youtube-nocookie.com/embed/"]'))) prob.push("player do vídeo não foi criado"); }
  const vio=await p.evaluate(()=>window.__csp||[]);
  vio.forEach(v=>prob.push("CSP: "+v));
  const app=await p.evaluate(()=>document.getElementById("app").textContent.length);
  if(app<200) prob.push("página praticamente vazia sob a CSP");
  await b.close(); srv.close();
  const u=[...new Set(prob)];
  console.log(u.length?"PROBLEMAS SOB A CSP DE PRODUÇÃO:\n  "+u.join("\n  "):"OK: página inteira funciona sob a CSP do vercel.json ("+fontes.length+" fontes embutidas carregadas, nenhuma violação)");
  process.exit(u.length?1:0);
});
