import { describe, expect, it } from "vitest";
import {
  DICAS,
  GLOSSARIO,
  blocoBoasVindas,
  blocoDica,
  blocoGlossario,
  blocoProximoPasso,
  botaoAcao,
  proximoPasso,
  type DominioRetrato,
  type RetratoProva,
} from "../../src/features/orientacao/orientacao";

const dom = (id: string, p: Partial<DominioRetrato> = {}): DominioRetrato => ({
  id,
  nome: `Domínio ${id}`,
  aberto: false,
  chefeVencido: false,
  fichas: [],
  aulas: [],
  prof: 0,
  respostas: 0,
  ...p,
});
const ficha = (id: string) => ({ id, titulo: `Ficha ${id}`, duracao: "5 min" });
const retrato = (p: Partial<RetratoProva> = {}): RetratoProva => ({
  exam: "clf",
  codigo: "CLF-C02",
  dominios: [dom("d1", { aberto: true, fichas: [ficha("f1"), ficha("f2")], aulas: [ficha("a1")] }), dom("d2"), dom("d3"), dom("d4")],
  revisaoVencida: 0,
  simEmAndamento: false,
  temCompleta: true,
  erradas: 0,
  ultimoSim: null,
  corte: 700,
  ...p,
});

describe("proximoPasso", () => {
  it("aluno novo: a primeira ficha do primeiro domínio, com prova e posição", () => {
    const p = proximoPasso(retrato());
    expect(p).toMatchObject({ tipo: "ficha", onde: "Domínio 1 de 4 · etapa 1 de 4", progresso: 0 });
    expect(p.acao).toEqual({ act: "ficha", dados: { ficha: "f1", exam: "clf" } });
    expect(p.porque).toMatch(/Faltam 2 fichas/);
  });
  it("última ficha avisa que a prática abre depois", () => {
    const r = retrato({ dominios: [dom("d1", { aberto: true, fichas: [ficha("f2")] })] });
    expect(proximoPasso(r).porque).toMatch(/Última ficha/);
  });
  it("simulado em andamento vem antes de tudo; depois, revisão vencida", () => {
    expect(proximoPasso(retrato({ simEmAndamento: true, revisaoVencida: 9 })).acao.act).toBe("simresume");
    const rev = proximoPasso(retrato({ revisaoVencida: 1 }));
    expect(rev).toMatchObject({ tipo: "revisar", titulo: "Revisar 1 conceito" });
    expect(proximoPasso(retrato({ revisaoVencida: 3 })).titulo).toBe("Revisar 3 conceitos");
  });
  it("sem fichas: aula; sem aula: prática até 60% e 6 respostas; depois o chefe", () => {
    const so = (d: Partial<DominioRetrato>) => proximoPasso(retrato({ dominios: [dom("d1", { aberto: true, ...d }), dom("d2")] }));
    expect(so({ aulas: [ficha("a1")] }).acao).toEqual({ act: "aula", dados: { aula: "a1", exam: "clf" } });
    expect(so({}).tipo).toBe("praticar");
    expect(so({ prof: 0.9, respostas: 3 }).tipo).toBe("praticar");
    expect(so({ prof: 0.5, respostas: 20 }).porque).toMatch(/50%/);
    const chefe = so({ prof: 0.6, respostas: 6 });
    expect(chefe).toMatchObject({ tipo: "chefe", onde: "Domínio 1 de 2 · etapa 4 de 4" });
    expect(chefe.acao).toEqual({ act: "boss", dados: { exam: "clf", dom: "d1" } });
  });
  it("segue para o domínio aberto seguinte e mede o progresso da trilha", () => {
    const r = retrato({
      dominios: [dom("d1", { aberto: true, chefeVencido: true }), dom("d2", { aberto: true, fichas: [ficha("f9")] }), dom("d3"), dom("d4")],
    });
    const p = proximoPasso(r);
    expect(p).toMatchObject({ tipo: "ficha", onde: "Domínio 2 de 4 · etapa 1 de 4", progresso: 0.25 });
  });
  it("chefe do último domínio avisa que fecha a trilha", () => {
    const r = retrato({ dominios: [dom("d1", { aberto: true, chefeVencido: true }), dom("d2", { aberto: true, prof: 1, respostas: 10 })] });
    expect(proximoPasso(r).porque).toMatch(/último/);
  });
  it("trilha concluída: simulado curto, depois completo, refazer erradas se ficou abaixo do corte", () => {
    const feita = [dom("d1", { aberto: true, chefeVencido: true }), dom("d2", { aberto: true, chefeVencido: true })];
    const curto = proximoPasso(retrato({ dominios: feita }));
    expect(curto).toMatchObject({ tipo: "simulado", progresso: 1 });
    expect(curto.acao).toEqual({ act: "simstart", dados: { exam: "clf" } });
    expect(proximoPasso(retrato({ dominios: feita, ultimoSim: 760 })).acao.dados).toEqual({ exam: "clf", modo: "completo" });
    expect(proximoPasso(retrato({ dominios: feita, ultimoSim: 760, temCompleta: false })).tipo).toBe("simulado");
    expect(proximoPasso(retrato({ dominios: feita, ultimoSim: 610, erradas: 5 })).acao.dados).toEqual({ exam: "clf", modo: "erros" });
    expect(proximoPasso(retrato({ dominios: feita, ultimoSim: 610, erradas: 2 })).tipo).toBe("completo");
  });
  it("prova sem domínios não quebra", () => {
    expect(proximoPasso(retrato({ dominios: [] })).tipo).toBe("simulado");
  });
});

