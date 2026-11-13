/**
 * Schemas do conteúdo (ADR-0001). Fonte única da forma de cada dado:
 * o build e o CI rejeitam JSON que não bate, e os tipos TS saem daqui.
 *
 * Regras de forma ficam aqui. Regras entre arquivos (ids que precisam
 * existir, distribuição por domínio, banco suficiente para o simulado)
 * ficam em `validate.ts`, porque dependem de mais de um arquivo.
 */
import { z } from "zod";

const texto = (min = 1) => z.string().trim().min(min);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id em kebab-case");
const diagramaId = z.string().regex(/^[a-zA-Z][a-zA-Z0-9]*$/, "nome de diagrama em camelCase");
const fonte = z.object({ t: texto(3), u: z.string().regex(/^https:\/\/\S+$/, "fonte precisa ser https") });
const fontes = z.array(fonte).min(1);

/* ---------- exames e catálogo ---------- */
export const DomainSchema = z.object({ id: z.string().regex(/^d\d$/), name: texto(3), w: texto(1) });
export const ExamSchema = z.object({
  id, provider: z.enum(["azure", "aws"]), code: texto(3), version: texto(1), name: texto(3), level: texto(3),
  status: z.enum(["active", "soon", "retired"]), pass: z.number().int().positive(), scale: z.number().int().positive(),
  simQ: z.number().int().positive(), simMin: z.number().int().positive(), realQ: texto(1),
  realMin: z.number().int().positive(),
  /* prova com faixa ("40-60"): quantidade fixa da prova completa do app */
  fullQ: z.number().int().positive().optional(), price: texto(1), note: texto(1), domains: z.array(DomainSchema).min(2),
});
export const CertSchema = z.object({
  id, prov: z.enum(["azure", "aws"]), code: texto(2), nome: texto(3), nivel: texto(3), foco: texto(3), horas: texto(1),
  preco: texto(1), validade: texto(1), prereq: z.array(z.string()), status: texto(2), conteudo: z.boolean(), nota: texto(1).optional(),
});
export const MetaSchema = z.object({ id, nome: texto(3), icone: texto(1), desc: texto(10), azure: z.array(z.string()), aws: z.array(z.string()), nota: texto(5) });
export const ProviderSchema = z.object({ id: z.enum(["azure", "aws"]), name: texto(3), short: texto(2), cls: texto(2), icon: texto(1) });
export const CatalogoSchema = z.object({
  synced: texto(4), providers: z.object({ azure: ProviderSchema, aws: ProviderSchema }),
  metas: z.array(MetaSchema), certs: z.array(CertSchema).min(1),
});
export const EquivSchema = z.object({ c: texto(3), az: texto(2), aw: texto(2), n: texto(3) });
/* diagramas são SVG estático de autoria própria, sem script nem handler */
export const DiagramsSchema = z.record(
  diagramaId,
  z.string().startsWith("<svg").refine((s) => !/<script|on[a-z]+\s*=|javascript:/i.test(s), "diagrama com script ou handler"),
);

