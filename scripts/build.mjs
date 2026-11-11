/* Junta as partes de src/ em um único HTML estático.
   dist/index.html é o que vai para o ar; build/all.js é o mesmo
   script isolado, usado pelos testes de lógica em Node. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");

/* A ordem importa: dados antes de quem os estende, e o motor por último,
   porque ele executa load() e o primeiro render ao final do arquivo. */
const PARTES = [
  "p2-catalog.js",
  "p3a-fichas-az.js", "p3b-fichas-aws.js", "p3c-fichas-az104.js", "p3d-fichas-az104b.js",
  "p3e-fichas-saa.js", "p3f-fichas-saa-b.js",
  "p4-questions.js", "p4b-questions-az.js", "p4c-questions-aws.js",
  "p4d-questions-az104.js", "p4e-questions-az104b.js",
  "p4f-questions-saa.js", "p4g-questions-saa-b.js",
  "p4h-questions-az104c.js", "p4i-questions-saa-c.js",
  "p6-decks.js", "p2b-catalog-az104.js", "p2c-catalog-saa.js",
  "p7-catalogo.js", "p8-motion.js", "p5-engine.js"
];

function ler(nome) {
  const caminho = join(SRC, nome);
  if (!existsSync(caminho)) throw new Error(`Parte ausente em src/: ${nome}`);
  return readFileSync(caminho, "utf8");
}

const cabeca = ler("p1.html");
/* p1.html abre o <script> principal e não o fecha: quem fecha é este build. */
if (cabeca.toLowerCase().lastIndexOf("<script") <= cabeca.toLowerCase().lastIndexOf("</script")) {
  throw new Error("src/p1.html precisa terminar com o <script> principal aberto: o build fecha a tag no final.");
}

const script = PARTES.map(ler).join("\n");
/* Um "</script" dentro do conteúdo encerraria o bloco antes da hora. */
if (/<\/script/i.test(script)) throw new Error("Conteúdo contém </script>, o que quebraria a página.");

const html = cabeca + script + "\n</script>\n</body>\n</html>\n";

mkdirSync(join(ROOT, "dist"), { recursive: true });
mkdirSync(join(ROOT, "build"), { recursive: true });
writeFileSync(join(ROOT, "dist", "index.html"), html);
writeFileSync(join(ROOT, "build", "all.js"), script + "\n");

/* Erro de sintaxe tem de falhar o build aqui, não no navegador de quem estuda. */
try {
  execFileSync(process.execPath, ["--check", join(ROOT, "build", "all.js")], { stdio: "pipe" });
} catch (e) {
  console.error(String(e.stderr || e.message));
  throw new Error("build/all.js não passou no node --check");
}

const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`dist/index.html ${kb} KB, ${PARTES.length} partes`);
