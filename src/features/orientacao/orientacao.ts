/**
 * Orientação para quem está chegando: o próximo passo, as boas-vindas, o glossário e as dicas
 * de cada tela. Tudo aqui é puro: recebe um retrato do progresso montado pelo motor e devolve
 * decisão ou HTML. Assim a regra "o que fazer agora" é testável sem DOM.
 *
 * A ordem do próximo passo segue a trilha do app:
 *   simulado em andamento → revisão vencida → ficha → aula → prática → chefe → próximo domínio
 *   → simulado (completo quando houver) → refazer erradas / adaptativo
 */
import { confiavel, escapar, html, type Html } from "../../lib/html";

/* ---------- próximo passo ---------- */

export interface ItemPendente {
  id: string;
  titulo: string;
  /** minutos (ficha) ou segundos (aula), já formatado pelo motor: "5 min", "90 s" */
  duracao: string;
}

export interface DominioRetrato {
  id: string;
  nome: string;
  aberto: boolean;
  chefeVencido: boolean;
  /** fichas obrigatórias ainda não lidas, na ordem da trilha */
  fichas: readonly ItemPendente[];
  aulas: readonly ItemPendente[];
  /** proficiência 0..1 medida nas questões do domínio */
  prof: number;
  /** quantas vezes o aluno já respondeu questões deste domínio */
  respostas: number;
}

export interface RetratoProva {
  exam: string;
  codigo: string;
  dominios: readonly DominioRetrato[];
  revisaoVencida: number;
  simEmAndamento: boolean;
  temCompleta: boolean;
  erradas: number;
  /** nota do último simulado, se houver */
  ultimoSim: number | null;
  corte: number;
}

export type TipoPasso = "retomar" | "revisar" | "ficha" | "aula" | "praticar" | "chefe" | "simulado" | "completo" | "erradas";

export interface Passo {
  tipo: TipoPasso;
  titulo: string;
  porque: string;
  botao: string;
  /** data-act e data-* do botão, no vocabulário do motor */
  acao: { act: string; dados: Readonly<Record<string, string>> };
  /** "Domínio 2 de 4 · etapa 3 de 4" quando o passo está dentro da trilha */
  onde: string | null;
  /** 0..1, fração da trilha concluída (domínios com chefe vencido) */
  progresso: number;
}

/** Prática "suficiente" para encarar o chefe: proficiência 60% com pelo menos 6 respostas. */
export const PRATICA_MINIMA = { prof: 0.6, respostas: 6 } as const;

