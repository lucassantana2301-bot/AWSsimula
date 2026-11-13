/**
 * Servidor das rotas /api fora do Vercel (Docker e Kubernetes, ADR-0003).
 * Reaproveita os mesmos handlers de api/*.ts: o contêiner e o Vercel rodam
 * exatamente o mesmo código de página e de imagem.
 *
 * Decisões:
 * - a origem pública vem de PUBLIC_ORIGIN, nunca do cabeçalho Host: Host é
 *   controlado pelo cliente e iria parar nas tags Open Graph e no redirect
 *   (envenenamento de cache e redirecionamento aberto);
 * - só GET e HEAD; o resto recebe 405;
 * - SIGTERM fecha o servidor e espera as requisições em andamento, como o
 *   Kubernetes espera ao trocar um pod;
 * - erro inesperado vira 500 sem pilha no corpo (a pilha vai para o log).
 */
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { GET as imagemResultado } from "../api/og";
import { GET as paginaResultado } from "../api/r";

type Handler = (req: Request) => Response | Promise<Response>;

export const ROTAS: Readonly<Record<string, Handler>> = {
  "/api/r": paginaResultado,
  "/api/og": imagemResultado,
};

/** Valida PUBLIC_ORIGIN: só http(s), sem caminho. Sem valor, usa o endereço local. */
export function origemPublica(valor: string | undefined): string {
  const u = new URL(valor?.trim() || "http://localhost:8080");
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error(`PUBLIC_ORIGIN precisa ser http(s): ${u.protocol}`);
  return u.origin;
}

/** Resolve uma requisição já separada em método e caminho. Pura o bastante para testar sem rede. */
export async function responder(metodo: string, caminho: string, origem: string): Promise<Response> {
  if (metodo !== "GET" && metodo !== "HEAD")
    return new Response("Método não permitido", {
      status: 405,
      headers: { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" },
    });
  /* caminho vem do cliente: a base fixa impede que um caminho absoluto troque a origem */
  const url = new URL(caminho.startsWith("/") ? caminho : "/", origem);
  if (url.origin !== origem) return new Response("Requisição inválida", { status: 400 });
  if (url.pathname === "/healthz")
    return new Response("ok", { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  const handler = ROTAS[url.pathname];
  if (!handler) return new Response("Não encontrado", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return handler(new Request(url, { method: "GET" }));
}

async function escrever(res: ServerResponse, resposta: Response, cabeca: boolean): Promise<void> {
  const corpo = cabeca ? null : Buffer.from(await resposta.arrayBuffer());
  const cabecalhos: Record<string, string> = {};
  resposta.headers.forEach((v, k) => (cabecalhos[k] = v));
  if (corpo) cabecalhos["content-length"] = String(corpo.byteLength);
  res.writeHead(resposta.status, cabecalhos);
  res.end(corpo ?? undefined);
}

export function criarServidor(origem: string): Server {
  const servidor = createServer((req: IncomingMessage, res: ServerResponse) => {
    const inicio = performance.now();
    const metodo = req.method ?? "GET";
    responder(metodo, req.url ?? "/", origem)
      .then((r) => escrever(res, r, metodo === "HEAD"))
      .catch((e: unknown) => {
        console.error(
          JSON.stringify({
            nivel: "erro",
            msg: e instanceof Error ? e.message : String(e),
            pilha: e instanceof Error ? e.stack : undefined,
          }),
        );
        if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Erro interno");
      })
      .finally(() => {
        /* sem query string no log: ela traz nota e data do aluno */
        const caminho = (req.url ?? "/").split("?")[0];
        if (caminho !== "/healthz")
          console.log(JSON.stringify({ metodo, caminho, status: res.statusCode, ms: Math.round(performance.now() - inicio) }));
      });
  });
  /* teto para cliente lento não segurar conexão (slowloris) */
  servidor.requestTimeout = 15_000;
  servidor.headersTimeout = 10_000;
  servidor.keepAliveTimeout = 5_000;
  return servidor;
}

/* executado como programa (no contêiner), não quando importado pelos testes */
if (process.argv[1] && /server\.(m?js|ts)$/.test(process.argv[1])) {
  const porta = Number(process.env["PORT"] ?? 3000);
  const origem = origemPublica(process.env["PUBLIC_ORIGIN"]);
  const servidor = criarServidor(origem);
  servidor.listen(porta, () => {
    console.log(JSON.stringify({ nivel: "info", msg: "api no ar", porta, origem }));
  });
  const parar = (sinal: string): void => {
    console.log(JSON.stringify({ nivel: "info", msg: "encerrando", sinal }));
    servidor.close(() => process.exit(0));
    servidor.closeIdleConnections();
    /* se algo travar, não segura o pod além do prazo do Kubernetes */
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once("SIGTERM", () => {
    parar("SIGTERM");
  });
  process.once("SIGINT", () => {
    parar("SIGINT");
  });
}
