/**
 * GET /api/og?e=saa&s=812&d=2026-11-12
 * Imagem 1200×630 do resultado (Open Graph): satori monta o SVG a partir da
 * árvore de elementos e o resvg converte para PNG. Fonte DejaVu Sans
 * (licença em api/_fontes/LICENCA-DejaVu.txt), lida uma vez por instância.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { cartaoResultado, lerResultado } from "../src/features/compartilhar/resultado";

/* raiz do projeto: funciona compilado para CommonJS (Vercel) e nos testes; os
   arquivos vão junto com a função por "includeFiles" no vercel.json */
const PASTA_FONTES = join(process.cwd(), "api", "_fontes");

let fontes: { name: string; data: Buffer; weight: 400 | 700; style: "normal" }[] | null = null;
function carregarFontes(): NonNullable<typeof fontes> {
  fontes ??= [
    { name: "DejaVu Sans", data: readFileSync(join(PASTA_FONTES, "DejaVuSans.ttf")), weight: 400, style: "normal" },
    { name: "DejaVu Sans", data: readFileSync(join(PASTA_FONTES, "DejaVuSans-Bold.ttf")), weight: 700, style: "normal" },
  ];
  return fontes;
}

export async function gerarPng(params: URLSearchParams): Promise<Buffer | null> {
  const r = lerResultado(params);
  if (!r) return null;
  const svg = await satori(cartaoResultado(r), { width: 1200, height: 630, fonts: carregarFontes() });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

export async function GET(req: Request): Promise<Response> {
  const png = await gerarPng(new URL(req.url).searchParams);
  if (!png) return new Response("Parâmetros inválidos", { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(new Blob([new Uint8Array(png)], { type: "image/png" }), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" },
  });
}
