/**
 * Descobre quais serviços do guia uma questão cita, para ligar o erro ao
 * estudo ("você errou: veja S3 e EFS no guia").
 *
 * Usa só id e nome (content/guia/indice.json, ~3 KB, no pacote inicial):
 * o guia completo é baixado sob demanda e não está disponível aqui.
 *
 * Regras para evitar falso positivo em texto em português:
 * - comparação sensível a maiúsculas ("Config" ≠ "configuração");
 * - limite de palavra nas duas pontas;
 * - nomes genéricos ("Batch", "Glue", "Shield") só valem com o prefixo
 *   "AWS"/"Amazon";
 * - o trecho mais longo vence ("S3 Glacier" não conta também como "S3").
 */

export interface EntradaIndice {
  id: string;
  nome: string;
}

const PREFIXO = /^(Amazon|AWS)\s+/;
/* rótulos descritivos do guia que não aparecem no enunciado */
const ROTULO = /^(Classes|Família)\s+/;
/* palavras comuns demais para valer sem "AWS"/"Amazon" na frente */
const GENERICOS = new Set([
  "Backup",
  "Batch",
  "Config",
  "Shield",
  "Artifact",
  "Inspector",
  "Detective",
  "Glue",
  "Budgets",
  "Translate",
  "Personalize",
  "Amplify",
  "Connect",
  "Connect Customer",
  "Marketplace",
  "Health Dashboard",
  "Quick",
  "Organizations",
  "Lex",
  "Polly",
  "Comprehend",
  "Transcribe",
  "Backup",
  "Neptune",
  "Keyspaces",
]);

/** Variantes de nome que identificam o serviço no texto. */
export function chavesDe(nome: string): string[] {
  const chaves = new Set<string>();
  const parenteses = [...nome.matchAll(/\(([^)]+)\)/g)].map((m) => m[1] ?? "");
  const semParenteses = nome.replace(/\s*\([^)]*\)/g, "").trim();
  chaves.add(semParenteses);
  for (const parte of semParenteses.split(/,\s*|\s+e\s+/)) {
    const p = parte.trim().replace(ROTULO, "");
    if (!p) continue;
    chaves.add(p);
    const curto = p.replace(PREFIXO, "");
    if (curto !== p && !GENERICOS.has(curto)) chaves.add(curto);
  }
  /* "(ALB, NLB, GWLB)" são siglas úteis; "(antigo QuickSight)" é nome antigo */
  for (const dentro of parenteses)
    for (const s of dentro.replace(/^antigo\s+/i, "").split(/,\s*/)) if (/^[A-Z][A-Za-z0-9 ]{1,40}$/.test(s.trim())) chaves.add(s.trim());
  return [...chaves].filter((c) => c.length >= 2 && !GENERICOS.has(c));
}

const escRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export interface Indice {
  /** chaves já ordenadas da mais longa para a mais curta */
  chaves: readonly { chave: RegExp; id: string; tam: number }[];
}

export function montarIndice(entradas: readonly EntradaIndice[]): Indice {
  const chaves = entradas.flatMap((e) =>
    chavesDe(e.nome).map((c) => ({
      chave: new RegExp(`(?<![\\p{L}\\p{N}])${escRegex(c)}(?![\\p{L}\\p{N}])`, "gu"),
      id: e.id,
      tam: c.length,
    })),
  );
  chaves.sort((a, b) => b.tam - a.tam);
  return { chaves };
}

/**
 * Ids dos serviços citados, na ordem em que aparecem. Textos anteriores têm
 * prioridade (passe a explicação da resposta certa antes do enunciado).
 */
export function servicosCitados(textos: readonly string[], indice: Indice, max = 3): string[] {
  const achados: { id: string; pos: number }[] = [];
  let deslocamento = 0;
  for (const texto of textos) {
    const ocupado = new Array<boolean>(texto.length).fill(false);
    for (const { chave, id } of indice.chaves) {
      chave.lastIndex = 0;
      for (const m of texto.matchAll(chave)) {
        const ini = m.index;
        const fim = ini + m[0].length;
        if (ocupado.slice(ini, fim).some(Boolean)) continue;
        ocupado.fill(true, ini, fim);
        achados.push({ id, pos: deslocamento + ini });
      }
    }
    deslocamento += texto.length + 1;
  }
  achados.sort((a, b) => a.pos - b.pos);
  const ids: string[] = [];
  for (const a of achados) if (!ids.includes(a.id)) ids.push(a.id);
  return ids.slice(0, max);
}
