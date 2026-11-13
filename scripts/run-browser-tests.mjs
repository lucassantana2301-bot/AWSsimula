/* Sobe o build (vite preview) e roda os testes de navegador contra ele.
   Módulos ES não carregam por file://, então os testes precisam de HTTP. */
import { spawn } from "node:child_process";
import { setTimeout as espera } from "node:timers/promises";

const PORTA = 4173,
  URL = `http://localhost:${PORTA}/`;
const servidor = spawn("npx", ["vite", "preview", "--port", String(PORTA), "--strictPort"], { stdio: "ignore" });
const encerra = () => {
  try {
    servidor.kill("SIGTERM");
  } catch {
    /* já saiu */
  }
};
process.on("exit", encerra);

let pronto = false;
for (let i = 0; i < 60 && !pronto; i++) {
  try {
    pronto = (await fetch(URL)).ok;
  } catch {
    await espera(250);
  }
}
if (!pronto) {
  console.error("vite preview não subiu em 15 s");
  process.exit(1);
}

const testes = process.argv.slice(2);
let falhou = false;
for (const t of testes) {
  const code = await new Promise((ok) =>
    spawn(process.execPath, [t], { stdio: "inherit", env: { ...process.env, CQ_URL: URL } }).on("exit", ok),
  );
  if (code !== 0) {
    falhou = true;
    console.error(`FALHOU: ${t}`);
  }
}
encerra();
process.exit(falhou ? 1 : 0);