describe("HTML da orientação", () => {
  it("botaoAcao escapa valores e recusa nomes e ações fora do padrão", () => {
    const t = botaoAcao({ act: "ficha", dados: { ficha: '"><script>', Mau: "x", "x-y": "z" } }, "btn", "Ler <já>").texto;
    expect(t).toContain('data-ficha="&quot;&gt;&lt;script&gt;"');
    expect(t).not.toMatch(/data-Mau|data-x-y|<script>/);
    expect(t).toContain("Ler &lt;já&gt;");
    expect(() => botaoAcao({ act: 'x" onclick="alert(1)', dados: {} }, "btn", "x")).toThrow();
  });
  it("cartão do próximo passo: rótulo, prova, posição, barra e botão", () => {
    const t = blocoProximoPasso(proximoPasso(retrato()), true, "CLF-C02").texto;
    expect(t).toContain("Próximo passo");
    expect(t).toContain("CLF-C02");
    expect(t).toContain("Domínio 1 de 4");
    expect(t).toContain('aria-label="Trilha 0% concluída"');
    expect(t).toMatch(/class="btn fill aw passo-btn" data-act="ficha" data-ficha="f1" data-exam="clf">Ler a ficha</);
  });
  it("boas-vindas: 3 passos, com voltar a partir do segundo", () => {
    const provas = [{ id: "clf", codigo: "CLF-C02", nome: "Cloud Practitioner", aws: true, nivel: "Fundamentos" }];
    const p1 = blocoBoasVindas(1, provas, null, { 1: 50, 2: 100, 3: 150 }).texto;
    expect(p1).toContain('data-act="bv-prova" data-exam="clf"');
    expect(p1).toContain("Nunca estudou nuvem e quer AWS");
    expect(p1).not.toContain("bv-voltar");
    const p2 = blocoBoasVindas(2, provas, "clf", { 1: 50 }).texto;
    expect(p2).toContain("CLF-C02");
    expect(p2).toContain('data-act="bv-semdata"');
    expect(p2).toContain("bv-voltar");
    const p3 = blocoBoasVindas(3, provas, "clf", { 1: 50, 2: 100, 3: 150 }).texto;
    expect(p3.match(/data-act="bv-meta"/g)).toHaveLength(3);
    expect(p3).toContain("100 XP");
  });
  it("glossário cobre os números do topo e os nomes da trilha", () => {
    const termos = GLOSSARIO.map((g) => g.termo);
    for (const t of ["XP", "Dias", "Energia", "Ficha", "Aula", "Prática", "Chefe", "Revisão", "Prontidão", "Simulado"])
      expect(termos).toContain(t);
    expect(blocoGlossario().texto).toContain('id="glossario"');
  });
  it("dica aparece uma vez por tela e some depois de vista", () => {
    expect(blocoDica("home", {})?.texto).toContain('data-tela="home"');
    expect(blocoDica("home", { home: 1 })).toBeNull();
    expect(blocoDica("sim", {})).toBeNull();
    for (const tela of ["home", "exam", "trilha", "guia", "review", "chall", "me"]) expect(DICAS[tela]).toBeTruthy();
  });
});
