/* Auditoria de QA, item 1: abrir o app com progresso ilegível.
   O app pode recomeçar, mas o que estava salvo precisa sobreviver como cópia,
   e a pessoa precisa ser avisada. */
const { JSDOM, VirtualConsole } = require("jsdom");
const fs = require("fs"), path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "build", "test.html"), "utf8");
const errs = [];

function abrir(salvo) {
  const js = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => js.push("JS ERROR: " + e.message));
  const dom = new JSDOM(html, {
    runScripts: "dangerously", pretendToBeVisual: true, url: "https://ex.test/", virtualConsole: vc,
    beforeParse(w) { w.scrollTo = () => {}; if (salvo !== null) w.localStorage.setItem("cloudquest.v2", salvo); },
  });
  return { w: dom.window, js };
}
const copias = w => Object.keys(w.localStorage).filter(k => k.startsWith("cloudquest.backup."));

const ruins = [];
let bomW = null;
for (const [nome, salvo] of [["JSON quebrado", '{"v":2,"xp":51'], ["versão antiga", '{"v":1,"xp":9000,"sims":[1,2,3]}']]) {
  const { w, js } = abrir(salvo);
  const c = copias(w);
  if (c.length !== 1) errs.push(`FALHOU (${nome}): esperava 1 cópia, achei ${c.length}`);
  else if (w.localStorage.getItem(c[0]) !== salvo) errs.push(`FALHOU (${nome}): a cópia não é o conteúdo original`);
  /* qualquer ação que salva não pode apagar a cópia */
  const goal = w.document.querySelector('[data-act="goal"]') || w.document.querySelector("[data-act]");
  if (goal) goal.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  if (copias(w).length !== 1 || w.localStorage.getItem(copias(w)[0]) !== salvo) errs.push(`FALHOU (${nome}): a cópia sumiu depois de salvar`);
  errs.push(...js);
  ruins.push([nome, w]);
}

/* progresso bom: nenhuma cópia, estado preservado */
{
  const bom = JSON.stringify({ v: 2, xp: 345, sims: [], seen: {} });
  const { w, js } = abrir(bom);
  if (copias(w).length) errs.push("FALHOU: progresso válido gerou cópia à toa");
  bomW = w;
  errs.push(...js);
}

const avisos = w => (w.document.getElementById("toasts") || { textContent: "" }).textContent;
setTimeout(() => {
  for (const [nome, w] of ruins) if (!avisos(w).includes("Não consegui ler o progresso salvo")) errs.push(`FALHOU (${nome}): a pessoa não foi avisada`);
  if (bomW && avisos(bomW).includes("Não consegui ler")) errs.push("FALHOU: aviso de leitura com progresso válido");
  if (errs.length) { console.log(errs.join("\n")); console.log("\n*** " + errs.length + " PROBLEMA(S) ***"); process.exit(1); }
  console.log("*** LEITURA SEGURA: OK ***"); process.exit(0);
}, 600);
