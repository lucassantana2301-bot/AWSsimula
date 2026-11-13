/* Entrada do pacote de testes em JSDOM (build/all.js): liga ao conteúdo os
   mesmos módulos tipados que src/main.ts liga no app. */
import * as fsrs from "../src/features/srs/fsrs";
import { acaoDoGuia, filtrarGuia, ligarGuia, telaDoGuia } from "../src/features/guia/telas";

const C = globalThis.__CQ_CONTENT;
C.fsrs = fsrs;
C.guiaTelas = { ligar: ligarGuia, tela: (nome) => telaDoGuia(nome).texto, acao: acaoDoGuia, filtrar: filtrarGuia };