export function proximoPasso(r: RetratoProva): Passo {
  const total = r.dominios.length;
  const vencidos = r.dominios.filter((d) => d.chefeVencido).length;
  const progresso = total ? vencidos / total : 0;
  const base = (p: Omit<Passo, "progresso">): Passo => ({ ...p, progresso });

  if (r.simEmAndamento)
    return base({
      tipo: "retomar",
      titulo: "Terminar o simulado em andamento",
      porque: "O relógio continua contando enquanto você está fora.",
      botao: "Retomar o simulado",
      acao: { act: "simresume", dados: {} },
      onde: null,
    });

  if (r.revisaoVencida > 0)
    return base({
      tipo: "revisar",
      titulo: `Revisar ${String(r.revisaoVencida)} ${r.revisaoVencida === 1 ? "conceito" : "conceitos"}`,
      porque: "Estão no ponto de esquecer. Revisar agora fixa por mais tempo e leva poucos minutos.",
      botao: "Revisar agora",
      acao: { act: "review-go", dados: {} },
      onde: null,
    });

  const i = r.dominios.findIndex((d) => d.aberto && !d.chefeVencido);
  const d = i >= 0 ? r.dominios[i] : undefined;
  if (d) {
    const onde = (etapa: number): string => `Domínio ${String(i + 1)} de ${String(total)} · etapa ${String(etapa)} de 4`;
    const ficha = d.fichas[0];
    if (ficha)
      return base({
        tipo: "ficha",
        titulo: `Ler: ${ficha.titulo}`,
        porque:
          d.fichas.length === 1
            ? `Última ficha de ${d.nome}. Depois dela a prática do domínio abre.`
            : `Faltam ${String(d.fichas.length)} fichas de ${d.nome} para a prática abrir. Esta leva ${ficha.duracao}.`,
        botao: "Ler a ficha",
        acao: { act: "ficha", dados: { ficha: ficha.id, exam: r.exam } },
        onde: onde(1),
      });
    const aula = d.aulas[0];
    if (aula)
      return base({
        tipo: "aula",
        titulo: `Ver a aula: ${aula.titulo}`,
        porque: `Uma aula curta (${aula.duracao}) que amarra o que você leu antes de praticar.`,
        botao: "Ver a aula",
        acao: { act: "aula", dados: { aula: aula.id, exam: r.exam } },
        onde: onde(2),
      });
    if (d.prof < PRATICA_MINIMA.prof || d.respostas < PRATICA_MINIMA.respostas)
      return base({
        tipo: "praticar",
        titulo: `Praticar ${d.nome}`,
        porque:
          d.respostas === 0
            ? "Seis questões escolhidas pelo app, com explicação de cada alternativa. Errar aqui não custa nada."
            : `Você está com ${String(Math.round(d.prof * 100))}% neste domínio. Com 60% o chefe fica ao seu alcance.`,
        botao: "Praticar 6 questões",
        acao: { act: "study", dados: { exam: r.exam, dom: d.id } },
        onde: onde(3),
      });
    return base({
      tipo: "chefe",
      titulo: `Enfrentar o chefe de ${d.nome}`,
      porque:
        i + 1 < total
          ? "5 questões cronometradas. Acerte 4 para abrir o próximo domínio."
          : "5 questões cronometradas. É o último: vencendo, a trilha inteira está feita.",
      botao: "Enfrentar o chefe",
      acao: { act: "boss", dados: { exam: r.exam, dom: d.id } },
      onde: onde(4),
    });
  }

  /* trilha concluída: hora de medir em condição de prova */
  if (r.ultimoSim !== null && r.ultimoSim < r.corte && r.erradas >= 3)
    return base({
      tipo: "erradas",
      titulo: "Refazer as questões que você errou",
      porque: `Seu último simulado deu ${String(r.ultimoSim)}, abaixo do corte de ${String(r.corte)}. Refazer os erros é o jeito mais rápido de subir.`,
      botao: "Refazer erradas",
      acao: { act: "simstart", dados: { exam: r.exam, modo: "erros" } },
      onde: null,
    });
  if (r.temCompleta && r.ultimoSim !== null)
    return base({
      tipo: "completo",
      titulo: `Fazer a prova completa do ${r.codigo}`,
      porque: "Mesmo número de questões e o mesmo tempo da prova real. É o melhor termômetro antes de marcar a data.",
      botao: "Começar a prova completa",
      acao: { act: "simstart", dados: { exam: r.exam, modo: "completo" } },
      onde: null,
    });
  return base({
    tipo: "simulado",
    titulo: "Fazer um simulado curto",
    porque: "Você passou pela trilha toda. O simulado mistura os domínios no peso da prova real e mostra onde ainda falta.",
    botao: "Começar o simulado",
    acao: { act: "simstart", dados: { exam: r.exam } },
    onde: null,
  });
}

/** Botão com data-act e data-* dinâmicos: nomes só [a-z], valores escapados. */
export function botaoAcao(acao: Passo["acao"], classe: string, rotulo: string): Html {
  if (!/^[a-z-]{1,24}$/.test(acao.act)) throw new Error(`ação inválida: ${acao.act}`);
  const attrs = Object.entries(acao.dados)
    .filter(([k]) => /^[a-z]{1,12}$/.test(k))
    .map(([k, v]) => ` data-${k}="${escapar(v)}"`)
    .join("");
  return confiavel(`<button class="${escapar(classe)}" data-act="${acao.act}"${attrs}>${escapar(rotulo)}</button>`);
}

