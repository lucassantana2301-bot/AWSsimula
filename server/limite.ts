/**
 * Limite de taxa por cliente (balde de fichas), em memória (auditoria de QA, item 27).
 *
 * Onde vale:
 * - contêiner (server/api.ts): por IP do socket; com 2 réplicas, o limite efetivo é o dobro;
 * - Vercel (api/og.ts): por instância da função, pelo IP que o Vercel informa. É uma barreira
 *   barata contra um único cliente em laço, não um WAF: o grosso da proteção do /api/og é a URL
 *   canônica com cache de 7 dias na CDN, que faz a imagem ser gerada uma vez por combinação.
 *
 * A memória é limitada: no máximo `maxClientes` baldes; o mais antigo sai primeiro (Map mantém
 * a ordem de inserção, e cada acesso reinsere a chave no fim).
 */
export interface OpcoesLimite {
  /** Fichas no balde cheio (rajada permitida). */
  capacidade: number;
  /** Fichas repostas por segundo. */
  porSegundo: number;
  /** Teto de clientes acompanhados ao mesmo tempo. */
  maxClientes?: number;
}

export interface Veredito {
  permitido: boolean;
  /** Segundos até haver uma ficha, para o cabeçalho Retry-After (≥ 1 quando negado). */
  esperar: number;
  restantes: number;
}

interface Balde {
  fichas: number;
  em: number;
}

export function criarLimite(op: OpcoesLimite, agora: () => number = Date.now): (cliente: string) => Veredito {
  if (!(op.capacidade >= 1) || !(op.porSegundo > 0)) throw new RangeError("limite: capacidade ≥ 1 e porSegundo > 0");
  const max = op.maxClientes ?? 10_000;
  const baldes = new Map<string, Balde>();
  return (cliente: string): Veredito => {
    const t = agora();
    const chave = cliente || "desconhecido";
    const b = baldes.get(chave) ?? { fichas: op.capacidade, em: t };
    baldes.delete(chave);
    /* relógio voltando (NTP) não dá fichas negativas nem infinitas */
    const passou = Math.max(0, t - b.em) / 1000;
    b.fichas = Math.min(op.capacidade, b.fichas + passou * op.porSegundo);
    b.em = t;
    let permitido = false;
    if (b.fichas >= 1) {
      b.fichas -= 1;
      permitido = true;
    }
    baldes.set(chave, b);
    if (baldes.size > max) {
      const maisAntigo = baldes.keys().next().value;
      if (maisAntigo !== undefined) baldes.delete(maisAntigo);
    }
    return {
      permitido,
      /* tolerância: (1 − 2/3) / (1/3) dá 1,0000000000000002 e o ceil viraria 2 */
      esperar: permitido ? 0 : Math.max(1, Math.ceil((1 - b.fichas) / op.porSegundo - 1e-9)),
      restantes: Math.floor(b.fichas),
    };
  };
}

/**
 * IP do cliente atrás de um proxy confiável. Só o primeiro valor de x-forwarded-for, e só quando
 * quem chama declara que há um proxy na frente (Vercel); senão o cabeçalho é do cliente e
 * qualquer um trocaria de "IP" a cada requisição.
 */
export function ipDoCliente(cabecalhos: Headers, socket: string | undefined, atrasDeProxy: boolean): string {
  if (atrasDeProxy) {
    const real = cabecalhos.get("x-real-ip")?.trim();
    if (real) return real;
    const fwd = cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (fwd) return fwd;
  }
  return socket ?? "desconhecido";
}

export function respostaLimite(v: Veredito): Response {
  return new Response("Muitas requisições. Tente de novo em instantes.", {
    status: 429,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": String(v.esperar), "Cache-Control": "no-store" },
  });
}
