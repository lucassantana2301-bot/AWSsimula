# Estratégia de testes

| Camada                         | O que garante                                                                                                                         | Comando                 | Quando roda             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------- |
| Unidade (Vitest)               | regras puras: nota, sorteio, FSRS, mescla, validação do estado, plano                                                                 | `npm run test:unit`     | todo PR                 |
| Propriedade (fast-check)       | invariantes com milhares de entradas: intervalo 1..365 dias, mescla nunca regride, cotas somam `n`, nota em 300..1000, escape de HTML | dentro de `test:unit`   | todo PR                 |
| Cobertura                      | catraca de 60% instruções / 52% ramos / 65% funções; só sobe                                                                          | `npm run test:coverage` | todo PR                 |
| Mutação (Stryker)              | os testes matam bugs de verdade nos módulos puros; falha abaixo de 60%                                                                | `npm run test:mutation` | semanal (`mutacao.yml`) |
| Legado (Node + JSDOM)          | motor antigo: fluxos, leitura segura, conteúdo                                                                                        | `npm run test:legacy`   | todo PR                 |
| Navegador (Playwright, Chrome) | layout em 4 larguras, CSP, offline, movimento, contas                                                                                 | `npm run test:browser`  | todo PR                 |
| E2E (Playwright)               | axe WCAG 2.1 AA em 10 telas × 2 temas; simulado de ponta a ponta em Chrome, Firefox e WebKit                                          | `npm run test:e2e`      | todo PR                 |
| Regressão visual               | início, prova e questão do simulado, claro e escuro                                                                                   | `npm run test:visual`   | todo PR                 |
| Dependências                   | `npm audit` de produção bloqueia o CI; Dependabot semanal                                                                             | `npm run audit:prod`    | todo PR                 |

## Regressão visual

Os instantâneos ficam em `tests/e2e/visual.spec.ts-snapshots/` e são gerados no Linux. Relógio fixo,
`Math.random` com semente e animações desligadas deixam a captura determinística; o relógio do
simulado fica mascarado. Mudou o visual de propósito: `npm run test:visual -- --update-snapshots` e
revise as imagens no diff do PR. Se o CI falhar só por diferença de renderização do Chrome, o
artefato `playwright-report` traz a imagem do CI (`*-actual.png`) para substituir a versionada.

## Firefox e WebKit

Rodam só com `PW_TODOS=1` (o CI define). Localmente: `npx playwright install firefox webkit` e
`PW_TODOS=1 npm run test:e2e`.