export function blocoProximoPasso(p: Passo, aws: boolean, exibirProva?: string): Html {
  const pct = Math.round(p.progresso * 100);
  return html`<section class="passo ${aws ? "aw" : "az"}" aria-labelledby="passo-h">
    <div class="passo-topo">
      <span class="passo-rot">Próximo passo${exibirProva ? html` · <b class="mono">${exibirProva}</b>` : ""}</span>
      ${p.onde && html`<span class="passo-onde mono">${p.onde}</span>`}
    </div>
    <h2 class="t-lg" id="passo-h">${p.titulo}</h2>
    <p class="t-sm dim">${p.porque}</p>
    <div class="passo-pe">
      <span class="passo-trilha" role="img" aria-label="${`Trilha ${String(pct)}% concluída`}"><i style="${`width:${String(pct)}%`}"></i></span>
      ${botaoAcao(p.acao, `btn fill ${aws ? "aw" : "az"} passo-btn`, p.botao)}
    </div>
  </section>`;
}

/* ---------- boas-vindas ---------- */

export interface OpcaoProva {
  id: string;
  codigo: string;
  nome: string;
  aws: boolean;
  nivel: string;
}

/** Iniciante começa pelo fundamentos; quem já trabalha com nuvem vai direto ao associate. */
export const SUGESTAO_INICIANTE: Readonly<Record<string, string>> = {
  clf: "Nunca estudou nuvem e quer AWS",
  az900: "Nunca estudou nuvem e quer Azure",
  saa: "Já usa AWS no trabalho",
  az104: "Já administra recursos no Azure",
};

export type PassoBoasVindas = 1 | 2 | 3;

export function blocoBoasVindas(
  passo: PassoBoasVindas,
  provas: readonly OpcaoProva[],
  escolhida: string | null,
  metas: Readonly<Record<number, number>>,
): Html {
  const escolha = provas.find((p) => p.id === escolhida);
  const pontos = html`<ol class="bv-pontos" aria-label="${`Passo ${String(passo)} de 3`}">
    ${[1, 2, 3].map((n) => html`<li data-s="${n < passo ? "feito" : n === passo ? "agora" : "depois"}"></li>`)}
  </ol>`;
  const corpo =
    passo === 1
      ? html`<h2 class="t-lg" id="bv-h">Para qual prova você vai estudar?</h2>
          <p class="t-sm dim">Pode trocar quando quiser. Todas as provas continuam disponíveis no início.</p>
          <div class="bv-provas">
            ${provas.map(
              (p) => html`<button class="bv-prova ${p.aws ? "aw" : "az"}" data-act="bv-prova" data-exam="${p.id}">
                <span class="tag ${p.aws ? "aw" : "az"} mono">${p.codigo}</span>
                <b>${p.nome}</b>
                <span class="t-xs dim">${SUGESTAO_INICIANTE[p.id] ?? p.nivel}</span>
              </button>`,
            )}
          </div>`
      : passo === 2
        ? html`<h2 class="t-lg" id="bv-h">Já tem data para a prova${escolha ? html` ${escolha.codigo}` : ""}?</h2>
            <p class="t-sm dim">Com a data, o app divide o que falta em metas por dia e guarda a última semana para simulados.</p>
            <label class="bv-data"><span class="t-sm">Data da prova</span><input type="date" id="bv-data" data-act="noop" /></label>
            <div class="row" style="gap:8px">
              <button class="btn fill" data-act="bv-data">Usar esta data</button>
              <button class="btn" data-act="bv-semdata">Ainda não marquei</button>
            </div>`
        : html`<h2 class="t-lg" id="bv-h">Quanto tempo por dia?</h2>
            <p class="t-sm dim">Vira a barra fina no topo da tela. Dá para mudar no Perfil.</p>
            <div class="bv-metas">
              ${[
                [1, "Leve", "uns 10 minutos"],
                [2, "Firme", "uns 20 minutos"],
                [3, "Intenso", "30 minutos ou mais"],
              ].map(
                ([n, rot, tempo]) => html`<button class="bv-meta" data-act="bv-meta" data-v="${String(n)}">
                  <b>${String(rot)}</b><span class="t-xs dim">${String(tempo)} · ${String(metas[Number(n)] ?? 0)} XP</span>
                </button>`,
              )}
            </div>`;
  return html`<section class="sheet bv" aria-labelledby="bv-h">
    <div class="spread">${pontos}<button class="btn sm ghost" data-act="onb-pular">Já sei usar</button></div>
    ${corpo}
    ${passo > 1 && html`<button class="btn sm ghost" data-act="bv-voltar">Voltar</button>`}
  </section>`;
}

