/* todo braço do traço é feito só de segmentos retos e mede metade do perímetro */
const src=require("fs").readFileSync(__dirname+"/../src/legacy/engine.js","utf8");
const perimetro=eval("("+src.slice(src.indexOf("function perimetro"),src.indexOf("function chegada"))+")");
let ruim=0,casos=0;
for(const [w,h] of [[600,260],[120,40],[40,300],[300,300],[1180,96]]){
  const P=perimetro(w,h), meio=P.L/2;
  const fim=(a,b)=>Math.abs(a[0]-b[0])<.5&&Math.abs(a[1]-b[1])<.5;
  for(const s0 of [0,22,w/2,w-3,P.L-(h/2-1),P.L-5]){
    const cw=P.arco(s0,s0+meio), ccw=P.arco(s0-meio,s0).reverse();
    if(!fim(cw[cw.length-1],ccw[ccw.length-1])){ ruim++; console.log("braços não se encontram",w,h,s0); }
    if(!fim(cw[0],ccw[0])){ ruim++; console.log("braços não nascem no mesmo ponto",w,h,s0); }
    for(const pts of [cw,ccw]){ casos++; let comp=0;
      for(let i=1;i<pts.length;i++){ const [x0,y0]=pts[i-1],[x1,y1]=pts[i];
        if(Math.abs(x0-x1)>.01&&Math.abs(y0-y1)>.01){ ruim++; console.log("diagonal",w,h,s0); }
        comp+=Math.hypot(x1-x0,y1-y0); }
      if(Math.abs(comp-meio)>.5){ ruim++; console.log("comprimento",w,h,s0,comp.toFixed(1),meio); } }
  }
}
console.log(ruim?"*** "+ruim+" falha(s) no perímetro ***":"OK: "+casos+" braços retos, mesma origem, mesmo encontro, metade do perímetro cada");
process.exit(ruim?1:0);
