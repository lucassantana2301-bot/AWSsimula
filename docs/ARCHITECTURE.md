# Arquitetura do CloudQuest

Visão de quem chega ao código. As decisões e seus porquês estão em [`docs/adr/`](adr/).

## Mapa

```
content/                  conteúdo como dado (fonte única), validado por schema
  exams.json              provas, domínios e pesos
  catalogo.json           29 certificações, metas de carreira, provedores
  exams/<prova>/          questions, fichas, lessons, decks de cada prova
  shared/lessons.json     aulas que valem para mais de uma prova
  guia/                   guia de serviços AWS (servicos.json, duelos.json)
  diagrams.json, equiv.json
src/
  main.ts                 ponto de entrada: monta o conteúdo e inicia o motor
  content/
    schema.ts             schemas Zod: a forma de cada dado e os tipos TS
    validate.ts           regras entre arquivos (ids, domínios, banco suficiente)
    bundle.ts             monta o pacote de conteúdo entregue ao app
    read-disk.ts          leitura do disco para testes e build (Node)
  legacy/engine.js        motor anterior à reengenharia (sai aos poucos, fase 3)
  styles/app.css
tests/
  unit/                   Vitest: conteúdo e, a cada fase, os módulos extraídos
  test-*.js               suítes legadas (lógica, DOM em JSDOM, guia)
  browser/                Chrome real: layout, acessibilidade, CSP, movimento
scripts/                  build de teste, servidor dos testes de navegador, orçamento
docs/                     ADRs e esta página
```

## Fluxo de dados

1. `content/*.json` é a fonte. Ninguém escreve conteúdo em código.
2. No CI e no build da Vercel, `tests/unit/content.test.ts` valida tudo com `schema.ts` + `validate.ts`. Conteúdo inválido não chega ao ar.
3. Em tempo de execução, `bundle.ts` monta o pacote (sem Zod no celular) e `main.ts` o entrega ao motor.

## Garantias automáticas

| O quê                                                                           | Onde                   |
| ------------------------------------------------------------------------------- | ---------------------- |
| Tipos estritos                                                                  | `npm run typecheck`    |
| Lint estrito (typescript-eslint)                                                | `npm run lint`         |
| Forma e coerência do conteúdo                                                   | `npm run test:unit`    |
| Lógica, fluxos e guia                                                           | `npm run test:legacy`  |
| Layout em 4 larguras, acessibilidade em 10 telas e 2 temas, CSP real, movimento | `npm run test:browser` |
| Carga inicial dentro do orçamento                                               | `npm run size`         |

Tudo junto: `npm run verify`. O CI (`.github/workflows/ci.yml`) roda isso em cada push e pull request.

## Segurança

- CSP sem `'unsafe-inline'` para scripts; nada de origem externa.
- Diagramas SVG validados sem `<script>`, handlers `on*` nem `javascript:`.
- Estado interno não é global; inspeção para testes só com `?cq-test` na URL.

## Como acrescentar conteúdo

Edite o JSON em `content/`, rode `npm run test:unit` e corrija o que o schema apontar. A mensagem diz arquivo, item e campo.

## Vídeos do guia (`src/features/guia/videos.ts`)

Primeiro módulo fora do motor legado. O motor só chama `C.blocoVideos(id)`.

- **Conteúdo**: `content/guia/videos.json`, `{ idDoServiço: Video[] }`, com no máximo 2 vídeos e o português antes do inglês.
  - Só vale canal oficial da AWS, conferido pelo oEmbed do YouTube.
  - `min` só existe se a duração foi conferida; a tela nunca mostra estimativa.
  - O CI barra: serviço inexistente, serviço fechado com vídeo, vídeo repetido, id inválido, canal fora da lista e ordem errada.
- **Privacidade**: nada do YouTube carrega até o toque. O cartão é próprio, sem miniatura externa.
  - O toque cria o iframe pela API do DOM, em `youtube-nocookie.com`, o único domínio liberado em `frame-src`.
- **Falha**: se `videos.json` não baixar, o guia abre do mesmo jeito, só sem a seção.