/* ---------- questões ---------- */
const base = {
  id: z.string().regex(/^[a-z0-9]+-d\d-\d{2}$/, "id no padrão <prefixo>-dN-NN"),
  exam: id, dom: z.string().regex(/^d\d$/), lvl: z.number().int().min(1).max(5), sec: z.number().int().min(30).max(240),
  tags: z.array(id).min(1), case: texto(40).optional(), stem: texto(15), src: fontes,
};
const opcao = z.object({ k: z.string().regex(/^[A-F]$/), t: texto(1) });
const escolha = z.object({
  ...base, opts: z.array(opcao).min(3), ans: z.array(z.string().regex(/^[A-F]$/)).min(1),
  why: z.record(z.string(), texto(10)),
});
export const QuestionSchema = z.discriminatedUnion("type", [
  escolha.extend({ type: z.literal("single") }),
  escolha.extend({ type: z.literal("multi") }),
  z.object({ ...base, type: z.literal("yn"), rows: z.array(z.object({ t: texto(15), a: z.boolean(), e: texto(15) })).min(3) }),
  z.object({ ...base, type: z.literal("order"), items: z.array(z.object({ t: texto(1) })).min(3), e: texto(60) }),
]).superRefine((q, ctx) => {
  if (q.type !== "single" && q.type !== "multi") return;
  const ks = q.opts.map((o) => o.k);
  if (new Set(ks).size !== ks.length) ctx.addIssue({ code: "custom", message: "letra de opção repetida" });
  if (new Set(q.opts.map((o) => o.t.trim().toLowerCase())).size !== ks.length) ctx.addIssue({ code: "custom", message: "texto de opção repetido" });
  for (const a of q.ans) if (!ks.includes(a)) ctx.addIssue({ code: "custom", message: `gabarito aponta para opção inexistente ${a}` });
  if (q.type === "single" && q.ans.length !== 1) ctx.addIssue({ code: "custom", message: "single com mais de uma resposta" });
  if (q.type === "multi" && (q.ans.length < 2 || q.ans.length >= ks.length)) ctx.addIssue({ code: "custom", message: "multi com quantidade de respostas inválida" });
  if (!q.why["ok"]) ctx.addIssue({ code: "custom", message: "falta why.ok" });
  for (const k of ks) if (!q.ans.includes(k) && !q.why[k]) ctx.addIssue({ code: "custom", message: `distrator ${k} sem explicação` });
  for (const k of Object.keys(q.why)) if (k !== "ok" && (!ks.includes(k) || q.ans.includes(k))) ctx.addIssue({ code: "custom", message: `why com chave inválida ${k}` });
});

/* ---------- fichas ---------- */
/* o canto superior esquerdo de uma tabela comparativa pode ficar vazio */
const tabela = { head: z.array(z.string()).min(2).refine((h) => h.filter((c) => c.trim()).length >= h.length - 1, "cabeçalho com mais de uma célula vazia"), rows: z.array(z.array(texto(1))).min(1) };
export const BlockSchema = z.discriminatedUnion("t", [
  z.object({ t: z.literal("h"), x: texto(2) }),
  z.object({ t: z.literal("p"), x: texto(20) }),
  z.object({ t: z.literal("ul"), x: z.array(texto(2)).min(1) }),
  z.object({ t: z.literal("table"), ...tabela }),
  z.object({ t: z.literal("signal"), ...tabela }),
  z.object({ t: z.literal("trap"), x: texto(30) }),
  z.object({ t: z.literal("case"), q: texto(15), a: texto(30) }),
]).superRefine((b, ctx) => {
  if ((b.t === "table" || b.t === "signal") && b.rows.some((r) => r.length !== b.head.length))
    ctx.addIssue({ code: "custom", message: "linha de tabela com número de células diferente do cabeçalho" });
});
export const FichaSchema = z.object({
  id, exam: id, dom: z.string().regex(/^d\d$/), mins: z.number().int().min(2).max(15), concept: id,
  title: texto(5), lead: texto(40), blocks: z.array(BlockSchema).min(3), check: z.array(texto(5)).min(1), src: fontes,
  extra: z.boolean().optional(),
});

/* ---------- aulas ---------- */
export const SlideSchema = z.object({
  k: z.enum(["gancho", "analogia", "diagrama", "pegadinha", "quiz"]),
  emoji: texto(1).optional(), h: texto(3).optional(), p: texto(10).optional(), diagram: diagramaId.optional(), gotcha: texto(10).optional(),
});
export const LessonSchema = z.object({
  id, exam: id, dom: z.string().regex(/^d\d$/), concept: id, secs: z.number().int().min(20).max(300), title: texto(5),
  slides: z.array(SlideSchema).min(3),
  quiz: z.array(z.object({ q: texto(10), a: z.array(texto(1)).min(2), c: z.number().int().min(0), e: texto(10) })).min(1),
  doms: z.record(id, z.string().regex(/^d\d$/)).optional(),
}).superRefine((l, ctx) => {
  l.quiz.forEach((q, i) => { if (q.c >= q.a.length) ctx.addIssue({ code: "custom", message: `quiz ${i + 1}: resposta fora das alternativas` }); });
});

