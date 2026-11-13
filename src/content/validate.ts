/**
 * Validação do conteúdo inteiro: forma (schemas) + regras entre arquivos.
 * Função pura: recebe o pacote já lido e devolve a lista de problemas.
 * Usada pelo teste de conteúdo (CI) e pelo plugin de build, que barra o deploy.
 */
import type { z } from "zod";
import {
  CatalogoSchema, DeckSchema, DiagramsSchema, DueloSchema, EquivSchema, ExamSchema, FichaSchema, LessonSchema,
  QuestionSchema, ServicoSchema, VideosSchema, type Deck, type Duelo, type Exam, type Ficha, type Lesson, type Question, type Servico,
} from "./schema";

export interface ExamContent { questions: unknown; fichas: unknown; lessons: unknown; decks: unknown }
export interface RawBundle {
  exams: unknown; catalogo: unknown; equiv: unknown; diagrams: unknown; sharedLessons: unknown;
  porExame: Record<string, ExamContent>; servicos: unknown; duelos: unknown; videos: unknown;
}
export interface Problema { onde: string; msg: string }

const PALAVRA_QTD: Record<number, RegExp> = { 2: /\b(DUAS|DOIS)\b/, 3: /\b(TRÊS|TRES)\b/, 4: /\bQUATRO\b/ };

function parseLista<T>(schema: z.ZodType<T>, dado: unknown, onde: string, out: Problema[]): T[] {
  if (!Array.isArray(dado)) { out.push({ onde, msg: "deveria ser uma lista" }); return []; }
  const ok: T[] = [];
  dado.forEach((item: unknown, i) => {
    const r = schema.safeParse(item);
    const idItem = typeof item === "object" && item !== null && "id" in item ? String(item.id) : String(i);
    const rotulo = `${onde}[${idItem}]`;
    if (r.success) ok.push(r.data);
    else for (const iss of r.error.issues) out.push({ onde: rotulo + (iss.path.length ? "." + iss.path.join(".") : ""), msg: iss.message });
  });
  return ok;
}

