/* Estrutura de todas as questões do banco.
   Pega erros que a interface não acusa: gabarito apontando para opção
   inexistente, distrator sem explicação, id repetido, domínio errado. */
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
  +"\n;Object.assign(global,{QUESTIONS,EXAMS,ex0});");

let f=0;
const ok=(c,m)=>{ if(!c){ console.log("FALHOU: "+m); f++; } };
const txt=(v,min)=>typeof v==="string"&&v.trim().length>=min;
const PALAVRA={2:/\b(DUAS|DOIS)\b/,3:/\b(TRÊS|TRES)\b/,4:/\bQUATRO\b/};

const ids=new Set(), textos=new Map();
for(const q of QUESTIONS){
  const id=q.id||"(sem id)";
  ok(typeof q.id==="string"&&q.id.length>0,"questão sem id");
  ok(!ids.has(id),"id repetido: "+id); ids.add(id);

  const e=ex0(q.exam);
  ok(!!e,id+": exame inexistente "+q.exam);
  if(e) ok(e.domains.some(d=>d.id===q.dom),id+": domínio "+q.dom+" não existe em "+e.code);

  ok(Number.isInteger(q.lvl)&&q.lvl>=1&&q.lvl<=5,id+": nível fora de 1..5");
  ok(Number.isInteger(q.sec)&&q.sec>=30&&q.sec<=240,id+": tempo sugerido implausível ("+q.sec+"s)");
  ok(Array.isArray(q.tags)&&q.tags.length>=1,id+": sem tags");
  for(const t of q.tags||[]) ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t),id+": tag fora do padrão: "+t);
  ok(Array.isArray(q.src)&&q.src.length>=1,id+": sem fonte");
  for(const s of q.src||[]){
    ok(txt(s.t,3),id+": fonte sem título");
    ok(/^https:\/\/[^\s]+$/.test(s.u||""),id+": fonte sem https: "+s.u);
  }
  ok(txt(q.stem,15),id+": enunciado curto");
  if(q.case!==undefined) ok(txt(q.case,40),id+": caso curto");

  /* a mesma pergunta não pode aparecer duas vezes com ids diferentes */
  const chave=((q.case||"")+"|"+q.stem).toLowerCase().replace(/\s+/g," ").trim();
  ok(!textos.has(chave),id+": texto idêntico ao de "+textos.get(chave)); textos.set(chave,id);

  switch(q.type){
    case "single":
    case "multi":{
      const ks=(q.opts||[]).map(o=>o.k);
      ok(ks.length>=3,id+": poucas opções");
      ok(new Set(ks).size===ks.length,id+": letra de opção repetida");
      const ts=(q.opts||[]).map(o=>(o.t||"").trim().toLowerCase());
      ok(ts.every(t=>t.length>=1),id+": opção sem texto");
      ok(new Set(ts).size===ts.length,id+": texto de opção repetido");
      ok(Array.isArray(q.ans)&&q.ans.length>=1,id+": sem gabarito");
      ok(new Set(q.ans).size===q.ans.length,id+": gabarito com letra repetida");
      for(const a of q.ans||[]) ok(ks.includes(a),id+": gabarito aponta para opção inexistente "+a);
      if(q.type==="single") ok(q.ans.length===1,id+": single com mais de uma resposta");
      else{
        ok(q.ans.length>=2&&q.ans.length<ks.length,id+": multi com quantidade de respostas inválida");
        const w=PALAVRA[q.ans.length];
        ok(!!w&&w.test(q.stem),id+": enunciado não diz quantas escolher ("+q.ans.length+")");
      }
      ok(q.why&&txt(q.why.ok,40),id+": explicação da resposta certa curta");
      for(const k of ks.filter(k=>!q.ans.includes(k)))
        ok(txt(q.why&&q.why[k],20),id+": distrator "+k+" sem explicação");
      for(const k of Object.keys(q.why||{}))
        ok(k==="ok"||(ks.includes(k)&&!q.ans.includes(k)),id+": explicação para chave inválida "+k);
      break;
    }
    case "yn":
      ok(Array.isArray(q.rows)&&q.rows.length>=3,id+": poucas afirmações");
      for(const [i,r] of (q.rows||[]).entries()){
        ok(txt(r.t,20),id+": afirmação "+(i+1)+" curta");
        ok(typeof r.a==="boolean",id+": afirmação "+(i+1)+" sem Sim/Não booleano");
        ok(txt(r.e,20),id+": afirmação "+(i+1)+" sem explicação");
      }
      break;
    case "order":
      ok(Array.isArray(q.items)&&q.items.length>=3,id+": poucos itens para ordenar");
      ok(new Set((q.items||[]).map(x=>x.t)).size===(q.items||[]).length,id+": item repetido");
      ok(txt(q.e,80),id+": explicação da ordem curta");
      break;
    default:
      ok(false,id+": tipo desconhecido "+q.type);
  }
}

/* Variedade no simulado: com banco pequeno, cada tentativa repete quase
   tudo e vira decoreba. Exige pelo menos 1,5 questão por vaga. */
for(const e of EXAMS.filter(x=>x.status==="active")){
  const n=QUESTIONS.filter(q=>q.exam===e.id).length;
  ok(n>=Math.ceil(e.simQ*1.5),e.code+": "+n+" questões para simulado de "+e.simQ+" (mínimo "+Math.ceil(e.simQ*1.5)+")");
  for(const d of e.domains){
    const nd=QUESTIONS.filter(q=>q.exam===e.id&&q.dom===d.id).length;
    const vagas=Math.round(e.simQ*(parseFloat(d.w)||25)/e.domains.reduce((a,x)=>a+(parseFloat(x.w)||25),0));
    ok(nd>=vagas+2,e.code+" / "+d.name+": "+nd+" questões para "+vagas+" vagas no simulado");
  }
}

console.log("Questões verificadas: "+QUESTIONS.length);
if(f){ console.log(f+" falha(s) na estrutura das questões"); process.exit(1); }
console.log("Estrutura das questões OK");