/* ---------- baralhos ---------- */
export const DeckSchema = z.object({
  id: z.string().regex(/^dk-[a-z0-9-]+$/), exam: id, dom: z.string().regex(/^d\d$/), concept: id, title: texto(5), prompt: texto(15),
  buckets: z.array(z.object({ k: z.string().min(1), label: texto(2) })).min(2).max(4),
  items: z.array(z.object({ t: texto(5), k: z.string().min(1), e: texto(15) })).min(6),
  src: fontes.optional(),
}).superRefine((d, ctx) => {
  const ks = new Set(d.buckets.map((b) => b.k));
  for (const it of d.items) if (!ks.has(it.k)) ctx.addIssue({ code: "custom", message: `item em categoria inexistente: ${it.t}` });
});

/* ---------- guia de serviços ---------- */
const CATS = ["computacao", "conteineres", "integracao", "armazenamento", "banco", "migracao", "rede", "seguranca", "gestao", "custo", "dados", "ia", "usuario"] as const;
const provas = z.array(z.enum(["clf", "saa"])).min(1);
export const ServicoSchema = z.object({
  id, nome: texto(3), cat: z.enum(CATS), provas, status: z.enum(["ativo", "fechado", "descontinuado"]), statusNota: texto(20).optional(),
  uma: texto(20), analogia: texto(20), explica: texto(60), usa: z.array(texto(8)).min(2), nao: z.array(texto(8)).min(1),
  confunde: z.array(z.object({ id, dif: texto(15) })).min(1), chave: z.array(texto(2)).min(2), preco: texto(10), src: fontes,
}).refine((s) => s.status === "ativo" || !!s.statusNota, "serviço fechado precisa de statusNota");
export const DueloSchema = z.object({
  id: z.string().regex(/^dl-[a-z0-9-]+$/), titulo: texto(5), cat: z.enum(CATS), provas, intro: texto(40),
  cols: z.array(z.object({ rot: texto(2), id: id.optional() })).min(2).max(4),
  linhas: z.array(z.object({ c: texto(2), v: z.array(texto(1)) })).min(3),
  sinais: z.array(z.object({ s: texto(8), r: z.number().int().min(0) })).min(3),
  analogia: texto(20), pegadinha: texto(40), src: fontes,
}).superRefine((d, ctx) => {
  const n = d.cols.length;
  for (const l of d.linhas) if (l.v.length !== n) ctx.addIssue({ code: "custom", message: `linha '${l.c}' com ${l.v.length} células para ${n} colunas` });
  for (const s of d.sinais) if (s.r >= n) ctx.addIssue({ code: "custom", message: `sinal aponta para coluna inexistente: ${s.s}` });
  if (new Set(d.sinais.map((s) => s.r)).size !== n) ctx.addIssue({ code: "custom", message: "sinais não cobrem todas as colunas" });
});

/* ---------- vídeos curtos por serviço ----------
 * Só canais oficiais da AWS, conferidos pelo oEmbed do YouTube.
 * `min` só existe quando a duração foi conferida: a tela nunca mostra
 * estimativa como fato. Português vem antes do inglês. */
export const CANAIS_OFICIAIS = ["Amazon Web Services", "AWS Developers", "AWS Developers LATAM"] as const;
export const VideoSchema = z.object({
  yt: z.string().regex(/^[A-Za-z0-9_-]{11}$/, "id do YouTube deve ter 11 caracteres"),
  titulo: texto(5), canal: z.enum(CANAIS_OFICIAIS), lang: z.enum(["pt", "en"]),
  min: z.number().int().min(1).max(6).optional(),
}).strict();
export const VideosSchema = z.record(id, z.array(VideoSchema).min(1).max(2)).superRefine((m, ctx) => {
  for (const [sid, vs] of Object.entries(m)) {
    const primeiroEn = vs.findIndex((v) => v.lang === "en");
    if (primeiroEn !== -1 && vs.slice(primeiroEn).some((v) => v.lang === "pt"))
      ctx.addIssue({ code: "custom", path: [sid], message: "vídeo em português deve vir antes do inglês" });
  }
});

export type Exam = z.infer<typeof ExamSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Ficha = z.infer<typeof FichaSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Deck = z.infer<typeof DeckSchema>;
export type Servico = z.infer<typeof ServicoSchema>;
export type Duelo = z.infer<typeof DueloSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type Videos = z.infer<typeof VideosSchema>;
export type Catalogo = z.infer<typeof CatalogoSchema>;
export type Equiv = z.infer<typeof EquivSchema>;
