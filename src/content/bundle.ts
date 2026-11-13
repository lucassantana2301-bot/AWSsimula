/**
 * Monta o pacote de conteúdo que o motor recebe.
 * Fase 1: tudo em import estático (mesmo comportamento de antes).
 * Fase 2: o guia sai do pacote inicial e é baixado sob demanda (ver carregarGuia).
 * Fase 3: o banco de questões sai do JavaScript e vira JSON baixado na abertura
 * (carregarQuestoes): JSON é mais barato de interpretar que JS e fica em cache
 * separado do código, então uma mudança de código não invalida as questões.
 */
import exams from "../../content/exams.json";
import catalogo from "../../content/catalogo.json";
import equiv from "../../content/equiv.json";
import diagrams from "../../content/diagrams.json";
import shared from "../../content/shared/lessons.json";
import servicosUrl from "../../content/guia/servicos.json?url";
import duelosUrl from "../../content/guia/duelos.json?url";
import videosUrl from "../../content/guia/videos.json?url";
import type { Catalogo, Deck, Duelo, Equiv, Exam, Ficha, Lesson, Question, Servico, Videos } from "./schema";

/**
 * Fronteira de confiança: o JSON de content/ é validado pelos schemas Zod
 * em tests/unit/content.test.ts, que roda no CI e no build da Vercel.
 * Nada chega ao ar sem passar ali, então aqui o tipo é afirmado, não checado
 * (checar em tempo de execução levaria o Zod inteiro para o celular).
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- fronteira de confiança deliberada, ver acima
function validado<T>(dado: unknown): T {
  return dado as T;
}

/* import.meta.glob junta as pastas de cada prova sem listar uma a uma.
   As questões ficam de fora do JS: viram arquivos JSON com hash no nome. */
const porExame = import.meta.glob<{ default: unknown[] }>(["../../content/exams/*/*.json", "!../../content/exams/*/questions.json"], {
  eager: true,
});
const urlsQuestoes = import.meta.glob<string>("../../content/exams/*/questions.json", { eager: true, query: "?url", import: "default" });
const juntar = <T>(arquivo: string): T[] =>
  Object.entries(porExame)
    .filter(([p]) => p.endsWith(`/${arquivo}.json`))
    .flatMap(([, m]) => validado<T[]>(m.default));

export interface Guia {
  GUIA: Servico[];
  DUELOS: Duelo[];
  /** opcional: falha ao baixar os vídeos não impede o guia de abrir */
  VIDEOS: Videos;
}

/*
 * O guia (~100 KB comprimidos) sai como JSON com hash no nome e só é baixado
 * quando a aba Guia abre. Usa fetch() e não import(): o navegador guarda a
 * falha de um import() dinâmico para aquela URL, e o "Tentar de novo" nunca
 * funcionaria depois de uma queda de rede. fetch() não tem esse cache.
 */

async function baixarJson(url: string, sinal: AbortSignal): Promise<unknown> {
  const resp = await fetch(url, { signal: sinal, credentials: "same-origin" });
  if (!resp.ok) throw new Error(`Falha ao baixar ${url}: HTTP ${String(resp.status)}`);
  return resp.json() as Promise<unknown>;
}

/** Baixa o guia. Rejeita em falha de rede, HTTP != 2xx ou depois de `limiteMs`. */
export async function carregarGuia(limiteMs = 15_000): Promise<Guia> {
  const sinal = AbortSignal.timeout(limiteMs);
  const videos = baixarJson(videosUrl, sinal).catch((): unknown => ({}));
  const [servicos, duelos, vids] = await Promise.all([baixarJson(servicosUrl, sinal), baixarJson(duelosUrl, sinal), videos]);
  if (!Array.isArray(servicos) || !Array.isArray(duelos)) throw new Error("Guia em formato inesperado");
  const VIDEOS = typeof vids === "object" && vids !== null && !Array.isArray(vids) ? validado<Videos>(vids) : {};
  return { GUIA: validado<Servico[]>(servicos), DUELOS: validado<Duelo[]>(duelos), VIDEOS };
}

export interface ContentBundle {
  EXAMS: Exam[]; QUESTIONS: Question[]; FICHAS: Ficha[]; LESSONS: Lesson[]; DECKS: Deck[];
  DIAGRAMS: Record<string, string>; EQUIV: Equiv[]; GUIA: Servico[]; DUELOS: Duelo[]; catalogo: Catalogo;
  carregarGuia: () => Promise<Guia>;
}

/* ordem das provas = ordem do catálogo (a trilha e os testes dependem dela) */
const EXAMES = validado<Exam[]>(exams);
const ordem = EXAMES.map((e) => e.id);
const porOrdem = <T extends { exam: string }>(xs: T[]): T[] =>
  [...xs].sort((a, b) => ordem.indexOf(a.exam) - ordem.indexOf(b.exam));

/** Baixa as questões de todas as provas em paralelo (com timeout e checagem de HTTP). */
export async function carregarQuestoes(limiteMs = 20_000): Promise<Question[]> {
  const sinal = AbortSignal.timeout(limiteMs);
  const listas = await Promise.all(
    Object.values(urlsQuestoes).map(async (u) => {
      const dado = await baixarJson(u, sinal);
      if (!Array.isArray(dado)) throw new Error(`Questões em formato inesperado: ${u}`);
      return validado<Question[]>(dado);
    }),
  );
  return porOrdem(listas.flat());
}

export function montarConteudo(questoes: Question[]): ContentBundle {
  return {
    EXAMS: EXAMES,
    QUESTIONS: questoes,
    FICHAS: porOrdem(juntar<Ficha>("fichas")),
    LESSONS: [...porOrdem(juntar<Lesson>("lessons")), ...validado<Lesson[]>(shared)],
    DECKS: porOrdem(juntar<Deck>("decks")),
    DIAGRAMS: validado<Record<string, string>>(diagrams),
    EQUIV: validado<Equiv[]>(equiv),
    GUIA: [],
    DUELOS: [],
    catalogo: validado<Catalogo>(catalogo),
    carregarGuia,
  };
}
