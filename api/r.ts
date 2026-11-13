/**
 * GET /api/r?e=saa&s=812&d=2026-11-12
 * Página pública do resultado com tags Open Graph (pré-visualização no
 * LinkedIn). Parâmetro inválido volta para a home, sem página de erro.
 */
import { lerResultado, paginaResultado } from "../src/features/compartilhar/resultado";

export function GET(req: Request): Response {
  const url = new URL(req.url);
  const r = lerResultado(url.searchParams);
  if (!r) return Response.redirect(`${url.origin}/`, 302);
  /* URL canônica: só os parâmetros conhecidos, na ordem certa */
  const canonica = new URL(`${url.origin}/api/r`);
  canonica.search = new URLSearchParams({ e: r.exam, s: String(r.score), d: r.data }).toString();
  return new Response(paginaResultado(r, url.origin, canonica.toString()), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
