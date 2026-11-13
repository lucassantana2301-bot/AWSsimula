/* Migração única (ADR-0001, fase 1): separa o HTML monolítico em
   index.html + src/styles/app.css + src/legacy/engine.js (módulo ES).
   O motor continua igual; só deixa de definir o conteúdo e passa a recebê-lo
   de src/main.ts, que lê content/*.json. Uso: node scripts/migrate/make-legacy.mjs */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const src = (n) => readFileSync(join(ROOT, "src", n), "utf8");
const grava = (rel, txt) => { mkdirSync(dirname(join(ROOT, rel)), { recursive: true }); writeFileSync(join(ROOT, rel), txt); };

/* ---------- HTML e CSS ---------- */
const p1 = src("p1.html");
const iStyle = p1.indexOf("<style>"), fStyle = p1.indexOf("</style>");
const iBody = p1.indexOf("<body>"), iScript = p1.lastIndexOf("<script>");
if (iStyle < 0 || fStyle < 0 || iBody < 0 || iScript < iBody) throw new Error("p1.html fora do formato esperado");
const cabeca = p1.slice(0, iStyle).trimEnd();
const corpo = p1.slice(iBody, iScript).trimEnd();
grava("src/styles/app.css", p1.slice(iStyle + 7, fStyle).trim() + "\n");
grava("index.html", `${cabeca}
</head>
${corpo}
<script type="module" src="/src/main.ts"></script>
</body>
</html>
`);

/* ---------- motor legado ---------- */
let motor = src("p5-engine.js");
const pushes = /^QUESTIONS\.push\(\.\.\.QUESTIONS_(EXTRA|104|SAA)\);\n/gm;
if ((motor.match(pushes) || []).length !== 3) throw new Error("esperava 3 QUESTIONS.push no motor");
motor = motor.replace(pushes, "");
const prologo = `/* ============================================================
   MOTOR LEGADO (ADR-0001)
   Código do app anterior à reengenharia, empacotado como módulo.
   Recebe o conteúdo pronto de src/main.ts (content/*.json validado por
   schema) em vez de defini-lo. Cada funcionalidade sai daqui para
   src/features/* na fase 3; não acrescente código novo neste arquivo.
   ============================================================ */
/* eslint-disable */
// @ts-nocheck
const C = globalThis.__CQ_CONTENT;
if (!C) throw new Error("conteúdo não carregado antes do motor");
const { QUESTIONS, FICHAS, LESSONS, DIAGRAMS, EQUIV, EXAMS, DECKS, GUIA, DUELOS } = C;
const CATALOGO = C.catalogo.certs, CATALOG_SYNCED = C.catalogo.synced, METAS = C.catalogo.metas, PROVIDERS = C.catalogo.providers;
const FICHAS_AZ = FICHAS.filter((f) => f.exam === "az900");
const FICHAS_AWS = FICHAS.filter((f) => f.exam === "clf");
`;
grava("src/legacy/engine.js", [prologo, src("p5a-guia.js"), src("p8-motion.js"), motor].join("\n"));
console.log("index.html, src/styles/app.css e src/legacy/engine.js gerados");
