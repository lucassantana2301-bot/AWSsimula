/**
 * Monta o pacote de conteúdo que o motor recebe.
 * Fase 1: tudo em import estático (mesmo comportamento de antes).
 * Fase 2 troca por import() por prova, sem mudar a forma do pacote.
 */
import exams from "../../content/exams.json";
import catalogo from "../../content/catalogo.json";
import equiv from "../../content/equiv.json";
import diagrams from "../../content/diagrams.json";
import shared from "../../content/shared/lessons.json";
import servicos from "../../content/guia/servicos.json";
import duelos from "../../content/guia/duelos.json";
import type { Catalogo, Deck, Duelo, Equiv, Exam, Ficha, Lesson, Question, Servico } from "./schema";

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

/* import.meta.glob junta as pastas de cada prova sem listar uma a uma */
const porExame = import.meta.glob<{ default: unknown[] }>("../../content/exams/*/*.json", { eager: true });
const juntar = <T>(arquivo: string): T[] =>
  Object.entries(porExame)
    .filter(([p]) => p.endsWith(`/${arquivo}.json`))
    .flatMap(([, m]) => validado<T[]>(m.default));

export interface ContentBundle {
  EXAMS: Exam[]; QUESTIONS: Question[]; FICHAS: Ficha[]; LESSONS: Lesson[]; DECKS: Deck[];
  DIAGRAMS: Record<string, string>; EQUIV: Equiv[]; GUIA: Servico[]; DUELOS: Duelo[]; catalogo: Catalogo;
}

/* ordem das provas = ordem do catálogo (a trilha e os testes dependem dela) */
const EXAMES = validado<Exam[]>(exams);
const ordem = EXAMES.map((e) => e.id);
const porOrdem = <T extends { exam: string }>(xs: T[]): T[] =>
  [...xs].sort((a, b) => ordem.indexOf(a.exam) - ordem.indexOf(b.exam));

export function montarConteudo(): ContentBundle {
  return {
    EXAMS: EXAMES,
    QUESTIONS: porOrdem(juntar<Question>("questions")),
    FICHAS: porOrdem(juntar<Ficha>("fichas")),
    LESSONS: [...porOrdem(juntar<Lesson>("lessons")), ...validado<Lesson[]>(shared)],
    DECKS: porOrdem(juntar<Deck>("decks")),
    DIAGRAMS: validado<Record<string, string>>(diagrams),
    EQUIV: validado<Equiv[]>(equiv),
    GUIA: validado<Servico[]>(servicos),
    DUELOS: validado<Duelo[]>(duelos),
    catalogo: validado<Catalogo>(catalogo),
  };
}
