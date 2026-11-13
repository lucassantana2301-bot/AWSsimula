/**
 * Mapa de equivalências AWS × Azure (ADR-0001, fase 3).
 * Função pura: recebe o conteúdo validado e devolve Html escapado.
 * A conquista "bothclouds" continua no motor, que é quem guarda o estado.
 */
import type { Equiv } from "../../content/schema";
import { html, type Html } from "../../lib/html";

const AVISO =
  "Equivalente não quer dizer idêntico: limites, protocolos e garantias mudam entre as nuvens. Confirme na documentação oficial antes de assumir paridade.";

function par(x: Equiv): Html {
  return html`<div class="eq">
      <div class="s l"><b>${x.az}</b><span>${x.c}</span></div>
      <div class="mid" aria-hidden="true"></div>
      <div class="s r"><b>${x.aw}</b><span>${x.n}</span></div>
    </div>`;
}

export function telaComparar(equiv: readonly Equiv[]): Html {
  const lista =
    equiv.length > 0
      ? html`<div class="stack">${equiv.map(par)}</div>`
      : html`<div class="note">Nenhuma equivalência carregada. Recarregue a página para tentar de novo.</div>`;
  return html`<div class="stack-lg">
    <section>
      <h1 class="t-xl">O mesmo conceito nas duas nuvens</h1>
      <p class="t-md dim" style="margin-top:7px;max-width:64ch">Se você já sabe uma, aprende a outra pelo mapa. A linha menor de cada par é onde elas divergem, que é justamente o que a prova cobra.</p>
    </section>
    ${lista}
    <div class="note">${AVISO}</div>
  </div>`;
}

/** Leu ao menos uma ficha de cada nuvem? (regra da conquista "bothclouds") */
export function leuAsDuasNuvens(fichas: readonly { id: string; exam: string }[], lidas: Readonly<Record<string, unknown>>): boolean {
  const leu = (exam: string): boolean => fichas.some((f) => f.exam === exam && Boolean(lidas[f.id]));
  return leu("az900") && leu("clf");
}
