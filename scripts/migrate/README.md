# Migrações (histórico)

Scripts que rodaram **uma vez** na fase 1 do ADR-0001 e ficam aqui como registro de como o código foi transformado. Não rode de novo: dependem dos arquivos `src/p*.js` e `scripts/build.mjs`, que foram removidos.

- `0001-extract-content.mjs`: avaliou o app antigo e gravou o conteúdo em `content/**/*.json`, sem os campos de execução `shuf`/`shufOrder`.
- `0001-make-legacy.mjs`: separou o HTML monolítico em `index.html`, `src/styles/app.css` e `src/legacy/engine.js`.