export function validarConteudo(raw: RawBundle): Problema[] {
  const p: Problema[] = [];
  const exams: Exam[] = parseLista(ExamSchema, raw.exams, "exams", p);
  for (const [nome, schema, dado] of [["catalogo", CatalogoSchema, raw.catalogo], ["diagrams", DiagramsSchema, raw.diagrams]] as const) {
    const r = schema.safeParse(dado);
    if (!r.success) for (const iss of r.error.issues) p.push({ onde: `${nome}.${iss.path.join(".")}`, msg: iss.message });
  }
  parseLista(EquivSchema, raw.equiv, "equiv", p);
  const diagramas = new Set(typeof raw.diagrams === "object" && raw.diagrams !== null ? Object.keys(raw.diagrams) : []);
  const exameIds = new Set(exams.map((e) => e.id));
  const vistos = new Map<string, string>();
  const unico = (id: string, onde: string): void => {
    const ja = vistos.get(id);
    if (ja) p.push({ onde, msg: `id repetido (também em ${ja})` }); else vistos.set(id, onde);
  };

  const todasFichas: Ficha[] = [];
  for (const [ex, c] of Object.entries(raw.porExame)) {
    const e = exams.find((x) => x.id === ex);
    if (!e) {
      p.push({ onde: `exams/${ex}`, msg: "pasta de prova sem exame correspondente" });
      continue;
    }
    const doms = new Set(e.domains.map((d) => d.id));
    const qs: Question[] = parseLista(QuestionSchema, c.questions, `${ex}/questions`, p);
    const fs: Ficha[] = parseLista(FichaSchema, c.fichas, `${ex}/fichas`, p);
    const ls: Lesson[] = parseLista(LessonSchema, c.lessons, `${ex}/lessons`, p);
    const ds: Deck[] = parseLista(DeckSchema, c.decks, `${ex}/decks`, p);
    todasFichas.push(...fs);
    for (const x of [...qs, ...fs, ...ls, ...ds]) {
      const onde = `${ex}/${x.id}`;
      unico(x.id, onde);
      if (x.exam !== ex) p.push({ onde, msg: `exam "${x.exam}" na pasta de ${ex}` });
      if (!doms.has(x.dom)) p.push({ onde, msg: `domínio ${x.dom} não existe em ${e.code}` });
    }
    for (const q of qs) {
      if (q.type === "multi") {
        const w = PALAVRA_QTD[q.ans.length];
        if (!w || !w.test(q.stem)) p.push({ onde: `${ex}/${q.id}`, msg: `enunciado não diz quantas escolher (${q.ans.length})` });
      }
    }
    for (const l of ls) for (const s of l.slides) if (s.diagram && !diagramas.has(s.diagram)) p.push({ onde: `${ex}/${l.id}`, msg: `diagrama inexistente: ${s.diagram}` });
    /* simulado sem repetição: 1,5 questão por vaga, e cada domínio com folga */
    if (e.status === "active") {
      if (qs.length < Math.ceil(e.simQ * 1.5)) p.push({ onde: ex, msg: `${qs.length} questões para simulado de ${e.simQ}` });
      const pesos = e.domains.map((d) => parseFloat(d.w) || 25), tot = pesos.reduce((a, b) => a + b, 0);
      e.domains.forEach((d, i) => {
        const vagas = Math.round((e.simQ * (pesos[i] ?? 0)) / tot), n = qs.filter((q) => q.dom === d.id).length;
        if (n < vagas + 2) p.push({ onde: `${ex}/${d.id}`, msg: `${n} questões para ${vagas} vagas no simulado` });
      });
    }
  }
  parseLista(LessonSchema, raw.sharedLessons, "shared/lessons", p).forEach((l) => {
    unico(l.id, `shared/${l.id}`);
    for (const ex of Object.keys(l.doms ?? {})) if (!exameIds.has(ex)) p.push({ onde: `shared/${l.id}`, msg: `doms cita prova inexistente ${ex}` });
  });

  /* guia: referências cruzadas */
  const servicos: Servico[] = parseLista(ServicoSchema, raw.servicos, "guia/servicos", p);
  const duelos: Duelo[] = parseLista(DueloSchema, raw.duelos, "guia/duelos", p);
  const sids = new Set<string>();
  for (const s of servicos) { if (sids.has(s.id)) p.push({ onde: `guia/${s.id}`, msg: "serviço repetido" }); sids.add(s.id); }
  for (const s of servicos) for (const c of s.confunde)
    if (!sids.has(c.id) || c.id === s.id) p.push({ onde: `guia/${s.id}`, msg: `confunde aponta para serviço inexistente: ${c.id}` });
  for (const d of duelos) for (const c of d.cols)
    if (c.id && !sids.has(c.id)) p.push({ onde: `guia/${d.id}`, msg: `coluna aponta para serviço inexistente: ${c.id}` });

  /* vídeos: serviço existe, não está fechado, e cada vídeo aparece uma vez */
  const rv = VideosSchema.safeParse(raw.videos);
  if (!rv.success) for (const iss of rv.error.issues) p.push({ onde: "guia/videos" + (iss.path.length ? "." + iss.path.join(".") : ""), msg: iss.message });
  else {
    const porId = new Map(servicos.map((s) => [s.id, s]));
    const yts = new Set<string>();
    for (const [sid, vs] of Object.entries(rv.data)) {
      const s = porId.get(sid);
      if (!s) p.push({ onde: `guia/videos.${sid}`, msg: "vídeo para serviço inexistente" });
      else if (s.status === "fechado") p.push({ onde: `guia/videos.${sid}`, msg: "serviço fechado não deve ter vídeo" });
      for (const v of vs) { if (yts.has(v.yt)) p.push({ onde: `guia/videos.${sid}`, msg: `vídeo repetido: ${v.yt}` }); yts.add(v.yt); }
    }
  }
  return p;
}
