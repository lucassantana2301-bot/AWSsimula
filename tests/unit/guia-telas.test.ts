/**
 * Telas do guia (src/features/guia/telas.ts), portado de tests/test-guia.js.
 * A integridade dos dados (categorias, ids, colunas dos duelos) já é coberta
 * pelo schema em content.test.ts; aqui ficam o treino e o render.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Duelo, Servico } from "../../src/content/schema";
import { acaoDoGuia, ligarGuia, montarTreino, telaDoGuia, type Rota } from "../../src/features/guia/telas";

const raiz = join(__dirname, "..", "..", "content", "guia");
const GUIA = JSON.parse(readFileSync(join(raiz, "servicos.json"), "utf8")) as Servico[];
const DUELOS = JSON.parse(readFileSync(join(raiz, "duelos.json"), "utf8")) as Duelo[];

let rota: Rota = { name: "guia" };
const lidos: Record<string, number> = {};
const xp: number[] = [];
const idas: string[] = [];

beforeAll(() => {
  ligarGuia(
    {
      rota: () => rota,
      ir: (tela, o) => {
        idas.push(tela);
        rota = { name: tela, ...o };
      },
      render: () => undefined,
      salvar: () => undefined,
      ganharXp: (n) => xp.push(n),
      aviso: () => undefined,
      lidos: () => lidos,
      emSessaoDeEstudo: () => false,
    },
    { GUIA, DUELOS },
  );
});

const sujo = (h: string): boolean => /undefined|NaN|\[object Object\]/.test(h);
const servico = (id: string): Servico | undefined => GUIA.find((s) => s.id === id);

describe("guia: telas", () => {
  it("lista do guia renderiza limpa", () => {
    rota = { name: "guia" };
    const h = telaDoGuia("guia").texto;
    expect(sujo(h)).toBe(false);
    expect(h).toContain(`${String(DUELOS.length)} comparações`);
  });

  it("todas as páginas de serviço renderizam com o nome e marcam como lido", () => {
    const ruins: string[] = [];
    for (const s of GUIA) {
      rota = { name: "serv", id: s.id };
      const h = telaDoGuia("serv").texto;
      if (sujo(h) || !h.includes(s.nome.replace(/&/g, "&amp;"))) ruins.push(s.id);
    }
    expect(ruins).toEqual([]);
    expect(Object.keys(lidos)).toHaveLength(GUIA.length);
  });

  it("todos os duelos renderizam, com acerto e erro marcados", () => {
    const ruins: string[] = [];
    for (const d of DUELOS) {
      const r0 = d.sinais[0]?.r ?? 0;
      const r1 = ((d.sinais[1]?.r ?? 0) + 1) % d.cols.length;
      rota = { name: "duelo", id: d.id, dres: { 0: r0, 1: r1 } };
      const h = telaDoGuia("duelo").texto;
      if (sujo(h) || !h.includes('data-res="ok"') || !h.includes('data-res="no"')) ruins.push(d.id);
    }
    expect(ruins).toEqual([]);
  });

  it("treino: 20 rodadas, sempre uma resposta certa entre opções distintas e só serviço ativo", () => {
    const ativos = GUIA.filter((s) => s.status === "ativo").length;
    for (let k = 0; k < 20; k++)
      for (const q of montarTreino(10)) {
        if (q.rot) {
          expect(q.certoK).toBeGreaterThanOrEqual(0);
          expect(q.certoK).toBeLessThan(q.rot.length);
          continue;
        }
        expect(q.ops).toHaveLength(Math.min(4, ativos));
        expect(new Set(q.ops).size).toBe(q.ops.length);
        expect(q.ops).toContain(q.certo);
        expect(servico(q.certo)?.status).toBe("ativo");
      }
  });

  it("tela do treino renderiza antes e depois de responder", () => {
    rota = { name: "gq", gq2: { list: montarTreino(5), i: 0, ok: 0, erros: [] } };
    expect(sujo(telaDoGuia("gq").texto)).toBe(false);
    const botao = { dataset: { k: "0" } } as unknown as HTMLElement;
    expect(acaoDoGuia("gq-pick", botao)).toBe(true);
    const h = telaDoGuia("gq").texto;
    expect(sujo(h)).toBe(false);
    expect(h).toContain('data-act="gq-next"');
  });

  it("dados do guia não carregam marcação HTML (o escape é a segunda barreira)", () => {
    expect(GUIA.some((s) => /<[a-z]/i.test(JSON.stringify(s)))).toBe(false);
  });

  it("ação desconhecida não é do guia; gserv vindo do estudo lembra a origem", () => {
    expect(acaoDoGuia("home", {} as HTMLElement)).toBe(false);
    rota = { name: "study" };
    acaoDoGuia("gserv", { dataset: { id: "s3" } } as unknown as HTMLElement);
    expect(rota).toMatchObject({ name: "serv", id: "s3", from: "study" });
  });
});
