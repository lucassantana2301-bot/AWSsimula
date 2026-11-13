/**
 * Qualidade do banco de questões (auditoria de QA, itens 18, 19 e 21).
 * O schema garante a forma; estes testes pegam o que deixa a questão fácil de
 * "chutar" ou repetida, e o que torna a explicação inútil.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

interface Opcao {
  k: string;
  t: string;
}
interface Q {
  id: string;
  exam: string;
  type: string;
  stem: string;
  case?: string;
  rev?: string;
  opts?: Opcao[];
  ans?: string[];
  why?: Record<string, string>;
  rows?: { t: string }[];
  items?: { t: string }[];
}
const EXAMES = ["az900", "az104", "saa", "clf"];
const banco: Q[] = EXAMES.flatMap((e) => JSON.parse(readFileSync(join("content", "exams", e, "questions.json"), "utf8")) as Q[]);
const escolhas = banco.filter((q) => (q.type === "single" || q.type === "multi") && q.opts && q.ans && q.why);

describe("linter de questões (item 18)", () => {
  it("nenhuma alternativa do tipo 'todas/nenhuma das anteriores'", () => {
    const ruins = escolhas.filter((q) => q.opts?.some((o) => /(todas|nenhuma) (as|das) (anteriores|alternativas)/i.test(o.t)));
    expect(ruins.map((q) => q.id)).toEqual([]);
  });
  it("explicação da certa com pelo menos 60 caracteres e de cada errada com pelo menos 25", () => {
    const curtas: string[] = [];
    for (const q of escolhas)
      for (const [k, v] of Object.entries(q.why ?? {})) if (v.length < (k === "ok" ? 60 : 25)) curtas.push(`${q.id}/${k}`);
    expect(curtas).toEqual([]);
  });
  it("a explicação da certa não repete só o texto da alternativa", () => {
    const ecos = escolhas.filter((q) => {
      const certa =
        q.opts
          ?.find((o) => q.ans?.includes(o.k))
          ?.t.trim()
          .toLowerCase() ?? "";
      return (q.why?.["ok"] ?? "").trim().toLowerCase() === certa;
    });
    expect(ecos.map((q) => q.id)).toEqual([]);
  });
  it.each(EXAMES)("%s: a certa não é a alternativa estritamente mais longa em mais de 45%% das questões", (ex) => {
    const simples = escolhas.filter((q) => q.exam === ex && q.type === "single");
    const longas = simples.filter((q) => {
      const certa = q.opts?.find((o) => q.ans?.includes(o.k));
      const outras = (q.opts ?? []).filter((o) => o !== certa).map((o) => o.t.length);
      return (certa?.t.length ?? 0) > Math.max(...outras);
    });
    /* acima disso o aluno aprende a "chutar a maior" e o simulado mede o truque */
    expect(longas.length / simples.length).toBeLessThanOrEqual(0.45);
  });
});

/* trigramas de caracteres: pega a mesma questão reescrita com outras palavras na ponta */
function trigramas(s: string): Set<string> {
  const n = s
    .toLowerCase()
    .replace(/[^a-zà-ú0-9 ]/g, "")
    .replace(/\s+/g, " ");
  const t = new Set<string>();
  for (let i = 0; i < n.length - 2; i++) t.add(n.slice(i, i + 3));
  return t;
}
function jaccard(a: Set<string>, b: Set<string>): number {
  let i = 0;
  for (const x of a) if (b.has(x)) i++;
  return i / (a.size + b.size - i);
}
const textoInteiro = (q: Q): string =>
  [q.case ?? "", q.stem, ...(q.opts ?? []).map((o) => o.t), ...(q.rows ?? []).map((r) => r.t), ...(q.items ?? []).map((r) => r.t)].join(
    " ",
  );

describe("duplicatas (item 21)", () => {
  it("nenhum par de questões da mesma prova com 50% ou mais de semelhança", () => {
    const t = banco.map((q) => ({ q, g: trigramas(textoInteiro(q)) }));
    const pares: string[] = [];
    for (let i = 0; i < t.length; i++)
      for (let j = i + 1; j < t.length; j++) {
        const a = t[i];
        const b = t[j];
        if (!a || !b || a.q.exam !== b.q.exam) continue;
        const v = jaccard(a.g, b.g);
        if (v >= 0.5) pares.push(`${a.q.id} × ${b.q.id} (${v.toFixed(2)})`);
      }
    expect(pares).toEqual([]);
  });
  it("o detector pega uma cópia levemente reescrita", () => {
    const a =
      "Servidores no escritório, ligados por VPN, precisam acessar a conta de armazenamento por endereço privado. O que configurar?";
    const b =
      "Servidores do escritório, conectados por VPN, precisam acessar uma conta de armazenamento por endereço privado. O que você configura?";
    expect(jaccard(trigramas(a), trigramas(b))).toBeGreaterThan(0.5);
  });
});

describe("data de revisão (item 19)", () => {
  it("rev, quando existe, é uma data real e não está no futuro", () => {
    const amanha = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
    const ruins = banco.filter((q) => q.rev !== undefined && (Number.isNaN(Date.parse(q.rev)) || q.rev > amanha));
    expect(ruins.map((q) => q.id)).toEqual([]);
  });
});
