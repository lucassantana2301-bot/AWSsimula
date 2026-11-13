/* Monta build/all.js para as suítes legadas em Node (tests/test-*.js):
   conteúdo de content/*.json + motor legado, na mesma ordem de src/content/bundle.ts.
   Temporário: some quando essas suítes migrarem para Vitest (ADR-0001, fase 3). */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const j = (rel) => JSON.parse(readFileSync(join(ROOT, "content", rel), "utf8"));
const exams = j("exams.json");
const ordem = exams.map((e) => e.id);
const presentes = readdirSync(join(ROOT, "content", "exams")).sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b));
const juntar = (arq) => presentes.flatMap((ex) => j(`exams/${ex}/${arq}.json`));
const C = {
  EXAMS: exams,
  QUESTIONS: juntar("questions"),
  FICHAS: juntar("fichas"),
  LESSONS: [...juntar("lessons"), ...j("shared/lessons.json")],
  DECKS: juntar("decks"),
  DIAGRAMS: j("diagrams.json"),
  EQUIV: j("equiv.json"),
  GUIA: j("guia/servicos.json"),
  DUELOS: j("guia/duelos.json"),
  catalogo: j("catalogo.json"),
};
/* módulos tipados que o motor usa: o mesmo código da produção, empacotado */
const { outputFiles } = await build({
  entryPoints: [join(ROOT, "scripts", "entrada-testes.mjs")],
  bundle: true,
  write: false,
  format: "iife",
  target: "es2022",
  platform: "browser",
  logLevel: "error",
});
const servicos = (outputFiles[0]?.text ?? "") + "\n";
const motor = readFileSync(join(ROOT, "src", "legacy", "engine.js"), "utf8");
mkdirSync(join(ROOT, "build"), { recursive: true });
writeFileSync(join(ROOT, "build", "all.js"), `globalThis.__CQ_CONTENT = ${JSON.stringify(C)};\n${servicos}${motor}`);
console.log(`build/all.js: ${C.QUESTIONS.length} questões, ${C.FICHAS.length} fichas, ${C.GUIA.length} serviços`);

/* build/test.html: a página com o motor embutido, para as suítes em JSDOM */
const pagina = readFileSync(join(ROOT, "index.html"), "utf8");
const tag = '<script type="module" src="/src/main.ts"></script>';
if (!pagina.includes(tag)) throw new Error("index.html sem a tag de entrada esperada");
const script = readFileSync(join(ROOT, "build", "all.js"), "utf8");
if (/<\/script/i.test(script)) throw new Error("conteúdo contém </script");
writeFileSync(
  join(ROOT, "build", "test.html"),
  pagina.replace(tag, () => `<script>\n${script}\n</script>`) /* função: "$&" no código não vira padrão de substituição */,
);
