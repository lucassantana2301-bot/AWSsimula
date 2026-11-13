import { describe, expect, it } from "vitest";
import {
  CHAVE,
  LIMITE_IMPORT,
  MAX_BACKUPS,
  guardarBackup,
  interpretar,
  lerImportacao,
  listarBackups,
  pedirPersistencia,
  resumir,
  salvarEstado,
  validarEstado,
  type Armazem,
} from "../../src/features/progresso/armazenamento";

/** Storage em memória; `cota` em bytes simula o navegador cheio. */
function armazem(cota = Infinity): Armazem & { dados: Map<string, string> } {
  const dados = new Map<string, string>();
  const tamanho = (): number => [...dados].reduce((s, [k, v]) => s + k.length + v.length, 0);
  return {
    dados,
    getItem: (k) => dados.get(k) ?? null,
    setItem: (k, v) => {
      const antes = dados.get(k);
      dados.set(k, v);
      if (tamanho() > cota) {
        if (antes === undefined) dados.delete(k);
        else dados.set(k, antes);
        const e = new Error("cheio");
        e.name = "QuotaExceededError";
        throw e;
      }
    },
    removeItem: (k) => {
      dados.delete(k);
    },
    key: (i) => [...dados.keys()][i] ?? null,
    get length() {
      return dados.size;
    },
  };
}

const valido = {
  v: 2,
  xp: 120,
  streak: 3,
  seen: { "saa-d1-01": { ok: true } },
  sims: [{ exam: "saa", score: 812, pass: true, right: 24, total: 30, ts: 1 }],
  upd: 5,
};

describe("interpretar (o que o próprio app gravou)", () => {
  it("vazio não é problema", () => {
    expect(interpretar(null)).toEqual({ estado: null, problema: null });
    expect(interpretar("")).toEqual({ estado: null, problema: null });
  });
  it("JSON quebrado e versão antiga são problemas distintos", () => {
    expect(interpretar("{xp:").problema).toBe("corrompido");
    expect(interpretar("[1,2]").problema).toBe("corrompido");
    expect(interpretar('{"v":1,"xp":10}').problema).toBe("versao");
  });
  it("aceita estado do app mesmo com campo novo desconhecido", () => {
    const r = interpretar(JSON.stringify({ ...valido, campoFuturo: { a: 1 } }));
    expect(r.problema).toBeNull();
    expect(r.estado?.["xp"]).toBe(120);
  });
});

describe("item 9: progresso ilegível nunca some sem cópia", () => {
  it("guarda a cópia bruta antes de qualquer sobrescrita", () => {
    const a = armazem();
    const bruto = '{"v":1,"xp":9999,"sims":[]}';
    a.setItem(CHAVE, bruto);
    const leitura = interpretar(a.getItem(CHAVE));
    expect(leitura.problema).toBe("versao");
    const chave = guardarBackup(a, bruto, 1_700_000_000_000);
    expect(chave).not.toBeNull();
    /* o app agora salva um estado novo por cima... */
    expect(salvarEstado(a, { v: 2, xp: 0 })).toBe("ok");
    /* ...e o original continua recuperável */
    expect(a.getItem(chave ?? "")).toBe(bruto);
  });
  it("mantém só as cópias mais novas, na ordem certa", () => {
    const a = armazem();
    for (let i = 1; i <= MAX_BACKUPS + 2; i++) guardarBackup(a, `copia-${String(i)}`, i * 1000);
    const lista = listarBackups(a);
    expect(lista).toHaveLength(MAX_BACKUPS);
    expect(a.getItem(lista[0] ?? "")).toBe(`copia-${String(MAX_BACKUPS + 2)}`);
  });
});

describe("salvarEstado: falha nunca é silenciosa", () => {
  it("ok, cota e indisponível", () => {
    expect(salvarEstado(armazem(), valido)).toBe("ok");
    expect(salvarEstado(armazem(10), valido)).toBe("cota");
    expect(salvarEstado(null, valido)).toBe("indisponivel");
  });
  it("cota cheia não corrompe o que já estava salvo", () => {
    const a = armazem(400);
    expect(salvarEstado(a, { v: 2, xp: 1 })).toBe("ok");
    expect(salvarEstado(a, { v: 2, xp: 2, lixo: "x".repeat(1000) })).toBe("cota");
    expect(JSON.parse(a.getItem(CHAVE) ?? "{}")).toEqual({ v: 2, xp: 1 });
  });
});

describe("schema estrito: importação e conta", () => {
  it("aceita um progresso de verdade", () => {
    expect(validarEstado(valido)).toBe(true);
  });
  it.each([
    ["versão errada", { ...valido, v: 1 }],
    ["xp negativo", { ...valido, xp: -5 }],
    ["xp texto", { ...valido, xp: "100" }],
    ["nota com HTML", { ...valido, sims: [{ ...valido.sims[0], score: "<img src=x onerror=alert(1)>" }] }],
    ["exame com HTML", { ...valido, sims: [{ ...valido.sims[0], exam: '"><script>' }] }],
    ["data inválida", { ...valido, dates: { saa: "amanhã" } }],
    ["tema inventado", { ...valido, theme: "neon" }],
    ["não é objeto", [valido]],
  ])("recusa %s", (_, x) => {
    expect(validarEstado(x)).toBe(false);
  });
});

describe("lerImportacao (item 4 e 28)", () => {
  it("devolve o resumo para a prévia", () => {
    const r = lerImportacao(JSON.stringify(valido));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.resumo).toEqual({ xp: 120, simulados: 1, questoes: 1, atualizado: 5 });
  });
  it("recusa arquivo grande demais antes de ler", () => {
    const r = lerImportacao(" ".repeat(LIMITE_IMPORT + 1));
    expect(r).toEqual({ ok: false, erro: expect.stringContaining("grande") as string });
  });
  it("recusa JSON quebrado e forma errada com mensagens diferentes", () => {
    const a = lerImportacao("{");
    const b = lerImportacao('{"v":2}');
    expect(a.ok || b.ok).toBe(false);
    if (!a.ok && !b.ok) expect(a.erro).not.toBe(b.erro);
  });
  it("resumir tolera campos faltando", () => {
    expect(resumir({})).toEqual({ xp: 0, simulados: 0, questoes: 0, atualizado: null });
  });
});

describe("pedirPersistencia (item 40)", () => {
  it("sem a API devolve null", async () => {
    expect(await pedirPersistencia({})).toBeNull();
  });
  it("já persistido não pede de novo", async () => {
    let pedidos = 0;
    const r = await pedirPersistencia({
      storage: {
        persisted: () => Promise.resolve(true),
        persist: () => {
          pedidos++;
          return Promise.resolve(true);
        },
      },
    });
    expect(r).toBe(true);
    expect(pedidos).toBe(0);
  });
  it("erro do navegador vira false", async () => {
    expect(await pedirPersistencia({ storage: { persist: () => Promise.reject(new Error("x")) } })).toBe(false);
  });
});
