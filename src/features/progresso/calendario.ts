/**
 * Calendário de estudo: as últimas semanas em grade (uma coluna por semana,
 * segunda a domingo), com a intensidade pela meta diária de XP.
 *
 * Cor: um matiz só, do claro ao escuro (sequencial), com 0 = sem estudo em
 * cinza. A grade é uma imagem com resumo em texto para leitor de tela; cada
 * célula tem dica com data e XP (title) para quem passa o mouse.
 */

export interface Celula {
  data: string;
  xp: number;
  /** 0 nada · 1 menos de metade da meta · 2 até a meta · 3 bateu a meta · 4 dobro da meta */
  nivel: 0 | 1 | 2 | 3 | 4;
  futuro: boolean;
}

/** Data local AAAA-MM-DD (mesma convenção do motor: fuso de quem estuda). */
export function chaveDia(d: Date): string {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 6e4);
  return z.toISOString().slice(0, 10);
}

export function nivel(xp: number, meta: number): Celula["nivel"] {
  if (!(xp > 0)) return 0;
  const m = meta > 0 ? meta : 100;
  if (xp >= 2 * m) return 4;
  if (xp >= m) return 3;
  if (xp >= m / 2) return 2;
  return 1;
}

/** Semanas completas terminando na semana de `hoje` (colunas de segunda a domingo). */
export function semanas(dias: Readonly<Record<string, number>>, meta: number, hoje: Date, n = 12): Celula[][] {
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const segunda = new Date(base);
  segunda.setDate(base.getDate() - ((base.getDay() + 6) % 7) - 7 * (n - 1));
  const hojeK = chaveDia(base);
  const out: Celula[][] = [];
  for (let s = 0; s < n; s++) {
    const col: Celula[] = [];
    for (let d = 0; d < 7; d++) {
      const dia = new Date(segunda);
      dia.setDate(segunda.getDate() + s * 7 + d);
      const k = chaveDia(dia);
      const xp = Math.max(0, Number(dias[k]) || 0);
      col.push({ data: k, xp, nivel: nivel(xp, meta), futuro: k > hojeK });
    }
    out.push(col);
  }
  return out;
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const rotulo = (k: string): string => {
  const [, m, d] = k.split("-");
  return `${String(Number(d))} ${MESES[Number(m) - 1] ?? ""}`;
};

export function blocoCalendario(dias: Readonly<Record<string, number>>, meta: number, hoje = new Date()): string {
  const grade = semanas(dias, meta, hoje);
  const passadas = grade.flat().filter((c) => !c.futuro);
  const estudados = passadas.filter((c) => c.xp > 0).length;
  const metas = passadas.filter((c) => c.nivel >= 3).length;
  const resumo = `Nas últimas ${String(grade.length)} semanas: ${String(estudados)} dias de estudo, ${String(metas)} com a meta de ${String(meta)} XP batida.`;
  const colunas = grade
    .map(
      (col) =>
        `<div class="cal-col">${col
          .map((c) =>
            c.futuro
              ? `<i class="cal-c fut"></i>`
              : `<i class="cal-c n${String(c.nivel)}" title="${rotulo(c.data)}: ${String(c.xp)} XP"></i>`,
          )
          .join("")}</div>`,
    )
    .join("");
  return `<section class="sheet stack" aria-labelledby="cal-h">
    <div class="hd"><h2 id="cal-h">Calendário de estudo</h2><span class="n">meta ${String(meta)} XP/dia</span></div>
    <div class="cal" role="img" aria-label="${resumo}">${colunas}</div>
    <div class="cal-leg" aria-hidden="true"><span>menos</span>${[0, 1, 2, 3, 4].map((n) => `<i class="cal-c n${String(n)}"></i>`).join("")}<span>mais</span></div>
    <p class="t-sm dim">${resumo}</p>
  </section>`;
}
