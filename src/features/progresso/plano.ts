/**
 * Plano até a prova (auditoria de QA, item 48).
 * A data já era pedida, mas só virava uma frase de ritmo. Aqui ela vira
 * metas diárias e marcos, calculados do que falta.
 *
 * Regras:
 * - os últimos 7 dias (ou menos, se a prova está perto) ficam para simulados
 *   e revisão: conteúdo novo termina antes;
 * - meta diária = o que falta dividido pelos dias de conteúdo, arredondado
 *   para cima (nunca promete terminar com meta fracionada);
 * - datas inválidas ou passadas não geram plano.
 */
import { html, type Html } from "../../lib/html";

export interface EntradaPlano {
  hoje: string; // AAAA-MM-DD, no fuso de quem estuda
  prova: string; // AAAA-MM-DD
  questoesNovas: number;
  fichasNovas: number;
  temCompleta: boolean;
}
export interface Plano {
  dias: number;
  diasConteudo: number;
  porDia: { questoes: number; fichas: number };
  marcos: { quando: string; oQue: string }[];
}

const DIA = 864e5;
const paraData = (iso: string): number | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const t = Date.parse(`${iso}T00:00:00Z`);
  return Number.isNaN(t) ? null : t;
};
const somarDias = (iso: string, n: number): string => new Date((paraData(iso) ?? 0) + n * DIA).toISOString().slice(0, 10);

export function montarPlano(e: EntradaPlano): Plano | null {
  const h = paraData(e.hoje);
  const p = paraData(e.prova);
  if (h === null || p === null) return null;
  const dias = Math.round((p - h) / DIA);
  if (dias < 1) return null;
  /* reta final: 7 dias, ou a metade do prazo quando ele é curto */
  const retaFinal = Math.min(7, Math.floor(dias / 2));
  const diasConteudo = Math.max(1, dias - retaFinal);
  const q = Math.max(0, Math.floor(e.questoesNovas));
  const f = Math.max(0, Math.floor(e.fichasNovas));
  const marcos: Plano["marcos"] = [];
  if (f + q > 0) marcos.push({ quando: somarDias(e.hoje, diasConteudo), oQue: "Terminar o conteúdo novo" });
  if (retaFinal >= 2) {
    marcos.push({
      quando: somarDias(e.prova, -retaFinal),
      oQue: e.temCompleta ? "Primeira prova completa no tempo real" : "Primeiro simulado da reta final",
    });
    marcos.push({
      quando: somarDias(e.prova, -2),
      oQue: e.temCompleta ? "Segunda prova completa e revisão do que errar" : "Último simulado e revisão",
    });
  }
  marcos.push({ quando: somarDias(e.prova, -1), oQue: "Só revisão leve; descanso" });
  return { dias, diasConteudo, porDia: { questoes: Math.ceil(q / diasConteudo), fichas: Math.ceil(f / diasConteudo) }, marcos };
}

const dataCurta = (iso: string): string => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

export function blocoPlano(p: Plano | null): Html | false {
  if (!p) return false;
  const meta =
    p.porDia.questoes + p.porDia.fichas > 0
      ? html`Por dia, até ${dataCurta(p.marcos[0]?.quando ?? "")}: <b>${p.porDia.questoes}</b> ${p.porDia.questoes === 1 ? "questão nova" : "questões novas"} e <b>${p.porDia.fichas}</b> ${p.porDia.fichas === 1 ? "ficha" : "fichas"}, além da revisão do dia.`
      : html`Conteúdo em dia. Use os dias para simulados e revisão.`;
  return html`<div class="plano" aria-label="Plano até a prova">
    <p class="t-sm">${meta}</p>
    <ol class="plano-marcos">
      ${p.marcos.map((m) => html`<li><span class="mono">${dataCurta(m.quando)}</span> ${m.oQue}</li>`)}
    </ol>
  </div>`;
}
