/* Guia de serviços: integridade dos dados e das telas. */
const store={};
global.localStorage={getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]};
const el=()=>({innerHTML:"",textContent:"",className:"",style:{setProperty(){}},appendChild(){},remove(){},
  querySelectorAll:()=>[],dataset:{},addEventListener(){},scrollHeight:0,clientHeight:0,scrollTop:0});
const root=Object.assign(el(),{setAttribute(k,v){this[k]=v},removeAttribute(k){delete this[k]}});
global.document={addEventListener(){},querySelector:()=>el(),getElementById:()=>null,querySelectorAll:()=>[],createElement:el,documentElement:root};
global.location={href:"https://ex.test/app",hash:""};
global.window={scrollTo(){},addEventListener(){},location:global.location};
global.navigator={};
global.setInterval=()=>0; global.clearInterval=()=>{}; global.setTimeout=()=>0; global.clearTimeout=()=>{};
global.requestAnimationFrame=()=>0;
eval(require("fs").readFileSync(require("path").join(__dirname,"..","build","all.js"),"utf8")
  +"\n;Object.assign(global,{GUIA,DUELOS,GCATS,gserv,gqMonta,viewGuia,viewServ,viewDuelo,viewGQ,V_:()=>V,setV:v=>{V=v;}});");

let f=0; const ok=(c,m)=>{ if(!c){ console.log("FALHOU: "+m); f++; } };
const ids=new Set(), cats=new Set(GCATS.map(c=>c[0]));
for(const s of GUIA){
  ok(!ids.has(s.id),"serviço repetido: "+s.id); ids.add(s.id);
  ok(cats.has(s.cat),s.id+": categoria desconhecida "+s.cat);
  ok(["ativo","fechado","descontinuado"].includes(s.status),s.id+": status");
  if(s.status!=="ativo") ok(typeof s.statusNota==="string"&&s.statusNota.length>20,s.id+": falta statusNota");
  for(const k of ["uma","analogia","explica","preco"]) ok(typeof s[k]==="string"&&s[k].length>10,s.id+": campo "+k);
  ok(s.usa.length>=2&&s.nao.length>=1&&s.chave.length>=2,s.id+": listas curtas");
}
for(const s of GUIA) for(const c of s.confunde) ok(gserv(c.id)&&c.id!==s.id,s.id+": confunde aponta para serviço inexistente "+c.id);
const dids=new Set();
for(const d of DUELOS){
  ok(!dids.has(d.id),"duelo repetido: "+d.id); dids.add(d.id);
  const n=d.cols.length;
  for(const c of d.cols) if(c.id) ok(gserv(c.id),d.id+": coluna aponta para serviço inexistente "+c.id);
  for(const l of d.linhas) ok(l.v.length===n,d.id+": linha '"+l.c+"' com "+l.v.length+" células para "+n+" colunas");
  for(const x of d.sinais) ok(Number.isInteger(x.r)&&x.r>=0&&x.r<n,d.id+": sinal com coluna inválida");
  ok(new Set(d.sinais.map(x=>x.r)).size===n,d.id+": sinais não cobrem todas as colunas");
}
/* treino: 20 rodadas, toda pergunta tem exatamente uma resposta certa entre opções distintas */
for(let k=0;k<20;k++){
  for(const q of gqMonta(10)){
    if(q.rot){ ok(q.certoK>=0&&q.certoK<q.rot.length,"treino de duelo com resposta fora das opções"); continue; }
    ok(q.ops.length===Math.min(4,GUIA.filter(s=>s.status==="ativo").length),"treino com "+q.ops.length+" opções");
    ok(new Set(q.ops).size===q.ops.length,"treino com opção repetida");
    ok(q.ops.includes(q.certo),"treino sem a resposta certa entre as opções");
    ok(gserv(q.certo).status==="ativo","treino perguntando serviço fechado: "+q.certo);
  }
}
/* telas renderizam sem lixo */
const sujo=h=>/undefined|NaN|\[object Object\]/.test(h);
setV({name:"guia"}); ok(!sujo(viewGuia()),"lista do guia com undefined/NaN");
for(const s of GUIA){ setV({name:"serv",id:s.id}); const h=viewServ(); ok(!sujo(h)&&h.includes(s.nome.replace(/&/g,"&amp;")),"página do serviço "+s.id+" com problema"); }
for(const d of DUELOS){ setV({name:"duelo",id:d.id,dres:{0:d.sinais[0].r,1:(d.sinais[1].r+1)%d.cols.length}}); ok(!sujo(viewDuelo()),"duelo "+d.id+" com problema"); }
setV({name:"gq",gq2:{list:gqMonta(5),i:0,ok:0,erros:[]}}); ok(!sujo(viewGQ()),"treino com problema");
/* texto do guia passa por esc: nenhum < cru vindo dos dados */
ok(!GUIA.some(s=>/<[a-z]/i.test(JSON.stringify(s))),"dados do guia com marcação HTML");

console.log("Guia: "+GUIA.length+" serviços, "+DUELOS.length+" duelos");
if(f){ console.log(f+" falha(s) no guia"); process.exit(1); }
console.log("*** GUIA: OK ***");