/* ---------- glossário e dicas ---------- */

export const GLOSSARIO: readonly { termo: string; explica: string }[] = [
  {
    termo: "XP",
    explica: "Pontos de estudo. Ganha ao acertar questões, ler fichas e vencer desafios. A barra fina no topo é a meta de XP do dia.",
  },
  {
    termo: "Dias",
    explica:
      "Sua ofensiva: quantos dias seguidos você estudou. A cada 7 dias você ganha um congelador, que salva a ofensiva num dia sem estudo.",
  },
  {
    termo: "Energia",
    explica: "Só é gasta quando você erra contra um chefe. Volta 1 a cada 20 minutos. Praticar e revisar nunca gastam energia.",
  },
  { termo: "Ficha", explica: "Texto curto sobre um tema do guia oficial da prova. Ler as fichas de um domínio abre a prática dele." },
  { termo: "Aula", explica: "Animação de cerca de 90 segundos que resume o domínio com um diagrama." },
  { termo: "Prática", explica: "Seis questões escolhidas pelo que você mais erra, com explicação de cada alternativa." },
  { termo: "Chefe", explica: "Prova curta e cronometrada do domínio: acerte 4 de 5 para abrir o próximo." },
  { termo: "Revisão", explica: "Repetição espaçada: o app traz de volta cada conceito perto do momento em que você o esqueceria." },
  { termo: "Prontidão", explica: "Estimativa da sua nota na prova real, de 300 a 1000. Aparece depois de 12 respostas." },
  {
    termo: "Simulado",
    explica:
      "Prova no formato real, com relógio e sem correção até entregar. A prova completa tem o mesmo número de questões e o mesmo tempo da real.",
  },
];

export function blocoGlossario(): Html {
  return html`<div class="glossario" role="dialog" aria-modal="false" aria-labelledby="gl-h" id="glossario">
    <div class="spread"><h2 class="t-md" id="gl-h">O que é cada coisa</h2><button class="btn sm ghost" data-act="glossario" aria-label="Fechar o glossário">Fechar</button></div>
    <dl>${GLOSSARIO.map((g) => html`<dt>${g.termo}</dt><dd>${g.explica}</dd>`)}</dl>
  </div>`;
}

export const DICAS: Readonly<Record<string, string>> = {
  home: "Siga o cartão “Próximo passo”: ele sempre aponta a coisa certa a fazer agora. Toque em ? no topo para ver o que é cada número.",
  exam: "A trilha anda em 4 etapas por domínio: ficha, aula, prática e chefe. Só o domínio atual fica aberto; os outros abrem um por vez.",
  trilha: "Aqui você vê o caminho de carreira: qual certificação vem depois desta, nas duas nuvens.",
  guia: "O guia explica cada serviço sem pressa de prova: para que serve, com o que confunde e quanto custa. Comece pelos que caíram nas suas questões erradas.",
  review: "Revisão é rápida e não gasta energia. Faça a do dia antes de conteúdo novo: é o que mais segura a matéria.",
  chall: "Desafios são cenários difíceis para quem já passou pela trilha. Não precisa fazer no começo.",
  me: "No Perfil ficam a meta diária, o tamanho do texto, o contraste e o backup do seu progresso.",
};

export function blocoDica(tela: string, vistas: Readonly<Record<string, unknown>>): Html | null {
  const texto = DICAS[tela];
  if (!texto || vistas[tela]) return null;
  return html`<aside class="dica" role="note">
    <p class="t-sm">${texto}</p>
    <button class="btn sm ghost" data-act="dica-ok" data-tela="${tela}">Entendi</button>
  </aside>`;
}
