/** Lê content/ do disco (Node). Usado por testes e pelo build; nunca vai para o navegador. */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { RawBundle } from "./validate";

export function lerConteudo(raiz: string): RawBundle {
  const j = (rel: string): unknown => JSON.parse(readFileSync(join(raiz, rel), "utf8"));
  const porExame: RawBundle["porExame"] = {};
  for (const ex of readdirSync(join(raiz, "exams"))) {
    porExame[ex] = {
      questions: j(`exams/${ex}/questions.json`), fichas: j(`exams/${ex}/fichas.json`),
      lessons: j(`exams/${ex}/lessons.json`), decks: j(`exams/${ex}/decks.json`),
    };
  }
  const opc = (rel: string): unknown => (existsSync(join(raiz, rel)) ? j(rel) : []);
  return {
    exams: j("exams.json"), catalogo: j("catalogo.json"), equiv: j("equiv.json"), diagrams: j("diagrams.json"),
    sharedLessons: opc("shared/lessons.json"), porExame, servicos: opc("guia/servicos.json"), duelos: opc("guia/duelos.json"),
    videos: existsSync(join(raiz, "guia/videos.json")) ? j("guia/videos.json") : {},
  };
}
