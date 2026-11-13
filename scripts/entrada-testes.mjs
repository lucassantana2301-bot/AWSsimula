/* Entrada do pacote de testes em JSDOM (build/all.js): liga ao conteúdo os
   mesmos módulos tipados que src/main.ts liga no app. */
import * as fsrs from "../src/features/srs/fsrs";
import {
  blocoReportar,
  completaDisponivel,
  contaParaProntidao,
  errosDoBanco,
  especCompleta,
  minutosProporcionais,
  montarErros,
  montarAdaptativo,
  montarPorDominio,
  montarSimulado,
  motivoValido,
  notaEscalonada,
  rotuloModo,
  telaRevisao,
} from "../src/features/simulado/simulado";
import {
  LIMITE_IMPORT,
  guardarBackup,
  interpretar,
  lerImportacao,
  listarBackups,
  salvarEstado,
  validarEstado,
} from "../src/features/progresso/armazenamento";
import { mesclar } from "../src/features/conta/mesclar";
import { blocoPlano, montarPlano } from "../src/features/progresso/plano";
import { leuAsDuasNuvens, telaComparar } from "../src/features/comparar/comparar";
import { blocoBoasVindas, blocoDica, blocoGlossario, blocoProximoPasso, proximoPasso } from "../src/features/orientacao/orientacao";
import { acaoDoGuia, filtrarGuia, ligarGuia, telaDoGuia } from "../src/features/guia/telas";

const C = globalThis.__CQ_CONTENT;
C.fsrs = fsrs;
C.guiaTelas = { ligar: ligarGuia, tela: (nome) => telaDoGuia(nome).texto, acao: acaoDoGuia, filtrar: filtrarGuia };
C.comparar = { tela: (equiv) => telaComparar(equiv).texto, leuAsDuasNuvens };
C.simulado = {
  montar: montarSimulado,
  montarPorDominio,
  montarAdaptativo,
  montarErros,
  erros: errosDoBanco,
  minutos: minutosProporcionais,
  especCompleta,
  completaDisponivel,
  nota: notaEscalonada,
  rotulo: rotuloModo,
  contaParaProntidao,
  motivoValido,
  revisao: (r) => telaRevisao(r).texto,
  reportar: (id, ja) => blocoReportar(id, ja).texto,
};
C.progresso = {
  interpretar,
  guardarBackup,
  backups: listarBackups,
  salvar: salvarEstado,
  valido: validarEstado,
  lerImportacao,
  LIMITE_IMPORT,
  mesclar,
  persistir: () => {
    /* sem navegador nos testes de JSDOM */
  },
};
C.orientacao = {
  passo: (r, aws, prova) => {
    const p = proximoPasso(r);
    return { tipo: p.tipo, html: blocoProximoPasso(p, aws, prova).texto };
  },
  boasVindas: (passo, provas, escolhida, metas) => blocoBoasVindas(passo, provas, escolhida, metas).texto,
  glossario: () => blocoGlossario().texto,
  dica: (tela, vistas) => blocoDica(tela, vistas)?.texto ?? "",
};
C.plano = (e) => {
  const b = blocoPlano(montarPlano(e));
  return b ? b.texto : "";
};
