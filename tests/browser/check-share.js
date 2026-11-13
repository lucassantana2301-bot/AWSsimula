/* o cartão de resultado precisa ser gerado de verdade num navegador real */
const pup=require("puppeteer-core");
(async()=>{
  const b=await pup.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
  const p=await b.newPage(); await p.setViewport({width:1240,height:1000,deviceScaleFactor:2});
  const errs=[]; p.on("pageerror",e=>errs.push(e.message));
  await p.goto((process.env.CQ_URL||"http://localhost:4173/")+"?cq-test",{waitUntil:"networkidle0"});
  await new Promise(r=>setTimeout(r,900));
  // monta um resultado e gera o PNG
  const r=await p.evaluate(()=>{
    const e=__CQ_CONTENT.EXAMS.find(x=>x.id==="az900");
    const byDom={}; e.domains.forEach((d,i)=>byDom[d.id]={n:8,ok:[7,4,6][i]});
    const rec={exam:"az900",score:742,pass:true,right:17,total:24,byDom,ts:Date.now(),chall:true};
    __CQ_TEST.V={name:"simres",exam:"az900",res:rec,qs:[],ans:[]};
    const cv=__CQ_TEST.resultCanvas(rec);
    if(!cv) return {erro:"canvas nulo"};
    const url=cv.toDataURL("image/png");
    return {w:cv.width,h:cv.height,png:url.slice(0,22),bytes:url.length};
  });
  if(r.erro) errs.push(r.erro);
  if(r.w!==1200||r.h!==630) errs.push("cartão com dimensão errada: "+r.w+"x"+r.h);
  if(r.png!=="data:image/png;base64,") errs.push("não gerou PNG: "+r.png);
  if(r.bytes<8000) errs.push("PNG suspeito de estar vazio ("+r.bytes+" bytes)");
  // salva para inspeção
  const dataUrl=await p.evaluate(()=>{
    const e=__CQ_CONTENT.EXAMS.find(x=>x.id==="az900");
    const byDom={}; e.domains.forEach((d,i)=>byDom[d.id]={n:8,ok:[7,4,6][i]});
    return __CQ_TEST.resultCanvas({exam:"az900",score:742,pass:true,right:17,total:24,byDom,ts:Date.now()}).toDataURL("image/png");
  });
  require("fs").mkdirSync("build",{recursive:true});require("fs").writeFileSync("build/cartao.png",Buffer.from(dataUrl.split(",")[1],"base64"));
  await b.close();
  console.log(errs.length?"FALHAS:\n  "+errs.join("\n  "):"OK: cartão de resultado gerado ("+(r.bytes/1024|0)+" KB de data URL)");
  process.exit(errs.length?1:0);
})();
